import React, { useState, useEffect } from "react";

import {
  Form,
  Button,
  Table
} from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range";
import VisGraph from "./VisGraph";

import { getAllStudentsData, fetchStudentData } from "../services/studentData";
import { updateLocalState, useMessageDispatch, useMessageState } from "../contexts/MessageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";

import { OPTIONS_MAP } from "../helper/constants";


const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState(null);

  const [studentList, setStudentList] = useState([]);

  const [displayData, setDisplayData] = useState([]);
  const [expectedGrade, setExpectedGrade] = useState(1);

  const relativeTimescaleOptions = [true, false];
  const [relativeTimescale, setRelativeTimescale] = useState(false);

  const DEFAULT_PULSE_RATIO = 1.5
  const [pulseRatio, setPulseRatio] = useState(DEFAULT_PULSE_RATIO);

  const [numberOfWeeks, setNumberOfweeks] = useState(0);
  const [displayedWeek, setDisplayedWeek] = useState([1, numberOfWeeks]);

  const grades = [0, 1, 2, 3, 4, 5];


  ///test
  const init = {
    type: "Points",
    value: "absolute",
    direction: "up",
    shape: "triangle",
    color: "#000000",
    colorFilled: "#ffffff",
    resetZero: "yes",
    scaleFactor: 1,
};
  const [configs, setConfigs] = useState([init]);
  // little hard code
  const maxlength = 98;

  useEffect(() => {
    const newClient = MQTTConnect(dispatch).then( client => {
      setClient(client);
      return client;
    });
    // return;
    return () => newClient.end();
  }, []);

  useEffect(() => {
    getAllStudentsData().then(list => setStudentList(list));
  }, []);

  useEffect(() => {
    updateLocalState(dispatch, {
      timescale: {
        start: 0,
        end: maxlength-1,
      },
      instances: [],
    });
  }, []);

  useEffect(() => {
    if (!state.instances.length)
    {
      return;
    }
    fetchStudentData(state.instances[0], expectedGrade)
    .then(data => {
      setDisplayData(data);
      setNumberOfweeks(data.length);
      setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7) + 1]);
    });
  }, [state.instances, expectedGrade]);

  return (
    <div className="container-body">
        <DropdownMenu
          options={studentList}
          selectedOption={ state.instances.length ? state.instances[0] : null }
          handleClick={ instance => updateLocalState(dispatch, {
            instances:  [instance],
          })}
          title="Student ID:"
          selectAllOption={false}
        />

        <div className="config-board">
          <ConfigDialog
          title={{
            button: "Show view configuration",
            dialog: "Modify show configuration",
            confirm: "OK",
          }}>
            <DropdownMenu
              options={grades}
              selectedOption={expectedGrade}
              handleClick={ grade => setExpectedGrade(grade)}
              title="Select expected grade level"
              selectAllOption={false}
            />
            <DropdownMenu
              options={relativeTimescaleOptions.map(e => JSON.stringify(e))}
              selectedOption={JSON.stringify(relativeTimescale)}
              handleClick={ option => setRelativeTimescale(option === "true")}
              title="Select compress graph option"
              selectAllOption={false}
            />
            <div className="ratio-form">
              <Form.Label>Pulse ratio</Form.Label>
              <span>
                <Form.Control
                  type="number"
                  value={pulseRatio}
                  onChange={(event) => {
                    if (isNaN(parseFloat(event.target.value)))
                    {
                      return;
                    }
                    setPulseRatio(parseFloat(event.target.value));
                  }}
                  style={{ margin:  "10px", width: "30%",}}
                />
              </span>
            </div>
            <Form.Label>Configs:</Form.Label>
            <Table bordered>
              <thead>
                <tr>
                  {Object.keys(init).map(selection => <th>{selection}</th>)}
                  <th></th>
                </tr>
              </thead>

              <tbody>
              {configs.map((config, index) => (
                <tr>
                {Object.keys(config).map(selection => (
                  <td>
                    {selection.startsWith("scale")
                      ? <Form.Control
                          name={selection}
                          key={`form-${index}-${selection}`} 
                          type="number"
                          value={parseFloat(config[selection])}
                          onChange={(event) => {
                            console.log(event.target)
                            if (isNaN(parseFloat(event.target.value)))
                            {
                              return;
                            }
                            const newConfigs = [...configs];
                            newConfigs[index][event.target.name] = parseFloat(event.target.value);
                            setConfigs(newConfigs);
                          }}
                        />
                      : <select
                          name={selection}
                          onChange={ (event) => {
                            const newConfigs = [...configs];
                            newConfigs[index][event.target.name] = event.target.value;
                            setConfigs(newConfigs);
                          }}
                          style={ selection.startsWith("color") ? { background: config[selection], color: "white" } : null}
                        >
                          {OPTIONS_MAP[selection].map(choosable => (
                            <option
                              key={choosable}
                              value={choosable}
                              style={ selection.startsWith("color") ? { background: choosable, color: "white" } : null}
                            >
                              {choosable}
                            </option>
                          ))}
                        </select>
                      }
                    </td>
                  ))}
                    <td>
                    <Button
                      variant="outline-danger"
                      size="md"
                      onClick={() => {
                        const newConfigs = [...configs];
                        newConfigs.splice(index, 1);
                        setConfigs(newConfigs);
                      }}
                    >
                      x
                    </Button>
                    </td>
                </tr>
              ))}
              </tbody>
            </Table>
            <Button
              variant="outline-success"
              size="lg"
              onClick={() => {
                const newConfigs = [...configs];
                newConfigs.push(init);
                setConfigs(newConfigs);
              }}
            >
              +
            </Button>
          </ConfigDialog>

        </div>
        <div>
          <VisGraph data={displayData} configs={configs} displayedWeek={displayedWeek} compress={relativeTimescale} pulseRatio={pulseRatio} />
        </div>
        {
          state && state.instances && state.instances[0] && state.timescale &&
          <>
            <div className="timescale-slider">
              <Form.Label id="range-slider">
                Week range
              </Form.Label>
              <TwoThumbInputRange
                values={displayedWeek}
                min={1}
                max={15}
                onChange={(newValue) => {
                  setDisplayedWeek(newValue.sort((a,b) => a-b));
                  updateLocalState(dispatch, {
                    timescale: {
                      start: (newValue[0] - 1) * 7,
                      end: (newValue[1] - 1) * 7 -1
                    }
                  });
                }}
              />
            </div>
            <button
              onClick={() => {
                // state condition comes here
                if (client
                  && state.timescale.start <= state.timescale.end) {
                  publishMessage(client, {
                    timescale: state.timescale,
                    instances: state.instances,
                  });
                }
              }}
            >
              Sync
            </button>
          </>
        }
    </div>
  );
};


export default EKGTab;

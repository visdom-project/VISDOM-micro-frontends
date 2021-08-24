import React, { useState, useEffect } from "react";
import { Form} from "react-bootstrap";
import { TwoThumbInputRange } from "react-two-thumb-input-range"
import VisGraph from "./VisGraph";

import { getAllStudentsData, fetchStudentData } from "../services/studentData";
import { updateLocalState, useMessageDispatch, useMessageState } from "../contexts/MessageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";


import ConfigurableFieldSelector from "./ConfigurableFieldSelector";


const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState(null);

  const [studentList, setStudentList] = useState([]);

  const [displayData, setDisplayData] = useState([]);
  // const [expectedGrade, setExpectedGrade] = useState(1);

  const [numberOfWeeks, setNumberOfweeks] = useState(0);
  const [displayedWeek, setDisplayedWeek] = useState([1, 0]);

  const selectableFields = [
    "Attemped exercises",
    "NO submissions",
    "NO commits",
    "Points",
    "p/maxp ratio",
];
  const [configs, setConfigs] = useState(selectableFields);


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
    fetchStudentData(state.instances[0])
    .then(data => {
      setDisplayData(data);
      setNumberOfweeks(data.length);
      setDisplayedWeek([Math.floor(state.timescale.start / 7) + 1, Math.ceil(state.timescale.end / 7) + 1]);
    });
  }, [state.instances]);

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
            <Form.Label>Configs:</Form.Label>
            <ConfigurableFieldSelector
              selected={configs}
              setSelected={setConfigs}
              allSelections={selectableFields}
            />
          </ConfigDialog>
        </div>

        <div>
          <VisGraph data={displayData} displayedWeek={displayedWeek} configs={configs}/>
        </div>
        {
          state && state.instances && state.instances[0] && state.timescale &&
          <>
            <div className="timescale-slider" style={{ width: "400px", paddingLeft: "100px" }}>
              <Form.Label id="range-slider">
                Week range
              </Form.Label>
              <TwoThumbInputRange
                values={displayedWeek}
                min={1}
                max={15}
                onChange={newValue => {
                  console.log("p",newValue.sort( (a, b) => a-b))
                  const val = newValue.sort( (a, b) => a-b);
                  setDisplayedWeek(val)
                  updateLocalState(dispatch, {
                    timescale: {
                      start: (val[0] - 1) * 7,
                      end: (val[1] - 1) * 7 -1
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

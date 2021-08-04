import React, { useState, useEffect } from "react";

import { Grid, Typography, Select, MenuItem, FormControl, InputLabel, Button, Slider, TextField } from "@material-ui/core";
import VisGraph from "./VisGraph";

import { getAllStudentsData, fetchStudentData } from "../services/studentData";
import { updateLocalState, useMessageDispatch, useMessageState } from "../contexts/MessageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import DropdownMenu from "./DropdownMenu";
import ConfigDialog from "./ConfigDialog";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

import { OPTIONS_MAP } from "../helper/constants";


const EKGTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState(null);

  const [studentList, setStudentList] = useState([]);

  const [displayData, setDisplayData] = useState([]);
  const [expectedGrade, setExpectedGrade] = useState(1);

  const [numberOfWeeks, setNumberOfweeks] = useState(0);
  const [displayedWeek, setDisplayedWeek] = useState([1, 0]);

  const grades = [0, 1, 2, 3, 4, 5];


  ///test
  const init = {
    type: "Passed",
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
            <Grid item>
              <Typography>Configs:</Typography>
            </Grid>
            {
              configs.map( (config, index) => {
                return (
                  <Grid item key={`config-${index}`}>
                    {Object.keys(config).map( selection => {
                      if (selection.startsWith("scale")){
                        return (
                          <FormControl
                          key={`form-${index}-${selection}`}
                          style={{
                            margin:  "10px",
                            minWidth: "100px",
                          }}>
                            <TextField
                            name={selection}
                            type="number"
                            value={parseFloat(config[selection])}
                            label={selection}
                            onChange={(event) => {
                                if (isNaN(parseFloat(event.target.value)))
                                {
                                  return;
                                }
                                const newConfigs = [...configs];
                                newConfigs[index][event.target.name] = parseFloat(event.target.value);
                                setConfigs(newConfigs);
                              }}/>
                          </FormControl>
                        );
                      }

                      return (
                        <FormControl
                          key={`form-${index}-${selection}`}
                          style={{
                            margin:  "10px",
                            minWidth: "100px",
                          }}
                        >
                          <InputLabel>{selection}</InputLabel>
                            <Select
                              style={ selection.startsWith("color") ? { background: config[selection], color: "white" } : null}
                              value={config[selection]}
                              name={selection}
                              onChange={ (event) => {
                                const newConfigs = [...configs];
                                newConfigs[index][event.target.name] = event.target.value;
                                setConfigs(newConfigs);
                              }}
                            >
                              {OPTIONS_MAP[selection].map(choosable => (
                                <MenuItem key={choosable} value={choosable} style={ selection.startsWith("color") ? { background: choosable, color: "white" } : null}>
                                  {choosable}
                                </MenuItem>
                              ))
                              }
                            </Select>
                        </FormControl>
                      );
                    })}
                    <Button
                      variant="contained"
                      color="default"
                      startIcon={<ClearIcon />}
                      size="large"
                      disableElevation
                      onClick={() => {
                        const newConfigs = [...configs];
                        newConfigs.splice(index, 1);
                        setConfigs(newConfigs);
                      }}
                    />
                  </Grid>
                );
              })
            }
            <Button
              variant="contained"
              color="default"
              startIcon={<AddIcon />}
              size="medium"
              disableElevation
              onClick={() => {
                const newConfigs = [...configs];
                newConfigs.push(init);
                setConfigs(newConfigs);
              }}
            />
          </ConfigDialog>

        </div>
        <div>
          <VisGraph data={displayData} configs={configs} displayedWeek={displayedWeek}/>
        </div>
        {
          state && state.instances && state.instances[0] && state.timescale &&
          <>
            <div className="timescale-slider" style={{ width: "400px", paddingLeft: "100px" }}>
              <Typography id="range-slider" gutterBottom>
                Week range
              </Typography>
              <Slider
                value={displayedWeek}
                onChange={(event, newValue) => {
                  setDisplayedWeek(newValue.sort( (a, b) => a-b));
                  updateLocalState(dispatch, {
                    timescale: {
                      start: (newValue[0] - 1) * 7,
                      end: (newValue[1] - 1) * 7 -1
                    }
                  });
                }}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                min={1}
                max={numberOfWeeks}
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

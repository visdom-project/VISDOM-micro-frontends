/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";

import getAllStudentData from "../services/studentData";
import DropdownMenu from "./DropdownMenu";
import "../stylesheets/dropdown.css";
import {
  useMessageDispatch,
  useMessageState,
  updateLocalState
} from "../contexts/MessageContext";

import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

const RangeInput = ({ max, min, setRange, title, range }) => {
  const handleOnchange = event => {
    event.preventDefault();
    const { value, name } = event.target;
    const newRange = {
      ...range,
      [name]: parseInt(value),
    };
    const inRange = (number, max, min) => (number <= max && number >= min);

    if (inRange(newRange.start, max, min) &&
      inRange(newRange.end, max, min))
    {
      setRange(newRange);
    }
  };

  return range && (
    <div className="input-form">
      <label>{title}</label>
      <br />
      <div style={{ display : "" }}> Start: </div>
      <input className="input-box"
        type="number"
        name="start"
        onChange={handleOnchange}
        value={range.start }
      />
      <div> End: </div>
      <input
        className="input-box"
        type="number"
        name="end"
        onChange={handleOnchange}
        defaultValue={max}
        value={range.end}
      />
    </div>
  );
};

const ControlForm = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  const [client, setClient] = useState(null);

  const [studentData, setStudentData] = useState([]);

  //hard coding without metadata
  const maxlength = 98;

  const modes = ["points", "exercises", "commits", "submissions"];

  useEffect(() => {
    updateLocalState(dispatch, {
      mode: modes[0],
      timescale: {
        start: 0,
        end: maxlength-1,
      }
    });
  }, []);

  useEffect(() => {
    getAllStudentData()
      .then((res) => setStudentData(res))
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    MQTTConnect(dispatch).then((client) => setClient(client));
    return () => client.end();
  }, []);

  return (
    <div>
      <div className="fit-row">
        {studentData &&
        <DropdownMenu
          options={studentData}
          selectedOption={state.instances ? state.instances[0] || "ALL" : "" }
          handleClick={ (instance) => updateLocalState(dispatch, {
            instances: !instance ? [] : [instance],
          })}
          title="Student ID:"
          selectAllOption={true}
          handleSelectAll={() => updateLocalState(dispatch, {
            instances: [],
          })}
        />
        }
        <br />
        <DropdownMenu
          options={modes}
          selectedOption={state.mode}
          handleClick={(mode) => updateLocalState(dispatch, {
            mode: mode,
          })}
          title="Visualization mode:"
        />
        <br />
        <RangeInput
          max={maxlength-1}
          min={0}
          range={state.timescale}
          title={`Time scale (${0}-${maxlength-1})`}
          setRange={ newTimescale => updateLocalState(dispatch, {
            timescale: newTimescale,
          })}
        />
        <br />
        { state.timescale &&
          state.timescale.start > state.timescale.end && <span style={{ background: "red" }}>Invalid range!</span>
        }
      </div>
      <button
        onClick={() => {
          // state condition comes here
          if (client
            && state.timescale.start <= state.timescale.end) {
            publishMessage(client, {
              timescale: state.timescale,
              instances: state.instances,
              mode: state.mode,
            });
          }
        }}
      >
        Sync
      </button>
    </div>
  );
};

export default ControlForm;
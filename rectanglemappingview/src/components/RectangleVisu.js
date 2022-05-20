import React, { useState, useEffect} from "react"

import { 
  _NUMBER_OF_WEEKS_,
  _DAYS_OF_WEEK_,
  _COLOR_PALETTES_ 
} from "../services/helpers";
import studentData from "../services/studentData";
import {
  useMessageDispatch,
  useMessageState,
} from "../contexts/messageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

import ConfigurationTable from "./ConfigurationTable";
import StudentSelector from "./StudentSelector";
import AllWeeksVisu from "./AllWeeksVisu";
import CalendarModeVisu from "./CalendarModeVisu";

const RectangleVisu = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState([]);
  const [graphKey, graphShouldUpdate] = useState(0);

  const [studentID, setStudentID] = useState("");
  const [data, setData] = useState([]);
  const [configProps, setConfigProps] = useState({
    dayMode: "summary",
    width: "commitDay-width",
    height: "commit-height",
    opacity: "",
    color: "",
    pointMode: {
      "commit": "value",
      "points": "value",
      "maxPoints": "value",
      "submissions": "value"
    },
    fillMode: _COLOR_PALETTES_.default
  })
  const [mode, setMode] = useState(false);
  const [weekDisplay, setWeekDisplay] = useState([0, _NUMBER_OF_WEEKS_]);
  const [radarMode, setRadarMode] = useState(false);
  const [radarConfigProps, setRadarConfigProps] = useState({
    dayMode: "summary",
    display: ["submissions", "commits", "points"],
    color: "",
    opacity: "",
    fillMode: _COLOR_PALETTES_.default
  })

   //hard coding without metadata
   const maxlength = 98;
   const [timescale, setTimescale] = useState({
     start: 0,
     end: maxlength - 1,
   });

  useEffect(() => {
    if (studentID) {
      studentData(studentID)
        .then(res => setData(res))
        .catch(err => console.log(err))
    }
  },[studentID]) //eslint-disable-line

  useEffect(() => {
    MQTTConnect(dispatch).then(client => setClient(client));
    return () => client.end();
  }, []);

  useEffect(() => {
    // if empty array then render nothing, if more than one intance(s), render first one;
    const currentIntance = state.instances[0] || "";
    setStudentID(currentIntance);
  }, [state.instances]);

  useEffect(() => {
    if (!state.timescale) {
      return;
    }
    if (
      state.timescale.start !== timescale.start ||
      state.timescale.end !== timescale.end
    ) {
      if (state.timescale.end > maxlength - 1) {
        setTimescale({
          ...timescale,
          end: maxlength - 1,
        });
      } else {
        setTimescale(state.timescale);
      }
      graphShouldUpdate(graphKey + 1);
    }
  }, [state.timescale]);

  return(
    <div className="rectangle-visu">
      <StudentSelector 
        studentID={studentID} 
        setStudentID={setStudentID} 
      />
      {studentID.length !== 0 && <ConfigurationTable 
        configProps={configProps} 
        setConfigProps={setConfigProps}
        mode={mode}
        setMode={setMode}
        weekDisplay={weekDisplay}
        setWeekDisplay={setWeekDisplay}
        radarMode={radarMode}
        setRadarMode={setRadarMode}
        radarConfigProps={radarConfigProps}
        setRadarConfigProps={setRadarConfigProps}
      />}
      {studentID && <button
        onClick={() => {
          if (client) {
            const instances = studentID ? [studentID] : [];
            publishMessage(client, {
              timescale: timescale,
              instances: instances,
            });
          }
        }}
      >
        sync
      </button>}
      {!mode && <AllWeeksVisu 
        rawData={data} 
        configProps={configProps} 
        weekDisplay={[Math.round(timescale.start/_DAYS_OF_WEEK_), Math.round(timescale.end/_DAYS_OF_WEEK_)]}
        setTimescale={setTimescale}
      />}
      {mode && <CalendarModeVisu
        studentID={studentID}
        radarConfigProps={radarConfigProps}
        configProps={configProps}
        radarMode={radarMode}
      />}
    </div>
  )
}

export default RectangleVisu

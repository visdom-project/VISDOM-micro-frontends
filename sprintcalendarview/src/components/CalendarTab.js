import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import getTimeframe from "../services/timeframe";
import { getTimePeriod } from "../services/studentData";
import DropDownMenu from "./DropDownMenu";
import { TimeSelection } from "./DropDownMenu";

import {
  useMessageDispatch,
  useMessageState,
} from "../contexts/MessageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";

const CalendarTab = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState([]);
  const [graphKey, graphShouldUpdate] = useState(0);

  const [timeframe, setTimeframe] = useState([]);
  const [studentID, setStudentID] = useState("");
  const [timePeriod, setTimePeriod] = useState({
    startDate: null, endDate: null})

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //hard coding without metadata
  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength - 1,
  });

  useEffect(() => {
    if (studentID) {
      getTimePeriod(studentID)
      .then(res => res && setTimePeriod(res))
      .catch(error => console.log(error)) 
    }
  },[studentID])

  useEffect(() => {
    // Course: prog 2 S19 started on: new Date('2020-05-04T12:00:00+03:00')
    // Round 1 started on: new Date('2020-05-04T12:00:00+03:00')
    // const timeframeStart = new Date('2020-05-18T12:00:00+03:00')
    // const timeframeEnd = new Date('2020-09-30T12:00:00+03:00')
    if (timePeriod.startDate && timePeriod.endDate) {
      getTimeframe(timePeriod.startDate, timePeriod.endDate, studentID)
      .then(frame => {
        setTimeframe(frame)
        setStartDate(frame[0].key)
        setEndDate(frame[frame.length - 1].key)
      })
      .catch(error => console.log(error))
    }
  }, [timePeriod]) // eslint-disable-line

  useEffect(() => {
    setTimescale({
      start: timeframe.findIndex(d => d.key === startDate),
      end: timeframe.findIndex(d => d.key === endDate)
    })
  }, [startDate, endDate])

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

  return (
    <div className="calendar-tab">
      <DropDownMenu studentID={studentID} setStudentID={setStudentID} />
      {studentID && <TimeSelection 
        timeframe={timeframe}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        timescale={timescale}
        setTimescale={setTimescale}
        maxlength={maxlength}
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
        Sync
      </button>}
      <Calendar key={graphKey} timeframe={timeframe.slice(timescale.start, timescale.end)} />
    </div>
  );
}

export default CalendarTab

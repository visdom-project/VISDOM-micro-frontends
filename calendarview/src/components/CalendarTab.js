import React, { useState, useEffect } from 'react'
import Calendar from './Calendar'
import getTimeframe from "../services/timeframe";
import { getTimePeriod } from "../services/studentData";
import DropDownMenu from "./DropDownMenu";

const CalendarTab = () => {
  const [timeframe, setTimeframe] = useState([]);
  const [studentID, setStudentID] = useState("");
  const [timePeriod, setTimePeriod] = useState({
    startDate: null, endDate: null})

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
      })
      .catch(error => console.log(error))
    }
  }, [timePeriod]) // eslint-disable-line

  return (
    <div className="calendar-tab">
      <DropDownMenu studentID={studentID} setStudentID={setStudentID} />
      <Calendar timeframe={timeframe} />
    </div>
  );
}

export default CalendarTab

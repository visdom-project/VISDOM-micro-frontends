import React, { useEffect, useState } from "react";

import { 
  maximunDetermination, rangeDetermination
} from "../services/helpers";
import dataForCalendarMode from "../services/dataForCalendarMode";

import RadarGraph from "./RadarGraph";
import RectangleGraph from "./RectangleGraph";

import '../styles/calendar.css';
import { 
  Button,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle
} from "@material-ui/core";
import studentData from "../services/studentData";

const Day = ({ 
  day, 
  domain, 
  radarConfigProps,
  radarMode,
  configProps,
  range
}) => {
  const [open, setOpen] = useState(false);
  const date_format = day.date.toLocaleString("en-US",
    {
      weekday: 'short', 
      day: 'numeric',
      year: 'numeric',
      month: 'short'
    })

  return(
    <div className="day">
      <h4 className="date-content" onClick={() => setOpen(true)}>
        {date_format}
        {radarMode && <RadarGraph 
          day={day}
          domain={domain}
          width="inherit" 
          height="250px" 
          key={day.date.toString()}
          radarConfigProps={radarConfigProps} 
        />}
        {!radarMode && <RectangleGraph 
          day={day}
          width="inherit" 
          height="250px"
          range={range}
          configProps={configProps}
        />}
        </h4>
        <div className="detail-radar-dialog" style={{width: "700px"}}>
          <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="radar-dialog-title">
              Detail of {date_format}
            </DialogTitle>
            <DialogContent>
              {radarMode && <RadarGraph 
                day={day} 
                domain={domain}
                width="500px"
                height="450px"
                key={`detail-radar-${date_format}`}
                radarConfigProps={radarConfigProps}
              />}
              {!radarMode && <RectangleGraph
                day={day} 
                width="500px"
                height="450px"
                key={`detail-rec-${date_format}`}
                configProps={configProps}
                range={range}
              />}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    </div>
  )
}

const CalendarModeVisu = ({ 
  studentID, 
  radarConfigProps,
  configProps,
  radarMode
}) => {
  const [data, setData] = useState([]);
  const [domain, setDomain] = useState({
    commit: 0,
    submission: 0,
    point: 0
  })
  const [range, setRange] = useState({
    rangeX: [0, 1],
    rangeY: [0, 1]
  })
  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];

  useEffect(() => {
    if (studentID) {
      dataForCalendarMode(studentID)
        .then(res => {
          setData(res)
          if (res) {
            const commitD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.commits));
            const submissionD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.submissions));
            const pointD = maximunDetermination(res.map(d => d.data).flat(1).map(d => d.maxPoints));
            setDomain({...domain, commit: commitD, submission: submissionD, point: pointD})
          }
        })
        .then(err => console.log(err))
      studentData(studentID)
        .then(res => {
          setRange({...range, rangeX: rangeDetermination(res, typeX), rangeY: rangeDetermination(res, typeY)})
        })
    }
  }, [studentID, configProps, radarMode]) //eslint-disable-line

  if (!data) return <div>No data to show</div>

  return(
    <div className="calendar">
      {data.map((d, i) => 
        <Day 
          day={d}
          domain={domain}
          key={d.date.toString() + i}
          radarConfigProps={radarConfigProps}
          configProps={configProps}
          radarMode={radarMode}
          range={range}
        />)}
    </div>
  )

};

export default CalendarModeVisu

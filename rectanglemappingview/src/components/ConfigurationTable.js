import React, { useState } from "react";
import { 
  Checkbox, 
  DialogActions, 
  DialogContent, 
  Paper, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Table,
  DialogTitle,
  Dialog,
  Switch,
  FormControlLabel,
  Typography,
  Slider } from "@material-ui/core";
  
import Alert from '@material-ui/lab/Alert';

import { _DAYS_OF_WEEK_, _NUMBER_OF_WEEKS_ } from "../services/helpers";

const CalendarConfig = ({ 
  tempRadarMode, 
  setTempRadarMode,
  tempRadarConfigProps,
  setTempRadarConfigProps
}) => {
  const CONSTANT_PROPS = ["submissions", "commits", "points"];
  const CHANGABLE_PROPS = ["point-ratio"];
  const COLOR_PROPS = ["points", "result status"]

  const checkboxDisable = key => (
    <div>
      <FormControlLabel 
        disabled 
        control={<Checkbox defaultChecked name={key} />} 
        label={key}
      />
    </div>
  )

  return(
    <div className="calendar-config">
      <FormControlLabel
        control={<Switch
          checked={tempRadarMode}
          onChange={() => setTempRadarMode(!tempRadarMode)}
        />}
        label="Radar chart"
      />
      {tempRadarMode && <div className="radar-config">
        {CONSTANT_PROPS.map(c => checkboxDisable(c))}
        {CHANGABLE_PROPS.map(p => <div>
          <FormControlLabel 
            control={<Checkbox 
              value={p} 
              name={p}
              checked={tempRadarConfigProps.display.includes(p)}
              onChange={tempRadarConfigProps.display.includes(p)
                ? () => setTempRadarConfigProps({...tempRadarConfigProps, display: tempRadarConfigProps.display.filter(t => t !== p)})
                : () => setTempRadarConfigProps({...tempRadarConfigProps, display: [...tempRadarConfigProps.display, p]})}
            />} 
            label={p}
          />
          <div>
            Color:
            {COLOR_PROPS.map(p =>
              <FormControlLabel
                control={<Checkbox
                  value={p}
                  checked={tempRadarConfigProps.color === p}
                  onChange={e => tempRadarConfigProps.color === e.target.value
                    ? setTempRadarConfigProps({...tempRadarConfigProps, color: ""}) 
                    : setTempRadarConfigProps({...tempRadarConfigProps, color: e.target.value}) 
                  }
                />}
                label={p}
              />  
            )}
          </div>
        </div>)}
      </div>}
    </div>
  )
}

const TableConFig = ({ tempConfigProps, setTempConfigProps }) => {
  const PROPERTIES = ["width", "height", "opacity", "color"];

  const createTableCell = (name, width, height, opacity, color) => {
    return { name, width, height, opacity, color };
  }

  const configdata = [
    createTableCell("Commit", "commit-width", "commit-height", null, null),
    createTableCell("Points", "points-width", "points-height", "points-opacity", "points-color"),
    createTableCell("Max points", "maxPoints-width", "maxPoints-height", null, null),
    createTableCell("Submissions", "submissions-width", "submissions-height", "submissions-opacity"),
    createTableCell("Result status", null, null, null, "passed-color"),
    createTableCell("Commit Days", "commitDay-width")
  ];

  const checkboxCreator = key => {
    if (!key) return null;

    const property = key.split("-")[1];

    const newConfig = {...tempConfigProps};
    newConfig[property] = key;

    const resetConfig = {...tempConfigProps}
    resetConfig[property] = "";

    return(
      <Checkbox
        key={key}
        value={key}
        checked={tempConfigProps[property] === key}
        onChange={e => setTempConfigProps(tempConfigProps[property] === e.target.value ? resetConfig : newConfig)}
      />
    )
  }

  return(
    <TableContainer component={Paper}>
      <Table className="config-table" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Width</TableCell>
            <TableCell>Height</TableCell>
            <TableCell>Opacity</TableCell>
            <TableCell>Color</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {configdata.map(item => (
            <TableRow className={item.name}>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              {PROPERTIES.map(p => (
                <TableCell>
                  {checkboxCreator(item[p])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const ConfigurationTable = ({ 
  configProps, 
  setConfigProps, 
  mode, 
  setMode,
  weekDisplay,
  setWeekDisplay,
  radarMode,
  setRadarMode,
  radarConfigProps,
  setRadarConfigProps,
  timescale,
  setTimescale
}) => {
  const [tempConfigProps, setTempConfigProps] = useState(configProps);
  const [open, setOpen] = useState(false);
  const [tempMode, setTempMode] = useState(mode);
  const [tempWeekDisplay, setTempWeekDisplay] = useState([Math.round(timescale.start/_DAYS_OF_WEEK_), Math.round(timescale.end/_DAYS_OF_WEEK_)]);
  const [tempRadarMode, setTempRadarMode] = useState(radarMode);
  const [tempRadarConfigProps, setTempRadarConfigProps] = useState(radarConfigProps);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const onSaveButtonClicked = e => {
    e.preventDefault();
    if (tempMode && tempConfigProps.width === "commitDay-width" && !tempRadarMode) {
      setMessage("Commit days does not allowed in calendar mode!");
      setTimeout(() => setMessage(""), 10000);
      setError(true);
    } else if (tempConfigProps.width.length === 0 || tempConfigProps.height.length === 0) {
      setMessage("Width or height is missing!");
      setTimeout(() => setMessage(""), 10000);
      setError(true);
    } else {
      setOpen(false);
      setConfigProps(tempConfigProps);
      setMode(tempMode);
      // setWeekDisplay(tempWeekDisplay);
      setRadarMode(tempRadarMode);
      setRadarConfigProps(tempRadarConfigProps);
      setTimescale({...timescale, 
        start: tempWeekDisplay[0] * _DAYS_OF_WEEK_,
        end: tempWeekDisplay[1] * _DAYS_OF_WEEK_
      })
    }
  }

  return(
    <div className="config-dialog">
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        SHOW VIEW CONFIGUARTION
      </Button>
      <Dialog 
        open={open} 
        error={error}
        onClose={() => setOpen(false)} 
        aria-labelledby="form-dialog-title">
        <DialogTitle id="dialog-title">View Configuration</DialogTitle>

        <DialogContent>
          {message.length !== 0 && <Alert severity="error">
            {message}  
          </Alert>}
          <FormControlLabel
            control={<Switch 
              checked={tempMode}
              onChange={() => setTempMode(!tempMode)}
            />}
            label="Calendar mode"
          />

          {tempMode && <CalendarConfig
            tempRadarMode={tempRadarMode}
            setTempRadarMode={setTempRadarMode}
            tempRadarConfigProps={tempRadarConfigProps}
            setTempRadarConfigProps={setTempRadarConfigProps}
          />}

          {!tempMode && <div className="week-display">
            <Typography gutterBottom>Weeks range display</Typography>
            <Slider 
              value={tempWeekDisplay}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={value => value}
              min={0}
              max={_NUMBER_OF_WEEKS_}
              onChange={(e, newValue) => setTempWeekDisplay(newValue)}
            />
          </div>}

          {(!tempMode || !tempRadarMode) && <TableConFig 
            tempConfigProps={tempConfigProps}
            setTempConfigProps={setTempConfigProps}
          />}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={onSaveButtonClicked} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
} 

export default ConfigurationTable

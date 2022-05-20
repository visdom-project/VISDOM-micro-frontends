import React, { useState } from "react";
import {
  InputGroup,
  Table,
  Form,
  Button,
  Modal,
  Alert
} from "react-bootstrap";
import { DropdownMenu } from "./StudentSelector";

import { 
  _DAYS_OF_WEEK_, 
  _NUMBER_OF_WEEKS_,
  _COLOR_PALETTES_
} from "../services/helpers";

const CalendarConfig = ({ 
  tempRadarMode, 
  setTempRadarMode,
  tempRadarConfigProps,
  setTempRadarConfigProps,
}) => {
  const CHANGABLE_PROPS = ["submissions", "commits", "points", "point ratio", "attemped exercise"];
  const COLOR_PROPS = ["points", "result status"];

  return(
    <div className="calendar-config">
      <Form>
        <Form.Switch
          id="radar-mode-switch"
          type="switch"
          label="Radar chart"
          checked={tempRadarMode}
          onChange={() => setTempRadarMode(!tempRadarMode)}
        />
      </Form>

      {tempRadarMode && <div className="radar-config">
        <Form>
        {CHANGABLE_PROPS.map(p => 
          <div>
            <Form.Check 
              type="checkbox"
              label={p}
              value={p}
              name={p}
              checked={tempRadarConfigProps.display.includes(p)}
                onChange={tempRadarConfigProps.display.includes(p)
                ? () => setTempRadarConfigProps({...tempRadarConfigProps, display: tempRadarConfigProps.display.filter(t => t !== p)})
                : () => setTempRadarConfigProps({...tempRadarConfigProps, display: [...tempRadarConfigProps.display, p]})}
            />
          </div>)}
        </Form>
          <div>
            Color:
            <Form className="radar-checkbox-properties">
              {COLOR_PROPS.map(p =>
                  <Form.Check
                    inline
                    type="checkbox"
                    key={p}
                    value={p}
                    checked={tempRadarConfigProps.color === p}
                    label={p}
                    onChange={e => tempRadarConfigProps.color === e.target.value
                      ? setTempRadarConfigProps({...tempRadarConfigProps, color: ""}) 
                      : setTempRadarConfigProps({...tempRadarConfigProps, color: e.target.value}) 
                    }
                  />
                )}
              </Form>
          </div>
      </div>}
    </div>
  )
}

const TableConFig = ({ 
  tempConfigProps, 
  setTempConfigProps,
  tempMode
}) => {
  const PROPERTIES = ["width", "height", "opacity", "color"];

  const createTableCell = (name, width, height, opacity, color) => {
    return { name, width, height, opacity, color };
  }

  const configdata = [
    createTableCell("Commit", "commit-width", "commit-height", null, null),
    createTableCell("Points", "points-width", "points-height", "points-opacity", "points-color"),
    createTableCell("Max points", "maxPoints-width", "maxPoints-height", null, null),
    createTableCell("Submissions", "submissions-width", "submissions-height", "submissions-opacity"),
    createTableCell("Result status", null, null, null, "result status-color"),
    createTableCell("Commit Days", "commitDay-width")
  ];

  const POINT_MODE = ["value", "percentage"];

  const checkboxCreator = key => {
    if (!key) return null;

    const property = key.split("-")[1];

    const newConfig = {...tempConfigProps};
    newConfig[property] = key;

    const resetConfig = {...tempConfigProps}
    resetConfig[property] = "";

    return(
      <InputGroup className="checkbox-properties">
        <InputGroup.Checkbox 
          key={key}
          value={key}
          checked={tempConfigProps[property] === key}
          onChange={e => setTempConfigProps(tempConfigProps[property] === e.target.value ? resetConfig : newConfig)}
        />
      </InputGroup>
    )
  }

  return(
    <Table bordered>
      <thead>
        <tr>
          <th></th>
          <th>Width</th>
          <th>Height</th>
          <th>Opacity</th>
          <th>Color</th>
        </tr>
      </thead>

      <tbody>
        {configdata.map(item => {
          const typeY = item.height && item.height.split("-")[0];
          return(
            <tr className={item.name}>
              <th>
                {item.name}
                <span>
                {(!tempMode && item.name !== "Commit Days" && item.name !== "Result status") &&
                  <DropdownMenu 
                    options={POINT_MODE}
                    title=""
                    selectedOption={tempConfigProps.pointMode[typeY]}
                    handleClick={option => {
                      const newConfig = {...tempConfigProps.pointMode};
                      newConfig[typeY] = option;
                      setTempConfigProps({...tempConfigProps, pointMode: newConfig})
                    }}
                  />}
                </span>
              </th>
              {PROPERTIES.map(p => (
                <th>
                  {checkboxCreator(item[p])}
                </th>
              ))}
            </tr>
          )
        })
      }
    </tbody>
    </Table>
  )
}

const ConfigurationTable = ({ 
  configProps, 
  setConfigProps, 
  mode, 
  setMode,
  radarMode,
  setRadarMode,
  radarConfigProps,
  setRadarConfigProps,
}) => {
  const [tempConfigProps, setTempConfigProps] = useState(configProps);
  const [open, setOpen] = useState(false);
  const [tempMode, setTempMode] = useState(mode);
  const [tempRadarMode, setTempRadarMode] = useState(radarMode);
  const [tempRadarConfigProps, setTempRadarConfigProps] = useState(radarConfigProps);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const DAY_MODE = ["detail", "summary"];

  const handleColorPicker = e => {
    e.preventDefault();
    setTempConfigProps({...tempConfigProps, fillMode: e.target.value});
    setTempRadarConfigProps({...tempRadarConfigProps, fillMode: e.target.value});
  }

  const onSaveButtonClicked = e => {
    e.preventDefault();
    if (tempMode && tempConfigProps.width === "commitDay-width" && !tempRadarMode) {
      setMessage("Commit days is not allowed in calendar mode!");
      setTimeout(() => setMessage(""), 10000);
      setError(true);
    } else if (tempConfigProps.width.length === 0 || tempConfigProps.height.length === 0) {
      setMessage("Width or height is missing!");
      setTimeout(() => setMessage(""), 10000);
      setError(true);
    } else if (tempRadarMode && tempRadarConfigProps.dayMode === "day detail" && tempRadarConfigProps.display.includes("attemped exercise")) {
      setMessage("Attemped exercise is not allowed in this mode!");
      setTimeout(() => setMessage(""), 10000);
      setError(true);
    } else {
      setConfigProps(tempConfigProps)
      setOpen(false);
      setMode(tempMode);
      setRadarMode(tempRadarMode);
      setRadarConfigProps(tempRadarConfigProps);
    }
  }

  return(
    <div className="config-dialog">
      <Button variant="outline-primary" onClick={() => setOpen(true)}>
        SHOW VIEW CONFIGUARTION
      </Button>
      <Modal
        show={open}
        error={error}
        fade={false}
        onHide={() => setOpen(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header id="dialog-title">
          <Modal.Title>View Configuration</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {message.length !== 0 && <Alert variant="danger">
            {message}  
          </Alert>}
          <Form>
            <Form.Switch
              id="calendar-mode-switch"
              type="switch"
              label="Calendar mode"
              checked={tempMode}
              onChange={() => setTempMode(!tempMode)}
            />
          </Form>

          <DropdownMenu 
            title="View mode"
            options={DAY_MODE}
            selectedOption={tempRadarMode ? tempRadarConfigProps.dayMode : tempConfigProps.dayMode}
            handleClick={option => tempRadarMode 
              ? setTempRadarConfigProps({...tempRadarConfigProps, dayMode: option})
              : setTempConfigProps({...tempConfigProps, dayMode: option})
            }
          />

          {tempMode && <CalendarConfig
            tempRadarMode={tempRadarMode}
            setTempRadarMode={setTempRadarMode}
            tempRadarConfigProps={tempRadarConfigProps}
            setTempRadarConfigProps={setTempRadarConfigProps}
            tempConfigProps={tempConfigProps}
            setTempConfigProps={setTempConfigProps}
          />}

          {(!tempMode || !tempRadarMode) && <TableConFig 
            tempConfigProps={tempConfigProps}
            setTempConfigProps={setTempConfigProps}
            tempMode={tempMode}
          />}

          <div className="color-picker">
            <Form.Label htmlFor="ColorInput">Color Picker<em>(will not aplly when color mode is chosen)</em></Form.Label>
            <Form.Control 
              type="color"
              id="color-input"
              color={configProps.fillMode}
              defaultValue={configProps.fillMode}
              onChange={handleColorPicker}
              style={{ width: "30%" }}
            />
          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setOpen(false)} variant="outline-secondary">
            Close
          </Button>
          <Button onClick={onSaveButtonClicked} variant="outline-success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
} 

export default ConfigurationTable

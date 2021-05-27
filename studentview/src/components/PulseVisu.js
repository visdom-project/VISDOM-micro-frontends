/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
} from "recharts";
import pulseData from "../services/pulseData";
import DropdownMenu from "./DropdownMenu";
import "../stylesheets/dropdown.css";
import {
  useMessageDispatch,
  useMessageState,
} from "../contexts/MessageContext";
// import MQTT from "async-mqtt";

// import { MQTTConnect } from "../services/MQTTAdapter";
import moment from "moment";

export const StudentList = ({ setStudentID, studentID }) => {
  const [studentData, setStudentData] = useState([]);
  const student = studentData.find((item) => item.student_id === studentID);

  useEffect(() => {
    pulseData
      .getAllStudentData()
      .then((res) => setStudentData(res))
      .catch((err) => console.log(err));
  }, []);

  if (!studentData || !student)
    return (
      <DropdownMenu
        handleClick={setStudentID}
        options={studentData.map((student) => student.student_id)}
        selectedOption={studentID}
        title={"Chosen student:"}
      />
    );
  return (
    <div className="fit-row">
      <DropdownMenu
        handleClick={setStudentID}
        options={studentData.map((std) => std.student_id)}
        selectedOption={studentID}
        title={"Chosen student:"}
      />
      {student && (
        <table>
          <tbody>
            <tr>
              <td>
                <em>
                  <b>Full name: </b>
                </em>
              </td>
              <td>{student.fullname}</td>
            </tr>
            <tr>
              <td>
                <em>
                  <b>Username: </b>
                </em>
              </td>
              <td>{student.username}</td>
            </tr>
            <tr>
              <td>
                <em>
                  <b>Email: </b>
                </em>
              </td>
              <td>{student.email}</td>
            </tr>
          </tbody>
        </table>
      )}
      ;
    </div>
  );
};

export const PulseVisu = () => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();

  const timescaleBar = useRef(null);
  const [client, setClient] = useState(null);
  const [studentID, setStudentID] = useState("");
  const [data, setData] = useState([]);

  // base on data index, not time scaling day
  // choose other way to initizlize this
  const [timescale, setTimescale] = useState({
    start: 0,
    end: 15,
  });

  useEffect(() => {
    pulseData
      .getData(studentID)
      .then((response) => setData(response[0]))
      .catch((err) => console.log(err));
  }, [studentID]);

  // useEffect(() => {
  //   MQTTConnect(dispatch).then( client => setClient(client));
  //   return () => client.end();
  // }, []);

  // useEffect(() => {
  //   if (!state.timescale)
  //   {
  //     return;
  //   }
  //   const newTimescale = {...state.timescale};
  //   setTimescale(newTimescale);
  // }, [state.timescale]);

  if (!studentID || !data)
    return <StudentList setStudentID={setStudentID} studentID={studentID} />;

  return (
    <div>
      <StudentList setStudentID={setStudentID} studentID={studentID} />
      <BarChart
        width={document.documentElement.clientWidth * 0.9}
        height={document.documentElement.clientHeight * 0.5 + 150}
        margin={{ top: 10, right: 15, left: 25, bottom: 100 }}
        data={data}
      >
        <CartesianGrid horizontal={false} />
        <XAxis
          dataKey="dateInSecond"
          tickFormatter={(tickItem) =>
            moment(tickItem * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
          }
          angle={-90}
          textAnchor="end"
          scale="time"
          tickCount={7}
          interval={0}
        />
        <YAxis allowDataOverflow={true} />
        <Tooltip
          labelFormatter={(label) =>
            moment(label * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
          }
        />
        <Bar dataKey="earlyCommit" stackId="a" fill="#74ee15" barSize={15} />
        <Bar dataKey="inTimeCommit" stackId="a" fill="#ffe700" barSize={15} />
        <Bar dataKey="lateCommit" stackId="a" fill="#e0301e" barSize={15} />
        <Brush
          // startIndex={timescale.start}
          // endIndex={timescale.end}
          // ref={timescaleBar}
          tickFormatter={(tickItem) =>
            moment(tickItem * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
          }
          y={document.documentElement.clientHeight * 0.5 + 120}
          height={25}
          stroke="#8884d8"
          // onchange={() => {
          //   return null
          // }}
        />
      </BarChart>
    </div>
  );
};

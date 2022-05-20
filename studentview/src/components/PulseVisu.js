/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from "recharts";
import pulseData from "../services/pulseData";
import DropdownMenu from "./DropdownMenu";
import "../stylesheets/dropdown.css";
import {
  useMessageDispatch,
  useMessageState,
} from "../contexts/MessageContext";

import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
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

  const [client, setClient] = useState(null);
  const [studentID, setStudentID] = useState("");
  const [data, setData] = useState([]);

  const [graphKey, graphShouldUpdate] = useState(0);

  //hard coding without metadata
  const maxlength = 98;
  const [timescale, setTimescale] = useState({
    start: 0,
    end: maxlength - 1,
  });

  useEffect(() => {
    MQTTConnect(dispatch).then((client) => setClient(client));
    return () => client.end();
  }, []);

  useEffect(() => {
    pulseData
      .getData(studentID)
      .then((response) => setData(response[0]))
      .catch((err) => console.log(err));
  }, [studentID]);

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

  if (!studentID || !data)
    return <StudentList setStudentID={setStudentID} studentID={studentID} />;

  return (
    <div className="" style={{ minHeight: "700px" }}>
      <StudentList setStudentID={setStudentID} studentID={studentID} />
      <ResponsiveContainer minWidth="300px" minHeight="700px">
        <BarChart
          key={graphKey}
          margin={{ top: 10, right: 15, left: 25, bottom: 100 }}
          data={data}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            height={140}
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
            startIndex={timescale.start}
            endIndex={timescale.end}
            tickFormatter={(tickItem) =>
              moment(tickItem * (1000 * 60 * 60 * 24)).format("ddd MMM Do")
            }
            height={25}
            stroke="#8884d8"
            onChange={(e) => {
              setTimescale({
                start: e.startIndex,
                end: e.endIndex,
              });
            }}
          />
        </BarChart>
      </ResponsiveContainer>
      <button
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
      </button>
    </div>
  );
};

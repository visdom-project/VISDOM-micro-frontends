import React, { useEffect, useState } from "react";
// import { makeStyles } from '@material-ui/core/styles';

// import Card from '@material-ui/core/Card';
// import CardContent from "@material-ui/core/CardContent";
// import Typography from '@material-ui/core/Typography';
// import Divider from '@material-ui/core/Divider';

import {
  Card
} from "react-bootstrap";

import studentsInformation from "../services/studentsInformation";

import "../styles/dropdown.css";

export const DropdownMenu = ({ handleClick, options, selectedOption, title }) => {
  return (
    <div style={{ marginRight: "2em" }}>
      <label style={{ paddingRight: "10px" }}>{title}</label>
      <div className="dropdown">
        <button className="dropdown-title-button">{selectedOption}</button>
        <div
          className="dropdown-options"
          style={{ maxHeight: "200px", overflow: "scroll" }}
        >
          {options.map((option) => (
            <button key={option} onClick={() => handleClick(option)}>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
  
const StudentSelector = ({ studentID, setStudentID }) => {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({});

  useEffect(() => {
    studentsInformation()
      .then(res => setStudents(res))
      .catch(err => console.log(err))
  },[]);

  useEffect(() => {
    if (studentID && students) {
      setStudent(students.find(s => s.student_id === studentID))
    }
  },[studentID]) //eslint-disable-line

  return (
    <div className="fit-row">
      <DropdownMenu 
        handleClick={setStudentID}
        options={students.map((student) => student.student_id)}
        selectedOption={studentID}
        title={"Student ID:"}
      />
      {studentID && <Card className="student-info-card" style={{ width: "18rem", border: "none" }}>
        <Card.Body>
          <Card.Title>
            {studentID}
          </Card.Title>
          <Card.Text>
            <b>Full name</b>: {student.fullname}
            <br />
            <b>Username</b>: {student.username}
            <br />
            <b>Email</b>: {student.email}
          </Card.Text>
        </Card.Body>
      </Card>}
    </div>
  )
}

export default StudentSelector
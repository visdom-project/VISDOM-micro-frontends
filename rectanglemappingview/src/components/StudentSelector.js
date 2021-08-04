import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import studentsInformation from "../services/studentsInformation";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
  root: {
    minWidth: 100
  },
}));
  
const StudentSelector = ({ studentID, setStudentID }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
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
      <FormControl className={classes.formControl} style={{ marginRight: "2em" }}>
        <InputLabel id="studentID-input-label">Student ID</InputLabel>
        <Select
          labelId="studentID-input-label"
          id="studentID-selector"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          value={studentID}
          onChange={e => setStudentID(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {students.map(s => <MenuItem key={s.student_id} value={s.student_id}>{s.student_id}</MenuItem>)}
        </Select>
      </FormControl>
      {studentID && <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h3">
            {studentID}
          </Typography>
          <Divider />
          <br />
          <Typography variant="body2" component="p">
            <b>Full name</b>: {student.fullname}
            <br />
            <b>Username</b>: {student.username}
            <br />
            <b>Email</b>: {student.email}
          </Typography>
        </CardContent>
      </Card>}
    </div>
  )
}

export default StudentSelector
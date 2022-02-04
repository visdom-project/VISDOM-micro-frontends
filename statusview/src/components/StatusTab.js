/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import dataService from "../services/statusData";
import MultiChart from "./StatusChart";
import DropdownMenu from "./DropdownMenu";
// import CheckBoxMenu from "./CheckBoxMenu";
import StudentDetailView from "./StudentDetailView";
import ControlAccordion from "./ControlAccordion";
import ConfigDialog from "./ConfigDialog";
// import { TwoThumbInputRange } from "react-two-thumb-input-range";

import {
  useMessageState,
  useMessageDispatch,
} from "../contexts/MessageContext";
import { MQTTConnect, publishMessage } from "../services/MQTTAdapter";
import helpers from "../services/helpers";

// const Controls = (props) => {
//   const {
//     handleModeClick,
//     modes,
//     selectedMode,
//     showableLines,
//     handleToggleRefLineVisibilityClick,
//     showAvg,
//     showExpected,
//     handleWeekClick,
//     weeks,
//     selectedWeek,
//   } = props;

//   if (selectedMode === "submissions" || selectedMode === "commits") {
//     return (
//       <div className="fit-row">
//         <DropdownMenu
//           handleClick={handleModeClick}
//           options={modes}
//           selectedOption={selectedMode}
//           title={"Mode:"}
//         />
//         <DropdownMenu
//           handleClick={handleWeekClick}
//           options={weeks}
//           selectedOption={selectedWeek}
//           title={"Week:"}
//         />
//         <button
//           id={"showGradesButton"}
//           onClick={() => console.log("TODO: Show grades")}
//         >
//           Show grades
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="fit-row">
//       <CheckBoxMenu
//         options={showableLines}
//         handleClick={handleToggleRefLineVisibilityClick}
//         showAvg={showAvg}
//         showExpected={showExpected}
//       />
//       <DropdownMenu
//         handleClick={handleModeClick}
//         options={modes}
//         selectedOption={selectedMode}
//         title={"Mode:"}
//       />
//       <DropdownMenu
//         handleClick={handleWeekClick}
//         options={weeks}
//         selectedOption={selectedWeek}
//         title={"Week:"}
//       />
//       <button
//         id={"showGradesButton"}
//         onClick={() => console.log("TODO: Show grades")}
//       >
//         Show grades
//       </button>
//     </div>
//   );
// };

const InputRange = ({ values, maxlength, setStudentRange }) => {
  if (maxlength === 0) return null;

  return (
    <>
      {/* <div className="student-range-slider">
        <p>Student range:</p>
        <TwoThumbInputRange
          values={values}
          min={1}
          trackColor="#caf0f8"
          max={maxlength}
          onChange={newValue => setStudentRange(newValue.sort((a, b) => a-b))}
          style={{ marginBottom: "20px" }}
        />
      </div> */}
      <div 
        className="student-range-selector"
        style={{ paddingLeft: "43%" }}
      >
        <input 
          type="number" 
          min="1"
          max={values[1]}
          value={values[0]}
          onChange={e => setStudentRange(values.map((v, i) => i === 0 ? e.target.value : v))}
          required
        />
        <span> - </span>
        <input
          type="number"
          min={values[0]}
          max={maxlength}
          value={values[1]}
          onChange={e => setStudentRange(values.map((v, i) => i === 1 ? e.target.value : v))}
          required
        />
      </div>
    </>
  )
}

// eslint-disable-next-line max-lines-per-function
const StatusTab = ({ graphIndex, sortProps, setSortProps, sameSortProps }) => {
  const state = useMessageState();
  const dispatch = useMessageDispatch();
  const [client, setClient] = useState(null);

  const [progressData, setProgressData] = useState([]);
  const [commonData, setCommonData] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [commitData, setCommitData] = useState([]);
  const [commonDataToDisplay, setcommonDataToDisplay] = useState({});
  const [max, setMax] = useState(1);

  const [weeks, setWeeks] = useState(["1"]);
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [selectedWeekData, setSelectedWeekData] = useState([]);
  const [selectedCountData, setSelectedCountData] = useState([]);

  const modes = ["points", "exercises", "submissions", "commits"];
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [displayedModes, setdisplayedModes] = useState(
    modes.filter((mode) => mode !== selectedMode)
  );
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [treshold, setTreshold] = useState(0.4);
  const [studentsBelowTreshold, setStudentsBelowTreshold] = useState(-99);

  const [sortConfig, setSortConfig] = useState(sortProps);
  const [studentRange, setStudentRange] = useState([1,0]);
  const [maxlength, setMaxlength] = useState(0);
  const [courseID, setCourseID] = useState(parseInt(DEFAULT_COURSE_ID) || 90)

  const allKeys = {
    points: {
      max: "maxPts",
      week: "week",
      totalPoints: "totPts",
      missed: "missed",

      cumulativeAvgs: "cumulativeAvgs",
      cumulativeMidExpected: "cumulativeMidExpected",
      cumulativeMinExpected: "cumulativeMinExpected",
    },
    exercises: {
      max: "maxExer",
      week: "weekExer",
      totalPoints: "totExer",
      missed: "missedExer",

      cumulativeAvgs: "cumulativeAvgsExercises",
      cumulativeMidExpected: "cumulativeMidExpectedExercises",
      cumulativeMinExpected: "cumulativeMinExpectedExercises",
    },
    submissions: {},
    commits: {},
  };
  const [dataKeys, setDataKeys] = useState(allKeys[selectedMode]);
  const commonKeys = {
    average: "avg",
    expectedMinimum: "min",
    expectedMedium: "mid",
  };

  const axisNames = {
    points: ["Students", "Points"],
    exercises: ["Students", "Exercises"],
    commits: ["Students", "Commits"],
    submissions: ["Students", "Exercises"],
  };

  const showableLines = ["Average", "Expected"];
  const [showAvg, setShowAvg] = useState(true);
  const [showExpected, setShowExpected] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState("");

  const boundingDiv = document.getElementsByClassName("card")[0];
  const chartWidth =
    boundingDiv === undefined
      ? 1000
      : boundingDiv.getBoundingClientRect().width * 0.955;
  const chartHeight = document.documentElement.clientHeight * 0.5;

  const determineMode = (s) => {
    if (s && s.mode) {
      return s.mode;
    }
    return modes[0];
  };

  // eslint-disable-next-line no-unused-vars
  const handleStudentClick = (data, barIndex) => {
    if (data !== undefined) {
      const newSelected = data.id;
      setSelectedStudent(newSelected);
      setOpenStatusDialog(true);
    }

  };

  const handleModeSwitchClick = (newMode) => {
    setSelectedMode(newMode);

    const newKeys = allKeys[newMode];
    setDataKeys(newKeys);

    handleWeekSwitch(
      undefined,
      undefined,
      undefined,
      newKeys,
      undefined,
      newMode
    );
  };

  const handleWeekSwitch = (
    newWeek,
    data,
    commons,
    keys,
    submissions,
    mode
  ) => {
    if (newWeek === undefined) {
      newWeek = selectedWeek;
    }
    if (data === undefined) {
      data = progressData;
    }
    if (commons === undefined) {
      commons = commonData;
    }
    if (keys === undefined) {
      keys = dataKeys;
    }
    if (submissions === undefined) {
      submissions = submissionData;
    }
    if (mode === undefined) {
      mode = selectedMode;
    }

    setSelectedWeek(newWeek);

    if (
      ["exercises", "points"].includes(mode) &&
      data[newWeek - 1] !== undefined &&
      data[newWeek - 1]["data"] !== undefined
    ) {
      setMax(data[newWeek - 1]["data"][0][keys.max]);
      setSelectedWeekData(data[newWeek - 1]["data"]);

      setcommonDataToDisplay({
        avg: commons[keys.cumulativeAvgs][newWeek - 1],
        mid: commons[keys.cumulativeMidExpected][newWeek - 1],
        min: commons[keys.cumulativeMinExpected][newWeek - 1],
      });
    }

    let newCountData = undefined;

    if (mode === "submissions" ) {
      if (submissions !== undefined && submissions[newWeek - 1] !== undefined) {
        newCountData = submissions[newWeek - 1].data;
        setSelectedCountData(newCountData);
      }
    } else {
      if (commitData !== undefined && commitData.length > 1) {
        const weekStr = newWeek.toString();
        const key =
          weekStr.length < 2
            ? `0${weekStr}`
            : weekStr !== "14"
            ? weekStr
            : "01-14";
        newCountData = commitData.find(module => module.week === key) !== undefined
          ? commitData.find(module => module.week === key).data
          : []
        setSelectedCountData(newCountData);
      }
    }

    if (newCountData !== undefined && data[newWeek - 1] !== undefined) {
      updateTreshold(treshold, data[newWeek - 1].data, newCountData);
    }
  };

  const handleToggleRefLineVisibilityClick = (targetLine) => {
    // Find reference lines:
    const lines = document.querySelectorAll(
      "g.recharts-layer.recharts-reference-line"
    );

    // Toggle line visibility:
    lines.forEach((node) => {
      const textContent = node.firstChild.nextSibling.textContent;

      if (targetLine === "Expected" && !textContent.includes("Av")) {
        setShowExpected(!showExpected);
        node.style.display = showExpected ? "none" : "";
      } else if (targetLine === "Average" && textContent.includes("Av")) {
        setShowAvg(!showAvg);
        node.style.display = showAvg ? "none" : "";
      }
    });
  };

  const updateTreshold = (newTreshold, selectedData, selectedCountD) => {
    if (selectedData === undefined) {
      selectedData = selectedWeekData;
    }
    if (selectedCountD === undefined) {
      selectedCountD = selectedCountData;
    }

    setTreshold(newTreshold);

    if (selectedData[0] !== undefined) {
      // Calculate how many students fall below required point count:
      const requiredPts = selectedData[0].maxPts * newTreshold;
      const studentCountBelowTreshold = selectedCountD.filter(
        (student) => student.cumulativePoints < requiredPts
      ).length;

      setStudentsBelowTreshold(studentCountBelowTreshold);
    }
  };

  useEffect(() => {
    dataService.getData(courseID).then((response) => {
      const [pData, commons, submissions] = response;

      // Fetch needed data:
      setProgressData(pData);
      setCommonData(commons);
      setSubmissionData(submissions);
      setWeeks(pData.map((week) => week.week));

      // Set initial UI state:
      handleWeekSwitch(1, pData, commons, undefined, submissions);
    });

    dataService.getCommitData(courseID).then((response) => {
      const commits = response;

      setCommitData(commits);

      // Select count data from correct week:
      const selected =
        commits !== undefined && commits.length > 0
          ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)) !== undefined
            ? commits.find(module => parseInt(module.week) === parseInt(selectedWeek)).data
            : []
          : [];
      setSelectedCountData(selected);

      updateTreshold(treshold, undefined, commits);

      if (commits !== undefined && commits.length > 0 && commits[0].data) {
        setStudentRange([1, commits[0].data.length]);
        setMaxlength(commits[0].data.length);
      }
    });
  }, []);

  useEffect(() => {
    MQTTConnect(dispatch).then((newClient) => setClient(newClient));
    return () => client.end();
  }, []);

  useEffect(() => {
    if (graphIndex === 0) {
      const _mode = determineMode(state);
      if (selectedMode !== _mode) {
        handleModeSwitchClick(_mode);
      }
    }
  }, [state.mode]);

  useEffect(() => {
    // if empty array then render nothing, if more than one intance(s), render first one;
    if (graphIndex === 0) {
      const currentIntance = state.instances[0] || "";
      setSelectedStudent(currentIntance);
    }
  }, [state.instances]);

  useEffect(() => {
    if (sameSortProps) {
      setSortProps(sortConfig)
    }
    if (progressData && submissionData && commitData){
      if (progressData.length && submissionData.length && commitData.length) {
        const result = helpers.dataSorting(progressData, commitData, submissionData, sortConfig)
        setProgressData(result.sortedProgress);
        setCommitData(result.sortedCommit);
        setSubmissionData(result.sortedSubmission);

        const key = selectedMode === "commits"
          ? selectedWeek.toString().length < 2
            ? `0${selectedWeek}`
            : selectedWeek.toString()
          : selectedWeek.toString();

        if (selectedMode === "commits") {
          const selected = result.sortedCommit !== undefined && result.sortedCommit.length > 0
              ? result.sortedCommit.find(module => module.week === key).data
              : [];
          setSelectedCountData(selected);
        } else if (selectedMode === "submissions") {
          const selected = result.sortedSubmission !== undefined && result.sortedSubmission.length > 0
            ? result.sortedSubmission.find(module => module.week === key).data
            : [];
          setSelectedCountData(selected);
        } else {
          const selected = result.sortedProgress !== undefined && result.sortedProgress.length > 0
            ? result.sortedProgress.find(module => module.week === key).data
            : [];
          setSelectedWeekData(selected)
        }
      }
    }
  }, [sortConfig, courseID]) //eslint-disable-line

  useEffect(() => {
    if (JSON.stringify(sortConfig) !== JSON.stringify(sortProps)) {
      setSortConfig(sortProps);
    }
  }, [sortProps, sameSortProps])

  return (
    <>
      <DropdownMenu
        handleClick={option => setCourseID(option)}
        options={[40, 90, 117]}
        selectedOption={courseID}
        title="Course ID: "
      />
      <ControlAccordion
        handleModeClick={handleModeSwitchClick}
        selectedMode={selectedMode}
        showableLines={showableLines}
        handleToggleRefLineVisibilityClick={
          handleToggleRefLineVisibilityClick
        }
        showAvg={showAvg}
        showExpected={showExpected}
        handleWeekClick={handleWeekSwitch}
        weeks={weeks}
        selectedWeek={selectedWeek}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
        modes={modes}
        sortProps={sortProps}
        setSortProps={setSortProps}
        sameSortProps={sameSortProps}
      />

      <MultiChart
        chartWidth={chartWidth}
        chartHeight={chartHeight}
        data={selectedWeekData}
        dataKeys={dataKeys}
        commonData={commonDataToDisplay}
        commonKeys={commonKeys}
        axisNames={axisNames[selectedMode]}
        max={max}
        handleClick={handleStudentClick}
        visuMode={selectedMode}
        countData={selectedCountData}
        studentsBelowTreshold={studentsBelowTreshold}
        updateTreshold={updateTreshold}
        treshold={treshold}
      />
      <InputRange values={studentRange} maxlength={maxlength} setStudentRange={setStudentRange} />
      <button
        onClick={() => {
          if (client) {
            const instances = selectedStudent ? [selectedStudent] : [];
            publishMessage(client, {
              mode: selectedMode,
              instances: instances,
            });
          }
        }}
      >
        Sync
      </button>

      <ConfigDialog
        title={{
          button: "Show student detail",
          dialog: "Commit details",
          confirm: "Close",
        }}
        openDialog={openStatusDialog}
        setOpenDialog={ openState => setOpenStatusDialog(openState) }
      >
        <StudentDetailView
          selectedStudentID={selectedStudent}
          selectedWeek={selectedWeek}
          courseID={courseID}
        />
      </ConfigDialog>
    </>
  );
};

export default StatusTab;

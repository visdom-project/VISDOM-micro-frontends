import axios from "axios";
import { AdapterConfiguration } from "./serviceConfiguration";
import { getAgregateData } from "./courseData";

// const baseUrl = ElasticSearchConfiguration.createUrl("gitlab-course-40-commit-data-anonymized/_search");

const MAXPOINTS = {
    "40": [30, 100, 110, 95, 60, 90, 55, 70, 90, 40, 55, 120, 105, 30, 0],
    "90": [10, 170, 120, 85, 60, 90, 55, 70, 90, 40, 55, 140, 105, 50, 0],
    "117": [10, 160, 120, 85, 60, 90, 55, 70, 90, 40, 55, 140, 5, 50, 0]
}

// export const getAllStudentsData = (courseID) => {
//     const baseUrl = AdapterConfiguration.createUrl(`adapter/usernames?courseId=${courseID}`)
//     const request = axios
//         .get(baseUrl, {
//             // Accept: "application/json",
//             // "Content-Type": "application/json",
//             headers:{
//                 Authorization: `Basic ${DATA_TOKEN}`,
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//             }
//         }).then(response => response.data.results)
//         // .then((response) => {
//         // const allStudentData = [];
//         // response.data.hits.hits[0]._source.results.forEach((student) => {
//         //     allStudentData.push(student.student_id);
//         // });
//         // return allStudentData;
//         // })
//         // eslint-disable-next-line no-console
//         .catch((someError) => console.log(someError));
//         return request;
// };

export const getAllStudentsIDs = courseID => {
    const baseUrl = AdapterConfiguration.createUrl(`general/artifacts?pageSize=1000&type=course_points&query=data.course_id==${courseID}&data=none&links=constructs`);
    // const baseUrl = AdapterConfiguration.createUrl(`general/authors?page=1&pageSize=1000&type=aplus_user&data=none&links=events`);
    const request = axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => {
        const studentIDsList = response.data.results.map(data => data.related_constructs.filter(event => event.type === "aplus_user").map(user => user.id)).flat();
        return studentIDsList
    })
    .catch(error => console.log(error))

    return request
};

const singleObjectQueryUrl = (type, uuid) => AdapterConfiguration.createUrl(`general/single?type=${type}&uuid=${uuid}`);

export const getStudentData = async (studentID, courseID, expectGrade = 1) => {
    const baseUrl = AdapterConfiguration.createUrl(`general/single?type=aplus_user&uuid=${studentID}`);
    // const baseUrl = AdapterConfiguration.createUrl(`general/authors?page=1&pageSize=1000&type=aplus_user&data=none&links=events`);
    const studentData = await axios.get(baseUrl, {
        Accept: "application/json",
        "Content-Type": "application/json",
    }).then(response => {
        return response.data
    })
    .catch(error => console.log(error))

    const expectedValues = await getAgregateData(expectGrade);

    const exercisePointsIDs = studentData.related_constructs.filter(construct => construct.type === "exercise_points");
    const exercisePointsDetails = await Promise.all(exercisePointsIDs.map(async exercise => {
        const exerciseUrl = singleObjectQueryUrl(exercise.type, exercise.id);
        const singleExercisePoint = await axios.get(exerciseUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);
        return {
            id: singleExercisePoint.id,
            moduleID: singleExercisePoint.related_constructs.find(obj => obj.type === "module_points").id || "",
            submissions: singleExercisePoint.data.submission_count,
        }
    }));

    const submissionIDs = studentData.related_events.filter(e => e.type === "submission");
    const submissionDetails = await Promise.all(submissionIDs.map(async s => {
        const submissionUrl = singleObjectQueryUrl(s.type, s.id);
        const singleSubmission = await axios.get(submissionUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);
        const exID = singleSubmission.related_constructs.find(e => e.type === "exercise_points").id || "";
        const moduleID = exercisePointsDetails.find(e => e.id === exID);
        
        const file = singleSubmission.related_constructs.find(e => e.type === "file");

        if (!file) return {}

        const fileUrl = singleObjectQueryUrl(file.type, file.id);
        const singleFile = await axios.get(fileUrl, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(response => response.data);

        return {
            moduleID: moduleID ? moduleID.moduleID : "", 
            commit: singleFile.related_events.filter(e => e.type === "commit").length,
        }
    }));

    const moduleDataIDs = studentData.related_constructs.filter(construct => construct.type === "module_points");
    const moduleDetails = await Promise.all(moduleDataIDs.map((module) =>  {
        const url = singleObjectQueryUrl(module.type, module.id)
        const singleModuleData = axios.get(url, {
            Accept: "application/json",
            "Content-Type": "application/json",
        }).then(async response => {
            const module = response.data;
            const descriptionSplit = module.description.split(" ")[1] || [];

            const moduleRef = module.related_constructs.find(construct => construct.type === "module");
            const moduleRefUrl = moduleRef && singleObjectQueryUrl(moduleRef.type, moduleRef.id);
            const parentModule = await axios.get(moduleRefUrl,{
                Accept: "application/json",
                "Content-Type": "application/json",
            }).then (response => response.data);

            // return module
            return {
                moduleNo: parseInt(descriptionSplit.slice(0, -1)) || 0,
                description: module.description,
                state: module.state,
                id: module.id,
                passed: module.data.passed,

                submission: module.data.submission_count,

                points: module.data.points,
                maxPoints: parentModule.data.max_points,
                pointsToPass: parentModule.data.points_to_pass,

                commit: submissionDetails.filter(s => s.moduleID === module.id).map(s => s.commit).reduce((a,b) => a + b, 0),

                numberOfExercises: parentModule.data.exercises.length,
                numberOfExercisesAttemped: exercisePointsDetails.filter(ex => ex.moduleID === module.id && ex.submissions > 0).length,
            }
        });

        return singleModuleData
    }));

    const uniqueData = [];
    moduleDetails.sort((a,b) => a.moduleNo - b.moduleNo).forEach((module, i) => {
        const foundModule = uniqueData.find(data => data.moduleNo === module.moduleNo);
        if (!foundModule) {
            uniqueData.push(module);
        } else {
            foundModule.state = foundModule.state && module.state;
            foundModule.passed = foundModule.passed && module.passed;

            foundModule.submission += module.submission;

            foundModule.points += module.points;
            foundModule.maxPoints += module.maxPoints;
            foundModule.pointsToPass += module.pointsToPass;

            foundModule.commit += module.commit;

            foundModule.numberOfExercises += module.numberOfExercises;
            foundModule.numberOfExercisesAttemped += module.numberOfExercisesAttemped;
        }
    });

    uniqueData.splice(15, 1);

    return uniqueData.map((module, index) => ({
        index: index,
        name: module.description,
        passed: module.passed, // true/false

        pointsToPass: module.pointsToPass || 0,
        maxPoints: module.maxPoints,

        notPassedPoints: module.maxPoints - module.points,
        expectedNotPassPoints: expectedValues[index] ? module.maxPoints - expectedValues[index]["avg_points"] : module.maxPoints,

        submission: module.submission,
        expectedSubmissions: expectedValues[index] ? expectedValues[index]["avg_submissions"] : 0,

        commit: module.commit,
        expectedCommit: expectedValues[index] ? expectedValues[index]["avg_commits"] : 0,

        points: module.points,
        expectedPoints: expectedValues[index] ? expectedValues[index]["avg_points"]*MAXPOINTS[courseID.toString()][index] : 0,

        numberOfExercises: module.numberOfExercises,
        //new
        numberOfExercisesAttemped: module.numberOfExercisesAttemped,
        expectedExercises: expectedValues[index] ? expectedValues[index]["avg_exercises"] : 0,

        pointRatio: module.maxPoints === 0 ? 1 : module.points/module.maxPoints,
        expectedPointRatio: module.maxPoints === 0 || !expectedValues[index] ? 1 : expectedValues[index]["avg_points"]/module.maxPoints,

        notPassedRatio: module.maxPoints === 0 ? 0 : 1 - module.points/module.maxPoints,
        expectedNotPassRatio: module.maxPoints === 0 || !expectedValues[index] ? 0 : 1 - expectedValues[index]["avg_points"]/module.maxPoints,
    }));
};

// export const fetchStudentData = async (studentId, courseID, expectGrade = 1) => {
//     const baseUrl = AdapterConfiguration.createUrl(`adapter/data?courseId=${courseID}&username=${studentId}`)
//     const studentData = await axios.get(baseUrl, {
//         // Accept: "application/json",
//         // "Content-Type": "application/json",
//         headers:{
//             Authorization: `Basic ${DATA_TOKEN}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         }
//     }).then(response => response.data.results)
//     .then(data => data[0]);
//     // .then(response => response.data.hits.hits[0]._source.results.filter(student => student.student_id === studentId)[0]);
//     // const commits = studentData.commits.map(week => {
//     //     return week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
//     // });
//     if (!studentData){
//         return [];
//     }

//     const commits = {};
//     studentData.commits.forEach(week => {
//             try {
//                 const weekNumber = parseInt(week.module_name);
//                 commits[weekNumber] = week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
//             }
//             catch (err) {
//                 console.log(err);
//             }
//     });
//     const expectedValues = await getAgregateData(expectGrade);

//     // metadata has 15 weeks but students have 16 weeks;
//     studentData.points.modules.splice(15, 1);

//     return studentData.points.modules.map( (module, index) => ({
//         index: index,
//         name: module.name,
//         passed: module.passed, // true/false

//         pointsToPass: module.points_to_pass || 0,
//         maxPoints: module.max_points,

//         notPassedPoints: module.max_points - module.points,
//         expectedNotPassPoints: expectedValues[index] ? module.maxPoints - expectedValues[index]["avg_points"] : module.maxPoints,

//         submission: module.submission_count,
//         expectedSubmissions: expectedValues[index] ? expectedValues[index]["avg_submissions"] : 0,

//         commit: commits[index] === undefined ? 0 : commits[index],
//         expectedCommit: expectedValues[index] ? expectedValues[index]["avg_commits"] : 0,

//         points: module.points,
//         expectedPoints: expectedValues[index] ? expectedValues[index]["avg_points"]*MAXPOINTS[courseID.toString()][index] : 0,

//         numberOfExercises: module.exercises.length,
//         //new
//         numberOfExercisesAttemped: module.exercises.reduce((attempt, exercise ) => exercise.points === 0 ? attempt : attempt +1, 0),
//         expectedExercises: expectedValues[index] ? expectedValues[index]["avg_exercises"] : 0,

//         pointRatio: module.max_points === 0 ? 1 : module.points/module.max_points,
//         expectedPointRatio: module.max_points === 0 || !expectedValues[index] ? 1 : expectedValues[index]["avg_points"]/module.max_points,

//         notPassedRatio: module.max_points === 0 ? 0 : 1 - module.points/module.max_points,
//         expectedNotPassRatio: module.max_points === 0 || !expectedValues[index] ? 0 : 1 - expectedValues[index]["avg_points"]/module.max_points,
//     }));
// };

// export const fetchStudentsData = async (courseID) => {
//     const baseUrl = AdapterConfiguration.createUrl(`adapter/data?courseId=${courseID}`)
//     const studentsData = {};
//     // get students document
//     await axios.get(baseUrl, {
//         headers:{
//             Authorization: `Basic ${process.env.REACT_APP_TOKEN}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         }
//     }).then(response => response.data.results)
//     .then(data => data.forEach(studentData => {
//         const commits = {};
//         studentData.commits.forEach(week => {
//             let weekNumber = 0;
//             try {
//                 const n = parseInt(week.module_name);
//                 weekNumber = n;
//                 commits[weekNumber] = week.projects.reduce( (numberOfCommit, p) => numberOfCommit + p.commit_count, 0);
//             }
//             catch (err) {
//             }
//         });
    
//         // metadata has 15 weeks but students have 16 weeks;
//         //TODO: change this when change to new course data / maybe its okay to set max = 15
//         studentData.points.modules.splice(15, 1);

//         // dont have expectData
//         studentsData[studentData.student_id] = studentData.points.modules.map( (module, index) => ({
//             index: index,
//             name: module.name,
//             passed: module.passed, // true/false
    
//             pointsToPass: module.points_to_pass,
//             maxPoints: module.max_points,
    
//             notPassedPoints: module.max_points - module.points,
    
//             submission: module.submission_count,
    
//             commit: commits[index] === undefined ? 0 : commits[index],
    
//             points: module.points,
    
//             numberOfExercises: module.exercises.length,
//             //new
//             numberOfExercisesAttemped: module.exercises.reduce((attempt, exercise ) => exercise.points === 0 ? attempt : attempt +1, 0),
    
//             pointRatio: module.max_points === 0 ? 1 : module.points/module.max_points,
    
//             notPassedRatio: module.max_points === 0 ? 0 : 1 - module.points/module.max_points,
//         }));
//     }));

//     // cumulative Data:
    
//     Object.values(studentsData).forEach(student => {
//         student.forEach((week, index) => {
//             if (index === 0) {
//                 week.cumPoints = week.points;
//                 week.cumCommit = week.commit;
//                 week.cumSubmission = week.submission;
//                 week.cumExercises = week.numberOfExercisesAttemped
//             }
//             else {
//                 week.cumPoints = student[index-1].cumPoints + week.points;
//                 week.cumCommit = student[index-1].cumCommit + week.commit;
//                 week.cumSubmission = student[index-1].cumSubmission + week.submission;
//                 week.cumExercises = student[index-1].cumExercises + week.numberOfExercisesAttemped;
//             }
//         })
//     });
//     return studentsData;
// };


import axios from "axios";
import { ElasticSearchConfiguration } from "./serviceConfiguration";

const baseUrl = ElasticSearchConfiguration.createUrl(
  "gitlab-course-40-commit-data-anonymized/_search"
);

const getAllStudentData = () => {
  const request = axios
    .get(baseUrl, {
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .then((response) => {
      const allStudentData = [];
      response.data.hits.hits[0]._source.results.forEach((student) => {
        allStudentData.push(student.student_id);
      });
      return allStudentData;
    })
    .catch((someError) => console.log(someError));

  return request;
};

export default { getAllStudentData };

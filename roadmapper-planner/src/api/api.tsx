import Axios, { AxiosRequestConfig } from "axios";
import { PublicUser, Roadmap, UserInfo, Version, Task } from "../types";

/* 
  A new authorization key needs to be fetched from server each time it is restarted:
    1) POST http://localhost:5000/users/login
      *Requires login info in body
    2) POST http://localhost:5000/users/mytoken
      *Returns required bearer token as response
*/

//Example: const token = "71dd72c1-73b4-4b73-ae50-1edd3532820d";
const token = "";

const axiosConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:5000/",
  withCredentials: true,
  headers: { Authorization: `bearer ${token}` },
};
const axios = Axios.create(axiosConfig);

const getRoadmap = async () => {
  const response = await axios.get("/roadmaps?eager=1");
  return response.data[0] as Roadmap;
};

const getTasks = async (roadmapId: number) => {
  const tasks = await axios.get(`/roadmaps/${roadmapId}/tasks?eager=1`);
  return tasks.data as Task[];
};

const getCurrentUserInfo = async () => {
  const response = await axios.get(`/users/whoami`);
  return response.data as UserInfo;
};

const getPublicUsers = async (roadmap: Roadmap) => {
  const response = await axios.get(`/roadmaps/${roadmap.id}/users`);
  return response.data as PublicUser[];
};

const getVersions = async (roadmap: Roadmap) => {
  const response = await axios.get(`/roadmaps/${roadmap.id}/versions`);
  return response.data as Version[];
};

export const api = {
  getRoadmap,
  getTasks,
  getCurrentUserInfo,
  getPublicUsers,
  getVersions,
};

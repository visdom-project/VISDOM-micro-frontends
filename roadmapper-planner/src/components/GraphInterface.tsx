import React, { useEffect, useState } from "react";
import { Roadmap, Version, PublicUser } from "../types";
import { RoadmapGraphComponent } from "./RoadmapGraphComponent";
import { api } from "../api/api";

export const GraphInterface = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | undefined>(undefined);
  const [versions, setVersions] = useState<Version[] | undefined>(undefined);
  const [publicUsers, setPublicUsers] = useState<PublicUser[] | undefined>(
    undefined
  );

  const fetchRoadmaps = async () => {
    const firstRoadmap = await api.getRoadmap();
    const tasks = await api.getTasks(firstRoadmap.id);
    setRoadmap({ ...firstRoadmap, tasks: tasks });
  };

  const fetchVersions = async (roadmap: Roadmap) => {
    const versionsData = await api.getVersions(roadmap);
    setVersions(versionsData);
  };

  const fetchPublicUsers = async (roadmap: Roadmap) => {
    const usersData = await api.getPublicUsers(roadmap);
    setPublicUsers(usersData);
  };

  useEffect(() => {
    if (!roadmap) fetchRoadmaps();
    if (roadmap) {
      fetchVersions(roadmap);
      fetchPublicUsers(roadmap);
    }
  }, [roadmap]);

  return (
    <>
      {roadmap && versions && publicUsers ? (
        <RoadmapGraphComponent
          roadmap={roadmap}
          versions={versions}
          publicUsers={publicUsers}
        />
      ) : (
        <div>
          <i>Fetching data..</i>
        </div>
      )}
    </>
  );
};

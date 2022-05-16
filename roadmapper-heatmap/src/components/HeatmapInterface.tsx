import React, { useEffect, useState } from "react";
import { Roadmap } from "../types";
import { TaskHeatmap } from "./TaskHeatmap";
import { api } from "../api/api";

export const HeatmapInterface = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | undefined>(undefined);

  useEffect(() => {
    const getRoadmap = async () => {
      const firstRoadmap = await api.getRoadmap();
      const tasks = await api.getTasks(firstRoadmap.id);
      setRoadmap({ ...firstRoadmap, tasks: tasks });
    };
    if (!roadmap) getRoadmap();
  }, [roadmap]);

  if (!roadmap || !roadmap.tasks)
    return (
      <div>
        <i>Error fetching the roadmap data..</i>
      </div>
    );

  return <TaskHeatmap currentRoadmap={roadmap} />;
};

import React from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { PublicUser, Roadmap, TaskRatingDimension, Version } from "../types";
import { calcTaskValueSum } from "../utils";
import css from "./TaskValueComponent.module.scss";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

export const TaskValueComponent: React.FC<{
  version: Version;
  roadmap: Roadmap;
  publicUsers: PublicUser[];
}> = ({ version, roadmap, publicUsers }) => {
  let totalValue = 0;
  const customerStakes = new Map<PublicUser, number>();

  // Calculate total sum of task values in the milestone
  // And map values of how much each user has rated in these tasks
  version.tasks.forEach((task) => {
    totalValue += calcTaskValueSum(task!) || 0;
    if (task == null) return;

    task.ratings.forEach((rating) => {
      if (rating.dimension !== TaskRatingDimension.BusinessValue) return;
      const user = publicUsers?.find((u) => u.id === rating.createdByUser);
      if (user) {
        const previousVal = customerStakes.get(user) || 0;
        customerStakes.set(user, previousVal + rating.value);
      }
    });
  });

  // Format for recharts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const data: DataPoint[] = [];
  let index = 0;
  customerStakes.forEach((val, key) => {
    data.push({
      name: key.username,
      value: Math.round(val * 100) / 100,
      color: COLORS[index % COLORS.length],
    });
    index += 1;
  });

  if (data.length === 0)
    data.push({
      name: "No value ratings given",
      value: 4,
      color: "#D3D3D3",
    });

  return (
    <div className={css.container}>
      <h3 className={css.taskTitle}>{version.name}</h3>
      <PieChart width={450} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip allowEscapeViewBox={{ x: true, y: true }} />
        <Legend
          align="right"
          verticalAlign="middle"
          layout="vertical"
          width={200}
        />
      </PieChart>
    </div>
  );
};

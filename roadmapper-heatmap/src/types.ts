export interface Roadmap {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
  plannerUserWeights: PlannerUserWeight[] | undefined;
  jiraconfiguration: JiraConfiguration | undefined;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  roadmapId: number;
  createdAt: string;
  completed: boolean;
  ratings: Taskrating[];
  relatedTasks: number[];
  createdByUser: number;
}

export enum TaskRatingDimension {
  BusinessValue = 0,
  RequiredWork = 1,
}

export interface Taskrating {
  id: number;
  dimension: TaskRatingDimension;
  value: number;
  comment: string;
  createdByUser: number;
  parentTask: number;
}

export interface PlannerUserWeight {
  userId: number;
  weight: number;
}

export interface JiraConfiguration {
  id: number;
  roadmapId: number;
  url: string;
  privatekey: string;
}

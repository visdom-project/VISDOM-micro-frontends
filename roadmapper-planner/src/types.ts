enum UserType {
  BusinessUser = 0,
  DeveloperUser = 1,
  CustomerUser = 2,
  AdminUser = 3,
  TokenUser = 4,
}

export interface PublicUser {
  id: number;
  username: string;
  type: UserType;
  customerValue?: number;
}

export interface UserInfo {
  username: string;
  email: string;
  id: number;
  type: UserType;
  customerValue?: number;
}

export interface Roadmap {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
  plannerUserWeights: PlannerUserWeight[] | undefined;
  jiraconfiguration: JiraConfiguration;
}

interface PlannerUserWeight {
  userId: number;
  weight: number;
}

interface JiraConfiguration {
  id: number;
  roadmapId: number;
  url: string;
  privatekey: string;
}

export interface Version {
  roadmapId: number;
  id: number;
  name: string;
  tasks: Task[];
  sortingRank: number;
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

export interface Taskrating {
  id: number;
  dimension: TaskRatingDimension;
  value: number;
  comment: string;
  createdByUser: number;
  parentTask: number;
}

export enum TaskRatingDimension {
  BusinessValue = 0,
  RequiredWork = 1,
}

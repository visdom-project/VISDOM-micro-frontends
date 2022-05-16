import { Task, TaskRatingDimension } from "./types";

const averageRatingsByDimension = (
  task: Task
): Map<TaskRatingDimension, number> => {
  const ratings = task.ratings.reduce((result, { value, dimension }) => {
    const { sum, count } = result.get(dimension) || { sum: 0, count: 0 };
    return result.set(dimension, { sum: sum + value, count: count + 1 });
  }, new Map());
  return new Map(
    Array.from(ratings).map(([key, { sum, count }]) => [key, sum / count])
  );
};

export const totalValueAndWork = (tasks: Task[]) => {
  return tasks
    .map((task) => averageRatingsByDimension(task))
    .reduce(
      ({ value, work }, ratings) => ({
        value: value + (ratings.get(TaskRatingDimension.BusinessValue) || 0),
        work: work + (ratings.get(TaskRatingDimension.RequiredWork) || 0),
      }),
      { value: 0, work: 0 }
    );
};

export const calcTaskValueSum = (task: Task) => {
  let ratingValuesSum = 0;
  task.ratings.forEach((rating) => {
    if (rating.dimension !== TaskRatingDimension.BusinessValue) return;
    ratingValuesSum += rating.value;
  });

  return ratingValuesSum;
};

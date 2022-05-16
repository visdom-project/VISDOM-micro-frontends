export const calcTaskAverageRating = (dimension: any, task: any) => {
  let sum = 0;
  let count = 0;
  task.ratings.forEach((rating) => {
    if (rating.dimension !== dimension) return;
    count += 1;
    sum += rating.value;
  });

  if (count > 0) {
    return sum / count;
  }
  return undefined;
};

import {
  _COLOR_PALETTES_,
  rangeDetermination,
  timeDiff,
  _DAYS_OF_WEEK_,
  dateToNumber
} from "./helpers";

const dataForAllWeeks = (data, typeX, typeY, typeOpacity, typeColor) => {
  const initData = data.map((module, i) => ({
    key: module.name,
    x0: i,
    x: i,
    y0: 0,
    y: 0,
    opacity: 1,
    color: _COLOR_PALETTES_.default
  }));
  const xAxisUnit = rangeDetermination(data, typeX)[1] !== 0 
    ? 1 / rangeDetermination(data, typeX)[1]
    : 0;

  data.forEach((module,i) => {
    if (typeX === "commit") {
      initData[i].x += module.commits * xAxisUnit;
    } else if (typeX === "points") {
      initData[i].x += module.points * xAxisUnit;
    } else if (typeX === "maxPoints") {
      initData[i].x += module.maxPoint * xAxisUnit;
    } else if (typeX === "submissions") {
      initData[i].x += module.submissions * xAxisUnit;
    } else if (typeX === "commitDay") {
      const unit = 1/_DAYS_OF_WEEK_;
      const time = timeDiff(module.startDate, module.firstCommitDate);
      const commitDate = dateToNumber(module.firstCommitDate);
      const moduleStart = dateToNumber(module.startDate);
      const moduleEnd = dateToNumber(module.endDate);

      if (commitDate <= moduleStart) {
        if (module.commitDays <= _DAYS_OF_WEEK_) {
          initData[i].x += module.commitDays * unit;
        } else {
          initData[i].x += _DAYS_OF_WEEK_ * unit;
        }
      } else if (commitDate >= moduleEnd) {
        initData[i].x += _DAYS_OF_WEEK_ * unit;
        if (module.commitDays <= _DAYS_OF_WEEK_) {
          initData[i].x0 += (_DAYS_OF_WEEK_ - module.commitDays) * unit;
        }
      } else {
        initData[i].x0 += time * unit;
        if ((time + module.commitDays) <= _DAYS_OF_WEEK_) {
          initData[i].x += (time + module.commitDays) * unit;
        } else {
          initData[i].x += _DAYS_OF_WEEK_ * unit;
        }
      }
    };

    if (typeY === "commit") {
      initData[i].y += module.commits;
    } else if (typeY === "points") {
      initData[i].y += module.points;
    } else if (typeY === "maxPoints") {
      initData[i].y += module.maxPoint;
    } else if (typeY === "submissions") {
      initData[i].y += module.submissions;
    };

    if (typeOpacity === "points") {
      initData[i].opacity = isNaN(module.points / module.maxPoint)
      ? 0
      : module.points / module.maxPoint;
    } else if (typeOpacity === "submissions") {
      initData[i].opacity = isNaN(module.submissions / module.commits)
        ? 0
        : module.submissions / module.commits;
    }

    if (typeColor === "points") {
      initData[i].color = module.passed
        ? module.points === module.maxPoint
          ? _COLOR_PALETTES_.fullPoint                            //full point
          : module.exercises.map(e => e.exerciseDifficulty).includes("P")
            ? _COLOR_PALETTES_.notDefined                         //no information for indentity
            : _COLOR_PALETTES_.partialPoint                       //partial points
        : _COLOR_PALETTES_.noPoint    
    } else if (typeColor === "passed") {
      initData[i].color = module.passed
        ? _COLOR_PALETTES_.fullPoint                              //partial points
        : _COLOR_PALETTES_.noPoint    
    }

  })

  return initData;
}

export default dataForAllWeeks

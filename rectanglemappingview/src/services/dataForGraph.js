import {
  _COLOR_PALETTES_ 
} from "./helpers";

const dataForGraph = (data, typeX, typeY, typeOpacity, typeColor) => {
  const initData = data.map((d) => ({
    key: d.name,
    x0: 0,
    x: 0,
    y0: 0,
    y: 0,
    opacity: 1,
    color: _COLOR_PALETTES_.default
  }))

  if (typeX  === "commit") {
    let x = 0;
    data.forEach((e, i) => {
      initData[i].x0 = x;
      initData[i].x = x + e.commits;
      x += e.commits;
    });
  } else if (typeX === "points") {
    let x = 0;
    data.forEach((e,i) => {
      initData[i].x0 = x;
      initData[i].x = x + e.points;
      x += e.points;
     });
  } else if (typeX === "maxPoints") {
    let x = 0;
    data.forEach((e,i) => {
      initData[i].x0 = x;
      initData[i].x = x + e.maxPoints;
      x += e.maxPoints;
     });
  } else if (typeX === "submissions") {
    let x = 0;
    data.forEach((e,i) => {
      initData[i].x0 = x;
      initData[i].x = x + e.submissions;
      x += e.submissions;
     });
  }

  if (typeY === "commit") {
    data.forEach((e, i) => {
      initData[i].y = e.commits;
    });
  } else if (typeY === "points") {
    data.forEach((e, i) => {
      initData[i].y = e.points;
    });
  } else if (typeY === "maxPoints") {
    data.forEach((e, i) => {
      initData[i].y = e.maxPoints;
    });
  } else if (typeY === "submissions") {
    data.forEach((e, i) => {
      initData[i].y = e.submissions;
    });
  }

  if (typeOpacity === "points") {
    data.forEach((e, i) => {
      initData[i].opacity = isNaN(e.points / e.maxPoints)
        ? 0
        : e.points / e.maxPoints;
    });
  } else if (typeOpacity === "submissions") {
    data.forEach((e, i) => {
      initData[i].opacity = isNaN(e.submissions / e.commits)
        ? 0
        : e.submissions / e.commits;
    });
  }

  if (typeColor === "points") {
    data.forEach((e, i) => {
      initData[i].color = e.passed
        ? e.points === e.maxPoints
          ? _COLOR_PALETTES_.fullPoint                           //full point
          : e.difficulty === "P"
            ? _COLOR_PALETTES_.notDefined                        //no information for indentity
            : _COLOR_PALETTES_.partialPoint                  //partial points
        : _COLOR_PALETTES_.noPoint                             //0 pts
    });
  } else if (typeColor === "passed") {
    data.forEach((e, i) => {
      initData[i].color = e.passed
        ? _COLOR_PALETTES_.fullPoint                             //full point                  //partial points
        : _COLOR_PALETTES_.noPoint                                 
    });
  }

  return initData;
}

export default dataForGraph
import React, { useEffect, useState } from "react";

import { 
  _COLOR_PALETTES_ 
} from "../services/helpers";

import { RadarChart, makeVisFlexible, Hint} from "react-vis";

const FlexibleRadarChart = makeVisFlexible(RadarChart);

const RadarGraph = ({ day, domain, width, height, radarConfigProps }) => {
  const [data, setData] = useState(day.data);
  const [hoverCell, setHoverCell] = useState(false);
  const [hoverCellValue, setHoverCellValue] = useState(false);


  useEffect(() =>{
    if (data.length > 0) {
      const tempData = [...data];
      tempData.forEach(d => {
        if (radarConfigProps.color === "points") {
          d.fill = d.points > 0
            ? d.points === d.maxPoints
              ? _COLOR_PALETTES_.fullPoint
              : d.difficulty === "P"
                ? _COLOR_PALETTES_.notDefined
                : _COLOR_PALETTES_.partialPoint
            : _COLOR_PALETTES_.noPoint
        } else if (radarConfigProps.color === "result status") {
          d.fill = d.passed
            ? _COLOR_PALETTES_.fullPoint
            : _COLOR_PALETTES_.noPoint  
        } else {
          d.fill = "";
        }
      })
      setData(tempData);
    }
  }, [radarConfigProps]) //eslint-disable-line

  if (day.data.length === 0) return null;

  const tipStyle = {
    display: 'flex',
    color: '#000',
    background: '#eff7f6',
    alignItems: 'center',
    padding: '5px',
    border: "1px darkgrey solid",
  };

  return (
    <div className="radar-chart" style={{ width: width, height: height, marginTop: "20px" }}>
      <FlexibleRadarChart
        data={data}
        startingAngle={0}
        colorType="literal"
        margin={{left: 0, right: 40, top: 20, bottom: 20}}
        domains={radarConfigProps.display.includes("point-ratio")
          ? [
            {name: "commits", domain: [0, domain.commit], getValue: d => d.commits},
            {name: "points", domain: [0, domain.point], getValue: d => d.points},
            {name: "submissions", domain: [0, domain.submission], getValue: d => d.submissions},
            {name: "point ratio", domain: [0,1], getValue: d => d.maxPoints !== 0 ? d.points / d.maxPoints : 0}
            ]
          : [
            {name: "commits", domain: [0, domain.commit], getValue: d => d.commits},
            {name: "points", domain: [0, domain.point], getValue: d => d.points},
            {name: "submissions", domain: [0, domain.submission], getValue: d => d.submissions}
            ]}
        tickFormat={val => Math.round(val) === val ? val : ""}
        onSeriesMouseOver={d => setHoverCell(d.event[0])}
        onSeriesMouseOut={() => setHoverCell(false)}
        onValueMouseOver={v => setHoverCellValue(v)}
        onValueMouseOut={() => setHoverCellValue(false)}
      >
        {hoverCell && <Hint value={{x: 0, y: 0}}>
          <div style={tipStyle}>{hoverCell.name}</div>
        </Hint>}
        {hoverCellValue && <Hint value={hoverCellValue}>
          <div style={tipStyle}>
            {hoverCellValue.dataName}
            <br />
            {hoverCellValue.domain} : {hoverCellValue.value}
          </div>  
        </Hint>}
      </FlexibleRadarChart>
  </div>
  )
}

export default RadarGraph

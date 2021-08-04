import React, { useState } from "react";

import dataForAllWeeks from "../services/dataForAllWeeks";
import {
  rangeDetermination, _DAYS_OF_WEEK_
} from "../services/helpers";

import {
  XAxis,
  YAxis,
  VerticalRectSeries,
  VerticalGridLines,
  HorizontalGridLines,
  FlexibleWidthXYPlot,
  Hint
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";

const AllWeeksVisu = ({ rawData, configProps, weekDisplay }) => {
  const [hoverCell, setHoverCell] = useState(false);

  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];
  const typeOpacity = configProps.opacity.split("-")[0];
  const typeColor = configProps.color.split("-")[0];

  const rangeY = rangeDetermination(rawData, typeY);
  const rangeX = rangeDetermination(rawData, typeX);

  const data = dataForAllWeeks(rawData, typeX, typeY, typeOpacity, typeColor);

  const tipStyle = {
    display: 'flex',
    color: '#000',
    background: '#eff7f6',
    alignItems: 'center',
    padding: '5px',
    border: "1px darkgrey solid",
  };

  return(
    <div className="all-weeks-visu">
      <FlexibleWidthXYPlot height={500} xDomain={weekDisplay} yDomain={rangeY}>
        <VerticalGridLines />
        <HorizontalGridLines />

        <XAxis 
          title={typeX}
          tickFormat={val => Math.round(val) === val ? val : ""}
        />
        <YAxis 
          title={typeY} 
          tickFormat={val => Math.round(val) === val ? val : ""}
        />
        <VerticalRectSeries
          data={data} 
          colorType="literal"
          stroke="black"
          onValueMouseOver={v => setHoverCell(v)}
          onValueMouseOut={() => setHoverCell(false)}
        />
        {hoverCell && <Hint value={{ x: hoverCell.x, y: hoverCell.y }}>
          <div style={tipStyle}>
            {hoverCell.key}
            <br />
            {typeX} : {typeX !== "commitDay" 
              ? Math.round((hoverCell.x - hoverCell.x0)*rangeX[1])
              : Math.round((hoverCell.x - hoverCell.x0)*_DAYS_OF_WEEK_)}
            <br />
            {typeY} : {hoverCell.y}
          </div>
        </Hint>}
      </FlexibleWidthXYPlot>
    </div>
  );
}

export default AllWeeksVisu

import React, { useEffect, useState } from "react";

import {
  XAxis,
  YAxis,
  VerticalRectSeries,
  FlexibleXYPlot,
  Hint
} from "react-vis";
import "../../node_modules/react-vis/dist/style.css";

import dataForGraph from "../services/dataForGraph";

const RectangleGraph = ({ 
  day, 
  width, 
  height, 
  configProps,
  range
}) => {
  const [data, setData] = useState([]);
  const typeX = configProps.width.split("-")[0];
  const typeY = configProps.height.split("-")[0];
  const typeOpacity = configProps.opacity.split("-")[0];
  const typeColor = configProps.color.split("-")[0];

  const [hoverCell, setHoverCell] = useState(false);

  const tipStyle = {
    display: 'flex',
    color: '#000',
    background: '#eff7f6',
    alignItems: 'center',
    padding: '5px',
    border: "1px darkgrey solid",
  };

  useEffect(() => {
    if (day.data.length > 0) {
      setData(dataForGraph(day.data, typeX, typeY, typeOpacity, typeColor));
    }
  }, [configProps]); //eslint-disable-line

  return(
    <div className="rectangle-graph" style={{ width: width, height: height, marginTop: "20px" }}>
      <FlexibleXYPlot xDomain={range.rangeX} yDomain={range.rangeY}>
        <XAxis title={typeX} tickFormat={val => Math.round(val) === val ? val : ""} />
        <YAxis title={typeY} tickFormat={val => Math.round(val) === val ? val : ""} />
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
            {typeX} : {hoverCell.x}
            <br />
            {typeY} : {hoverCell.y}
          </div>
        </Hint>}
      </FlexibleXYPlot>
    </div>
  )
}

export default RectangleGraph

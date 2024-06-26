/* eslint-disable react/prop-types */
import React from "react";

const TresholdSelector = ({
  handleTresholdChange,
  chartWidth,
  treshold,
  title,
  tresholdCount,
}) => {
  // Update the treshold line place in the x-axel:
  if (tresholdCount >= 0) {
    const refLine = document.querySelector("#treshold-line");
    const studentBars = document.querySelectorAll("path.recharts-rectangle");
    if (refLine !== null && studentBars !== undefined) {
      let studentBar = undefined;
      let additionalWidth = 6.0; // Moves line to the right side of a bar with width 6 px.

      if (treshold < 0.01) {
        // At the beginning
        studentBar = studentBars[0];
        additionalWidth = -3.0; // Moves line to the right side of the first bar.
      } else if (treshold < 1) {
        // Somewhere in the middle
        studentBar = studentBars[tresholdCount - 1];
      } else {
        // In the end
        studentBar = studentBars[studentBars.length - 1];
      }

      if (studentBar !== undefined) {
        refLine.style.marginLeft = `${
          parseFloat(studentBar.getAttribute("x")) + additionalWidth
        }px`;
      }
    }
  }

  // Handler for a check button that toggles the visibility of the treshold selector:
  const handleChecker = (event) => {
    const refLine = document.querySelector("#treshold-line");
    if (refLine !== null) {
      refLine.style.display = event.target.checked ? "block" : "None";

      document.querySelector("#treshold-wrapper").style.display = event.target
        .checked
        ? "flex"
        : "None";
    }

    handleTresholdChange(treshold);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", marginBottom: "2em" }}
      className="intended"
    >
      <input
        style={{ marginLeft: "0", marginRight: "1em" }}
        type="checkbox"
        onClick={(event) => handleChecker(event)}
      ></input>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="treshold-slider" style={{ fontSize: "large" }}>
          {title}
        </label>

        <div
          style={{ display: "None", flexDirection: "row", marginTop: "0.5em" }}
          id="treshold-wrapper"
        >
          <div style={{ display: "block", paddingRight: "0.5em" }}>
            Expected completion rate: 0 %
          </div>

          <input
            min="0"
            max="1"
            type="range"
            step="0.01"
            value={treshold}
            onChange={(event) => handleTresholdChange(event.target.value)}
            style={{ width: chartWidth * 0.1 }}
            id="treshold-slider"
          ></input>

          <div
            style={{
              display: "block",
              paddingLeft: "0.5em",
              paddingRight: "0.5em",
            }}
          >
            100 %,
          </div>

          <label htmlFor="treshold-slider">
            current: {Math.round(treshold * 100)} %
          </label>
        </div>
      </div>
    </div>
  );
};

export default TresholdSelector;

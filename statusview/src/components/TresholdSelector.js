import React from 'react'

const TresholdSelector = ({handleTresholdChange, chartWidth, treshold, title, tresholdCount}) => {

  if ( tresholdCount >= 0) {
    // Update line place:
    const refLine = document.querySelector("#treshold-line")
    const studentBars = document.querySelectorAll("path.recharts-rectangle")
    if (refLine !== null && studentBars !== undefined) {

      const leftEdge = document.querySelector(".recharts-layer.recharts-cartesian-axis.recharts-yAxis.yAxis")
      const leftOffset = leftEdge !== undefined ? leftEdge.getBoundingClientRect().width : 0

      const studentBar = (tresholdCount === 0) ? studentBars[0] : studentBars[tresholdCount-1]
      if (studentBar !== undefined) {
        refLine.style.marginLeft = tresholdCount === 0 ?
          `${studentBar.getBoundingClientRect().x - leftOffset - 15}px` : 
          `${studentBar.getBoundingClientRect().x - leftOffset - 3}px`
      }
    }
  }

  const handleChecker = (event) => {

    const refLine = document.querySelector("#treshold-line")
    if (refLine !== null) {
      refLine.style.display = event.target.checked ? "block" : "None"

      document.querySelector("#treshold-wrapper").style.display = event.target.checked ? "flex" : "None"
    }

    handleTresholdChange(treshold)
  }
  
  return (
    <div style={{display: "flex", flexDirection: "row", marginBottom: "2em"}} className="intended">
      
      <input style={{marginLeft: "0", marginRight: "1em"}}
              type="checkbox" onClick={(event) => handleChecker(event)}>
      </input>
      
      <div style={{display: "flex", flexDirection: "column"}}>
        <label htmlFor="treshold-slider" style={{fontSize: "large"}}>{title}</label>

        <div style={{display: "None", flexDirection: "row", marginTop: "0.5em"}} id="treshold-wrapper">
          <div style={{display: "block", paddingRight: "0.5em"}}>Expected completion rate: 0 %</div>
          
          <input min="0" max="1" type="range" step="0.01" value={treshold}
                onChange={(event) => handleTresholdChange(event.target.value)}
                style={{width: chartWidth*0.1}} id="treshold-slider"></input>
          
          <div style={{display: "block", paddingLeft: "0.5em", paddingRight: "0.5em"}}>100 %,</div>
          
          <label htmlFor="treshold-slider">current: {Math.round(treshold*100)} %</label>
        </div>
      </div>
    </div>
  )
}

export default TresholdSelector
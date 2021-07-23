/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { VerticalGridLines, HorizontalGridLines, XAxis, FlexibleWidthXYPlot, YAxis, LineSeries, AreaSeries, Hint, RadarChart } from "react-vis";
import ConfigDialog from "./ConfigDialog";
import ConfigurableFieldSelector from "./ConfigrableFieldSelector";
import "../../node_modules/react-vis/dist/style.css";
import { getPropertiesDomain, getCurveType, extractData } from "../helper/integratedData";
import { Grid } from "@material-ui/core";

const VisGraph = ({ data, configs, displayedWeek }) => {
    const dataInTimeframe =data.filter(week => week.index < displayedWeek[1] && week.index >= displayedWeek[0] - 1);
    const segments = extractData(dataInTimeframe, configs);
    const [hintTooltipValue, setHintTooltipValue] = useState(false);
    const [openRadarChart, setOpenRadarChart] = useState(false);
    const domainProperties = getPropertiesDomain(data);
    const selectableFields = [
        "Attemped exercises",
        "NO submissions",
        "NO commits",
        "Points",
        "p/maxp ratio",
    ];
    const [selectedDisplayFields, setSelectedDisplayFields] = useState(selectableFields);
    const [dataRadarChart, setDataRadarChart] = useState({});
    const [radarChartDomain, setRadarChartDomain] = useState({});

    const tickValues = [];
    for (let i=displayedWeek[0]; i <= displayedWeek[1]; i++){
        tickValues.push(i);
    }

    return (
    <FlexibleWidthXYPlot height={500}>
        <ConfigDialog showButton={false} openDialog={openRadarChart}
            title={{
                dialog: "Week performance",
                confirm: "Close"
            }}
            setOpenDialog={(open) => setOpenRadarChart(open)}
            fullWidth={true}
        >
            <Grid
            container
            direction="row"
            alignItems="center"
            >
                <Grid item>
                    <RadarChart
                        data={[selectedDisplayFields.reduce( (obj, key) => {obj[key] = dataRadarChart[key]; return obj;}, {})]}
                        domains={selectedDisplayFields.map( key => ({ name: key, domain: radarChartDomain[key] }))}
                        height={400}
                        width={400}
                        margin={{ left: 80, right: 80, top: 50, bottom: 20 }}
                    />
                </Grid>
                <Grid item>
                    <ConfigurableFieldSelector
                    selected={selectedDisplayFields}
                    setSelected={setSelectedDisplayFields}
                    allSelections={selectableFields}
                    />
                </Grid>
            </Grid>
        </ConfigDialog>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickValues={tickValues}/>
        <YAxis />
        {hintTooltipValue && <Hint value={hintTooltipValue} /> }
        {
            segments.map( (segment, index) => {
                const Series = segment.colorFilled === "#ffffff" ? LineSeries : AreaSeries;
                const weekData = data[segment.index];
                const dataTooltip = {
                    "Week": weekData.index + 1,
                    "Pass status": JSON.stringify(weekData.passed),
                    "Point to pass": weekData.pointsTopass,
                    "Max points": weekData.maxPoints,
                    "Number of submissions": weekData.submission,
                    "Expected number of submissions": weekData.expectedSubmissions.toFixed(2),
                    "Number of commits": weekData.commit,
                    "Expected number of commit": weekData.expectedCommit.toFixed(2),
                    "Points": weekData.points,
                    "Expected points": weekData.expectedPoints.toFixed(2),
                    "Missed points": weekData.notPassedPoints,
                    "Number of exercises": weekData.numberOfExercises,
                    "Number of attemped exercises": weekData.numberOfExercisesAttemped,
                    "Expected number of exercises": weekData.expectedExercises.toFixed(2),
                    "Points / maxpoints ratio": weekData.pointRatio.toFixed(2),
                };
                // use new data to reduce axis name
                const currentDataRadarChart = {
                    "Attemped exercises": weekData.numberOfExercisesAttemped,
                    "NO submissions": weekData.submission,
                    "NO commits": weekData.commit,
                    "Points": weekData.points,
                    "p/maxp ratio": weekData.pointRatio,
                };

                const currentRadarChartDomain = {
                    ...domainProperties,
                    "Attemped exercises": [0, dataTooltip["Number of exercises"]],
                    "Points": [0, dataTooltip["Max points"]],
                };

                const segmentProps = {
                    data: segment.data,
                    color: segment.color,
                    fill: segment.colorFilled === "#ffffff" ? null : segment.colorFilled,
                    curve: getCurveType(segment.shape),
                    onSeriesMouseOver: () => setHintTooltipValue({ ...dataTooltip, x: segment.index + 1, y: 0 }),
                    onSeriesMouseOut: () => setHintTooltipValue(false),
                    onSeriesClick: () => {
                        setDataRadarChart(currentDataRadarChart);
                        setRadarChartDomain(currentRadarChartDomain);
                        setOpenRadarChart(true);
                        },
                };
                return (<Series key={`segment-${index}`} {...segmentProps}/>);
            })
        }
    </FlexibleWidthXYPlot>
    );
};

export default VisGraph;
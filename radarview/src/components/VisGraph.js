/* eslint-disable react/prop-types */
import React from "react";
import { RadarChart } from "react-vis";

import "../../node_modules/react-vis/dist/style.css";
import { getPropertiesDomain } from "../helper/integratedData";
import { Grid, Box } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

const VisGraph = ({ data, configs, displayedWeek }) => {
    const domainProperties = getPropertiesDomain(data);

    const weekIndices = [];
    for (let i=displayedWeek[0]; i <= displayedWeek[1]; i++){
        weekIndices.push(i);
    }

    return (
        <Grid container direction="row" alignItems="center">
            {weekIndices.map((index) => {
                const weekData = data[index-1]; //different in starting index
                const dataRadarChart = {
                    "Attemped exercises": weekData.numberOfExercisesAttemped,
                    "NO submissions": weekData.submission,
                    "NO commits": weekData.commit,
                    "Points": weekData.points,
                    "p/maxp ratio": weekData.pointRatio,
                };
                const radarChartDomain = {
                    ...domainProperties,
                    "Attemped exercises": [0, weekData.numberOfExercises],
                    "Points": [0, weekData.maxPoints],
                };

                return (
                    <Grid item key={`radarchart-index-${index}`}>
                        <Box border={1}>
                            <h1 style={{ textAlign: "center" }}>Week {index}</h1>
                            {
                                Object.entries(radarChartDomain).length !== 0 &&
                                <RadarChart
                                data={[configs.reduce( (obj, key) => {obj[key] = dataRadarChart[key]; return obj;}, {})]}
                                domains={configs.map( key => ({ name: key, domain: radarChartDomain[key] }))}
                                height={300}
                                width={300}
                                margin={{ left: 80, right: 80, top: 50, bottom: 20 }}
                                />
                            }
                            {
                                weekData.passed ?
                                <DoneIcon style={{ position: "relative", left: "250px", color: "green" }} /> :
                                <CloseIcon style={{ position: "relative", left: "250px", color: "red" }} />
                            }
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default VisGraph;
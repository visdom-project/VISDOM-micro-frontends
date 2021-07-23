/* eslint-disable no-unused-vars */
import { curveBumpX } from "d3-shape";
import { REVERSE_TYPE_MAPPING, EXPECTED_TYPE_MAPPING } from "./constants";

export const getCurveType = (curve) => {
    switch (curve){
        case "triangle":
            return "curveLinear";
        case "rectangle":
            return "curveStepAfter";
        case "pulse":
            // might be wrong curve
            return curveBumpX;
        default:
            return;
    }
};

// eslint-disable-next-line no-unused-vars
export const getValFunction = (valueType) => {
    return (value, limit=1) => value / limit;
};

export const getDirectionFunction = (direction) => {
    switch (direction){
        case "up":
            return (value, prev) => ({
                ...prev,
                y: prev.y + value,
            });
        case "down":
            return (value, prev) => ({
                ...prev,
                y: prev.y - value,
            });
        case "horizontal":
            return (value, prev) => ({
                ...prev,
                x: prev.x + value,
            });
    }
};

export const getPropertiesDomain = (data) => {
    const maximumSubmissions = data.reduce( (max, week) => week["submission"] > max ? week["submission"] : max, 0);
    const maxCommits = data.reduce( (max, week) => week["commit"] > max ? week["commit"] : max, 0);
    return {
        "p/maxp ratio": [0, 1],
        "NO submissions": [0, maximumSubmissions],
        "NO commits": [0, maxCommits],
    };
};

export const extractData = (data, configs) => {

    if (data.length === 0 || configs.length === 0) {
        return [];
    }
    const y0 = 0;

    //extract maximum value
    let maximumRelativeData = { ...data[0] };
    data.map(week => {
        Object.keys(week).map(dataType => {
            if (week[dataType] > maximumRelativeData[dataType]){
                maximumRelativeData[dataType] = week[dataType];
            }
        });
    });

    const integratedData = data.map( week => {
        let lastPoint = { x: 0, y: 0, y0: y0 };
        const weekData = configs.map(config => {

            //dataType:
            let dataType = REVERSE_TYPE_MAPPING[config.type];
            let dataValue = week[dataType];
            //value type: absolute/relative/expected
            const valueType = config["value"];
            let limit = 1;
            switch (valueType) {
                case "absolute":
                    limit = 1;
                    break;
                case "relative":
                    limit = maximumRelativeData[dataType];
                    break;
                case "expected ratio":
                    limit = week[EXPECTED_TYPE_MAPPING[dataType]];
                    break;
                default:
                    break;
            }
            //make sure no 0 division.
            if (limit === 0 || !limit){
                limit = 1;
            }
            const { direction, shape, color, colorFilled, resetZero } = config;

            const coordData = [];
            coordData.push(lastPoint);
            const centreValue = getValFunction()(dataValue, limit);
            //step to next point in x-axis

            if (direction !== "horizontal")
            {
                lastPoint = { ...lastPoint, x: lastPoint.x + 1 };
            }
            lastPoint = getDirectionFunction(direction)(centreValue, lastPoint);
            coordData.push(lastPoint);
            if (resetZero === "yes") {
                lastPoint = { x: lastPoint.x +1, y: 0, y0: y0 };
                coordData.push(lastPoint);
            }
            return {
                data: coordData,
                shape: shape,
                color: color,
                colorFilled: colorFilled,
            };
        });
        const index = week.index;
        const lastIndex = lastPoint.x;
        const start = 0.2;
        const end = 0.8;
        const interval = 0.6;

        return weekData.map( segment => {
            const segmentData = segment.data;
            const augumentedData = segmentData.map(coord => ({
                ...coord,
                x: coord.x / lastIndex * interval + start,
            }));
            return { ...segment, data: augumentedData, index: index };
        });
    });

    const defaultColor = "#000000";
    const defaultColorFilled = "#ffffff";
    const startData = [
        { x: 0, y:0, y0: 0 },
        { x: 0.2, y:0, y0: 0 },
    ];
    const endData = [
        { x: 0.8, y:0, y0: 0 },
        { x: 1, y:0, y0: 0 },
    ];
    const startSegment = {
        data: startData,
        shape: "triangle",
        color: defaultColor,
        colorFilled: defaultColorFilled,
    };
    const endSegment = {
        data: endData,
        shape: "triangle",
        color: defaultColor,
        colorFilled: defaultColorFilled,
    };
    for (let i=0; i < integratedData.length; i++) {
        // index control is not so good here as data logic
        integratedData[i].splice(0, 0, { ...startSegment, index: integratedData[i][0].index });

        const weekLastSegment = integratedData[i][integratedData[i].length-1].data;
        const weekLastPoint = weekLastSegment[weekLastSegment.length-1];
        const newEndSegmentData = [...endData];
        newEndSegmentData.splice(0, 0, weekLastPoint);
        integratedData[i].push({ ...endSegment, data: newEndSegmentData, index: integratedData[i][0].index });
    }
    const augumentedSegments = integratedData.map( week => {
        return week.map(segment => ({
            ...segment,
            data: segment.data.map(coord => ({ ...coord, x: coord.x + segment.index + 1 })),
        }));
    });
    return augumentedSegments.flat();
};

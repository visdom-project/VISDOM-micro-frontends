/* eslint-disable react/prop-types */
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

import {
  Button,
  Grid,
} from "@material-ui/core";

const ConfigurableFieldSelector = ({ selected, setSelected, allSelections }) => {
    const unselected = allSelections.filter(selection => !selected.includes(selection));
    return (
        <Grid
            container
            direction="column"
            alignItems="center"
        >
                {
                    selected.map(selection => (
                        <Grid container direction="row" key={`unselected-${selection}`} justifyContent="flex-end" alignItems="center">
                            <Grid item xs={6}>
                                    {selection}
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    color="default"
                                    startIcon={<ClearIcon />}
                                    size="large"
                                    disableElevation
                                    onClick={() => {
                                        const newSelected = selected.filter( slc => slc !== selection);
                                        setSelected(newSelected);
                                    }}
                                    >
                                </Button>
                            </Grid>
                        </Grid>
                    ))
                }
                {
                    unselected.map( selection => (
                        <Grid container direction="row" key={`unselected-${selection}`} justifyContent="flex-end" alignItems="center">
                            <Grid item xs={6}>
                                {selection}
                            </Grid>
                            <Grid item xs={1}>
                                <Button
                                    variant="contained"
                                    color="default"
                                    startIcon={<AddIcon />}
                                    size="large"
                                    disableElevation
                                    onClick={() => {
                                        const newSelected = [...selected, selection];
                                        setSelected(newSelected);
                                    }}
                                    >
                                </Button>
                            </Grid>
                        </Grid>
                    ))
                }
        </Grid>
    );
};

export default ConfigurableFieldSelector;
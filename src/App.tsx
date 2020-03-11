import React from 'react';
import SensorChart from "./SensorChart";
import {temperatureData} from "./Data";
import {createMuiTheme, MuiThemeProvider, Theme, withStyles, createStyles, WithStyles} from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "white",
            main: "#029E74",
            dark: "rgba(0,0,0,0.3)",
        },
        secondary: {
            light: "white",
            main: "#42BE9D",
            dark: "rgba(0,0,0,0.3)",
        },
    },
    spacing: 4,
});

const styles = createStyles({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: theme.palette.primary.light,
    }
});

const App: React.FunctionComponent<WithStyles<typeof styles>> = props => {
    return <MuiThemeProvider theme={theme}>
        <div className={props.classes.root}>
            <SensorChart data={temperatureData}/>
        </div>
    </MuiThemeProvider>
};

export default withStyles(styles)(App);

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PointTooltipProps, ResponsiveLine, Serie} from "@nivo/line";
import {
    Theme,
    withStyles,
    createStyles,
    WithStyles,
    useTheme
} from "@material-ui/core";
import {Scale} from '@nivo/scales'
import {AxisProps} from '@nivo/axes'
import {getStdDeviation} from "./Utils";

const styles = (theme: Theme) => createStyles({
    chartRoot: {
        padding: theme.spacing(6),
        borderRadius: theme.spacing(2),
        backgroundColor: "white",
        width: 620,
        height: 240,
        border: "1px solid rgba(0,0,0,0.15)",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
            border: "1px solid " + theme.palette.primary.main,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
        }
    },
    toolTip: {
        backgroundColor: "white",
        border: "2px solid " + theme.palette.primary.main,
        borderRadius: theme.spacing(2),
        padding: theme.spacing(2),
        fontFamily: "Helvetica",
        fontSize: 12,
        color: theme.palette.primary.main,
        fontWeight: "bold",
        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
        marginBottom: theme.spacing(2),

    }
});


interface SensorReading {
    value: number,
    time: number,
}

interface PlotProps extends WithStyles<typeof styles> {
    data: SensorReading[],
}

const SensorChart: React.FunctionComponent<PlotProps> = props => {

    const {classes} = props;
    const theme = useTheme();
    const [hover, setHover] = useState<boolean>(false);
    const [series, setSeries] = useState<Serie[]>([]);
    const [minY, setMinY] = useState(0);
    const [maxY, setMaxY] = useState(0);

    const light = theme.palette.primary.main;
    const dark = theme.palette.primary.dark;

    const chartTheme = useCallback(() => {

        return {
            grid: {
                line: {
                    stroke: "rgba(0,0,0,0.05)",
                }
            },
            axis: {
                legend: {
                    text: {
                        fill: hover ? light : dark,
                        fontSize: 12,
                    }
                },
                ticks: {
                    text: {
                        fill: "rgba(0,0,0,0.3)",
                        fontSize: 12,
                    },
                    line: {
                        stroke: "rgba(0,0,0,0.3)",
                        strokeWidth: 1,
                    }
                },
                domain: {
                    line: {
                        stroke: "rgba(0,0,0,0.1)",
                        strokeWidth: 1,
                    }
                },
            },
            crosshair: {
                line: {
                    stroke: 'rgba(0,0,0,0.5)',
                    strokeWidth: 1,
                    strokeOpacity: 0.35,
                },
            }
        }
    }, [hover]);

    useEffect(() => {

        setSeries([{
            id: "Temperature",
            data: props.data
                .sort((r1, r2) => r1.time - r2.time)
                .map(reading => {
                    return {
                        x: reading.time,
                        y: reading.value,
                    }
                }),
        }]);

        let yValues = props.data.map(d => d.value);
        let minValue = yValues.reduce((v1, v2) => v1 > v2 ? v2 : v1);
        let maxValue = yValues.reduce((v1, v2) => v1 > v2 ? v1 : v2);
        setMinY(minValue - getStdDeviation(yValues));
        setMaxY(maxValue + getStdDeviation(yValues));

    }, [props.data]);

    const yScale = useCallback((): Scale => {
        return {
            type: "linear",
            min: minY,
            max: maxY,
        }
    }, [minY, maxY]);

    const xScale: Scale = {
        type: "time",
        precision: "minute",
        format: "%s",
    };

    let margin = {
        top: 10,
        right: 0,
        bottom: 30,
        left: 40
    };

    const axisBottom: AxisProps = {
        format: "%H:%M",
        tickValues: 5,

    };

    const axisLeft: AxisProps = {
        legend: "Temperature",
        legendOffset: -32,
        legendPosition: "middle",
        tickSize: 0,
        tickValues: 2,
        tickPadding: 4,
    };

    const toolTipElement = (props: PointTooltipProps) => {
        return <div className={classes.toolTip}>
            {props.point.data.y} °C
        </div>
    };

    return <div className={classes.chartRoot}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}>

        <ResponsiveLine
            curve={"monotoneX"}
            data={series}
            theme={chartTheme()}
            colors={[hover ? light : dark]}
            enableGridY={hover}
            enableGridX={hover}
            margin={margin}
            yScale={yScale()}
            xScale={xScale}
            axisBottom={axisBottom}
            axisLeft={axisLeft}
            lineWidth={1}
            pointSize={0}
            useMesh={true}
            crosshairType="cross"
            tooltip={toolTipElement}
        />
    </div>
};


export default withStyles(styles)(SensorChart);
<script lang="ts">
    import { onMount } from "svelte";
    import axios from "axios";
    let responseTimes: [];

    const padTwoDigits = (digits: number): string => {
        return digits < 10 ? "0" + digits.toString() : digits.toString();
    };

    const getDateStringFromTimestamp = (timestamp: string): string => {
        const datetime = new Date(timestamp);
        console.log(datetime);
        return (
            datetime.getFullYear().toString() +
            "-" +
            padTwoDigits(datetime.getMonth() + 1) + // Month is an index from 0 - 11
            "-" +
            padTwoDigits(datetime.getDate()) +
            " " +
            padTwoDigits(datetime.getHours()) +
            ":" +
            padTwoDigits(datetime.getMinutes()) +
            ":" +
            padTwoDigits(datetime.getSeconds())
        );
    };

    onMount(async () => {
        const body = {
            qualName: "func1",
            filePath: "app.py",
            prevDays: 10,
        };

        const responseData: [] = (
            await axios.post(
                "http://127.0.0.1:8000/get_all_for_function",
                body,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
        ).data;

        console.log(responseData);
        responseTimes = responseData;

        const times = responseTimes.map((t) => t.responseTime);

        // const layout = {
        //     // autosize: true,
        //     margin: {
        //         l: 30,
        //         r: 30,
        //         b: 50,
        //         t: 50,
        //         pad: 10,
        //     },
        //     // paper_bgcolor: "#606060",
        //     // plot_bgcolor: "#a0a0a0",
        // };

        const histogramDiv = document.getElementById("histogram");
        const histogramData = [
            {
                x: times,
                type: "histogram",
            },
        ];
        let Plot1 = new Plotly.newPlot(histogramDiv, histogramData, layout);

        const timeStamps = responseTimes.map((t) =>
            getDateStringFromTimestamp(t.timestamp)
        );

        console.log(timeStamps);

        const timeseriesDiv = document.getElementById("timeseries");
        const timeseriesData = [
            {
                x: timeStamps,
                y: times,
                type: "scatter",
            },
        ];

        let Plot2 = new Plotly.newPlot(timeseriesDiv, timeseriesData, layout);
    });
</script>

<svelete:head>
    <script
        src="https://cdn.plot.ly/plotly-2.12.1.min.js"
        charset="utf-8"
    ></script>
</svelete:head>

<h1>hello</h1>

<div id="histogram" style="width:100%;height:300px;" />

<div id="timeseries" style="width:100%;height:300px;" />

<style>
    h1 {
        color: green;
    }
    #histogram {
        color: red;
    }
</style>

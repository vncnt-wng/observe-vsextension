<script lang="ts">
    import Plotly from "plotly.js-dist";
    import RangeSlider from "svelte-range-slider-pips";
    import { onMount } from "svelte";
    import axios from "axios";

    let qualName = "";
    let filePath = "";

    // Map of "{qualName}:{filePath}" to all relevant responseTimeData
    let allResponseTimes: Map<string, []> = new Map();
    // Response times for selected trace (function)
    let responseTimes: [] = [];
    let commitResponseTimes: [] = [];

    // Updated by assigning a new map - no issues with svelte reactivity
    let commitDetails: Map<string, string> = new Map();

    let selectedCommitId: string = "all";

    let minDate: number;
    let maxDate: number;
    let displayedDateRange: [number, number];

    $: if (responseTimes.length > 0) {
        commitResponseTimes = filterResponseTimeDisplayToCommit(
            responseTimes,
            selectedCommitId
        );
        updateDateRangeToCommit(commitResponseTimes);
    }

    $: if (commitResponseTimes.length > 0) {
        const displayedResponseTimes = filterResponseTimeDisplayToDateSelection(
            commitResponseTimes,
            displayedDateRange
        );
        updateFigures(displayedResponseTimes);
    }

    const filterResponseTimeDisplayToDateSelection = (
        responseTimes: [],
        displayedDateRange: [number, number]
    ): [] => {
        const filteredTimes = responseTimes.filter((r) => {
            const dateVal = new Date(r.timestamp).valueOf();
            return (
                dateVal > displayedDateRange[0] &&
                dateVal < displayedDateRange[1]
            );
        });

        return filteredTimes;
    };

    const filterResponseTimeDisplayToCommit = (
        responseTimes: [],
        selectedCommitId: string
    ): [] => {
        const filteredTimes = responseTimes.filter((r) =>
            selectedCommitId === "all" ? true : r.commit_id === selectedCommitId
        );

        return filteredTimes;
    };

    const padTwoDigits = (digits: number): string => {
        return digits < 10 ? "0" + digits.toString() : digits.toString();
    };

    const getDateStringFromTimestamp = (timestamp: string): string => {
        const datetime = new Date(timestamp);
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

    const updateDateRangeToCommit = (responseTimes: []): void => {
        const [min, max] = responseTimes.reduce(
            ([min, max], val) => {
                const dateVal = new Date(val.timestamp).valueOf();
                return [Math.min(min, dateVal), Math.max(max, dateVal)];
            },
            [Number.MAX_VALUE, Number.MIN_VALUE]
        );
        minDate = new Date(min).valueOf();
        maxDate = new Date(max).valueOf();

        displayedDateRange = [minDate, maxDate];
    };

    const updateCommitDetails = (responseTimes: []): void => {
        const newCommitDetails: Map<string, string> = new Map();
        newCommitDetails.set("all", "all");
        for (const responseTime of responseTimes) {
            if (!newCommitDetails.has(responseTime.commit_id)) {
                const detailString =
                    responseTime.branch +
                    " - " +
                    responseTime.commit_id +
                    ": " +
                    responseTime.commit_message;
                newCommitDetails.set(responseTime.commit_id, detailString);
            }
        }
        commitDetails = newCommitDetails;
    };

    // Switch panel to look at new data
    const switchPanelFoxus = async (qualName: string, filePath: string) => {
        if (allResponseTimes.has(qualName + ":" + filePath)) {
            responseTimes = allResponseTimes.get(qualName + ":" + filePath)!;
        } else {
            const body = {
                qualName: qualName,
                filePath: filePath,
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
            responseTimes = responseData;
            commitResponseTimes = responseTimes;
            allResponseTimes.set(qualName + ":" + filePath, responseTimes);
        }

        // displayedResponseTimes = responseTimes;
        updateCommitDetails(responseTimes);
        selectedCommitId = "all";
    };

    const updateFigures = (displayedResponseTimes) => {
        const times = displayedResponseTimes.map((t) => t.responseTime);

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
        let Plot1 = new Plotly.newPlot(histogramDiv, histogramData);

        const timeStamps = displayedResponseTimes.map((t) =>
            getDateStringFromTimestamp(t.timestamp)
        );

        const timeseriesDiv = document.getElementById("timeseries");
        const timeseriesData = [
            {
                x: timeStamps,
                y: times,
                type: "scatter",
            },
        ];

        let Plot2 = new Plotly.newPlot(timeseriesDiv, timeseriesData);
    };

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "switch-focus":
                    console.log("MESSAGE GOT");
                    let split = message.value.split(":");
                    console.log(split);
                    qualName = split[0];
                    filePath = split[1];
                    await switchPanelFoxus(split[0], split[1]);
            }
        });
    });
</script>

<h2><b>{qualName}</b>:{filePath}</h2>

{#if commitDetails.size > 0}
    <select bind:value={selectedCommitId}>
        {#each [...commitDetails.keys()] as commitId}
            <option value={commitId}>{commitDetails.get(commitId)}</option>
        {/each}
    </select>
{/if}

{#if responseTimes.length > 0}
    <p>{new Date(displayedDateRange[0]).toUTCString()}</p>
    <p>{new Date(displayedDateRange[1]).toUTCString()}</p>

    <RangeSlider
        range
        pushy
        bind:values={displayedDateRange}
        min={minDate}
        max={maxDate}
    />
{/if}

<div id="histogram" style="width:100%;height:300px;" />

<div id="timeseries" style="width:100%;height:300px;" />

<style>
    h2 {
        color: green;
    }

    /* #histogram {
        color: red;
    } */
</style>

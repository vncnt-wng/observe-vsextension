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
    // Updated by assigning a new map - no issues with svelte reactivity
    let commitDetails: Map<string, string> = new Map();

    let selectedCommitId: string = "all";

    $: console.log("the selectedCommitId is " + selectedCommitId);
    $: if (responseTimes.length > 0) {
        console.log(responseTimes);
        const displayedResponseTimes = filterResponseTimeDisplayToSelection(
            responseTimes,
            selectedCommitId
        );
        console.log(displayedResponseTimes);
        updateFigures(displayedResponseTimes);
    }

    // updates displayedResponseTimes
    const filterResponseTimeDisplayToSelection = (
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
            console.log("Loaded old");
            responseTimes = allResponseTimes.get(qualName + ":" + filePath)!;
        } else {
            console.log("Got new");
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

        console.log(timeStamps);

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

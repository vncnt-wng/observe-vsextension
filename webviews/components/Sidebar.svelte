<script lang="ts">
    import Plotly from "plotly.js-dist";
    import RangeSlider from "svelte-range-slider-pips";
    import { onMount } from "svelte";
    import axios from "axios";
    import FlameNode from "./FlameNode.svelte";

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

    let filterTimesGreaterThan: number = 0;

    let minDate: number;
    let maxDate: number;
    let displayedDateRange: [number, number];

    // Map of "{qualName}:{filePath}" to times for descendants
    let descendantsResponseTimes: Map<string, []> = new Map();

    let flameGraphTree: FlameDataNode | undefined = undefined;

    let openSections: Map<string, boolean> = new Map(
        Object.entries({
            filters: true,
            figures: true,
            flame: true,
            params: true,
        })
    );

    type FlameDataNode = {
        funcId: string;
        meanTime: number;
        percentage: number;
        children: FlameDataNode[];
    };

    $: if (responseTimes.length > 0) {
        commitResponseTimes = filterResponseTimeDisplayToCommit(
            responseTimes,
            selectedCommitId
        );
        updateDateRangeToCommit(commitResponseTimes);
    }

    $: if (commitResponseTimes.length > 0) {
        console.log(filterTimesGreaterThan);
        const displayedResponseTimes = filterResponseTimeDisplayToSelection(
            commitResponseTimes,
            displayedDateRange,
            filterTimesGreaterThan
        );
        const meanResponseTimeForSelection =
            displayedResponseTimes.reduce(
                (acc, curr) => acc + curr.responseTime,
                0
            ) / displayedResponseTimes.length;
        updateFigures(displayedResponseTimes);
        if (descendantsResponseTimes) {
            generateFlameGraphData(
                selectedCommitId,
                displayedDateRange,
                meanResponseTimeForSelection
            );
        }
    }

    const filterResponseTimeDisplayToSelection = (
        responseTimes: [],
        displayedDateRange: [number, number],
        filterTimesGreaterThan: number
    ): [] => {
        const filteredTimes = responseTimes.filter((r) => {
            const dateVal = new Date(r.timestamp).valueOf();
            return (
                dateVal > displayedDateRange[0] &&
                dateVal < displayedDateRange[1] &&
                r.responseTime > filterTimesGreaterThan
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

    const generateFlameGraphData = (
        selectedCommitId: string,
        displayedDateRange: [number, number],
        meanResponseTimeForSelection: number
    ) => {
        // const meanTimeByFuncId = new Map<string, number>();
        // used to generate the tree
        const childrenByParent = new Map<string, string[]>();

        let newFlameGraphTree: FlameDataNode = {
            funcId: getFuncId(),
            meanTime: meanResponseTimeForSelection,
            percentage: 100,
            children: [],
        };

        const nodesByFuncId = new Map<string, FlameDataNode>();
        for (const [path, descendantTimes] of Object.entries(
            descendantsResponseTimes
        )) {
            // All descendants will have a parent. Because of how we get data from mongo
            const pathList = path.split(",");
            // parent is the second last entry in the path
            const parent = pathList[pathList.length - 2];
            const functionId = pathList[pathList.length - 1];

            const meanTime =
                descendantTimes
                    .filter((r) => {
                        const dateVal = new Date(r.timestamp).valueOf();
                        return (
                            dateVal > displayedDateRange[0] &&
                            dateVal < displayedDateRange[1] &&
                            (selectedCommitId === "all"
                                ? true
                                : r.commit_id === selectedCommitId)
                        );
                    })
                    .reduce((acc, curr) => curr.responseTime + acc, 0) /
                descendantTimes.length;

            // meanTimeByFuncId.set(functionId, meanTime);
            if (childrenByParent.has(parent)) {
                childrenByParent.get(parent)!.push(functionId);
            } else {
                childrenByParent.set(parent, [functionId]);
            }

            const flameNode = {
                funcId: functionId,
                meanTime: meanTime,
                percentage: (meanTime / meanResponseTimeForSelection) * 100,
                children: [],
            };
            nodesByFuncId.set(functionId, flameNode);
        }

        newFlameGraphTree = generateFlameGraphTree(
            getFuncId(),
            newFlameGraphTree,
            childrenByParent,
            nodesByFuncId
        );

        flameGraphTree = newFlameGraphTree;
    };

    // recursively generate the tree from flat structures
    const generateFlameGraphTree = (
        funcId: string,
        flameNode: FlameDataNode,
        childrenByParent: Map<string, string[]>,
        nodesByFuncId: Map<string, FlameDataNode>
    ): FlameDataNode => {
        if (childrenByParent.has(funcId)) {
            const children = [];
            for (const childFuncId of childrenByParent.get(funcId)!) {
                children.push(
                    generateFlameGraphTree(
                        childFuncId,
                        nodesByFuncId.get(childFuncId)!,
                        childrenByParent,
                        nodesByFuncId
                    )
                );
            }
            flameNode.children = children;
        }

        return flameNode;
    };

    const padTwoDigits = (digits: number): string => {
        return digits < 10 ? "0" + digits.toString() : digits.toString();
    };

    const getFuncId = (): string => {
        return qualName + ":" + filePath;
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

    const getResponseTimesForDescendants = async (spanIds: string[]) => {
        const body = {
            rootPath: getFuncId(),
        };
        const responseData = (
            await axios.post("http://127.0.0.1:8000/get_trace_trees", body, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).data;
        descendantsResponseTimes = responseData.timesByPath;
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

            await getResponseTimesForDescendants(
                responseTimes.map((r) => r.spanId)
            );
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

    const sectionOnClick = (id: string) => {
        const newOpenSections = new Map(openSections);
        newOpenSections.set(id, !newOpenSections.get(id)!);
        openSections = newOpenSections;
        console.log(openSections);
    };

    onMount(async () => {
        window.addEventListener("message", async (event) => {
            const message = event.data;
            switch (message.type) {
                case "switch-focus":
                    let split = message.value.split(":");
                    qualName = split[0];
                    filePath = split[1];
                    await switchPanelFoxus(split[0], split[1]);
            }
        });
        console.log(openSections);
    });
</script>

{#if qualName === ""}
    <h2>Click on a function codelens to view more info</h2>
{:else}
    <h2><b>{qualName}</b>:{filePath}</h2>

    <h3
        id="filters"
        on:click={(e) => sectionOnClick(e.target.id)}
        on:keyup={() => {}}
    >
        Filters
    </h3>

    {#if openSections.get("filters")}
        <p>Filter by commit</p>
        {#if commitDetails.size > 0}
            <select bind:value={selectedCommitId} style="width: 100%;">
                {#each [...commitDetails.keys()] as commitId}
                    <option value={commitId}
                        >{commitDetails.get(commitId)}</option
                    >
                {/each}
            </select>
        {/if}

        <p>Filter Response Time (ms) Greater Than</p>
        <input bind:value={filterTimesGreaterThan} />

        <p>Filter Datetime Range</p>
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
    {/if}

    <h3
        id="figures"
        on:click={(e) => sectionOnClick(e.target.id)}
        on:keyup={() => {}}
    >
        Figures
    </h3>

    {#if openSections.get("figures")}
        <div id="histogram" style="width:100%;height:280px;" />

        <div id="timeseries" style="width:100%;height:280px;" />
    {/if}

    <h3
        id="flame"
        on:click={(e) => sectionOnClick(e.target.id)}
        on:keyup={() => {}}
    >
        Function Call Breakdown
    </h3>

    {#if openSections.get("flame")}
        {#if flameGraphTree}
            <FlameNode {...flameGraphTree} />
        {/if}
    {/if}

    <h3
        id="params"
        on:click={(e) => sectionOnClick(e.target.id)}
        on:keyup={() => {}}
    >
        Parameters
    </h3>

    {#if openSections.get("params")}{/if}
{/if}

<style>
    h2 {
        color: green;
    }
    h3 {
        color: lightseagreen;
    }

    /* #histogram {
        color: red;
    } */
</style>

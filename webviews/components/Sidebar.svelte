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
	let descendantsTimesByPathByExecutionPath: Map<
		string,
		Map<string, []>
	> = new Map();

	let flameGraphTreesByExecutionPath: Map<string, FlameDataNode> = new Map();
	let proportionOfCallsByExecutionPath: Map<string, number> = new Map();

	let selectedParameter: string = "";
	let parametersByName: Map<string, object[]> = new Map();

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
		const displayedResponseTimes = filterResponseTimeDisplayToSelection(
			commitResponseTimes,
			displayedDateRange,
			filterTimesGreaterThan
		);
		updateFigures(displayedResponseTimes);

		if (Object.keys(descendantsTimesByPathByExecutionPath).length > 0) {
			generateFlameGraphData(displayedDateRange, displayedResponseTimes);
		}
		groupParametersByName(displayedResponseTimes);
	}

	const groupParametersByName = (responseTimes) => {
		const newParamMap = new Map<string, object[]>();

		for (const responseTime of responseTimes) {
			for (const arg of responseTime.args) {
				if (newParamMap.has(arg.key)) {
					newParamMap.get(arg.key)!.push(arg.value);
				} else {
					newParamMap.set(arg.key, [arg.value]);
				}
			}
		}

		parametersByName = newParamMap;
	};

	const filterResponseTimeDisplayToSelection = (
		responseTimes: [],
		displayedDateRange: [number, number],
		filterTimesGreaterThan: number
	): [] => {
		const filteredTimes = responseTimes.filter((r) => {
			const dateVal = new Date(r.timestamp).valueOf();
			return (
				dateVal >= displayedDateRange[0] &&
				dateVal <= displayedDateRange[1] &&
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
		displayedDateRange: [number, number],
		displayedResponseTimes: []
	) => {
		const callsByExecutionPath = new Map<string, number>();
		let totalCount = 0;

		const meanTimesByExecutionPath = new Map<string, number>();
		// Iterate through root traces
		for (const responseTime of displayedResponseTimes) {
			const executionPath = responseTime.executionPathString;

			// for calculating mean time of the tree
			if (meanTimesByExecutionPath.has(executionPath)) {
				meanTimesByExecutionPath.set(
					executionPath,
					meanTimesByExecutionPath.get(executionPath) +
						responseTime.responseTime
				);
			} else {
				meanTimesByExecutionPath.set(
					executionPath,
					responseTime.responseTime
				);
			}

			// for calculating proportion of calls taking each execution path
			totalCount += 1;
			if (callsByExecutionPath.has(executionPath)) {
				callsByExecutionPath.set(
					executionPath,
					callsByExecutionPath.get(executionPath) + 1
				);
			} else {
				callsByExecutionPath.set(executionPath, 1);
			}
		}

		console.log(displayedResponseTimes);
		console.log(meanTimesByExecutionPath);

		const timeProportionsByExecutionPath = new Map();
		for (const [executionPath, count] of callsByExecutionPath) {
			timeProportionsByExecutionPath.set(
				executionPath,
				count / totalCount
			);
			meanTimesByExecutionPath.set(
				executionPath,
				meanTimesByExecutionPath.get(executionPath) / count
			);
		}

		console.log(meanTimesByExecutionPath);

		proportionOfCallsByExecutionPath = timeProportionsByExecutionPath;

		// Filter descendant times to relevant
		const filteredDescendantTimesByPathByExecutionPath = new Map();
		for (const [executionPath, timesByPath] of Object.entries(
			descendantsTimesByPathByExecutionPath
		)) {
			let totalTime = 0;
			const filteredTimesByPath = new Map();
			for (const [path, times] of Object.entries(timesByPath)) {
				const filteredTimes = times.filter((r) => {
					const dateVal = new Date(r.timestamp).valueOf();
					// date filtering caputres commit filtering, leave out commit filter here as it may filter incorrectly for different services
					return (
						dateVal >= displayedDateRange[0] &&
						dateVal <= displayedDateRange[1] &&
						r.responseTime > filterTimesGreaterThan
					);
				});
				if (filteredTimes.length > 0) {
					filteredTimesByPath.set(path, filteredTimes);
				}

				totalTime += filteredTimes.reduce(
					(acc, curr) => curr.responseTime + acc,
					0
				);
			}
			// If the filtered selection includes the current execution path
			if (filteredTimesByPath.size > 0) {
				filteredDescendantTimesByPathByExecutionPath.set(
					executionPath,
					filteredTimesByPath
				);
			}
		}

		const newFlameGraphTrees = new Map<string, FlameDataNode>();

		for (const [
			executionPath,
			timesByPath,
		] of filteredDescendantTimesByPathByExecutionPath) {
			// used to generate the tree
			const childrenByParent = new Map<string, string[]>();
			const meanRootTimeForSelectionAndExecutionPath =
				meanTimesByExecutionPath.get(executionPath)!;

			let newFlameGraphTree: FlameDataNode = {
				funcId: getFuncId(),
				meanTime: meanRootTimeForSelectionAndExecutionPath,
				percentage: 100,
				children: [],
			};

			const nodesByFuncId = new Map<string, FlameDataNode>();

			for (const [path, descendantTimes] of timesByPath) {
				// All descendants will have a parent. Because of how we get data from mongo
				const pathList = path.split(",");
				// parent is the second last entry in the path
				const parent = pathList[pathList.length - 2];
				const functionId = pathList[pathList.length - 1];

				console.log(descendantTimes);
				const meanTime =
					descendantTimes.reduce(
						(acc, curr) => curr.responseTime + acc,
						0
					) / descendantTimes.length;
				console.log(meanTime);

				// meanTimeByFuncId.set(functionId, meanTime);
				if (childrenByParent.has(parent)) {
					childrenByParent.get(parent)!.push(functionId);
				} else {
					childrenByParent.set(parent, [functionId]);
				}

				const flameNode = {
					funcId: functionId,
					meanTime: meanTime,
					percentage:
						(meanTime / meanRootTimeForSelectionAndExecutionPath) *
						100,
					children: [],
				};
				nodesByFuncId.set(functionId, flameNode);
			}

			newFlameGraphTrees.set(
				executionPath,
				generateFlameGraphTree(
					getFuncId(),
					newFlameGraphTree,
					childrenByParent,
					nodesByFuncId
				)
			);
			console.log(newFlameGraphTree);
		}
		// set instead of modifying for svelte reactivity
		flameGraphTreesByExecutionPath = newFlameGraphTrees;
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

	const getResponseTimesForDescendants = async () => {
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
		descendantsTimesByPathByExecutionPath = responseData.timesByPathByTree;
	};

	// Switch panel to look at new data
	const switchPanelFocus = async (
		newQualName: string,
		newFilePath: string
	) => {
		// descendantsResponseTimes = undefined;
		flameGraphTreesByExecutionPath = new Map();
		selectedCommitId = "all";
		selectedParameter = "";
		filterTimesGreaterThan = 0;
		qualName = newQualName;
		filePath = newFilePath;

		await getResponseTimesForDescendants();

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
	};

	const goToSymbol = async (qualName: string, filePath: string) => {
		console.log("here");
		console.log(tsvscode);
		tsvscode.postMessage({
			type: "goToSymbol",
			value: [qualName, filePath],
		});
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
		if (histogramDiv) {
			let Plot1 = new Plotly.newPlot(histogramDiv, histogramData);
		}
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
		if (timeseriesDiv) {
			let Plot2 = new Plotly.newPlot(timeseriesDiv, timeseriesData);
		}
	};

	const sectionOnClick = (id: string) => {
		const newOpenSections = new Map(openSections);
		newOpenSections.set(id, !newOpenSections.get(id)!);
		openSections = newOpenSections;
	};

	onMount(async () => {
		window.addEventListener("message", async (event) => {
			const message = event.data;
			switch (message.type) {
				case "switch-focus":
					let split = message.value.split(":");
					qualName = split[0];
					filePath = split[1];
					await switchPanelFocus(split[0], split[1]);
			}
		});
	});
</script>

<svelete:head>
	<script
		src="https://kit.fontawesome.com/14ed870f88.js"
		crossorigin="anonymous"
	></script>
</svelete:head>

{#if qualName == ""}
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
		{#if flameGraphTreesByExecutionPath.size > 0}
			<h4>
				{flameGraphTreesByExecutionPath.size} Unique execution paths found
			</h4>
			{#each [...flameGraphTreesByExecutionPath] as [executionPath, flameGraphTree]}
				<p>
					{(
						proportionOfCallsByExecutionPath.get(executionPath) *
						100
					).toFixed(1)}% of calls :
					{executionPath}
				</p>
				<FlameNode
					{...flameGraphTree}
					switchFocusFunction={switchPanelFocus}
					goToFunction={goToSymbol}
				/>
			{/each}
		{/if}
	{/if}

	<h3
		id="params"
		on:click={(e) => sectionOnClick(e.target.id)}
		on:keyup={() => {}}
	>
		Parameters
	</h3>

	{#if openSections.get("params")}
		{#if parametersByName.size > 0}
			<select bind:value={selectedParameter}>
				{#each [...parametersByName.keys()] as paramName}
					<option value={paramName}>{paramName}</option>
				{/each}
			</select>
		{:else}
			No parameters for the current selection
		{/if}

		{#if selectedParameter != ""}
			{#if parametersByName.has(selectedParameter)}
				{#each parametersByName.get(selectedParameter) as value}
					<p>{JSON.stringify(value)}</p>
					<br />
				{/each}
			{/if}
		{/if}
	{/if}
{/if}

<div id="bottom-pad" style="height:50px;" />

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

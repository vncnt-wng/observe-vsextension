<script lang="ts">
    import Plotly from "plotly.js-dist";
    import { getPlotLyLayout } from "./plotlyUtils";

    export let parametersByName: Map<string, Object[]> = new Map();
    export let selectedParameter: string = "";
    let parameterValuesAndTimes: Object[] = [];
    let plot: any = undefined;
    let type: string = "";

    $: {
        let histogramDiv = document.getElementById("paramHistogram");
        if (histogramDiv) {
            plot = undefined;
            histogramDiv!.style.height = "0px";
            Plotly.purge(histogramDiv);
        }
        if (selectedParameter !== "") {
            const parameterValues = parametersByName.get(selectedParameter);

            if (parameterValues) {
                console.log(parameterValues);
                let values: any[] = [];
                let aggregatable = false;
                let valueFn = (a) => a;
                let histValueFn = undefined;

                const typeString = Object.keys(parameterValues[0])[0];
                if (typeString === "intValue") {
                    valueFn = (o) => parseInt(o["intValue"]);
                    histValueFn = valueFn;
                    aggregatable = true;
                    type = "int";
                } else if (typeString === "doubleValue") {
                    valueFn = (o) => o["doubleValue"];
                    histValueFn = valueFn;
                    aggregatable = true;
                    type = "double";
                } else if (typeString === "stringValue") {
                    valueFn = (o) => o["stringValue"];
                    // Sets, Dicts, Lists, Objects are sent as strings
                    try {
                        const tryAsJson = JSON.parse(
                            parameterValues[0]["stringValue"]
                        );
                        if ("type" in tryAsJson) {
                            valueFn = (o) => {
                                const json = JSON.parse(o["stringValue"]);
                                return JSON.stringify(json["value"]);
                            };
                            if (tryAsJson["type"] === "class") {
                                aggregatable = true;
                                valueFn = (o) => {
                                    const json = JSON.parse(o["stringValue"]);
                                    return JSON.stringify(json["values"]);
                                };
                                histValueFn = (o) => {
                                    const json = JSON.parse(o["stringValue"]);
                                    return json["className"];
                                };
                            }
                            type = tryAsJson["type"];
                        }
                    } catch (e) {
                        type = "string";
                        console.log(e);
                    }
                }

                parameterValuesAndTimes = parameterValues.map((o) => {
                    return {
                        value: valueFn(o),
                        time: o["responseTime"],
                    };
                });
                console.log(parameterValuesAndTimes);

                if (aggregatable && histValueFn) {
                    const histogramData = [
                        {
                            x: parameterValues.map(histValueFn),
                            type: "histogram",
                        },
                    ];
                    setTimeout(() => {
                        histogramDiv =
                            document.getElementById("paramHistogram");
                        if (histogramDiv) {
                            histogramDiv!.style.height = "280px";
                            plot = new Plotly.newPlot(
                                histogramDiv,
                                histogramData,
                                getPlotLyLayout(
                                    "Histogram of parameter values",
                                    "Value",
                                    "Number of calls"
                                ),
                                {
                                    displayModeBar: false,
                                }
                            );
                        }
                    }, 50);
                }
            } else {
            }
        }
    }
</script>

{#if parametersByName.size > 0}
    <select bind:value={selectedParameter}>
        {#each [...parametersByName.keys()] as paramName}
            <option value={paramName}>{paramName}</option>
        {/each}
    </select>
    {#if selectedParameter != ""}
        {#if type != ""}
            Parameter type: {type}
        {/if}

        <!-- keep div to help with rerendering from svelte to plotly side -->
        <div id="paramHistogram" style="width:100%;padding-bottom:15px;" />

        {#if plot == undefined}
            No aggreagtion available type: {type}
        {/if}

        {#if parameterValuesAndTimes.length > 0}
            <h4>Value: Response Time</h4>
            {#each parameterValuesAndTimes as valueTime}
                <p>
                    {valueTime.value} : {valueTime.time}ms
                </p>
            {/each}
        {/if}
    {/if}
{:else}
    No parameters for the current selction
{/if}

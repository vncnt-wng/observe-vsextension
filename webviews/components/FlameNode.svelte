<script>
    export let funcId = "";
    export let meanTime = 0;
    export let percentage = 0;
    export let children = [];
    export let indent = 0;
    export let switchFocusFunction;
    export let goToFunction;

    let hovered = false;
    let open = true;

    function toggleOpen() {
        open = !open;
    }

    function getParts() {
        return funcId.split("[")[0].split(":");
    }

    function switchFocus() {
        const parts = getParts();
        switchFocusFunction(parts[0], parts[1]);
    }

    function goToInFile() {
        console.log("called in node");
        const parts = getParts();
        goToFunction(parts[0], parts[1]);
    }
</script>

<span
    id="parent"
    on:mouseenter={() => (hovered = true)}
    on:mouseleave={() => (hovered = false)}
>
    <p
        id="left"
        on:click={toggleOpen}
        on:keydown={() => {}}
        style="padding-left: {indent}px"
    >
        {children.length > 0 ? (open ? "⌄" : "›") : " "}
        {funcId} - {meanTime.toFixed(2)}ms {percentage.toFixed(2)}%
        <!-- {children.length > 0 ? (open ? "(open)" : "(closed)") : ""} -->
    </p>
    {#if hovered}
        <span id="actions">
            <span
                on:click={switchFocus}
                on:keydown={() => {}}
                style="padding: 2px"
                ><i class="fa-solid fa-magnifying-glass" /></span
            >
            <span
                on:click={goToInFile}
                on:keydown={() => {}}
                style="padding: 2px"><i class="fa-solid fa-arrow-right" /></span
            >
        </span>
    {/if}
</span>

{#if open}
    {#each children as child}
        <svelte:self
            {...child}
            {switchFocusFunction}
            {goToFunction}
            indent={indent + 15}
        />
    {/each}
{/if}

<style>
    #parent {
        display: flex;
        width: 100%;
        white-space: nowrap;
    }
    #left {
        cursor: pointer;
        user-select: none;
        float: left;
    }
    p {
        color: white;
        white-space: pre;
    }
    #parent #actions {
        padding-top: 12px;
        width: 100%;
        justify-content: center;
        align-items: right;
        text-align: right;
    }
</style>

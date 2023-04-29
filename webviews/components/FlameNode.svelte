<script>
    export let funcId = "";
    export let meanTime = 0;
    export let percentage = 0;
    export let children = [];
    export let indent = 0;

    let open = true;

    function toggleOpen() {
        open = !open;
    }
</script>

<h4
    style="padding-left: {indent}px"
    on:click={toggleOpen}
    on:keydown={() => {}}
>
    {funcId} - {meanTime.toFixed(2)}ms {percentage.toFixed(2)}%
    {children.length > 0 ? (open ? "(open)" : "(closed)") : ""}
</h4>

{#if open}
    {#each children as child}
        <svelte:self {...child} indent={indent + 10} />
    {/each}
{/if}

<style>
    h4 {
        cursor: pointer;
        user-select: none;
        color: grey;
    }
</style>

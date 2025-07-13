<script lang="ts">
    import { tick } from "svelte";
    import { fade } from "svelte/transition";

    import Copy from "./content/copy.svelte";
    import Export from "./content/export.svelte";

    export let activeTabId: number = -1;

    let showDone: boolean = false;

    async function showHideDone() {
        showDone = true;
        await tick();
        setTimeout(function () {
            showDone = false;
        }, 2000);
    }
</script>

<style>
    .ui {
        display: grid;
        grid-template-rows: 20px 50px 50px;
    }

    .titles {
        display: grid;
        grid-template-columns: max-content auto 100px;
        border-bottom: 1px solid lightgray;
    }

    .title {
        font-size: 14px;
    }

    .done {
        display: flex;
        justify-content: flex-end;
        color: green;
        font-weight: bold;
    }
</style>

<div class="ui">
    <div class="titles">
        <div class="title">Export to CSV or copy to clipboard</div>
        <div></div>
        {#if showDone}
            <div class="title done" out:fade>Done</div>
        {/if}
    </div>
    <Copy {activeTabId} on:done={showHideDone} />
    <Export {activeTabId} on:done={showHideDone} />
</div>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { saveAs } from "file-saver";
    import { v4 as uuidv4 } from "uuid";
    import { ZenInput, ZenIconButton } from "zensele-ui";
    import Button from "./button.svelte";

    export let activeTabId: number;

    const dispatch = createEventDispatcher();

    let fileName: string = "";
    let color: string = "#2196f3";

    function generateFileName(): void {
        fileName = uuidv4();
    }

    function exportTable(): void {
        if (!fileName) {
            generateFileName();
        }

        chrome.tabs.sendMessage(
            activeTabId,
            { message: "getTableDataComma" },
            async function (response) {
                let blob = new Blob([response.message], {
                    type: "text/csv;charset=utf-8",
                });

                saveAs(blob, `${fileName}.csv`, { autoBom: true });
                dispatch("done");
                fileName = "";
            }
        );
    }
</script>

<style>
    .export {
        display: grid;
        grid-template-columns: 50px auto max-content;
    }

    .export > div {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

<div class="export">
    <div class="generate-name" title="Generate file name">
        <ZenIconButton
            on:click={generateFileName}
            {color}
            size="35px"
            shadow="true">
            <img
                src="../Refresh_icon.svg.png"
                alt="Generate name"
                style="height: 20px;" />
        </ZenIconButton>
    </div>
    <div class="file-name">
        <ZenInput bind:value={fileName} {color} placeholder={'File name'} />
    </div>
    <div on:click={exportTable}>
        <Button title="Export" />
    </div>
</div>

<script lang="ts">
    import { onMount } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { saveAs } from "file-saver";

    let activeTabId: number;
    let errorMessage: string = "";
    let isError: boolean = false;
    let fileName: string;

    function exportTable(): any {
        chrome.tabs.sendMessage(
            activeTabId,
            { message: "getTableData" },
            function (response) {
                let blob = new Blob([response.message], {
                    type: "text/csv;charset=utf-8",
                });
                
                saveAs(blob, `${fileName}.csv`, { autoBom: true });
            }
        );
    }

    onMount(async () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
        ) {
            activeTabId = tabs[0].id;
            chrome.tabs.sendMessage(
                activeTabId,
                { message: "check" },
                function (response) {
                    if (response.error) {
                        errorMessage = response.message;
                        isError = true;
                    }

                    if (!response.error) {
                        fileName = uuidv4();
                        isError = false;
                    }
                }
            );
        });
    });
</script>

<style>
    .popup {
        width: 350px;
        height: 65px;
    }

    .ui {
        display: grid;
        grid-template-rows: 20px 20px 20px;
        gap: 5px;
    }

    .file {
        display: grid;
        grid-template-columns: max-content auto;
        gap: 5px;
    }

    .file-name {
        width: calc(100% - 7px);
    }

    .btn {
        width: 70px;
        margin-left: calc(100% - 70px);
    }

    .error {
        color: red;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
    }

    .title {
        color: green;
        font-weight: bold;
        font-size: 14px;
    }
</style>

<div class="popup">
    {#if isError}
        <div class="error">{errorMessage}</div>
    {/if}

    {#if !isError}
        <div class="ui">
            <div class="title">Table found</div>
            <div class="file">
                File name
                <input bind:value={fileName} class="file-name" />
            </div>
            <button on:click={exportTable} class="btn">Export</button>
        </div>
    {/if}
</div>

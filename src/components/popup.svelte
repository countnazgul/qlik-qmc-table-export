<script lang="ts">
    import { onMount, tick } from "svelte";
    import { fade } from "svelte/transition";
    import { v4 as uuidv4 } from "uuid";
    import { saveAs } from "file-saver";

    let activeTabId: number;
    let errorMessage: string = "";
    let errorLink: boolean = false;
    let isError: boolean = true;
    let fileName: string;
    let showDone = false;

    function exportTable(): any {
        chrome.tabs.sendMessage(
            activeTabId,
            { message: "getTableData" },
            async function (response) {
                let blob = new Blob([response.message], {
                    type: "text/csv;charset=utf-8",
                });

                saveAs(blob, `${fileName}.csv`, { autoBom: true });
                showHideDone();
            }
        );
    }

    async function copyToClipboard() {
        chrome.tabs.sendMessage(
            activeTabId,
            { message: "getTableData" },
            async function (response) {
                await navigator.clipboard.writeText(response.message);
                showHideDone();
            }
        );
    }

    function parseResponse(response) {
        if (!response) {
            errorMessage = "Unknown error";
            isError = true;
            return true;
        }

        if (response.error) {
            errorMessage = response.message;
            isError = true;
            return true;
        }

        if (!response.error) {
            fileName = uuidv4();
            isError = false;
            return true;
        }
    }

    async function showHideDone() {
        showDone = true;
        await tick();
        setTimeout(function () {
            showDone = false;
        }, 2000);
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
                    if (chrome.runtime.lastError) {
                        errorMessage = "No access to this host";
                        errorLink = true;
                        isError = true;
                    } else {
                        parseResponse(response);
                    }
                }
            );
        });
    });
</script>

<style>
    .popup {
        width: 370px;
        height: 70px;
    }

    .ui {
        display: grid;
        grid-template-rows: 20px 20px 20px;
        grid-template-columns: 55px auto;
        gap: 5px;
    }

    .file {
        grid-row: 2;
        grid-column: 1;
    }

    .file-name {
        grid-row: 2;
        grid-column: 2;
    }

    .file-name > input {
        width: calc(100% - 7px);
    }

    .buttons {
        display: flex;
        flex-direction: row;
        gap: 5px;
        grid-row: 3;
        grid-column: 2;
    }

    .btn {
        flex-grow: 1;
        flex-basis: 0;
        border: 0;
        padding: 0px 15px 0px 15px;
        font-size: 1.2em;
        background-color: #3498db;
        color: white;
        font-weight: bold;
        cursor: pointer;
    }
    .btn:hover {
        background-color: #217dbb;
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

    .titles {
        display: grid;
        grid-template-columns: 100px auto 100px;
        grid-row: 1;
        grid-column: 1 / span 2;
    }

    .title {
        color: green;
        font-weight: bold;
        font-size: 14px;
    }

    .done {
        display: flex;
        justify-content: flex-end;
    }
</style>

<div class="popup">
    {#if isError}
        <div class="error">
            {errorMessage}
            {#if errorLink}
                <a
                    style="padding-left: 10px"
                    target="_blank"
                    href="https://github.com/countnazgul/qlik-qmc-table-export#browser-permissions">Info</a>
            {/if}
        </div>
    {/if}

    {#if !isError}
        <div class="ui">
            <div class="titles">
                <div class="title">Table found</div>
                <div />
                {#if showDone}
                    <div class="title done" out:fade>Done</div>
                {/if}
            </div>
            <div class="file">File name</div>
            <div class="file-name"><input bind:value={fileName} /></div>
            <div class="buttons">
                <button class="btn" on:click={copyToClipboard}>Copy to clipboard</button>
                <button class="btn" on:click={exportTable}>Export</button>
            </div>
        </div>
    {/if}
</div>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { saveAs } from "file-saver";
  import { v4 as uuidv4 } from "uuid";
  import { Icon, Input } from "@sveltestrap/sveltestrap";
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

<div class="export">
  <div
    class="generate-name"
    title="Generate file name"
    on:click={generateFileName}
  >
    <Icon name="arrow-repeat" style="font-size: 25px; color:white" />
  </div>
  <div class="file-name">
    <Input type="text" bind:value={fileName} placeholder={"File name"} />
  </div>
  <div on:click={exportTable}>
    <Button title="Export" />
  </div>
</div>

<style>
  .export {
    display: grid;
    grid-template-columns: 50px auto max-content;
    gap: 10px;
  }

  .export > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .generate-name {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2196f3;
    cursor: pointer;
    border-radius: 50%;
  }
</style>

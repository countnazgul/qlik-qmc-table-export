<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Switch from "./switch.svelte";
  import Button from "./button.svelte";

  export let activeTabId: number;

  const dispatch = createEventDispatcher();

  let isTab: boolean = false;

  async function copyToClipboard(): Promise<void> {
    chrome.tabs.sendMessage(
      activeTabId,
      { message: isTab ? "getTableDataTab" : "getTableDataComma" },
      async function (response) {
        await navigator.clipboard.writeText(response.message);
        dispatch("done");
      }
    );
  }
</script>

<div class="copy">
  <div>Comma separated</div>
  <div>
    <Switch on:changed={(ev) => (isTab = ev.detail.isTab)} />
  </div>
  <div>Tab separated</div>
  <div on:click={copyToClipboard}>
    <Button title="Copy" />
  </div>
</div>

<style>
  .copy {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 83px;
    height: 100%;
    /* grid-template-rows: 30px; */
  }

  .copy > div {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";

  import Error from "./error.svelte";
  import Content from "./content.svelte";

  let activeTabId: number;
  let errorMessage: string = "";
  let errorLink: boolean = false;
  let isError: boolean = true;

  function parseResponse(response): boolean {
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
      isError = false;
      return true;
    }
  }

  onMount(async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, { message: "check" }, function (
        response
      ) {
        if (chrome.runtime.lastError) {
          errorMessage = "No access to this host";
          errorLink = true;
          isError = true;
        } else {
          parseResponse(response);
        }
      });
    });
  });
</script>

<div class="popup">
  {#if isError}
    <Error {errorLink} {errorMessage} />
  {:else}
    <Content {activeTabId} />
  {/if}
</div>

<style>
  .popup {
    width: 370px;
    height: 120px;
  }
</style>

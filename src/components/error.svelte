<script lang="ts">
    export let errorMessage: string = "";
    export let errorLink: boolean = false;
</script>

<style>
    .error {
        color: red;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
    }
</style>

<div class="error">
    {errorMessage}
    {#if errorLink}
        <a
            style="padding-left: 10px"
            target="_blank"
            href="https://github.com/countnazgul/qlik-qmc-table-export#browser-permissions">Info</a>
    {/if}
</div>

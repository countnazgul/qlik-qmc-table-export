<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let isTab: boolean = false;

    $: {
        dispatch("changed", { isTab });
    }
</script>

<style>
    .switch-input {
        display: none;
    }
    .switch-label {
        position: relative;
        display: inline-block;
        min-width: 30px;
        cursor: pointer;
        font-weight: 500;
        text-align: left;
        /* margin: 16px; */
        /* padding: 16px 0 16px 44px; */
    }
    .switch-label:before,
    .switch-label:after {
        content: "";
        position: absolute;
        margin: 0;
        outline: 0;
        top: 50%;
        -ms-transform: translate(0, -50%);
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
    }
    .switch-label:before {
        left: 1px;
        width: 34px;
        height: 14px;
        background-color: #b8ddf7;
        border-radius: 8px;
    }
    .switch-label:after {
        left: 0;
        width: 20px;
        height: 20px;
        background-color: #007fd4;
        border-radius: 50%;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14),
            0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
    }

    .switch-input:checked + .switch-label:before {
        background-color: #b8ddf7;
    }
    .switch-input:checked + .switch-label:after {
        background-color: #007fd4;
        -ms-transform: translate(80%, -50%);
        -webkit-transform: translate(80%, -50%);
        transform: translate(80%, -50%);
    }
</style>

<div>
    <input
        bind:checked={isTab}
        type="checkbox"
        id="id-name--1"
        name="set-name"
        class="switch-input" />
    <label for="id-name--1" class="switch-label"></label>
</div>

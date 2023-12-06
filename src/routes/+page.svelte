<script>
    import gameState from "$lib/stores/state.js"

    import EuropeMap from "$lib/maps/Europe.svelte"
    import Modal from "$lib/Modal.svelte";

    const {state, send} = gameState

    const sets = { //mock variable
        "Default": [
            
        ],
        "Europe 2": []
    }

    let setFilter = "";

    console.log($state) 
</script>

<main>
    {#if $state === "startMenu"}
        <button on:click={() => send({ type: "startGame" })}>Start</button>
    {:else if $state === "playing"}
        <EuropeMap 
            handleClick = {(countryId) => {

            }}
        />
    {:else if $state === "setManagementMenu"}
        <h1>MY AWSOME MENU</h1>
    {/if}
</main>

<Modal>
    <header>
        <input placeholder="Filter..." bind:value={setFilter}/>
        <button>Create Set</button>
        <button>Import From File</button>
    </header>

    {@const filteredSets = setFilter !== "" 
                            ? Object.keys(sets).filter(set => set.toLowerCase().includes(setFilter.toLowerCase()))
                            : Object.keys(sets)
    }
    {#each filteredSets as set, id (id)}
        <div class="set">
            <h3>{set}</h3>
            <button>Choose</button>
            <button>Modify</button>
            <button>Delete</button>
        </div>
    {/each}
</Modal>

<style>
    main {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    header {
        display: flex;
        gap: 1rem;
    }

    header input {
        padding: auto;
        margin-right: auto;
    }

    header input, button {
        padding: .4rem 1rem;
        background-color: #333;
        font-size: .95rem;
        color: #f0f0f0;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        transition: 1s all cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    button:hover {
        background-color: #444;
    }

    .set {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .set h3 {
        margin-right: auto;
    }

    .set button {
        font-size: .9rem;
    }
</style>
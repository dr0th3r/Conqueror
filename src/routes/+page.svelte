<script>
    import EuropeMap from "$lib/europe.svelte"

    let gameStarted = false;
</script>

<main>
    {#if gameStarted}
        <EuropeMap />
    {:else}    
        <h1>Conqueror</h1>
        <button on:click={() => gameStarted = true}>Start Game</button>
    {/if}
</main>

<style>
    :global(*) {
        padding: 0;
        margin: 0;
    }

    :global(body) {
        background-color: #121212;
        height: 100vh;
    }

    main {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        gap: 1rem;
    }

    h1 {
        font-size: 4rem;
        color: #f0f0f0;
    }

    button {
        font-size: 2rem;
        padding: 0.25rem 1rem;
        background-color: #8d0707;
        border: 1px solid black;
        color: #f0f0f0;
        border-radius: 10px;
        cursor: pointer;
    }
</style>
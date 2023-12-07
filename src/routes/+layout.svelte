<script>
    import gameState from "$lib/stores/state.js"

    const {state, send} = gameState
</script>

<header>
    <h2 on:click={() => send({ type: "goToStartMenu"})}>The Conqueror</h2>
    <button on:click={() => send({ type: "openSetManagementMenu" })}>Manage Question Sets</button>
</header>

<slot />

<style>
    :global(*) {
        padding: 0;
        margin: 0;
    }

    :global(body) {
        height: 100vh;
        background-color: #111;
        color: #f0f0f0;
        font-family: Arial, Helvetica, sans-serif;
    }

    header {
        display: flex;
        justify-content: space-between;
        padding: .5rem 2rem;
    }

    h2 {
        user-select: none;
        cursor: pointer;
    }

    button {
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
</style>
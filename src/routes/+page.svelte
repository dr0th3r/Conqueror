<script>
    import {onMount} from "svelte"
    import { questions } from "$lib/stores";

    import EuropeMap from "$lib/europe.svelte"

    onMount(async () => {
        if (Object.keys($questions.countryQuestions).length < 2) { //fetch fallback/default questions
            questions.update(prev => ({
                ...prev, 
                state: "loading"
            }))

            const jsonData = await fetch("./questions.json"); 
            const data = await jsonData.json();
            questions.set({
                countryQuestions: data,
                state: "startMenu",
                sets: {
                    "Default": data
                }
            });
        }
    })

</script>

<main>
    {#if $questions.state !== "loading" && $questions.state !== "startMenu"}
        <EuropeMap />
    {:else}    
        <h1>Conqueror</h1>
        <button on:click={() => {
            if ($questions.state === "loading") {
                alert("Wait please, the questions are still loading...");
                return;
            }

            $questions.state = "playing";
        }}>Start Game</button>
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
        display: flex;
        flex-direction: column;
    }

    main {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex-grow: 1;
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
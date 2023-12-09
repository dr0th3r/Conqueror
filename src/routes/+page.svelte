<script>
    import gameState from "$lib/stores/state.js"

    import EuropeMap from "$lib/maps/Europe.svelte"
    import Modal from "$lib/Modal.svelte";

    export let data; //fetched default sets
    
    const {state, send} = gameState

    const sets = data.questionSets;
    const neighbors = data.neighbors;

    let currentSet = sets[Object.keys(sets)[0]] || null;

    $: countries = Object.keys(currentSet);

    let setFilter = "";

    let invidedCountry = null;

    let conquered = [];

    function getRandomQuestion(set, countryId) {

        if (!!countryId && !!set) {
            const countryQuestions = set[countryId];
            if (!countryQuestions) {
                alert("No questions for country");
                return;
            }
            
            return countryQuestions[Math.floor(Math.random() * countryQuestions.length)];
        } else {
            alert("No questions for country");
            return;
        }
    }

    function handleAnswer(isCorrect) {
        if (isCorrect) {
            conquered = [...conquered, invidedCountry];

            if (conquered.length >= countries.length) {
                alert("You won!");
                startGame();
            }
        } else {
            const invidedCountryNeighbors = neighbors[invidedCountry];

            //get which of the conquered countries is neighbor of the invided country (invidedCountry)
            //and delete it from conquered - it was conquered back by opponent
            for (let i = 0; i < conquered.length; i++) {
                if (invidedCountryNeighbors.includes(conquered[i])) {
                    conquered.splice(i, 1);
                    conquered = conquered; //needed for reactive refresh
                    break;
                }
            }

            if (conquered.length <= 0) {
                alert("You lost!");
                startGame();
            }
        }

        invidedCountry = null;
        send({ type: "continuePlaying" })
    }

    function startGame() {
        if (!currentSet) return

        conquered = [countries[Math.floor(Math.random() * countries.length)]] || ["CZ"]

        send({ type: "startGame" })
    }
</script>

<main>
    {#if $state === "startMenu"}
        <button on:click={startGame}>Start</button>
    {:else if $state === "playing" || $state === "questionModal" && !!currentSet} 
        <EuropeMap 
            {conquered}
            handleClick = {(countryId) => {
                //if invaded country isn't neighbor of any of the conquered countries
                if (!conquered.some((country) => neighbors[country]?.includes(countryId))) {
                    alert("You must only invide neighbor countries!");
                    return;
                } 

                invidedCountry = countryId;
                send({ type: "openQuestionModal" })
            }}
        />
    {/if}
</main>

{#if $state === "setManagementMenu"}
    <Modal> <!-- menu modal -->
        <header>
            <input placeholder="Filter..." bind:value={setFilter}/>
            <button>Create Set</button>
            <button>Import From File</button>
        </header>

        {@const filteredSets = setFilter === "" 
            ? Object.keys(sets)
            : Object.keys(sets).filter(set => set.toLocaleLowerCase().includes(setFilter.toLocaleLowerCase()))
        }
        {#if filteredSets.length > 0}
            {#each filteredSets as set, id (id)}
                <div class="set">
                    <h3>{set}</h3>
                    <button on:click={() => {
                        currentSet = sets[set];
                        startGame();
                    }}>Choose</button>
                    <button>Modify</button>
                    <button>Delete</button>
                </div>
            {/each}
        {:else}
            <p>No matches found</p>
        {/if}
    </Modal>
{/if}


{#if $state === "questionModal"}
    {@const questionData = getRandomQuestion(currentSet, invidedCountry)}
    {#if questionData}
        <Modal > <!-- question modal -->
            <h3 class="question">{questionData?.question}</h3>
            {#each questionData?.answers as answer, id (id)}
                <button on:click={() => handleAnswer(questionData.correctAnswer === id)}>{answer}</button>
            {/each}
        </Modal>
    {/if}
{/if}

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

    .question {
        text-align: center;
    }
</style>
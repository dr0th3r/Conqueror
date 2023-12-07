<script>
    import gameState from "$lib/stores/state.js"

    import EuropeMap from "$lib/maps/Europe.svelte"
    import Modal from "$lib/Modal.svelte";

    export let data; //fetched default sets
    
    const {state, send} = gameState

    const sets = data;

    let currentSet = sets[Object.keys(sets)[0]] || null;

    let setFilter = "";

    let currentCountry = null;

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
            conquered = [...conquered, currentCountry];
        } else {
            alert("Incorrect!");
        }

        send({ type: "continuePlaying" })
    }

    function startGame() {
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
                currentCountry = countryId;
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
    {@const questionData = getRandomQuestion(currentSet, currentCountry)}
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
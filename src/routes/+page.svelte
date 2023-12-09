<script>
    import gameState from "$lib/stores/state.js"

    import EuropeMap from "$lib/maps/Europe.svelte"
    import Modal from "$lib/Modal.svelte";
    import { parse } from "svelte/compiler";

    export let data; //fetched default sets
    
    const {state, send} = gameState

    let sets = data.questionSets;
    const neighbors = data.neighbors;

    let currentSet = sets[Object.keys(sets)[0]] || null;

    let countries = Object.keys(currentSet); //not a reactive declaration because of a way in which they update

    let setFilter = "";

    let invidedCountry = null;

    let conquered = [];

    function getRandomQuestion(set, countryId) {

        console.log("test");

        if (!!countryId && !!set) {
            const countryQuestions = set[countryId];
            if (!countryQuestions) {
                alert("No questions for country");
                
                send({ type: "continuePlaying" })

                return;
            }
            
            return countryQuestions[Math.floor(Math.random() * countryQuestions.length)];
        } else {
            alert("No questions for country");

            send({ type: "continuePlaying" })

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

    //handling set importing

    function handleSetImport(e) {
        const importedFile = e.target.files[0];

        if (!importedFile) {
            console.log("No file provided");
            return;
        }

        let fileName = importedFile.name.replace(".json", "");

        //handle file naming collisions
        let sameNameCount = 0;

        if (sets[fileName] !== undefined) {
            sameNameCount++;
            while (sets[`${fileName}(${sameNameCount})`]) sameNameCount++;

            fileName = `${fileName}(${sameNameCount})`;
        }

        //handle reading data
        const reader = new FileReader();

        reader.onload = event => {
            sets[fileName] = JSON.parse(event.target.result);
            sets = sets;
        };
        reader.onerror = err => console.log(err);
        reader.readAsText(importedFile);
    }

    $: console.log($state)
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
            <label for="sets-from-file-input">Import From File</label>
            <input 
                id="sets-from-file-input"
                type="file" 
                accept="application/json" 
                on:change={handleSetImport}
            />
        </header>

        {@const filteredSets = setFilter === "" 
            ? Object.keys(sets)
            : Object.keys(sets)
                .filter(set => set.toLocaleLowerCase().includes(setFilter.toLocaleLowerCase()))
        }
        {#if filteredSets.length > 0}
            {#each filteredSets as set, id (id)}
                <div class="set">
                    <h3>{set}</h3>
                    <button on:click={() => {
                        currentSet = sets[set];
                        countries = Object.keys(currentSet);
                        startGame();
                    }}>Choose</button>
                    <button>Modify</button>
                    <button on:click={() => {
                        delete sets[set];
                        sets = sets; //for reactive refresh
                    }}>Delete</button>
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

    header input, button, label {
        padding: .4rem 1rem;
        background-color: #333;
        font-size: .95rem;
        color: #f0f0f0;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        transition: 1s all cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #sets-from-file-input {
        display: none;
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
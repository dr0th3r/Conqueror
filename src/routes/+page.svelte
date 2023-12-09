<script>
    import gameState from "$lib/stores/state.js"

    import EuropeMap from "$lib/maps/Europe.svelte"
    import Modal from "$lib/Modal.svelte";
    import { parse } from "svelte/compiler";
    import { hasContext } from "svelte";

    export let data; //fetched default sets
    
    const {state, send} = gameState

    let sets = data.questionSets;
    const neighbors = data.neighbors;

    let currentSet = sets[Object.keys(sets)[0]] || null;

    let countries = Object.keys(currentSet); //not a reactive declaration because of a way in which they update

    let setFilter = "";

    let selectedCountry = null;

    let conquered = [];

    let creatingSet = false;

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
            conquered = [...conquered, selectedCountry];

            if (conquered.length >= countries.length) {
                alert("You won!");
                startGame();
            }
        } else {
            const selectedCountryNeighbors = neighbors[selectedCountry];

            //get which of the conquered countries is neighbor of the invided country (selectedCountry)
            //and delete it from conquered - it was conquered back by opponent
            for (let i = 0; i < conquered.length; i++) {
                if (selectedCountryNeighbors.includes(conquered[i])) {
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

        selectedCountry = null;
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

    function saveQuestion(e) {
        const formData = new FormData(e.target);

        const correctAnswer = formData.get("answer");

        const answers = formData.getAll("answer");

        //if the set of questions doesn't exist for this country, create an empty set for it
        !currentSet[selectedCountry] && (currentSet[selectedCountry] = []) 

        currentSet[selectedCountry] = [
            ...currentSet[selectedCountry],
            {
                question: formData.get("question"),
                answers: answers.sort(() => Math.random() - 0.5),
                correctAnswer: answers.indexOf(correctAnswer)
            }
        ]

        send({type: "closeModal"})
    }

    function createSet(e) {
        const setName = new FormData(e.target).get("setName");
        
        sets[setName] = {}

        creatingSet = false;
    }

    $: console.log($state)

    $: if ($state === "modifyingSet") {
        conquered = [];
    }
</script>

<main>
    {#if $state === "startMenu"}
        <button on:click={startGame}>Start</button>
    {:else if  $state === "playing" 
            || $state === "questionModal" 
            || $state === "modifyingSet"
            || $state === "creatingQuestion"
            && !!currentSet} 
        <EuropeMap 
            {conquered}
            handleClick = {(countryId) => {
                //if invaded country isn't neighbor of any of the conquered countries
                if ($state === "playing") {
                    if (!conquered.some((country) => neighbors[country]?.includes(countryId))) {
                        alert("You must only invide neighbor countries!");
                        return;
                    } 
    
                    selectedCountry = countryId;
                    send({ type: "openQuestionModal" })
                } else if ($state === "modifyingSet" && countryId) {
                    selectedCountry = countryId;
                    send({ type: "openCreateQuestionModal"})
                }
            }}
        />
    {/if}
</main>

{#if $state === "setManagementMenu"}
    <Modal> <!-- menu modal -->
        <header>
            <input disabled={creatingSet} placeholder="Filter..." bind:value={setFilter}/>
            <button disabled={creatingSet} on:click={() => creatingSet = true}>Create Set</button>
            <label for="sets-from-file-input" id="sets-from-file-label">Import From File</label>
            <input 
                disabled={creatingSet}
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
        {#if creatingSet}
            <form on:submit={createSet}>
                <label for="set-name">Set Name: </label>
                <input type="text" name="setName" id="set-name">
                <div class="btn-group">
                    <button type="submit">Create</button>
                    <button type="button" on:click={() => creatingSet = false}>Discard</button>
                </div>
            </form>
        {:else if filteredSets.length > 0}
            {#each filteredSets as set, id (id)}
                <!-- truly hasQuestions just checks if there are any countries, but this shouldn't 
                     have any impact on truthiness of the statement
                -->
                {@const hasQuestions = Object.keys(sets[set]).length > 0} 
                <div class="set">
                    <h3>{set}</h3>
                    {#if hasQuestions}
                        <button on:click={() => {
                            currentSet = sets[set];
                            countries = Object.keys(currentSet);
                            startGame();
                        }}>Choose</button>
                    {/if}
                    <button
                        on:click={() => {
                            currentSet = sets[set];
                            send({ type: "modfiySet" })
                        }}
                    >{hasQuestions ? "Modify Set" : "Add Questions"}</button>
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
    {@const questionData = getRandomQuestion(currentSet, selectedCountry)}
    {#if questionData}
        <Modal > <!-- question modal -->
            <h3 class="question">{questionData?.question}</h3>
            {#each questionData?.answers as answer, id (id)}
                <button on:click={() => handleAnswer(questionData.correctAnswer === id)}>{answer}</button>
            {/each}
        </Modal>
    {/if}
{/if}

{#if $state === "creatingQuestion" && !!selectedCountry}
    <Modal>
        <form on:submit|preventDefault={(e) => {
            saveQuestion(e);
/*             const formData = new FormData(e.target);
            
            for (const [key, val] of formData.entries()) {
                console.log(`${key}: ${val}`);
            } */
        }}>
            <div class="group">
                <label for="question-input">Question:</label>
                <input type="text" name="question" id="question-input">
            </div>

            {#each [1, 2, 3, 4] as i (i)}
                <div class="group">
                    <label for={`answer${i}`}>{i === 1 ? "Correct" : `Incorrect`} Answer:</label>
                    <input type="text" id={`answer${i}`} name="answer">
                </div>
            {/each}

            <div class="btn-group">
                <button type="submit" class="save-btn">Save Question</button>
                <button type="button" class="close-btn" on:click={() => {
                    send({ type: "closeModal" })
                }}>Close</button>
            </div>
        </form> 
    </Modal>
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

    input, button, #sets-from-file-label {
        padding: .4rem 1rem;
        background-color: #333;
        font-size: .95rem;
        color: #f0f0f0;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        transition: 1s all cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    
    input {
        cursor: text;
    }

    label {
        cursor: pointer;
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

    form {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        gap: 1rem;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: .25rem;
    }
    
    .btn-group {
        width: 100%;
        display: flex;
        gap: 1rem;
    }

    .save-btn {
        flex-grow: 1;
    }

    .close-btn {
        flex-grow: 1;
    }

    form label {
        width: fit-content;
    }
</style>
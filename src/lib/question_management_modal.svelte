<!-- App.svelte -->
<script>
    import {questions} from "./stores";

    export let showModal = false;

    let sets = [
        { title: "Set 1" },
        { title: "Set 2" },
        // Add more sets as needed
    ];

    let filter = "";

    let creatingNewSet = false;
    let newSetName = "";

    function createSet() {
        // Add your logic to create a new set
        // For example, you can push a new set to the 'sets' array
        //sets = [...sets, { title: `New Set ${sets.length + 1}` }];
        /* questions.update(prev => ({
            ...prev,
            state: "creatingNewMap"
        })) */
        $questions.newSetName = newSetName;
        $questions.state = "creatingNewMap";
        creatingNewSet = false;
    }

    function modifySet(title) {
        $questions.newSetName = title;
        $questions.state = "creatingNewMap";
    }

    function chooseSet(title) {
        // Add your logic to handle choosing a set
        $questions.countryQuestions = $questions.sets[title];
        showModal=false;

        $questions.state = "playing"
        //console.log(`Chose Set: ${sets[index].title}`);
    }

    function deleteSet(title) {
        // Add your logic to handle deleting a set
        delete $questions.sets[title]

        $questions = $questions //to refresh the dom
    }

    function handleFileUpload(e) {
            $questions.state = "loading"

            const file = e.target.files[0];
            const fileName = file.name.replace(".json", "");

            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const selected = await JSON.parse(e.target.result);

                console.log(e.target)

                if (Object.keys(selected).length > 1){ //if there are questions for more than 1 country

                    //creating unique names
                    let fileCount = 1; //starts from 1 in the case that there is actually an existing file 
                    let newFileName = fileName;
                    while($questions.sets[newFileName]) {
                        newFileName = `${fileName}(${++fileCount})`
                    }

                    //upadting sets
                    $questions.sets = {...$questions.sets, [newFileName]: selected};
                    $questions.state = "managing"; //we want to go back to managing menu



//                    showModal = false; //close modal because you have already choose a set
                } else {
                    alert("You must questions about at least 2 countries!");
                }
            }
            fileReader.onerror = err => console.log(err);
            fileReader.readAsText(file); //only read the first file and ignore others
    }

    $: showModal && questions.update(prev => ({...prev, state: "managing"})) //when we open the modal, we always want to be in the managing window

    $: state = $questions.state
</script>


{#if state === "managing"}
<div class="modal" style:display={showModal ? "flex" : "none"}>
    <div class="modal-content">
        <header class="modal-header">
            <input bind:value={filter} placeholder="Filter by header" class="filter-input" />

            <button on:click={() => creatingNewSet = true} class="header-button">Create Set</button>
            <button class="header-button">Explore</button>
<!--             <button class="header-button">From File</button> -->
            <label for="from-file-input" class="header-button from-file-label">
                From File
            </label>
            <input id="from-file-input" type="file" accept="application/json" on:change={handleFileUpload}>
        </header>

        {#if creatingNewSet}
            <div class="creating-new-container">
                <input placeholder="Set name..." class="filter-input" bind:value={newSetName}>
                <button class="set button choose-button" on:click={createSet}>Create</button>
            </div>
        {:else if Object.keys($questions.sets).length > 0}
            {#each Object.keys($questions.sets) as title (title)}
            {#if !filter || title.includes(filter)}
                <div class="set">
                    <h3>{title}</h3>
                    <div class="set-buttons">
                        <button on:click={() => chooseSet(title)} class="set button choose-button">Choose</button>
                        <button on:click={() => modifySet(title)} class="set button choose-button">Modify</button>
                        <button on:click={() => deleteSet(title)} class="set button delete-button">Delete</button>
                    </div>
                </div>
            {/if}
            {/each}
        {:else}
            <p>No sets available</p>
        {/if}
    </div>
</div>
<!-- {:else if state === "creatingNewMap"}
<button class="save-new-set-button" on:click={() => questions.update(prev => ({
    ...prev,
    state: "managing"
}))}>Save</button>  -->

{/if}
  
<style>
    /* Add your styles here */
    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }
    
    .modal-content {
        background-color: #fff;
        padding: 20px;
        min-height: 40vh;
        max-height: 60vh;
        overflow-y: auto;
        scroll-behavior: smooth;
        border-radius: 10px;
        text-align: center;
    }
    
    button, input {
        border-radius: 10px;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        gap: .75rem;
    }
    
    .set {
        margin-bottom: 10px;
        border: 1px solid #ddd;
        padding: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: .75rem;
        border-radius: 10px;
    }
    
    .set-buttons {
        display: flex;
        gap: .5rem;
    }
    
    .set button {
        cursor: pointer;
        padding: 5px 10px;
        margin-bottom: 0;
        transition: background-color 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    
    .choose-button {
        color: black;
    }
    
    .choose-button:hover {
        background-color: #2ecc71;
        color: #fff;
    }
    
    .delete-button {
        color: black;
    }
    
    .delete-button:hover {
        background-color: #8d0707;
        color: #fff;
    }
    
    .filter-input {
        padding: 5px;
    }
    
    .header-button {
        cursor: pointer;
        padding: 8px 15px;
        border: none;
    }
    
    .from-file-label {
        background-color: #efefef;
        border-radius: 10px;
        font-size: .85rem;
    }
    
    #from-file-input {
        display: none;
    }

    .save-new-set-button {
        align-self: flex-end;
        margin-right: 20px;
        background-color: #8d0707;
        border: none;
        color: #f0f0f0;
        padding: 10px 20px;
        cursor: pointer;
    }

    .column {
        display: flex;
        gap: 1rem;
        flex-direction: column;
    }
    
    .column input {
        padding: 5px;
    }

    .column button {
        margin: 0;
        cursor: pointer;
        color: #f0f0f0;
    }

    .add-question-button {
        background-color: #2ecc71;
    }

    .discard-button {
        background-color: #8d0707;
    }

    .creating-new-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .creating-new-container button {
        margin-bottom: 0;
        padding: 8px;
        cursor: pointer;
        transition: background-color 1s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
</style>
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

    function createSet() {
        // Add your logic to create a new set
        // For example, you can push a new set to the 'sets' array
        sets = [...sets, { title: `New Set ${sets.length + 1}` }];
    }

    function chooseSet(index) {
        // Add your logic to handle choosing a set
        showModal=false;
        console.log(`Chose Set: ${sets[index].title}`);
    }

    function deleteSet(index) {
        // Add your logic to handle deleting a set
        sets = sets.filter((_, i) => i !== index);
    }

    function handleFileUpload(e) {
            questions.update(prev => ({
                ...prev,
                state: {
                    ...prev.state,
                    loading: true
                }
            }))

            const {files} = e.target;
            const fileReader = new FileReader();
            fileReader.onload = async (e) => {
                const selected = await JSON.parse(e.target.result);
                if (Object.keys(selected).length > 1){
                    questions.set({
                        countryQuestions: selected, 
                        state: {
                            ...$questions.state,
                            loading: false
                        }
                    })
                    showModal = false; //close modal because you have already choose a set
                } else {
                    alert("You must questions about at least 2 countries!");
                }
            }
            fileReader.onerror = err => console.log(err);
            fileReader.readAsText(files[0]); //only read the first file and ignore others
    }
</script>

<div class="modal" style:display={showModal ? "flex" : "none"}>
    <div class="modal-content">
        <header class="modal-header">
            <input bind:value={filter} placeholder="Filter by header" class="filter-input" />

            <button on:click={createSet} class="header-button">Create Set</button>
            <button class="header-button">Explore</button>
<!--             <button class="header-button">From File</button> -->
            <label for="from-file-input" class="header-button from-file-label">
                From File
            </label>
            <input id="from-file-input" type="file" accept="application/json" on:change={handleFileUpload}>
        </header>

        {#if sets.length > 0}
            {#each sets as { title }, index (title)}
            {#if !filter || title.includes(filter)}
                <div class="set">
                    <h3>{title}</h3>
                    <div class="set-buttons">
                        <button on:click={() => chooseSet(index)} class="set button choose-button">Choose</button>
                        <button on:click={() => deleteSet(index)} class="set button delete-button">Delete</button>
                    </div>
                </div>
            {/if}
            {/each}
        {:else}
            <p>No sets available</p>
        {/if}
    </div>
</div>
  
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
    
    </style>
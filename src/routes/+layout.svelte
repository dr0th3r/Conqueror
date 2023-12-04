<script>
    import QuestionManagementModal from "../lib/question_management_modal.svelte";

    let showModal = false;
</script>

<header>
    <h2><a href="/">The Conqueror</a></h2>
    <button on:click={() => showModal = true}>Manage question sets</button>
</header>
{#if showModal}
    <QuestionManagementModal bind:showModal={showModal}/>
{/if}



<slot></slot>

<style>
/*     header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #f0f0f0;
        height: 2rem;
    }

    h2, a {
        text-decoration: none;
        color: #f0f0f0;
    } */

    header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            text-align: center;
            padding: 10px 20px;
        }

        h2 a {
            color: #fff;
            text-decoration: none;
            font-size: 1.7rem;
        }

        button {
            font-size: 1.25rem;
            padding: 0.25rem 1rem;
            background-color: #8d0707;
            border: 1px solid black;
            color: #f0f0f0;
            border-radius: 10px;
            cursor: pointer;
        }
</style>
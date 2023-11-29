<script>
    export let question;
    export let handleAnswer;
</script>

<div>
    <header>
        <h2>{question.question}</h2>
    </header>
    <main>
        {#each question.answers as answer, id}
            <button on:click={() => handleAnswer(question.correctAnswer === id)}>{answer}</button>
        {/each}
    </main>
</div>

<style>
    div {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }

    header, main {
        background-color: red;
        padding: 20px;
    }
</style>
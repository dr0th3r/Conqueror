<script>
    export let question;
    export let handleAnswer;
</script>

<div class="outer">
    <div class="inner">
        <header>
            <h2>{question.question}</h2>
        </header>
        <main>
            {#each question.answers as answer, id}
                <button on:click|self={() => handleAnswer(question.correctAnswer === id)}>{answer}</button>
            {/each}
        </main>
    </div>
</div>

<style>
    div.outer {
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

    .inner {
        padding: 10px;
        background-color: #fff;
        border-radius: 10px;
        
    }

    header, main {
        padding: 10px;
        gap: 1rem;
        width: clamp(200px, 30vw, 800px);
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }

    button {
        padding: 10px 20px;
        min-width: 10rem;
        border: none;
        background-color: #ddd;
        border-radius: 10px;
        cursor: pointer;
        transition: 1s background-color cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    button:hover {
        background-color: blue;
        color: #fff;
    }
</style>
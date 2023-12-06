<div class="outer">
    <div class="inner">
        <slot >
            <p>No Slot Provided</p>
        </slot>
    </div>
</div>

<style>
    .outer {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(5px);
    }

    .inner {
        width: clamp(200px, 30vw, 800px);
        background-color: #222;
        padding: 1rem;
        border-radius: 10px;

        display: flex;
        flex-direction: column;
        gap: 1.2rem;
    }

</style>

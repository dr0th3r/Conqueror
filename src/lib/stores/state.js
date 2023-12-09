import { writable } from "svelte/store";

export function useMachine(machine, initial) { //store
    const state = writable(initial);

    function send(event) {
        state.update(state => machine(state, event));
    }

    return { state, send };
}

export function gameMachine(state, event) { //machine for managing gameState, could also later separet into utills file

    switch (state) {
        case "startMenu": 
            if (event.type === "openSetManagementMenu") {
                return "setManagementMenu"
            } else if (event.type === "startGame") {
                return "playing"
            } //add more states later

        case "playing":
            if (event.type === "openSetManagementMenu") {
                return "setManagementMenu"
            } else if (event.type === "goToStartMenu") {
                return "startMenu"
            } else if (event.type === "openQuestionModal") {
                return "questionModal"
            }
            
        case "setManagementMenu": 
            if (event.type === "goToStartMenu") {
                return "startMenu"
            } else if (event.type === "startGame") {
                return "playing"
            } else if (event.type === "modfiySet") {
                return "modifyingSet"
            }
        
        case "questionModal":
            if (event.type === "continuePlaying") {
                return "playing"
            }

        case "modifyingSet":
            if (event.type === "openCreateQuestionModal") {
                return "creatingQuestion"
            } else if (event.type = "openSetManagementMenu") {
                return "setManagementMenu"
            }

        case "creatingQuestion": 
            if (event.type === "closeModal") {
                return "modifyingSet"
            }

        default: 
            return state
    }
}

export default useMachine(gameMachine, "startMenu") //default store for storing game state
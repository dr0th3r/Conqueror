import { writable } from "svelte/store";

export const questions = writable({countryQuestions: {}, state: "loading", sets: {}, newSetName: ""});



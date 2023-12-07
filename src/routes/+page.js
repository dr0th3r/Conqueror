//load default question set
import questionsJSON from "$lib/question_sets/questions.json"

export async function load({ params }) {
    return {Default: processQuestions(questionsJSON)};
}

function processQuestions(questions) {
    const countryIds = Object.keys(questions)

    if (questions[countryIds[0]]?.neighbors) { //if the questions also include neighbors, used for backwards compatibility
        for (const countryId of countryIds) {
            questions[countryId] = questions[countryId].questions;
        }
    }

    return questions
}
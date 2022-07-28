import type { PlasmoContentScript } from "plasmo"
import { default as data } from "./assets/data.json"

export const config: PlasmoContentScript = {
    matches: ["http://aulavirtual2.prevencionquesada.com/mod/quiz/*"]
}

const clearText = (str: string) => str
    .replace(/[acbd]\.\s/, "")
    .replace(/\u00A0/, "")
    .replace(/\s{2,}/, " ")
    .replace(/[\-\.\n]/g, "")
    .trim();

const getAnswer = (str: string): string | undefined => {
    const { answer } = data.find((d) => d.question === str) || {};
    return answer;
}

window.addEventListener("load", () => {
    const formulations = document.querySelectorAll(".formulation");
    for (const formulation of formulations) {
        const question = formulation.querySelector<HTMLElement>(".qtext");
        const questionText = clearText(question.innerText || "");
        const solutionText = getAnswer(questionText);

        const answerElements = formulation.querySelectorAll<HTMLElement>(".answer div");

        for (const answerElement of answerElements) {
            const labelText = clearText(answerElement.querySelector("label").textContent);
            if (labelText === solutionText) {
                answerElement.querySelector("input").checked = true;
            }
        }
    }
})
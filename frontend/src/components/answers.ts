import { CustomHttp } from "../services/custom-http";
import config from "../../config/config";
import { Auth } from "../services/auth";
import type { DefaultResponseType } from "../types/default-response.type";
import type { QuizType, QuizQuestionType, QuizAnswerType } from "../types/quiz.type";
import type { UserInfoType } from "../types/user-info.type";

type AnswersDetailResponse = {
    error?: boolean;
    message?: string;
    test: QuizType & { questions: QuizQuestionType[] };
};

export class Answers {
    private test: (QuizType & { questions: QuizQuestionType[] }) | null;

    constructor() {
        this.test = null;

        const testId: string | null = localStorage.getItem("lastTestId");
        const userInfo: UserInfoType | null = Auth.getUserInfo();

        if (!testId || !userInfo) {
            location.href = "#/";
            return;
        }

        void this.loadAnswers(testId, userInfo.userId);
    }

    private async loadAnswers(testId: string, userId: string | number): Promise<void> {
        try {
            const result = (await CustomHttp.request(
                `${config.host}/tests/${testId}/result/details?userId=${userId}`
            )) as AnswersDetailResponse | DefaultResponseType | null;

            if (!result || ("error" in result && result.error)) {
                alert("Ошибка загрузки данных");
                return;
            }

            const data = result as AnswersDetailResponse;
            if (!data.test || !Array.isArray((data.test as any).questions)) {
                console.error("Неверный формат ответа details");
                alert("Ошибка формата данных");
                return;
            }

            this.test = data.test as QuizType & { questions: QuizQuestionType[] };
            this.renderQuestions();
        } catch (error) {
            console.error(error);
            alert("Произошла ошибка при загрузке данных");
        }
    }

    private renderQuestions(): void {
        if (!this.test) return;

        const questionsBlock: HTMLDivElement = document.createElement("div");

        this.test.questions.forEach((question: QuizQuestionType, index: number) => {
            const questionWrapper: HTMLDivElement = document.createElement("div");
            questionWrapper.className = "answers__question";

            const title: HTMLDivElement = document.createElement("div");
            title.className = "test__question-title";

            const q: any = question as any;
            const questionText: string = q.question ?? q.text ?? q.title ?? "";

            title.innerHTML = `<span>Вопрос ${index + 1}:</span> ${questionText}`;

            const options: HTMLDivElement = document.createElement("div");
            options.className = "test__question-options";
            (options.style as any).minHeight = "200px";

            (question.answers as QuizAnswerType[]).forEach((answer: QuizAnswerType) => {
                const option: HTMLDivElement = document.createElement("div");
                option.className = "test__question-option";

                const inputId = `answer-${question.id}-${answer.id}`;
                const input: HTMLInputElement = document.createElement("input");
                input.type = "radio";
                input.id = inputId;
                input.name = "question-" + String(question.id);
                input.disabled = true;

                const label: HTMLLabelElement = document.createElement("label");
                label.setAttribute("for", inputId);
                label.innerText = answer.answer;

                const anyAns = answer as any;
                if (anyAns.correct !== undefined) {
                    input.checked = true;
                    (input.style as any).setProperty("--hide-dot", "true");
                    if (Boolean(anyAns.correct)) {
                        label.style.color = "#5FDC33";
                        input.style.border = "5px solid #5FDC33";
                    } else {
                        label.style.color = "#DC3333";
                        input.style.border = "5px solid #DC3333";
                    }
                }

                option.appendChild(input);
                option.appendChild(label);
                options.appendChild(option);
            });

            questionWrapper.appendChild(title);
            questionWrapper.appendChild(options);
            questionsBlock.appendChild(questionWrapper);
        });

        const oldBlock = document.querySelector(".answers__question");
        if (oldBlock && oldBlock.parentElement) {
            oldBlock.parentElement.replaceChild(questionsBlock, oldBlock);
        } else {
            const container = document.querySelector(".container") as HTMLElement | null;
            container?.appendChild(questionsBlock);
        }

        const preTitleElement = document.getElementById("pre-title");
        if (preTitleElement) preTitleElement.textContent = this.test.name;

        const email = localStorage.getItem("userEmail");
        if (email) {
            const emailElement: HTMLDivElement = document.createElement("div");
            emailElement.style.marginTop = "20px";
            emailElement.style.fontWeight = "bold";
            emailElement.innerText = `Пользователь: ${email}`;
            const container = document.querySelector(".container") as HTMLElement | null;
            container?.prepend(emailElement);
        }

        const backButton = document.getElementById("backToResult");
        if (backButton) {
            backButton.addEventListener("click", (event) => {
                event.preventDefault();
                const testId = localStorage.getItem("lastTestId");
                const score = localStorage.getItem("lastScore");
                const total = localStorage.getItem("lastTotal");

                let href = "#/result";
                if (score && total) {
                    href = `#/result?score=${encodeURIComponent(score)}&total=${encodeURIComponent(total)}`;
                } else if (testId) {
                    href = `#/result?id=${encodeURIComponent(testId)}`;
                } else {
                    alert("Результаты теста не найдены");
                    return;
                }
                location.href = href;
            });
        }
    }
}

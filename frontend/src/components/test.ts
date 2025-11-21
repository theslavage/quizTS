import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "../services/custom-http";
import config from "../../config/config";
import { Auth } from "../services/auth";
import type { QueryParamsType } from "../types/query-params-type";
import type { QuizAnswerType, QuizQuestionType, QuizType } from "../types/quiz.type";
import type { UserResultType } from "../types/user-result.type";
import type { DefaultResponseType } from "../types/default-response.type";
import { ActionTestTypes } from "../types/action-test.type";
import type { UserInfoType } from "../types/user-info.type";
import type { PassTestResponseType } from "../types/pass-test-response.type";

export class Test {
    private progressBarElement: HTMLElement | null;
    private passButtonElement: HTMLElement | null;
    private nextButtonElement: HTMLElement | null;
    private prevButtonElement: HTMLElement | null;
    private questionTitleElement: HTMLElement | null;
    private optionsElement: HTMLElement | null;
    private quiz: QuizType | null;
    private currentQuestionIndex: number;
    readonly userResult: UserResultType[];
    private routeParams: QueryParamsType;
    private interval: number = 0;

    constructor() {
        this.progressBarElement = null;
        this.passButtonElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];
        this.routeParams = UrlManager.getQueryParams();
        void this.init(); // подавляем warning про "ignored promise"
    }

    private async init(): Promise<void> {
        if (this.routeParams.id) {
            try {
                const result: DefaultResponseType | QuizType = await CustomHttp.request(
                    `${config.host}/tests/${this.routeParams.id}`
                );

                if (!result) return;

                if ((result as DefaultResponseType).error !== undefined) {
                    console.error((result as DefaultResponseType).message);
                    return;
                }

                this.quiz = result as QuizType;
                this.startQuiz();
            } catch (error) {
                console.log(error);
            }
        }
    }

    private getQuestions(): QuizQuestionType[] {
        const qz: any = this.quiz as any;
        return (qz?.questions ?? qz?.question ?? []) as QuizQuestionType[];
    }

    private getQuestionText(q: QuizQuestionType): string {
        const anyQ = q as any;
        return anyQ.question ?? anyQ.text ?? anyQ.title ?? "";
    }

    private startQuiz(): void {
        if (!this.quiz) return;

        // Находим все DOM-узлы
        this.progressBarElement = document.getElementById("progressbar");
        this.questionTitleElement = document.getElementById("title");
        this.optionsElement = document.getElementById("options");
        this.nextButtonElement = document.getElementById("next");
        this.prevButtonElement = document.getElementById("prev");
        this.passButtonElement = document.getElementById("pass");

        if (this.nextButtonElement) {
            this.nextButtonElement.onclick = this.move.bind(this, ActionTestTypes.next);
        }
        if (this.prevButtonElement) {
            this.prevButtonElement.onclick = this.move.bind(this, ActionTestTypes.prev);
        }
        if (this.passButtonElement) {
            this.passButtonElement.onclick = this.move.bind(this, ActionTestTypes.pass);
        }

        // Заголовок теста (замени 'pre-title' на фактический id, если другой)
        const preTitleElement: HTMLElement | null = document.getElementById("pre-title");
        if (preTitleElement && this.quiz) {
            preTitleElement.innerText = this.quiz.name;
        }

        if (this.quiz) {
            localStorage.setItem("testTitle", this.quiz.name);
        }

        this.prepareProgressBar();
        this.showQuestion();

        // Таймер
        const timerElement: HTMLElement | null = document.getElementById("timer");
        let seconds = 59;
        const that: Test = this;
        this.interval = window.setInterval(() => {
            seconds--;
            if (timerElement) timerElement.innerText = String(seconds);
            if (seconds === 0) {
                clearInterval(that.interval);
                void that.complete();
            }
        }, 1000);
    }

    private prepareProgressBar(): void {
        if (!this.quiz || !this.progressBarElement) return;

        const questions = this.getQuestions();
        for (let i = 0; i < questions.length; i++) {
            const itemElement: HTMLDivElement = document.createElement("div");
            itemElement.className = "test__progressbar-item" + (i === 0 ? " active" : "");

            const itemCircleElement: HTMLDivElement = document.createElement("div");
            itemCircleElement.className = "test__progressbar-item-circle";

            const itemTextElement: HTMLDivElement = document.createElement("div");
            itemTextElement.className = "test__progressbar-item-text";
            itemTextElement.innerText = "Вопрос " + (i + 1);

            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);
            this.progressBarElement.appendChild(itemElement);
        }
    }

    public showQuestion(): void {
        if (!this.quiz) return;

        const questions = this.getQuestions();
        const idx = this.currentQuestionIndex - 1;
        const maybeQ = questions[idx];
        if (!maybeQ) return; // защита от undefined

        const activeQuestion: QuizQuestionType = maybeQ;

        if (this.questionTitleElement) {
            this.questionTitleElement.innerHTML =
                `<span>Вопрос ${this.currentQuestionIndex}:</span> ${this.getQuestionText(activeQuestion)}`;
        }
        if (this.optionsElement) {
            this.optionsElement.innerHTML = "";
        }

        const choiceOption = this.userResult.find(
            (item) => item.questionId === activeQuestion.id
        );

        activeQuestion.answers.forEach((answer: QuizAnswerType) => {
            const optionElement: HTMLDivElement = document.createElement("div");
            optionElement.className = "test__question-option";

            const inputId = `answer-${answer.id}`;
            const inputElement: HTMLInputElement = document.createElement("input");
            inputElement.className = "option-answer";
            inputElement.id = inputId;
            inputElement.type = "radio";
            inputElement.name = "answer";
            inputElement.value = String(answer.id);

            if (choiceOption && choiceOption.chosenAnswerId === answer.id) {
                inputElement.checked = true;
            }

            inputElement.onchange = () => this.chooseAnswer();

            const labelElement: HTMLLabelElement = document.createElement("label");
            labelElement.setAttribute("for", inputId);
            labelElement.innerText = answer.answer;

            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);
            this.optionsElement?.appendChild(optionElement);
        });

        if (this.nextButtonElement) {
            if (choiceOption?.chosenAnswerId) {
                this.nextButtonElement.removeAttribute("disabled");
            } else {
                this.nextButtonElement.setAttribute("disabled", "disabled");
            }
            this.nextButtonElement.innerText =
                this.currentQuestionIndex === questions.length ? "Завершить" : "Далее";
        }

        if (this.prevButtonElement) {
            if (this.currentQuestionIndex > 1) {
                this.prevButtonElement.removeAttribute("disabled");
            } else {
                this.prevButtonElement.setAttribute("disabled", "disabled");
            }
        }
    }

    private chooseAnswer(): void {
        if (this.nextButtonElement) {
            this.nextButtonElement.removeAttribute("disabled");
        }
    }

    private move(action: ActionTestTypes): void {
        if (!this.quiz) return;

        const questions = this.getQuestions();
        const idx = this.currentQuestionIndex - 1;
        const maybeQ = questions[idx];
        if (!maybeQ) return;

        const activeQuestion: QuizQuestionType = maybeQ;

        const chosenAnswerInput = Array.from(
            document.getElementsByClassName("option-answer")
        ).find((el) => (el as HTMLInputElement).checked) as HTMLInputElement | undefined;

        const chosenAnswerId = chosenAnswerInput?.value ? Number(chosenAnswerInput.value) : null;

        const existingResult = this.userResult.find((i) => i.questionId === activeQuestion.id);
        if (chosenAnswerId) {
            if (existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId;
            } else {
                this.userResult.push({ questionId: activeQuestion.id, chosenAnswerId });
            }
        }

        if (action === ActionTestTypes.next || action === ActionTestTypes.pass) {
            this.currentQuestionIndex++;
        } else {
            this.currentQuestionIndex--;
        }

        if (this.currentQuestionIndex > questions.length) {
            clearInterval(this.interval);
            void this.complete();
            return;
        }

        if (this.progressBarElement) {
            Array.from(this.progressBarElement.children).forEach((item: Element, index: number) => {
                const currentItemIndex = index + 1;
                item.classList.remove("complete", "active");
                if (currentItemIndex === this.currentQuestionIndex) item.classList.add("active");
                else if (currentItemIndex < this.currentQuestionIndex) item.classList.add("complete");
            });
        }

        this.showQuestion();
    }

    private async complete(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            console.warn('[complete] userInfo is null. localStorage snapshot:', {
                accessToken: localStorage.getItem(Auth.accessTokenKey),
                refreshToken: localStorage.getItem('refreshToken'),
                userInfoRaw: localStorage.getItem('userInfo'),
            });
            location.href = '/#';
            return;
        }


        const testId = this.routeParams.id ?? "";
        if (!testId) {
            console.error("Нет ID теста при завершении");
            return;
        }

        try {
            const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(
                `${config.host}/tests/${testId}/pass`,
                "POST",
                {
                    userId: userInfo.userId,
                    results: this.userResult,
                }
            );

            if (!result) return;

            if ((result as DefaultResponseType).error !== undefined) {
                console.error((result as DefaultResponseType).message);
                return;
            }

            localStorage.setItem("lastTestId", testId);
            location.href = "#/result?id=" + testId;
        } catch (error) {
            console.log(error);
        }
    }
}

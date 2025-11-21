import {CustomHttp} from "../services/custom-http";
import {Auth} from "../services/auth";
import config from "../../config/config";
import type {QueryParamsType} from "../types/query-params-type";
import type {QuizListType} from "../types/quiz-list.type";
import type {TestResultType} from "../types/test-result.type";
import type {DefaultResponseType} from "../types/default-response.type";
import {UrlManager} from "../utils/url-manager";

export class Choice {
    private quizzes: QuizListType[] = [];
    private testResult: TestResultType[] | null = null;
    private routeParams: QueryParamsType;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        void this.routeParams;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            this.quizzes = await CustomHttp.request(config.host + '/tests');
        } catch (error) {
            console.log(error);
            return;
        }

        const userInfo = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result: DefaultResponseType | TestResultType[] =
                    await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);

                if (result) {
                    // вместо throw внутри того же try/catch — просто обработаем ветку ошибки
                    if ((result as DefaultResponseType).error !== undefined) {
                        console.error((result as DefaultResponseType).message);
                        // можно показать сообщение пользователю или просто прервать
                        // this.showError?.((result as DefaultResponseType).message);
                        return;
                    }

                    this.testResult = result as TestResultType[];
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }

        this.processQuizzes();
    }

    private processQuizzes(): void {
        // это контейнер (div и т.п.), а не <option>
        const choiceOptionsElement = document.getElementById('choice__options') as HTMLDivElement | null;

        if (this.quizzes && this.quizzes.length > 0 && choiceOptionsElement) {
            this.quizzes.forEach((quiz: QuizListType) => {
                const choiceOptionElement: HTMLDivElement = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id.toString());
                choiceOptionElement.onclick = () => {
                    this.chooseQuiz(choiceOptionElement);
                };

                const choiceOptionTextElement: HTMLDivElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement: HTMLDivElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';

                if (this.testResult) {
                    const result: TestResultType | undefined =
                        this.testResult.find(item => item.testId === quiz.id);
                    if (result) {
                        const choiceOptionResultElement: HTMLDivElement = document.createElement('div');
                        choiceOptionResultElement.className = 'choice__option-result';
                        // поправил опечатку «Рузультат» → «Результат»
                        choiceOptionResultElement.innerHTML =
                            '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                        choiceOptionElement.appendChild(choiceOptionResultElement);
                    }
                }

                const choiceOptionImageElement: HTMLImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }

    private chooseQuiz(element: HTMLElement): void {
        const dataId: string | null = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}

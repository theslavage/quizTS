/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config/config.ts":
/*!**************************!*\
  !*** ./config/config.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    host: 'http://localhost:3000/api'
});


/***/ }),

/***/ "./src/components/answers.ts":
/*!***********************************!*\
  !*** ./src/components/answers.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Answers: () => (/* binding */ Answers)
/* harmony export */ });
/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/custom-http */ "./src/services/custom-http.ts");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/auth */ "./src/services/auth.ts");



class Answers {
    constructor() {
        this.test = null;
        const testId = localStorage.getItem("lastTestId");
        const userInfo = _services_auth__WEBPACK_IMPORTED_MODULE_2__.Auth.getUserInfo();
        if (!testId || !userInfo) {
            location.href = "#/";
            return;
        }
        void this.loadAnswers(testId, userInfo.userId);
    }
    async loadAnswers(testId, userId) {
        try {
            const result = (await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(`${_config_config__WEBPACK_IMPORTED_MODULE_1__["default"].host}/tests/${testId}/result/details?userId=${userId}`));
            if (!result || ("error" in result && result.error)) {
                alert("Ошибка загрузки данных");
                return;
            }
            const data = result;
            if (!data.test || !Array.isArray(data.test.questions)) {
                console.error("Неверный формат ответа details");
                alert("Ошибка формата данных");
                return;
            }
            this.test = data.test;
            this.renderQuestions();
        }
        catch (error) {
            console.error(error);
            alert("Произошла ошибка при загрузке данных");
        }
    }
    renderQuestions() {
        if (!this.test)
            return;
        const questionsBlock = document.createElement("div");
        this.test.questions.forEach((question, index) => {
            const questionWrapper = document.createElement("div");
            questionWrapper.className = "answers__question";
            const title = document.createElement("div");
            title.className = "test__question-title";
            const q = question;
            const questionText = q.question ?? q.text ?? q.title ?? "";
            title.innerHTML = `<span>Вопрос ${index + 1}:</span> ${questionText}`;
            const options = document.createElement("div");
            options.className = "test__question-options";
            options.style.minHeight = "200px";
            question.answers.forEach((answer) => {
                const option = document.createElement("div");
                option.className = "test__question-option";
                const inputId = `answer-${question.id}-${answer.id}`;
                const input = document.createElement("input");
                input.type = "radio";
                input.id = inputId;
                input.name = "question-" + String(question.id);
                input.disabled = true;
                const label = document.createElement("label");
                label.setAttribute("for", inputId);
                label.innerText = answer.answer;
                const anyAns = answer;
                if (anyAns.correct !== undefined) {
                    input.checked = true;
                    input.style.setProperty("--hide-dot", "true");
                    if (Boolean(anyAns.correct)) {
                        label.style.color = "#5FDC33";
                        input.style.border = "5px solid #5FDC33";
                    }
                    else {
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
        }
        else {
            const container = document.querySelector(".container");
            container?.appendChild(questionsBlock);
        }
        const preTitleElement = document.getElementById("pre-title");
        if (preTitleElement)
            preTitleElement.textContent = this.test.name;
        const email = localStorage.getItem("userEmail");
        if (email) {
            const emailElement = document.createElement("div");
            emailElement.style.marginTop = "20px";
            emailElement.style.fontWeight = "bold";
            emailElement.innerText = `Пользователь: ${email}`;
            const container = document.querySelector(".container");
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
                }
                else if (testId) {
                    href = `#/result?id=${encodeURIComponent(testId)}`;
                }
                else {
                    alert("Результаты теста не найдены");
                    return;
                }
                location.href = href;
            });
        }
    }
}


/***/ }),

/***/ "./src/components/choice.ts":
/*!**********************************!*\
  !*** ./src/components/choice.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Choice: () => (/* binding */ Choice)
/* harmony export */ });
/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/custom-http */ "./src/services/custom-http.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/auth */ "./src/services/auth.ts");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");
/* harmony import */ var _utils_url_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/url-manager */ "./src/utils/url-manager.ts");




class Choice {
    constructor() {
        this.quizzes = [];
        this.testResult = null;
        this.routeParams = _utils_url_manager__WEBPACK_IMPORTED_MODULE_3__.UrlManager.getQueryParams();
        void this.routeParams;
        this.init();
    }
    async init() {
        try {
            this.quizzes = await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host + '/tests');
        }
        catch (error) {
            console.log(error);
            return;
        }
        const userInfo = _services_auth__WEBPACK_IMPORTED_MODULE_1__.Auth.getUserInfo();
        if (userInfo) {
            try {
                const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    // вместо throw внутри того же try/catch — просто обработаем ветку ошибки
                    if (result.error !== undefined) {
                        console.error(result.message);
                        // можно показать сообщение пользователю или просто прервать
                        // this.showError?.((result as DefaultResponseType).message);
                        return;
                    }
                    this.testResult = result;
                }
            }
            catch (error) {
                console.log(error);
                return;
            }
        }
        this.processQuizzes();
    }
    processQuizzes() {
        // это контейнер (div и т.п.), а не <option>
        const choiceOptionsElement = document.getElementById('choice__options');
        if (this.quizzes && this.quizzes.length > 0 && choiceOptionsElement) {
            this.quizzes.forEach((quiz) => {
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice__option';
                choiceOptionElement.setAttribute('data-id', quiz.id.toString());
                choiceOptionElement.onclick = () => {
                    this.chooseQuiz(choiceOptionElement);
                };
                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice__option-text';
                choiceOptionTextElement.innerText = quiz.name;
                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice__option-arrow';
                if (this.testResult) {
                    const result = this.testResult.find(item => item.testId === quiz.id);
                    if (result) {
                        const choiceOptionResultElement = document.createElement('div');
                        choiceOptionResultElement.className = 'choice__option-result';
                        // поправил опечатку «Рузультат» → «Результат»
                        choiceOptionResultElement.innerHTML =
                            '<div>Результат</div><div>' + result.score + '/' + result.total + '</div>';
                        choiceOptionElement.appendChild(choiceOptionResultElement);
                    }
                }
                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');
                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);
                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }
    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}


/***/ }),

/***/ "./src/components/form.ts":
/*!********************************!*\
  !*** ./src/components/form.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Form: () => (/* binding */ Form)
/* harmony export */ });
/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/custom-http */ "./src/services/custom-http.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/auth */ "./src/services/auth.ts");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");



class Form {
    constructor(page) {
        this.fields = [];
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;
        const accessToken = localStorage.getItem(_services_auth__WEBPACK_IMPORTED_MODULE_1__.Auth.accessTokenKey);
        if (accessToken) {
            location.href = "#/choice";
            return;
        }
        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];
        if (this.page === "signup") {
            this.fields.unshift({
                name: "name",
                id: "name",
                element: null,
                regex: /^[А-ЯЁ][а-яё]+\s*$/u,
                valid: false,
            }, {
                name: "lastName",
                id: "last-name",
                element: null,
                regex: /^[А-ЯЁ][а-яё]+\s*$/u,
                valid: false,
            });
        }
        // Привязка полей
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.addEventListener("change", () => {
                    this.validateField(item, item.element);
                });
            }
        });
        // Кнопка "Продолжить"
        this.processElement = document.getElementById("process");
        if (this.processElement) {
            this.processElement.addEventListener("click", () => {
                // Явно игнорируем промис, чтобы не было warning про «ignored promise»
                void this.processForm();
            });
        }
        // Чекбокс согласия
        if (this.page === "signup") {
            this.agreeElement = document.getElementById("agree");
            if (this.agreeElement) {
                this.agreeElement.addEventListener("change", () => this.validateForm());
            }
        }
    }
    validateField(field, element) {
        const parent = element.parentElement;
        const ok = !!element.value && field.regex.test(element.value);
        if (parent) {
            if (!ok) {
                parent.style.borderColor = "red";
            }
            else {
                parent.removeAttribute("style");
            }
        }
        field.valid = ok;
        this.validateForm();
    }
    validateForm() {
        const validForm = this.fields.every((item) => item.valid);
        const isValid = this.agreeElement ? !!this.agreeElement.checked && validForm : validForm;
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute("disabled");
            }
            else {
                this.processElement.setAttribute("disabled", "disabled");
            }
        }
        return isValid;
    }
    async processForm() {
        if (!this.validateForm())
            return;
        const email = this.fields.find((i) => i.name === "email")?.element?.value ?? "";
        const password = this.fields.find((i) => i.name === "password")?.element?.value ?? "";
        if (this.page === "signup") {
            try {
                const name = this.fields.find((i) => i.name === "name")?.element?.value ?? "";
                const lastName = this.fields.find((i) => i.name === "lastName")?.element?.value ?? "";
                const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host + "/signup", "POST", { name, lastName, email, password });
                if (result) {
                    // вместо throw — мягкая обработка ошибки
                    if (result.error || !result.user) {
                        console.error(result.message);
                        this.showFormError(result.message || "Ошибка регистрации.");
                        return;
                    }
                }
            }
            catch (error) {
                console.log(error);
                this.showFormError("Ошибка сети при регистрации.");
                return;
            }
        }
        try {
            const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_0__.CustomHttp.request(_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host + "/login", "POST", { email, password });
            if (!result || result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
                this.showFormError("Данные некорректны. Проверьте логин и пароль.");
                return;
            }
            // Сохраняем только токены — userInfo, по идее, парсится из токена в Auth.getUserInfo()
            _services_auth__WEBPACK_IMPORTED_MODULE_1__.Auth.setTokens(result.accessToken, result.refreshToken);
            _services_auth__WEBPACK_IMPORTED_MODULE_1__.Auth.setUserInfo({
                fullName: result.fullName,
                userId: result.userId,
            });
            // Если хочешь сохранить email для автоподстановки — делаем это только когда он явно есть
            if (email) {
                localStorage.setItem("userEmail", email);
            }
            location.href = "#/choice";
        }
        catch (error) {
            console.log(error);
            this.showFormError("Ошибка сети при входе.");
        }
    }
    showFormError(message) {
        const errorElement = document.getElementById("form-error");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
            setTimeout(() => {
                errorElement.style.display = "none";
            }, 3000);
        }
        else {
            alert(message);
        }
    }
}


/***/ }),

/***/ "./src/components/result.ts":
/*!**********************************!*\
  !*** ./src/components/result.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Result: () => (/* binding */ Result)
/* harmony export */ });
/* harmony import */ var _utils_url_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager */ "./src/utils/url-manager.ts");
/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/custom-http */ "./src/services/custom-http.ts");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/auth */ "./src/services/auth.ts");




class Result {
    constructor() {
        this.routeParams = _utils_url_manager__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();
        if (!this.routeParams.id) {
            const lastId = localStorage.getItem("lastTestId");
            if (lastId) {
                this.routeParams.id = lastId;
            }
        }
        this.init();
    }
    async init() {
        const userInfo = _services_auth__WEBPACK_IMPORTED_MODULE_3__.Auth.getUserInfo();
        if (!userInfo) {
            this.showError("Вы не авторизованы. Пожалуйста, войдите в систему.");
            return;
        }
        if (!this.routeParams.id) {
            this.showError("Нет ID теста. Невозможно отобразить результат.");
            return;
        }
        try {
            const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_1__.CustomHttp.request(`${_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host}/tests/${this.routeParams.id}/result?userId=${userInfo.userId}`);
            if (result && !("error" in result && result.error)) {
                const resultScoreElement = document.getElementById("result-score");
                if (resultScoreElement && "score" in result && "total" in result) {
                    resultScoreElement.innerText = `${result.score}/${result.total}`;
                }
            }
            else {
                this.showError("Ошибка при получении результата.");
            }
        }
        catch (error) {
            console.error(error);
            this.showError("Произошла ошибка при загрузке результата.");
        }
    }
    showError(message) {
        const container = document.querySelector(".result .container");
        if (container) {
            container.innerHTML = `<div style="color: red; font-size: 18px; padding: 20px;">${message}</div>`;
        }
    }
}


/***/ }),

/***/ "./src/components/test.ts":
/*!********************************!*\
  !*** ./src/components/test.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Test: () => (/* binding */ Test)
/* harmony export */ });
/* harmony import */ var _utils_url_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/url-manager */ "./src/utils/url-manager.ts");
/* harmony import */ var _services_custom_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/custom-http */ "./src/services/custom-http.ts");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/auth */ "./src/services/auth.ts");
/* harmony import */ var _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../types/action-test.type */ "./src/types/action-test.type.ts");





class Test {
    constructor() {
        this.interval = 0;
        this.progressBarElement = null;
        this.passButtonElement = null;
        this.nextButtonElement = null;
        this.prevButtonElement = null;
        this.questionTitleElement = null;
        this.optionsElement = null;
        this.quiz = null;
        this.currentQuestionIndex = 1;
        this.userResult = [];
        this.routeParams = _utils_url_manager__WEBPACK_IMPORTED_MODULE_0__.UrlManager.getQueryParams();
        void this.init(); // подавляем warning про "ignored promise"
    }
    async init() {
        if (this.routeParams.id) {
            try {
                const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_1__.CustomHttp.request(`${_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host}/tests/${this.routeParams.id}`);
                if (!result)
                    return;
                if (result.error !== undefined) {
                    console.error(result.message);
                    return;
                }
                this.quiz = result;
                this.startQuiz();
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    getQuestions() {
        const qz = this.quiz;
        return (qz?.questions ?? qz?.question ?? []);
    }
    getQuestionText(q) {
        const anyQ = q;
        return anyQ.question ?? anyQ.text ?? anyQ.title ?? "";
    }
    startQuiz() {
        if (!this.quiz)
            return;
        // Находим все DOM-узлы
        this.progressBarElement = document.getElementById("progressbar");
        this.questionTitleElement = document.getElementById("title");
        this.optionsElement = document.getElementById("options");
        this.nextButtonElement = document.getElementById("next");
        this.prevButtonElement = document.getElementById("prev");
        this.passButtonElement = document.getElementById("pass");
        if (this.nextButtonElement) {
            this.nextButtonElement.onclick = this.move.bind(this, _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__.ActionTestTypes.next);
        }
        if (this.prevButtonElement) {
            this.prevButtonElement.onclick = this.move.bind(this, _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__.ActionTestTypes.prev);
        }
        if (this.passButtonElement) {
            this.passButtonElement.onclick = this.move.bind(this, _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__.ActionTestTypes.pass);
        }
        // Заголовок теста (замени 'pre-title' на фактический id, если другой)
        const preTitleElement = document.getElementById("pre-title");
        if (preTitleElement && this.quiz) {
            preTitleElement.innerText = this.quiz.name;
        }
        if (this.quiz) {
            localStorage.setItem("testTitle", this.quiz.name);
        }
        this.prepareProgressBar();
        this.showQuestion();
        // Таймер
        const timerElement = document.getElementById("timer");
        let seconds = 59;
        const that = this;
        this.interval = window.setInterval(() => {
            seconds--;
            if (timerElement)
                timerElement.innerText = String(seconds);
            if (seconds === 0) {
                clearInterval(that.interval);
                void that.complete();
            }
        }, 1000);
    }
    prepareProgressBar() {
        if (!this.quiz || !this.progressBarElement)
            return;
        const questions = this.getQuestions();
        for (let i = 0; i < questions.length; i++) {
            const itemElement = document.createElement("div");
            itemElement.className = "test__progressbar-item" + (i === 0 ? " active" : "");
            const itemCircleElement = document.createElement("div");
            itemCircleElement.className = "test__progressbar-item-circle";
            const itemTextElement = document.createElement("div");
            itemTextElement.className = "test__progressbar-item-text";
            itemTextElement.innerText = "Вопрос " + (i + 1);
            itemElement.appendChild(itemCircleElement);
            itemElement.appendChild(itemTextElement);
            this.progressBarElement.appendChild(itemElement);
        }
    }
    showQuestion() {
        if (!this.quiz)
            return;
        const questions = this.getQuestions();
        const idx = this.currentQuestionIndex - 1;
        const maybeQ = questions[idx];
        if (!maybeQ)
            return; // защита от undefined
        const activeQuestion = maybeQ;
        if (this.questionTitleElement) {
            this.questionTitleElement.innerHTML =
                `<span>Вопрос ${this.currentQuestionIndex}:</span> ${this.getQuestionText(activeQuestion)}`;
        }
        if (this.optionsElement) {
            this.optionsElement.innerHTML = "";
        }
        const choiceOption = this.userResult.find((item) => item.questionId === activeQuestion.id);
        activeQuestion.answers.forEach((answer) => {
            const optionElement = document.createElement("div");
            optionElement.className = "test__question-option";
            const inputId = `answer-${answer.id}`;
            const inputElement = document.createElement("input");
            inputElement.className = "option-answer";
            inputElement.id = inputId;
            inputElement.type = "radio";
            inputElement.name = "answer";
            inputElement.value = String(answer.id);
            if (choiceOption && choiceOption.chosenAnswerId === answer.id) {
                inputElement.checked = true;
            }
            inputElement.onchange = () => this.chooseAnswer();
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", inputId);
            labelElement.innerText = answer.answer;
            optionElement.appendChild(inputElement);
            optionElement.appendChild(labelElement);
            this.optionsElement?.appendChild(optionElement);
        });
        if (this.nextButtonElement) {
            if (choiceOption?.chosenAnswerId) {
                this.nextButtonElement.removeAttribute("disabled");
            }
            else {
                this.nextButtonElement.setAttribute("disabled", "disabled");
            }
            this.nextButtonElement.innerText =
                this.currentQuestionIndex === questions.length ? "Завершить" : "Далее";
        }
        if (this.prevButtonElement) {
            if (this.currentQuestionIndex > 1) {
                this.prevButtonElement.removeAttribute("disabled");
            }
            else {
                this.prevButtonElement.setAttribute("disabled", "disabled");
            }
        }
    }
    chooseAnswer() {
        if (this.nextButtonElement) {
            this.nextButtonElement.removeAttribute("disabled");
        }
    }
    move(action) {
        if (!this.quiz)
            return;
        const questions = this.getQuestions();
        const idx = this.currentQuestionIndex - 1;
        const maybeQ = questions[idx];
        if (!maybeQ)
            return;
        const activeQuestion = maybeQ;
        const chosenAnswerInput = Array.from(document.getElementsByClassName("option-answer")).find((el) => el.checked);
        const chosenAnswerId = chosenAnswerInput?.value ? Number(chosenAnswerInput.value) : null;
        const existingResult = this.userResult.find((i) => i.questionId === activeQuestion.id);
        if (chosenAnswerId) {
            if (existingResult) {
                existingResult.chosenAnswerId = chosenAnswerId;
            }
            else {
                this.userResult.push({ questionId: activeQuestion.id, chosenAnswerId });
            }
        }
        if (action === _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__.ActionTestTypes.next || action === _types_action_test_type__WEBPACK_IMPORTED_MODULE_4__.ActionTestTypes.pass) {
            this.currentQuestionIndex++;
        }
        else {
            this.currentQuestionIndex--;
        }
        if (this.currentQuestionIndex > questions.length) {
            clearInterval(this.interval);
            void this.complete();
            return;
        }
        if (this.progressBarElement) {
            Array.from(this.progressBarElement.children).forEach((item, index) => {
                const currentItemIndex = index + 1;
                item.classList.remove("complete", "active");
                if (currentItemIndex === this.currentQuestionIndex)
                    item.classList.add("active");
                else if (currentItemIndex < this.currentQuestionIndex)
                    item.classList.add("complete");
            });
        }
        this.showQuestion();
    }
    async complete() {
        const userInfo = _services_auth__WEBPACK_IMPORTED_MODULE_3__.Auth.getUserInfo();
        if (!userInfo) {
            console.warn('[complete] userInfo is null. localStorage snapshot:', {
                accessToken: localStorage.getItem(_services_auth__WEBPACK_IMPORTED_MODULE_3__.Auth.accessTokenKey),
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
            const result = await _services_custom_http__WEBPACK_IMPORTED_MODULE_1__.CustomHttp.request(`${_config_config__WEBPACK_IMPORTED_MODULE_2__["default"].host}/tests/${testId}/pass`, "POST", {
                userId: userInfo.userId,
                results: this.userResult,
            });
            if (!result)
                return;
            if (result.error !== undefined) {
                console.error(result.message);
                return;
            }
            localStorage.setItem("lastTestId", testId);
            location.href = "#/result?id=" + testId;
        }
        catch (error) {
            console.log(error);
        }
    }
}


/***/ }),

/***/ "./src/router.ts":
/*!***********************!*\
  !*** ./src/router.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Router: () => (/* binding */ Router)
/* harmony export */ });
/* harmony import */ var _components_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/form */ "./src/components/form.ts");
/* harmony import */ var _components_choice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/choice */ "./src/components/choice.ts");
/* harmony import */ var _components_test__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/test */ "./src/components/test.ts");
/* harmony import */ var _components_result__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/result */ "./src/components/result.ts");
/* harmony import */ var _components_answers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/answers */ "./src/components/answers.ts");
/* harmony import */ var _services_auth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/auth */ "./src/services/auth.ts");






class Router {
    constructor() {
        this.contentElement = document.getElementById("content");
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                style: "styles/index.css",
                load: () => { }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                style: "styles/form.css",
                load: () => { new _components_form__WEBPACK_IMPORTED_MODULE_0__.Form('signup'); }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                style: "styles/form.css",
                load: () => { new _components_form__WEBPACK_IMPORTED_MODULE_0__.Form('login'); }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                style: "styles/choice.css",
                load: () => { new _components_choice__WEBPACK_IMPORTED_MODULE_1__.Choice(); }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                style: "styles/test.css",
                load: () => { new _components_test__WEBPACK_IMPORTED_MODULE_2__.Test(); }
            },
            {
                route: '#/result',
                title: 'Результаты',
                template: 'templates/result.html',
                style: "styles/result.css",
                load: () => { new _components_result__WEBPACK_IMPORTED_MODULE_3__.Result(); }
            },
            {
                route: '#/answers',
                title: 'Ответы',
                template: 'templates/answers.html',
                style: "styles/answers.css",
                load: () => { new _components_answers__WEBPACK_IMPORTED_MODULE_4__.Answers(); }
            },
            {
                route: '#/logout',
                title: 'Выход',
                template: 'templates/index.html',
                style: "styles/index.css",
                load: () => { }
            },
        ];
    }
    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            const result = await _services_auth__WEBPACK_IMPORTED_MODULE_5__.Auth.logout();
            if (result) {
                window.location.href = '#/';
                return;
            }
        }
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        if (!this.contentElement || !this.stylesElement || !this.titleElement || !this.profileElement || !this.profileFullNameElement) {
            if (urlRoute === '#/')
                return;
            window.location.href = '#/';
            return;
        }
        this.contentElement.innerHTML = await fetch(newRoute.template).then(r => r.text());
        this.stylesElement.setAttribute('href', newRoute.style); // <-- style, не styles
        this.titleElement.innerText = newRoute.title;
        const userInfo = _services_auth__WEBPACK_IMPORTED_MODULE_5__.Auth.getUserInfo();
        const accessToken = localStorage.getItem(_services_auth__WEBPACK_IMPORTED_MODULE_5__.Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName;
        }
        else {
            this.profileElement.style.display = 'none';
        }
        void newRoute.load();
    }
}


/***/ }),

/***/ "./src/services/auth.ts":
/*!******************************!*\
  !*** ./src/services/auth.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Auth: () => (/* binding */ Auth)
/* harmony export */ });
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");

class Auth {
    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(_config_config__WEBPACK_IMPORTED_MODULE_0__["default"].host + '/refresh', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ refreshToken })
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error && result.accessToken && result.refreshToken) {
                    this.setTokens(result.accessToken, result.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        return false;
    }
    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response = await fetch(_config_config__WEBPACK_IMPORTED_MODULE_0__["default"].host + '/logout', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ refreshToken })
            });
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(this.userInfoKey);
                    return true;
                }
            }
        }
        return false;
    }
    static setTokens(accessToken, refreshToken) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static removeTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
    // СДЕЛАЛИ СТАТИЧЕСКИМ
    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    }
    static getUserInfo() {
        const userInfo = localStorage.getItem(this.userInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }
        return null;
    }
}
Auth.accessTokenKey = 'accessToken';
Auth.refreshTokenKey = 'refreshToken';
Auth.userInfoKey = 'userInfo';


/***/ }),

/***/ "./src/services/custom-http.ts":
/*!*************************************!*\
  !*** ./src/services/custom-http.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomHttp: () => (/* binding */ CustomHttp)
/* harmony export */ });
/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auth */ "./src/services/auth.ts");

class CustomHttp {
    static async request(url, method = 'GET', body = null) {
        const params = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        };
        let token = localStorage.getItem(_auth__WEBPACK_IMPORTED_MODULE_0__.Auth.accessTokenKey);
        if (token) {
            params.headers['x-access-token'] = token;
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        const response = await fetch(url, params);
        if (response.status < 200 || response.status >= 300) {
            if (response.status === 401) {
                const result = await _auth__WEBPACK_IMPORTED_MODULE_0__.Auth.processUnauthorizedResponse();
                if (result) {
                    return await this.request(url, method, body);
                }
                else {
                    return null;
                }
            }
            throw new Error(response.statusText);
        }
        return await response.json();
    }
}


/***/ }),

/***/ "./src/types/action-test.type.ts":
/*!***************************************!*\
  !*** ./src/types/action-test.type.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTestTypes: () => (/* binding */ ActionTestTypes)
/* harmony export */ });
var ActionTestTypes;
(function (ActionTestTypes) {
    ActionTestTypes["next"] = "next";
    ActionTestTypes["pass"] = "pass";
    ActionTestTypes["prev"] = "prev";
})(ActionTestTypes || (ActionTestTypes = {}));


/***/ }),

/***/ "./src/utils/url-manager.ts":
/*!**********************************!*\
  !*** ./src/utils/url-manager.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UrlManager: () => (/* binding */ UrlManager)
/* harmony export */ });
class UrlManager {
    static getQueryParams() {
        const qs = (document.location.hash || "").replace(/\+/g, " ");
        const params = {};
        const re = /[?&]([^=]+)=([^&]*)/g;
        let token;
        while ((token = re.exec(qs)) !== null) {
            const key = token[1];
            const val = token[2];
            if (key !== undefined && val !== undefined) {
                params[decodeURIComponent(key)] = decodeURIComponent(val);
            }
        }
        return params;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router */ "./src/router.ts");

class App {
    constructor() {
        this.router = new _router__WEBPACK_IMPORTED_MODULE_0__.Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }
    handleRouteChanging() {
        this.router.openRoute();
    }
}
(new App());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRWhDLE1BQU0sR0FBRztJQUdMO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDJDQUFNLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFTSxtQkFBbUI7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QixDQUFDO0NBQ0o7QUFFRCxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3F1aXovLi9jb25maWcvY29uZmlnLnRzIiwid2VicGFjazovL3F1aXovLi9zcmMvY29tcG9uZW50cy9hbnN3ZXJzLnRzIiwid2VicGFjazovL3F1aXovLi9zcmMvY29tcG9uZW50cy9jaG9pY2UudHMiLCJ3ZWJwYWNrOi8vcXVpei8uL3NyYy9jb21wb25lbnRzL2Zvcm0udHMiLCJ3ZWJwYWNrOi8vcXVpei8uL3NyYy9jb21wb25lbnRzL3Jlc3VsdC50cyIsIndlYnBhY2s6Ly9xdWl6Ly4vc3JjL2NvbXBvbmVudHMvdGVzdC50cyIsIndlYnBhY2s6Ly9xdWl6Ly4vc3JjL3JvdXRlci50cyIsIndlYnBhY2s6Ly9xdWl6Ly4vc3JjL3NlcnZpY2VzL2F1dGgudHMiLCJ3ZWJwYWNrOi8vcXVpei8uL3NyYy9zZXJ2aWNlcy9jdXN0b20taHR0cC50cyIsIndlYnBhY2s6Ly9xdWl6Ly4vc3JjL3R5cGVzL2FjdGlvbi10ZXN0LnR5cGUudHMiLCJ3ZWJwYWNrOi8vcXVpei8uL3NyYy91dGlscy91cmwtbWFuYWdlci50cyIsIndlYnBhY2s6Ly9xdWl6L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3F1aXovd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3F1aXovd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9xdWl6L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcXVpei8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgaG9zdDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGknXHJcbn0iLCJpbXBvcnQgeyBDdXN0b21IdHRwIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2N1c3RvbS1odHRwXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZy9jb25maWdcIjtcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gXCIuLi9zZXJ2aWNlcy9hdXRoXCI7XHJcbmltcG9ydCB0eXBlIHsgRGVmYXVsdFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9kZWZhdWx0LXJlc3BvbnNlLnR5cGVcIjtcclxuaW1wb3J0IHR5cGUgeyBRdWl6VHlwZSwgUXVpelF1ZXN0aW9uVHlwZSwgUXVpekFuc3dlclR5cGUgfSBmcm9tIFwiLi4vdHlwZXMvcXVpei50eXBlXCI7XHJcbmltcG9ydCB0eXBlIHsgVXNlckluZm9UeXBlIH0gZnJvbSBcIi4uL3R5cGVzL3VzZXItaW5mby50eXBlXCI7XHJcblxyXG50eXBlIEFuc3dlcnNEZXRhaWxSZXNwb25zZSA9IHtcclxuICAgIGVycm9yPzogYm9vbGVhbjtcclxuICAgIG1lc3NhZ2U/OiBzdHJpbmc7XHJcbiAgICB0ZXN0OiBRdWl6VHlwZSAmIHsgcXVlc3Rpb25zOiBRdWl6UXVlc3Rpb25UeXBlW10gfTtcclxufTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbnN3ZXJzIHtcclxuICAgIHByaXZhdGUgdGVzdDogKFF1aXpUeXBlICYgeyBxdWVzdGlvbnM6IFF1aXpRdWVzdGlvblR5cGVbXSB9KSB8IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy50ZXN0ID0gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgdGVzdElkOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0VGVzdElkXCIpO1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBVc2VySW5mb1R5cGUgfCBudWxsID0gQXV0aC5nZXRVc2VySW5mbygpO1xyXG5cclxuICAgICAgICBpZiAoIXRlc3RJZCB8fCAhdXNlckluZm8pIHtcclxuICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiIy9cIjtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdm9pZCB0aGlzLmxvYWRBbnN3ZXJzKHRlc3RJZCwgdXNlckluZm8udXNlcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGxvYWRBbnN3ZXJzKHRlc3RJZDogc3RyaW5nLCB1c2VySWQ6IHN0cmluZyB8IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IChhd2FpdCBDdXN0b21IdHRwLnJlcXVlc3QoXHJcbiAgICAgICAgICAgICAgICBgJHtjb25maWcuaG9zdH0vdGVzdHMvJHt0ZXN0SWR9L3Jlc3VsdC9kZXRhaWxzP3VzZXJJZD0ke3VzZXJJZH1gXHJcbiAgICAgICAgICAgICkpIGFzIEFuc3dlcnNEZXRhaWxSZXNwb25zZSB8IERlZmF1bHRSZXNwb25zZVR5cGUgfCBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQgfHwgKFwiZXJyb3JcIiBpbiByZXN1bHQgJiYgcmVzdWx0LmVycm9yKSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0LfQsNCz0YDRg9C30LrQuCDQtNCw0L3QvdGL0YVcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXN1bHQgYXMgQW5zd2Vyc0RldGFpbFJlc3BvbnNlO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEudGVzdCB8fCAhQXJyYXkuaXNBcnJheSgoZGF0YS50ZXN0IGFzIGFueSkucXVlc3Rpb25zKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcItCd0LXQstC10YDQvdGL0Lkg0YTQvtGA0LzQsNGCINC+0YLQstC10YLQsCBkZXRhaWxzXCIpO1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0YTQvtGA0LzQsNGC0LAg0LTQsNC90L3Ri9GFXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRlc3QgPSBkYXRhLnRlc3QgYXMgUXVpelR5cGUgJiB7IHF1ZXN0aW9uczogUXVpelF1ZXN0aW9uVHlwZVtdIH07XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J/RgNC+0LjQt9C+0YjQu9CwINC+0YjQuNCx0LrQsCDQv9GA0Lgg0LfQsNCz0YDRg9C30LrQtSDQtNCw0L3QvdGL0YVcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVuZGVyUXVlc3Rpb25zKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy50ZXN0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IHF1ZXN0aW9uc0Jsb2NrOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgICAgIHRoaXMudGVzdC5xdWVzdGlvbnMuZm9yRWFjaCgocXVlc3Rpb246IFF1aXpRdWVzdGlvblR5cGUsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcXVlc3Rpb25XcmFwcGVyOiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uV3JhcHBlci5jbGFzc05hbWUgPSBcImFuc3dlcnNfX3F1ZXN0aW9uXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0aXRsZTogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInRlc3RfX3F1ZXN0aW9uLXRpdGxlXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBxOiBhbnkgPSBxdWVzdGlvbiBhcyBhbnk7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXN0aW9uVGV4dDogc3RyaW5nID0gcS5xdWVzdGlvbiA/PyBxLnRleHQgPz8gcS50aXRsZSA/PyBcIlwiO1xyXG5cclxuICAgICAgICAgICAgdGl0bGUuaW5uZXJIVE1MID0gYDxzcGFuPtCS0L7Qv9GA0L7RgSAke2luZGV4ICsgMX06PC9zcGFuPiAke3F1ZXN0aW9uVGV4dH1gO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBvcHRpb25zLmNsYXNzTmFtZSA9IFwidGVzdF9fcXVlc3Rpb24tb3B0aW9uc1wiO1xyXG4gICAgICAgICAgICAob3B0aW9ucy5zdHlsZSBhcyBhbnkpLm1pbkhlaWdodCA9IFwiMjAwcHhcIjtcclxuXHJcbiAgICAgICAgICAgIChxdWVzdGlvbi5hbnN3ZXJzIGFzIFF1aXpBbnN3ZXJUeXBlW10pLmZvckVhY2goKGFuc3dlcjogUXVpekFuc3dlclR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbjogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uLmNsYXNzTmFtZSA9IFwidGVzdF9fcXVlc3Rpb24tb3B0aW9uXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5wdXRJZCA9IGBhbnN3ZXItJHtxdWVzdGlvbi5pZH0tJHthbnN3ZXIuaWR9YDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICAgICAgICAgIGlucHV0LmlkID0gaW5wdXRJZDtcclxuICAgICAgICAgICAgICAgIGlucHV0Lm5hbWUgPSBcInF1ZXN0aW9uLVwiICsgU3RyaW5nKHF1ZXN0aW9uLmlkKTtcclxuICAgICAgICAgICAgICAgIGlucHV0LmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICAgICAgICAgIGxhYmVsLnNldEF0dHJpYnV0ZShcImZvclwiLCBpbnB1dElkKTtcclxuICAgICAgICAgICAgICAgIGxhYmVsLmlubmVyVGV4dCA9IGFuc3dlci5hbnN3ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYW55QW5zID0gYW5zd2VyIGFzIGFueTtcclxuICAgICAgICAgICAgICAgIGlmIChhbnlBbnMuY29ycmVjdCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgKGlucHV0LnN0eWxlIGFzIGFueSkuc2V0UHJvcGVydHkoXCItLWhpZGUtZG90XCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoQm9vbGVhbihhbnlBbnMuY29ycmVjdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwuc3R5bGUuY29sb3IgPSBcIiM1RkRDMzNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQuc3R5bGUuYm9yZGVyID0gXCI1cHggc29saWQgIzVGREMzM1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsLnN0eWxlLmNvbG9yID0gXCIjREMzMzMzXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0LnN0eWxlLmJvcmRlciA9IFwiNXB4IHNvbGlkICNEQzMzMzNcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb3B0aW9uLmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbi5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcXVlc3Rpb25XcmFwcGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcclxuICAgICAgICAgICAgcXVlc3Rpb25XcmFwcGVyLmFwcGVuZENoaWxkKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBxdWVzdGlvbnNCbG9jay5hcHBlbmRDaGlsZChxdWVzdGlvbldyYXBwZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBvbGRCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYW5zd2Vyc19fcXVlc3Rpb25cIik7XHJcbiAgICAgICAgaWYgKG9sZEJsb2NrICYmIG9sZEJsb2NrLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgb2xkQmxvY2sucGFyZW50RWxlbWVudC5yZXBsYWNlQ2hpbGQocXVlc3Rpb25zQmxvY2ssIG9sZEJsb2NrKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKSBhcyBIVE1MRWxlbWVudCB8IG51bGw7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lcj8uYXBwZW5kQ2hpbGQocXVlc3Rpb25zQmxvY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcHJlVGl0bGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmUtdGl0bGVcIik7XHJcbiAgICAgICAgaWYgKHByZVRpdGxlRWxlbWVudCkgcHJlVGl0bGVFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy50ZXN0Lm5hbWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VyRW1haWxcIik7XHJcbiAgICAgICAgaWYgKGVtYWlsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVtYWlsRWxlbWVudDogSFRNTERpdkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBlbWFpbEVsZW1lbnQuc3R5bGUubWFyZ2luVG9wID0gXCIyMHB4XCI7XHJcbiAgICAgICAgICAgIGVtYWlsRWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgICAgICAgICAgIGVtYWlsRWxlbWVudC5pbm5lclRleHQgPSBg0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMOiAke2VtYWlsfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29udGFpbmVyXCIpIGFzIEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgICAgICAgICAgY29udGFpbmVyPy5wcmVwZW5kKGVtYWlsRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBiYWNrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrVG9SZXN1bHRcIik7XHJcbiAgICAgICAgaWYgKGJhY2tCdXR0b24pIHtcclxuICAgICAgICAgICAgYmFja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdElkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0VGVzdElkXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NvcmUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImxhc3RTY29yZVwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJsYXN0VG90YWxcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGhyZWYgPSBcIiMvcmVzdWx0XCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcmUgJiYgdG90YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBocmVmID0gYCMvcmVzdWx0P3Njb3JlPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHNjb3JlKX0mdG90YWw9JHtlbmNvZGVVUklDb21wb25lbnQodG90YWwpfWA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRlc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBgIy9yZXN1bHQ/aWQ9JHtlbmNvZGVVUklDb21wb25lbnQodGVzdElkKX1gO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcItCg0LXQt9GD0LvRjNGC0LDRgtGLINGC0LXRgdGC0LAg0L3QtSDQvdCw0LnQtNC10L3Ri1wiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gaHJlZjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Q3VzdG9tSHR0cH0gZnJvbSBcIi4uL3NlcnZpY2VzL2N1c3RvbS1odHRwXCI7XHJcbmltcG9ydCB7QXV0aH0gZnJvbSBcIi4uL3NlcnZpY2VzL2F1dGhcIjtcclxuaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vLi4vY29uZmlnL2NvbmZpZ1wiO1xyXG5pbXBvcnQgdHlwZSB7UXVlcnlQYXJhbXNUeXBlfSBmcm9tIFwiLi4vdHlwZXMvcXVlcnktcGFyYW1zLXR5cGVcIjtcclxuaW1wb3J0IHR5cGUge1F1aXpMaXN0VHlwZX0gZnJvbSBcIi4uL3R5cGVzL3F1aXotbGlzdC50eXBlXCI7XHJcbmltcG9ydCB0eXBlIHtUZXN0UmVzdWx0VHlwZX0gZnJvbSBcIi4uL3R5cGVzL3Rlc3QtcmVzdWx0LnR5cGVcIjtcclxuaW1wb3J0IHR5cGUge0RlZmF1bHRSZXNwb25zZVR5cGV9IGZyb20gXCIuLi90eXBlcy9kZWZhdWx0LXJlc3BvbnNlLnR5cGVcIjtcclxuaW1wb3J0IHtVcmxNYW5hZ2VyfSBmcm9tIFwiLi4vdXRpbHMvdXJsLW1hbmFnZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDaG9pY2Uge1xyXG4gICAgcHJpdmF0ZSBxdWl6emVzOiBRdWl6TGlzdFR5cGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSB0ZXN0UmVzdWx0OiBUZXN0UmVzdWx0VHlwZVtdIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHJvdXRlUGFyYW1zOiBRdWVyeVBhcmFtc1R5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZVBhcmFtcyA9IFVybE1hbmFnZXIuZ2V0UXVlcnlQYXJhbXMoKTtcclxuICAgICAgICB2b2lkIHRoaXMucm91dGVQYXJhbXM7XHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVpenplcyA9IGF3YWl0IEN1c3RvbUh0dHAucmVxdWVzdChjb25maWcuaG9zdCArICcvdGVzdHMnKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gQXV0aC5nZXRVc2VySW5mbygpO1xyXG4gICAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBEZWZhdWx0UmVzcG9uc2VUeXBlIHwgVGVzdFJlc3VsdFR5cGVbXSA9XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgQ3VzdG9tSHR0cC5yZXF1ZXN0KGNvbmZpZy5ob3N0ICsgJy90ZXN0cy9yZXN1bHRzP3VzZXJJZD0nICsgdXNlckluZm8udXNlcklkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g0LLQvNC10YHRgtC+IHRocm93INCy0L3Rg9GC0YDQuCDRgtC+0LPQviDQttC1IHRyeS9jYXRjaCDigJQg0L/RgNC+0YHRgtC+INC+0LHRgNCw0LHQvtGC0LDQtdC8INCy0LXRgtC60YMg0L7RiNC40LHQutC4XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgYXMgRGVmYXVsdFJlc3BvbnNlVHlwZSkuZXJyb3IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKChyZXN1bHQgYXMgRGVmYXVsdFJlc3BvbnNlVHlwZSkubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC80L7QttC90L4g0L/QvtC60LDQt9Cw0YLRjCDRgdC+0L7QsdGJ0LXQvdC40LUg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GOINC40LvQuCDQv9GA0L7RgdGC0L4g0L/RgNC10YDQstCw0YLRjFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnNob3dFcnJvcj8uKChyZXN1bHQgYXMgRGVmYXVsdFJlc3BvbnNlVHlwZSkubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVzdFJlc3VsdCA9IHJlc3VsdCBhcyBUZXN0UmVzdWx0VHlwZVtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb2Nlc3NRdWl6emVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcm9jZXNzUXVpenplcygpOiB2b2lkIHtcclxuICAgICAgICAvLyDRjdGC0L4g0LrQvtC90YLQtdC50L3QtdGAIChkaXYg0Lgg0YIu0L8uKSwg0LAg0L3QtSA8b3B0aW9uPlxyXG4gICAgICAgIGNvbnN0IGNob2ljZU9wdGlvbnNFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nob2ljZV9fb3B0aW9ucycpIGFzIEhUTUxEaXZFbGVtZW50IHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucXVpenplcyAmJiB0aGlzLnF1aXp6ZXMubGVuZ3RoID4gMCAmJiBjaG9pY2VPcHRpb25zRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1aXp6ZXMuZm9yRWFjaCgocXVpejogUXVpekxpc3RUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VPcHRpb25FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgY2hvaWNlT3B0aW9uRWxlbWVudC5jbGFzc05hbWUgPSAnY2hvaWNlX19vcHRpb24nO1xyXG4gICAgICAgICAgICAgICAgY2hvaWNlT3B0aW9uRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBxdWl6LmlkLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgY2hvaWNlT3B0aW9uRWxlbWVudC5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvb3NlUXVpeihjaG9pY2VPcHRpb25FbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlT3B0aW9uVGV4dEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBjaG9pY2VPcHRpb25UZXh0RWxlbWVudC5jbGFzc05hbWUgPSAnY2hvaWNlX19vcHRpb24tdGV4dCc7XHJcbiAgICAgICAgICAgICAgICBjaG9pY2VPcHRpb25UZXh0RWxlbWVudC5pbm5lclRleHQgPSBxdWl6Lm5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hvaWNlT3B0aW9uQXJyb3dFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgY2hvaWNlT3B0aW9uQXJyb3dFbGVtZW50LmNsYXNzTmFtZSA9ICdjaG9pY2VfX29wdGlvbi1hcnJvdyc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGVzdFJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogVGVzdFJlc3VsdFR5cGUgfCB1bmRlZmluZWQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRlc3RSZXN1bHQuZmluZChpdGVtID0+IGl0ZW0udGVzdElkID09PSBxdWl6LmlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNob2ljZU9wdGlvblJlc3VsdEVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZU9wdGlvblJlc3VsdEVsZW1lbnQuY2xhc3NOYW1lID0gJ2Nob2ljZV9fb3B0aW9uLXJlc3VsdCc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vINC/0L7Qv9GA0LDQstC40Lsg0L7Qv9C10YfQsNGC0LrRgyDCq9Cg0YPQt9GD0LvRjNGC0LDRgsK7IOKGkiDCq9Cg0LXQt9GD0LvRjNGC0LDRgsK7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNob2ljZU9wdGlvblJlc3VsdEVsZW1lbnQuaW5uZXJIVE1MID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2PtCg0LXQt9GD0LvRjNGC0LDRgjwvZGl2PjxkaXY+JyArIHJlc3VsdC5zY29yZSArICcvJyArIHJlc3VsdC50b3RhbCArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaG9pY2VPcHRpb25FbGVtZW50LmFwcGVuZENoaWxkKGNob2ljZU9wdGlvblJlc3VsdEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaG9pY2VPcHRpb25JbWFnZUVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgICAgICAgICAgICAgIGNob2ljZU9wdGlvbkltYWdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdpbWFnZXMvYXJyb3cucG5nJyk7XHJcbiAgICAgICAgICAgICAgICBjaG9pY2VPcHRpb25JbWFnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhbHQnLCAn0KHRgtGA0LXQu9C60LAnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjaG9pY2VPcHRpb25BcnJvd0VsZW1lbnQuYXBwZW5kQ2hpbGQoY2hvaWNlT3B0aW9uSW1hZ2VFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGNob2ljZU9wdGlvbkVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hvaWNlT3B0aW9uVGV4dEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgY2hvaWNlT3B0aW9uRWxlbWVudC5hcHBlbmRDaGlsZChjaG9pY2VPcHRpb25BcnJvd0VsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNob2ljZU9wdGlvbnNFbGVtZW50LmFwcGVuZENoaWxkKGNob2ljZU9wdGlvbkVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaG9vc2VRdWl6KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZGF0YUlkOiBzdHJpbmcgfCBudWxsID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcclxuICAgICAgICBpZiAoZGF0YUlkKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSAnIy90ZXN0P2lkPScgKyBkYXRhSWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IEN1c3RvbUh0dHAgfSBmcm9tIFwiLi4vc2VydmljZXMvY3VzdG9tLWh0dHBcIjtcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gXCIuLi9zZXJ2aWNlcy9hdXRoXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZy9jb25maWdcIjtcclxuaW1wb3J0IHR5cGUgeyBGb3JtRmllbGRUeXBlIH0gZnJvbSBcIi4uL3R5cGVzL2Zvcm0tZmllbGQudHlwZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFNpZ251cFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9zaWdudXAtcmVzcG9uc2UudHlwZVwiO1xyXG5pbXBvcnQgdHlwZSB7IExvZ2luUmVzcG9uc2VUeXBlIH0gZnJvbSBcIi4uL3R5cGVzL2xvZ2luLXJlc3BvbnNlLnR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGb3JtIHtcclxuICAgIHJlYWRvbmx5IGFncmVlRWxlbWVudDogSFRNTElucHV0RWxlbWVudCB8IG51bGw7XHJcbiAgICByZWFkb25seSBwcm9jZXNzRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xyXG4gICAgcmVhZG9ubHkgcGFnZTogXCJzaWdudXBcIiB8IFwibG9naW5cIjtcclxuICAgIHByaXZhdGUgZmllbGRzOiBGb3JtRmllbGRUeXBlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYWdlOiBcInNpZ251cFwiIHwgXCJsb2dpblwiKSB7XHJcbiAgICAgICAgdGhpcy5hZ3JlZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0VsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMucGFnZSA9IHBhZ2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oQXV0aC5hY2Nlc3NUb2tlbktleSk7XHJcbiAgICAgICAgaWYgKGFjY2Vzc1Rva2VuKSB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIiMvY2hvaWNlXCI7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGRzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcImVtYWlsXCIsXHJcbiAgICAgICAgICAgICAgICBpZDogXCJlbWFpbFwiLFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAvXlthLXowLTkuXyUrLV0rQFthLXowLTkuLV0rXFwuW2Etel17Mix9JC9pLFxyXG4gICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgICAgICAgICBpZDogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHJlZ2V4OiAvXig/PS4qXFxkKSg/PS4qW2Etel0pKD89LipbQS1aXSlbMC05YS16QS1aXXs4LH0kLyxcclxuICAgICAgICAgICAgICAgIHZhbGlkOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYWdlID09PSBcInNpZ251cFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnVuc2hpZnQoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJuYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwibmFtZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnZXg6IC9eW9CQLdCv0IFdW9CwLdGP0ZFdK1xccyokL3UsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBcImxhc3ROYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwibGFzdC1uYW1lXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICByZWdleDogL15b0JAt0K/QgV1b0LAt0Y/RkV0rXFxzKiQvdSxcclxuICAgICAgICAgICAgICAgICAgICB2YWxpZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQn9GA0LjQstGP0LfQutCwINC/0L7Qu9C10LlcclxuICAgICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKChpdGVtOiBGb3JtRmllbGRUeXBlKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGl0ZW0uaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUZpZWxkKGl0ZW0sIGl0ZW0uZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vINCa0L3QvtC/0LrQsCBcItCf0YDQvtC00L7Qu9C20LjRgtGMXCJcclxuICAgICAgICB0aGlzLnByb2Nlc3NFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9jZXNzXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vINCv0LLQvdC+INC40LPQvdC+0YDQuNGA0YPQtdC8INC/0YDQvtC80LjRgSwg0YfRgtC+0LHRiyDQvdC1INCx0YvQu9C+IHdhcm5pbmcg0L/RgNC+IMKraWdub3JlZCBwcm9taXNlwrtcclxuICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5wcm9jZXNzRm9ybSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCn0LXQutCx0L7QutGBINGB0L7Qs9C70LDRgdC40Y9cclxuICAgICAgICBpZiAodGhpcy5wYWdlID09PSBcInNpZ251cFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWdyZWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZ3JlZVwiKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWdyZWVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFncmVlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHRoaXMudmFsaWRhdGVGb3JtKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVGaWVsZChmaWVsZDogRm9ybUZpZWxkVHlwZSwgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudCB8IG51bGw7XHJcbiAgICAgICAgY29uc3Qgb2sgPSAhIWVsZW1lbnQudmFsdWUgJiYgZmllbGQucmVnZXgudGVzdChlbGVtZW50LnZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKHBhcmVudCkge1xyXG4gICAgICAgICAgICBpZiAoIW9rKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcInJlZFwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmaWVsZC52YWxpZCA9IG9rO1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGVGb3JtKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUZvcm0oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsaWRGb3JtOiBib29sZWFuID0gdGhpcy5maWVsZHMuZXZlcnkoKGl0ZW0pID0+IGl0ZW0udmFsaWQpO1xyXG4gICAgICAgIGNvbnN0IGlzVmFsaWQ6IGJvb2xlYW4gPSB0aGlzLmFncmVlRWxlbWVudCA/ICEhdGhpcy5hZ3JlZUVsZW1lbnQuY2hlY2tlZCAmJiB2YWxpZEZvcm0gOiB2YWxpZEZvcm07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3NFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaXNWYWxpZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHByb2Nlc3NGb3JtKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZvcm0oKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBlbWFpbDogc3RyaW5nID0gdGhpcy5maWVsZHMuZmluZCgoaSkgPT4gaS5uYW1lID09PSBcImVtYWlsXCIpPy5lbGVtZW50Py52YWx1ZSA/PyBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHBhc3N3b3JkOiBzdHJpbmcgPSB0aGlzLmZpZWxkcy5maW5kKChpKSA9PiBpLm5hbWUgPT09IFwicGFzc3dvcmRcIik/LmVsZW1lbnQ/LnZhbHVlID8/IFwiXCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhZ2UgPT09IFwic2lnbnVwXCIpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IHRoaXMuZmllbGRzLmZpbmQoKGkpID0+IGkubmFtZSA9PT0gXCJuYW1lXCIpPy5lbGVtZW50Py52YWx1ZSA/PyBcIlwiO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdE5hbWU6IHN0cmluZyA9IHRoaXMuZmllbGRzLmZpbmQoKGkpID0+IGkubmFtZSA9PT0gXCJsYXN0TmFtZVwiKT8uZWxlbWVudD8udmFsdWUgPz8gXCJcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQ6IFNpZ251cFJlc3BvbnNlVHlwZSA9IGF3YWl0IEN1c3RvbUh0dHAucmVxdWVzdChcclxuICAgICAgICAgICAgICAgICAgICBjb25maWcuaG9zdCArIFwiL3NpZ251cFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZSwgbGFzdE5hbWUsIGVtYWlsLCBwYXNzd29yZCB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDQstC80LXRgdGC0L4gdGhyb3cg4oCUINC80Y/Qs9C60LDRjyDQvtCx0YDQsNCx0L7RgtC60LAg0L7RiNC40LHQutC4XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5lcnJvciB8fCAhcmVzdWx0LnVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXN1bHQubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Zvcm1FcnJvcihyZXN1bHQubWVzc2FnZSB8fCBcItCe0YjQuNCx0LrQsCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Zvcm1FcnJvcihcItCe0YjQuNCx0LrQsCDRgdC10YLQuCDQv9GA0Lgg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogTG9naW5SZXNwb25zZVR5cGUgPSBhd2FpdCBDdXN0b21IdHRwLnJlcXVlc3QoXHJcbiAgICAgICAgICAgICAgICBjb25maWcuaG9zdCArIFwiL2xvZ2luXCIsXHJcbiAgICAgICAgICAgICAgICBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgIHsgZW1haWwsIHBhc3N3b3JkIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0IHx8IHJlc3VsdC5lcnJvciB8fCAhcmVzdWx0LmFjY2Vzc1Rva2VuIHx8ICFyZXN1bHQucmVmcmVzaFRva2VuIHx8ICFyZXN1bHQuZnVsbE5hbWUgfHwgIXJlc3VsdC51c2VySWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Zvcm1FcnJvcihcItCU0LDQvdC90YvQtSDQvdC10LrQvtGA0YDQtdC60YLQvdGLLiDQn9GA0L7QstC10YDRjNGC0LUg0LvQvtCz0LjQvSDQuCDQv9Cw0YDQvtC70YwuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDQodC+0YXRgNCw0L3Rj9C10Lwg0YLQvtC70YzQutC+INGC0L7QutC10L3RiyDigJQgdXNlckluZm8sINC/0L4g0LjQtNC10LUsINC/0LDRgNGB0LjRgtGB0Y8g0LjQtyDRgtC+0LrQtdC90LAg0LIgQXV0aC5nZXRVc2VySW5mbygpXHJcbiAgICAgICAgICAgIEF1dGguc2V0VG9rZW5zKHJlc3VsdC5hY2Nlc3NUb2tlbiwgcmVzdWx0LnJlZnJlc2hUb2tlbik7XHJcbiAgICAgICAgICAgIEF1dGguc2V0VXNlckluZm8oe1xyXG4gICAgICAgICAgICAgICAgZnVsbE5hbWU6IHJlc3VsdC5mdWxsTmFtZSxcclxuICAgICAgICAgICAgICAgIHVzZXJJZDogcmVzdWx0LnVzZXJJZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vINCV0YHQu9C4INGF0L7Rh9C10YjRjCDRgdC+0YXRgNCw0L3QuNGC0YwgZW1haWwg0LTQu9GPINCw0LLRgtC+0L/QvtC00YHRgtCw0L3QvtCy0LrQuCDigJQg0LTQtdC70LDQtdC8INGN0YLQviDRgtC+0LvRjNC60L4g0LrQvtCz0LTQsCDQvtC9INGP0LLQvdC+INC10YHRgtGMXHJcbiAgICAgICAgICAgIGlmIChlbWFpbCkge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VyRW1haWxcIiwgZW1haWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIjL2Nob2ljZVwiO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93Rm9ybUVycm9yKFwi0J7RiNC40LHQutCwINGB0LXRgtC4INC/0YDQuCDQstGF0L7QtNC1LlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93Rm9ybUVycm9yKG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybS1lcnJvclwiKTtcclxuICAgICAgICBpZiAoZXJyb3JFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVycm9yRWxlbWVudC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XHJcbiAgICAgICAgICAgIChlcnJvckVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgKGVycm9yRWxlbWVudCBhcyBIVE1MRWxlbWVudCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydChtZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgVXJsTWFuYWdlciB9IGZyb20gXCIuLi91dGlscy91cmwtbWFuYWdlclwiO1xyXG5pbXBvcnQgeyBDdXN0b21IdHRwIH0gZnJvbSBcIi4uL3NlcnZpY2VzL2N1c3RvbS1odHRwXCI7XHJcbmltcG9ydCBjb25maWcgZnJvbSBcIi4uLy4uL2NvbmZpZy9jb25maWdcIjtcclxuaW1wb3J0IHsgQXV0aCB9IGZyb20gXCIuLi9zZXJ2aWNlcy9hdXRoXCI7XHJcbmltcG9ydCB0eXBlIHsgUXVlcnlQYXJhbXNUeXBlIH0gZnJvbSBcIi4uL3R5cGVzL3F1ZXJ5LXBhcmFtcy10eXBlXCI7XHJcbmltcG9ydCB0eXBlIHsgVXNlckluZm9UeXBlIH0gZnJvbSBcIi4uL3R5cGVzL3VzZXItaW5mby50eXBlXCI7XHJcbmltcG9ydCB0eXBlIHsgRGVmYXVsdFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9kZWZhdWx0LXJlc3BvbnNlLnR5cGVcIjtcclxuaW1wb3J0IHR5cGUgeyBQYXNzVGVzdFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9wYXNzLXRlc3QtcmVzcG9uc2UudHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlc3VsdCB7XHJcbiAgICBwcml2YXRlIHJvdXRlUGFyYW1zOiBRdWVyeVBhcmFtc1R5cGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZVBhcmFtcyA9IFVybE1hbmFnZXIuZ2V0UXVlcnlQYXJhbXMoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJvdXRlUGFyYW1zLmlkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3RJZDogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibGFzdFRlc3RJZFwiKTtcclxuICAgICAgICAgICAgaWYgKGxhc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZVBhcmFtcy5pZCA9IGxhc3RJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBVc2VySW5mb1R5cGUgfCBudWxsID0gQXV0aC5nZXRVc2VySW5mbygpO1xyXG5cclxuICAgICAgICBpZiAoIXVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKFwi0JLRiyDQvdC1INCw0LLRgtC+0YDQuNC30L7QstCw0L3Riy4g0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0L7QudC00LjRgtC1INCyINGB0LjRgdGC0LXQvNGDLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJvdXRlUGFyYW1zLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0Vycm9yKFwi0J3QtdGCIElEINGC0LXRgdGC0LAuINCd0LXQstC+0LfQvNC+0LbQvdC+INC+0YLQvtCx0YDQsNC30LjRgtGMINGA0LXQt9GD0LvRjNGC0LDRgi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogRGVmYXVsdFJlc3BvbnNlVHlwZSB8IFBhc3NUZXN0UmVzcG9uc2VUeXBlID0gYXdhaXQgQ3VzdG9tSHR0cC5yZXF1ZXN0KFxyXG4gICAgICAgICAgICAgICAgYCR7Y29uZmlnLmhvc3R9L3Rlc3RzLyR7dGhpcy5yb3V0ZVBhcmFtcy5pZH0vcmVzdWx0P3VzZXJJZD0ke3VzZXJJbmZvLnVzZXJJZH1gXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmICEoXCJlcnJvclwiIGluIHJlc3VsdCAmJiByZXN1bHQuZXJyb3IpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRTY29yZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVzdWx0LXNjb3JlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFNjb3JlRWxlbWVudCAmJiBcInNjb3JlXCIgaW4gcmVzdWx0ICYmIFwidG90YWxcIiBpbiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRTY29yZUVsZW1lbnQuaW5uZXJUZXh0ID0gYCR7cmVzdWx0LnNjb3JlfS8ke3Jlc3VsdC50b3RhbH1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoXCLQntGI0LjQsdC60LAg0L/RgNC4INC/0L7Qu9GD0YfQtdC90LjQuCDRgNC10LfRg9C70YzRgtCw0YLQsC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgdGhpcy5zaG93RXJyb3IoXCLQn9GA0L7QuNC30L7RiNC70LAg0L7RiNC40LHQutCwINC/0YDQuCDQt9Cw0LPRgNGD0LfQutC1INGA0LXQt9GD0LvRjNGC0LDRgtCwLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93RXJyb3IobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyOiBFbGVtZW50IHwgbnVsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdWx0IC5jb250YWluZXJcIik7XHJcbiAgICAgICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gYDxkaXYgc3R5bGU9XCJjb2xvcjogcmVkOyBmb250LXNpemU6IDE4cHg7IHBhZGRpbmc6IDIwcHg7XCI+JHttZXNzYWdlfTwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IFVybE1hbmFnZXIgfSBmcm9tIFwiLi4vdXRpbHMvdXJsLW1hbmFnZXJcIjtcclxuaW1wb3J0IHsgQ3VzdG9tSHR0cCB9IGZyb20gXCIuLi9zZXJ2aWNlcy9jdXN0b20taHR0cFwiO1xyXG5pbXBvcnQgY29uZmlnIGZyb20gXCIuLi8uLi9jb25maWcvY29uZmlnXCI7XHJcbmltcG9ydCB7IEF1dGggfSBmcm9tIFwiLi4vc2VydmljZXMvYXV0aFwiO1xyXG5pbXBvcnQgdHlwZSB7IFF1ZXJ5UGFyYW1zVHlwZSB9IGZyb20gXCIuLi90eXBlcy9xdWVyeS1wYXJhbXMtdHlwZVwiO1xyXG5pbXBvcnQgdHlwZSB7IFF1aXpBbnN3ZXJUeXBlLCBRdWl6UXVlc3Rpb25UeXBlLCBRdWl6VHlwZSB9IGZyb20gXCIuLi90eXBlcy9xdWl6LnR5cGVcIjtcclxuaW1wb3J0IHR5cGUgeyBVc2VyUmVzdWx0VHlwZSB9IGZyb20gXCIuLi90eXBlcy91c2VyLXJlc3VsdC50eXBlXCI7XHJcbmltcG9ydCB0eXBlIHsgRGVmYXVsdFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9kZWZhdWx0LXJlc3BvbnNlLnR5cGVcIjtcclxuaW1wb3J0IHsgQWN0aW9uVGVzdFR5cGVzIH0gZnJvbSBcIi4uL3R5cGVzL2FjdGlvbi10ZXN0LnR5cGVcIjtcclxuaW1wb3J0IHR5cGUgeyBVc2VySW5mb1R5cGUgfSBmcm9tIFwiLi4vdHlwZXMvdXNlci1pbmZvLnR5cGVcIjtcclxuaW1wb3J0IHR5cGUgeyBQYXNzVGVzdFJlc3BvbnNlVHlwZSB9IGZyb20gXCIuLi90eXBlcy9wYXNzLXRlc3QtcmVzcG9uc2UudHlwZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlc3Qge1xyXG4gICAgcHJpdmF0ZSBwcm9ncmVzc0JhckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgcGFzc0J1dHRvbkVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgbmV4dEJ1dHRvbkVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgcHJldkJ1dHRvbkVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgcXVlc3Rpb25UaXRsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgb3B0aW9uc0VsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHByaXZhdGUgcXVpejogUXVpelR5cGUgfCBudWxsO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50UXVlc3Rpb25JbmRleDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB1c2VyUmVzdWx0OiBVc2VyUmVzdWx0VHlwZVtdO1xyXG4gICAgcHJpdmF0ZSByb3V0ZVBhcmFtczogUXVlcnlQYXJhbXNUeXBlO1xyXG4gICAgcHJpdmF0ZSBpbnRlcnZhbDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wYXNzQnV0dG9uRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uZXh0QnV0dG9uRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5wcmV2QnV0dG9uRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5xdWl6ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gMTtcclxuICAgICAgICB0aGlzLnVzZXJSZXN1bHQgPSBbXTtcclxuICAgICAgICB0aGlzLnJvdXRlUGFyYW1zID0gVXJsTWFuYWdlci5nZXRRdWVyeVBhcmFtcygpO1xyXG4gICAgICAgIHZvaWQgdGhpcy5pbml0KCk7IC8vINC/0L7QtNCw0LLQu9GP0LXQvCB3YXJuaW5nINC/0YDQviBcImlnbm9yZWQgcHJvbWlzZVwiXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGlmICh0aGlzLnJvdXRlUGFyYW1zLmlkKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQ6IERlZmF1bHRSZXNwb25zZVR5cGUgfCBRdWl6VHlwZSA9IGF3YWl0IEN1c3RvbUh0dHAucmVxdWVzdChcclxuICAgICAgICAgICAgICAgICAgICBgJHtjb25maWcuaG9zdH0vdGVzdHMvJHt0aGlzLnJvdXRlUGFyYW1zLmlkfWBcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCBhcyBEZWZhdWx0UmVzcG9uc2VUeXBlKS5lcnJvciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcigocmVzdWx0IGFzIERlZmF1bHRSZXNwb25zZVR5cGUpLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1aXogPSByZXN1bHQgYXMgUXVpelR5cGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UXVpeigpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25zKCk6IFF1aXpRdWVzdGlvblR5cGVbXSB7XHJcbiAgICAgICAgY29uc3QgcXo6IGFueSA9IHRoaXMucXVpeiBhcyBhbnk7XHJcbiAgICAgICAgcmV0dXJuIChxej8ucXVlc3Rpb25zID8/IHF6Py5xdWVzdGlvbiA/PyBbXSkgYXMgUXVpelF1ZXN0aW9uVHlwZVtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25UZXh0KHE6IFF1aXpRdWVzdGlvblR5cGUpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGFueVEgPSBxIGFzIGFueTtcclxuICAgICAgICByZXR1cm4gYW55US5xdWVzdGlvbiA/PyBhbnlRLnRleHQgPz8gYW55US50aXRsZSA/PyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRRdWl6KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWl6KSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vINCd0LDRhdC+0LTQuNC8INCy0YHQtSBET00t0YPQt9C70YtcclxuICAgICAgICB0aGlzLnByb2dyZXNzQmFyRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NiYXJcIik7XHJcbiAgICAgICAgdGhpcy5xdWVzdGlvblRpdGxlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGl0bGVcIik7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3B0aW9uc1wiKTtcclxuICAgICAgICB0aGlzLm5leHRCdXR0b25FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXh0XCIpO1xyXG4gICAgICAgIHRoaXMucHJldkJ1dHRvbkVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZXZcIik7XHJcbiAgICAgICAgdGhpcy5wYXNzQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFzc1wiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMubmV4dEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0QnV0dG9uRWxlbWVudC5vbmNsaWNrID0gdGhpcy5tb3ZlLmJpbmQodGhpcywgQWN0aW9uVGVzdFR5cGVzLm5leHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5wcmV2QnV0dG9uRWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZCdXR0b25FbGVtZW50Lm9uY2xpY2sgPSB0aGlzLm1vdmUuYmluZCh0aGlzLCBBY3Rpb25UZXN0VHlwZXMucHJldik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnBhc3NCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFzc0J1dHRvbkVsZW1lbnQub25jbGljayA9IHRoaXMubW92ZS5iaW5kKHRoaXMsIEFjdGlvblRlc3RUeXBlcy5wYXNzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCX0LDQs9C+0LvQvtCy0L7QuiDRgtC10YHRgtCwICjQt9Cw0LzQtdC90LggJ3ByZS10aXRsZScg0L3QsCDRhNCw0LrRgtC40YfQtdGB0LrQuNC5IGlkLCDQtdGB0LvQuCDQtNGA0YPQs9C+0LkpXHJcbiAgICAgICAgY29uc3QgcHJlVGl0bGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByZS10aXRsZVwiKTtcclxuICAgICAgICBpZiAocHJlVGl0bGVFbGVtZW50ICYmIHRoaXMucXVpeikge1xyXG4gICAgICAgICAgICBwcmVUaXRsZUVsZW1lbnQuaW5uZXJUZXh0ID0gdGhpcy5xdWl6Lm5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5xdWl6KSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGVzdFRpdGxlXCIsIHRoaXMucXVpei5uYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJlcGFyZVByb2dyZXNzQmFyKCk7XHJcbiAgICAgICAgdGhpcy5zaG93UXVlc3Rpb24oKTtcclxuXHJcbiAgICAgICAgLy8g0KLQsNC50LzQtdGAXHJcbiAgICAgICAgY29uc3QgdGltZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpO1xyXG4gICAgICAgIGxldCBzZWNvbmRzID0gNTk7XHJcbiAgICAgICAgY29uc3QgdGhhdDogVGVzdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlY29uZHMtLTtcclxuICAgICAgICAgICAgaWYgKHRpbWVyRWxlbWVudCkgdGltZXJFbGVtZW50LmlubmVyVGV4dCA9IFN0cmluZyhzZWNvbmRzKTtcclxuICAgICAgICAgICAgaWYgKHNlY29uZHMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhhdC5pbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICB2b2lkIHRoYXQuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcHJlcGFyZVByb2dyZXNzQmFyKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5xdWl6IHx8ICF0aGlzLnByb2dyZXNzQmFyRWxlbWVudCkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBxdWVzdGlvbnMgPSB0aGlzLmdldFF1ZXN0aW9ucygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGl0ZW1FbGVtZW50LmNsYXNzTmFtZSA9IFwidGVzdF9fcHJvZ3Jlc3NiYXItaXRlbVwiICsgKGkgPT09IDAgPyBcIiBhY3RpdmVcIiA6IFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbUNpcmNsZUVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgaXRlbUNpcmNsZUVsZW1lbnQuY2xhc3NOYW1lID0gXCJ0ZXN0X19wcm9ncmVzc2Jhci1pdGVtLWNpcmNsZVwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXRlbVRleHRFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIGl0ZW1UZXh0RWxlbWVudC5jbGFzc05hbWUgPSBcInRlc3RfX3Byb2dyZXNzYmFyLWl0ZW0tdGV4dFwiO1xyXG4gICAgICAgICAgICBpdGVtVGV4dEVsZW1lbnQuaW5uZXJUZXh0ID0gXCLQktC+0L/RgNC+0YEgXCIgKyAoaSArIDEpO1xyXG5cclxuICAgICAgICAgICAgaXRlbUVsZW1lbnQuYXBwZW5kQ2hpbGQoaXRlbUNpcmNsZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICBpdGVtRWxlbWVudC5hcHBlbmRDaGlsZChpdGVtVGV4dEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzQmFyRWxlbWVudC5hcHBlbmRDaGlsZChpdGVtRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93UXVlc3Rpb24oKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1aXopIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gdGhpcy5nZXRRdWVzdGlvbnMoKTtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IC0gMTtcclxuICAgICAgICBjb25zdCBtYXliZVEgPSBxdWVzdGlvbnNbaWR4XTtcclxuICAgICAgICBpZiAoIW1heWJlUSkgcmV0dXJuOyAvLyDQt9Cw0YnQuNGC0LAg0L7RgiB1bmRlZmluZWRcclxuXHJcbiAgICAgICAgY29uc3QgYWN0aXZlUXVlc3Rpb246IFF1aXpRdWVzdGlvblR5cGUgPSBtYXliZVE7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uVGl0bGVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25UaXRsZUVsZW1lbnQuaW5uZXJIVE1MID1cclxuICAgICAgICAgICAgICAgIGA8c3Bhbj7QktC+0L/RgNC+0YEgJHt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4fTo8L3NwYW4+ICR7dGhpcy5nZXRRdWVzdGlvblRleHQoYWN0aXZlUXVlc3Rpb24pfWA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnNFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0VsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNob2ljZU9wdGlvbiA9IHRoaXMudXNlclJlc3VsdC5maW5kKFxyXG4gICAgICAgICAgICAoaXRlbSkgPT4gaXRlbS5xdWVzdGlvbklkID09PSBhY3RpdmVRdWVzdGlvbi5pZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGFjdGl2ZVF1ZXN0aW9uLmFuc3dlcnMuZm9yRWFjaCgoYW5zd2VyOiBRdWl6QW5zd2VyVHlwZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25FbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgICAgIG9wdGlvbkVsZW1lbnQuY2xhc3NOYW1lID0gXCJ0ZXN0X19xdWVzdGlvbi1vcHRpb25cIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0SWQgPSBgYW5zd2VyLSR7YW5zd2VyLmlkfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgaW5wdXRFbGVtZW50LmNsYXNzTmFtZSA9IFwib3B0aW9uLWFuc3dlclwiO1xyXG4gICAgICAgICAgICBpbnB1dEVsZW1lbnQuaWQgPSBpbnB1dElkO1xyXG4gICAgICAgICAgICBpbnB1dEVsZW1lbnQudHlwZSA9IFwicmFkaW9cIjtcclxuICAgICAgICAgICAgaW5wdXRFbGVtZW50Lm5hbWUgPSBcImFuc3dlclwiO1xyXG4gICAgICAgICAgICBpbnB1dEVsZW1lbnQudmFsdWUgPSBTdHJpbmcoYW5zd2VyLmlkKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaG9pY2VPcHRpb24gJiYgY2hvaWNlT3B0aW9uLmNob3NlbkFuc3dlcklkID09PSBhbnN3ZXIuaWQpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0RWxlbWVudC5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5wdXRFbGVtZW50Lm9uY2hhbmdlID0gKCkgPT4gdGhpcy5jaG9vc2VBbnN3ZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsRWxlbWVudDogSFRNTExhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcclxuICAgICAgICAgICAgbGFiZWxFbGVtZW50LnNldEF0dHJpYnV0ZShcImZvclwiLCBpbnB1dElkKTtcclxuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmlubmVyVGV4dCA9IGFuc3dlci5hbnN3ZXI7XHJcblxyXG4gICAgICAgICAgICBvcHRpb25FbGVtZW50LmFwcGVuZENoaWxkKGlucHV0RWxlbWVudCk7XHJcbiAgICAgICAgICAgIG9wdGlvbkVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zRWxlbWVudD8uYXBwZW5kQ2hpbGQob3B0aW9uRWxlbWVudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5leHRCdXR0b25FbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjaG9pY2VPcHRpb24/LmNob3NlbkFuc3dlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRCdXR0b25FbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0QnV0dG9uRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEJ1dHRvbkVsZW1lbnQuaW5uZXJUZXh0ID1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPT09IHF1ZXN0aW9ucy5sZW5ndGggPyBcItCX0LDQstC10YDRiNC40YLRjFwiIDogXCLQlNCw0LvQtdC1XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2QnV0dG9uRWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJldkJ1dHRvbkVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZCdXR0b25FbGVtZW50LnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaG9vc2VBbnN3ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dEJ1dHRvbkVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0QnV0dG9uRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtb3ZlKGFjdGlvbjogQWN0aW9uVGVzdFR5cGVzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnF1aXopIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gdGhpcy5nZXRRdWVzdGlvbnMoKTtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4IC0gMTtcclxuICAgICAgICBjb25zdCBtYXliZVEgPSBxdWVzdGlvbnNbaWR4XTtcclxuICAgICAgICBpZiAoIW1heWJlUSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBhY3RpdmVRdWVzdGlvbjogUXVpelF1ZXN0aW9uVHlwZSA9IG1heWJlUTtcclxuXHJcbiAgICAgICAgY29uc3QgY2hvc2VuQW5zd2VySW5wdXQgPSBBcnJheS5mcm9tKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwib3B0aW9uLWFuc3dlclwiKVxyXG4gICAgICAgICkuZmluZCgoZWwpID0+IChlbCBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb25zdCBjaG9zZW5BbnN3ZXJJZCA9IGNob3NlbkFuc3dlcklucHV0Py52YWx1ZSA/IE51bWJlcihjaG9zZW5BbnN3ZXJJbnB1dC52YWx1ZSkgOiBudWxsO1xyXG5cclxuICAgICAgICBjb25zdCBleGlzdGluZ1Jlc3VsdCA9IHRoaXMudXNlclJlc3VsdC5maW5kKChpKSA9PiBpLnF1ZXN0aW9uSWQgPT09IGFjdGl2ZVF1ZXN0aW9uLmlkKTtcclxuICAgICAgICBpZiAoY2hvc2VuQW5zd2VySWQpIHtcclxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ1Jlc3VsdC5jaG9zZW5BbnN3ZXJJZCA9IGNob3NlbkFuc3dlcklkO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51c2VyUmVzdWx0LnB1c2goeyBxdWVzdGlvbklkOiBhY3RpdmVRdWVzdGlvbi5pZCwgY2hvc2VuQW5zd2VySWQgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhY3Rpb24gPT09IEFjdGlvblRlc3RUeXBlcy5uZXh0IHx8IGFjdGlvbiA9PT0gQWN0aW9uVGVzdFR5cGVzLnBhc3MpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCsrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgtLTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID4gcXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB2b2lkIHRoaXMuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3NCYXJFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20odGhpcy5wcm9ncmVzc0JhckVsZW1lbnQuY2hpbGRyZW4pLmZvckVhY2goKGl0ZW06IEVsZW1lbnQsIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJdGVtSW5kZXggPSBpbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoXCJjb21wbGV0ZVwiLCBcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SXRlbUluZGV4ID09PSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KSBpdGVtLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjdXJyZW50SXRlbUluZGV4IDwgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCkgaXRlbS5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zaG93UXVlc3Rpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIGNvbXBsZXRlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBVc2VySW5mb1R5cGUgfCBudWxsID0gQXV0aC5nZXRVc2VySW5mbygpO1xyXG4gICAgICAgIGlmICghdXNlckluZm8pIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdbY29tcGxldGVdIHVzZXJJbmZvIGlzIG51bGwuIGxvY2FsU3RvcmFnZSBzbmFwc2hvdDonLCB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NUb2tlbjogbG9jYWxTdG9yYWdlLmdldEl0ZW0oQXV0aC5hY2Nlc3NUb2tlbktleSksXHJcbiAgICAgICAgICAgICAgICByZWZyZXNoVG9rZW46IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWZyZXNoVG9rZW4nKSxcclxuICAgICAgICAgICAgICAgIHVzZXJJbmZvUmF3OiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlckluZm8nKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPSAnLyMnO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgdGVzdElkID0gdGhpcy5yb3V0ZVBhcmFtcy5pZCA/PyBcIlwiO1xyXG4gICAgICAgIGlmICghdGVzdElkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCLQndC10YIgSUQg0YLQtdGB0YLQsCDQv9GA0Lgg0LfQsNCy0LXRgNGI0LXQvdC40LhcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdDogRGVmYXVsdFJlc3BvbnNlVHlwZSB8IFBhc3NUZXN0UmVzcG9uc2VUeXBlID0gYXdhaXQgQ3VzdG9tSHR0cC5yZXF1ZXN0KFxyXG4gICAgICAgICAgICAgICAgYCR7Y29uZmlnLmhvc3R9L3Rlc3RzLyR7dGVzdElkfS9wYXNzYCxcclxuICAgICAgICAgICAgICAgIFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlckluZm8udXNlcklkLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHM6IHRoaXMudXNlclJlc3VsdCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0KSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoKHJlc3VsdCBhcyBEZWZhdWx0UmVzcG9uc2VUeXBlKS5lcnJvciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKChyZXN1bHQgYXMgRGVmYXVsdFJlc3BvbnNlVHlwZSkubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibGFzdFRlc3RJZFwiLCB0ZXN0SWQpO1xyXG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIjL3Jlc3VsdD9pZD1cIiArIHRlc3RJZDtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7Rm9ybX0gZnJvbSBcIi4vY29tcG9uZW50cy9mb3JtXCI7XHJcbmltcG9ydCB7Q2hvaWNlfSBmcm9tIFwiLi9jb21wb25lbnRzL2Nob2ljZVwiO1xyXG5pbXBvcnQge1Rlc3R9IGZyb20gXCIuL2NvbXBvbmVudHMvdGVzdFwiO1xyXG5pbXBvcnQge1Jlc3VsdH0gZnJvbSBcIi4vY29tcG9uZW50cy9yZXN1bHRcIjtcclxuaW1wb3J0IHtBbnN3ZXJzfSBmcm9tIFwiLi9jb21wb25lbnRzL2Fuc3dlcnNcIjtcclxuaW1wb3J0IHtBdXRofSBmcm9tIFwiLi9zZXJ2aWNlcy9hdXRoXCI7XHJcbmltcG9ydCB0eXBlIHtSb3V0ZVR5cGV9IGZyb20gXCIuL3R5cGVzL3JvdXRlLnR5cGVcIjtcclxuaW1wb3J0IHR5cGUge1VzZXJJbmZvVHlwZX0gZnJvbSBcIi4vdHlwZXMvdXNlci1pbmZvLnR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xyXG4gICAgcmVhZG9ubHkgY29udGVudEVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbDtcclxuICAgIHJlYWRvbmx5IHN0eWxlc0VsZW1lbnQ6IEhUTUxMaW5rRWxlbWVudCB8IG51bGw7IC8vIDxsaW5rIGlkPVwic3R5bGVzXCIgLi4uPlxyXG4gICAgcmVhZG9ubHkgdGl0bGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XHJcbiAgICByZWFkb25seSBwcm9maWxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xyXG4gICAgcmVhZG9ubHkgcHJvZmlsZUZ1bGxOYW1lRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgcm91dGVzOiBSb3V0ZVR5cGVbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNvbnRlbnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50XCIpO1xyXG4gICAgICAgIHRoaXMuc3R5bGVzRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdHlsZXMnKSBhcyBIVE1MTGlua0VsZW1lbnQgfCBudWxsO1xyXG4gICAgICAgIHRoaXMudGl0bGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhZ2UtdGl0bGUnKTtcclxuICAgICAgICB0aGlzLnByb2ZpbGVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2ZpbGUnKTtcclxuICAgICAgICB0aGlzLnByb2ZpbGVGdWxsTmFtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncHJvZmlsZS1mdWxsLW5hbWUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5yb3V0ZXMgPSBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiAnIy8nLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQk9C70LDQstC90LDRjycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3RlbXBsYXRlcy9pbmRleC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInN0eWxlcy9pbmRleC5jc3NcIixcclxuICAgICAgICAgICAgICAgIGxvYWQ6ICgpID0+IHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiAnIy9zaWdudXAnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQoNC10LPQuNGB0YLRgNCw0YbQuNGPJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndGVtcGxhdGVzL3NpZ251cC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInN0eWxlcy9mb3JtLmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4geyBuZXcgRm9ybSgnc2lnbnVwJyk7IH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6ICcjL2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn0JLRhdC+0LQg0LIg0YHQuNGB0YLQtdC80YMnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBzdHlsZTogXCJzdHlsZXMvZm9ybS5jc3NcIixcclxuICAgICAgICAgICAgICAgIGxvYWQ6ICgpID0+IHsgbmV3IEZvcm0oJ2xvZ2luJyk7IH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6ICcjL2Nob2ljZScsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ9CS0YvQsdC+0YAg0YLQtdGB0YLQsCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3RlbXBsYXRlcy9jaG9pY2UuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBzdHlsZTogXCJzdHlsZXMvY2hvaWNlLmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4geyBuZXcgQ2hvaWNlKCk7IH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6ICcjL3Rlc3QnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQn9GA0L7RhdC+0LbQtNC10L3QuNC1INGC0LXRgdGC0LAnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZXMvdGVzdC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInN0eWxlcy90ZXN0LmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4geyBuZXcgVGVzdCgpOyB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiAnIy9yZXN1bHQnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQoNC10LfRg9C70YzRgtCw0YLRiycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3RlbXBsYXRlcy9yZXN1bHQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBzdHlsZTogXCJzdHlsZXMvcmVzdWx0LmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4geyBuZXcgUmVzdWx0KCk7IH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6ICcjL2Fuc3dlcnMnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQntGC0LLQtdGC0YsnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZXMvYW5zd2Vycy5odG1sJyxcclxuICAgICAgICAgICAgICAgIHN0eWxlOiBcInN0eWxlcy9hbnN3ZXJzLmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4geyBuZXcgQW5zd2VycygpOyB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHJvdXRlOiAnIy9sb2dvdXQnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQktGL0YXQvtC0JyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAndGVtcGxhdGVzL2luZGV4Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgc3R5bGU6IFwic3R5bGVzL2luZGV4LmNzc1wiLFxyXG4gICAgICAgICAgICAgICAgbG9hZDogKCkgPT4ge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhc3luYyBvcGVuUm91dGUoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgY29uc3QgdXJsUm91dGUgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgnPycpWzBdO1xyXG5cclxuICAgICAgICBpZiAodXJsUm91dGUgPT09ICcjL2xvZ291dCcpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBib29sZWFuID0gYXdhaXQgQXV0aC5sb2dvdXQoKTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnIy8nO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdSb3V0ZTogUm91dGVUeXBlIHwgdW5kZWZpbmVkID0gdGhpcy5yb3V0ZXMuZmluZChpdGVtID0+IGl0ZW0ucm91dGUgPT09IHVybFJvdXRlKTtcclxuICAgICAgICBpZiAoIW5ld1JvdXRlKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMvJztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnRFbGVtZW50IHx8ICF0aGlzLnN0eWxlc0VsZW1lbnQgfHwgIXRoaXMudGl0bGVFbGVtZW50IHx8ICF0aGlzLnByb2ZpbGVFbGVtZW50IHx8ICF0aGlzLnByb2ZpbGVGdWxsTmFtZUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKHVybFJvdXRlID09PSAnIy8nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJyMvJztcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb250ZW50RWxlbWVudC5pbm5lckhUTUwgPSBhd2FpdCBmZXRjaChuZXdSb3V0ZS50ZW1wbGF0ZSkudGhlbihyID0+IHIudGV4dCgpKTtcclxuICAgICAgICB0aGlzLnN0eWxlc0VsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgbmV3Um91dGUuc3R5bGUpOyAvLyA8LS0gc3R5bGUsINC90LUgc3R5bGVzXHJcbiAgICAgICAgdGhpcy50aXRsZUVsZW1lbnQuaW5uZXJUZXh0ID0gbmV3Um91dGUudGl0bGU7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBVc2VySW5mb1R5cGUgfCBudWxsID0gQXV0aC5nZXRVc2VySW5mbygpO1xyXG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oQXV0aC5hY2Nlc3NUb2tlbktleSk7XHJcblxyXG4gICAgICAgIGlmICh1c2VySW5mbyAmJiBhY2Nlc3NUb2tlbikge1xyXG4gICAgICAgICAgICB0aGlzLnByb2ZpbGVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgICAgIHRoaXMucHJvZmlsZUZ1bGxOYW1lRWxlbWVudC5pbm5lclRleHQgPSB1c2VySW5mby5mdWxsTmFtZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnByb2ZpbGVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2b2lkIG5ld1JvdXRlLmxvYWQoKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi8uLi9jb25maWcvY29uZmlnXCI7XHJcbmltcG9ydCB0eXBlIHtVc2VySW5mb1R5cGV9IGZyb20gXCIuLi90eXBlcy91c2VyLWluZm8udHlwZVwiO1xyXG5pbXBvcnQgdHlwZSB7UmVmcmVzaFJlc3BvbnNlVHlwZX0gZnJvbSBcIi4uL3R5cGVzL3JlZnJlc2gtcmVzcG9uc2UudHlwZVwiO1xyXG5pbXBvcnQgdHlwZSB7TG9nb3V0UmVzcG9uc2VUeXBlfSBmcm9tIFwiLi4vdHlwZXMvbG9nb3V0LXJlc3BvbnNlLnR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBdXRoIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgYWNjZXNzVG9rZW5LZXk6IHN0cmluZyA9ICdhY2Nlc3NUb2tlbic7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWZyZXNoVG9rZW5LZXk6IHN0cmluZyA9ICdyZWZyZXNoVG9rZW4nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgdXNlckluZm9LZXk6IHN0cmluZyA9ICd1c2VySW5mbyc7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBhc3luYyBwcm9jZXNzVW5hdXRob3JpemVkUmVzcG9uc2UoKTogUHJvbWlzZTxib29sZWFuPiB7XHJcbiAgICAgICAgY29uc3QgcmVmcmVzaFRva2VuOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5yZWZyZXNoVG9rZW5LZXkpO1xyXG4gICAgICAgIGlmIChyZWZyZXNoVG9rZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IFJlc3BvbnNlID0gYXdhaXQgZmV0Y2goY29uZmlnLmhvc3QgKyAnL3JlZnJlc2gnLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHJlZnJlc2hUb2tlbiB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBSZWZyZXNoUmVzcG9uc2VUeXBlIHwgbnVsbCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgJiYgIXJlc3VsdC5lcnJvciAmJiByZXN1bHQuYWNjZXNzVG9rZW4gJiYgcmVzdWx0LnJlZnJlc2hUb2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9rZW5zKHJlc3VsdC5hY2Nlc3NUb2tlbiwgcmVzdWx0LnJlZnJlc2hUb2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVtb3ZlVG9rZW5zKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgbG9nb3V0KCk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG4gICAgICAgIGNvbnN0IHJlZnJlc2hUb2tlbjogc3RyaW5nIHwgbnVsbCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMucmVmcmVzaFRva2VuS2V5KTtcclxuICAgICAgICBpZiAocmVmcmVzaFRva2VuKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKGNvbmZpZy5ob3N0ICsgJy9sb2dvdXQnLCB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkFjY2VwdFwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHJlZnJlc2hUb2tlbiB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSAmJiByZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0OiBMb2dvdXRSZXNwb25zZVR5cGUgfCBudWxsID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiAhcmVzdWx0LmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQXV0aC5yZW1vdmVUb2tlbnMoKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLnVzZXJJbmZvS2V5KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRUb2tlbnMoYWNjZXNzVG9rZW46IHN0cmluZywgcmVmcmVzaFRva2VuOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFjY2Vzc1Rva2VuS2V5LCBhY2Nlc3NUb2tlbik7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5yZWZyZXNoVG9rZW5LZXksIHJlZnJlc2hUb2tlbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVtb3ZlVG9rZW5zKCk6IHZvaWQge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuYWNjZXNzVG9rZW5LZXkpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMucmVmcmVzaFRva2VuS2V5KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQodCU0JXQm9CQ0JvQmCDQodCi0JDQotCY0KfQldCh0JrQmNCcXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldFVzZXJJbmZvKGluZm86IFVzZXJJbmZvVHlwZSk6IHZvaWQge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMudXNlckluZm9LZXksIEpTT04uc3RyaW5naWZ5KGluZm8pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldFVzZXJJbmZvKCk6IFVzZXJJbmZvVHlwZSB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy51c2VySW5mb0tleSk7XHJcbiAgICAgICAgaWYgKHVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHVzZXJJbmZvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBdXRofSBmcm9tIFwiLi9hdXRoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tSHR0cCB7XHJcbiAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVxdWVzdCh1cmw6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcgPSAnR0VUJywgYm9keTogYW55ID0gbnVsbCk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHRva2VuOiBzdHJpbmcgfCBudWxsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oQXV0aC5hY2Nlc3NUb2tlbktleSk7XHJcbiAgICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgICAgIHBhcmFtcy5oZWFkZXJzWyd4LWFjY2Vzcy10b2tlbiddID0gdG9rZW47XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKGJvZHkpIHtcclxuICAgICAgICAgICAgcGFyYW1zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShib2R5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlOiBSZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA8IDIwMCB8fCByZXNwb25zZS5zdGF0dXMgPj0gMzAwKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICBjb25zdCByZXN1bHQ6IGJvb2xlYW4gPSBhd2FpdCBBdXRoLnByb2Nlc3NVbmF1dGhvcml6ZWRSZXNwb25zZSgpO1xyXG4gICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5yZXF1ZXN0KHVybCwgbWV0aG9kLCBib2R5KTtcclxuICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZW51bSBBY3Rpb25UZXN0VHlwZXMge1xyXG4gICAgbmV4dCA9ICduZXh0JyxcclxuICAgIHBhc3MgPSAncGFzcycsXHJcbiAgICBwcmV2ID0gJ3ByZXYnLFxyXG59IiwiaW1wb3J0IHR5cGUgeyBRdWVyeVBhcmFtc1R5cGUgfSBmcm9tIFwiLi4vdHlwZXMvcXVlcnktcGFyYW1zLXR5cGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBVcmxNYW5hZ2VyIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UXVlcnlQYXJhbXMoKTogUXVlcnlQYXJhbXNUeXBlIHtcclxuICAgICAgICBjb25zdCBxcyA9IChkb2N1bWVudC5sb2NhdGlvbi5oYXNoIHx8IFwiXCIpLnJlcGxhY2UoL1xcKy9nLCBcIiBcIik7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0ge30gYXMgUXVlcnlQYXJhbXNUeXBlO1xyXG4gICAgICAgIGNvbnN0IHJlID0gL1s/Jl0oW149XSspPShbXiZdKikvZztcclxuXHJcbiAgICAgICAgbGV0IHRva2VuOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xyXG4gICAgICAgIHdoaWxlICgodG9rZW4gPSByZS5leGVjKHFzKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gdG9rZW5bMV07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IHRva2VuWzJdO1xyXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSB1bmRlZmluZWQgJiYgdmFsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIChwYXJhbXMgYXMgYW55KVtkZWNvZGVVUklDb21wb25lbnQoa2V5KV0gPSBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyYW1zO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtSb3V0ZXJ9IGZyb20gXCIuL3JvdXRlclwiO1xyXG5cclxuY2xhc3MgQXBwIHtcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgUm91dGVyKCk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aGlzLmhhbmRsZVJvdXRlQ2hhbmdpbmcuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5oYW5kbGVSb3V0ZUNoYW5naW5nLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgcHJpdmF0ZSBoYW5kbGVSb3V0ZUNoYW5naW5nKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucm91dGVyLm9wZW5Sb3V0ZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4obmV3IEFwcCgpKTtcclxuXHJcblxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
import { CustomHttp } from "../services/custom-http";
import { Auth } from "../services/auth";
import config from "../../config/config";
import type { FormFieldType } from "../types/form-field.type";
import type { SignupResponseType } from "../types/signup-response.type";
import type { LoginResponseType } from "../types/login-response.type";

export class Form {
    readonly agreeElement: HTMLInputElement | null;
    readonly processElement: HTMLElement | null;
    readonly page: "signup" | "login";
    private fields: FormFieldType[] = [];

    constructor(page: "signup" | "login") {
        this.agreeElement = null;
        this.processElement = null;
        this.page = page;

        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
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
            this.fields.unshift(
                {
                    name: "name",
                    id: "name",
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+\s*$/u,
                    valid: false,
                },
                {
                    name: "lastName",
                    id: "last-name",
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+\s*$/u,
                    valid: false,
                }
            );
        }

        // Привязка полей
        this.fields.forEach((item: FormFieldType) => {
            item.element = document.getElementById(item.id) as HTMLInputElement | null;
            if (item.element) {
                item.element.addEventListener("change", () => {
                    this.validateField(item, item.element as HTMLInputElement);
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
            this.agreeElement = document.getElementById("agree") as HTMLInputElement | null;
            if (this.agreeElement) {
                this.agreeElement.addEventListener("change", () => this.validateForm());
            }
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement): void {
        const parent = element.parentElement as HTMLElement | null;
        const ok = !!element.value && field.regex.test(element.value);

        if (parent) {
            if (!ok) {
                parent.style.borderColor = "red";
            } else {
                parent.removeAttribute("style");
            }
        }

        field.valid = ok;
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every((item) => item.valid);
        const isValid: boolean = this.agreeElement ? !!this.agreeElement.checked && validForm : validForm;

        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute("disabled");
            } else {
                this.processElement.setAttribute("disabled", "disabled");
            }
        }

        return isValid;
    }

    private async processForm(): Promise<void> {
        if (!this.validateForm()) return;

        const email: string = this.fields.find((i) => i.name === "email")?.element?.value ?? "";
        const password: string = this.fields.find((i) => i.name === "password")?.element?.value ?? "";

        if (this.page === "signup") {
            try {
                const name: string = this.fields.find((i) => i.name === "name")?.element?.value ?? "";
                const lastName: string = this.fields.find((i) => i.name === "lastName")?.element?.value ?? "";

                const result: SignupResponseType = await CustomHttp.request(
                    config.host + "/signup",
                    "POST",
                    { name, lastName, email, password }
                );

                if (result) {
                    // вместо throw — мягкая обработка ошибки
                    if (result.error || !result.user) {
                        console.error(result.message);
                        this.showFormError(result.message || "Ошибка регистрации.");
                        return;
                    }
                }
            } catch (error) {
                console.log(error);
                this.showFormError("Ошибка сети при регистрации.");
                return;
            }
        }

        try {
            const result: LoginResponseType = await CustomHttp.request(
                config.host + "/login",
                "POST",
                { email, password }
            );

            if (!result || result.error || !result.accessToken || !result.refreshToken || !result.fullName || !result.userId) {
                this.showFormError("Данные некорректны. Проверьте логин и пароль.");
                return;
            }

            // Сохраняем только токены — userInfo, по идее, парсится из токена в Auth.getUserInfo()
            Auth.setTokens(result.accessToken, result.refreshToken);
            Auth.setUserInfo({
                fullName: result.fullName,
                userId: result.userId,
            });
            // Если хочешь сохранить email для автоподстановки — делаем это только когда он явно есть
            if (email) {
                localStorage.setItem("userEmail", email);
            }

            location.href = "#/choice";
        } catch (error) {
            console.log(error);
            this.showFormError("Ошибка сети при входе.");
        }
    }

    private showFormError(message: string): void {
        const errorElement = document.getElementById("form-error");
        if (errorElement) {
            errorElement.textContent = message;
            (errorElement as HTMLElement).style.display = "block";
            setTimeout(() => {
                (errorElement as HTMLElement).style.display = "none";
            }, 3000);
        } else {
            alert(message);
        }
    }
}

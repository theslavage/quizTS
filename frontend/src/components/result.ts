import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "../services/custom-http";
import config from "../../config/config";
import { Auth } from "../services/auth";
import type { QueryParamsType } from "../types/query-params-type";
import type { UserInfoType } from "../types/user-info.type";
import type { DefaultResponseType } from "../types/default-response.type";
import type { PassTestResponseType } from "../types/pass-test-response.type";

export class Result {
    private routeParams: QueryParamsType;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        if (!this.routeParams.id) {
            const lastId: string | null = localStorage.getItem("lastTestId");
            if (lastId) {
                this.routeParams.id = lastId;
            }
        }

        this.init();
    }

    private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();

        if (!userInfo) {
            this.showError("Вы не авторизованы. Пожалуйста, войдите в систему.");
            return;
        }

        if (!this.routeParams.id) {
            this.showError("Нет ID теста. Невозможно отобразить результат.");
            return;
        }

        try {
            const result: DefaultResponseType | PassTestResponseType = await CustomHttp.request(
                `${config.host}/tests/${this.routeParams.id}/result?userId=${userInfo.userId}`
            );

            if (result && !("error" in result && result.error)) {
                const resultScoreElement: HTMLElement | null = document.getElementById("result-score");
                if (resultScoreElement && "score" in result && "total" in result) {
                    resultScoreElement.innerText = `${result.score}/${result.total}`;
                }
            } else {
                this.showError("Ошибка при получении результата.");
            }
        } catch (error) {
            console.error(error);
            this.showError("Произошла ошибка при загрузке результата.");
        }
    }

    private showError(message: string): void {
        const container: Element | null = document.querySelector(".result .container");
        if (container) {
            container.innerHTML = `<div style="color: red; font-size: 18px; padding: 20px;">${message}</div>`;
        }
    }
}

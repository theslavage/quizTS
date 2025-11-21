import {Form} from "./components/form";
import {Choice} from "./components/choice";
import {Test} from "./components/test";
import {Result} from "./components/result";
import {Answers} from "./components/answers";
import {Auth} from "./services/auth";
import type {RouteType} from "./types/route.type";
import type {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElement: HTMLLinkElement | null; // <link id="styles" ...>
    readonly titleElement: HTMLElement | null;
    readonly profileElement: HTMLElement | null;
    readonly profileFullNameElement: HTMLElement | null;

    private routes: RouteType[];

    constructor() {
        this.contentElement = document.getElementById("content");
        this.stylesElement = document.getElementById('styles') as HTMLLinkElement | null;
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                style: "styles/index.css",
                load: () => {}
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                style: "styles/form.css",
                load: () => { new Form('signup'); }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                style: "styles/form.css",
                load: () => { new Form('login'); }
            },
            {
                route: '#/choice',
                title: 'Выбор теста',
                template: 'templates/choice.html',
                style: "styles/choice.css",
                load: () => { new Choice(); }
            },
            {
                route: '#/test',
                title: 'Прохождение теста',
                template: 'templates/test.html',
                style: "styles/test.css",
                load: () => { new Test(); }
            },
            {
                route: '#/result',
                title: 'Результаты',
                template: 'templates/result.html',
                style: "styles/result.css",
                load: () => { new Result(); }
            },
            {
                route: '#/answers',
                title: 'Ответы',
                template: 'templates/answers.html',
                style: "styles/answers.css",
                load: () => { new Answers(); }
            },
            {
                route: '#/logout',
                title: 'Выход',
                template: 'templates/index.html',
                style: "styles/index.css",
                load: () => {}
            },
        ];
    }

    public async openRoute(): Promise<void> {
        const urlRoute = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            const result: boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/';
                return;
            }
        }

        const newRoute: RouteType | undefined = this.routes.find(item => item.route === urlRoute);
        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        if (!this.contentElement || !this.stylesElement || !this.titleElement || !this.profileElement || !this.profileFullNameElement) {
            if (urlRoute === '#/') return;
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(r => r.text());
        this.stylesElement.setAttribute('href', newRoute.style); // <-- style, не styles
        this.titleElement.innerText = newRoute.title;

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);

        if (userInfo && accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }

        void newRoute.load();
    }
}

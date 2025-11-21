import {Router} from '../router';

const router = new Router();

window.addEventListener('load', () => {
    router.openRoute();
});

window.addEventListener('hashchange', () => {
    router.openRoute();
});

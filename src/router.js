import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
const about = () => import('./shared/presentation/views/about.vue');

const routes = [
    {path: "/home",     name: 'home',       component}: Home, meta: {title: 'Home'}},
    {path: "/about",    name: 'about',      component: about, meta: {title: 'About'}},
    {path: "/",         redirect: "/home"}

];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});

export default router;
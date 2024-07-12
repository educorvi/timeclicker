import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Home.vue'),
        },
        {
            path: '/activities',
            name: 'activities',
            component: () => import('../views/Activities.vue'),
        },
        {
            path: '/hours',
            name: 'hours',
            component: () => import('../views/WorkingHours.vue'),
        },
        {
            path: '/orga',
            name: 'orga',
            component: () => import('../views/Orga.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/About.vue'),
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/Settings.vue'),
        },
        {
            path: '/apidocs',
            name: 'apidocs',
            component: () => import('../views/Apidocs.vue'),
        },
    ],
});

export default router;

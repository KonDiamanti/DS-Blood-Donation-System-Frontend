import { createRouter, createWebHistory } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),

    routes: [
        {
            path: '/',
            name: 'home',
            // component: HomeView,
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('../views/LogoutView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/applications',
            name: 'applications',
            component: () => import('../views/ApplicationsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/form',
            name: 'form',
            component: () => import('../views/FormView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/my-applications',
            name: 'my-applications',
            component: () => import('../views/MyApplicationsView.vue'),
            meta: { requiresAuth: true }
        },
        // ... your other route definitions
    ]
});

router.beforeEach((to, from, next) => {
    const store = useApplicationStore();
    const isAuthenticated = store.isAuthenticated;

    console.log('Is user authenticated?', isAuthenticated);

    if (to.meta.requiresAuth && !isAuthenticated.value) { // Ensure you're accessing the `value` if it's a ref
        console.log('User not authenticated. Redirecting to /login');
        next('/login');
    } else {
        next();
    }
});

export default router;

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
        {
            path: '/admin/login',
            name: 'AdminLogin',
            component: () => import('../views/AdminLoginView.vue'),
        },
    
        {
            path: '/admin/dashboard',
            name: 'AdminDashboard', // This name must match exactly what you use in router.push
            component: () => import('../views/AdminDashboardView.vue'),
            meta: { requiresAuth: true, role: 'admin' }
        },
        

    ]
});

  
router.beforeEach((to, from, next) => {
    const applicationStore = useApplicationStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAdminRoute = to.meta.role === 'admin';
    
    if (requiresAuth && !applicationStore.isAuthenticated) {
      return next({ name: 'login' });
    }
    
    if (requiresAuth && isAdminRoute && applicationStore.userRole !== 'admin') {
      return next({ name: 'home' });
    }
    
    next();
  });
  
export default router;

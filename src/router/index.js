import { createRouter, createWebHistory } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),

    routes: [
        {
            path: '/',
            name: 'home',
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
            path: '/admin/users-container',
            name: 'ViewUserView',
            component: () => import('../views/admin/ViewUsersView.vue'),
            meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
          },
          

    ]
});

  
router.beforeEach((to, from, next) => {
    const applicationStore = useApplicationStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRole = to.meta.role;
  
    const userRole = applicationStore.userRole;
    const isAuthenticated = applicationStore.isAuthenticated;
  
    console.log(`Navigating to: ${to.path}, Requires Auth: ${requiresAuth}, Required Role: ${requiredRole}, User Role: ${userRole}, Is Authenticated: ${isAuthenticated}`);
  
    if (requiresAuth && !isAuthenticated) {
      return next({ name: 'login' });
    }
    
    if (requiresAuth && requiredRole && userRole !== requiredRole) {
      return next({ name: 'home' });
    }
  
    next();
  });
  

export default router;
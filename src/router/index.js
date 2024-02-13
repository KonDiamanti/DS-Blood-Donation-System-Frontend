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
            path: '/admin/add-user',
            name: 'AddUserView',
            component: () => import('../views/admin/AddUserView.vue'),
            meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
          },
          {
            path: '/admin/delete-user',
            name: 'DeleteUserView',
            component: () => import('../views/admin/DeleteUserView.vue'),
            meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
          },
          {
            path: '/admin/assign-role',
            name: 'AssignRoleView',
            component: () => import('../views/admin/AssignRoleView.vue'),
            meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
          },
          {
            path: '/admin/update-user',
            name: 'UpdateUserView',
            component: () => import('../views/admin/UpdateUserView.vue'),
            meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
          },

        

    ]
});

  
router.beforeEach((to, from, next) => {
    const applicationStore = useApplicationStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRole = to.meta.role; // This is the role required for the route
  
    console.log(`User Role: ${applicationStore.userRole}, Required Role: ${requiredRole}`);
    
    if (requiresAuth && !applicationStore.isAuthenticated) {
      console.log('User is not authenticated, redirecting to login.');
      return next({ name: 'login' });
    }
    
    if (requiresAuth && requiredRole && applicationStore.userRole !== requiredRole) {
      console.log('Incorrect role, redirecting to home.');
      return next({ name: 'home' });
    }
    
    console.log('Navigation allowed.');
    next(); // If all checks pass, proceed to the route
  });
  
export default router;

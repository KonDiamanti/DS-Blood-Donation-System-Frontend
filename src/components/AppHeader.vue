<template>
  <header class="bg-dark text-white">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Blood Donation System</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link to="/register" class="nav-link">Register as Citizen</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link :to="{ name: 'login', query: { type: 'citizen' } }" class="nav-link">Login as Citizen</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link :to="{ name: 'login', query: { type: 'secretary' } }" class="nav-link">Login as Secretary</router-link>
            </li>
            <!-- Specific links for citizens -->
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/form" class="nav-link">Apply for Donation</router-link>
            </li>
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/my-applications" class="nav-link">My Applications</router-link>
            </li>
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/profile" class="nav-link">My Profile</router-link>
            </li>


            <!-- Specific links for secretaries -->
            <li v-if="isAuthenticated && userRole === 'ROLE_SECRETARY'" class="nav-item">
              <router-link to="/applications" class="nav-link">Manage Applications</router-link>
            </li>


            <!-- Specific links for admins -->

            <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/users-container" class="nav-link">View Users</router-link>
          </li>
            <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/add-user" class="nav-link">Add User</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/delete-user" class="nav-link">Delete User</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/update-user" class="nav-link">Update User</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/assign-role" class="nav-link">Assign Role</router-link>
          </li>
            <!-- Common logout link for authenticated users -->
            <li v-if="isAuthenticated" class="nav-item">
              <a class="nav-link" href="#" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application';

export default defineComponent({
  name: 'AppHeader',
  components: {
    // If you don't have any local components, you can remove this section
  },
  setup() {
    const router = useRouter();
    const store = useApplicationStore();
    const isAuthenticated = computed(() => store.isAuthenticated);
    const userRole = computed(() => store.userRole); // Make sure this is properly defined in your store

    const logout = async () => {
      // Call store's logout action or clear user data and tokens directly
      store.clearUserData();
      await router.push({ name: 'home' });
    };

    return { isAuthenticated, userRole, logout };
  },
});
</script>

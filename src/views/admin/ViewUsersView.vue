<template>
    <div class="users-container">
      <h2>View Users</h2>
      <div v-if="loading">Loading users...</div>
      <div v-else-if="errorMessage">{{ errorMessage }}</div>
      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.roles.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useApplicationStore } from '@/stores/application';
  
  const store = useApplicationStore();
  const users = ref([]);
  const loading = ref(false);
  const errorMessage = ref('');
  
  // Function to fetch all user details
  const fetchUsers = async () => {
    loading.value = true;
    try {
      const response = await fetch('http://localhost:8080/api/admin/users/get-all-user-details', {
        headers: {
          'Authorization': `Bearer ${store.accessToken}`
        },
      });
      if (response.ok) {
        users.value = await response.json();
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      errorMessage.value = error.message || 'An error occurred while fetching users.';
    } finally {
      loading.value = false;
    }
  };
  
  onMounted(() => {
    fetchUsers();
  });
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
  
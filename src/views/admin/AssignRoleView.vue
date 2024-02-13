<template>
  <div class="users-container">
    <h2>Assign Roles to Users</h2>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Assign New Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(', ') }}</td>
            <td>
              <select v-model="selectedRoles[user.id]" @change="assignRole(user.id)">
                <option value="" disabled>Select Role</option>
                <option value="ROLE_CITIZEN">Citizen</option>
                <option value="ROLE_SECRETARY">Secretary</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </td>
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
const selectedRoles = ref({}); // Object to keep track of selected roles for each user

// Fetch all users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8080/api/admin/users/get-all-user-details', {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });
    if (response.ok) {
      users.value = await response.json();
      // Initialize selectedRoles for each user
      users.value.forEach(user => {
        selectedRoles.value[user.id] = '';
      });
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching users.';
  } finally {
    loading.value = false;
  }
};

// Assign role to a user
const assignRole = async (userId) => {
  const newRole = selectedRoles.value[userId];
  if (!newRole) {
    alert('Please select a role to assign');
    return;
  }
  try {
    const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/assign-role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`
      },
      body: JSON.stringify({ role: newRole })
    });
    if (response.ok) {
      alert('Role assigned successfully');
      fetchUsers(); // Refresh the list to reflect the change
    } else {
      throw new Error('Failed to assign role');
    }
  } catch (error) {
    alert(error.message || 'An error occurred while assigning the role.');
  }
};

onMounted(fetchUsers);
</script>

<style>
/* Add your styles here */
</style>

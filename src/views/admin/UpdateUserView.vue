<template>
  <div class="users-container">
    <h2>Update User Information</h2>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="initiateUpdate(user)" class="btn btn-primary">Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Update User Modal -->
  <div v-if="showUpdateModal" class="modal">
    <div class="modal-content">
      <span class="close" @click="showUpdateModal = false">&times;</span>
      <h3>Update User</h3>
      <form @submit.prevent="updateUser">
        <input type="hidden" v-model="currentUser.id">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="currentUser.username" required>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="currentUser.email" required>
        </div>
        <button type="submit" class="btn btn-success">Submit</button>
        <button type="button" @click="showUpdateModal = false" class="btn btn-secondary">Cancel</button>
      </form>
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
const showUpdateModal = ref(false);
const currentUser = ref({ id: '', username: '', email: '' });

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
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching users.';
  } finally {
    loading.value = false;
  }
};

const initiateUpdate = (user) => {
  currentUser.value = { ...user };
  showUpdateModal.value = true;
};

const updateUser = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/admin/users/${currentUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`
      },
      body: JSON.stringify(currentUser.value)
    });
    if (response.ok) {
      alert('User updated successfully');
      showUpdateModal.value = false;
      fetchUsers(); // Refresh the user list
    } else {
      throw new Error('Failed to update user');
    }
  } catch (error) {
    alert(error.message || 'An error occurred while updating the user.');
  }
};

onMounted(fetchUsers);
</script>

<style>

</style>

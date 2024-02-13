<template>
    <div class="login-container">
      <h1>Admin Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="username" id="username" v-model="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const router = useRouter();
    const applicationStore = useApplicationStore();

    const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      // Handle HTTP errors, e.g., 401, 403, etc.
      throw new Error('Login failed');
    }

    const data = await response.json();
    // Assuming the response includes the user's role and access token
    applicationStore.setUserData({
      username: username.value,
      roles: data.roles,
      accessToken: data.accessToken,
    });

        // Redirect to the admin dashboard
        router.push({ name: 'AdminDashboard' }); // Corrected route name
        } catch (error) {
            console.error('Login failed:', error);
        // Handle login failure, e.g., show an error message
      }
    };

    return {
      username,
      password,
      handleLogin,
    };
  },
};
</script>

  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1em;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    display: block;
    margin-bottom: 0.5em;
  }
  
  input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5em 1em;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
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
          throw new Error('Login failed');
        }

        const data = await response.json();
        applicationStore.setUserData({
          username: username.value,
          roles: data.roles,
          accessToken: data.accessToken,
        });

        router.push({ name: 'ViewUserView' });
      } catch (error) {
        console.error('Login failed:', error);
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
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

h1 {
  color: #333; 
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666; 
}

.form-group input[type="username"],
.form-group input[type="password"] {
  width: 100%; 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 4px;
}

button[type="submit"] {
  width: 100%; 
  padding: 12px 20px; 
  background-color: #0056b3; 
  color: white;
  border: none; 
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 16px; 
  font-weight: bold; 
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #003d82; 
}

.form-group input[type="username"]:focus,
.form-group input[type="password"]:focus {
  border-color: #0056b3; 
  outline: none; 
  box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.25);
}
</style>

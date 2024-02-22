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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-box {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 20px;
  z-index: 1001;
}

.modal-header {
  margin-top: 0;
  color: #333;
}

.modal-body {
  margin: 20px 0;
}

.reason-textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical; /* Allow vertical resizing, might be useful for longer texts */
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.modal-close-btn, .modal-submit-btn {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-close-btn {
  background-color: #f44336;
  color: white;
}

.modal-submit-btn {
  background-color: #4CAF50;
  color: white;
}

/* Add hover effects to buttons */
.modal-close-btn:hover, .modal-submit-btn:hover {
  opacity: 0.8;
}
</style>
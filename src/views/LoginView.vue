<template>
  <div class="container mt-4">
    <h2>Login as {{ userType.charAt(0).toUpperCase() + userType.slice(1) }}</h2>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" class="form-control" v-model="form.username" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" class="form-control" v-model="form.password" required>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application'; 

export default {
  name: 'LoginView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const applicationStore = useApplicationStore(); 
    const errorMessage = ref('');
    const form = ref({
      username: '',
      password: '',
    });

    const userType = computed(() => {
      return route.query.type || 'citizen'; 
    });

    const handleSubmit = async () => {
  const API_URL = `http://localhost:8080/api/auth/signin`;
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password,
      }),
    });

    if (!response.ok) {

      const text = await response.text(); 
      const errorData = text ? JSON.parse(text) : {}; 
      const errorMessage = errorData.message || 'Incorrect username or password';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    applicationStore.setUserData(data); 
    router.push('/'); 
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message;
  }
};


    return { form, userType, handleSubmit, errorMessage };
  },
  
};
</script>


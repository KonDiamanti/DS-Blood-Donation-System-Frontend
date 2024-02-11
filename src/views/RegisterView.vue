<template>
  <div class="container mt-4">
    <h2>Register as Citizen</h2>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
  <form @submit.prevent="handleSubmit">
    <!-- Your form fields -->
    <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" id="username" class="form-control" v-model="form.username" required>
      </div>
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input type="text" id="firstName" class="form-control" v-model="form.firstName" required>
      </div>
      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input type="text" id="lastName" class="form-control" v-model="form.lastName" required>
      </div>
      <div class="mb-3">
        <label for="age" class="form-label">Age</label>
        <input type="number" id="age" class="form-control" v-model.number="form.age" required>
      </div>
      <div class="mb-3">
        <label for="phoneNumber" class="form-label">Phone Number</label>
        <input type="tel" id="phoneNumber" class="form-control" v-model="form.phoneNumber" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" class="form-control" v-model="form.email" required>
      </div>
      <div class="mb-3">
        <label for="area" class="form-label">Area</label>
        <input type="text" id="area" class="form-control" v-model="form.area" required>
      </div>
      <div class="mb-3">
        <label for="bloodType" class="form-label">Blood Type</label>
        <input type="text" id="bloodType" class="form-control" v-model="form.bloodType" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" class="form-control" v-model="form.password" required>
      </div>

    <button type="submit" class="btn btn-primary">Register</button>
  </form>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const form = reactive({
username:'',
firstName: '',
lastName: '',
age: null,
phoneNumber: '',
email: '',
area: '',
bloodType: '',
password: '',
});

const successMessage = ref('');

const handleSubmit = async () => {
const API_URL = 'http://localhost:8080/api/auth/signup'; // Adjust if necessary
try {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Registration failed: ${errorData.message || response.status}`);
  }

  // Comment out or remove the following line if `data` is not used.
  // const data = await response.json();
  successMessage.value = 'Registration successful! Please login.';
  // Reset form fields
  Object.keys(form).forEach(key => form[key] = '');
} catch (error) {
  console.error('Registration error', error);
  successMessage.value = error.message || 'An unexpected error occurred.';
}
};
</script>
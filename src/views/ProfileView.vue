<template>
  <div class="container mt-4">
    <h2>Citizen Profile</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-else>
      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" v-model="userData.username" disabled>
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" class="form-control" id="firstName" v-model="userData.firstName">
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" class="form-control" id="lastName" v-model="userData.lastName">
        </div>
        <div class="mb-3">
          <label for="age" class="form-label">Age</label>
          <input type="number" class="form-control" id="age" v-model.number="userData.age">
        </div>
        <div class="mb-3">
          <label for="phoneNumber" class="form-label">Phone Number</label>
          <input type="text" class="form-control" id="phoneNumber" v-model="userData.phoneNumber">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="userData.email">
        </div>
        <div class="mb-3">
          <label for="area" class="form-label">Area</label>
          <input type="text" class="form-control" id="area" v-model="userData.area">
        </div>
        <div class="mb-3">
          <label for="bloodType" class="form-label">Blood Type</label>
          <select class="form-select" id="bloodType" v-model="userData.bloodType">
            <option disabled value="">Please select one</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Update Information</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/stores/application';

const store = useApplicationStore();
const userData = ref({});
const loading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8080/api/citizen/profile', {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    userData.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching profile data.';
  } finally {
    loading.value = false;
  }
});

async function updateProfile() {
  try {
    const API_URL = 'http://localhost:8080/api/citizen/update';
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken.value}`,
      },
      body: JSON.stringify(userData.value),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    alert('Profile updated successfully');
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while updating the profile.';
  }
}
</script>

<style>
/* Your styles here */
</style>

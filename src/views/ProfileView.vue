<template>
  <div class="container mt-4">
    <h2>Citizen Profile</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-else>
      <!-- View Mode -->
      <div v-if="!isEditMode">
        <p><strong>First Name:</strong> {{ userData.firstName }}</p>
        <p><strong>Last Name:</strong> {{ userData.lastName }}</p>
        <p><strong>Age:</strong> {{ userData.age }}</p>
        <p><strong>Phone Number:</strong> {{ userData.phoneNumber }}</p>
        <p><strong>Email:</strong> {{ userData.email }}</p>
        <p><strong>Area:</strong> {{ userData.area }}</p>
        <p><strong>Blood Type:</strong> {{ userData.bloodType }}</p>
        <button class="btn btn-primary" @click="isEditMode = true">Update</button>
      </div>

<!-- Edit Mode -->
<form v-else @submit.prevent="updateProfile">
  <div class="mb-3">
    <label for="firstName" class="form-label">First Name</label>
    <input type="text" class="form-control" id="firstName" v-model="userData.firstName" required>
  </div>
  
  <div class="mb-3">
    <label for="lastName" class="form-label">Last Name</label>
    <input type="text" class="form-control" id="lastName" v-model="userData.lastName" required>
  </div>
  
  <div class="mb-3">
    <label for="age" class="form-label">Age</label>
    <input type="number" class="form-control" id="age" v-model.number="userData.age" required>
  </div>
  
  <div class="mb-3">
    <label for="phoneNumber" class="form-label">Phone Number</label>
    <input type="text" class="form-control" id="phoneNumber" v-model="userData.phoneNumber" required>
  </div>
  
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" v-model="userData.email" required>
  </div>
  
  <div class="mb-3">
    <label for="area" class="form-label">Area</label>
    <select id="area" class="form-control" v-model="userData.area" required>
      <option disabled value="">Select Area</option>
      <option value="Kratiko Hospital">Kratiko Hospital</option>
      <option value="Attikon Hospital">Attikon Hospital</option>
      <option value="Tzaneio Hospital">Tzaneio Hospital</option>
      <option value="Sismanoglio Hospital">Sismanoglio Hospital</option>
    </select>
  </div>
  
  <!-- Blood Type is not editable, so it's displayed as text -->
  <div class="mb-3">
    <label for="bloodType" class="form-label">Blood Type</label>
    <input type="text" class="form-control" id="bloodType" v-model="userData.bloodType" disabled>
  </div>

  <button type="submit" class="btn btn-success">Save Changes</button>
  <button type="button" class="btn btn-secondary" @click="isEditMode = false">Cancel</button>
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
const isEditMode = ref(false); // Add this line

onMounted(async () => {
  fetchProfileData();
});

async function fetchProfileData() {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8080/api/citizen/get-myDetails', {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile data');
    userData.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching profile data.';
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    // Ensures the request payload matches the CitizenUpdate model
    const payload = {
      firstName: userData.value.firstName,
      lastName: userData.value.lastName,
      email: userData.value.email,
      phoneNumber: userData.value.phoneNumber,
      area: userData.value.area,
      bloodType: userData.value.bloodType,
      age: userData.value.age,
    };

    const API_URL = 'http://localhost:8080/api/citizen/update';
    const response = await fetch(API_URL, {
      method: 'PUT', // Ensure the method is PUT as your backend might expect it for an update operation
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`,
      },
      body: JSON.stringify(payload),
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

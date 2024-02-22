<template>
  <div class="container mt-4">
    <h2>Citizen Profile</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-else>
      <!-- View Mode -->
      <div v-if="!isEditMode">
        <div class="info-box">
        <strong>First Name:</strong>
        <span>{{ userData.firstName }}</span>
      </div>
      <div class="info-box">
        <strong>Last Name:</strong>
        <span>{{ userData.lastName }}</span>
      </div>
      <div class="info-box">
        <strong>Age:</strong>
        <span>{{ userData.age }}</span>
      </div>
      <div class="info-box">
        <strong>Phone Number :</strong>
        <span>{{ userData.phoneNumber }}</span>
      </div>
      <div class="info-box">
        <strong>Email:</strong>
        <span>{{ userData.email }}</span>
      </div>
      <div class="info-box">
        <strong>Selected Hospital:</strong>
        <span>{{ userData.area }}</span>
      </div>
      <div class="info-box">
        <strong>Blood Type:</strong>
        <span>{{ userData.bloodType }}</span>
      </div>
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
  <div class="mb-3">
  <label for="password" class="form-label">Password</label>
  <input type="password" class="form-control" id="password" v-model="userData.password">
  <small class="form-text text-muted">Leave blank if you do not want to change the password.</small>
</div>
  
<!-- Blood Type as a dropdown -->
<div class="mb-3">
  <label for="bloodType" class="form-label">Blood Type</label>
  <select id="bloodType" class="form-control" v-model="userData.bloodType" required>
    <option value="">Select Blood Type</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  </select>
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
const isEditMode = ref(false); 
const successMessage = ref('');

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
      ...(userData.value.password && { password: userData.value.password }),
    };

    const API_URL = 'http://localhost:8080/api/citizen/update';
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    successMessage.value = 'Profile updated successfully!';

    errorMessage.value = '';

    isEditMode.value = false;

    await fetchProfileData();
    
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while updating the profile.';
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
}

h2 {
  text-align: center;
  color: #333;
  font-size: 1.75rem;
  margin-bottom: 2rem;
}


.info-box {
  background: #f9f9f9; 
  border: 1px solid #e3e3e3; 
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
}

.info-box strong {
  color: #333;
  margin-right: 1rem; 
}

/* Additional styling for buttons */
button.btn {
  width: auto;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
}

button.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button.btn-primary:hover {
  background-color: #254972;
}

.alert-success, .alert-danger {
  text-align: center;
  border-radius:4px;
margin-bottom: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
.container {
width: 90%;
margin-top: 1rem;
padding: 1rem;
}

.info-box {
flex-direction: column; 
align-items: flex-start; 
}
}
</style>

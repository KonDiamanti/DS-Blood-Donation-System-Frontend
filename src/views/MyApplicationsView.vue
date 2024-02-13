<template>
  <div class="container mt-4">
    <h2>My Applications</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(application, index) in applications" :key="application.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ formatDate(application.createdAt) }}</td> <!-- Adjusted to use createdAt -->
            <td>{{ application.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/stores/application'; // Adjust the import path if necessary

const store = useApplicationStore();
const applications = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

// Method to format the date
const formatDate = (value) => {
  if (value) {
    const date = new Date(value);
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }); // Adjusted for a more readable format
  }
  return '';
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const API_URL = 'http://localhost:8080/api/bloodDonations/my-applications';
    const response = await fetch(API_URL, {
      method: 'GET', // Ensure method is GET for fetching data
      headers: {
        'Authorization': `Bearer ${store.accessToken}` // Ensure to use .value for accessing ref inside setup
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    applications.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching your applications.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style>
/* Your styles here */
</style>

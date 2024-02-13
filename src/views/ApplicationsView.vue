<template>
  <div class="container mt-4">
    <h2>Donation Applications</h2>
    <select v-model="selectedStatus" @change="fetchApplications">
      <option value="">All</option>
      <option value="APPROVED">Approved</option>
      <option value="REJECTED">Rejected</option>
      <option value="PENDING">Pending</option>
    </select>

    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Citizen ID</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(application, index) in applications" :key="application.id">
            <td>{{ index + 1 }}</td>
            <td>{{ application.citizenId }}</td>
            <td>{{ application.status }}</td>
            <td>{{ new Date(application.createdAt).toLocaleDateString() }}</td>
            <td>
              <button @click="fetchCitizenDetails(application.citizenId, application.id)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Citizen Details Section -->
    <div v-if="citizenDetails" class="citizen-details">
      <h3>Citizen Details</h3>
      <p><strong>ID:</strong> {{ citizenDetails.id }}</p>
      <p><strong>First Name:</strong> {{ citizenDetails.firstName }}</p>
      <p><strong>Last Name:</strong> {{ citizenDetails.lastName }}</p>
      <p><strong>Email:</strong> {{ citizenDetails.email }}</p>
      <p><strong>Age:</strong> {{ citizenDetails.age }}</p>
      
      <h4>Donation Details</h4>
      <ul>
        <li><strong>Status:</strong> {{ citizenDetails.donationDetails.status }}</li>
        <li><strong>Processed By:</strong> {{ citizenDetails.donationDetails.processedBySecretary }}</li>
        <p><strong>Processed At:</strong> {{ citizenDetails.donationDetails.processedAt && new Date(citizenDetails.donationDetails.processedAt).getTime() > 0 ? new Date(citizenDetails.donationDetails.processedAt).toLocaleString() : 'Not processed yet' }}</p>
      </ul>
      
      <div class="action-buttons">
        <button @click="updateApplicationStatus(selectedApplicationId, 'APPROVED')" class="btn btn-success">Accept</button>
        <button @click="updateApplicationStatus(selectedApplicationId, 'REJECTED')" class="btn btn-danger">Reject</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApplicationStore, checkJWT } from '@/stores/application';

const store = useApplicationStore();
const applications = ref([]);
const selectedStatus = ref('');
const loading = ref(false);
const errorMessage = ref('');
const citizenDetails = ref(null);
const selectedApplicationId = ref(null);

const logAndCheckToken = () => {
  const token = store.accessToken;
  console.log(`Token from store: ${token}`);

  if (!token) {
    console.error('No token found in store.');
    return false;
  }

  // Directly use checkJWT to validate the token
  const isValid = checkJWT(token);
  console.log(`Is token valid? ${isValid}`);

  return isValid;
};

async function fetchApplications() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const queryParam = selectedStatus.value ? `?status=${selectedStatus.value}` : '';
    const API_URL = `http://localhost:8080/api/secretary/review-applications${queryParam}`;
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch applications');
    }

    applications.value = await response.json();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}


async function fetchCitizenDetails(citizenId) {
  if (!logAndCheckToken()) {
    errorMessage.value = 'You are not authenticated or your session has expired.';
    return;
  }

  loading.value = true;
  // Define API_URL at the beginning of fetchCitizenDetails function
  const API_URL = `http://localhost:8080/api/secretary/getDetails/${citizenId}`;
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${store.accessToken}`,
      },
    });

    // Check the response status
    if (!response.ok) {
      const status = response.status;
      const statusText = response.statusText;
      const responseBody = await response.text();
      console.error(`Error fetching details: ${status} ${statusText}`, responseBody);
      throw new Error(`Failed to fetch citizen details: ${statusText}`);
    }

    const details = await response.json();
    // Log the details
    console.log('Fetched citizen details:', details);
    citizenDetails.value = details;
  } catch (error) {
    console.error('Error fetching citizen details:', error);
    errorMessage.value = error.message || 'An unexpected error occurred while fetching citizen details.';
  } finally {
    loading.value = false;
  }
}
// Define the function within your <script setup>
async function updateApplicationStatus(status) {
  if (!selectedApplicationId.value) {
    console.error('Application ID is null.');
    return;
  }

  const API_URL = `http://localhost:8080/api/bloodDonations/applications/${selectedApplicationId.value}/status`;
  try {
    const response = await fetch(API_URL, {
      method: 'POST', // Or 'PATCH', according to your backend requirement
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`
      },
      body: JSON.stringify({ status }) // Make sure this matches the expected format of your backend
    });

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    // Handle the success response
    fetchApplications(); // Refresh the applications list
  } catch (error) {
    console.error('Error updating application status:', error);
  }
}

fetchApplications();
</script>

<style scoped>
.citizen-details {
  margin-top: 2rem;
}

.action-buttons {
  margin-top: 1rem;
}
</style>

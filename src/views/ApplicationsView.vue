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
  <li><strong>Created At:</strong> {{ new Date(citizenDetails.donationDetails.createdAt).toLocaleString() }}</li>
  <li><strong>Processed By Secretary:</strong> {{ citizenDetails.donationDetails.processedBySecretary || 'N/A' }}</li>
  <li><strong>Processed At:</strong> {{ citizenDetails.donationDetails.processedAt ? new Date(citizenDetails.donationDetails.processedAt).toLocaleString() : 'Not processed yet' }}</li>
  <li><strong>Free of Infections:</strong> {{ citizenDetails.donationDetails.freeOfInfections }}</li>
  <li><strong>No Tattoos/Piercings:</strong> {{ citizenDetails.donationDetails.hasNoTattoosOrPiercings }}</li>
  <li><strong>No Recent Procedures:</strong> {{ citizenDetails.donationDetails.hasNoRecentProcedures }}</li>
  <li><strong>No Travel to Risk Areas:</strong> {{ citizenDetails.donationDetails.hasNoTravelToRiskAreas }}</li>
  <li><strong>No Risk Behavior:</strong> {{ citizenDetails.donationDetails.hasNoRiskBehavior }}</li>
  <li><strong>Not Recently Pregnant:</strong> {{ citizenDetails.donationDetails.notRecentlyPregnant }}</li>
  <li><strong>Not Breastfeeding:</strong> {{ citizenDetails.donationDetails.notBreastfeeding }}</li>
  <li><strong>No Drug Use:</strong> {{ citizenDetails.donationDetails.hasNoDrugUse }}</li>
  <li><strong>Has AIDS:</strong> {{ citizenDetails.donationDetails.hasAIDS }}</li>
</ul>

  
  <div class="action-buttons">
    <button @click="updateApplicationStatus('APPROVED')" class="btn btn-success">Accept</button>
    <button @click="updateApplicationStatus('REJECTED')" class="btn btn-danger">Reject</button>
  </div>
</div>

  </div>
</template>

<script setup>


import { ref } from 'vue';
import { useApplicationStore } from '@/stores/application';

const store = useApplicationStore();
const applications = ref([]);
const selectedStatus = ref('');
const loading = ref(false);
const errorMessage = ref('');
const citizenDetails = ref(null);
const selectedApplicationId = ref(null);

// Fetch all applications based on the selected status
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

    if (response.ok) {
      applications.value = await response.json();
    } else {
      throw new Error('Failed to fetch applications');
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching applications.';
  } finally {
    loading.value = false;
  }
}

// Fetch citizen details for a specific application
async function fetchCitizenDetails(applicationId) {
  if (!applicationId) {
    errorMessage.value = 'Application ID is not provided.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  const API_URL = `http://localhost:8080/api/secretary/getDetails/${applicationId}`;
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`,
      },
    });

    if (response.ok) {
      citizenDetails.value = await response.json();
      selectedApplicationId.value = applicationId; 
    } else {
      throw new Error('Failed to fetch citizen details');
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching citizen details.';
  } finally {
    loading.value = false;
  }
}

const updateApplicationStatus = async (status, rejectionReason = '') => {
  if (!selectedApplicationId.value) {
    errorMessage.value = 'Application ID is not provided.';
    return;
  }

  // Retrieve the secretary's username from the store
  const secretaryUsername = store.userData.value?.username; // Ensure you have the username available in the userData

  if (!secretaryUsername) {
    console.error('Secretary username not available');
    errorMessage.value = 'Secretary username not available';
    return;
  }

  const queryParams = new URLSearchParams({
    status: status,
    username: secretaryUsername, // Use the username instead of email
    rejectionReason: rejectionReason
  }).toString();

  const API_URL = `http://localhost:8080/api/bloodDonations/applications/${selectedApplicationId.value}/status?${queryParams}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    await fetchApplications();
    citizenDetails.value = null;
    selectedApplicationId.value = null;
  } catch (error) {
    console.error('Error updating application status:', error);
    errorMessage.value = error.toString();
  }
};







// Initial fetch of applications
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

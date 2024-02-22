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
            <button @click="fetchCitizenDetails(application.id)">View Details</button>
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
  <li><strong>Tattoos/Piercings:</strong> {{ citizenDetails.donationDetails.hasNoTattoosOrPiercings }}</li>
  <li><strong>Recent Procedures:</strong> {{ citizenDetails.donationDetails.hasNoRecentProcedures }}</li>
  <li><strong>Travel to Risk Areas:</strong> {{ citizenDetails.donationDetails.hasNoTravelToRiskAreas }}</li>
  <li><strong>Risk Behavior:</strong> {{ citizenDetails.donationDetails.hasNoRiskBehavior }}</li>
  <li><strong>Recently Pregnant:</strong> {{ citizenDetails.donationDetails.notRecentlyPregnant }}</li>
  <li><strong>Breastfeeding:</strong> {{ citizenDetails.donationDetails.notBreastfeeding }}</li>
  <li><strong>Drug Use:</strong> {{ citizenDetails.donationDetails.hasNoDrugUse }}</li>
  <li><strong>Has AIDS:</strong> {{ citizenDetails.donationDetails.hasAIDS }}</li>
</ul>

  <!-- Buttons -->
  <div class="action-buttons">
    <button @click="updateApplicationStatus('APPROVED')" class="btn btn-success">Accept</button>
    <button @click="updateApplicationStatus('REJECTED')" class="btn btn-danger">Reject</button>
  </div>
</div>

    <!-- Success Message Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-box">
        <h2 class="modal-header">Success</h2>
        <div class="modal-body">
          <p>{{ successMessage }}</p>
        </div>
        <div class="modal-footer">
          <button @click="closeSuccessModal" class="modal-close-btn">Close</button>
        </div>
      </div>
    </div>
    
    <!-- Rejection Reason Modal -->
    <div v-if="showRejectionModal" class="modal-overlay">
      <div class="modal-box">
        <h2 class="modal-header">Rejection Reason</h2>
        <div class="modal-body">
          <textarea v-model="rejectionReason" placeholder="Please enter the reason for rejection..." class="reason-textarea"></textarea>
        </div>
    <div class="modal-footer">
      <button @click="closeRejectionModal" class="modal-close-btn">Cancel</button>
      <button @click="submitRejectionReason" class="modal-submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useApplicationStore } from '@/stores/application';

const isSubmitting = ref(false);

const submitRejectionReason = async () => {
  if (rejectionReason.value.trim()) {
    isSubmitting.value = true; // Start submission
    await performStatusUpdate('REJECTED', rejectionReason.value.trim());
    isSubmitting.value = false; // End submission

    successMessage.value = 'The application has been successfully rejected.';
    showSuccessModal.value = true;

    closeRejectionModal();
  } else {
    alert('Please provide a rejection reason.');
  }
};

const store = useApplicationStore();
const applications = ref([]);
const selectedStatus = ref('');
const loading = ref(false);
const errorMessage = ref('');
const citizenDetails = ref(null);
const selectedApplicationId = ref(null);
const showSuccessModal = ref(false);
const successMessage = ref('');
const showRejectionModal = ref(false);
const rejectionReason = ref('');


const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const promptRejectionReason = () => {
  showRejectionModal.value = true;
};


const closeRejectionModal = () => {
  showRejectionModal.value = false;
  rejectionReason.value = ''; 
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

const updateApplicationStatus = async (status) => {
  if (!selectedApplicationId.value) {
    errorMessage.value = 'Application ID is not provided.';
    return;
  }

  if (status === 'APPROVED') {
    successMessage.value = 'The application has been successfully approved.';
  } else if (status === 'REJECTED') {

    promptRejectionReason();
    return;
  }
  showSuccessModal.value = true;

  await performStatusUpdate(status);
};

const performStatusUpdate = async (status, reason = '') => {
  let queryParams = new URLSearchParams({ status: status });
  if (reason) queryParams.append('rejectionReason', reason);

  const API_URL = `http://localhost:8080/api/bloodDonations/applications/${selectedApplicationId.value}/status?${queryParams.toString()}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${store.accessToken}`,
      },
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

    successMessage.value = 'An error occurred while updating the application status.';
    showSuccessModal.value = true; 
  }
};

fetchApplications();
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

select {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ced4da;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.table th, .table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eaecef;
}

.table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f4f4f4;
}

.table tbody tr:nth-of-type(even) {
  background-color: #f8f8f8;
}

.table td button {
  padding: 0.375rem 0.75rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.table td button:hover {
  background-color: #0056b3;
}

/* Citizen Details styling */
.citizen-details {
  margin-top: 1rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.citizen-details h3, .citizen-details h4 {
  color: #333;
  margin-bottom: 0.75rem;
}

.citizen-details p, .citizen-details li {
  color: #555;
}

.action-buttons button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Modal styling */
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
  resize: vertical;
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

.modal.submit-btn {
background-color: #4CAF50;
color: #4CAF50;
}

/* Add hover effects to buttons */
.modal-close-btn:hover, .modal-submit-btn:hover {
opacity: 0.8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
.container {
width: 90%;
margin-top: 1rem;
padding: 1rem;
}

.modal-box {
width: 90%;
}
}
</style>

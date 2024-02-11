<template>
  <div class="container mt-4">
    <h2>Donation Application Form</h2>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <form @submit.prevent="handleSubmit">
      <!-- Dynamically generate form fields for each question -->
      <div v-for="(value, key) in form" :key="key" class="mb-3">
        <label :for="key" class="form-label">{{ questions[key] }}</label>
        <div class="form-check">
          <input class="form-check-input" type="radio" :id="key + 'Yes'" :name="key" value="true" v-model="form[key]">
          <label class="form-check-label" :for="key + 'Yes'">Yes</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" :id="key + 'No'" :name="key" value="false" v-model="form[key]">
          <label class="form-check-label" :for="key + 'No'">No</label>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Submit Application</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useApplicationStore } from '@/stores/application'; // adjust the import path if necessary

// Define the questions with more readable text
const questions = {
  hasNoTattoosOrPiercings: "Have you had any tattoos or piercings in the last 3 months?",
  hasNoRecentProcedures: "Have you had any recent medical or dental procedures in the last 3 months?",
  hasNoTravelToRiskAreas: "Have you traveled to any risked areas recently?",
  hasNoRiskBehavior: "Have you engaged in risked behaviors?",
  hasNoDrugUse: "Do you use drugs?",
  hasAIDS: "Do you have AIDS?",
  freeOfInfections: "Are you free of infections?",
  notRecentlyPregnant: "Have you recently been pregnant?",
  notBreastfeeding: "Are you breastfeeding?"
};

// Reactive form data
const form = reactive({
  hasNoTattoosOrPiercings: null,
  hasNoRecentProcedures: null,
  hasNoTravelToRiskAreas: null,
  hasNoRiskBehavior: null,
  hasNoDrugUse: null,
  hasAIDS: null,
  freeOfInfections: null,
  notRecentlyPregnant: null,
  notBreastfeeding: null,
});

const successMessage = ref('');
const errorMessage = ref('');

const store = useApplicationStore();

const handleSubmit = async () => {
  const API_URL = 'http://localhost:8080/api/bloodDonations/apply'; // Adjust if necessary
  // Retrieve the token just before sending the request to ensure it's the current token
  const authToken = store.userData.value?.accessToken;

  if (!authToken) {
    errorMessage.value = 'You must be logged in to submit an application.';
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Include the authorization header
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      // When the response has a JSON body
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(`Application failed: ${errorData.message || response.status}`);
      }
      // When the response does not have a JSON body
      throw new Error('Application failed: Server responded with a status of ' + response.status);
    }

    successMessage.value = 'Application successful! Thank you.';
    errorMessage.value = ''; // Clear any previous errors
    // Reset form fields
    Object.keys(form).forEach(key => form[key] = null);
  } catch (error) {
    console.error('Application error', error);
    successMessage.value = '';
    errorMessage.value = error.message || 'An unexpected error occurred.';
  }
};
</script>

<style>
/* Add any additional styling for your form here */
.form-check-label {
  margin-left: 0.5rem;
}
</style>

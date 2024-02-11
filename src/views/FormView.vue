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
  const API_URL = 'http://localhost:8080/api/bloodDonations/apply';
  const authToken = store.accessToken;

  if (!authToken) {
    errorMessage.value = 'You must be logged in to submit an application.';
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      successMessage.value = 'Application successful! Thank you.';
      errorMessage.value = '';
      Object.keys(form).forEach(key => form[key] = null);
    } else {
      const errorData = await response.json();
      throw new Error(`Application failed: ${errorData.message || response.status}`);
    }
  } catch (error) {
    console.error('Application error:', error);
    errorMessage.value = error.message || 'An unexpected error occurred.';
  }
};
</script>

<style>
.form-check-label {
  margin-left: 0.5rem;
}
</style>
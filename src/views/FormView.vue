<template>
  <div class="container mt-4">
    <h2>Donation Application Form</h2>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <form @submit.prevent="handleSubmit">
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
import { useApplicationStore } from '@/stores/application'; 

// Form questions
const questions = {
  hasTattoosOrPiercings: "Have you had any tattoos or piercings in the last 3 months?",
  hasRecentProcedures: "Have you had any recent medical or dental procedures in the last 3 months?",
  hasTravelToRiskAreas: "Have you traveled to any risked areas recently?",
  hasRiskBehavior: "Have you engaged in risked behaviors?",
  hasDrugUse: "Do you use drugs?",
  hasAIDS: "Do you have AIDS?",
  freeOfInfections: "Are you free of infections?",
  recentlyPregnant: "Have you recently been pregnant?",
  breastfeeding: "Are you breastfeeding?"
};

// Reactive form data
const form = reactive({
  hasTattoosOrPiercings: null,
  hasRecentProcedures: null,
  hasTravelToRiskAreas: null,
  hasRiskBehavior: null,
  hasDrugUse: null,
  hasAIDS: null,
  freeOfInfections: null,
  recentlyPregnant: null,
  breastfeeding: null,
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



<style scoped>
.container {
  max-width: 600px; 
  margin: 2rem auto; 
  padding: 2rem; 
  background: #fff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

h2 {
  text-align: center; 
  color: #333;
  font-size: 2rem; 
  margin-bottom: 1.5rem;
}

.alert {
  text-align: center; 
  margin-bottom: 1rem; 
  padding: 1rem; 
  border-radius: 5px; 
}

.form-check-label {
  margin-left: 0.5rem; 
  font-weight: normal;
}

.form-check-input {
  margin-top: 0.3rem; 
  margin-right: 0.5rem;
}

.mb-3 {
  margin-bottom: 1.5rem;
}

.btn {
  font-size: 1rem; 
  border-radius: 5px;
  padding: 0.75rem 1.5rem; 
  display: block;
  width: 100%;
  margin-top: 0.5rem; 
  margin-bottom: 0.5rem; 
}

.btn-primary {
  background-color: #007bff; 
  border: none; 
  color: white;
}

.btn-primary:hover {
  background-color: #254972;
}

@media (max-width: 768px) {
  .container {
    width: 90%; 
    margin-top: 1rem; 
    padding: 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>

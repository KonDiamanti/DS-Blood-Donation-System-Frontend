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
            <td>{{ formatDate(application.createdAt) }}</td> 
            <td>{{ application.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/stores/application'; 

const store = useApplicationStore();
const applications = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

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
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    const data = await response.json();
    if (data.length === 0) {
      errorMessage.value = 'You have not submitted any applications yet.';
    } else {
      applications.value = data;
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching your applications.';
  } finally {
    isLoading.value = false;
  }
});

</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.table {
  width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
}

.table th,
.table td {
  padding: 1rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
  background-color: #f8f9fa;
}

.table tbody tr:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}

.alert {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    width: 90%;
    padding: 1rem;
  }

  .table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>


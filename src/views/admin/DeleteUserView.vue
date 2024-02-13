<template>
  <div class="user-form-container">
    <div class="card">
      <h1 class="card-header">Delete User</h1>
      <form @submit.prevent="deleteUser" class="card-body">
        <div class="form-group">
          <input type="number" v-model.number="userId" placeholder="User ID" required class="form-control">
        </div>
        <button type="submit" class="btn btn-danger">Delete</button>
      </form>
    </div>
  </div>
</template>

  
  <script>
  import { ref } from 'vue';
  import { useApplicationStore } from '@/stores/application';
  
  export default {
    setup() {
      const userId = ref(0);
      const store = useApplicationStore();
  
      const deleteUser = async () => {
        const response = await fetch(`http://localhost:8080/api/admin/users/${userId.value}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${store.accessToken}`
          },
        });
        const data = await response.json();
        alert(data.message);
      };
  
      return {
        userId,
        deleteUser
      };
    },
  };
  </script>
  
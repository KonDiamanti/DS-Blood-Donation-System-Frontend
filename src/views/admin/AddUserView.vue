<template>
  <div class="user-form-container">
    <div class="card">
      <h1 class="card-header">Add User</h1>
      <form @submit.prevent="addUser" class="card-body">
        <div class="form-group">
          <input type="text" v-model="username" placeholder="Username" required class="form-control">
        </div>
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required class="form-control">
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Password" required class="form-control">
        </div>
        <div class="form-group">
          <select v-model="role" class="form-control">
            <option value="ROLE_CITIZEN">Citizen</option>
            <option value="ROLE_SECRETARY">Secretary</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>

  
  <script>
  import { ref } from 'vue';
  import { useApplicationStore } from '@/stores/application';
  
  export default {
    setup() {
      const username = ref('');
      const email = ref('');
      const password = ref('');
      const role = ref('ROLE_CITIZEN');
      const store = useApplicationStore();
  
      const addUser = async () => {
        const response = await fetch('http://localhost:8080/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.accessToken}`
          },
          body: JSON.stringify({
            username: username.value,
            email: email.value,
            password: password.value,
            roles: [role.value]
          }),
        });
        const data = await response.json();
        alert(data.message);
      };
  
      return {
        username,
        email,
        password,
        role,
        addUser
      };
    },
  };
  </script>
  <style>
  .user-form-container {
  max-width: 500px;
  margin: 20px auto;
}

.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.card-header {
  padding: 2px 16px;
  background-color: #f1f1f1;
  color: black;
}

.card-body {
  padding: 16px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #45a049;
}

.btn-primary {
  background-color: #008CBA;
}

.btn-danger {
  background-color: #f44336;
}

</style>
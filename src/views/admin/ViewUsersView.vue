<template>
  <div class="users-container">
    <!-- User List -->
    <h2>User List</h2>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    
    <div v-else>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(', ') }}</td>
            <td>
              <button @click="initiateUpdate(user)" class="btn btn-primary">Update</button>
              <button @click="promptDeleteUser(user.id)" class="btn btn-danger">Delete</button>
              <button @click="showRoleAssignmentModal(user)" class="btn btn-info">Assign Role</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
<!-- Trigger Add User Modal Button -->
<button @click="showAddUserModal = true" class="btn btn-success">Add User</button>

<!-- Add User Modal -->
<div v-if="showAddUserModal" class="modal fade show" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add New User</h5>
        <button type="button" class="close" @click="showAddUserModal = false">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addUser">
          <div class="form-group">
            <input type="text" v-model="newUser.username" placeholder="Username" required class="form-control">
          </div>
          <div class="form-group">
            <input type="email" v-model="newUser.email" placeholder="Email" required class="form-control">
          </div>
          <div class="form-group">
            <input type="password" v-model="newUser.password" placeholder="Password" required class="form-control">
          </div>
          <div class="form-group">
            <select v-model="newUser.role" class="form-control">
              <option value="ROLE_CITIZEN">Citizen</option>
              <option value="ROLE_SECRETARY">Secretary</option>
              <option value="ROLE_ADMIN">Admin</option>

            </select>
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
          <button type="button" @click="showAddUserModal = false" class="btn btn-secondary">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</div>

    <!-- Update User Modal -->
    <div v-if="showUpdateModal" class="modal fade show" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Update User</h5>
            <button type="button" class="close" @click="closeUpdateModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" v-model="currentUser.username" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="currentUser.email" class="form-control" required>
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="currentUser.password" class="form-control">
              <small class="form-text text-muted">Leave blank if you do not want to change the password.</small>
            </div>
            <button type="submit" @click="updateUser" class="btn btn-success">Save Changes</button>
            <button type="button" @click="closeUpdateModal" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Assignment Modal -->
    <div v-if="showRoleModal" class="modal fade show" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Assign New Role</h5>
            <button type="button" class="close" @click="closeRoleModal">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="assignRole">
              <div class="form-group">
                <label for="newRole">Select Role:</label>
                <select id="newRole" v-model="selectedNewRole" class="form-control">
                  <option value="ROLE_CITIZEN">Citizen</option>
                  <option value="ROLE_SECRETARY">Secretary</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Assign Role</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
<!-- Delete Confirmation Modal -->
<div v-if="showDeleteConfirmation" class="modal-overlay">
  <div class="modal-content">
    <h5 class="modal-header">Confirm Deletion</h5>
    <div class="modal-body">
      <p>Are you sure you want to delete this user?</p>
    </div>
    <div class="modal-footer">
      <button @click="confirmDeleteUser" class="btn btn-danger">Yes, Delete</button>
      <button @click="showDeleteConfirmation = false" class="btn btn-secondary">Cancel</button>
    </div>
  </div>
</div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApplicationStore } from '@/stores/application';

const store = useApplicationStore();
const users = ref([]);
const loading = ref(true);
const errorMessage = ref('');
const showUpdateModal = ref(false);
const showRoleModal = ref(false);
const currentUser = ref({});
const selectedNewRole = ref('');
const currentUserIdForRoleAssignment = ref(null);
const successMessage = ref('');
const showAddUserModal = ref(false); 
const showDeleteConfirmation = ref(false);
const userIdToDelete = ref(null);


const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_CITIZEN', 
});

// Fetch users
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8080/api/admin/users/get-all-user-details', {
      headers: {
        'Authorization': `Bearer ${store.accessToken}`
      }
    });
    if (response.ok) {
      users.value = await response.json();
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while fetching users.';
  } finally {
    loading.value = false;
  }
};

const addUser = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/admin/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`
      },
      body: JSON.stringify({
        username: newUser.value.username,
        email: newUser.value.email,
        password: newUser.value.password,
        roles: [newUser.value.role]
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add user');
    }
    const data = await response.json();
    successMessage.value = data.message || 'User added successfully!';
    showAddUserModal.value = false; 
    fetchUsers(); 
    clearSuccessMessage();
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred while adding the user.';
  }
};
const clearSuccessMessage = () => {
  setTimeout(() => {
    successMessage.value = '';
  }, 5000); 
};
const promptDeleteUser = (userId) => {
  userIdToDelete.value = userId;
  showDeleteConfirmation.value = true;
};


// Delete user 
const confirmDeleteUser = async () => {
  if (userIdToDelete.value) {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/delete/${userIdToDelete.value}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${store.accessToken}`
        },
      });
      if (response.ok) {

        successMessage.value = 'User deleted successfully!'; 
        fetchUsers(); 
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      alert(error.message || 'An error occurred while deleting the user.');
    }
  }
  showDeleteConfirmation.value = false; 
  userIdToDelete.value = null; 
};


const showRoleAssignmentModal = (user) => {
  currentUserIdForRoleAssignment.value = user.id;
  showRoleModal.value = true;
};

const closeRoleModal = () => {
  showRoleModal.value = false;
  selectedNewRole.value = '';
};

const assignRole = async () => {
  if (!selectedNewRole.value || !currentUserIdForRoleAssignment.value) {
    alert("Please select a role to assign.");
    return;
  }
    const user = users.value.find(u => u.id === currentUserIdForRoleAssignment.value);
  if (!user) {
    alert("User not found.");
    return;
  }

  if (user.roles.includes(selectedNewRole.value)) {
    alert(`This user is already a ${selectedNewRole.value.replace('ROLE_', '')}.`);
    return;
  }
  console.log('Assigning role to user ID:', currentUserIdForRoleAssignment.value);

  const rolesArray = [selectedNewRole.value];
try {
  const response = await fetch(`http://localhost:8080/api/admin/users/${currentUserIdForRoleAssignment.value}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.accessToken}`
    },
    body: JSON.stringify(rolesArray) 
  });

    if (!response.ok) {

      const textResponse = await response.text(); 
      try {
        const errorResponse = JSON.parse(textResponse);
        alert(errorResponse.message || 'Failed to assign role');
      } catch (jsonParseError) {

        alert('Failed to assign role. Response was not valid JSON.');
      }
      return;
    }
    successMessage.value = 'Role assigned successfully';
    closeRoleModal();
    fetchUsers(); 
  } catch (error) {
    alert(error.message || 'An error occurred while assigning the role.');
  }
};



//update user 
const initiateUpdate = (user) => {
  currentUser.value = {
    ...user,
    roles: user.roles.map(role => ({ name: role })) 
  };
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

const updateUser = async () => {
  try {
    const updatePayload = {
      username: currentUser.value.username,
      email: currentUser.value.email,
      ...(currentUser.value.password && { password: currentUser.value.password }),
      roles: currentUser.value.roles.map(role => role.name) 
    };

    console.log('Update payload:', JSON.stringify(updatePayload));

    const response = await fetch(`http://localhost:8080/api/admin/users/update/${currentUser.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.accessToken}`
      },
      body: JSON.stringify(updatePayload)
    });

    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update user. Status: ${response.status} - ${errorText}`);
    }
    successMessage.value = 'User updated successfully';
    closeUpdateModal();
    fetchUsers(); 
  } catch (error) {
    console.error('Exception during update:', error); 
    alert(error.message || 'An error occurred while updating the user.');
  }

};

onMounted(fetchUsers);
</script>
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  padding: 20px;
  z-index: 1051;
}

.modal-header {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.5rem;
}

.modal-body {
  margin: 20px 0;
  padding-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #eaecef;
  padding-top: 1rem;
}

.btn {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-confirm {
  background-color: #247437;
  color: white;
}

.btn-cancel, .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-confirm:hover {
  background-color: #0d3f18;
}

.btn-cancel:hover, .btn-secondary:hover {
  background-color: #545b62;
}
.btn:hover {
  color: #000; 
}

.btn-primary {
  background-color: #3988dc;
  color: white;
}

.btn-primary:hover {
  background-color: #2669b0;
}

.btn-danger {
  background-color: #cf2233;
  color: white;
}

.btn-danger:hover {
  background-color: #921c28;
}

.btn-info {
  background-color: #ea9035;
  color: white;
}

.btn-info:hover {
  background-color: #ad6925;
}

/* Additional styling for form elements inside modals */
.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* Styling for tables */
.table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.table td {
  vertical-align: top;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
  }
}

</style>

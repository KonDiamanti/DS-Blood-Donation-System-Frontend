<template>
  <div class="users-container">
    <!-- User List -->
    <h2>View Users</h2>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>
    <div v-else>
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
              <button @click="deleteUser(user.id)" class="btn btn-danger">Delete</button>
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
const showAddUserModal = ref(false); // Control the visibility of the Add User Modal
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_CITIZEN', // Default role, adjust as needed
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
      throw new Error('Failed to add user');
    }

    const data = await response.json();
    alert(data.message); // Notify user of success
    showAddUserModal.value = false; // Close modal
    fetchUsers(); // Refresh the list of users
  } catch (error) {
    alert(error.message || 'An error occurred while adding the user.');
  }
};

// Delete user 
const deleteUser = async (userId) => {
  const confirmation = confirm(`Are you sure you want to delete user ID ${userId}?`);
  if (confirmation) {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${store.accessToken}`
        },
      });
      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      alert(error.message || 'An error occurred while deleting the user.');
    }
  }
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
  console.log('Assigning role to user ID:', currentUserIdForRoleAssignment.value);

  const rolesArray = [selectedNewRole.value];
try {
  const response = await fetch(`http://localhost:8080/api/admin/users/${currentUserIdForRoleAssignment.value}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.accessToken}`
    },
    body: JSON.stringify(rolesArray) // Send the array directly
  });

    if (!response.ok) {
      // Improved error handling for non-JSON responses
      const textResponse = await response.text(); // Read response as text first
      try {
        const errorResponse = JSON.parse(textResponse); // Try to parse text as JSON
        alert(errorResponse.message || 'Failed to assign role');
      } catch (jsonParseError) {
        // Handle cases where response is not JSON
        alert('Failed to assign role. Response was not valid JSON.');
      }
      return;
    }

    alert('Role assigned successfully');
    closeRoleModal();
    fetchUsers(); // Refresh the user list to reflect the role change
  } catch (error) {
    alert(error.message || 'An error occurred while assigning the role.');
  }
};



//update user 
const initiateUpdate = (user) => {
  currentUser.value = {
    ...user,
    roles: user.roles.map(role => ({ name: role })) // Adjust this line to fit the actual structure of your user.roles
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
      roles: currentUser.value.roles.map(role => role.name) // Assuming the roles are stored as objects with 'name' property in currentUser.roles
    };

    console.log('Update payload:', JSON.stringify(updatePayload)); // Log payload for debugging

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
      console.error('Update failed:', errorText); // Log error for debugging
      alert(`Failed to update user. Status: ${response.status} - ${errorText}`);
      return;
    }

    alert('User updated successfully');
    closeUpdateModal();
    fetchUsers(); // Refresh the user list
  } catch (error) {
    console.error('Exception during update:', error); 
    alert(error.message || 'An error occurred while updating the user.');
  }
};



onMounted(fetchUsers);
</script>

<template>
  <header class="bg-dark text-white">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Blood Donation System</a>
        <img :src="logo" alt="Logo" style="width: 50px; height: auto;" />

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Home</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link to="/register" class="nav-link">Register as Citizen</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link :to="{ name: 'login', query: { type: 'citizen' } }" class="nav-link">Login as Citizen</router-link>
            </li>
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link :to="{ name: 'login', query: { type: 'secretary' } }" class="nav-link">Login as Secretary</router-link>
            </li>
            <!-- Specific links for citizens -->
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/form" class="nav-link">Apply for Donation</router-link>
            </li>
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/my-applications" class="nav-link">My Applications</router-link>
            </li>
            <li v-if="isAuthenticated && userRole === 'ROLE_CITIZEN'" class="nav-item">
              <router-link to="/profile" class="nav-link">My Profile</router-link>
            </li>


            <!-- Specific links for secretaries -->
            <li v-if="isAuthenticated && userRole === 'ROLE_SECRETARY'" class="nav-item">
              <router-link to="/applications" class="nav-link">Manage Applications</router-link>
            </li>


            <!-- Specific links for admins -->

            <li v-if="isAuthenticated && userRole === 'ROLE_ADMIN'" class="nav-item">
            <router-link to="/admin/users-container" class="nav-link">View Users</router-link>
            </li>
            <!-- Common logout link for authenticated users -->
            <li v-if="isAuthenticated" class="nav-item">
              <a class="nav-link" href="#" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application';
import logo from '@/components/icons/logo.png'; // Adjust this path according to your project structure

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const store = useApplicationStore();
    const isAuthenticated = computed(() => store.isAuthenticated);
    const userRole = computed(() => store.userRole);

    const logout = async () => {
      store.clearUserData();
      await router.push({ name: 'home' });
    };

    return { isAuthenticated, userRole, logout, logo }; // Include logo here
  },
});
</script>
<style>
/* General Styles */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f4f4;
  color: #333;
  line-height: 1.6;
}

.container {
  width: 80%;
  margin: auto;
  overflow: hidden;
}

header {
  background: #b71c1c;
  color: #ffffff;
  padding: 30px 0;
  text-align: center;
  border-bottom: #f7f7f7 3px solid;
}

header a {
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 16px;
}

header ul {
  padding: 0;
  list-style: none;
}

header li {
  display: inline;
  padding: 0 20px;
}

header #branding {
  display: inline-block;
}

header #branding h1 {
  margin: 0;
}

header nav {
  display: inline-block;
  margin: 0 auto;
}

header .highlight, header .current a {
  color: #e91e63;
  font-weight: bold;
}

header a:hover {
  color: #ffffff;
  font-weight: bold;
}

/* Showcase */
#showcase {
  min-height: 400px;
  background: url('@/components/icons/background.png') no-repeat 0 -400px;
  text-align: center;
  color: #ffffff;
}

#showcase h1 {
  margin-top: 100px;
  font-size: 55px;
  margin-bottom: 10px;
}

#showcase p {
  font-size: 20px;
}

/* Newsletter */
#newsletter {
  padding: 15px;
  color: #ffffff;
  background: #b71c1c;
}

#newsletter h1 {
  float: left;
}

#newsletter form {
  float: right;
  margin-top: 15px;
}

#newsletter input[type="email"] {
  padding: 4px;
  height: 25px;
  width: 250px;
}

/* Boxes */
#boxes {
  margin-top: 20px;
}

#boxes .box {
  float: left;
  text-align: center;
  width: 30%;
  padding: 10px;
}

#boxes .box img {
  width: 90px;
}

/* Sidebar */
aside#sidebar {
  float: right;
  width: 30%;
  margin-top: 10px;
}

aside#sidebar .quote input, aside#sidebar .quote textarea {
  width: 90%;
  padding: 5px;
}

/* Main-col */
article#main-col {
  float: left;
  width: 65%;
}

/* Services */
ul#services li {
  list-style: none;
  padding: 20px;
  border: #cccccc solid 1px;
  margin-bottom: 5px;
  background: #e8e8e8;
}

/* Footer */
footer {
  padding: 20px;
  margin-top: 20px;
  color: #ffffff;
  background-color: #e91e63;
  text-align: center;
}

footer p {
  margin: 0;
}

/* Media Queries */
@media(max-width: 768px) {
  header #branding,
  header nav,
  header nav li,
  #newsletter h1,
  #newsletter form,
  #boxes .box,
  article#main-col,
  aside#sidebar {
    float: none;
    text-align: center;
    width: 100%;
  }

  header {
    padding-bottom: 20px;
  }
}

</style>

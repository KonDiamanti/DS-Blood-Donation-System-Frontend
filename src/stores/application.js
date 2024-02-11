import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useApplicationStore = defineStore('application', () => {
  const userData = ref(null);

  // Function to check the validity of the JWT token
  function checkJWT(token) {
    try {
      if (!token) {
        return false;
      }
      const base64Url = token.split('.')[1];
      if (!base64Url) return false;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime < payload.exp;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
  const userRole = computed(() => userData.value?.roles?.[0]);
  // Function to set user data and store it in local storage
const setUserData = (tempUserData) => {
  console.log('Setting user data:', tempUserData);
  userData.value = tempUserData;
  localStorage.setItem('userData', JSON.stringify(userData.value));
  console.log('After setting, userData:', userData.value);
};


  // Function to load user data from local storage
  const loadUserData = () => {
    const tempUserData = localStorage.getItem('userData');
    if (tempUserData) {
      userData.value = JSON.parse(tempUserData);
      console.log('Loaded user data from local storage:', userData.value);
    }
  };

  // Function to clear user data and remove it from local storage
  const clearUserData = () => {
    console.log('Clearing user data');
    localStorage.removeItem('userData');
    userData.value = null;
  };

  // Computed property to check if the user is authenticated
  const isAuthenticated = computed(() => {
    const token = userData.value?.accessToken;
    console.log('Current token:', token);
    return token && checkJWT(token);
  });
  const accessToken = computed(() => userData.value?.accessToken);
  // Load user data from local storage when the store is initialized
  loadUserData();

  return {
    userData,
    isAuthenticated,
    userRole,
    setUserData,
    loadUserData,
    clearUserData,
    accessToken
  };
});

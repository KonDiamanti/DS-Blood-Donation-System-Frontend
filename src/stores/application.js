import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const checkJWT = (token) => {
  console.log('Validating token:', token);
  try {
    if (!token) {
      console.log('Token is not available.');
      return false;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < payload.exp;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const useApplicationStore = defineStore('application', () => {
  const userData = ref(null);

  const userRole = computed(() => userData.value?.roles?.[0]);

  const setUserData = (tempUserData) => {
    console.log('Setting user data:', tempUserData);
    userData.value = tempUserData;
    sessionStorage.setItem('userData', JSON.stringify(userData.value));
    console.log('After setting, userData:', userData.value);
  };


  const loadUserData = () => {
    const sessionData = sessionStorage.getItem('userData');
    if (sessionData) {
      userData.value = JSON.parse(sessionData);
    }
  };

  const clearUserData = () => {
    sessionStorage.removeItem('userData');
    userData.value = null;
  };

  // Computed property to check if the user is authenticated
  const isAuthenticated = computed(() => {
    const token = userData.value?.accessToken;
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
    accessToken,
    checkJWT
  };
});

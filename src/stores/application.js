import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

function checkJWT(token) {
    try {
      if (!token) {
        return false;
      }
      const base64Url = token.split('.')[1];
      if (!base64Url) return false;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime < payload.exp;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
  

export const useApplicationStore = defineStore('application', () => {
    const userData = ref(null);
    const userRole = computed(() => {
        return userData.value?.roles?.[0]; // Taking the first role as the user's primary role
      });
    // Actions to manage userData
    const setUserData = (tempUserData) => {
        userData.value = tempUserData;
        persistUserData();
    };
    const persistUserData = () => {
        localStorage.setItem('userData', JSON.stringify(userData.value));
    };
    const loadUserData = () => {
        let tempUserData = localStorage.getItem('userData');
        tempUserData = JSON.parse(tempUserData);
        if (tempUserData === null || tempUserData === undefined) {
            return;
        }
        userData.value = tempUserData;
    };
    const clearUserData = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('token'); // Clear the token from localStorage as well
        userData.value = null;
      };
    const isAuthenticated = computed(() => {
        const token = userData.value?.accessToken || localStorage.getItem('token');
        // Assuming you store the token in localStorage and have a function to validate it
        return token && checkJWT(token);
    });


    return { userData, setUserData, persistUserData, loadUserData, clearUserData, isAuthenticated,userRole };
});
<script setup>
import { onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();
const { loadUserData } = useApplicationStore();

onBeforeMount(() => {
  // Load user data here
  loadUserData();
});

onMounted(() => {
  const handleKeyDown = (event) => {
    console.log(event); // To confirm the event is captured
    // Check for Ctrl+Alt and the physical 'A' key, regardless of keyboard layout
    if (event.ctrlKey && event.altKey && event.code === 'KeyA') {
      router.push({ name: 'AdminLogin' });
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});


</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

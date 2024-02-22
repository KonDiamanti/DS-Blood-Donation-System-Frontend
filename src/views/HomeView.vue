<template>
  <div class="home-background">
    <!-- Your existing content, if any, goes here -->
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  // Your script options go here
};
</script>

<style scoped>
.home-background {
  background-image: url('@/components/icons/background.png');
  background-size: cover;
  background-position: center;
  height: 100vh; /* Set to the height you want for your background */
  width: 100%;
}
</style>

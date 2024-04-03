<template>
  <HomeView />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomeView from "./components/HomeView.vue";

export default defineComponent({
  name: "App",
  components: {
    HomeView,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

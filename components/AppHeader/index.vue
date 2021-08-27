<template>
  <header class="app-header">
    <img
      @click="redirectToHome"
      class="app-header-logo"
      src="~/assets/images/truecaller.svg"
      alt="truecaller-logo"
    />
  </header>
</template>

<script>
export default {
  methods: {
    redirectToHome() {
      // If user is NOT on landing page
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>

<template>
  <header class="app-header">
    <img @click="redirectToHome" class="app-header-logo" src="~/assets/images/truecaller.svg" alt="truecaller-logo" />
  </header>
</template>

<script>
export default {
  methods: {
    redirectToHome() {
      if (this.$route.path !== "/") {
        this.$router.push("/");
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header {
    height: 80px;
    width: 100%;
    display: flex;
    background-color: #ffffff;
    align-items: center;
    padding: 0 2rem;
    position: fixed;
    z-index: 1;
    > .app-header-logo {
      height: 2em;
      cursor: pointer;
    }
  }
</style>

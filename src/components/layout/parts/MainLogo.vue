<template>
  <a class="logo" @click="goMain">
    <img
      :src="localConfig.logo ? localConfig.logo : '/public/img/logo_big.png'"
    />
  </a>
</template>
<script>
export default {
  name: "MainLogo",
  data() {
    return {
      appLanguage: "en",
    };
  },
  beforeMount() {
    const lang = localStorage.getItem("planguage");
    if (lang) {
      this.appLanguage = lang;
    }
  },
  methods: {
    goMain() {
      window.location.replace(`/`);
    },
  },
};
</script>
<style lang="scss" scoped>
.logo {
  position: relative;
  max-height: 100px;

  img {
    max-height: inherit;
  }

  &__text {
    position: absolute;
    top: -13px;
    right: -17px;
    color: #008766;
    border: 2px solid #008766;
    border-radius: 3px;
    padding: 0 3px;
    font-size: 13px;
    font-weight: 600;
    background-color: #1b293d;
  }
}
</style>

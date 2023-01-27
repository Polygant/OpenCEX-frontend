<template>
  <div>
    <div v-if="showerror" class="logIn pb-5">
      <MainLogo />
      <div class="logIn__title">{{ $t("common.wrongtoken") }}</div>
    </div>
  </div>
</template>

<script>
import MainLogo from "~/components/layout/parts/MainLogo.vue";

export default {
  name: "UserActivationUrl",
  components: { MainLogo },
  // eslint-disable-next-line vue/require-prop-types
  props: ["token"],
  data() {
    return {
      showerror: false,
    };
  },
  mounted() {
    this.$http
      .post("auth/registration/verify-email/", {
        key: this.token,
      })
      .then(
        () => {
          this.showerror = false;
          localStorage.setItem("justactivate", true);
          this.$router.push("/login");
        },
        () => {
          this.showerror = true;
        }
      );
  },
};
</script>

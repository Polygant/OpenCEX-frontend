<template>
  <div
    class="logIn pb-5 reset-password"
    :style="loginBackground ? `background: ${loginBackground} !important` : {}"
  >
    <MainLogo />
    <template v-if="!showBanner">
      <div class="logIn__title">
        {{ $t("common.passwordrecovery") }}
      </div>
      <form
        class="logIn__form"
        novalidate
        @submit.prevent="
          {
            pass1, pass2;
          }
        "
      >
        <input
          v-model="pass1"
          :class="{ 'input-has-error': errorspassword1 }"
          class="logIn__form__input"
          type="password"
          placeholder="Password"
        />
        <p class="text-danger">
          {{ warningText }}
        </p>
        <input
          v-model="pass2"
          :class="{ 'input-has-error': errorspassword2 }"
          class="logIn__form__input"
          type="password"
          placeholder="Confirm password"
        />
        <input
          style=""
          class="reset-password__button logIn__form__input logIn__form__input_button opacitychangebtn"
          :style="mainColor ? `background: ${mainColor} !important` : {}"
          type="submit"
          :value="$t('common.change')"
          @click="resetPassword"
        />
      </form>
    </template>
    <template v-else>
      <div class="logIn__title">
        {{ $t("common.saveError") }}. {{ $t("common.err") }}
      </div>
    </template>
  </div>
</template>

<script>
import MainLogo from "~/components/layout/parts/MainLogo.vue";

export default {
  name: "UserResetUrl",
  components: { MainLogo },
  // eslint-disable-next-line vue/require-prop-types
  props: ["uid", "token"],
  data() {
    return {
      user_id: this.uid,
      user_token: this.token,
      showBanner: false,
      pass1: "",
      pass2: "",
      errorspassword1: false,
      errorspassword2: false,
      warningText: "",
    };
  },
  methods: {
    validateData() {
      let self = this;
      let f = 0;
      if (this.pass1.length < 6) {
        this.warningText = self.$t("common.min_password");
        this.errorspassword1 = true;
        f = f + 1;
      } else {
        this.errorspassword1 = false;
        this.warningText = "";
      }

      if (this.pass2 !== this.pass1) {
        this.errorspassword2 = true;
        this.warningText = self.$t("common.passwords_not_equal");
        f = f + 1;
      } else if (this.pass1.length < 6) {
        this.errorspassword2 = true;
        this.warningText = self.$t("common.min_password");
        this.errorspassword = true;
        f = f + 1;
      } else {
        this.warningText = "";
        this.errorspassword2 = false;
      }

      return f === 0;
    },
    resetPassword() {
      if (this.validateData()) {
        this.$http
          .post("auth/password/reset/confirm/", {
            uid: this.user_id,
            token: this.user_token,
            new_password1: this.pass1,
            new_password2: this.pass2,
          })
          .then(
            () => {
              this.showBanner = false;
              localStorage.setItem("resetpass", true);
              this.$router.push("/login");
            },
            () => {
              this.showBanner = true;
            }
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.reset-password {
  &__button {
    cursor: pointer;
    color: #fff;

    &:active {
      opacity: 0.8 !important;
    }
  }
}

.text-danger {
  width: 268px;
}
</style>

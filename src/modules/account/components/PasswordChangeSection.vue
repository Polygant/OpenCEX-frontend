<template>
  <div class="walletlist" style="width: 100%; height: 500px; margin-bottom: 0">
    <div v-if="passChangeFormStatus === 'pending'">
      <div class="settings__NAME">{{ $t("common.passchange") }}</div>
      <form
        class="logIn__form"
        style
        action
        novalidate
        autocomplete="off"
        @submit.prevent="
          {
            pass1, pass2, oldpass;
          }
        "
      >
        <label class="changePassword__field">
          {{ $t("common.oldpass") }}
        </label>
        <input
          v-model="oldpass"
          :class="{ 'input-has-error': errorspasswordold }"
          class="changePassword__input"
          autocomplete="new-password"
          type="password"
        />
        <label class="changePassword__field">
          {{ $t("common.newpass") }}
        </label>
        <input
          v-model="pass1"
          :class="{ 'input-has-error': errorspassword1 }"
          class="changePassword__input"
          autocomplete="new-password"
          type="password"
        />
        <label class="changePassword__field">
          {{ $t("common.confirmnewpass") }}
        </label>
        <input
          v-model="pass2"
          :class="{ 'input-has-error': errorspassword2 }"
          class="changePassword__input"
          autocomplete="new-password"
          type="password"
        />
        <p
          class="text-danger"
          style="
            margin-bottom: 0;
            height: 14px;
            font-size: 14px;
            width: 70%;
            margin-left: auto;
            margin-right: auto;
          "
        >
          {{ dangerTextPass6 }}
        </p>
        <button
          style="
            background-color: var(--theme-primary-color);
            margin-top: 20px;
            cursor: pointer;
            color: #ffffff;
            width: 175px;
            margin-left: auto;
            margin-right: auto;
          "
          :disabled="changePassPending"
          class="logIn__form__input logIn__form__input_button opacitychangebtn"
          :style="mainColor ? `background: ${mainColor} !important` : {}"
          type="submit"
          @click="changePassword(false)"
        >
          {{ changePassPending ? "..." : $t("common.change") }}
          <div
            id="loaderchangepass"
            class="loaderFiat2fa"
            style="margin: auto; display: none"
          ></div>
        </button>
      </form>
    </div>
    <div v-if="passChangeFormStatus === '2fa'">
      <div class="settings__NAME">{{ $t("common.passchange") }}</div>
      <form
        class="logIn__form"
        style
        action
        novalidate
        @submit.prevent="
          {
            passchangeGoogleCode;
          }
        "
      >
        <div
          class="logIn__descr mb-2"
          style="margin-top: 60px; text-align: center"
        >
          {{ $t("common.entergooglecode") }}
        </div>
        <input
          v-model="passchangeGoogleCode"
          :class="{ 'input-has-error': errorspasschangeGoogleCode }"
          placeholder="X X X  X X X"
          class="secretclass1 m-0"
          type="text"
          style="
            margin-top: 60px;
            height: 70px;
            text-align: center;
            max-width: 491px;
            -webkit-box-shadow: 0px 0px 20px 1px #d8d8d8 inset;
            box-shadow: 0px 0px 20px 1px #d8d8d8 inset;
            color: #313948;
            font-weight: 600;
            font-size: 33px;
            background-color: #f3f3f3;
            border-radius: 6px;
          "
        />
        <p
          id="dangertextpassgcode"
          class="text-danger"
          style="margin-top: 20px; text-align: center; height: 24px"
        ></p>
        <button
          style="
            background-color: var(--theme-primary-color);
            margin-top: 20px;
            cursor: pointer;
            color: #ffffff;
            width: 175px;
            margin-left: auto;
            margin-right: auto;
          "
          :disabled="changePassPending"
          class="logIn__form__input logIn__form__input_button opacitychangebtn"
          :style="mainColor ? `background: ${mainColor} !important` : {}"
          type="submit"
          @click="changePassword(true)"
        >
          {{ changePassPending ? "..." : $t("common.change") }}
          <div
            id="loaderchangepassgcode"
            class="loaderFiat2fa"
            style="margin: auto; display: none"
          ></div>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import errorManager from "~/helpers/errorHundle";

export default {
  name: "PasswordChangeSection",
  data() {
    return {
      passChangeFormStatus: "pending",
      pass1: "",
      pass2: "",
      oldpass: "",
      errorspassword1: false,
      errorspassword2: false,
      errorspasswordold: false,
      changePassPending: false,
      passchangeGoogleCode: "",
      errorspasschangeGoogleCode: "",
      dangerTextPass6: "",
    };
  },
  methods: {
    changePassword(twoFa) {
      let self = this;

      if (twoFa || this.validateData()) {
        self.changePassPending = true;
        this.$http
          .post("auth/password/change/", {
            new_password1: this.pass1,
            new_password2: this.pass2,
            old_password: this.oldpass,
            googlecode: twoFa ? this.passchangeGoogleCode : undefined,
          })
          .then(
            () => {
              setTimeout(function () {
                self.changePassPending = false;
              }, 500);
              self.pass1 = "";
              self.pass2 = "";
              self.oldpass = "";
              self.passchangeGoogleCode = "";
              self.passChangeFormStatus = "pending";
              this.dangerTextPass6 = "";
              setTimeout(() => {
                this.$notify({
                  type: "success",
                  title: ``,
                  text: `
                    ${this.$t("common.settingsModalPassChange1")}
                    ${this.$t("common.settingsModalPassChange2")}
                  `,
                });
              }, 400);
            },
            (r) => {
              setTimeout(function () {
                self.changePassPending = false;
              }, 500);
              if (r.data.old_password.msg.code === "invalid")
                this.$notify({
                  type: "error",
                  text: this.$t("common.wrong_old_password"),
                });
              if ("type" in r.data) {
                errorManager.parse(r, this, ["pwd_change_2fa_failed"]);
              } else {
                this.dangerTextPass6 = self.$t("common.error");
              }
            }
          );
      }
    },

    validateData() {
      let f = 0;
      if (this.pass1.length < 6) {
        this.dangerTextPass6 = this.$t("common.min_password");
        this.errorspassword1 = true;
        f = f + 1;
      } else {
        this.errorspassword1 = false;
        this.dangerTextPass6 = "";
      }

      if (this.pass2 !== this.pass1) {
        this.errorspassword2 = true;
        this.dangerTextPass6 = this.$t("common.passwords_not_equal");
        f = f + 1;
      } else if (this.pass1.length < 6) {
        this.errorspassword2 = true;
        this.dangerTextPass6 = this.$t("common.min_password");
        f = f + 1;
      } else {
        this.errorspassword2 = false;
      }

      return f === 0;
    },
  },
};
</script>

<style scoped>
.logIn__form {
  width: 70%;
  margin: 0 auto;
}

.changePassword__field {
  width: 100%;
  text-align: left;
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 20px;
}

.changePassword__input {
  width: 100%;
  height: 40px !important;
}
</style>

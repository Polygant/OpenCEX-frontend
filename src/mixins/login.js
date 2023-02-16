import { app } from "../main";
import errorManager from "~/helpers/errorHundle";
import InfoModal from "~/components/modals/InfoModal.vue";

export default {
  data() {
    return {
      username: "",
      usernameFixed: false,
      password: "",
      errorspassword: 0,
      errorsemail: 0,
      showGoogleCodeInput: false,
      googlecode: "",
      errtext: "",
      captchaIsON: false,
      showPassword: false,
      dangertext: {},
      isLoading: false,
      captcha: "",
    };
  },
  computed: {
    isInvalidFaCode() {
      return this.googlecode.length !== 6;
    },
  },
  methods: {
    handleCaptcha(captchaString) {
      this.captcha = captchaString;
    },
    formatGoogleCode() {
      this.googlecode = this.googlecode.replace(/\D/g, "");
    },
    whatSiteKey() {
      return this.localConfig.vue_v;
    },
    onExpired() {
      this.$refs.recaptcha.reset();
    },
    checkProfile() {
      this.$store
        .dispatch("core/getProfile")
        .then(this.processLoginRedirect, (e) => {
          console.error(e);
        });
    },
    processLoginRedirect(data) {
      const redirectFullpath = this.$route.query.redirectFrom;
      const userSelectedInterface = data.interface;
      if (userSelectedInterface === null) {
        this.$router.push("/interface-select");
      } else if (redirectFullpath) {
        window.location.replace("account" + redirectFullpath);
      } else {
        window.location.replace("account/trade/BTC-USDT");
      }
    },
    enterGoogleCode(captcha) {
      if (this.isInvalidFaCode) {
        setTimeout(() => {
          this.errtext = this.$t("common.invalid_code");
        }, 300);
        return;
      }

      this.errtext = "";

      let data = {
        username: this.username,
        password: this.password,
        googlecode: this.googlecode,
      };

      if (captcha) {
        data["captcha"] = captcha;
      }
      app.config.globalProperties.$http
        .post("auth/login/", data)
        .then((response) => {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          localStorage.removeItem("show_security_notice");
          this.$store.dispatch("core/loginSuccess");
          this.checkProfile();
        })
        .catch(this.parseLoginError)
        .finally(this.resetAndShowCaptcha);
    },
    validateForm() {
      let f = 0;
      if (!this.password.length) {
        this.errorspassword = true;
        f = f + 1;
      } else {
        this.errorspassword = false;
      }

      if (!this.username.length) {
        this.errorsemail = true;
        f = f + 1;
      } else {
        this.errorsemail = false;
      }
      if (f === 0) {
        return true;
      } else {
        return false;
      }
    },
    validateData() {
      return this.validateForm();
    },
    parseLoginError(r) {
      if (r.status === 500) {
        this.dangertext["wrong_data"] = this.$t("common.wrong_data");
        this.$notify({
          type: "error",
          title: ``,
          text: this.$t("common.wrong_data"),
        });
      } else {
        errorManager.parse(r, this, [
          "wrong_data",
          "wrong_captcha",
          "bad_captcha",
          "email_not_verified",
          "2fa_failed",
          "wrong_2fa_many_times",
        ]);
      }
      this.resetAndShowCaptcha();
    },
    handleLogin() {
      if (this.validateData()) {
        let config = {
          username: this.username,
          password: this.password,
          captcha: this.captcha,
        };
        this.isLoading = true;
        app.config.globalProperties.$http
          .post("auth/login/", config)
          .then((response) => {
            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("refresh_token", response.data.refresh_token);
            localStorage.removeItem("show_security_notice");
            this.$store.dispatch("core/loginSuccess");
            this.checkProfile();
          })
          .catch(this.parseLoginError)
          .finally(() => {
            this.resetAndShowCaptcha;
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          });
      }
    },
    resetAndShowCaptcha() {
      if (this.$refs.recaptcha) {
        this.$refs.recaptcha.reset();
      }
    },
    on2FATooManyTimes() {
      this.$modal.show(InfoModal, {
        notification: {
          title: this.$t("common.notification"),
          text: this.$t("common.wrong_2fa_code_multiple_times"),
        },

        callback: () => {
          this.googlecode = "";
          this.showGoogleCodeInput = false;
          this.dangertext = {};
          this.username = "";
          this.password = "";
        },

        buttonText: this.$t("common.continue"),
      });
    },
  },
};

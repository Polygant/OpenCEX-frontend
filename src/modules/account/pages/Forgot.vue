<template>
  <div
    class="auth forgot-password logIn pb-5"
    :style="loginBackground ? `background: ${loginBackground} !important` : {}"
  >
    <ModalPagesHeader />
    <div class="flex flex-col white mt-5">
      <template v-if="!showBanner">
        <div
          class="logIn__title"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.passwordrecovery") }}
        </div>
        <form
          v-if="formstatus === 'pending'"
          class="logIn__form"
          @submit.prevent
        >
          <input
            v-model="username"
            v-pattern:email
            required
            :class="{ 'input-has-error': errorsemail }"
            class="logIn__form__input"
            type="text"
            placeholder="Email"
            style="margin-bottom: 1rem"
          />
          <div class="pb-3">
            <!--CAPTCHA-->
            <vue-recaptcha
              ref="recaptcha"
              :sitekey="localConfig.recaptcha_site_key"
              @verify="handleRecoveryCaptcha(false, $event)"
              @expired="onExpired"
            ></vue-recaptcha>
            <!--CAPTCHA-->
          </div>
          <p class="text-danger">{{ dangertext }}</p>
          <input
            id="mainbtn"
            class="forgot-password__button logIn__form__input logIn__form__input_button"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            type="submit"
            :value="$t('common.continue')"
            @click="handleRecovery"
          />
          <input
            class="forgot-password__button forgot-password__button_red logIn__form__input logIn__form__input_button"
            :style="secondColor ? `background: ${secondColor} !important` : {}"
            type="button"
            :value="$t('common.back_to_login')"
            @click="$router.push({ name: 'login' })"
          />
        </form>
        <!--2fa-->
        <form
          v-if="formstatus === '2fa'"
          class="logIn__form"
          novalidate
          @submit.prevent
        >
          <div class="logIn__descr mb-2" style="text-align: center">
            {{ $t("common.entergooglecode") }}
          </div>
          <input
            v-model="secretkeyToDisable"
            placeholder="XXXXXX"
            class="secretclass1 m-0"
            type="text"
          />
          <p class="text-danger text-danger--2fa">{{ dangertext2fa }}</p>
          <input
            id="mainbtn1"
            class="forgot-password__button logIn__form__input logIn__form__input_button"
            :style="secondColor ? `background: ${secondColor} !important` : {}"
            type="submit"
            :value="$t('common.continue')"
            @click="() => handleRecovery(true)"
          />
          <input
            class="forgot-password__button forgot-password__button_red logIn__form__input logIn__form__input_button"
            :style="secondColor ? `background: ${secondColor} !important` : {}"
            type="button"
            :value="$t('common.back_to_login')"
            @click="$router.push({ name: 'login' })"
          />
        </form>
        <br />
        <div>{{ $t("common.freeze") }}</div>
        <!--end 2fa-->
      </template>
      <template v-else>
        <div class="logIn__title">
          {{ $t("common.passwordrecovery") }}
        </div>
        <div class="logIn__form">
          <div class="logIn__popup logIn__popup_white-checkmark mb-5">
            {{ $t("common.emailins") }}
          </div>
        </div>
        <input
          class="forgot-password__button forgot-password__button_red logIn__form__input logIn__form__input_button"
          :style="secondColor ? `background: ${secondColor} !important` : {}"
          type="button"
          :value="$t('common.back_to_login')"
          @click="$router.push({ name: 'login' })"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ModalPagesHeader from "~/components/layout/ModalPagesHeader.vue";
import { VueRecaptcha } from "vue-recaptcha";

export default {
  name: "ForgotPassword",
  components: { ModalPagesHeader, VueRecaptcha },
  metaInfo() {
    return {
      title: this.$t("pages.titles.forgot"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.forgotDescription"
          )}`,
        },
      ],
    };
  },
  data() {
    return {
      username: "",
      errorsemail: false,
      showBanner: false,
      formstatus: "pending",
      secretkeyToDisable: "",
      captchaIsON: true,
      dangertext2fa: "",
      dangertext: "",
      is2Fa: "",
      captcha: "",
    };
  },
  beforeCreate: function () {
    if (localStorage.getItem("token")) {
      this.$router.push("/trade/BTC-USDT");
    }
  },
  methods: {
    validateData() {
      let f = 0;

      if (!this.username.length) {
        this.errorsemail = true;
        f = f + 1;
      } else {
        this.errorsemail = false;
      }

      return f === 0;
    },
    handleRecoveryCaptcha(is2FA, captcha) {
      this.is2Fa = is2FA;
      this.captcha = captcha;
    },
    handleRecovery() {
      let dangerTextProp = this.is2FA ? "dangertext2fa" : "dangertext";

      if (this.validateData()) {
        let data = {
          email: this.username,
          lang: localStorage.getItem("planguage") || "en",
        };
        if (this.is2FA) data.googlecode = this.secretkeyToDisable;
        if (this.captchaIsON) {
          data["captcha"] = this.captcha;
        }
        this.$http
          .post("auth/password/reset/", data)
          .then(
            () => {
              this[dangerTextProp] = "";
              this.showBanner = true;
            },
            (r) => {
              const self = this;

              this.showBanner = false;
              if (r.status === 400) {
                this[dangerTextProp] = "";
                setTimeout(function () {
                  this[dangerTextProp] = self.$t("common.wrong_data");
                }, 500);
              } else if (r.data["detail"]) {
                if (r.data["detail"] === "2fa failed") {
                  this[dangerTextProp] = "";
                  if (!this.is2FA)
                    setTimeout(function () {
                      this[dangerTextProp] = self.$t("common.invalid_code");
                    }, 400);
                  else this.formstatus = "2fa";
                }
              } else if (!this.is2FA) {
                this[dangerTextProp] = "";
                this.showBanner = true;
              }
            }
          )
          .catch(() => {
            this.resetAndShowCaptcha();
          });
      }
    },
    onExpired() {
      this.$refs.recaptcha.reset();
    },
    whatSiteKey() {
      return this.localConfig.vue_v;
    },
    resetAndShowCaptcha() {
      if (this.$refs.recaptcha) {
        this.$refs.recaptcha.reset();
      }
      this.captchaIsON = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.text-danger {
  width: 268px;

  &--2fa {
    margin-top: 20px;
  }
}

.forgot-password {
  &__button {
    cursor: pointer;
    &:active {
      opacity: 0.8 !important;
    }
    &_red {
      &,
      &:hover {
        background: #d84f4f !important;
        color: white;
      }
    }
  }
}

.logIn__form__input {
  width: 100%;
}
</style>

<template>
  <div class="auth">
    <div
      v-if="!showGoogleCodeInput"
      class="logIn pb-5"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <ModalPagesHeader />
      <div class="flex box white flex-col" :class="{ isBlur: isLoading }">
        <div
          class="logIn__title"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.login") }}
        </div>
        <div
          v-if="!usernameFixed"
          class="logIn__descr"
          style="max-width: 302px"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.useemail") }}
        </div>
        <div
          v-else
          class="logIn__descr"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.enterPass") }}
          <p class="mb-4">
            {{ username }}
            <span class="change" @click="goTo1Step"
              >{{ $t("common.change") }}
            </span>
          </p>
        </div>
        <form class="logIn__form" @submit.prevent>
          <template v-if="!usernameFixed">
            <input
              id="emailinp"
              ref="username"
              v-model="username"
              v-pattern:email
              type="text"
              name="usname"
              :class="{ 'input-has-error': errorsemail }"
              class="logIn__form__input"
              placeholder="Email"
            />
          </template>
          <div class="input-group mb-4 border-1 relative">
            <input
              id="passinp"
              ref="passwordInput"
              v-model="password"
              class="form-control logIn__form__input border-0"
              :class="{ 'input-has-error': errorspassword }"
              :type="showPassword ? 'text' : 'password'"
              name="pass"
              placeholder="Password"
            />
            <div
              class="input-group-append absolute"
              style="top: 6px; right: 4px"
            >
              <button
                class="btn border-0 show-password-icon-btn"
                type="button"
                @click="showPassword = !showPassword"
              >
                <svg
                  v-show="!showPassword"
                  class="show-password-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M555 1335l78-141q-87-63-136-159t-49-203q0-121 61-225-229 117-381 353 167 258 427 375zm389-759q0-20-14-34t-34-14q-125 0-214.5 89.5t-89.5 214.5q0 20 14 34t34 14 34-14 14-34q0-86 61-147t147-61q20 0 34-14t14-34zm363-191q0 7-1 9-106 189-316 567t-315 566l-49 89q-10 16-28 16-12 0-134-70-16-10-16-28 0-12 44-87-143-65-263.5-173t-208.5-245q-20-31-20-69t20-69q153-235 380-371t496-136q89 0 180 17l54-97q10-16 28-16 5 0 18 6t31 15.5 33 18.5 31.5 18.5 19.5 11.5q16 10 16 27zm37 447q0 139-79 253.5t-209 164.5l280-502q8 45 8 84zm448 128q0 35-20 69-39 64-109 145-150 172-347.5 267t-419.5 95l74-132q212-18 392.5-137t301.5-307q-115-179-282-294l63-112q95 64 182.5 153t144.5 184q20 34 20 69z"
                  />
                </svg>
                <svg
                  v-show="showPassword"
                  class="show-password-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1664 960q-152-236-381-353 61 104 61 225 0 185-131.5 316.5t-316.5 131.5-316.5-131.5-131.5-316.5q0-121 61-225-229 117-381 353 133 205 333.5 326.5t434.5 121.5 434.5-121.5 333.5-326.5zm-720-384q0-20-14-34t-34-14q-125 0-214.5 89.5t-89.5 214.5q0 20 14 34t34 14 34-14 14-34q0-86 61-147t147-61q20 0 34-14t14-34zm848 384q0 34-20 69-140 230-376.5 368.5t-499.5 138.5-499.5-139-376.5-368q-20-35-20-69t20-69q140-229 376.5-368t499.5-139 499.5 139 376.5 368q20 35 20 69z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <!--CAPTCHA-->
          <div class="mb-3">
            <vue-recaptcha
              v-show="usernameFixed"
              ref="recaptcha"
              :sitekey="localConfig.recaptcha_site_key"
              style="display: table"
              @verify="handleCaptcha"
              @expired="onExpired"
            ></vue-recaptcha>
          </div>
          <!--CAPTCHA-->
          <p
            v-for="(text, id) in getFilteredDangerText"
            :key="id"
            class="text-danger"
            style="width: 304px"
          >
            {{ text }}
          </p>
          <div class="text-center">
            <input
              id="loginbtn"
              name="btn"
              :style="mainColor ? `background: ${mainColor} !important` : {}"
              class="logIn__form__input logIn__form__input_button opacitychangebtn cursor-pointer inline-block"
              :class="{ 'blocked-btn': captchaIsON && !captchaResponse }"
              type="submit"
              :disabled="captchaIsON && !captchaResponse"
              :value="
                usernameFixed ? $t('common.login_upper') : $t('common.continue')
              "
              @click="handleLogin"
            />
          </div>
          <router-link
            to="/forgot"
            class="logIn__recovery mb-4"
            :style="loginText ? `color: ${loginText} !important` : {}"
          >
            {{ $t("common.passwordrecovery") }}
          </router-link>
          <router-link
            to="/support"
            class="logIn__recovery mb-4"
            :style="loginText ? `color: ${loginText} !important` : {}"
            rel="noopener noreferrer nofollow"
            target="_blank"
            >{{ $t("common.support") }}</router-link
          >
        </form>
        <div
          class="text-center mb-2"
          style="font-size: 14px"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.or") }}
        </div>
        <div class="text-center">
          <router-link :to="'/register'" style="color: #fff">
            <button
              class="logIn__register"
              :style="
                secondColor ? `background: ${secondColor} !important` : {}
              "
            >
              {{ $t("common.register") }}
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <!--GOOGLE AUTH-->
    <div
      v-else
      class="logIn pb-5"
      style="text-align: center"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <ModalPagesHeader />
      <div class="flex flex-col box white">
        <div class="logIn__title" style="max-width: 600px">2FA</div>
        <div class="logIn__descr mb-4">
          <strong>{{ $t("common.entergooglecode") }}</strong>
        </div>
        <form
          class="logIn_form"
          autocomplete="off"
          @submit.prevent="enterGoogleCode()"
        >
          <input
            ref="googlecodeinput"
            v-model="googlecode"
            v-numeric.number
            name="googlecode"
            maxlength="6"
            autocomplete="google2fa"
            pattern="[0-9]{6}"
            placeholder="XXX XXX"
            class="secretclass1 mb-4"
            type="text"
            @input="formatGoogleCode"
          />
          <!--CAPTCHA-->
          <p v-if="errtext" class="text-danger mb-4">{{ errtext }}</p>
          <button
            :disabled="isInvalidFaCode"
            class="logIn__form__input logIn__form__input_button block"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            type="submit"
          >
            {{ $t("common.login_upper") }}
          </button>
        </form>
        <input
          class="forgot-password__button forgot-password__button_red logIn__form__input logIn__form__input_button back-button"
          type="button"
          :value="$t('common.back_to_login')"
          @click="reload()"
        />
      </div>
    </div>
    <!--GOOGLE AUTH-->
  </div>
</template>

<script>
import { VueRecaptcha } from "vue-recaptcha";
import ModalPagesHeader from "~/components/layout/ModalPagesHeader.vue";
import loginMixin from "~/mixins/login";

export default {
  name: "LoginPage",
  metaInfo() {
    return {
      title: this.$t("pages.titles.login"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.loginDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    VueRecaptcha,
    ModalPagesHeader,
  },
  mixins: [loginMixin],
  computed: {
    getFilteredDangerText() {
      return Object.fromEntries(
        Object.entries(this.dangertext).filter(([k, text]) => {
          return k && text && text !== "";
        })
      );
    },
  },
  beforeCreate() {
    if (localStorage.getItem("token")) {
      this.$router.push("/trade/BTC-USDT");
    }
    localStorage.setItem("showDepositNoticeModal", "1");
    if (localStorage.getItem("justactivate") === "true") {
      setTimeout(() => {
        this.$notify({
          type: "success",
          title: ``,
          text: `
            ${this.$t("common.modalacctiv")} -
            ${this.$t("common.modallogin")}
          `,
        });
        localStorage.setItem("justactivate", "false");
      }, 1100);
    } else if (localStorage.getItem("resetpass") === "true") {
      setTimeout(() => {
        this.$notify({
          type: "success",
          title: ``,
          text: `
            ${this.$t("common.modalpasschange1")} -
            ${this.$t("common.modalpasschange2")}
          `,
        });
        localStorage.setItem("resetpass", "false");
      }, 1100);
    }
  },
  methods: {
    goTo1Step() {
      this.usernameFixed = false;
      this.captchaIsON = false;
      this.captchaResponse = "";
      this.dangertext = {};
    },
    reload() {
      location.reload();
    },
  },
};
</script>

<style lang="scss">
.logIn__form {
  text-align: center;
  max-width: 302px;
}
.change {
  text-decoration: underline;
  cursor: pointer;
}
.blocked-btn {
  opacity: 0.5;
  pointer-events: none;
}
.input-group {
  //border: solid 1px #e0e0e0;
  border-radius: 3px;
  height: 47px;

  .btn,
  .btn:hover,
  .btn:active,
  .btn:focus {
    box-shadow: 0;
    outline: 0;
  }
}

button:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.logIn {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #fff;
  align-items: center;
  justify-content: center;
  background-color: #36373c;
  display: flex;
  flex-direction: column;

  &__descr {
    font-size: 16px;
    font-weight: 400;
    text-align: center;
  }

  &__title {
    text-align: center;
    font-size: 35px;
    font-weight: 300;
    padding-bottom: 50px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      width: 50px;
      height: 2px;
      bottom: 25px;
      left: 50%;
      margin-left: -25px;
      background-color: #43c868;
    }
  }

  &__form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }

  &__formInput {
    height: 35px;
  }
}

.logIn__form__input {
  margin-bottom: 1rem;
  width: 304px;
  border-radius: 3px !important;
  min-height: 45px;
  font-size: 14px !important;
  font-weight: 400 !important;
}

.logIn__form__input::-webkit-input-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input::-moz-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input:-ms-input-placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input::placeholder {
  padding-left: 10px !important;
  font-size: 14px;
  font-weight: 400;
  color: #1a1a1a;
}

.logIn__form__input_button {
  min-height: 54px;
  background-color: var(--theme-primary-color);
  border: none;
  font-weight: 700 !important;
  color: #000;
}

.logIn__form__input_button:hover,
.logIn__form__input_button:active,
.logIn__form__input_button:visited {
  background-color: var(--theme-primary-color);
}

/* style of input */
input::-moz-placeholder {
  color: #222;
  font-weight: 700;
}

input::-webkit-input-placeholder {
  color: #222;
  font-weight: 700;
}

input:-ms-input-placeholder {
  opacity: 1;
}

input::placeholder {
  opacity: 1;
}

input[type="email"]:focus,
input[type="number"]:focus,
input[type="password"]:focus,
input[type="tel"]:focus,
input[type="url"]:focus,
input[type="text"]:focus,
input[type="number"]:focus,
input[type="button"]:focus {
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.logIn__form input[type="email"],
.logIn__form input[type="number"],
.logIn__form input[type="password"],
.logIn__form input[type="tel"],
.logIn__form input[type="url"],
.logIn__form input[type="text"],
.logIn__form textarea {
  // background: #16171B;
  font-size: 16px;
  width: 100%;
  height: 100%;
  padding: 7px 12px;
  outline: none;
  box-shadow: none;
  // border: solid 1px #e0e0e0;
  // color: #fff;
  border-radius: 5px;
  font-weight: 700;
}

button {
  border: none;
  background-color: transparent;
  outline: none;
}

.auth {
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
    /*-webkit-text-fill-color: #169664 !important;*/
  }
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
    /*-webkit-text-fill-color: #169664 !important;*/
  }
  input:-webkit-autofill:hover {
    -webkit-box-shadow: 0 0 0px 1000px #e7f4fd inset;
    /*-webkit-text-fill-color: #169664 !important;*/
  }
}

.opacitychangebtn:active {
  opacity: 0.8 !important;
}

.register {
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  &__input--birthday-invalid {
    .mx-input {
      color: #e93a3a;
    }
  }

  .mx-input-wrapper,
  .mx-input-wrapper .mx-input {
    height: 100%;
    min-height: 45px;
  }

  .mx-input {
    background-color: white;
  }

  .mx-input-append {
    width: 65px;
    padding: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow: hidden;
  }

  .mx-datepicker {
    width: 100%;
  }

  &__birthday-error {
    position: absolute;
    color: #f94640;
    bottom: -10px;
  }

  &__password-icon {
    position: absolute;
    right: 15px;
    top: 10px;
    color: #bfc4d1;
    cursor: pointer;

    &--green {
      color: var(--theme-primary-color);
    }
  }

  &__user-exist-hint {
    color: #f94640;
  }

  &__have-account {
    /*margin-top: 15px;*/
    text-align: center;
  }

  &__link {
    color: #43c868;

    &--hint {
      font-size: 1.1em;
    }
  }

  &__input-group {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 10px;
    margin-bottom: 10px;

    &--country {
      margin-bottom: 20px;
    }

    &--half-width {
      width: 50%;

      @media (max-width: 530px) {
        width: 100%;
      }
    }

    &--select {
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 15px;
      }
    }
  }

  &__input-wrapper {
    position: relative;

    &--recap {
      width: fit-content;
      margin: 0 auto;
    }
  }

  &__input-error-hint {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #f94640;
    background-color: white;
    box-shadow: 0 0 4px 5px white;
    padding: 3px;

    &--password {
      right: 40px;
      top: 35%;
    }

    &--recap {
      right: 45px;
      top: 47%;
    }

    &--country {
      right: 45px;

      @media (min-width: 531px) {
        top: 48%;
      }
    }

    &--birthday {
      top: 60%;
      right: 85px;

      @media (min-width: 531px) {
        top: 55%;
      }
    }
  }

  &__title {
    text-align: center;
    font-size: 35px;
    font-weight: 300;
    margin-bottom: 25px;
  }

  &__form {
    display: flex;
    flex-wrap: wrap;
    max-width: 565px;
  }

  &__input {
    width: 100%;
    border-radius: 3px;
    min-height: 45px;
    font-size: 1em;
    font-weight: 600;
    padding: 10px;

    &--birthday {
      margin-bottom: 13px;
      width: 100%;
      border-radius: 3px;
      min-height: 45px;
    }

    &--password {
      padding-right: 45px;
    }
  }

  &__button {
    width: 100%;
    min-height: 70px;
    margin: 15px auto;
    font-size: 1.5em;

    &:disabled {
      background-color: #323f5e;
      color: #545f7d;
      pointer-events: none;
    }

    @media (max-width: 530px) {
      min-height: 55px;
    }
  }
}

.btn-def {
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  padding: 10px 20px;
  font-weight: 700;
  text-align: center;
  color: #fff;
  border: none;
  text-transform: uppercase;

  .green {
    background: #2399f1;
  }

  .yellow {
    background: #ffbb38;
  }
}

.secretclass1 {
  text-align: center;
  width: 90%;
  max-width: 491px;
  box-shadow: 0px 0px 20px 1px #0d121f inset;
  color: #169664;
  font-weight: 600;
  font-size: 33px;
  background-color: #212c46;
  border-radius: 6px;
  border: 2px solid #d4d4d4;
}

.secretclass1::placeholder {
  color: #169664;
  opacity: 0.03;
}
.back-button {
  background: #968cad !important;
}
.isBlur {
  filter: blur(5px);
}
</style>

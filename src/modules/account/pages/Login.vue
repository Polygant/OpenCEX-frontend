<template>
  <div class="auth">
    <div v-if="!showGoogleCodeInput" class="logIn pb-5">
      <ModalPagesHeader />
      <div class="flex box white flex-col">
        <div class="logIn__title">{{ $t("common.login") }}</div>
        <div
          v-if="!usernameFixed"
          class="logIn__descr"
          style="max-width: 302px"
        >
          {{ $t("common.useemail") }}
        </div>
        <div v-else class="logIn__descr">
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
              style="top: 4px; right: 4px"
            >
              <button
                class="btn border-0"
                type="button"
                @click="showPassword = !showPassword"
              >
                <img
                  v-show="!showPassword"
                  width="20"
                  src="/public/img/eye-slash.svg"
                  alt=""
                />
                <img
                  v-show="showPassword"
                  width="20"
                  src="/public/img/eye.svg"
                />
              </button>
            </div>
          </div>
          <!--CAPTCHA-->
          <vue-recaptcha
            v-show="usernameFixed"
            ref="recaptcha"
            :sitekey="localConfig.recaptcha_site_key"
            size="invisible"
            style="display: table"
            @verify="handleLogin"
            @expired="onExpired"
          ></vue-recaptcha>
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
              style="cursor: pointer; display: inline-block"
              class="logIn__form__input logIn__form__input_button opacitychangebtn"
              :class="{ 'blocked-btn': captchaIsON && !captchaResponse }"
              type="submit"
              :disabled="captchaIsON && !captchaResponse"
              :value="
                usernameFixed ? $t('common.login_upper') : $t('common.continue')
              "
              @click="$refs.recaptcha.execute()"
            />
          </div>
          <router-link to="/forgot" class="logIn__recovery mb-4">{{
            $t("common.passwordrecovery")
          }}</router-link>
          <router-link
            to="/support"
            class="logIn__recovery mb-4"
            rel="noopener noreferrer nofollow"
            target="_blank"
            >{{ $t("common.support") }}</router-link
          >
        </form>
        <div class="logIn__or text-center" style="font-size: 14px">
          {{ $t("common.or") }}
        </div>
        <div class="text-center">
          <router-link :to="'/register'" style="color: #fff">
            <button class="logIn__register">{{ $t("common.register") }}</button>
          </router-link>
        </div>
      </div>
    </div>
    <!--GOOGLE AUTH-->
    <div v-else class="logIn pb-5" style="text-align: center">
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
</style>

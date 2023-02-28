<template>
  <div class="auth">
    <div
      class="register pb-5 px-1"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <ModalPagesHeader />
      <template v-if="!confirmEmailSent">
        <div class="box mt-5">
          <div class="text-center">
            <div
              class="register__title inline-block"
              :style="loginText ? `color: ${loginText} !important` : {}"
            >
              {{ $t("common.createAccount") }}
            </div>
          </div>
          <div v-if="!successRegister" class="">
            <form
              class="register__form"
              autocomplete="off"
              novalidate
              @submit.prevent="handleRegister"
            >
              <div
                class="register__input-group register__input-group--half-width"
              >
                <label
                  for="first_name"
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  >{{ $t("common.firstname") }}:</label
                >
                <span class="register__input-wrapper">
                  <input
                    id="first_name"
                    v-model="form.first_name"
                    type="text"
                    class="register__input"
                    :class="{ 'border-red': validationError.first_name }"
                    @focus="clearError('first_name')"
                  />
                  {{ errorFirstName }}
                  <span
                    v-if="validationError.first_name"
                    class="register__input-error-hint"
                  >
                    {{ validationError.first_name }}
                  </span>
                  <span
                    v-if="!validFirstName"
                    class="register__input-error-hint"
                  >
                    {{ $t("common.invalidValueString") }}
                  </span>
                </span>
              </div>
              <div
                class="register__input-group register__input-group--half-width"
              >
                <label
                  for="last_name"
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  >{{ $t("common.lastname") }}:</label
                >
                <span class="register__input-wrapper">
                  <input
                    id="last_name"
                    v-model="form.last_name"
                    type="text"
                    class="register__input"
                    :class="{ 'border-red': validationError.last_name }"
                    @focus="clearError('last_name')"
                  />
                  <span
                    v-if="validationError.last_name"
                    class="register__input-error-hint"
                  >
                    {{ validationError.last_name }}
                  </span>
                  <span
                    v-if="!validLastName"
                    class="register__input-error-hint"
                  >
                    {{ $t("common.invalidValueString") }}
                  </span>
                </span>
              </div>
              <div class="register__input-group">
                <label
                  for="email"
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  >Email:</label
                >
                <span class="register__input-wrapper">
                  <input
                    id="email"
                    v-model="form.email"
                    type="text"
                    class="register__input"
                    :class="{ 'border-red': validationError.email }"
                    @focus="clearError('email')"
                  />
                  <span
                    v-if="validationError.email"
                    class="register__input-error-hint"
                  >
                    {{ validationError.email }}
                  </span>
                  <span v-if="validEmail" class="register__input-error-hint">
                    {{ $t("common.invalidEmail") }}
                  </span>
                </span>
              </div>
              <div
                class="register__input-group register__input-group--half-width"
              >
                <label
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  >{{ $t("common.birthday") }}:</label
                >
                <date-picker
                  ref="datepicker"
                  v-model:value="form.birth_day"
                  v-pattern="/^[0-9.]*$/"
                  :typeable="true"
                  :clearable="datePickerOptions.isClearable"
                  :editable="datePickerOptions.editable"
                  :format="datePickerOptions.format"
                  :placeholder="datePickerOptions.placeholder"
                  :first-day-of-week="datePickerOptions.firstDay"
                  value-type="timestamp"
                  :lang="$locale === 'en' ? 'en' : 'ru'"
                  class="register__input--birthday"
                  :class="{
                    'register__input--birthday-invalid': birthRangeError,
                    'border-red': validationError.birth_day,
                  }"
                  @focus="clearError('birth_day')"
                  @change="clearError('birth_day')"
                >
                  <template #calendar-icon>
                    <div class="register__date-icon">
                      <i class="material-icons">calendar_today</i>
                      <i class="material-icons">arrow_drop_down</i>
                    </div>
                  </template>
                </date-picker>
                <span
                  v-if="validationError.birth_day"
                  class="register__input-error-hint register__input-error-hint--birthday"
                >
                  {{ validationError.birth_day }}
                </span>
                <span v-if="birthRangeError" class="register__birthday-error">
                  {{ $t("common.bdayError") }}
                </span>
              </div>
              <div
                class="register__input-group register__input-group--half-width register__password"
              >
                <label
                  for="password"
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  >{{ $t("common.password") }}:</label
                >
                <span class="register__input-wrapper">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="passwordViewType"
                    autocomplete="new-password"
                    class="register__input register__input--password"
                    :class="{ 'border-red': validationError.password }"
                    style="height: auto"
                    @focus="clearError('password')"
                  />
                  <i
                    class="material-icons register__password-icon"
                    :class="{
                      'register__password-icon--green':
                        passwordViewType === 'text',
                    }"
                    @click="togglePasswordVisible"
                  >
                    <img
                      width="20"
                      :src="`/public/img/${
                        passwordViewType === 'text' ? 'eye' : 'eye-slash'
                      }.svg`"
                    />
                  </i>
                  <PasswordStrength :level="passwordStrengthLevel" />
                  <span
                    v-if="validationError.password"
                    class="register__input-error-hint register__input-error-hint--password"
                  >
                    {{ validationError.password }}
                  </span>
                </span>
              </div>
              <div class="register__input-group register__input-group--country">
                <label
                  :style="loginText ? `color: ${loginText} !important` : {}"
                  @click.stop="$refs.countryselect.toggle()"
                  >{{ $t("common.country") }}:</label
                >
                <span class="register__input-wrapper">
                  <CountrySelect
                    ref="countryselect"
                    :class="{ 'border-red': validationError.country }"
                    @change-value="onSelectCountry"
                    @valid-country="setValidCountry"
                  />
                  <span
                    v-if="validationError.country"
                    class="register__input-error-hint register__input-error-hint--country"
                  >
                    {{ validationError.country }}
                  </span>
                </span>
              </div>
              <div class="register__input-group register__input-group--agree">
                <div class="custom-control custom-switch">
                  <input
                    id="terms"
                    v-model="terms"
                    type="checkbox"
                    class="custom-control-input"
                  />
                  <label
                    class="custom-control-label pt-1"
                    :style="loginText ? `color: ${loginText} !important` : {}"
                    for="terms"
                    >{{ $t("common.agree") }}
                    <a
                      href="/public/docs/EN_User_Agreement_site.pdf"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="register__link"
                      >{{ $t("common.terms") }}</a
                    ></label
                  >
                </div>

                <div class="custom-control custom-switch">
                  <input
                    id="privacy"
                    v-model="privacyPolicy"
                    type="checkbox"
                    class="custom-control-input"
                  />
                  <label
                    class="custom-control-label pt-1"
                    :style="loginText ? `color: ${loginText} !important` : {}"
                    for="privacy"
                    >{{ $t("common.agree") }}
                    <a
                      href="/public/docs/EN_Privacy_policy_site.pdf"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="register__link"
                      >{{ $t("common.privacy") }}</a
                    ></label
                  >
                </div>

                <div class="custom-control custom-switch">
                  <input
                    id="newspaper"
                    v-model="form.subscription"
                    type="checkbox"
                    class="custom-control-input"
                  />
                  <label
                    class="custom-control-label pt-1"
                    :style="loginText ? `color: ${loginText} !important` : {}"
                    for="newspaper"
                  >
                    {{ $t("common.newspaper") }}
                  </label>
                </div>
              </div>

              <div class="register__input-group">
                <!--CAPTCHA-->
                <span
                  class="register__input-wrapper register__input-wrapper--recap"
                >
                  <vue-recaptcha
                    ref="recaptcha"
                    :sitekey="localConfig.recaptcha_site_key"
                    @verify="handleCaptcha"
                    @expired="onExpired"
                  />
                </span>
                <!--CAPTCHA-->

                <button
                  class="register__button mx-auto"
                  :style="
                    mainColor ? `background: ${mainColor} !important` : {}
                  "
                  :disabled="isButtonDisabled"
                  type="submit"
                >
                  {{ $t("common.createAccount") }}
                </button>
              </div>

              <p v-if="userExist" class="register__user-exist-hint">
                {{ $t("common.user_registered") }}
              </p>
            </form>

            <!--Другие опции-->
            <section class="register__have-account">
              <router-link
                to="/login"
                class="register__link register__link--hint"
                :style="loginText ? `color: ${loginText} !important` : {}"
              >
                <span>{{ $t("common.haveaccount") }}</span>
              </router-link>
            </section>
            <!--Другие опции-->
          </div>
          <div v-else class="success-register">
            <p class="register__popup">
              {{ $t("common.success_register") }}
            </p>
            <p class="text-primary alert text-justify">
              {{ $t("common.success_timer_text") }}
              <b>{{ successTimer }}</b>
            </p>
          </div>
        </div>
      </template>
      <template v-else>
        <!--Отправлено на почту-->
        <div class="register__title">{{ $t("common.register") }}</div>
        <div class="register__form">
          <div class="register__popup text-center">
            {{ $t("common.wesentemail") }}
          </div>
        </div>
        <!--Отправлено на почту-->
      </template>
    </div>
  </div>
</template>

<script>
import ModalPagesHeader from "~/components/layout/ModalPagesHeader.vue";
import CountrySelect from "~/components/ui/CountrySelect.vue";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { VueRecaptcha } from "vue-recaptcha";
import PasswordStrength from "../components/PasswordStrength.vue";

export default {
  name: "ConfirmWithdrawalUrl",
  metaInfo() {
    return {
      title: this.$t("pages.titles.register"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.registerDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    PasswordStrength,
    CountrySelect,
    ModalPagesHeader,
    DatePicker,
    VueRecaptcha,
  },
  props: {
    refcode: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      minYearsOld: 18,
      form: {
        first_name: "",
        last_name: "",
        email: "",
        birth_day: "",
        password: "",
        country: "",
        subscription: false,
      },
      validationError: {},
      terms: false,
      privacyPolicy: false,
      confirmEmailSent: false,
      refCode: "",
      isReferral: false,
      successRegister: false,
      successTimer: 0,
      registeredUserEmail: null,
      passwordViewType: "password",
      isValidCountry: null,
      validFirstName: true,
      validLastName: true,
      captcha: "",
    };
  },
  computed: {
    datePickerOptions() {
      return {
        isClearable: false,
        format: "DD.MM.YYYY",
        editable: true,
        firstDay: 1,
        placeholder: this.$locale === "ru" ? "ЧЧ.ММ.ГГГГ" : "DD.MM.YYYY",
      };
    },
    isButtonDisabled() {
      return (
        !!Object.keys(this.validationError).length ||
        !this.terms ||
        !this.privacyPolicy ||
        !this.isValidCountry
      );
    },
    passwordStrengthLevel() {
      let level = 1;

      const { password } = this.form;
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      const mediumRegex = new RegExp(
        "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
      );
      const lowRegex = new RegExp(
        "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
      );

      if (strongRegex.test(password)) {
        level = 5;
      } else if (mediumRegex.test(password)) {
        level = 4;
      } else if (lowRegex.test(password)) {
        level = 3;
      } else if (password.length >= 6) {
        level = 2;
      }

      return level;
    },
    birthRangeError() {
      return this.form.birth_day && !this.isBirthdayCorrect;
    },
    userExist() {
      return (
        this.registeredUserEmail !== null &&
        this.form.email === this.registeredUserEmail
      );
    },
    isBirthdayCorrect() {
      if (this.form.birth_day) {
        return this.isOlderThen(this.minYearsOld);
      }

      return false;
    },
  },
  watch: {
    "$i18n.locale": {
      immediate: true,
      handler(val) {
        this.$store.dispatch("core/getCountryList", val);
      },
    },
    "form.first_name": {
      handler(val) {
        this.validFirstName = this.isCorrectName(val);
      },
    },
    "form.last_name": {
      handler(val) {
        this.validLastName = this.isCorrectName(val);
      },
    },
  },
  mounted() {
    const savedRefCode = localStorage.getItem("p2p.refcode");
    const refCode = this.$props.refcode || savedRefCode;

    if (refCode) {
      localStorage.setItem("p2p.refcode", refCode);
      this.refCode = refCode;
      this.isReferral = true;
    }
  },
  methods: {
    setValidCountry(val) {
      this.isValidCountry = val;
    },
    isCorrectName(val) {
      return /^[-\sa-zA-Z]+$/.test(val);
    },
    clearError(prop) {
      if (this.validationError[prop]) {
        delete this.validationError[prop];
      }
    },
    isOlderThen(years) {
      const birthdayTimestamp = this.form.birth_day;
      const now = new Date();
      // устанавливаем -18 лет от сейчас
      now.setFullYear(now.getFullYear() - years);
      const minBirthdayTimestamp = now.getTime();

      return birthdayTimestamp < minBirthdayTimestamp;
    },
    onExpired() {
      this.$refs.recaptcha.reset();
    },
    onSelectCountry(value) {
      this.clearError("country");
      this.form.country = value;
    },
    validateEmail(email) {
      let re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    validateData(form) {
      const validateRules = {
        first_name: {
          required: true,
          minLength: 2,
          maxLength: 30,
          validateFunction: this.isCorrectName,
          validateFunctionParams: [form.first_name],
          invalidMessage: this.$t("common.invalidValueString"),
        },
        last_name: {
          required: true,
          minLength: 2,
          maxLength: 30,
          validateFunction: this.isCorrectName,
          validateFunctionParams: [form.last_name],
          invalidMessage: this.$t("common.invalidValueString"),
        },
        email: {
          required: true,
          validateFunction: this.validateEmail,
          validateFunctionParams: [form.email],
          invalidMessage: this.$t("common.invalidEmail"),
        },
        password: {
          required: true,
          minLength: 6,
          maxLength: 50,
        },
        birth_day: {
          required: true,
        },
        country: {
          required: true,
        },
      };

      for (const key in validateRules) {
        if (key in validateRules) {
          let rule = validateRules[key];

          if (rule.required) {
            if (form[key]) {
              if (rule.minLength && form[key].length < rule.minLength) {
                this.validationError[key] =
                  this.$t("common.fieldMinLength") + rule.minLength;
              } else if (rule.maxLength && form[key].length > rule.maxLength) {
                this.validationError[key] =
                  this.$t("common.fieldMaxLength") + rule.maxLength;
              } else if (
                rule.validateFunction &&
                !rule.validateFunction(...rule.validateFunctionParams)
              ) {
                this.validationError[key] = rule.invalidMessage;
              }
            } else {
              this.validationError[key] = this.$t("common.requiredField");
            }
          }
        }
      }
      if (!form.birth_day) {
        this.validationError["birth_day"] = this.$t("common.requiredField");
      }
      return !Object.keys(this.validationError).length || this.birthRangeError;
    },
    togglePasswordVisible() {
      this.passwordViewType =
        this.passwordViewType === "password" ? "text" : "password";
    },
    handleCaptcha(captchaResponse) {
      this.captcha = captchaResponse;
    },
    handleRegister() {
      if (this.validateData(this.form) && !this.birthRangeError) {
        const config = {
          ...this.form,
          lang: localStorage.getItem("planguage") || "en",
          password1: this.form.password,
          password2: this.form.password,
          username: this.form.email,
          captchaResponse: this.captcha,
        };

        config.birth_day = new Date(
          this.form.birth_day -
            new Date(this.form.birth_day).getTimezoneOffset() * 60000
        ).toISOString();

        if (this.isReferral) {
          config["affiliate_code"] = this.refCode;
        }

        this.$http.post("auth/registration/", config).then(
          () => {
            this.confirmEmailSent = true;

            if (this.isReferral) {
              localStorage.removeItem("p2p.refcode");
            }

            this.successRegister = true;

            this.successTimer = 5;
            let interval = setInterval(() => {
              this.successTimer -= 1;
            }, 1000);

            const self = this;
            setTimeout(() => {
              clearInterval(interval);
              self.$router.push("/login");
            }, 5000);

            /* eslint-disable */
            ga("create", "UA-141014543-1", "auto");
            ga("send", "form", "registration");
            /* eslint-enable */
          },
          (r) => {
            const exceptedFields = [
              "email",
              "birth_day",
              "first_name",
              "last_name",
              "country",
              "password1",
            ];
            const errors = Object.entries(r.body);

            errors.forEach(([field, texts]) => {
              if (exceptedFields.includes(field)) {
                texts.forEach((text) => {
                  this.$notify({
                    type: "error",
                    title: `${this.$t("common.field")}: ${field}`,
                    text: text.message,
                  });
                });
              }
            });
          }
        );
      } else {
        console.error("Not validated");
      }
    },
  },
};
</script>

<style lang="scss">
.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
}
</style>

<style lang="scss" scoped>
@import "~/assets/css/variables";
$red: #e93a3a;

.border-red {
  border: 2px solid $red;
  border-radius: 3px;
}

.register {
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #36373c;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  &__date-icon {
    width: 100%;
    height: 100%;
    background-color: var(--theme-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.15s ease-in;

    &:hover {
      background-color: darken($theme-primary-color, 5%);
      transition: background-color 0.15s ease-out;
    }

    i {
      color: white;
    }
  }
}

.success-register {
  .register__popup {
    max-width: none;
  }
}

.register__input-group--agree {
  margin-left: 37px;
}
.register__button {
  background-color: var(--theme-primary-color);
  color: white;
}
.register__button:active,
.register__button:hover {
  background-color: var(--theme-primary-color);
  transition: background-color 0.15s ease-out;
}
</style>

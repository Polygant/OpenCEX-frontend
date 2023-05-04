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
                    v-pattern:email
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
                  <span class="eye-pass" @click="togglePasswordVisible">
                    <svg
                      v-if="passwordViewType === 'text'"
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
                      v-else
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
                  </span>
                  <PasswordStrength :level="passwordStrengthLevel" />
                  <span
                    v-if="validationError.password"
                    class="register__input-error-hint register__input-error-hint--password"
                  >
                    {{ validationError.password }}
                  </span>
                </span>
                <div
                  v-if="isPassNoEmpty"
                  class="pass-error-block"
                  @click="showPassPopup = false"
                >
                  <div class="arrow"></div>
                  <ul>
                    <li :class="{ 'no-correct': !isPassHasUppercase }">
                      <span class="icon">&#x2714;</span>
                      {{ $t("common.password_upper") }}
                    </li>
                    <li :class="{ 'no-correct': !isPassHasLowercase }">
                      <span class="icon">&#x2714;</span>
                      {{ $t("common.password_lower") }}
                    </li>
                    <li :class="{ 'no-correct': !isPassHasNumbercase }">
                      <span class="icon">&#x2714;</span>
                      {{ $t("common.password_number") }}
                    </li>
                    <li :class="{ 'no-correct': !isPassAnouth }">
                      <span class="icon">&#x2714;</span>
                      {{ $t("common.password_chars") }}
                    </li>
                  </ul>
                </div>
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
                    >
                    &
                    <a
                      href="/public/docs/EN_Privacy_policy_site.pdf"
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="register__link"
                      >{{ $t("common.privacy") }}</a
                    >
                  </label>
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
      showPassPopup: false,
      validationError: {},
      terms: false,
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
    isPassNoEmpty() {
      return this.form.password.length > 0;
    },
    isPassHasUppercase() {
      return /[A-Z]/.test(this.form.password);
    },
    isPassHasLowercase() {
      return /[a-z]/.test(this.form.password);
    },
    isPassHasNumbercase() {
      return /[\d]/.test(this.form.password);
    },
    isPassAnouth() {
      return this.form.password.length > 7 && this.form.password.length < 31;
    },
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
        !this.isValidCountry ||
        !this.isPassNoEmpty ||
        !this.isPassHasUppercase ||
        !this.isPassHasLowercase ||
        !this.isPassHasNumbercase ||
        !this.isPassAnouth
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
    isCorrectPassword() {
      let hasUpperCase = /[A-Z]/.test(this.form.password);
      let hasLowerCase = /[a-z]/.test(this.form.password);
      let hasNumber = /\d/.test(this.form.password);
      return hasUpperCase && hasLowerCase && hasNumber;
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
          maxLength: 350,
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
      if (
        this.validateData(this.form) &&
        !this.birthRangeError &&
        this.isCorrectPassword
      ) {
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
.eye-pass {
  position: absolute;
  right: 10px;
  top: 8px;
  cursor: pointer;
  width: 41px;
  height: 30px;
  padding: 5px 0 0 11px;
}
.pass-error-block {
  background-color: #323433;
  border-radius: 10px;
  position: absolute;
  padding: 10px;
  top: 25px;
  right: -245px;
  width: 245px;
}
.pass-error-block .no-correct {
  color: red;
}
.pass-error-block .arrow {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #323433;
  position: absolute;
  left: -10px;
  top: 10px;
}

.pass-error-block ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.pass-error-block li {
  display: flex;
  align-items: center;
}

.pass-error-block .icon {
  background-color: #56ba57;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  font-weight: bold;
  font-size: 8px;
}
.pass-error-block .no-correct .icon {
  background: red;
}
</style>

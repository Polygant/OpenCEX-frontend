<template>
  <div class="confirm-phone">
    <h1 v-if="verifyType == 'withdrawal'">
      {{ $t("common.confirm_withdrawals_by_sms") }}
    </h1>
    <h1 v-else>
      {{ $t("common.confirmPhone") }}
    </h1>
    <form class="input-btn-group" @submit.prevent="sendCode">
      <span class="input-wrapper">
        <vue-tel-input
          :key="'phone'"
          ref="phoneInput"
          :value="phoneNum"
          class="phone-input"
          :auto-default-country="false"
          :disabled="
            (disablePhoneInput && verifyType === 'withdrawal') ||
            verifyType === 'disable_sms_withdrawals'
          "
          :input-options="phoneInputOptions"
          :mode="'international'"
          :placeholder="$t('common.phone')"
          :default-country="'RUS'"
          @input="onInput"
          @change="phone = $event"
          @validate="setPhoneValid"
        ></vue-tel-input>
      </span>
      <button
        type="submit"
        class="button button--phone"
        :disabled="countdownVisible || phoneNum.length < minPhoneLength"
      >
        {{ $t("common.getCode") }}
      </button>
    </form>
    <div v-if="countdownVisible" class="countdown-container">
      {{ $t("common.nextSendAfter") }}
      {{ countdownTime }}
      {{ $t("common.seconds") }}.
    </div>
    <form class="input-btn-group code-group" @submit.prevent="confirmCode">
      <span class="input-wrapper" style="position: relative">
        <input
          ref="code"
          v-model="code"
          v-pattern="/^[0-9]*$/"
          type="text"
          class="input code"
          :disabled="codeExpired"
          :placeholder="$t('common.code')"
        />
        <div v-if="codeExpired" class="code-expired-hint">
          {{ $t("common.codeTimeExpired") }}
        </div>
      </span>
      <button
        type="submit"
        class="button phone-confirm-button"
        :class="{ 'additional-margin': codeExpired }"
        :disabled="!code || codeExpired || phone.length < minPhoneLength"
      >
        {{ $t("common.confirm") }}
      </button>
    </form>
  </div>
</template>

<script>
import { VueTelInput } from "vue3-tel-input";
import accountSettingMixin from "../modules/account/components/mixin";

export default {
  name: "PhoneVerify",
  components: { VueTelInput },
  mixins: [accountSettingMixin],
  // eslint-disable-next-line vue/require-prop-types
  props: ["parentData", "isWizard", "verifyType"],
  emits: ["verified-phone", "close"],
  data() {
    return {
      phoneInputOptions: {
        showDialCode: true,
      },
      phoneValid: false,
      minPhoneLength: 9,
      phone: "",
      phoneNum: "",
      code: "",
      waiting: false,
      countdownVisible: false,
      lastCountryCodeSymbolIndex: null,
      prevLastCountryCodeSymbolIndex: null,
      codeExpired: false,
      timeout: null,
      countdownTime: 120,
      countdownTimer: null,
      disablePhoneInput: "",
    };
  },
  watch: {
    $route() {
      this.$modal.close();
    },
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.$refs.phoneInput.focus();
    }, 500);

    if (this.profile.phone && this.profile.phone != null) {
      this.phone = this.profile.phone;
      this.phoneNum = this.profile.phone;
      this.disablePhoneInput = true;
    }
  },
  methods: {
    onInput(phone, phoneObject) {
      if (phoneObject?.formatted) {
        this.phoneNum = phoneObject.formatted;
      }
    },
    setPhoneValid({ isValid }) {
      this.phoneValid = isValid;
    },
    runCodeTimer() {
      const self = this;
      this.timeout = setTimeout(() => {
        self.codeExpired = true;
      }, 5 * 60 * 1000);
    },
    sendCode() {
      this.codeExpired = false;
      this.$http
        .post("phone-verify/", {
          phone: this.phoneNum.replace(/\s/g, "").replace(/-/g, ""),
          verify: this.verifyType,
        })
        .then(
          (res) => {
            if (res.body.result) {
              this.countdownVisible = true;

              if (this.timeout) {
                clearTimeout(this.timeout);
              }
              this.runCountdownTimer();

              this.$notify({
                type: "success",
                text: this.$t("common.smsSent"),
              });

              this.runCodeTimer();
              this.$nextTick(() => {
                this.$refs.code.value = "";
                this.$refs.code.focus();
              });
            } else {
              this.$notify({
                type: "error",
                text: this.$t("common.smsSentError"),
              });
            }
          },
          () => {
            this.$notify({
              type: "error",
              text: this.$t("common.smsSentError"),
            });
          }
        );
    },
    confirmCode() {
      this.$http
        .post("phone-verify/check/", {
          phone: this.phoneNum.replace(/\s/g, "").replace(/-/g, ""),
          code: this.code,
          verify: this.verifyType,
        })
        .then(
          ({ body }) => {
            if (body.status) {
              if (this.timeout) {
                clearTimeout(this.timeout);
              }
              this.countdownVisible = false;

              this.$store.dispatch("core/getProfile").then(() => {
                this.$emit("verified-phone", this.code);
              });

              this.$modal.close();
              if (this.verifyType == "withdrawal") {
                this.$notify({
                  type: "success",
                  text: this.$t("common.withdrawal_confirmed"),
                });
              } else {
                this.$notify({
                  type: "success",
                  text: this.$t("common.verifySmsSuccess"),
                });
              }
            } else {
              if (this.verifyType == "withdrawal") {
                this.$notify({
                  type: "error",
                  text: this.$t("common.withdrawal_confirmed_error"),
                });
              } else {
                this.$notify({
                  type: "error",
                  text: this.$t("common.verifySmsError"),
                });
              }
            }
          },
          () => {
            this.$notify({
              type: "error",
              text: this.$t("common.verifySmsError"),
            });
          }
        );
    },
    close() {
      this.$modal.close();
      this.$router.go(-1);
    },
    runCountdownTimer() {
      this.countdownTimer = setInterval(() => {
        if (this.countdownTime > 1) {
          this.countdownTime--;
        } else {
          this.countdownVisible = false;
          this.countdownTime = 120;
          clearInterval(this.countdownTimer);
        }
      }, 1000);
    },
  },
};
</script>
<style>
.phone-input {
  height: 100%;
}
.phone-input .vti__input {
  border: none;
  height: auto;
}
</style>
<style lang="scss" scoped>
@import "../assets/css/variables";

.code-expired-hint {
  max-width: 230px;
  position: absolute;
  bottom: 0;
  font-style: italic;
  font-size: 12px;
  color: #f13838;
  left: 0;
  padding: 0;
  top: 100%;
}

.confirm-phone {
  input:focus {
    border-color: ﬁ;
  }

  h1 {
    text-align: center;
    font-size: 22px;
    margin-top: 0;

    @media (min-width: 600px) {
      margin-bottom: 40px;
    }
  }

  .input-wrapper {
    width: 280px;

    @media (max-width: 600px) {
      width: 100%;
    }
  }

  .input-btn-group {
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 0 20px;
    margin-bottom: 30px;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
      padding: 0;
    }

    &.code-group {
      @media (min-width: 600px) {
        margin-bottom: 60px;
      }
    }
  }

  .countdown {
    position: absolute;
    top: 100%;
    padding: 0 20px;
    width: 100%;
    display: block;
    text-align: center;
    font-size: 12px;
  }

  .button {
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 45px;
    text-transform: uppercase;
    width: 40%;
    height: 45px;
    border-radius: 5px;
    background-color: #48b58b;
    color: white;
    margin-left: 5px;

    @media (max-width: 600px) {
      width: 80%;
      max-width: 200px;
      margin-left: 0px;
    }

    &--phone {
      @media (max-width: 600px) {
        margin-top: 10px;
      }
    }

    &:disabled {
      pointer-events: none;
      opacity: 0.75;
    }
  }

  .input {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    padding: 0 10px;

    &::placeholder {
      color: lightgrey;
      transform: translate3d(0, 2px, 0);
    }

    @media (max-width: 600px) {
      margin-bottom: 10px;
      width: 100%;
    }

    &.code {
      min-width: 50px;
      &:focus {
        box-shadow: 0 0 3px 1px rgba(2, 105, 216, 0.25);
        outline: none;
        border: 1px solid rgba(2, 105, 216, 0.61);
      }
    }
  }

  .button,
  .input {
    @media (max-width: 600px) {
      height: 35px;
      line-height: 35px;
    }
  }

  .close-hint {
    padding: 0 20px;
    text-align: right;
  }

  .close-hint-text {
    text-decoration: underline;
    color: #0074d1;
    cursor: pointer;
  }
}

.phone-confirm-button {
  @media (max-width: 600px) {
    &.additional-margin {
      margin-top: 40px;
    }
  }
}

.countdown-container {
  padding: 0 20px;
  margin-top: -20px;
  margin-bottom: 20px;
  font-size: 14px;
  @media (max-width: 600px) {
    padding: 0;
  }
}
</style>

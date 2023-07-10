<template>
  <div class="walletlist user-account_setting">
    <div class="settings__NAME">{{ $t("common.settings") }}</div>
    <div v-if="twofaStepNumber === 1 && !addPhone">
      <div class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 50%; font-size: 16px"
        >
          2FA
        </div>
        <div
          v-if="is2faOff"
          class="walletTable__item_val1 itemStatusDown table__status"
          style="height: 35px; line-height: 1; font-size: 15px !important"
        >
          {{ $t("common.twofaisoff") }}
        </div>
        <div
          v-if="!is2faOff"
          class="walletTable__item_val1 itemStatusUp table__status"
          style="height: 35px; line-height: 1; font-size: 15px !important"
        >
          {{ $t("common.twofaison") }}
        </div>
        <div v-if="is2faOff" class="table__button">
          <button
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="start2FAON()"
          >
            {{ $t("common.turnon") }}
          </button>
        </div>
        <div v-if="!is2faOff" class="table__button">
          <button
            class="opacitychangebtn"
            style="background-color: #e34848"
            :style="mainColor ? `background: ${cancelColor} !important` : {}"
            @click="start2FAOFF()"
          >
            {{ $t("common.turnoff") }}
          </button>
        </div>
      </div>
      <div class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 50%; font-size: 16px"
        >
          {{ $t("common.sessiontimeout") }}
        </div>
        <div
          class="walletTable__item_val1 table__status"
          style="height: 35px; line-height: 1; font-size: 15px !important"
        >
          {{ addSpace(autoLogoutValue) }}
          {{ $t("common.mins") }}
        </div>
        <div class="table__button">
          <button
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="startChangeTime()"
          >
            {{ $t("common.changetime") }}
          </button>
        </div>
      </div>
      <div class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 50%; font-size: 16px"
        >
          {{ $t("common.defaultInterface") }}
        </div>
        <div
          v-if="profile.interface === 'advance'"
          class="walletTable__item_val1 table__status"
          style="height: 35px; line-height: 1; font-size: 15px !important"
        >
          {{ $t("common.advanced") }}
        </div>
        <div
          v-else
          class="walletTable__item_val1 table__status"
          style="height: 35px; line-height: 1; font-size: 15px !important"
        >
          {{ $t("common.basic") }}
        </div>
        <div class="table__button">
          <button
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="$router.push('/interface-select')"
          >
            {{ $t("common.change") }}
          </button>
        </div>
      </div>
      <div class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 75%; font-size: 16px"
        >
          {{ $t("common.change_ip_notification") }}
        </div>
        <div class="table__button">
          <button
            v-if="enabledIpNotifications"
            class="opacitychangebtn"
            style="background-color: #e34848"
            :style="mainColor ? `background: ${cancelColor} !important` : {}"
            @click="toggleIpNotification"
          >
            {{ $t("common.turnoff") }}
          </button>
          <button
            v-else
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="toggleIpNotification"
          >
            {{ $t("common.turnon") }}
          </button>
        </div>
      </div>
      <div class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 75%; font-size: 16px"
        >
          {{ $t("common.failed_login_notification") }}
        </div>
        <div class="table__button">
          <button
            v-if="enabledLoginNotifications"
            class="opacitychangebtn"
            style="background-color: #e34848"
            :style="mainColor ? `background: ${cancelColor} !important` : {}"
            @click="toggleLoginNotification"
          >
            {{ $t("common.turnoff") }}
          </button>
          <button
            v-else
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="toggleLoginNotification"
          >
            {{ $t("common.turnon") }}
          </button>
        </div>
      </div>
      <div v-if="profile?.sms_enabled" class="table__row walletTable__item1">
        <div
          class="walletTable__item_val1"
          style="line-height: 1; width: 75%; font-size: 16px"
        >
          {{ $t("common.confirm_withdrawals_by_sms") }}
        </div>
        <div class="table__button">
          <button
            v-if="profile.withdrawals_sms_confirmation"
            class="opacitychangebtn"
            style="background-color: #e34848"
            :style="mainColor ? `background: ${cancelColor} !important` : {}"
            @click="sendPhone"
          >
            {{ $t("common.turnoff") }}
          </button>
          <button
            v-else
            class="opacitychangebtn"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="sendPhone"
          >
            {{ $t("common.turnon") }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="twofaStepNumber === 2" style="height: 444px">
      <div style="position: relative">
        <div style="top: 0; left: 0; width: 100%">
          <div class="grid grid-cols-2" style="height: 389px">
            <div>
              <div id="qrcode1" class="twofaPmargintop mx-auto">
                <!-- eslint-disable vue/no-v-html -->
                <p
                  id="qrcode"
                  style="text-align: center"
                  v-html="qrCodeImgTag"
                ></p>
              </div>
              <div class="text-center secret-key-container">
                <small class="text-danger form-text">{{
                  $t("common.save_code")
                }}</small>
                <h3 class="secret-key secret-key__profile">{{ secretkey }}</h3>
              </div>
            </div>
            <div
              :style="
                mainColor
                  ? `border-left: 1px solid ${borderColor} !important`
                  : {}
              "
            >
              <div></div>
              <p
                class="twofaPmargintop"
                style="width: 100%; text-align: center; color: #565656"
              >
                {{ $t("common.scanqr") }}
                <br />
                <b>{{ $t("common.googleauth") }}</b>
              </p>
              <div style="margin-top: 17px; margin: 0 auto; width: 100px">
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8"
                >
                  <img
                    src="/public/img/apple.svg"
                    style="height: 35px; width: 100px"
                  />
                </a>
              </div>
              <br />
              <div style="margin-top: 17px; margin: 0 auto; width: 100px">
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                >
                  <img
                    src="/public/img/google.svg"
                    style="height: 35px; width: 100px"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="height: 55px"
        :style="
          mainColor ? `border-top: 1px solid ${borderColor} !important` : {}
        "
      >
        <div class="fa-buttons">
          <button
            class="opacitychangebtn btn-danger"
            style="
              opacity: 0.85;
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            @click="finish2FAON()"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="opacitychangebtn"
            style="
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            :style="secondColor ? `background: ${secondColor} !important` : {}"
            @click="startPreCheckGoogleCode()"
          >
            {{ $t("common.next") }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="twofaStepNumber === 3" style="height: 444px">
      <div style="height: 389px">
        <div class="logIn__descr" style="text-align: center; padding-top: 90px">
          {{ $t("common.youcanturnoff") }}
          <strong>2FA</strong>
        </div>
        <div class="logIn__descr" style="margin-top: 20px; text-align: center">
          {{ $t("common.entergooglecode") }}
        </div>

        <form
          class="logIn__form items-center"
          action
          style="width: 70%; margin-left: auto; margin-right: auto"
          @submit.prevent="checkSecret"
        >
          <input
            ref="secretkey"
            v-model="secretkeyToDisable"
            v-numeric.number.decimal
            placeholder="X X X  X X X"
            class="secretclass1 m-0"
            type="text"
            style="
              height: 70px;
              text-align: center;
              max-width: 491px;
              box-shadow: 0px 0px 20px 1px #d8d8d8 inset;
              color: #313948;
              font-weight: 600;
              font-size: 33px;
              background-color: #f3f3f3;
              border-radius: 6px;
              margin-bottom: 10px;
            "
            :style="
              borderColor ? `border: 1px solid ${borderColor} !important` : {}
            "
            @keyup="checkFaLength('secretkeyToDisable')"
          />
          <p class="text-danger" style="margin-top: 20px; text-align: center">
            {{ errtext }}
          </p>
        </form>
      </div>
      <div
        style="height: 55px"
        :style="
          borderColor ? `border-top: 1px solid ${borderColor} !important` : {}
        "
      >
        <div class="fa-buttons">
          <button
            class="opacitychangebtn"
            style="
              background-color: #19243c;
              opacity: 0.85;
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="finish2FAON()"
          >
            {{ $t("common.back") }}
          </button>
          <button
            class="opacitychangebtn"
            style="
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            :style="mainColor ? `background: ${cancelColor} !important` : {}"
            @click="checkSecret()"
          >
            {{ $t("common.turnoff") }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="twofaStepNumber === 4" style="height: 444px">
      <div style="height: 389px">
        <div class="logIn__descr" style="text-align: center; padding-top: 90px">
          {{ $t("common.precheck1") }}
        </div>

        <form
          class="logIn__form items-center"
          action
          style="width: 70%; margin-left: auto; margin-right: auto"
          @submit.prevent="preCheckGoogleCode"
        >
          <input
            ref="secretkey"
            v-model="googleCodeToPreCheck"
            v-pattern="/^[0-9]*$/"
            v-numeric.number.decimal
            placeholder="X X X  X X X"
            class="secretclass1 m-0"
            type="text"
            style="
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
            :style="
              borderColor ? `border: 2px solid ${borderColor} !important` : {}
            "
            @keyup="checkFaLength('googleCodeToPreCheck')"
          />
          <p class="text-danger" style="margin-top: 20px; text-align: center">
            {{ errtextPreCheck }}
          </p>
        </form>
      </div>
      <div
        style="height: 55px"
        :style="
          borderColor ? `border-top: 1px solid ${borderColor} !important` : {}
        "
      >
        <div class="fa-buttons">
          <button
            class="opacitychangebtn btn-danger"
            style="
              opacity: 0.85;
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            @click="finish2FAON()"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="opacitychangebtn"
            style="
              background-color: var(--theme-primary-color);
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="preCheckGoogleCode()"
          >
            {{ $t("common.save") }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="twofaStepNumber === 5" style="height: 444px">
      <div style="height: 389px">
        <div class="logIn__descr" style="text-align: center; padding-top: 90px">
          {{ $t("common.changelogout") }}
        </div>

        <form
          class="logIn__form items-center"
          action
          style="width: 70%; margin-left: auto; margin-right: auto"
          @submit.prevent="
            {
              newautoLogoutTimeout;
            }
          "
        >
          <input
            v-model="newautoLogoutTimeout"
            v-pattern="/^[0-9]{0,5}$/"
            placeholder
            class="secretclass1 m-0"
            maxlength="5"
            type="text"
            style="
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
          <p class="text-danger" style="margin-top: 20px; text-align: center">
            {{ errtextChangeTime }}
          </p>
        </form>
      </div>
      <div
        style="height: 55px"
        :style="
          borderColor ? `border-top: 1px solid ${borderColor} !important` : {}
        "
      >
        <div class="fa-buttons">
          <button
            class="opacitychangebtn btn-danger"
            style="
              opacity: 0.85;
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            @click="finishChangeTime()"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="opacitychangebtn"
            style="
              background-color: var(--theme-primary-color);
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            :style="mainColor ? `background: ${mainColor} !important` : {}"
            @click="setNewLogoutTimeout()"
          >
            {{ $t("common.save") }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="addPhone" style="height: 444px">
      <div
        style="
          height: 389px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
        "
      >
        <phoneVerify
          :verify-type="phoneVerifyType"
          @verified-phone="verifiedPhone"
        />
      </div>
      <div
        style="height: 55px; border-top: 1px solid #e7f4fd; text-align: right"
      >
        <div class="fa-buttons">
          <button
            class="opacitychangebtn btn-danger"
            style="
              opacity: 0.85;
              color: rgb(255, 255, 255);
              width: 100px;
              height: 35px;
              margin: 10px;
              font-weight: 600 !important;
              font-size: 15px !important;
              line-height: 1;
              border-radius: 3px;
            "
            @click="addPhone = false"
          >
            {{ $t("common.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getFixedDecimal from "~/mixins/getFixedDecimal";
import qrcode from "qrcode-generator";
import accountSettingMixin from "./mixin";
import { PROFILE_AUTO_LOGOUT_TIMEOUT } from "~/store/core/mutation-types";
import phoneVerify from "~/components/PhoneVerify.vue";
export default {
  name: "SettingSection",
  components: {
    phoneVerify,
  },
  mixins: [accountSettingMixin, getFixedDecimal],
  data() {
    return {
      is2faOff: true,
      enabledIpNotificationsLive: null,
      enabledLoginNotificationsLive: null,
      userPhone: "",
      addPhone: false,
      phoneVerifyType: null,
      qrCodeImgTag: "",
      newAutoLogoutTimeout: 0,
    };
  },
  computed: {
    autoLogoutTimeout() {
      return this.profile["auto_logout_timeout"];
    },
    enabledIpNotifications() {
      return this.enabledIpNotificationsLive === null
        ? this.profile.email_ip_changed
        : this.enabledIpNotificationsLive;
    },
    enabledLoginNotifications() {
      return this.enabledLoginNotificationsLive === null
        ? this.profile.email_failed_login
        : this.enabledLoginNotificationsLive;
    },
    autoLogoutValue() {
      return this.newAutoLogoutTimeout > 0
        ? this.newAutoLogoutTimeout
        : this.autoLogoutTimeout;
    },
  },
  watch: {
    autoLogoutTimeout: {
      immediate: true,
      handler(value) {
        this.newautoLogoutTimeout = value;
      },
    },
  },
  mounted() {
    this.$http.post("check2fa/").then((response) => {
      if (response.data === "ON") {
        this.is2faOff = false;
      }
      if (response.data === "OFF") {
        this.is2faOff = true;
      }
    });
  },
  methods: {
    start2FAON() {
      this.twofaStepNumber = 2;
      this.makeQR();
    },

    start2FAOFF() {
      this.twofaStepNumber = 3;
    },

    startPreCheckGoogleCode() {
      this.twofaStepNumber = 4;
    },

    startChangeTime() {
      this.twofaStepNumber = 5;
    },

    finish2FAON() {
      this.googleCodeToPreCheck = "";
      this.errtextPreCheck = "";
      this.twofaStepNumber = 1;
    },

    finishChangeTime() {
      this.twofaStepNumber = 1;
    },

    checkFaLength(faProp) {
      if (this[faProp].length > 6) this[faProp] = this[faProp].slice(0, 6);
    },

    checkSecret() {
      this.$http
        .post("remove2fa/", {
          secretcode: this.secretkeyToDisable,
        })
        .then(
          () => {
            this.errtext = "";
            this.is2faOff = true;
            this.twofaStepNumber = 1;
            this.secretkeyToDisable = "";
            setTimeout(() => {
              this.$notify({
                type: "success",
                title: ``,
                text: `
                  ${this.$t("common.modal2faoff1")}
                  ${this.$t("common.modal2faoff2")}
                `,
              });
            }, 1000);
          },
          () => {
            this.errtext = this.$t("common.invalid_code");
          }
        );
    },

    preCheckGoogleCode() {
      this.$http
        .post("checkotp/", {
          secret: this.secretkey,
          code: this.googleCodeToPreCheck,
        })
        .then(
          (response) => {
            if (response.body["code"] && response.body["code"] === "expire") {
              this.$notify({
                type: "error",
                text: this.$t("common.oldSecret"),
              });

              this.createNew2FaCode();

              this.twofaStepNumber = 2;

              return;
            }

            if (
              typeof response.body["Status"] !== "undefined" &&
              response.body["Status"]
            ) {
              this.errtextPreCheck = "";
              this.googleCodeToPreCheck = "";
              this.set2fa();
            } else {
              this.errtextPreCheck = this.$t("common.invalid_code");
            }
          },
          () => {
            this.errtextPreCheck = this.$t("common.internalError");
          }
        );
    },

    setNewLogoutTimeout() {
      let self = this;
      if (self.newautoLogoutTimeout) {
        let newTime = parseFloat(self.newautoLogoutTimeout);

        if (newTime < 60) {
          this.errtextChangeTime = "";
          setTimeout(function () {
            self.errtextChangeTime = self.$t("common.min_time");
          }, 400);
        } else if (newTime !== self.autoLogoutTimeout) {
          this.$http
            .post("profile/", {
              auto_logout_timeout: newTime,
            })
            .then(
              () => {
                self.newAutoLogoutTimeout = self.newautoLogoutTimeout;
                self.twofaStepNumber = 1;
                self.$store.commit(PROFILE_AUTO_LOGOUT_TIMEOUT, newTime);
                self.newautoLogoutTimeout = "";
                self.errtextChangeTime = "";
                setTimeout(() => {
                  this.$notify({
                    type: "success",
                    title: ``,
                    text: `${this.$t("common.modalInfoChangeTime")}`,
                  });
                }, 1000);
              },
              () => {
                this.errtextChangeTime = "";
                setTimeout(function () {
                  self.errtextChangeTime = self.$t("common.try_again");
                }, 400);
              }
            );
        } else {
          this.errtextChangeTime = "";
          setTimeout(function () {
            self.errtextChangeTime = self.$t("common.enter_new_time");
          }, 400);
        }
      } else {
        this.errtextChangeTime = "";
        setTimeout(function () {
          self.errtextChangeTime = self.$t("common.enter_new_time");
        }, 400);
      }
    },

    set2fa() {
      this.$http
        .post("set2fa/", {
          secretcode: this.secretkey,
        })
        .then(() => {
          this.is2faOff = false;
          this.twofaStepNumber = 1;
          this.errtextPreCheck = "";
          setTimeout(() => {
            this.$notify({
              type: "success",
              title: ``,
              text: `
                  ${this.$t("common.modal2fa1")}
                  ${this.$t("common.modal2fa2")}
                  ${this.$t("common.modal2fa3")}
                `,
            });
          }, 1000);
        });
    },

    makeQR() {
      this.createNew2FaCode().then(() => {
        let typeNumber = 0;
        let errorCorrectionLevel = "L";
        let qr = qrcode(typeNumber, errorCorrectionLevel);
        let username = this.profile.user.username;
        let url = `otpauth://totp/${this.localConfig.project_title}-2fa-${username}?secret=${this.secretkey}`;
        qr.addData(url);
        qr.make();

        this.qrCodeImgTag = qr.createImgTag(5, 3);
      });
    },

    createNew2FaCode() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("gen_secret/")
          .then(({ data }) => {
            this.secretkey = data;
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },

    toggleIpNotification() {
      this.$http
        .post("profile/", {
          email_ip_changed: !this.enabledIpNotifications,
        })
        .then((response) => {
          this.enabledIpNotificationsLive = response.data.email_ip_changed;
        });
    },
    toggleLoginNotification() {
      this.$http
        .post("profile/", {
          email_failed_login: !this.enabledLoginNotifications,
        })
        .then((response) => {
          this.enabledLoginNotificationsLive = response.data.email_failed_login;
        });
    },

    sendPhone() {
      if (
        (!this.profile.phone && !this.profile.phone !== null) ||
        !this.profile.withdrawals_sms_confirmation
      ) {
        this.phoneVerifyType = "phone";
      } else {
        this.phoneVerifyType = "disable_sms_withdrawals";
      }
      this.addPhone = true;
    },
    verifiedPhone() {
      this.addPhone = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.walletlist.user-account_setting {
  height: auto;
  min-height: 500px;
  width: 100%;
}
.user-account_setting {
  margin-bottom: 0;
}

.table__row {
  display: flex;
  align-items: center;
}

.table__button {
  text-align: center;
}

.table__button,
.table__status {
  width: 25%;
}

.table__button button {
  background-color: var(--theme-primary-color);
  color: rgb(255, 255, 255);
  width: 100px;
  height: 35px;
  font-weight: 600;
  font-size: 15px;
  line-height: 1;
  border-radius: 3px;
}

.walletTable__item_val1 {
  display: flex;
  align-items: center;
  padding: 15px;
}

@media screen and (max-width: 480px) {
  .table__row {
    flex-wrap: wrap;
  }
  .table__status {
    width: 50%;
    padding-right: 15px;
    justify-content: flex-end;
  }
  .table__button {
    width: 100%;
    margin-bottom: 15px;
  }
}
.secret-key__profile {
  font-size: 18px;
  word-break: break-word;
}
#qrcode img {
  display: inline-block;
}
</style>

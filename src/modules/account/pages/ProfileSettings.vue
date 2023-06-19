<template>
  <div>
    <div class="grid xl:grid-cols-2 gap-4">
      <div>
        <setting-section></setting-section>
        <div class="walletlist" style="width: 100%; height: 500px">
          <div style="height: 390px">
            <div class="personal-info-wrapper">
              <PersonalInfoSettings :profile="profile" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <password-change-section></password-change-section>
        <div
          v-if="profile?.kyc_enabled"
          class="walletlist"
          style="width: 100%; height: 500px; padding-top: 10px"
        >
          <div class="settings__NAME">
            {{ $t("common.verificationTitle") }}
          </div>
          <div class="setting-table">
            <div class="setting-table_item">
              <div>
                <span class="text-capitalize"
                  >KYC {{ $t("common.verificationTitle") }}</span
                >
              </div>
              <div class="setting-table_item-actions" style="text-align: right">
                <span
                  v-if="profile.kyc_status === 'green'"
                  class="itemStatusUp"
                >
                  Good
                </span>
                <span
                  v-else-if="profile.kyc_status === 'red-final'"
                  class="itemStatusDown"
                >
                  Bad
                </span>
                <router-link
                  v-else-if="kycBtnVerifyEnabled"
                  to="/kyc"
                  class="btn btn-primary font-weight-bold"
                >
                  {{ $t("common.kyc_verify") }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalInfoSettings from "../components/PersonalInfoSettings.vue";
import SettingSection from "../components/SettingSection.vue";
import accountSettingMixin from "../components/mixin";
import PasswordChangeSection from "../components/PasswordChangeSection.vue";
import { mapGetters } from "vuex";

export default {
  name: "AccountSettings",
  metaInfo() {
    return {
      title: this.$t("pages.titles.settings"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.settingsDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    PasswordChangeSection,
    SettingSection,
    PersonalInfoSettings,
  },
  mixins: [accountSettingMixin],
  computed: {
    ...mapGetters({
      profile: "core/profile",
    }),

    kycBtnVerifyEnabled() {
      return (
        this.profile.kyc_status === "no" ||
        this.profile.kyc_status === "red-retry"
      );
    },
  },
  watch: {
    twofaStepNumber(val) {
      if (val === 3 || val === 4) {
        const self = this;

        setTimeout(() => {
          self.$refs.secretkey.focus();
        }, 500);
      }
    },
  },
  beforeUnmount() {
    this.logoutTimeout && clearTimeout(this.logoutTimeout);
  },
  methods: {
    increase2FAStepNumber(col) {
      this.twofaStepNumber += col;
    },
    decrease2FAStepNumber(col) {
      this.twofaStepNumber -= col;
    },
  },
};
</script>

<style lang="scss">
button {
  border: none;
  background-color: transparent;
  outline: none;
}

input[type="password"]::-webkit-input-placeholder {
  opacity: 0.6;
  font-size: 19px;
}

.twofaPmargintop {
  margin-top: 60px;
  font-size: 16px;
  margin-bottom: 13px;
}

.secret-key-container {
  margin: 0 auto;
}

.fa-buttons {
  height: 55px;
  width: 250px;
  float: right;
}

.personal-info-wrapper {
  padding: 10px 0;
}

.setting-table {
  &_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > div {
      padding: 15px;
    }

    &-actions {
      width: 25%;
      text-align: center;
      .btn {
        width: 100px;
        font-size: 14px !important;
      }
    }
  }
}
.profile-settings__wrap {
  max-width: 1432px;
  margin: 0 auto;
}
.settings__NAME {
  padding: 15px 15px 15px;
}
@media screen and (max-width: 650px) {
  .personal-info-wrapper,
  .settings__NAME,
  .walletTable__item_val1 {
    padding-left: 15px;
  }

  .fa-buttons {
    float: initial;
    margin: 0 auto;
  }

  .secret-key {
    font-size: 1.2rem;
  }
}

@media screen and (max-width: 500px) {
  .settings-block {
    button {
      width: 86px !important;
    }
  }
}

@media screen and (max-width: 1199px) {
  .twofaPmargintop {
    margin-top: 5px;
  }
}
</style>

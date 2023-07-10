<template>
  <div class="modal-dialog wallet-modal modal-lg" role="document">
    <div class="modal-content" style="border-radius: 3px; font-size: 25px">
      <div class="modal-body">
        <div v-if="advcash_payout_form_view === 'pending'" class="callout">
          <h3>{{ $t("common.withdrawal") }} {{ currency }}</h3>
          <hr />
          <form @submit.prevent="goToWithdrawal">
            <p class="title">
              {{ $t("common.amount") }}
              <span style="font-size: 12px">
                (
                {{ $t("common.min") }}:
                <b>{{ coin.limits.withdrawal.min }}</b>
                {{ currency }}
                {{ $t("common.max") }}:
                <b>{{ coin.limits.withdrawal.max }}</b>
                {{ currency }}
                )
              </span>
            </p>
            <input
              id="amount"
              v-model="amount"
              v-numeric.number.decimal
              :min="coin.limits.withdrawal.min"
              :max="coin.limits.withdrawal.max"
              class="form-control input-modal form-control-modal"
              type="number"
              autocomplete="off"
              name="amount"
            />
            <p class="title">
              {{ $t("common.amounttowww") }}
            </p>
            <input
              v-numeric.number.decimal
              :value="finalAmount"
              class="form-control form-control-modal"
              type="text"
              maxlength="16"
              autocomplete="off"
              name="finalAmount"
              style="margin-bottom: 8px"
              readonly
              disabled
            />
            <button
              type="submit"
              class="btn text-uppercase modal-action-button"
            >
              {{ $t("common.withdrawal") }}
              <img
                width="20"
                class="float-right"
                float-right
                src="/public/img/long-arrow-right.svg"
              />
            </button>
            <div class="error-modal">{{ error }}</div>
          </form>
        </div>
        <!--SUCCESS-->
        <div
          v-if="advcash_payout_form_view === 'success'"
          style="border-left: none; margin-bottom: 0px; font-size: 19px"
        >
          <img
            class="inline-block"
            src="/public/img/check-circle.svg"
            width="20"
            alt=""
          />
          <h3 style="text-align: center">{{ $t("common.success") }}</h3>
          <br />
          <p style="text-align: center; font-weight: 400">
            {{ $t("common.withdrawalprocessing") }}
          </p>
          <br />
          <p style="text-align: center; font-size: 16px">
            {{ $t("common.checkyouremail") }}
          </p>
          <div class="withdrawal__btnWrapper">
            <div class="big_btn" @click="$router.go()">
              {{ $t("common.continue") }}
            </div>
          </div>
        </div>
        <!--SUCCESS-->
        <template v-if="advcash_payout_form_view === 'confirm_by_sms'">
          <div>
            <phoneVerify
              verify-type="withdrawal"
              @verified-phone="verifiedPhone"
            />
            <div style="text-align: right">
              <button
                class="opacitychangebtn btn-danger"
                style="
                  opacity: 0.85;
                  color: rgb(255, 255, 255);
                  width: 100px;
                  height: 35px;
                  font-weight: 600 !important;
                  font-size: 15px !important;
                  line-height: 1;
                  border-radius: 3px;
                "
                @click="advcash_payout_form_view = 'pending'"
              >
                {{ $t("common.cancel") }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import phoneVerify from "~/components/PhoneVerify.vue";
export default {
  name: "WalletWithdrawP2PModal",
  components: {
    phoneVerify,
  },
  mixins: [getFixedDecimal],
  props: {
    currency: {
      type: String,
      require: true,
      default: "",
    },
  },
  data() {
    return {
      advcash_payout_form_view: "pending",
      amount: "",
      error: "",
      sms_code: null,
    };
  },
  computed: {
    ...mapGetters({ coins: "core/coins", profile: "core/profile" }),
    finalAmount() {
      if (this.amount >= this.coin.limits.withdrawal.min) {
        return this.amount - this.coin.fee.withdrawal.address;
      }
      return 0.0;
    },
    coin() {
      return this.coins[this.currency];
    },
  },
  watch: {
    amount(to) {
      this.amount = Math.min(to, this.coin.limits.withdrawal.max);
    },
  },
  methods: {
    submitForm() {
      if (this.profile.withdrawals_sms_confirmation) {
        this.advcash_payout_form_view = "confirm_by_sms";
      } else {
        this.withdrawal();
      }
    },
    withdrawal() {
      let config = {
        currency: this.currency,
        amount: this.addSpaceFixDecimal(this.amount, 2),
        gate_id: 7,
      };

      if (this.sms_code) {
        config.sms_code = this.sms_code;
      }

      this.$http.post("sci/withdrawal/", config).then(
        () => {
          this.advcash_payout_form_view = "success";
          this.amount = "";
          this.error = "";
        },
        (err) => {
          if (
            err.status === 500 &&
            err.data.slice(0, 60) ===
              'Exception at /api/v1/sci/withdrawal/\n"Сумма к получен'
          ) {
            this.error = this.$t("common.not_enough_fee");
          } else if (
            err.data["detail"] &&
            err.data["detail"] === "NotEnoughFunds"
          ) {
            this.error = this.$t("common.not_enough_funds");
          } else if (err.data["amount"]) {
            if (err.data.amount[0] === "A valid number is required.") {
              this.error = this.$t("common.invalid_number");
            } else if (
              err.data.amount[0] ===
              "Ensure this value is greater than or equal to 0."
            ) {
              this.error = this.$t("common.negative_amount");
            } else if (err.data.amount[0] === "This field may not be null.") {
              this.error = this.$t("common.amount_field_needed");
            }
          } else if (err.data["non_field_errors"]) {
            if (
              err.data["non_field_errors"][0] ===
              "amount should be greater than 0"
            ) {
              this.error = this.$t("common.negative_amount");
            } else if (
              err.data["non_field_errors"][0].slice(0, 17) ===
              "Minimal amount is"
            ) {
              this.error = this.$t("common.check_min_limit");
            } else if (
              err.data["non_field_errors"][0].slice(0, 8) === "Limit is"
            ) {
              this.error = this.$t("common.check_max_limit");
            }
          } else if (err.data[0]) {
            if (err.data[0] === "Payouts freezed") {
              this.error = this.$t("common.payouts_freezed");
            }
          } else if (err.status === 500) {
            this.error = this.$t("common.error");
          } else if (err.status === 400) {
            if (err.data["recipient"]) {
              if (err.data["recipient"][0] === "Enter a valid email address.") {
                this.error = this.$t("common.not_valid_email");
              } else if (
                err.data["recipient"][0] === "This field may not be blank."
              ) {
                this.error = this.$t("common.enter_email");
              } else {
                this.error = this.$t("common.not_valid_email");
              }
            }
          } else {
            this.error = this.$t("common.error");
          }
        }
      );
    },
    goToWithdrawal() {
      if (this.profile.withdrawals_sms_confirmation) {
        this.advcash_payout_form_view = "confirm_by_sms";
      } else {
        this.submitForm();
      }
    },
    verifiedPhone(code) {
      this.sms_code = code;
      this.advcash_payout_form_view = "pending";
      this.withdrawal();
    },
  },
};
</script>

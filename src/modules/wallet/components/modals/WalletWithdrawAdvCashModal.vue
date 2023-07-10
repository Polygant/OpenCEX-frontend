<template>
  <div class="modal-dialog wallet-modal modal-sm" role="document">
    <div class="modal-content" style="border-radius: 3px; font-size: 25px">
      <div class="modal-body">
        <div v-if="advcash_payout_form_view === 'pending'" class="callout">
          <h3>{{ $t("common.withdrawal") }} {{ currency }}</h3>
          <hr />
          <form @submit.prevent="WWWMewithADVCASH">
            <p class="title">
              {{ $t("common.amount") }}
              <span style="font-size: 12px">
                (
                {{ $t("common.min") }}:
                <b>{{ coins[currency].limits.withdrawal.min }}</b>
                {{ currency }}
                {{ $t("common.max") }}:
                <b>{{ coins[currency].limits.withdrawal.max }}</b>
                {{ currency }}
                )
              </span>
            </p>
            <input
              id="amount"
              v-model="amount"
              v-numeric.number.decimal
              class="form-control form-control-modal input-modal"
              type="text"
              autocomplete="off"
              name="amount"
            />
            <p class="title">
              {{ $t("common.amounttowww") }}
            </p>
            <label
              style="
                text-align: left;
                line-height: 41px;
                font-size: 16px;
                font-weight: 600;
                text-indent: 11px;
                background: none;
                border: 1px solid #e3e3e3;
                border-radius: 5px;
                height: 42px;
                width: 100%;
              "
            >
              <span v-if="amount >= coins[currency].limits.withdrawal.min">
                {{
                  (
                    amount *
                    (1 - coins[currency].fee.withdrawal.advcash / 100)
                  ).toFixed(2)
                }}
              </span>
              <span
                v-if="amount < coins[currency].limits.withdrawal.min || !amount"
                >0.00</span
              >
            </label>
            <p
              class="title"
              style="margin-top: 20px; font-size: 16px; text-align: left"
            >
              {{ $t("common.targetAdvCash") }}
            </p>
            <input
              id="targetRecipient"
              v-model="targetRecipient"
              class="form-control input-moda form-control-modal"
              type="text"
              autocomplete="off"
              name="targetRecipient"
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
            class="inline-block mt-4"
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
        </div>
        <div class="withdrawal__btnWrapper">
          <div class="big_btn" @click="$router.go()">
            {{ $t("common.continue") }}
          </div>
        </div>
        <!--SUCCESS-->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletWithdrawAdvCashModal",
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
      targetRecipient: "",
    };
  },
  computed: {
    ...mapGetters({ coins: "core/coins" }),
  },
  methods: {
    WWWMewithADVCASH() {
      if (this.isBlockedByPhoneVerification) return;

      const config = {
        currency: this.currency,
        amount: this.addSpaceFixDecimal(this.amount, 2),
        gate_id: 2,
        data: { recipient: this.targetRecipient },
      };

      this.$http.post("sci/withdrawal/", config).then(
        () => {
          this.advcash_payout_form_view = "success";
          this.amount = "";
          this.error = "";
          this.targetRecipient = "";
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
  },
};
</script>

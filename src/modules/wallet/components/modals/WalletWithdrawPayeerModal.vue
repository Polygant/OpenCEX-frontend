<template>
  <div class="modal-dialog wallet-modal modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div
          v-if="method === '' && payeer_payout_form_view === 'pending'"
          class="method-select"
          style="border-left: none; margin-bottom: 0px; text-align: center"
        >
          <h3>{{ currency }} {{ $t("common.methods") }}</h3>
          <hr />
          <button
            type="submit"
            class="btn modal-action-button"
            @click="setmethod('mastercard')"
          >
            Mastercard
            <span>3.9% + 45RUB {{ $t("common.fee_eng") }}</span>
          </button>
          <button
            type="submit"
            class="btn modal-action-button"
            @click="setmethod('visa')"
          >
            Visa
            <span>3.9% + 45RUB {{ $t("common.fee_eng") }}</span>
          </button>
          <button
            type="submit"
            class="btn modal-action-button"
            @click="setmethod('payeer')"
          >
            Payeer
            <span>0.95% {{ $t("common.fee_eng") }}</span>
          </button>
        </div>
        <div
          v-if="method !== '' && payeer_payout_form_view === 'pending'"
          class="callout"
          style="border-left: none; margin-bottom: 0px; text-align: center"
        >
          <h3>{{ currency }} {{ $t("common.withdrawal") }}</h3>
          <hr />
          <form @submit.prevent="withdraw">
            <p class="title">
              {{ $t("common.amount") }}
              <span>
                (
                {{ $t("common.min") }}:
                <b>{{ depositLimits.min }}</b>
                {{ currency }}
                {{ $t("common.max") }}:
                <b>{{ depositLimits.max }}</b>
                {{ currency }}
                )
              </span>
            </p>
            <input
              v-model="amount"
              v-numeric.number.decimal
              class="form-control input-modal"
              type="text"
              autocomplete="off"
            />
            <br />
            <p v-if="method === 'mastercard'" class="title title--system">
              {{ $t("common.cardnumber") }}&nbsp;&nbsp;(Mastercard)
            </p>
            <p v-if="method === 'visa'" class="title title--system">
              {{ $t("common.cardnumber") }}&nbsp;&nbsp;(Visa)
            </p>
            <p v-if="method === 'payeer'" class="title title--system">
              {{ $t("common.payeeracc") }}&nbsp;&nbsp;(Payeer)
            </p>

            <input
              v-if="method === 'payeer'"
              v-model="cardNumber"
              class="form-control input-modal"
              type="text"
              autocomplete="off"
            />
            <input
              v-else
              v-model="cardNumber"
              v-numeric.number
              class="form-control input-modal"
              type="text"
              autocomplete="off"
            />
            <button
              type="submit"
              :disabled="!isAmountInLimits"
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
            <div class="error-modal">{{ errorMessage }}</div>
          </form>
        </div>
        <div v-if="payeer_payout_form_view === 'success'" class="success">
          <img
            class="inline-block"
            src="/public/img/check-circle.svg"
            width="20"
            alt=""
          />
          <h3 style="text-align: center">{{ $t("common.success") }}</h3>
          <p>{{ $t("common.withdrawalprocessing") }}</p>
          <p>{{ $t("common.checkyouremail") }}</p>
        </div>
        <div class="withdrawal__btnWrapper">
          <div class="big_btn" @click="$router.go()">
            {{ $t("common.continue") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "~/app-config";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletWithdrawPayeerModal",
  mixins: [getFixedDecimal],
  props: {
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      amount: "",
      method: "",
      cardNumber: "",
      errorMessage: "",
      payeer_payout_form_view: "pending",
    };
  },
  computed: {
    coins() {
      return this.$store.getters["core/coins"];
    },
    depositLimits() {
      return this.coins[this.currency].limits.withdrawal[
        config.PaySystems.payeer
      ];
    },
    isAmountInLimits() {
      const { amount, depositLimits } = this;
      return (
        Number.parseFloat(amount) >= depositLimits.min &&
        Number.parseFloat(amount) <= depositLimits.max
      );
    },
  },
  methods: {
    setmethod(method) {
      this.method = method;
    },
    withdraw() {
      const config = {
        currency: this.currency,
        amount: this.addSpaceFixDecimal(this.amount, 2),
        gate_id: 3,
        data: {
          payment_system: this.method.toUpperCase(),
          recipient_account: this.cardNumber,
        },
      };

      this.$http.post("sci/withdrawal/", config).then(
        () => {
          this.payeer_payout_form_view = "success";
        },
        (err) => {
          if (
            err.status === 500 &&
            err.data.slice(0, 60) ===
              'Exception at /api/v1/sci/withdrawal/\n"Сумма к получен'
          ) {
            this.errorMessage = this.$t("common.not_enough_fee");
          } else if (
            err.data["detail"] &&
            err.data["detail"] === "NotEnoughFunds"
          ) {
            this.errorMessage = this.$t("common.not_enough_funds");
          } else if (err.data["amount"]) {
            if (err.data.amount[0] === "A valid number is required.") {
              this.errorMessage = this.$t("common.invalid_number");
            } else if (
              err.data.amount[0] ===
              "Ensure this value is greater than or equal to 0."
            ) {
              this.errorMessage = this.$t("common.negative_amount");
            } else if (err.data.amount[0] === "This field may not be null.") {
              this.errorMessage = this.$t("common.amount_field_needed");
            }
          } else if (err.data["non_field_errors"]) {
            if (
              err.data["non_field_errors"][0] ===
              "amount should be greater than 0"
            ) {
              this.errorMessage = this.$t("common.negative_amount");
            } else if (
              err.data["non_field_errors"][0].slice(0, 17) ===
              "Minimal amount is"
            ) {
              this.errorMessage = this.$t("common.check_min_limit");
            } else if (
              err.data["non_field_errors"][0].slice(0, 8) === "Limit is"
            ) {
              this.errorMessage = this.$t("common.check_max_limit");
            } else if (
              err.data["non_field_errors"][0] ===
              "Invalid recipient account format"
            ) {
              if (this.method === "visa" || this.method === "mastercard") {
                this.errorMessage = this.$t("common.invalid_card_number");
              } else {
                this.errorMessage = this.$t("common.invalid_payeer_accaunt");
              }
            }
          } else if (err.data["recipient_account"]) {
            if (
              err.data["recipient_account"][0] ===
              "This field may not be blank."
            ) {
              if (this.method === "visa" || this.method === "mastercard") {
                this.errorMessage = this.$t("common.enter_card_number");
              } else {
                this.errorMessage = this.$t("common.enter_payeer_accaunt");
              }
            }
          } else if (err.data[0]) {
            if (err.data[0] === "Payouts freezed") {
              this.errorMessage = this.$t("common.payouts_freezed");
            }
          } else if (err.status === 500) {
            this.errorMessage = this.$t("common.wrong_data");
          } else {
            this.errorMessage = this.$t("common.try_later");
          }
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.method-select {
  span {
    float: right;
    font-size: 13px;
    padding-top: 3px;
  }
}

.title {
  &--system {
    font-size: 16px;
    text-align: left;
    padding-top: 20px;
  }
}

.success {
  border-left: none;
  margin-bottom: 0px;
  font-size: 19px;

  .fa {
    text-align: center;
    color: var(--theme-primary-color);
    display: inline-block;
    width: 100%;
  }

  p {
    text-align: center;
    margin-top: 15px;
  }
}
</style>

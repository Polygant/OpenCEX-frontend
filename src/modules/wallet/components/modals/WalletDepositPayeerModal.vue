<template>
  <div class="modal-dialog wallet-modal modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <h3>{{ $t("common.deposit_low") }} {{ currency }}</h3>
        <hr />
        <form @submit.prevent="deposit">
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
          <button
            type="submit"
            :disabled="!isAmountInLimits"
            class="btn modal-action-button"
          >
            {{ $t("common.topup") }}
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
    </div>
  </div>
</template>
<script>
import config from "~/app-config";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletDepositPayeerModal",
  mixins: [getFixedDecimal],
  props: {
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: "",
      amount: "",
    };
  },
  computed: {
    coins() {
      return this.$store.getters["core/coins"];
    },
    depositLimits() {
      return this.coins[this.currency].limits.deposit[config.PaySystems.payeer];
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
    deposit() {
      this.$http
        .post("sci/topup/", {
          currency: this.currency,
          amount: this.addSpaceFixDecimal(this.amount, 2),
          gate_id: 3,
        })
        .then(
          (response) => {
            window.location.href = response.data["url"];
          },
          (err) => {
            console.error(err.data);

            if (err.data["amount"]) {
              if (err.data.amount[0] === "A valid number is required.") {
                this.errorMessage = this.$t("common.invalid_number");
              } else if (
                err.data.amount[0] ===
                "Ensure this value is greater than or equal to 0."
              ) {
                this.errorMessage = this.$t("common.negative_amount");
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
              }
            } else {
              this.errorMessage = this.$t("common.error");
            }
          }
        );
    },
  },
};
</script>

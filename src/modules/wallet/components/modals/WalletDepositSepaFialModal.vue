<template>
  <div :class="!showPaymentDetails ? 'wallet-modal modal-dialog modal-sm' : ''">
    <div class="modal-content">
      <div class="modal-body">
        <h3 style="text-align: center">
          {{ $t("common.deposit_low") }} {{ currency }}
        </h3>
        <hr />
        <template v-if="showPaymentDetails">
          <SepaDetails :id="sepaId" />
        </template>
        <template v-else>
          <form @submit.prevent="topup">
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
            <p class="title">
              {{ $t("common.youllget") }}
            </p>
            <label class="server-fee">
              {{ amountWithFee }}
            </label>
            <p class="modal-dialog-paragraph modal-dialog-paragraph--checkbox">
              <label for="tosRefundPolicy">
                <input
                  id="tosRefundPolicy"
                  v-model="tosRefundPolicyUserAgree"
                  type="checkbox"
                />
                <span>{{ $t("common.iAgree") }}</span>
                <a
                  href="/public/docs/EN_User_Agreement_site.pdf"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  >{{ $t("common.tos") }}</a
                >
              </label>
            </p>
            <p class="modal-dialog-paragraph modal-dialog-paragraph--checkbox">
              <label for="personal-card">
                <input id="personal-card" v-model="myCard" type="checkbox" />
                <span>{{ $t("common.sepaAgree") }}</span>
              </label>
            </p>
            <button
              type="submit"
              :disabled="buttonBlocked"
              class="btn modal-action-button"
            >
              {{ $t("common.continue") }}
              <img
                width="20"
                class="float-right"
                float-right
                src="/public/img/long-arrow-right.svg"
              />
            </button>
            <div class="error-modal">{{ errorMessage }}</div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SepaDetails from "./SepaDetails.vue";

export default {
  name: "WalletDepositAddress",
  components: { SepaDetails },
  props: {
    currency: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      errorMessage: "",
      showPaymentDetails: false,
      amount: "",
      myCard: false,
      tosRefundPolicyUserAgree: false,
      sepaId: "",
    };
  },
  computed: {
    amountWithFee() {
      const { depositLimits } = this;
      const amount = Number.parseFloat(this.amount);
      if (amount >= depositLimits.min && amount <= depositLimits.max) {
        return this.amount * (1 - 0.01 * this.depositFee.sepa);
      } else {
        return 0;
      }
    },
    buttonBlocked() {
      return (
        !this.tosRefundPolicyUserAgree ||
        Number.parseFloat(this.amountWithFee) === 0 ||
        !this.myCard
      );
    },
    coins() {
      return this.$store.getters["core/coins"];
    },
    limits() {
      return this.coins[this.$props.currency].limits;
    },
    depositFee() {
      return this.coins[this.$props.currency].fee.deposit;
    },
    depositLimits() {
      return this.limits.deposit.sepa;
    },
  },
  methods: {
    topup() {
      this.$http
        .post("sci/topup/", {
          currency: this.currency,
          amount: this.amount,
          gate_id: 6,
        })
        .then(
          (response) => {
            this.sepaId = response.data.remittance_id;
            this.showPaymentDetails = true;
          },
          () => {}
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.error-modal {
  text-align: center;
}
</style>

<template>
  <div class="modal-dialog modal-sm wallet-modal" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <h3>{{ currency }} {{ $t("common.withdrawal") }}</h3>
        <hr />
        <form @submit.prevent="withdraw">
          <p class="title">
            {{ $t("common.amount") }}
            <span>
              (
              {{ $t("common.min") }}:
              <b>{{ withdrawLimits.min }}</b>
              {{ currency }}
              {{ $t("common.max") }}:
              <b>{{ withdrawLimits.max }}</b>
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
            {{ $t("common.amounttowww") }}
          </p>
          <label class="server-fee">
            {{
              $config.currentWithdrawCardPaySystem === $config.PaySystems.cauri
                ? serverWithdrawCalculatedFee
                : fiatWithdrawCalculatedWithFee
            }}
          </label>
          <br />
          <p class="title">{{ $t("common.cardnumber") }}&nbsp;</p>
          <input
            v-model="cardNumber"
            v-numeric.number
            class="form-control input-modal"
            type="text"
            autocomplete="off"
          />
          <template
            v-if="
              $config.currentWithdrawCardPaySystem ===
                $config.PaySystems.cauri && currency === 'EUR'
            "
          >
            <p class="title">
              {{ $t("common.country") }}
            </p>
            <CountrySelect
              class="wallet-country"
              @change-value="onSelectCountry"
            />
          </template>
          <button
            type="submit"
            class="btn text-uppercase modal-action-button"
            :disabled="!isInLimits || cardNumber.length < 12"
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
    </div>
  </div>
</template>

<script>
import config from "~/app-config";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import CountrySelect from "~/components/ui/CountrySelect.vue";

export default {
  name: "WalletWithdrawFiatModal",
  components: {
    CountrySelect,
  },
  mixins: [getFixedDecimal],
  props: {
    currency: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      interkassaWithdrawalFees: {
        USD: {
          qiwi: {
            percent: 5,
            add: 0,
          },
          advcash: {
            percent: 2,
            add: 0,
          },
        },
        EUR: {
          visa: {
            percent: 3.5,
            add: 0.2,
          },
          mastercard: {
            percent: 3.5,
            add: 0.2,
          },
        },
      },
      serverWithdrawCalculatedFee: "0.00",
      amount: "",
      cardNumber: "",
      currentWithdrawCardPaySystem: config.currentWithdrawCardPaySystem,
      errorMessage: "",
      cauriEuroDetails: {
        country: "",
        city: "",
        birth_day: "",
        cardholder: "",
        expire_month: "",
        expire_year: "",
      },
    };
  },
  computed: {
    fiatWithdrawCalculatedWithFee() {
      const { withdrawLimits, currency, method } = this;
      const amount = Number.parseFloat(this.amount);
      const fee =
        this.coins[currency].fee.withdrawal[
          this.$config.currentWithdrawCardPaySystem
        ];

      if (amount >= withdrawLimits.min && amount <= withdrawLimits.max) {
        const result =
          amount * (1 - fee[method]["percent"] / 100) - fee[method]["add"];
        return result > 0 ? result.toFixed(2) : "0.00";
      } else {
        return "0.00";
      }
    },
    coins() {
      return this.$store.getters["core/coins"];
    },
    limits() {
      return this.coins[this.$props.currency].limits;
    },
    withdrawLimits() {
      return this.limits.withdrawal[this.currentWithdrawCardPaySystem];
    },
    isInLimits() {
      return (
        this.withdrawLimits.max >=
          parseFloat(this.fiatWithdrawCalculatedWithFee) &&
        this.withdrawLimits.min <=
          parseFloat(this.fiatWithdrawCalculatedWithFee)
      );
    },
  },
  watch: {
    $route() {
      this.$modal.close();
    },
    amount() {
      const { currency, method, withdrawLimits } = this;
      const amount = Number.parseFloat(this.amount);

      if (
        this.$config.currentWithdrawCardPaySystem ===
          this.$config.PaySystems.cauri &&
        (method === "visa" || method === "mastercard") &&
        (currency === "RUB" || currency === "EUR") &&
        parseFloat(amount) >= withdrawLimits.min &&
        parseFloat(amount) <= withdrawLimits.max
      ) {
        this.calculateWithdrawFeeOnServer({
          target_amount: parseFloat(amount),
          currency: currency,
          gate_id: 5,
        });
      } else {
        this.clearServerWithdrawCalculatedFee();
      }
    },
  },
  methods: {
    onSelectCountry(value) {
      if (this.cauriEuroDetails.country !== value) {
        this.cauriEuroDetails.country = value;
      }
    },
    calculateWithdrawFeeOnServer(data) {
      this.$http.post("sci/withdraw_amount/", data).then((response) => {
        this.serverWithdrawCalculatedFee = response.body.amount;
      });
    },
    clearServerWithdrawCalculatedFee() {
      this.serverWithdrawCalculatedFee = "0.00";
    },
    withdraw() {
      if (
        this.$config.currentWithdrawCardPaySystem ===
        this.$config.PaySystems.cauri
      ) {
        this.WWWMewithCauri();
      } else {
        this.WWWMewithINTERKASSA();
      }
    },
    WWWMewithINTERKASSA() {
      let config;

      const cardNumber = this.cardNumber.toString();

      if (!/^(4|5|6)[0-9]{12}(?:[0-9]{3}|[0-9]{5})?$/.test(cardNumber)) {
        this.errorMessage = this.$t("common.wrong_card_number_format");
        return;
      }

      config = {
        currency: this.currency,
        amount: this.addSpaceFixDecimal(this.amount, 2),
        gate_id: 1,
        data: { method: this.method, details: { user: cardNumber } },
      };

      this.$http.post("sci/withdrawal/", config).then(
        () => {
          // this.currency = ''
          this.amount = "";
          // this.method = ''
          this.errorMessage = "";
          this.cardNumber = "";
          this.$notify({
            text: this.$t("common.withdrawSuccess"),
          });
          this.$modal.close();
        },
        (err) => {
          if (
            err.status === 500 &&
            err.data.slice(0, 60) ===
              'Exception at /api/v1/interkassa/withdrawal/\n"Сумма к получен'
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
            }
          } else if (err.data[0]) {
            if (err.data[0] === "Payouts freezed") {
              this.errorMessage = this.$t("common.payouts_freezed");
            }
          } else if (err.status === 500) {
            this.errorMessage = this.$t("common.wrong_data");
          } else {
            this.errorMessage = this.$t("common.error");
          }
        }
      );
    },
    WWWMewithCauri() {
      const cardNumber = this.cardNumber.toString();
      let config;

      if (!/^(4|5|6)[0-9]{12}(?:[0-9]{3}|[0-9]{5})?$/.test(cardNumber)) {
        this.errorMessage = this.$t("common.wrong_card_number_format");
        return;
      } else if (this.currency === "EUR") {
        const entries = Object.values(this.cauriEuroDetails);
        for (let i = 0; i < entries.length; i++) {
          const field = entries[i];
          if (field === "") {
            this.errorMessage = this.$t("common.notAllFilled");
            return;
          } else if (!/^[-\sa-zA-Z0-9]+$/.test(field)) {
            // не латиница
            this.errorMessage = this.$t("common.invalidValueString");
            return;
          }
        }
      }

      config = {
        currency: this.currency,
        amount: this.addSpaceFixDecimal(this.amount, 2),
        gate_id: 5,
        data: {
          method: this.method,
          details: {
            user: this.cardNumber,
            ...this.cauriEuroDetails,
          },
        },
      };

      if (config.data.details.birth_day) {
        const tzoffset = new Date().getTimezoneOffset() * 60000;
        config.data.details.birth_day = new Date(
          config.data.details.birth_day - tzoffset
        ).toISOString();
      }

      this.$http.post("sci/withdrawal/", config).then(
        () => {
          if (this.currency === "EUR") {
            this.clearCauriEuroDetails();
          }
          // this.currency = ''
          this.amount = "";
          // this.method = ''
          this.errorMessage = "";
          this.cardNumber = "";
          this.$notify({
            text: this.$t("common.withdrawSuccess"),
          });
          this.$modal.close();
        },
        (err) => {
          if (
            err.status === 500 &&
            err.data.slice(0, 60) ===
              'Exception at /api/v1/interkassa/withdrawal/\n"Сумма к получен'
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
            }
          } else if (err.data[0]) {
            if (err.data[0] === "Payouts freezed") {
              this.errorMessage = this.$t("common.payouts_freezed");
            }
          } else if (err.status === 500) {
            this.errorMessage = this.$t("common.wrong_data");
          } else {
            this.errorMessage = this.$t("common.error");
          }
        }
      );
      //
    },
    clearCauriEuroDetails() {
      Object.keys(this.cauriEuroDetails).forEach((field) => {
        this.cauriEuroDetails[field] = "";
      });
    },
  },
};
</script>

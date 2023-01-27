<template>
  <div class="modal-dialog modal-sm wallet-modal" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <h3>{{ $t("common.depositAccountWith") }} {{ currency }}</h3>
        <hr />
        <form
          class="cauri-modal-form"
          :class="{ 'cauri-modal-form--hidden': cauriTopUpProcess }"
          @submit.prevent="topUpMeWithCauri"
        >
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
          <template v-if="currency === 'EUR'">
            <p class="title">
              {{ $t("common.cardholder") }}
            </p>
            <input
              v-model="cardholder"
              class="form-control input-modal"
              type="text"
              autocomplete="off"
            />
          </template>
          <p class="title">
            {{ $t("common.amounttopay") }}
          </p>
          <label class="server-fee">
            {{ serverDepositCalculatedWithFee }}
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
              <span>{{ $t("common.myCard") }}</span>
            </label>
          </p>
          <button
            type="submit"
            :disabled="buttonBlocked"
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
          <p class="modal-dialog-paragraph">
            <em>{{ $t("common.noRefundNoExchange") }}</em>
          </p>
          <div class="error-modal">{{ errorMessage }}</div>
        </form>
        <template v-if="cauriTopUpProcess">
          <div id="cauriScriptContainer"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import config from "~/app-config";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletDepositFiatModal",
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
      amount: "",
      errorMessage: "",
      cardholder: "",
      myCard: false,
      cauriTopUpProcess: false,
      serverDepositCalculatedWithFee: "0.00",
      tosRefundPolicyUserAgree: false,
      topUpLegalInfo: {
        descriptor: "CAURI*OpenCEXchange OÜ",
        address: "Punane tn 56 Lasnamäe linnaosa, Tallinn Harju maakond 13619",
        contacts: {
          phone: "+3728804907",
          email: "support@opencex.exchange",
        },
      },
      currentTopUpCardPaySystem: config.currentTopUpCardPaySystem,
    };
  },
  computed: {
    buttonBlocked() {
      return (
        !this.tosRefundPolicyUserAgree ||
        this.serverDepositCalculatedWithFee === "0.00" ||
        !this.myCard ||
        this.cauriTopUpProcess ||
        !this.cardholder
      );
    },
    coins() {
      return this.$store.getters["core/coins"];
    },
    limits() {
      return this.coins[this.$props.currency].limits;
    },
    depositLimits() {
      return this.limits.deposit[this.currentTopUpCardPaySystem];
    },
  },
  watch: {
    $route() {
      this.$modal.close();
    },
    amount() {
      const { currency, method, depositLimits } = this;
      const amount = Number.parseFloat(this.amount);

      if (
        (method === "visa" || method === "mastercard") &&
        (currency === "RUB" || currency === "EUR") &&
        amount >= depositLimits.min &&
        amount <= depositLimits.max
      ) {
        this.calculateFeeOnServer({
          target_amount: amount,
          currency: currency,
          gate_id: 4,
        });
      } else {
        this.clearServerDepositCalculatedFee();
      }
    },
  },
  methods: {
    clearServerDepositCalculatedFee() {
      this.serverDepositCalculatedWithFee = "0.00";
    },
    calculateFeeOnServer(data) {
      this.$http.post("sci/topup_amount/", data).then((response) => {
        this.serverDepositCalculatedWithFee = response.body.amount;
      });
    },
    topUpMeWithCauri() {
      let self = this;
      this.cauriTopUpProcess = true;

      function addCauriScript(paramsObject) {
        const s = document.createElement("script");
        let interval = null;
        let times = 25;

        s.setAttribute("src", "https://checkout.cauri.com/widget-v1/widget.js");
        s.setAttribute("class", "cauri-widget");
        s.setAttribute("data-config-create-button", false);

        for (let field in paramsObject) {
          s.setAttribute(`data-${field}`, paramsObject[field]);
        }

        document.querySelector("#cauriScriptContainer").appendChild(s);
        const removeScriptTagFromDOM = function () {
          self.cauriTopUpProcess = false;
        };

        const hideAndRemoveScript = function () {
          self.$notify({
            text: self.$t("common.cauriError"),
            type: "error",
          });
          removeScriptTagFromDOM();
          /* eslint-disable */
          Cauri.Widget.Iframe.remove();
          /* eslint-enable */
        };

        interval = setInterval(() => {
          times -= 1;
          if ((window.Cauri && window.Cauri.Widget) || times < 0) {
            clearInterval(interval);
            /* eslint-disable */
            Cauri.Widget.Iframe.on("close", () => {
              removeScriptTagFromDOM();
            });

            Cauri.Widget.Iframe.on("fail", hideAndRemoveScript);

            Cauri.Widget.Iframe.on("success", () => {
              removeScriptTagFromDOM();
              setTimeout(() => {
                Cauri.Widget.Iframe.remove();
                self.$modal.close();
              }, 1000);
            });

            setTimeout(() => {
              Cauri.Widget.Iframe.open();
            }, 500);
            /* eslint-enable */
          }
        }, 100);
      }

      this.$http
        .post("sci/topup/", {
          currency: this.currency,
          amount: this.serverDepositCalculatedWithFee,
          gate_id: 4,
          data: { method: "visa", cardholder: this.cardholder },
        })
        .then(
          (response) => {
            addCauriScript(response.data);
          },
          (err) => {
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

            this.cauriTopUpProcess = false;
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.cauri-modal-form {
  transition: opacity 1s;

  &--hidden {
    opacity: 0;
    transition: opacity 2s;
  }
}
</style>

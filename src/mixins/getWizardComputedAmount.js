import { floor10 } from "~/utilities/helpers";
import throttle from "lodash.throttle";
import axios from "axios";
import errorManager from "~/helpers/errorHundle";

export default {
  computed: {
    coins() {
      return this.$store.getters["core/coins"];
    },
  },
  methods: {
    getWizardComputedAmount: throttle(function (isFirstStep) {
      const self = this;
      const { type, fiatCurrency, coinToGet, give, get, paySystem } =
        this.exchangeData;
      let giveCalculatedAmount = give;

      if (typeof this.dataLoading !== "undefined") {
        this.dataLoading = true;
      }

      if (!type || this.exchangeData.serverToken.step >= 9) {
        return;
      }

      const requestData = {
        base_currency: fiatCurrency,
        quote_currency: coinToGet,
        operation: 1,
        type: type,
      };

      if (type === "fiat-to-crypto") {
        if (paySystem === "SEPA") {
          const commission = this.coins[fiatCurrency].fee.deposit.sepa;
          giveCalculatedAmount = ((give / 100) * (100 - commission)).toFixed(2);
        }
        requestData.quantity = Number.parseFloat(giveCalculatedAmount) || 0;
      } else {
        requestData.quantity_alt = Number.parseFloat(get) || 0;
      }

      axios.put("exchange/", requestData).then(
        ({ data }) => {
          this.disableDataLoading();

          if (type === "fiat-to-crypto") {
            let result = data["cost"] ? data["cost"] : 0;

            if (result > 0) {
              let fee =
                result * this.coins[coinToGet]["fee"]["exchange"]["value"];
              result = floor10(result - fee, -8).toFixed(8);
            }

            this.exchangeData.get = parseFloat(result);

            if (isFirstStep) {
              this.exchangeData.INITIAL_GET = parseFloat(result);
              this.exchangeData.INITIAL_GIVE = parseFloat(
                this.exchangeData.give
              );
            }
          } else {
            const result = data["cost"]
              ? floor10(data["cost"], -2).toFixed(2)
              : 0;

            this.exchangeData.give = parseFloat(result);

            if (isFirstStep) {
              this.exchangeData.INITIAL_GIVE = result;
              this.exchangeData.INITIAL_GET = this.exchangeData.get;
            }
          }

          if (data["cost"] === null) {
            this.$notify({
              text: this.$t("common.instant_exchange"),
            });
          }
        },
        (r) => {
          this.disableDataLoading();

          if ("type" in r.data) {
            errorManager.parse(r, this, "not_suitable_pair");
          } else {
            this.$notify({
              type: "warning",
              text: self.$t("common.errorOnRequest"),
            });
          }
        }
      );
    }, 750),
    disableDataLoading() {
      const self = this;
      setTimeout(() => {
        if (typeof this.dataLoading !== "undefined") {
          self.dataLoading = false;
        }
      }, 2000);
    },
  },
};

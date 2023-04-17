import { mapGetters } from "vuex";
import { floor10 } from "~/utilities/helpers";

export default {
  computed: {
    ...mapGetters({ coins: "core/coins" }),
  },
  methods: {
    isFiat(currency) {
      try {
        return currency.toLowerCase() === "usdt";
      } catch (err) {
        console.warn("Seems like this.coins is not definedon instance");
      }
    },
    getCutted(val) {
      return Math.round((val + Number.EPSILON) * 100) / 100;
    },
    countZerosAfterDecimal(number) {
      const decimalPart = number.toString().split(".")[1];
      let zeroCount = 0;
      if (decimalPart > 0) {
        for (let i = 0; i < decimalPart.length; i++) {
          if (decimalPart[i] === "0") {
            zeroCount++;
          } else {
            break;
          }
        }
      }
      return zeroCount;
    },
    getCoolTrade(sum, cur) {
      if (sum < 1 && this.countZerosAfterDecimal(sum) > 3) {
        return floor10(sum, -8).toFixed(8);
      } else {
        sum = typeof sum !== "undefined" ? parseFloat(sum) : 0;
        let result = sum;

        if (
          cur &&
          this.isFiat(cur) &&
          ["BTC", "ETH", "BCH"].includes(this.currentBaseCurrency)
        ) {
          if (sum >= 100) {
            result = floor10(sum, -2).toFixed(2);
          } else {
            result = floor10(sum, -4).toFixed(4);
          }
        } else if (cur && this.isFiat(cur)) {
          if (sum >= 10000) {
            result = floor10(sum, 0).toFixed(0);
          } else if (sum >= 1000) {
            result = floor10(sum, -1).toFixed(1);
          } else if (sum >= 100) {
            result = floor10(sum, -2).toFixed(2);
          } else if (sum >= 10) {
            result = floor10(sum, -3).toFixed(3);
          } else {
            result = floor10(sum, -4).toFixed(4);
          }
        } else {
          result = floor10(sum, -8).toFixed(8);
        }

        return result;
      }
    },
  },
};

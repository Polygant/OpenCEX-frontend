<template>
  <div
    :class="{ 'sell-orders-sell-buy_red': !isStakanPriceRising }"
    class="sell-orders-sell-buy order-tables__sell-buy"
  >
    <div
      v-if="isCurrentPairActive"
      style="
        font-weight: 200;
        height: 59px;
        font-size: 12px;
        color: #39a462;
        padding-top: 6px;
      "
    >
      <p style="margin-bottom: 5px; color: black; font-size: 12px">
        {{ $t("common.totalsell") }}:
        <b class="total-sell-val"
          >{{
            addSpaceFixDecimal(sellVolume, coins[currentBaseCurrency].decimals)
          }}&nbsp;{{ currentBaseCurrency }}</b
        >
      </p>

      <hr style="margin: 0; border-top: 1px solid #b9d2c6" />

      <p
        style="margin-top: 5px; margin-bottom: 0; color: black; font-size: 12px"
      >
        {{ $t("common.totalbuy") }}:
        <b class="total-buy-val"
          >{{
            addSpaceFixDecimal(
              getBuyOrderVolume(),
              coins[currentQuoteCurrency].decimals
            )
          }}&nbsp;{{ currentQuoteCurrency }}</b
        >
      </p>
    </div>

    <div class="flex">
      <div
        class="total__rating"
        :style="isStakanPriceRising ? '' : 'color: #b95f5f'"
      >
        <div style="font-size: 17px">
          {{ getPriceForStakan }}
        </div>
      </div>

      <img
        v-if="isStakanPriceRising"
        src="/public/img/common/arrow-up.svg"
        alt="arrow"
        class="total__icon inline-block ml-1 mt-1"
        style="height: 14px"
      />
      <img
        v-else
        src="/public/img/common/arrow-down.svg"
        alt="arrow"
        class="total__icon inline-block ml-1 mt-1"
        style="height: 14px"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import getCoolTrade from "~/mixins/getCoolTrade";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "OrdersSellBuy",
  mixins: [getCoolTrade, getFixedDecimal],

  // eslint-disable-next-line vue/require-prop-types
  props: ["precision"],

  data() {
    return {
      currentPriceStakan: 0,
      recentTradesFirstTime: true,
    };
  },
  computed: {
    ...mapGetters({
      currentBaseCurrency: "getCurrentBaseCurrency",
      currentQuoteCurrency: "getCurrentQuoteCurrency",
      currencyPairProp: "getCurrencyPairProp",
      sellVolume: "getSellVolume",
      buyVolume: "getBuyVolume",
      coins: "core/coins",
      recenttrades: "core/recenttrades",
      isStakanPriceRising: "isStakanPriceRising",
      tradesExist: "core/tradesExist",
    }),

    isCurrentPairActive() {
      let pair =
        this.coins[this.currentQuoteCurrency]["pairs"][this.currencyPairProp];

      return !!pair?.active || "";
    },
    getPriceForStakan() {
      const price = this.currentPriceStakan;

      if (price >= 10000) {
        return this.addSpaceFixDecimal(price, 0);
      } else if (price >= 1000) {
        return this.addSpaceFixDecimal(price, 1);
      } else if (price >= 100) {
        return this.addSpaceFixDecimal(price, 2);
      } else if (price >= 10) {
        return this.addSpaceFixDecimal(price, 3);
      } else {
        return this.addSpaceFixDecimal(
          price,
          -Math.round(Math.log(this.precision || 0.01) / Math.log(10))
        );
      }
    },
  },
  watch: {
    recenttrades: {
      immediate: true,
      handler(trades) {
        if (!this.tradesExist) return;
        if (!this.recentTradesFirstTime)
          this.$store.commit(
            "setIsStakanPriceRising",
            trades[0].price >= this.currentPriceStakan
          );
        this.currentPriceStakan = trades[0].price;
        this.recentTradesFirstTime = false;
      },
    },
  },
  methods: {
    getBuyOrderVolume() {
      if (this.buyVolume) {
        if (this.isFiat(this.currentQuoteCurrency)) {
          if (this.currentBaseCurrency === "CBC") {
            return parseFloat(this.buyVolume).toFixed(4);
          } else {
            return parseFloat(this.buyVolume).toFixed(2);
          }
        } else {
          return parseFloat(this.buyVolume).toFixed(8);
        }
      } else {
        return "0";
      }
    },
  },
};
</script>

<style lang="scss">
.sell-orders-sell-buy {
  display: flex;
  align-items: center;

  &_red {
    background-color: rgba(255, 93, 85, 0.2) !important;
  }
}

.order-tables__sell-buy {
  margin: 0;
  height: 59px;
  padding: 0;
  display: flex;
  background-color: #d5f1e4;
  border-bottom: 1px solid #c4ded1;
  border-top: 1px solid #c4ded1;

  & > div {
    padding: 0 15px;

    @media screen and (max-width: 350px) {
      padding: 0 10px;
    }
  }

  & > div:first-child {
    width: 70%;
  }

  & > div:last-child {
    margin-left: auto;
    padding-left: 0;
    @media screen and (min-width: 1700px) {
      padding-right: 6%;
    }
  }
}
</style>

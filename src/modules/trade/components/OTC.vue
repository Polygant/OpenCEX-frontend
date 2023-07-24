<template>
  <form class="otc" @submit.prevent="onSubmit">
    <div class="otc__row">
      <div class="otc__title otc__title_big">
        {{ $t("common." + operation) }}
        {{ baseCurrency }}
      </div>
      <div class="otc__title otc__title_small flex items-center">
        <img
          :src="
            color == 'green'
              ? '/public/img/rect-orange.svg'
              : '/public/img/rect-orange.svg'
          "
          class="otc__wallet-image mr-1 inline-block"
        />
        {{
          addSpace(
            getCoolBalance(operation == "buy" ? quoteCurrency : baseCurrency)
          )
        }}
        {{ operation == "buy" ? quoteCurrency : baseCurrency }}
      </div>
    </div>
    <TradeInput
      v-model="operationData.quantity"
      required
      class="mt-2 w-full"
      :label="$t('common.' + (operation == 'buy' ? 'get' : 'give_to'))"
      :placeholder="baseCurrency"
    />
    <div class="otc__row otc__row_to-top mt-1">
      <div class="otc__min-max">
        <span>
          {{ $t("common.min") }}:
          {{ addSpaceFixDecimal(limits?.min, coins[limits.currency].decimals) }}
          {{ limits.currency }}
        </span>
        <span class="mt-1">
          {{ $t("common.max") }}:
          {{ addSpaceFixDecimal(limits?.max, coins[limits.currency].decimals) }}
          {{ limits.currency }}
        </span>
      </div>
      <div>
        <button
          v-for="percent in [25, 50, 75, 100]"
          :key="percent"
          type="button"
          class="otc__percent-button ml-1"
          @click="setPercent(percent / 100)"
        >
          {{ percent }}%
        </button>
      </div>
    </div>
    <TradeInput
      v-model="operationData.percent"
      required
      negative
      class="mt-2 w-full"
      placeholder="%"
    >
      <template #label>
        {{ $t("common.binance_percent") }}:
        <span class="otc__binance-price pr-1">{{ bitfinexPrice }}</span>
      </template>
    </TradeInput>
    <TradeInput
      v-model="operationData.limit"
      required
      class="mt-2 w-full"
      :label="
        $t(
          'common.' + (operation === 'buy' ? 'uplimitprice' : 'downlimitprice')
        )
      "
      :placeholder="quoteCurrency"
    />
    <div class="otc__row mt-3 otc__caption">
      <span
        >{{ $t("common." + (operation == "buy" ? "give_to" : "get")) }}:</span
      >
      <span>{{ resulterQuoteSum || fee }} {{ quoteCurrency }}</span>
    </div>
    <div class="otc__row mt-1 mb-2 otc__caption">
      <span>{{ $t("common.fee") }}:</span>
      <span
        >{{ fee }} {{ operation == "buy" ? baseCurrency : quoteCurrency }}</span
      >
    </div>
    <button
      class="otc__submit-button"
      :class="`otc__submit-button_${color}`"
      :style="
        mainColor
          ? color === 'green'
            ? `background: ${mainColor} !important`
            : `background: ${secondolor} !important`
          : {}
      "
      type="submit"
      :disabled="disableOperations"
    >
      {{ $t("common." + operation) }} {{ baseCurrency }}
    </button>
  </form>
</template>

<script>
import TradeInput from "./TradeInput.vue";
import getCoolBalance from "~/mixins/getCoolBalance";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { mapGetters } from "vuex";

export default {
  components: {
    TradeInput,
  },

  mixins: [getCoolBalance, getFixedDecimal],
  props: {
    baseCurrency: {
      type: String,
      required: true,
    },

    quoteCurrency: {
      type: String,
      required: true,
    },

    operation: {
      type: String,
      required: true,
      validator: (value) => ["buy", "sell"].includes(value),
    },

    disableOperations: {
      type: Boolean,
      default: false,
    },

    bitfinexPrice: {
      type: Number,
      default: 0,
    },
  },
  emits: ["add-order"],
  data() {
    return {
      operationData: {
        quantity: "",
        limit: "",
        percent: "0",
      },
    };
  },
  computed: {
    ...mapGetters({ coins: "core/coins", profile: "core/profile" }),

    color() {
      return this.operation == "buy" ? "green" : "orange";
    },

    limits() {
      const limitCurrency =
        this.operation == "buy" ? this.quoteCurrency : this.baseCurrency;
      return {
        min: this.coins[limitCurrency]?.limits?.order.min,
        max: this.coins[limitCurrency]?.limits?.order.max,
        currency: limitCurrency,
      };
    },

    resulterQuoteSum() {
      let share = 1 + this.operationData.percent / 100 || 1;
      let result = this.operationData.quantity * this.bitfinexPrice * share;
      return result ? Number(result.toFixed(8)) : "0";
    },

    fee() {
      if (this.profile.user.user_fee === 0) {
        return 0;
      } else {
        if (this.operation == "buy")
          return Number(
            (
              this.operationData.quantity *
              (typeof this.profile.user.user_fee === "number"
                ? this.profile.user.user_fee
                : this.coins[this.baseCurrency]?.fee?.order.limits)
            ).toFixed(8)
          );
        else
          return Number(
            (
              this.operationData.quantity *
              Math.max(+this.operationData.limit, this.bitfinexPrice) *
              (typeof this.profile.user.user_fee === "number"
                ? this.profile.user.user_fee
                : this.coins[this.quoteCurrency].fee?.order.limits)
            ).toFixed(8)
          );
      }
    },
  },
  methods: {
    onSubmit() {
      this.$emit("add-order", {
        orderData: {
          quantity: this.getFixedDecimal(+this.operationData.quantity),
          otc_limit: this.getFixedDecimal(+this.operationData.limit),
          otc_percent: this.getFixedDecimal(+this.operationData.percent),
        },
        type: 2,
        callback: () => {
          this.operationData.quantity = "";
          this.operationData.limit = "";
          this.operationData.percent = "0";
        },
      });
    },

    setPercent(fraction) {
      if (!this.bitfinexPrice) return;

      switch (this.operation) {
        case "buy":
          // eslint-disable-next-line no-case-declarations
          let share = 1 + this.operationData.percent / 100;
          // eslint-disable-next-line no-case-declarations
          let price = this.bitfinexPrice * share;
          this.operationData.quantity = (
            (this.getCoolBalance(this.quoteCurrency) * fraction) /
            price
          ).toFixed(8);
          break;
        case "sell":
          this.operationData.quantity = (
            this.getCoolBalance(this.baseCurrency) * fraction
          ).toFixed(8);
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.otc {
  line-height: initial;
  background: white;
  padding: 15px 2rem 10px;
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_to-top {
      align-items: start;
    }
  }
  &__title {
    font-size: 14px;
    font-weight: bold;
    &_small {
      font-size: 13px;
    }
    &_big {
      font-size: 16px;
    }
  }
  &__caption {
    font-size: 13px;
    font-weight: regular;
  }
  &__wallet-image {
    height: 15px;
  }
  &__min-max {
    display: flex;
    flex-direction: column;
    font-weight: 400;
    font-size: 10px;
    color: #ff0000;
  }
  &__percent-button {
    background-color: #f1f3f5;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    display: inline-block;
    padding: 2.5px 7.5px;
    line-height: 1;
    @media screen and (max-width: 1440px) and (min-width: 1281px) {
      padding: 2px;
    }
  }
  &__binance-price {
    color: rgb(70, 191, 141);
    font-size: 12px;
  }
  &__submit-button {
    cursor: pointer;
    border: none;
    color: #ffffff;
    border-radius: 3px;
    height: 36px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &_orange {
      background-color: #4f5557;
    }
    &_green {
      background-color: var(--theme-primary-color);
    }
  }
}
</style>

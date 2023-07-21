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
          class="otc__wallet-image inline-block mr-1"
        />
        {{ balanceByOperation }}
      </div>
    </div>
    <TradeInput
      v-model="operationData.stopPrice"
      :value="operationData.stopPrice"
      required
      class="mt-2 w-full"
      :label="$t('common.stop_price')"
      :placeholder="baseCurrency"
    />
    <TradeInput
      v-model="operationData.limitPrice"
      :value="operationData.limitPrice"
      required
      class="mt-2 w-full"
      :label="$t('common.limit_price')"
      :placeholder="baseCurrency"
    />
    <TradeInput
      v-model="operationData.quantity"
      :value="operationData.quantity"
      required
      class="mt-2 w-full"
      :label="$t('common.' + (operation == 'buy' ? 'get' : 'give_to'))"
      :placeholder="baseCurrency"
    />
    <div class="otc__row otc__row_min-max mt-1">
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
      <div class="mt-2 sm:mt-0 limits-percent">
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
    <div class="otc__row mt-3 otc__caption">
      <span>
        {{ $t("common." + (operation == "buy" ? "give_to" : "get")) }}:
      </span>
      <span>{{ resultQuoteSum }} {{ quoteCurrency }}</span>
    </div>
    <div class="otc__row mt-1 otc__caption">
      <span>{{ $t("common.fee") }}:</span>
      <span>
        {{ fee }} {{ operation == "buy" ? baseCurrency : quoteCurrency }}
      </span>
    </div>
    <button
      class="otc__submit-button mt-3"
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
  },
  emits: ["add-order"],

  data() {
    return {
      operationData: {
        quantity: "",
        stopPrice: "",
        limitPrice: "",
      },
    };
  },

  methods: {
    onSubmit() {
      this.$emit("add-order", {
        orderData: {
          quantity: this.getFixedDecimal(this.operationData.quantity),
          price: this.getFixedDecimal(this.operationData.limitPrice),
          stop: this.getFixedDecimal(this.operationData.stopPrice),
        },
        type: 4,
        callback: () => {
          this.operationData.quantity = "";
          this.operationData.limitPrice = "";
          this.operationData.stopPrice = "";
        },
      });
    },

    setPercent(fraction) {
      switch (this.operation) {
        case "buy":
          if (this.operationData.limitPrice) {
            this.operationData.quantity = (
              (this.getCoolBalance(this.quoteCurrency) * fraction) /
              this.operationData.limitPrice
            ).toFixed(8);
          }
          break;
        case "sell":
          this.operationData.quantity = (
            this.getCoolBalance(this.baseCurrency) * fraction
          ).toFixed(8);
      }
    },
  },

  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({ coins: "core/coins", profile: "core/profile" }),

    color() {
      return this.operation == "buy" ? "green" : "orange";
    },
    balanceByOperation() {
      return `${this.addSpace(
        this.getCoolBalance(
          this.operation === "buy" ? this.quoteCurrency : this.baseCurrency
        )
      )} ${this.operation === "buy" ? this.quoteCurrency : this.baseCurrency}`;
    },
    limits() {
      const limitCurrency =
        this.operation == "buy" ? this.quoteCurrency : this.baseCurrency;
      return {
        min: this.coins?.[limitCurrency]?.limits?.order.min,
        max: this.coins?.[limitCurrency]?.limits?.order.max,
        currency: limitCurrency,
      };
    },

    resultQuoteSum() {
      return Number(
        (
          this.operationData.quantity * this.operationData.limitPrice || 0
        ).toFixed(8)
      );
    },

    fee() {
      if (this.profile.user.user_fee === 0) {
        return 0;
      } else {
        if (this.operation == "buy")
          return Number(
            (
              this.operationData.quantity *
              (this.profile?.user?.user_fee !== "undefined"
                ? this.profile?.user?.user_fee
                : this.coins[this.baseCurrency].fee?.order.limits)
            ).toFixed(8)
          );
        else
          return Number(
            (
              this.operationData.quantity *
              (this.profile?.user?.user_fee !== "undefined"
                ? this.profile?.user?.user_fee
                : this.coins[this.quoteCurrency].fee?.order.limits)
            ).toFixed(8)
          );
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
    &_min-max {
      align-items: start;
      @media (max-width: 767px) {
        display: block;
      }
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
    border-radius: 5px;
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
  &__min-max {
    display: flex;
    flex-direction: column;
    font-weight: 400;
    font-size: 10px;
    color: #ff0000;
  }
  &__submit-button {
    cursor: pointer;
    border: none;
    color: #ffffff;
    border-radius: 5px;
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

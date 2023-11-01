<template>
  <form class="limit-list" @submit.prevent="onSubmit">
    <div class="limit-list__row">
      <div class="limit-list__title limit-list__title_big">
        {{ $t("common." + operation) }}
        {{ baseCurrency }}
      </div>
      <div class="limit-list__title limit-list__title_small flex items-center">
        <img
          :src="
            color == 'green'
              ? '/public/img/rect-orange.svg'
              : '/public/img/rect-orange.svg'
          "
          class="limit-list__wallet-image inline-block mr-1"
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
      v-model="operationData.price"
      :decimals="coins[quoteCurrency].decimals"
      required
      class="mt-3 w-full"
      :label="$t('common.price')"
      :placeholder="quoteCurrency"
    />
    <TradeInput
      v-model="operationData.quantity"
      :decimals="coins[baseCurrency].decimals"
      required
      class="mt-3 w-full"
      :label="operation == 'buy' ? $t('common.get') : $t('common.give_to')"
      :placeholder="baseCurrency"
      @focus="lastEditedField = fields.QUANTITY"
    />
    <div class="limit-list__row limit-list__row_min-max mt-2">
      <div class="limit-list__min-max">
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
      <div class="mt-3 sm:mt-0 limits-percent">
        <button
          v-for="(percent, index) in [25, 50, 75, 100]"
          :key="index"
          type="button"
          class="limit-list__percent-button"
          :class="{ 'ml-1': index !== 0 }"
          @click="setPercent(percent / 100)"
        >
          {{ percent }}%
        </button>
      </div>
    </div>
    <TradeInput
      v-model="resultedQuoteSum"
      :decimals="coins[quoteCurrency].decimals"
      class="mt-3 w-full"
      :label="operation == 'buy' ? $t('common.give_to') : $t('common.get')"
      :placeholder="quoteCurrency"
      @focus="lastEditedField = fields.SUM"
    />
    <div class="limit-list__row mt-3 limit-list__caption">
      <span>{{ $t("common.fee") }}:</span>
      <span>
        {{ fee }} {{ operation == "buy" ? baseCurrency : quoteCurrency }}
      </span>
    </div>
    <button
      class="limit-list__submit-button mt-4"
      :class="`limit-list__submit-button_${color}`"
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
import TradeInput from "../components/TradeInput.vue";
import getCoolBalance from "~/mixins/getCoolBalance";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { mapGetters } from "vuex";
import { debounce } from "lodash";

const FIELDS = {
  QUANTITY: 1,
  SUM: 2,
};

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
        price: "",
        quantity: "",
      },
      resultedQuoteSum: "",
      lastEditedField: FIELDS.QUANTITY,
    };
  },

  computed: {
    ...mapGetters({
      coins: "core/coins",
      profile: "core/profile",
      getSuggestedOrderParameters: "getSuggestedOrderParameters",
    }),

    fields() {
      return FIELDS;
    },

    color() {
      return this.operation === "buy" ? "green" : "orange";
    },

    fee() {
      let output = 0;

      if (this.operation === "buy")
        output = this.addSpace(
          this.operationData.quantity *
            (typeof this.profile.user.user_fee === "number" &&
            this.profile.user.user_fee !== 0
              ? this.profile.user.user_fee
              : this.coins[this.baseCurrency]?.fee?.order.limit)
        );
      else
        output = this.addSpace(
          this.operationData.quantity *
            this.operationData.price *
            (typeof this.profile.user.user_fee === "number" &&
            this.profile.user.user_fee !== 0
              ? this.profile.user.user_fee
              : this.coins[this.quoteCurrency].fee?.order.limit)
        );
      if (this.profile.user.user_fee === 0) {
        return 0;
      } else {
        return output || 0;
      }
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
  },

  watch: {
    getSuggestedOrderParameters: {
      deep: true,
      handler({ operation, quantity, price }) {
        if (operation === this.operation) {
          this.operationData.quantity = String(quantity);
          this.operationData.price = String(price);
        }
      },
    },

    "operationData.quantity": "updateResultedSum",
    "operationData.price"() {
      this.updateResultedSum();
      this.updateOperationQuantity();
    },
    resultedQuoteSum: "updateOperationQuantity",
  },

  methods: {
    noExponents(num) {
      let data = String(num).split(/[eE]/);
      if (data.length === 1) return data[0];
      let z = "",
        sign = num < 0 ? "-" : "",
        str = data[0].replace(".", ""),
        mag = Number(data[1]) + 1;

      if (mag < 0) {
        z = sign + "0.";
        while (mag++) z += "0";
        return z + str.replace(/^-/, "");
      }
      mag -= str.length;
      while (mag--) z += "0";
      return str + z;
    },
    onSubmit() {
      this.$emit("add-order", {
        orderData: {
          price: this.getFixedDecimal(+this.operationData.price),
          quantity: this.getFixedDecimal(+this.operationData.quantity),
        },
        type: 0,
        callback: () => {
          this.operationData.price = "";
          this.operationData.quantity = "";
        },
      });
    },
    setPercent(fraction) {
      switch (this.operation) {
        case "buy":
          this.lastEditedField = FIELDS.SUM;
          this.resultedQuoteSum =
            this.getFixedDecimal(
              this.getCoolBalance(this.quoteCurrency) * fraction,
              this.coins[this.quoteCurrency].decimals
            ) + "";
          break;
        case "sell":
          this.operationData.quantity =
            this.getFixedDecimal(
              this.getCoolBalance(this.baseCurrency) * fraction,
              this.coins[this.baseCurrency].decimals
            ) + "";
          break;
      }
    },

    updateResultedSum: debounce(function () {
      if (this.lastEditedField === FIELDS.QUANTITY)
        this.resultedQuoteSum = String(
          this.getFixedDecimal(
            this.operationData.price * this.operationData.quantity,
            this.coins[this.quoteCurrency].decimals
          )
        );

      console.log({ updateResultedSum: this.resultedQuoteSum });
    }, 500),

    updateOperationQuantity: debounce(function () {
      if (this.lastEditedField === FIELDS.SUM) {
        if (
          !Number.isNaN(Number(this.operationData.price)) &&
          Number(this.operationData.price) !== 0 &&
          !Number.isNaN(this.resultedQuoteSum)
        )
          this.operationData.quantity = String(
            this.getFixedDecimal(
              this.resultedQuoteSum / this.operationData.price || 0,
              this.coins[this.baseCurrency].decimals
            )
          );
        else this.operationData.quantity = "0";
      }
    }, 500),

    getMax8Digits(x) {
      return Number(x.toFixed(8));
    },
  },
};
</script>

<style lang="scss" scoped>
.limit-list {
  line-height: initial;
  background: white;
  padding: 15px 2rem 10px;
  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-weight: normal;
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

<template>
  <tr
    class="sell-orders-row"
    :style="{
      backgroundImage: `linear-gradient(to right,
      ${color} 0,
      ${color} ${depthWidth}%,
      transparent ${depthWidth}%)`,
    }"
    @click="
      $emit(
        'select',
        order.price,
        Number(
          getFixedDecimal(
            order.depth,
            coins[currentBaseCurrency].decimals,
            true
          )
        )
      )
    "
  >
    <td
      class="sell-orders__td-wrap"
      :style="order.owner ? 'font-weight: 600' : ''"
    >
      <div class="sell-orders__td">
        {{
          addSpaceFixDecimal(
            order.price,
            -Math.round(Math.log(precision) / Math.log(10))
          )
        }}
      </div>
      <div
        v-if="isCircle && isAuthorized"
        class="sell-orders-row__circle"
      ></div>
    </td>
    <td :class="{ 'td-bold': order.owner }">
      <div class="sell-orders__td">
        {{ addSpaceFixDecimal(quantity, coins[currentBaseCurrency].decimals) }}
      </div>
    </td>

    <td :class="{ 'td-bold': order.owner }">
      <div class="sell-orders__td">
        {{ addSpace(quantityQuote) }}
      </div>
    </td>
    <td :class="{ 'td-bold': order.owner }">
      <div class="sell-orders__td">
        {{ addSpaceFixDecimal(order.depth, round, true) }}
      </div>
    </td>
  </tr>
</template>

<script>
import getCoolTrade from "~/mixins/getCoolTrade";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "OrdersTableRow",
  mixins: [getCoolTrade, getFixedDecimal],
  // eslint-disable-next-line vue/require-prop-types
  props: ["order", "maxDepth", "color", "isCircle", "round", "precision"],
  emits: ["select"],
  computed: {
    isAuthorized() {
      return !!this.$store.getters["core/isAuthorized"];
    },
    currentBaseCurrency() {
      return this.$store.getters.getCurrentBaseCurrency;
    },
    currentQuoteCurrency() {
      return this.$store.getters.getCurrentQuoteCurrency;
    },
    depthWidth() {
      return (this.order.depth / this.maxDepth) * 100;
    },
    quantityQuote() {
      return this.getCoolTrade(
        this.order.quantity * this.order.price,
        this.currentQuoteCurrency
      );
    },
    quantity() {
      return parseFloat(this.order.quantity);
    },
    orderItem() {
      return this.order;
    },
  },
};
</script>

<style lang="scss" scoped>
.sell-orders-row {
  cursor: pointer;
  margin-right: 0;

  &.orange {
    .sell-orders-row__circle {
      background-color: #f5ba38;
      border: 1px solid #946d16;
    }
  }
  &.green {
    .sell-orders-row__circle {
      background-color: #229bec;
      border: 1px solid #0c794b;
    }
  }
}

.sell-orders__td-wrap {
  position: relative;
}

.sell-orders__td {
  position: relative;
  z-index: 2;
}

.td-bold {
  font-weight: 600;
  position: relative;
}

.sell-orders-row__circle {
  position: absolute;
  left: 2px;
  top: 9px;
  z-index: 2;
  border-radius: 50%;
  width: 7px;
  height: 7px;
}
</style>

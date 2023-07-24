<template>
  <tr class="order-row">
    <td class="order-cell" :data-thead="$t('common.date')">
      {{ tableLabel }}
      <div class="orders-table__td middleRes">
        {{ getFormattedDateOrders(order.created) }}
      </div>
      <div class="orders-table__td hideMiddleRes">
        {{ getFormattedDate(order.created) }}
      </div>
    </td>
    <td v-if="!isActivePair" class="order-cell" :data-thead="$t('common.pair')">
      <div class="orders-table__td">
        {{ order.pair }}
      </div>
    </td>
    <td
      v-if="type === 'open'"
      class="order-cell"
      :data-thead="$t('common.operation')"
    >
      <div class="orders-table__td">
        <span
          :class="{
            'sell-label': order.operation === 1,
            'buy-label': order.operation === 0,
          }"
        >
          {{ getOrderWord("type", order.operation) }}
          <span v-if="order.type === 0">(L)</span>
          <span v-if="order.type === 1">(M)</span>
          <span v-if="order.type === 2">(B)</span>
          <span v-if="order.type === 4">(SL)</span>
        </span>
      </div>
    </td>
    <td
      v-if="type === 'close'"
      class="order-cell"
      :data-thead="$t('common.operation')"
    >
      <div class="orders-table__td">
        <span
          v-if="order.type === 0"
          :class="order.operation === 0 ? 'buy-label' : 'sell-label'"
        >
          {{ getOrderWord("type", order.operation) }} (L)
        </span>
        <span
          v-if="order.type === 1"
          :class="order.operation === 0 ? 'buy-label' : 'sell-label'"
        >
          {{ getOrderWord("type", order.operation) }} (M)
        </span>
        <span
          v-if="order.type === 2"
          :class="order.operation === 0 ? 'buy-label' : 'sell-label'"
        >
          {{ getOrderWord("type", order.operation) }} (B)
        </span>
        <span v-if="order.type === 3" class="buy-label">
          {{ $t("common.exchange_type") }} (E)
        </span>
        <span
          v-if="order.type === 4"
          :class="order.operation === 0 ? 'buy-label' : 'sell-label'"
        >
          {{ getOrderWord("type", order.operation) }} (SL)
        </span>
      </div>
    </td>
    <td
      v-if="type === 'open'"
      class="order-cell"
      :data-thead="$t('common.price')"
    >
      <div v-if="order.type === 4" class="orders-table__td">
        {{ $t("common.stop") }}:
        {{ addSpaceFixDecimal(order.stop, coins[quote].decimals) }}<br />
        {{ $t("common.limit2") }}:
        {{ addSpaceFixDecimal(order.price, coins[quote].decimals) }}
      </div>
      <div v-else class="orders-table__td">
        {{ addSpace(getCoolTrade(order.price, currentQuoteCurrency)) }}
      </div>
    </td>
    <td
      v-if="type === 'close'"
      class="order-cell"
      :data-thead="$t('common.price')"
    >
      <div v-if="order.type === 4" class="orders-table__td">
        {{ $t("common.stop") }}:
        {{ addSpaceFixDecimal(order.stop, coins[quote].decimals) }}<br />
        {{ $t("common.limit2") }}:
        {{ addSpaceFixDecimal(order.price, coins[quote].decimals) }}
      </div>
      <div v-else class="orders-table__td">
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left === order.quantity
          "
        >
          {{ addSpace(getCoolTrade(order.price, currentQuoteCurrency)) }}
        </span>
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left !== order.quantity
          "
        >
          {{ addSpace(getCoolTrade(vwapOrPrice, currentQuoteCurrency)) }}
        </span>
        <span v-if="order.quantity_left === 0">
          {{ addSpace(getCoolTrade(vwapOrPrice, currentQuoteCurrency)) }}
        </span>
      </div>
    </td>
    <td
      v-if="type === 'open'"
      class="order-cell"
      :data-thead="$t('common.amountoriginal')"
    >
      <div class="orders-table__td hideMiddleRes">
        {{ addSpace(getCoolTrade(order.quantity)) }}
      </div>
      <div class="orders-table__td middleRes">
        {{ order.quantity }}
      </div>
    </td>
    <td
      v-if="type === 'close'"
      class="order-cell"
      :data-thead="$t('common.amountTableHeader')"
    >
      <div class="orders-table__td">
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left === order.quantity
          "
        >
          {{ addSpace(getCoolTrade(order.quantity)) }}
        </span>
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left !== order.quantity
          "
        >
          {{ addSpace(getCoolTrade(order.quantity - order.quantity_left)) }} /
          {{ addSpace(getCoolTrade(order.quantity)) }}
        </span>
        <span v-if="order.quantity_left === 0">
          {{ addSpace(getCoolTrade(order.quantity)) }}
        </span>
      </div>
    </td>
    <td
      v-if="type === 'open'"
      class="order-cell"
      :data-thead="$t('common.amountleft')"
    >
      <div class="orders-table__td hideMiddleRes">
        {{ addSpace(getCoolTrade(order.quantity_left)) }}
      </div>
      <div class="orders-table__td middleRes">
        {{ addSpaceFixDecimal(order.quantity_left, coins[base].decimals) }}
      </div>
    </td>
    <td
      v-if="type === 'close'"
      class="order-cell"
      :data-thead="$t('common.sum')"
    >
      <div class="orders-table__td">
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left === order.quantity
          "
          class="orders-table__td"
        >
          {{ addSpaceFixDecimal(order.quantity * order.price, 3, true) }}
        </span>
        <span
          v-if="
            order.quantity_left !== 0 && order.quantity_left !== order.quantity
          "
        >
          {{
            addSpaceFixDecimal(
              (order.quantity - order.quantity_left) * vwapOrPrice,
              3,
              true
            )
          }}
        </span>
        <span v-if="order.quantity_left === 0">
          {{ addSpace(getCoolTrade(order.quantity * vwapOrPrice)) }}
        </span>
      </div>
    </td>
    <td
      v-if="type === 'open'"
      class="order-cell"
      :data-thead="$t('common.sum')"
    >
      <div class="orders-table__td">
        {{ addSpaceFixDecimal(order.quantity_left * order.price, 3, true) }}
      </div>
    </td>
    <td
      v-if="type === 'close'"
      class="order-cell"
      :data-thead="$t('common.status')"
    >
      <div class="orders-table__td">
        <span v-if="order.state === 1" class="itemStatusUp">
          {{ getOrderWord("state", order.state) }}
        </span>
        <span v-if="order.state === 2" class="itemStatusDown">
          {{ getOrderWord("state", order.state) }}
        </span>
      </div>
    </td>
    <td v-if="type === 'open'" class="order-cell order-cell-actions">
      <div class="orders-table__td">
        <button
          class="action-label delete-order"
          @click="deleteOrderByID(order.id)"
        >
          <img src="/public/img/times.svg" width="20" />
        </button>
        <button
          class="action-label update-order"
          :style="mainColor ? `background: ${mainColor} !important` : {}"
          @click="updateOrder(order)"
        >
          <img src="/public/img/pencil-square-o.svg" width="20" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import getFormattedDate from "~/mixins/getFormattedDate";
import getCoolTrade from "~/mixins/getCoolTrade";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { mapGetters } from "vuex";

export default {
  mixins: [getFormattedDate, getCoolTrade, getFixedDecimal],
  props: {
    order: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
    },
    isActivePair: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["updateOrder", "deleteOrder"],
  computed: {
    ...mapGetters({ coins: "core/coins" }),
    currentQuoteCurrency() {
      return this.$store.getters.getCurrentQuoteCurrency;
    },
    vwapOrPrice() {
      return this.order.vwap || this.order.price;
    },
    base() {
      return this.order?.pair.split("-")[0];
    },
    quote() {
      return this.order?.pair.split("-")[1];
    },
  },
  methods: {
    deleteOrderByID(id) {
      this.$emit("deleteOrder", id);
    },
    updateOrder(order) {
      this.$emit("updateOrder", order);
    },
    getOrderWord(column, data) {
      if (column === "type") {
        if (data === 1) {
          return this.$t("common.sell_big");
        }
        if (data === 0) {
          return this.$t("common.buy_big");
        }
      }
      if (column === "state") {
        if (data === 0) {
          return this.$t("common.active");
        }
        if (data === 1) {
          return this.$t("common.done_1");
        }
        if (data === 2) {
          return this.$t("common.canceled");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-row {
  font-size: 11px;
  line-height: 1;

  .order-cell {
    padding: 5px 11px;
    border-top: 0;

    .action-label {
      display: flex;
      align-items: center;
      justify-content: center;

      .fa {
        margin: 0;
      }
    }

    .delete-order {
      background-color: rgb(255, 93, 85);
      margin-right: 3px;
    }

    .update-order {
      .fa {
        margin: 2px 0 0 2px;
      }
    }
  }

  .sell-label,
  .buy-label {
    text-align: center;
    white-space: nowrap;
  }
}
</style>

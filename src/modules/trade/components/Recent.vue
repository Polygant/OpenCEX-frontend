<template>
  <div class="trades">
    <div class="sell-order recent-trades">
      <div
        class="sell-orders__top sell-orders__top--title recent-trades__title"
      >
        <div class="sell-orders__title" style="margin-bottom: 1em">
          {{ $t("common.recenttrades") }}
        </div>
      </div>
    </div>
    <div class="table-responsive sell-orders trades-table h-[313px]">
      <perfect-scrollbar v-if="tradesExist && isCurrentPairActive">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <td>
                <div class="sell-orders__td">
                  <b>{{ $t("common.date") }}</b>
                </div>
              </td>
              <td>
                <div class="sell-orders__td">
                  <b>{{ $t("common.operation") }}</b>
                </div>
              </td>
              <td>
                <div class="sell-orders__td">
                  <b>{{ $t("common.price") }} {{ currentBaseCurrency }}</b>
                </div>
              </td>
              <td>
                <div class="sell-orders__td">
                  <b>{{ currentBaseCurrency }}</b>
                </div>
              </td>
              <td>
                <div class="sell-orders__td">
                  <b>{{ currentQuoteCurrency }}</b>
                </div>
              </td>
            </tr>
          </thead>
          <tbody class="recent-trades-table">
            <tr v-for="trade in recenttrades" :key="trade.id">
              <td>
                <div class="orders-table__td">
                  {{ getFormattedDate(trade.updated) }}
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  <span
                    :class="{
                      'sell-label': trade.operation === 1,
                      'buy-label': trade.operation === 0,
                    }"
                    style="width: 80px; text-align: center"
                    >{{ getOrderWord("type", trade.operation) }}</span
                  >
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  {{
                    getFixedDecimal(
                      trade.price,
                      coins[currentBaseCurrency].decimals
                    )
                  }}
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  {{
                    getFixedDecimal(
                      trade.quantity,
                      coins[currentBaseCurrency].decimals
                    )
                  }}
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  {{
                    getFixedDecimal(
                      trade.quantity * trade.price,
                      coins[currentBaseCurrency].decimals
                    )
                  }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </perfect-scrollbar>
      <div v-else class="not-information !pt-[70px]">
        <div class="icon smile">
          <img src="/public/img/Smile.svg" alt="" />
        </div>
        <div class="txt">{{ $t("common.nodata") }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import getCoolTrade from "~/mixins/getCoolTrade";
import getFormattedDate from "~/mixins/getFormattedDate";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "RecentPage",

  mixins: [getCoolTrade, getFormattedDate, getFixedDecimal],
  computed: {
    ...mapGetters({
      recenttrades: "core/recenttrades",
      tradesExist: "core/tradesExist",
      currencyPairProp: "getCurrencyPairProp",
      coins: "core/coins",
      currentBaseCurrency: "getCurrentBaseCurrency",
      currentQuoteCurrency: "getCurrentQuoteCurrency",
    }),
    isCurrentPairActive() {
      const p = this.currencyPairProp;
      const pair = this.coins[this.currentQuoteCurrency].pairs[p];

      return !!pair?.active;
    },
  },
  methods: {
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
<style scoped>
.ps {
  height: 330px;
}
</style>

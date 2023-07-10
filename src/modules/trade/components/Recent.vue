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
                    addSpace(getCoolTrade(trade.price, currentQuoteCurrency))
                  }}
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  {{ addSpace(getCoolTrade(trade.quantity)) }}
                </div>
              </td>
              <td>
                <div class="orders-table__td">
                  {{
                    addSpace(
                      getCoolTrade(
                        trade.quantity * trade.price,
                        currentQuoteCurrency
                      )
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
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            style="width: 60px; height: 60px"
          >
            <path
              class="smile-st0"
              d="M44.5 43.2C40.6 38.6 36 36 30 36s-10.6 2.6-14.5 7.2c-.5.6-.4 1.5.2 2 .3.2.6.3.9.3.4 0 .8-.2 1.1-.5 3.3-3.9 7.2-6.2 12.3-6.2 5.1 0 9 2.3 12.3 6.2.3.3.7.5 1.1.5.3 0 .7-.1.9-.3.6-.5.7-1.4.2-2z"
            />
            <path
              class="smile-st1"
              d="M30 60C13.4 60 0 46.6 0 30S13.4 0 30 0s30 13.4 30 30-13.4 30-30 30zm0-56C15.6 4 4 15.6 4 30s11.6 26 26 26 26-11.6 26-26S44.4 4 30 4z"
            />
            <path
              class="smile-st1"
              d="M18.5 15c4.1 0 7.5 3.4 7.5 7.5S22.6 30 18.5 30 11 26.6 11 22.5s3.4-7.5 7.5-7.5z"
            />
            <path
              class="smile-st3"
              d="M18.5 18c2.5 0 4.5 2 4.5 4.5S21 27 18.5 27 14 25 14 22.5s2-4.5 4.5-4.5z"
            />
            <path
              class="smile-st1"
              d="M18.5 20c1.4 0 2.5 1.1 2.5 2.5S19.9 25 18.5 25 16 23.9 16 22.5s1.1-2.5 2.5-2.5zm-5.2-4.4l4.2-4.2c.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.2 4.2c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.6 0-2.1zm28.2-.6c4.1 0 7.5 3.4 7.5 7.5S45.6 30 41.5 30 34 26.6 34 22.5s3.4-7.5 7.5-7.5z"
            />
            <path
              class="smile-st3"
              d="M41.5 18c2.5 0 4.5 2 4.5 4.5S44 27 41.5 27 37 25 37 22.5s2-4.5 4.5-4.5z"
            />
            <path
              class="smile-st1"
              d="M41.5 20c1.4 0 2.5 1.1 2.5 2.5S42.9 25 41.5 25 39 23.9 39 22.5s1.1-2.5 2.5-2.5zm5.2-4.4l-4.2-4.2c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l4.2 4.2c.6.6 1.5.6 2.1 0 .6-.6.6-1.6 0-2.1z"
            />
          </svg>
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

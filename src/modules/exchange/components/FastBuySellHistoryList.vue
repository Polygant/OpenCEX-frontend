<template>
  <div class="historylist">
    <!--HISTORY-->
    <div class="wallet__title">{{ $t("common.exchangehistory") }}</div>
    <div v-if="exchanges.length">
      <table class="walletTable">
        <thead>
          <tr>
            <th class="walletTable__header walletTable__header_data_ex">
              {{ $t("common.date") }}
            </th>
            <th class="walletTable__header walletTable__header_value_ex">
              {{ $t("common.gave") }}/{{ $t("common.got") }}
            </th>
            <th class="walletTable__header walletTable__header_data_ex_1">
              {{ $t("common.price") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ex in exchanges" :key="ex.id">
            <td
              class="walletTable__column walletTable__column_data"
              :data-thead="$t('common.date')"
            >
              {{ getprettyDate(ex.order.updated) }}
            </td>
            <td
              class="walletTable__column is-centered"
              :data-thead="`${$t('common.gave')}/${$t('common.got')}`"
            >
              <div class="walletTable__amount">
                <span class="walletTable__column_sell">
                  {{ addSpace(getQuantityValue(ex)) }}
                  {{ ex.base_currency }}
                </span>
                <i class="fa fa-exchange" aria-hidden="true"></i>
                <span
                  class="walletTable__column_buy"
                  :style="mainColor ? `color: ${mainColor} !important` : {}"
                >
                  {{ addSpace(getCostValue(ex)) }}
                  {{ ex.quote_currency }}
                </span>
              </div>
            </td>
            <td class="walletTable__column" :data-thead="$t('common.price')">
              {{ addSpace(ex.order.price) }}
            </td>
          </tr>
        </tbody>
      </table>
      <paginate
        v-model="currentPage"
        :page-range="5"
        :margin-pages="0"
        :page-count="Math.ceil(exchangesCount / 5) - 1"
        :click-handler="handlePagination"
        :prev-text="'❮'"
        :next-text="'❯'"
        :container-class="`pagination pagination-custom ${
          pageCount > 5 ? 'over-pages' : ''
        }`"
        :page-class="'page-item page-item-custom noselect'"
        :prev-class="'page-item page-item-custom-prev noselect'"
        :next-class="'page-item page-item-custom-prev noselect'"
        :break-view-class="'page-item page-item-custom-break'"
        :break-view-text="''"
      >
      </paginate>
    </div>
    <div v-else class="nodata not-information" style="padding-top: 30px">
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
    <!--HISTORY-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Decimal } from "decimal.js";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { getDecimalWLength } from "~/utilities/helpers";
import Paginate from "vuejs-paginate-next";

function precision(a) {
  const decimalValue = new Decimal(a);
  if (!decimalValue.isFinite()) return 0;

  let e = new Decimal(1);
  let p = 0;

  while (!decimalValue.mul(e).round().dividedBy(e).equals(decimalValue)) {
    e = e.mul(10);
    p++;
  }
  return p;
}

export default {
  name: "FastBuySellHistoryList",
  components: { Paginate },
  mixins: [getFixedDecimal],
  getDecimalWLength,
  props: {
    curPage: {
      type: Number,
      default: 1,
    },
    pageCount: {
      type: Number,
      default: 12,
    },
  },
  data() {
    return {
      exchangeTimeout: null,
      currentPage: 1,
    };
  },
  computed: {
    ...mapGetters({
      exchanges: "core/exchanges",
      exchangesCount: "core/exchangesCount",
    }),
  },
  mounted() {
    this.getExchangeHistory();
  },
  beforeUnmount() {
    this.exchangeTimeout && clearTimeout(this.exchangeTimeout);
  },
  methods: {
    handlePagination(pageNum) {
      this.currentPage = pageNum;
      this.getExchangeHistory();
    },
    isFiat(cur) {
      return cur === "USD" || cur === "EUR" || cur === "RUB";
    },

    getQuantityValue(ex) {
      return this.isFiat(ex.base_currency)
        ? this.$options.getDecimalWLength(ex.quantity)
        : this.getCoolValueForTable(ex.quantity);
    },

    getCostValue(ex) {
      return this.isFiat(ex.quote_currency)
        ? this.$options.getDecimalWLength(ex.cost)
        : this.getCoolValueForTable(ex.cost);
    },
    getCoolValueForTable(x) {
      return precision(x) > 8 ? this.addSpaceFixDecimal(x, 8) : x;
    },
    getprettyDate(ptime) {
      const a = new Date();
      a.setTime(parseInt(ptime));
      return a.toLocaleString("ru-RU");
    },

    createGetExchangeHistoryLoop() {
      if (this.exchangeTimeout) clearTimeout(this.exchangeTimeout);

      this.getExchangeHistory();

      this.exchangeTimeout = setTimeout(this.getExchangeHistory, 60 * 1000);
    },

    getExchangeHistory() {
      this.$store.dispatch("core/getExchanges", {
        limit: 10,
        offset: (this.currentPage - 1) * 10,
        st: 1,
      });

      this.exchangeTimeout = setTimeout(function () {
        self.getExchangeHistory();
      }, 60 * 1000);
    },
  },
};
</script>
<style lang="scss" scoped>
.fast-buy-sell-history-list__thead {
  position: sticky;
  top: -1px;
  background: white;
}
.ps {
  max-height: 400px;
  position: relative;
}
.historylist {
  padding: 0 0 40px 0;
}

.table-responsive {
  padding: 0 10px;
}

.walletTable_history {
  width: 100%;
}

.walletTable__header_value_ex {
  width: 60%;
  text-align: center;
}

.walletTable__header_data_ex_1 {
  width: 20%;
}

.historylist .walletTable__column_sell,
.historylist .walletTable__column_buy {
  display: inline-block;
  width: 40%;
  vertical-align: middle;
}

.historylist .walletTable__column_sell {
  text-align: right;
  padding-right: 5px;

  @media screen and (max-width: 600px) {
    width: 100%;
    padding-right: 0;
    text-align: right;
  }
}

.historylist .walletTable__column_buy {
  text-align: left;
  padding-left: 5px;

  @media screen and (max-width: 600px) {
    width: 100%;
    padding-left: 0;
    text-align: right;
  }
}

::placeholder {
  color: #d9d9d9 !important;
  font-size: 25px !important;
  font-weight: 400 !important;
}

.wallet__title {
  display: flex;
  align-items: center;
  margin-top: 0;
  min-height: 90px;
}

.walletTable__column {
  height: auto;
  padding-top: 12px;
  padding-bottom: 12px;
}

@media screen and (max-width: 600px) {
  .walletTable > thead {
    display: none;
  }

  .walletTable > tbody > tr {
    display: block;

    &:nth-child(even) td {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  .walletTable > tbody > tr > td {
    display: flex;
    padding: 12px 15px;
    align-items: center;
    width: 100%;
    font-size: 14px;
    text-align: right;
  }

  .walletTable > tbody > tr > td > img {
    align-self: center;
  }

  .walletTable > tbody > tr > td::before {
    content: attr(data-thead);
    flex-grow: 1;
    margin: -5px 10px -5px -10px;
    padding: 5px 10px;
    width: 50%;
    text-align: left;
  }

  .walletTable__amount {
    display: flex;
    flex-direction: column;
    align-items: center;

    .fa {
      transform: rotate(90deg);
      margin: 2px 0;
    }
  }

  .is-centered {
    text-align: left;
  }
}
</style>

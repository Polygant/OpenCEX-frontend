<template>
  <div class="historylist">
    <!--HISTORY-->
    <div class="wallet__title">{{ $t("common.exchangehistory") }}</div>
    <div>
      <div v-if="exchanges.length" style="max-height: 400px">
        <perfect-scrollbar>
          <table class="walletTable">
            <thead class="fast-buy-sell-history-list__thead">
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
                      {{
                        isFiat(ex.base_currency)
                          ? $options.getDecimalWLength(ex.quantity)
                          : getCoolValueForTable(ex.quantity)
                      }}
                      {{ ex.base_currency }}
                    </span>
                    <i class="fa fa-exchange" aria-hidden="true"></i>
                    <span class="walletTable__column_buy">
                      {{
                        isFiat(ex.quote_currency)
                          ? $options.getDecimalWLength(ex.cost)
                          : getCoolValueForTable(ex.cost)
                      }}
                      {{ ex.quote_currency }}
                    </span>
                  </div>
                </td>
                <td
                  class="walletTable__column"
                  :data-thead="$t('common.price')"
                >
                  {{ ex.order.price }}
                </td>
              </tr>
            </tbody>
          </table>
        </perfect-scrollbar>
      </div>
      <div v-else class="nodata not-information" style="padding-top: 30px">
        <div class="icon smile">
          <img src="/public/img/Smile.svg" alt="no data" />
        </div>
        <div class="txt">{{ $t("common.nodata") }}</div>
      </div>
    </div>

    <!--HISTORY-->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Decimal } from "decimal.js";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { getDecimalWLength } from "~/utilities/helpers";

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
  mixins: [getFixedDecimal],
  getDecimalWLength,
  data() {
    return {
      exchangeTimeout: null,
    };
  },
  computed: {
    ...mapGetters({ exchanges: "core/exchanges" }),
  },
  mounted() {
    this.getExchangeHistory();
  },
  beforeUnmount() {
    this.exchangeTimeout && clearTimeout(this.exchangeTimeout);
  },
  methods: {
    isFiat(cur) {
      return cur === "USD" || cur === "EUR" || cur === "RUB";
    },

    getCoolValueForTable(x) {
      return precision(x) > 8 ? this.getFixedDecimal(x, 8) : x;
    },
    getprettyDate(ptime) {
      const a = new Date();
      a.setTime(parseInt(ptime));
      return a.toLocaleString("ru-RU");
    },
    getExchangeHistory() {
      const self = this;

      if (this.exchangeTimeout) clearTimeout(this.exchangeTimeout);

      this.$store.dispatch("core/getExchanges");

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
  padding: 0;
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

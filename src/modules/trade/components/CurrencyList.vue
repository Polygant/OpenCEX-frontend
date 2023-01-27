<template>
  <div class="tab-block">
    <ul
      class="tab-block__nav justify-start"
      style="justify-content: start !important"
    >
      <li
        v-for="(coin, ticker) in filteredCoins"
        :key="'pairs_' + ticker"
        class="tab-block__nav-link show"
        :class="{ active: topCurrency === ticker }"
      >
        <a
          :id="ticker + '-tab'"
          class="nav-link"
          @click="setTopCurrency(ticker)"
          >{{ ticker }}</a
        >
      </li>
    </ul>
    <div id="currencyTabsContent" class="tab-content">
      <div
        id="btc"
        class="tab-pane fade show active"
        role="tabpanel"
        aria-labelledby="btc-tab"
      >
        <div class="tab-pane__row flex currency__filter-search">
          <input
            v-model="searchParameter"
            v-pattern="/^[a-zA-Z\s]{0,24}$/"
            type="text"
            class="tab-pane__search"
          />
          <v-icon
            :icon="starredOnly ? 'Star' : 'StarBorder'"
            color="var(--theme-primary-color)"
            style="background: #fff"
            class="currency__filter-icon"
            @click="starredOnly = !starredOnly"
          />
        </div>
        <div class="tab-pane__row">
          <div
            class="table-responsive sell-orders currency-table"
            style="overflow-x: hidden"
          >
            <perfect-scrollbar>
              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <td>
                      <div class="sell-orders__td"></div>
                    </td>
                    <td
                      v-for="column in [
                        'currency',
                        'price',
                        'vol24h',
                        'price24h',
                      ]"
                      :key="column"
                    >
                      <div class="sell-orders__td">
                        <b
                          class="sort-label"
                          :class="{
                            'sort-label_direction_asc':
                              sorting.column === column &&
                              sorting.direction === SORT_DIRECTIONS.ASC,
                            'sort-label_direction_desc':
                              sorting.column === column &&
                              sorting.direction === SORT_DIRECTIONS.DESC,
                          }"
                          @click="sort(column)"
                          >{{ $t("common." + column) }}</b
                        >
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="pair in sortedPairs"
                    :key="pair['base'] + pair['quote']"
                    class="tr-row"
                    :class="{
                      active:
                        pair.base === currentPair[0] &&
                        pair.quote === currentPair[1],
                      disabled:
                        coins[pair.base].disable_pairs ||
                        coins[pair.quote].disable_pairs,
                    }"
                  >
                    <td>
                      <div class="currency-table__td">
                        <v-icon
                          :icon="isStarred(pair) ? 'Star' : 'StarBorder'"
                          color="var(--theme-primary-color)"
                          @click="toggleStar(pair)"
                        />
                      </div>
                    </td>
                    <td
                      v-if="pair.active"
                      style="cursor: pointer"
                      @click="setCurrentPair(pair['base'], pair['quote'])"
                    >
                      <div class="currency-table__td">
                        <div class="currency-table__name">
                          {{ pair.currency }}
                        </div>
                      </div>
                    </td>
                    <td v-else>
                      <div class="currency-table__td">
                        <div class="currency-table__name">
                          {{ pair["base"] }}&nbsp;&nbsp;<span
                            style="
                              color: red;
                              font-weight: 200;
                              font-size: 10px;
                              text-transform: none;
                            "
                            >(Soon)</span
                          >
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="currency-table__td">
                        {{
                          getFixedDecimal(
                            pair.price,
                            coins[currentBaseCurrency].decimals
                          )
                        }}
                      </div>
                    </td>
                    <td>
                      <div class="currency-table__td">
                        {{
                          getFixedDecimal(
                            pair.vol24h,
                            coins[currentBaseCurrency].decimals
                          )
                        }}
                      </div>
                    </td>
                    <td>
                      <div class="currency-table__td">
                        <span
                          class="percent"
                          :class="
                            pair24green(`${pair['base']}-${pair['quote']}`)
                              ? 'percent-green'
                              : 'percent-red'
                          "
                        >
                          {{ pair.price24h }}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import getCoolTrade from "~/mixins/getCoolTrade";
import getPairs24h from "~/mixins/getPairs24h";
import getFromObj from "~/mixins/helpers";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "CurrencyList",
  mixins: [getCoolTrade, getFixedDecimal, getPairs24h, getFromObj],
  props: {
    currentPair: {
      type: Array,
      required: true,
    },
    defaultPair: {
      type: String,
      required: false,
    },
  },
  emits: ["setCurPair"],
  data() {
    return {
      starredOnly: false,
      starredPairs: [],
      searchParameter: "",
      topCurrency: null,
      sorting: {
        column: null,
        direction: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      coins: "core/coins",
      pairs: "core/pairs",
      getCurrentQuoteCurrency: "getCurrentQuoteCurrency",
    }),
    currentBaseCurrency() {
      return this.$store.getters["getCurrentBaseCurrency"];
    },
    filteredCoins() {
      let res = Object.fromEntries(
        Object.entries(this.coins).filter(([, coin]) => {
          return coin.base && !coin.disable_pairs && !coin.disable_all;
        })
      );
      return Object.keys(res).length > 0
        ? res
        : { [this.defaultPair.split("-")[1]]: [] };
    },
    getPairsForTopCur() {
      return this.coins[this.topCurrency].pairs;
    },
    filteredPairs() {
      let res = Object.values(this.getPairsForTopCur).filter(({ base }) => {
        return (
          this.coins[base] &&
          this.topCurrency !== base &&
          !this.coins[base].disable_all &&
          !this.coins[base].disable_pairs &&
          base.toUpperCase().includes(this.searchParameter.toUpperCase())
        );
      });
      if (this.starredOnly) {
        res = res.filter((p) => this.isStarred(p));
      }

      return res.map((pair) => ({
        ...pair,
        currency: pair.base,
        price: this.getTradeCell(pair, false),
        vol24h: this.getTradeCell(pair, true),
        price24h: this.getPairs24h(`${pair["base"]}-${pair["quote"]}`),
      }));
    },

    SORT_DIRECTIONS() {
      return {
        ASC: 1,
        DESC: 2,
      };
    },

    sortedPairs() {
      const column = this.sorting.column,
        direction = this.sorting.direction,
        TEXT_COLUMNS = ["currency"];

      if (column && direction) {
        let output = [...this.filteredPairs].sort((a, b) =>
          TEXT_COLUMNS.includes(column)
            ? a.base < b.base
              ? -1
              : 1
            : a[column] - b[column]
        );

        if (this.sorting.direction === this.SORT_DIRECTIONS.DESC)
          output.reverse();

        return output;
      } else return this.filteredPairs;
    },
  },
  watch: {
    getCurrentQuoteCurrency: {
      immediate: true,
      handler(value) {
        this.topCurrency = value;
      },
    },
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      if (
        self.coins[self.currentPair[0]].disable_pairs ||
        self.coins[self.currentPair[1]].disable_pairs
      ) {
        self.$notify({
          type: "error",
          text: self.$t("common.pairDisabled"),
          duration: 15000,
        });
      }
    }, 1500);
  },
  methods: {
    sort(column) {
      const SORT_OPTIONS = [
        null,
        this.SORT_DIRECTIONS.ASC,
        this.SORT_DIRECTIONS.DESC,
      ];

      if (this.sorting.column === column) {
        this.sorting.direction =
          SORT_OPTIONS[
            (SORT_OPTIONS.indexOf(this.sorting.direction) + 1) %
              SORT_OPTIONS.length
          ];
      } else {
        this.sorting.direction = this.SORT_DIRECTIONS.ASC;
      }
      this.sorting.column = column;
    },

    getTradeCell(pair, volume) {
      return this.getCoolTrade(
        this.getFromObj(
          this.pairs,
          `${pair["base"]}-${pair["quote"]}` + (volume ? ":volume" : ":price"),
          0
        ),
        pair["quote"]
      );
    },
    isStarred(pair) {
      return this.starredPairs.includes(pair.base + ":" + pair.quote);
    },
    toggleStar(pair) {
      const id = pair.base + ":" + pair.quote;
      if (this.isStarred(pair)) {
        this.starredPairs = this.starredPairs.filter((i) => i !== id);
      } else {
        this.starredPairs.push(id);
      }
    },
    setTopCurrency(currency) {
      this.topCurrency = currency;
    },
    setCurrentPair(base, quote) {
      let disabledCurrency = null;

      if (this.coins[base].disable_pairs) {
        disabledCurrency = base;
      } else if (this.coins[quote].disable_pairs) {
        disabledCurrency = quote;
      }
      if (disabledCurrency) {
        this.$notify({
          type: "error",
          text: this.$t("common.pairTradeDisabled", {
            currency: disabledCurrency,
          }),
        });
      } else {
        this.$emit("setCurPair", base, quote);
      }
    },
    pair24green(pair) {
      let pricediff = this.getFromObj(this.pairs, pair + ":price_24h", 0);
      if (pricediff >= 0) {
        return true;
      } else if (pricediff < 0) {
        return false;
      }
    },
  },
};
</script>
<style scoped lang="scss">
tr.disabled {
  opacity: 0.5;
}

.sell-orders .tr-row td {
  padding-top: 4px;
  padding-bottom: 4px;
}
.currency__filter-icon {
  position: relative;
  top: 7px;
  height: 10px;
  left: 3px;
}
.currency__filter-search {
  border-bottom: 1px solid #dfe2e6;
}

.sort-label {
  cursor: pointer;
  position: relative;
  user-select: none;
  padding-right: 10px;

  &::after,
  &::before {
    content: "";
    position: absolute;
    top: calc(50% - 3px);
    right: 0;
    border: 3px solid transparent;
    transition: border-color 0.2s;
  }

  &::after {
    transform: translateY(4px);
    border-top-color: #c8c8c8;
  }

  &::before {
    transform: translateY(-4px);
    border-bottom-color: #c8c8c8;
  }

  &_direction {
    &_desc {
      &::before {
        border-bottom-color: #38393a;
      }
    }

    &_asc {
      &::after {
        border-top-color: #38393a;
      }
    }
  }
}
</style>

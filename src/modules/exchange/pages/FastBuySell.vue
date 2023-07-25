<template>
  <div v-if="cur1 !== '' && cur2 !== ''">
    <div class="fastBuy-wpapper md:grid gap-2 xl:grid-cols-2 xl:gap-4">
      <FastBuySellWalletList @set-pair="setPair" />
      <div class="">
        <div class="exchange">
          <div
            class="exchangeNow"
            :style="secondColor ? `background: ${secondColor} !important` : {}"
          >
            1 {{ cur1 }} =
            {{ addSpaceFixDecimal(pricetop, coins[cur2]?.decimals || 8) }}
            {{ cur2 }}
          </div>
          <div
            class="wallet__title exchange__title font-bold"
            style="margin-top: 0; min-width: 295px"
          >
            {{ $t("common.instantexchange") }}
          </div>
          <form class="exchangeForm" novalidate @submit.prevent>
            <div
              class="exchangeFormWrap"
              style="margin-bottom: 0; margin-top: 0"
            >
              <span class="exchange__input-wrapper">
                <span class="exchange__input-options">
                  <label for="give" class="exchange__label"
                    >{{ $t("common.i_give") }}:</label
                  >
                </span>
                <div class="exchange__input-select-container">
                  <input
                    id="give"
                    v-model="give"
                    v-numeric.number.decimal.fractional
                    :fractional="coins[cur1]?.decimals || 8"
                    class="exchangeForm__input exchange__input"
                    type="text"
                  />
                  <select-3
                    v-if="activeCoinsSelect3[cur1]"
                    :name="'cur_1'"
                    :value="cur1"
                    :options="activeCoinsSelect3"
                    class="qExchangeSelect"
                    :all-coins="coins"
                    @input="cur1 = $event"
                  />
                </div>
                <p class="exchange__limits">
                  {{ $t("common.min") }}:
                  <span class="blue-number">{{ limits?.min }}</span>
                  <img
                    class="relative ml-2 inline-block"
                    style="top: -2px"
                    width="13"
                    :src="
                      coins?.[cur1]?.logo?.length > 0
                        ? coins?.[cur1]?.logo
                        : `/public/img/coin/${cur1.toLowerCase()}.svg`
                    "
                    alt=""
                  />
                  {{ cur1 }}
                  <span class="cur-separator">|</span>
                  {{ $t("common.max") }}:
                  <span class="blue-number">{{ limits?.max }}</span>
                  <img
                    class="relative ml-2 inline-block"
                    style="top: -2px"
                    width="13"
                    :src="
                      coins?.[cur1]?.logo?.length > 0
                        ? coins?.[cur1]?.logo
                        : `/public/img/coin/${cur1.toLowerCase()}.svg`
                    "
                    alt=""
                  />
                  {{ cur1 }}
                </p>
                <p
                  :class="{ 'exchange__not-enough--visible': cur1notEnough }"
                  class="exchange__not-enough"
                >
                  {{ $t("common.not_enough") }} {{ cur1 }}:
                  <router-link to="/wallet" class="link">{{
                    $t("common.topup")
                  }}</router-link>
                </p>
              </span>
            </div>
            <div class="flex justify-center w-full">
              <div
                class="simple-ad-search__arrows simple-ad-search__arrows_button"
                :style="mainColor ? `background: ${mainColor} !important` : {}"
                @click="swapPairs"
              >
                <img
                  class="simple-ad-search__arrow-down"
                  src="/public/img/common/arrow.svg"
                />
                <img
                  class="simple-ad-search__arrow-top"
                  src="/public/img/common/arrow.svg"
                />
              </div>
            </div>
            <div
              class="exchangeFormWrap"
              style="margin-bottom: 0px; margin-top: 5px"
            >
              <span class="exchange__input-wrapper">
                <label class="exchange__label">
                  {{ $t("common.i_get") }}:
                </label>
                <div class="exchange__input-select-container">
                  <input
                    id="get"
                    v-model="get"
                    class="exchangeForm__input exchange__input"
                    :class="{ 'exchange__input--zero-value': !receiveAmount }"
                    type="text"
                  />

                  <Select3
                    v-if="relatedCoinsSelect3[cur2]"
                    :name="'cur_2'"
                    :value="cur2"
                    :options="relatedCoinsSelect3"
                    class="qExchangeSelect"
                    :all-coins="coins"
                    @input="cur2 = $event"
                  />
                </div>
                <p class="exchange__fee-hint">
                  {{ $t("common.fee") }}:
                  <span class="blue-number">{{ exchangeFee }}</span>
                  <img
                    class="relative ml-2 inline-block"
                    style="top: -2px"
                    width="13"
                    :src="
                      coins?.[cur2]?.logo?.length > 0
                        ? coins[cur2].logo
                        : `/public/img/coin/${cur2.toLowerCase()}.svg`
                    "
                    alt=""
                  />
                  {{ cur2 }}
                </p>
              </span>
            </div>
            <div class="exchange__balance exchange__balance_second">
              <span></span>
            </div>
            <div class="alert-container">
              <p>
                {{ $t("quickBuy.allertmsg1") }}
              </p>
              <p>
                {{ $t("quickBuy.allertmsg2") }}
              </p>
            </div>
            <div class="flex w-full justify-center">
              <router-link v-if="!isLoggedIn" :to="`/login/`">
                <button
                  class="exchange__button--normal exchange__button exchangeForm__button"
                  :style="
                    mainColor ? `background: ${mainColor} !important` : {}
                  "
                >
                  {{ $t("common.login") }}
                </button>
              </router-link>
              <button
                v-else
                :class="{
                  'exchange__button--pending': exchangePending,
                  'exchange__button--normal': !exchangePending,
                }"
                :disabled="
                  give <= 0 ||
                  exchangePending ||
                  badLimits ||
                  exchangeDisabled ||
                  cur1notEnough
                "
                type="button"
                class="exchange__button exchangeForm__button"
                :style="mainColor ? `background: ${mainColor} !important` : {}"
                @click="doIT"
              >
                {{ exchangePending ? "" : $t("quickBuy.to_exchange") }}
                <div
                  v-if="exchangePending"
                  class="loader exchangeForm__img"
                  style="margin: auto"
                ></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div>
      <div class="w-full">
        <FastBuySellHistoryList ref="history" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import isFiat from "~/mixins/isFiat";
import getCoolBalance from "~/mixins/getCoolBalance";
import getCoolBalanceFIAT from "~/mixins/getCoolBalanceFIAT";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import getRegularNumber from "~/mixins/getRegularNumber";
import delay from "~/mixins/delay";
import FastBuySellWalletList from "~/modules/exchange/components/FastBuySellWalletList.vue";
import FastBuySellHistoryList from "~/modules/exchange/components/FastBuySellHistoryList.vue";
import Select3 from "~/components/ui/Select3.vue";
import InfoModal from "~/components/modals/InfoModal.vue";
import { mapActions } from "vuex";

export default {
  name: "QuickBuySell",
  metaInfo() {
    return {
      title: this.$t("pages.titles.quick_buy_sell"),
      meta: [
        {
          name: "description",
          content: this.$t("pages.quickbuysellDescription"),
        },
      ],
    };
  },
  components: {
    FastBuySellHistoryList,
    FastBuySellWalletList,
    Select3,
  },
  mixins: [
    getFixedDecimal,
    getRegularNumber,
    isFiat,
    getCoolBalance,
    getCoolBalanceFIAT,
    delay,
  ],
  data() {
    return {
      preventDisabledExchangeMsg: false,
      exchangeDisabled: false,
      receiveAmount: 0,
      balanceSum: 0,
      cur1: "BTC",
      cur2: "USDT",
      give: null,
      get: null,
      pricetop: 1,
      operation: 0,
      maintimer: null,
      exchangePending: false,
      times: false,
      ignoreChangeCur1: false,
      ignoreChangeCur2: false,
      badLimits: true,
      stop: false,
    };
  },
  computed: {
    ...mapGetters({
      balance: "core/balance",
      coins: "core/coins",
      user_notification: "core/user_notification",
      isLoggedIn: "core/isLoggedIn",
    }),
    isAuthorized() {
      return this.$store.getters["core/isAuthorized"];
    },
    filteredCoins() {
      return Object.fromEntries(
        Object.entries(this.coins).filter(
          ([, coin]) => !coin.disable_all && !coin.disable_exchange
        )
      );
    },
    activeCoinsSelect3() {
      return Object.keys(this.filteredCoins).reduce(
        (acc, el) => ({
          ...acc,
          [el]: el,
        }),
        {}
      );
    },
    relatedCoinsSelect3() {
      const coins = {};
      let currentCoin = this.coins[this.cur1];
      if (currentCoin?.pairs) {
        Object.keys(currentCoin.pairs).map((key) => {
          let pair = currentCoin.pairs[key];
          if (
            !this.coins[pair.base].disable_all &&
            !this.coins[pair.base].disable_exchange &&
            !this.coins[pair.quote].disable_all &&
            !this.coins[pair.quote].disable_exchange
          ) {
            if (pair.quote !== this.cur1) {
              coins[pair.quote] = pair.quote;
            }
            if (pair.base !== this.cur1) {
              coins[pair.base] = pair.base;
            }
          }
        });
      }
      return coins;
    },
    exchangeFee() {
      if (this.receiveAmount) {
        let fee =
          this.receiveAmount *
          this.coins[this.cur2]["fee"]["exchange"]["value"];
        fee = this.getFixedDecimal(fee, this.coins[this.cur2]?.decimals || 8);
        return this.getRegularNumber(fee);
      }

      return 0;
    },
    currentBalance() {
      const isFiat = this.isFiat(this.cur1);
      const coin = this.coins[this.cur1];
      return coin?.actual
        ? isFiat
          ? this.getCoolBalanceFIAT(this.cur1)
          : this.getCoolBalance(this.cur1)
        : 0;
    },
    currentBalanceEx() {
      const isFiat = this.isFiat(this.cur2);
      const coin = this.coins[this.cur2];
      return coin?.actual
        ? isFiat
          ? this.getCoolBalanceFIAT(this.cur2)
          : this.getCoolBalance(this.cur2)
        : 0;
    },
    cur1notEnough() {
      return this.getFixedDecimal(this.currentBalance) < this.give;
    },
    cur2notEnough() {
      return this.getFixedDecimal(this.currentBalance) < this.get;
    },
    limits() {
      const coin = this.coins[this.cur1];
      const result = {};
      if (coin) {
        result.min = coin?.limits?.order?.min;
        result.max = coin?.limits?.order?.max;
      }
      return result;
    },
    limitsEx() {
      const coin = this.coins[this.cur2];
      const result = {};
      if (coin) {
        result.min = coin?.limits?.order?.min;
        result.max = coin?.limits?.order?.max;
      }
      return result;
    },
    settledAmount() {
      const rest = this.isFiat(this.cur2) ? 2 : 8;
      return (
        this.getFixedDecimal(this.receiveAmount, rest) -
        this.getFixedDecimal(this.exchangeFee, rest)
      ).toFixed(rest);
    },
  },
  watch: {
    isAuthorized(val) {
      if (val === undefined) {
        location.reload();
      }
    },
    cur1() {
      this.give = null;
      this.get = null;
      if (this.ignoreChangeCur1) return;
      this.delayProcessExchange();
      const first = Object.keys(this.relatedCoinsSelect3)[0];
      if (!this.relatedCoinsSelect3[this.cur2]) {
        this.cur2 = first;
      }
    },
    cur2() {
      if (this.ignoreChangeCur2) return;
      this.give = null;
      this.get = null;
      this.delayProcessExchange();
    },
    give(val) {
      if (!this.stop) {
        if (typeof val === "string" && val.includes(",")) {
          this.give = val.replace(",", ".");
        }
        this.delayProcessExchange("giveChange");
      }
    },
    get(val) {
      if (!this.stop) {
        if (typeof val === "string" && val.includes(",")) {
          this.get = val.replace(",", ".");
        }
        this.delayProcessExchangeEx("getChange");
      }
    },
    user_notification(notifications) {
      if (notifications.length) {
        this.$modal.show(
          InfoModal,
          {},
          {
            adaptive: true,
            height: "auto",
            scrollable: true,
            width: 500,
          }
        );
      }
    },
  },
  mounted() {
    this.$store.dispatch("core/getCoinsLimits");
    this.updateBalance();
    this.$store.dispatch("core/getPairs");
    this.$store.dispatch("core/getUserNotifications");
    this.processexchange(0);
    if (this.$route.query.type && this.$route.query.type === "sell") {
      this.ignoreChangeCur1 = true;
      this.cur1 = this.$route.query?.coin1;
      this.cur2 = this.$route.query?.coin2;
      if (this.$route.query.val) {
        setTimeout(() => {
          this.give = this.$route.query.val;
        }, 2000);
        this.delayProcessExchange("giveChange");
      }
      this.ignoreChangeCur2 = false;
    }
    if (this.$route.query.type && this.$route.query.type === "buy") {
      this.ignoreChangeCur1 = true;
      this.cur1 = this.$route.query?.coin1;
      this.cur2 = this.$route.query?.coin2;
      setTimeout(() => {
        this.ignoreChangeCur1 = false;
      }, 1000);
    }
  },
  beforeUnmount() {
    this.maintimer && clearTimeout(this.maintimer);
  },
  methods: {
    ...mapActions(["getNotifications"]),
    delayProcessExchange(id = "pairChange") {
      this.delay(
        id,
        () => {
          this.maintimer && clearTimeout(this.maintimer);
          this.processexchange();
          if (this.cur1notEnough) {
            this.get = null;
          }
        },
        400
      );
    },
    delayProcessExchangeEx(id = "pairChange") {
      this.delay(
        id,
        () => {
          this.maintimer && clearTimeout(this.maintimer);
          this.processexchangeEx();
          if (this.cur2notEnough) {
            this.give = null;
          }
        },
        400
      );
    },

    swapPairs() {
      const tempCur = this.cur1;
      this.cur1 = this.cur2;
      this.cur2 = tempCur;
    },

    setPair({ currency, type }) {
      if (this.coins[currency].disable_exchange) {
        this.$notify({
          type: "error",
          text: this.$t("common.pairExchangeDisabled", { currency: currency }),
        });

        return;
      }

      const pairs = this.filteredCoins[currency].pairs;
      const firstPair = pairs[Object.keys(pairs)[0]];
      if (type === "sell") {
        this.ignoreChangeCur1 = true;
        this.cur1 = currency;
        this.ignoreChangeCur1 = false;
        setTimeout(() => {
          this.cur2 =
            currency == firstPair.base ? firstPair.quote : firstPair.base;
        }, 10);
      } else {
        this.ignoreChangeCur1 = true;
        this.cur1 =
          currency === firstPair.base ? firstPair.quote : firstPair.base;
        this.ignoreChangeCur1 = false;
        setTimeout(() => {
          this.cur2 = currency;
        }, 10);
      }
    },
    setCur1AmountPercentHandler(percent) {
      const result =
        (this.getFixedDecimal(this.currentBalance) / 100) * percent;
      this.processexchange(result, percent);
    },
    checkAndSetAmount(result, percent = null) {
      result = this.getFixedDecimal(result);
      if (Number.isNaN(result) || result === 0) return false;
      if (percent && this.give !== result) {
        this.give = result;
      }
      if (this.isLoggedIn) {
        const { min, max } = this.limits;
        let text = "";

        if (result >= min && this.currentBalance >= min && result <= max) {
          this.badLimits = false;

          return true;
        } else if (result > max) {
          this.badLimits = true;

          if (percent) {
            text = this.$t("common.quantityIsGreaterThanMax", {
              selectedPercent: percent,
              maxLimit: max,
              currency: this.cur1,
            });
          } else {
            text = this.$t("common.quantityIsTooBig");
          }

          this.$notify({
            type: "warning",
            text,
            duration: 10000,
          });

          return true;
        } else if (result < min && this.currentBalance > min) {
          this.badLimits = true;

          if (percent) {
            text = this.$t("common.quantityIsLowerThanMin", {
              selectedPercent: percent,
              minLimit: max,
              currency: this.cur1,
            });
          } else {
            text = this.$t("common.quantityIsTooLow");
          }

          this.$notify({
            type: "warning",
            text,
            duration: 10000,
          });

          return true;
        } else {
          this.badLimits = false;

          this.$notify({
            type: "warning",
            text: this.$t("common.notEnoughForExchange"),
            duration: 5000,
          });

          return false;
        }
      }
    },
    checkAndSetAmountEx(result, percent = null) {
      result = this.getFixedDecimal(result);
      if (Number.isNaN(result) || result === 0) return false;
      if (percent && this.get !== result) {
        this.get = result;
      }
      if (this.isLoggedIn) {
        const { min, max } = this.limitsEx;
        let text = "";

        if (result >= min && this.currentBalanceEx >= min && result <= max) {
          this.badLimits = false;

          return true;
        } else if (result > max) {
          this.badLimits = true;

          if (percent) {
            text = this.$t("common.quantityIsGreaterThanMax", {
              selectedPercent: percent,
              maxLimit: max,
              currency: this.cur2,
            });
            this.$notify({
              type: "warning",
              text,
              duration: 10000,
            });
          }

          return true;
        } else if (result < min && this.currentBalanceEx > min) {
          this.badLimits = true;

          if (percent) {
            text = this.$t("common.quantityIsLowerThanMin", {
              selectedPercent: percent,
              minLimit: max,
              currency: this.cur2,
            });
          } else {
            text = this.$t("common.quantityIsTooLow");
          }

          this.$notify({
            type: "warning",
            text,
            duration: 10000,
          });

          return true;
        } else {
          this.badLimits = false;

          this.$notify({
            type: "warning",
            text: this.$t("common.notEnoughForExchange"),
            duration: 5000,
          });

          return false;
        }
      }
    },
    getCoolPrice(priceValue) {
      const price = parseFloat(priceValue);

      if (price < 1) {
        return price.toFixed(8);
      } else if (price < 100) {
        return price.toFixed(7);
      } else if (price < 1000) {
        return price.toFixed(6);
      } else if (price < 10000) {
        return price.toFixed(5);
      } else if (price < 100000) {
        return price.toFixed(4);
      } else if (price < 1000000) {
        return price.toFixed(3);
      } else {
        return price.toFixed(1);
      }
    },
    drawSuccess(oper, sum, cur1, cur2, price) {
      const self = this;
      if (oper === "succ") {
        self.$notify({
          type: "success",
          title: self.$t("common.exchange_done"),
          text: `${self.$t("common.amount_short")}: ${sum} ${cur1} ${self.$t(
            "common.to"
          )} ${price} ${cur2}`,
        });
      } else if (oper === "no") {
        self.$notify({
          type: "error",
          title: self.$t("common.not_done"),
          text: `${self.$t("common.amount_short")}: ${sum} ${cur1} ${self.$t(
            "common.to"
          )} ${cur2}`,
        });
      } else if (oper === "cancelled") {
        self.$notify({
          type: "error",
          title: self.$t("common.not_done"),
          text: self.$t("common.order_cancelled"),
        });
      }
    },

    async doIT() {
      if (this.give === "" || this.exchangePending) return;
      this.exchangePending = true;
      let stop = true;
      if (stop) {
        try {
          const response = await this.$http.post("exchange/", {
            base_currency: this.cur1,
            quote_currency: this.cur2,
            operation: this.operation,
            quantity: this.give,
          });
          if (Object.keys(response.data).length === 0) throw "no";
          else if (response.data.order.state === 2) throw "cancelled";
          this.getNotifications();
          this.drawSuccess(
            "succ",
            this.give,
            this.cur1,
            this.cur2,
            response.data["cost"]
          );
          this.updateBalance();
          this.give = null;
          this.get = null;
          this.receiveAmount = 0;
          // Вернуть кнопку
        } catch (e) {
          if (e === "cancelled")
            this.drawSuccess("cancelled", this.give, this.cur1, this.cur2, "");
          else this.drawSuccess("no", this.give, this.cur1, this.cur2, "");
        } finally {
          stop = false;
        }
        this.$refs.history.getExchangeHistory();
      }

      this.exchangePending = false;
    },
    disableExchange(showMessage) {
      if (!this.preventDisabledExchangeMsg) {
        const self = this;

        this.preventDisabledExchangeMsg = true;

        if (showMessage) {
          this.$notify({
            type: "error",
            text: this.$t("common.exchangeDisabled"),
          });
        }

        setTimeout(() => {
          self.preventDisabledExchangeMsg = false;
        }, 1000);
      }

      this.exchangeDisabled = true;
    },
    disableExchangeEx() {
      if (!this.preventDisabledExchangeMsg) {
        const self = this;

        this.preventDisabledExchangeMsg = true;

        if (this.get !== null && this.get !== undefined && this.get > 0) {
          this.$notify({
            type: "error",
            text: this.$t("common.exchangeDisabled"),
          });
        }

        setTimeout(() => {
          self.preventDisabledExchangeMsg = false;
        }, 1000);
      }

      this.exchangeDisabled = true;
    },
    enableExchange() {
      this.exchangeDisabled = false;
    },
    processexchange(give = this.give, percent = null) {
      this.stop = true;
      if (!this.checkAndSetAmount(give, percent) && Number.isNaN(give)) {
        return;
      }

      const time = 20000;
      const opertype = 1;
      let qUANTITY = 0.000001;

      this.maintimer && clearTimeout(this.maintimer);

      if (this.give !== "") {
        if (this.getFixedDecimal(this.give) > 0.0) {
          qUANTITY = this.getFixedDecimal(this.give);
        }
      }
      this.operation = opertype;
      if (this.stop) {
        this.$http
          .put("exchange/", {
            base_currency: this.cur1,
            quote_currency: this.cur2,
            operation: opertype,
            quantity: qUANTITY,
          })
          .then(
            (response) => {
              if (response.data.disable_exchange) {
                this.disableExchange(
                  this.give !== null && this.give !== undefined && this.give > 0
                );
              } else {
                this.enableExchange();
              }

              if (response.data["cost"] * 1 === 0) {
                this.disableExchange(false);
                this.$notify({
                  type: "warning",
                  text: this.$t("common.instant_exchange"),
                });
              }

              if (
                !this.give ||
                this.give === "" ||
                this.getFixedDecimal(this.give) === 0
              ) {
                this.get = "";
                this.receiveAmount = 0;
              } else {
                this.receiveAmount = response.data["cost"]
                  ? this.getFixedDecimal(
                      response.data["cost"],
                      this.coins[this.cur2]?.decimals || 8
                    )
                  : "0.0";
                this.get = this.receiveAmount;
              }
              if (response.data["price"]) {
                this.pricetop = response.data["price"];
              } else {
                this.pricetop = 0.0;

                if (
                  !this.times &&
                  this.balance[this.cur1] &&
                  this.balance[this.cur1].actual >
                    this.getFixedDecimal(this.give)
                ) {
                  this.times = true;

                  this.$notify({
                    type: "warning",
                    text: this.$t("common.instant_exchange"),
                  });

                  setTimeout(() => {
                    this.times = false;
                  }, 3000);
                }
              }

              this.maintimer = setTimeout(() => {
                this.processexchange();
              }, time);
            },
            (r) => {
              this.get = null;
              this.badLimits = true;

              if (r?.data?.non_field_errors) {
                if (
                  r.data["non_field_errors"][0] === "suitable pair not found"
                ) {
                  this.$notify({
                    type: "warning",
                    text: this.$t("common.notSuitablePair"),
                  });
                }
              } else {
                this.disableExchange(false);
                this.$notify({
                  type: "warning",
                  text: this.$t("common.instant_exchange"),
                });
              }
            }
          )
          .finally(() => {
            this.stop = false;
          });
      }
    },
    processexchangeEx(get = this.get, percent = null) {
      this.stop = true;
      if (!this.checkAndSetAmountEx(get, percent) && Number.isNaN(get)) {
        return;
      }

      const time = 20000;
      const opertype = 1;
      let qUANTITY = 0.000001;

      this.maintimer && clearTimeout(this.maintimer);

      if (this.give !== "") {
        if (this.getFixedDecimal(this.get) > 0.0) {
          qUANTITY = this.getFixedDecimal(this.get);
        }
      }
      this.operation = opertype;
      if (this.stop) {
        this.$http
          .put("exchange/", {
            base_currency: this.cur2,
            quote_currency: this.cur1,
            operation: opertype,
            quantity: qUANTITY,
          })
          .then(
            (response) => {
              if (response.data.disable_exchange) {
                this.disableExchangeEx();
              } else {
                this.enableExchange();
              }

              if (
                !this.get ||
                this.get === "" ||
                this.getFixedDecimal(this.get) === 0
              ) {
                this.give = "";
                this.receiveAmount = 0;
              } else {
                this.receiveAmount = response.data["cost"]
                  ? this.getCoolPrice(response.data["cost"])
                  : "";
                this.give = this.receiveAmount;
              }
              if (response.data["price"]) {
                this.pricetop = response.data["price"];
              } else {
                this.pricetop = 0.0;

                if (
                  !this.times &&
                  this.balance[this.cur2] &&
                  this.balance[this.cur2].actual >
                    this.getFixedDecimal(this.get)
                ) {
                  this.times = true;

                  this.$notify({
                    type: "warning",
                    text: this.$t("common.instant_exchange"),
                  });

                  setTimeout(() => {
                    this.times = false;
                  }, 3000);
                }
              }

              this.maintimer = setTimeout(() => {
                this.processexchangeEx();
              }, time);
            },
            (r) => {
              this.give = null;
              this.badLimits = true;

              if (r.data["non_field_errors"]) {
                if (
                  r.data["non_field_errors"][0] === "suitable pair not found"
                ) {
                  this.$notify({
                    type: "warning",
                    text: this.$t("common.notSuitablePair"),
                  });
                }
              }
            }
          )
          .finally(() => {
            this.stop = false;
          });
      }
    },
    updateBalance() {
      this.$store.dispatch("core/getBalance");
    },
    updateTable() {
      this.updateBalance();
    },
  },
};
</script>

<style>
@media (max-width: 650px) {
  .exchangeForm .select2.select2-container {
    margin-right: auto;
  }
}
</style>

<style lang="scss" scoped>
.simple-ad-search {
  &__arrows {
    height: fit-content;

    &_button {
      padding: 5px;
      background: var(--theme-primary-color);
      border-radius: 3px;
      cursor: pointer;
    }
  }

  &__arrow-forward {
    display: block;
    margin-bottom: -10px;
    transform: translateX(1px);
  }

  &__arrow-back {
    display: inline;
    transform: translateX(-1px) rotate(180deg);
  }

  &__arrow-down {
    display: inline;
    transform: translate(0) rotate(90deg);
    margin-right: -9px;
  }

  &__arrow-top {
    display: inline;
    transform: translateY(-1px) rotate(-90deg);
  }
}
::placeholder {
  color: #d9d9d9 !important;
  font-size: 25px !important;
  font-weight: 400 !important;
}

.exchange {
  padding: 0;
  min-height: 760px;

  &__top-up-button {
    color: #ffffff;
    font-size: 16px;
    line-height: 30px;
    font-weight: 400;
    border-radius: 5px;
    background-color: var(--theme-primary-color);
    width: 120px;
    display: flex;
    margin: auto;
    justify-content: center;
    box-shadow: 0 2px 5px 0 #bfbfbf;

    &:hover {
      box-shadow: 0 4px 7px 0 #bfbfbf;
    }
  }

  &__title {
    @media (max-width: 650px) {
      font-size: 30px;
    }
  }

  &__input-wrapper {
    width: 100%;

    @media (max-width: 650px) {
      width: 100%;
      order: 2;
      margin-top: 5px;
    }
  }

  &__input-select-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__percent-select {
    display: flex;
    z-index: 2;
    margin-bottom: 3px;
    margin-right: 5px;
    flex-grow: 1;
    max-width: 450px;
    margin-top: 5px;

    span {
      flex-grow: 1;
      text-align: center;
      padding: 2px 8px;
      border: 1px solid #d4d4d4;
      background-color: #f3f2f2;
      border-radius: 1px;
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #d1d1d1;
        transition: background-color 0.2s ease-in;
      }
    }
  }

  &__input-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 60%;
    font-size: 20px;
    line-height: 20px;
    margin-bottom: 4px;

    img {
      padding-bottom: 3px;
      padding-right: 3px;
    }
  }

  &__label {
    margin-top: 10px;
    font-size: 25px;
    margin-right: 10px;
    font-weight: 400;
    margin-bottom: 5px;
    @media (min-width: 1200px) and (max-width: 1380px) {
      width: 100%;
    }
  }

  &__button {
    border: none;
    cursor: pointer;
    height: 70px;

    &--pending {
      cursor: default !important;
      box-shadow: none;
    }
  }

  &__input {
    color: #222;

    &--zero-value {
      color: #d9d9d9;
    }

    &--second {
      background-color: #fbfbf3;
      border-color: var(--theme-primary-color);
      color: var(--theme-primary-color);
    }
  }

  &__fee-hint {
    width: 100%;
  }

  &__not-enough {
    opacity: 0;
    pointer-events: none;

    &--visible {
      transition: opacity 0.1s ease-in;
      opacity: 1;
      pointer-events: initial;
    }
  }

  &__balance-error {
    font-size: 14px;
    color: #865e1b;
    padding-right: 10px;
  }

  &__limits {
    margin-bottom: 5px;
    color: #a93035;
  }

  &__balance {
    flex-basis: 55%;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 1280px) {
      flex-direction: column;
    }

    &.exchange__balance_second {
      flex-basis: 45%;

      @media (max-width: 1280px) {
        padding-bottom: 10px;
      }
    }
  }
}

.balancelist .exchange__top-up-button {
  margin: 0;
}

.link {
  text-decoration: none;
  color: var(--theme-primary-color);
}

.wallet__title {
  display: flex;
  align-items: center;
  margin-top: 0;
  min-height: 90px;
}

.exchangeNow {
  float: right;
  margin-right: 30px;
  margin-top: 25px;
}

.row {
  @media screen and (max-width: 1199px) {
    flex-direction: column;
  }
}

.exchangeForm {
  @media screen and (max-width: 500px) {
    padding: 0 20px 30px;
  }

  &__input {
    width: 60%;
    height: 79px;
    margin-right: 15px;

    @media screen and (max-width: 767px) {
      min-width: 100%;
    }
  }
}

.alert-container {
  text-align: center;
  margin: 0px auto 20px auto;
  padding: 10px;
  border-radius: 5px;
  background-color: #fcf8e3;
  color: #8a6d3b;
}
.alert-container p {
  font-family: "Open Sans", sans-serif;
  margin: 10px auto;
  font-size: 17px;
  font-weight: 400;
}
.exchange__limits {
  font-weight: 400;
  font-size: 14px;
}

.exchangeFormWrap {
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;

    .exchangeForm__input {
      margin-bottom: 5px;
      text-align: center;
      margin-right: 10px;
    }
  }
}
.exchange__input-options {
  font-weight: 400;
}
.exchange__input-options img {
  width: 20px;
  display: inline-block;
}
.exchangeForm__input {
  padding-left: 20px !important;
}
</style>

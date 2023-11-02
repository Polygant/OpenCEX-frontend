<template>
  <div v-if="showPage">
    <div class="flex flex-wrap xl:-mt-2">
      <div class="md:w-3/12 order-tables">
        <v-card class="rounded-[3px] overflow-hidden mt-4">
          <SellOrders
            :decimals="coins[currentBaseCurrency].decimals"
            :base-currency="currentBaseCurrency"
            :quote-currency="currentQuoteCurrency"
            :stack-precision="pairPrecisions"
            :precision="savedPrecision"
            @change-precision="changePrecision"
            @sellrowclick="setLimitOrder('buy', $event.quantity, $event.price)"
            @buyrowclick="setLimitOrder('sell', $event.quantity, $event.price)"
          ></SellOrders>
        </v-card>
      </div>
      <div class="md:w-6/12 graphic-order xl:px-4">
        <div class="graphic-order-wrapper">
          <TradeGraphic
            :precision="Math.min(savedPrecision * 1, 0.01) || 0.01"
          />
        </div>
        <div>
          <v-card>
            <TradeMenus
              class="trade-menus"
              :base-currency="currentBaseCurrency"
              :quote-currency="currentQuoteCurrency"
              @error="showErrorMessage"
            />
          </v-card>
        </div>
      </div>
      <div class="md:w-3/12 data-order xl:pb-0 pb-4">
        <div class="mt-4 currency-list">
          <v-card>
            <CurrencyList
              :default-pair="pairprop"
              :current-pair="currentPair"
              @set-cur-pair="setCurrentPair"
            ></CurrencyList>
          </v-card>
        </div>
        <div class="wallet-list">
          <div :class="{ blocked: !isAuthorized }">
            <div v-if="!isAuthorized" class="wallet-list--tooltip-layer"></div>
            <WalletList :coins="coins" @tab-chosen="bluewallet"></WalletList>
            <div v-if="showbluewallet" class="wallet clear">
              <router-link :to="'/wallet'" class="wallet__link">
                <img
                  src="/public/img/rect-orange.svg"
                  alt="rect"
                  class="wallet__link-image wallet-sell inline-block"
                />
                {{ $t("common.wallet") }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="xl:grid lg:grid-cols-2 lg:gap-4">
      <UserOrders @error="showErrorMessage" @pull-orders="getOrders" />
      <Recent />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Init } from "~/utilities/manager";
import getFormattedDate from "~/mixins/getFormattedDate";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import mainPageDataMocks from "~/mixins/mainPageDataInitMocks";
import getPair from "~/mixins/getPair";
import { Decimal } from "decimal.js";
import SellOrders from "../components/orders/Orders.vue";
import CurrencyList from "../components/CurrencyList.vue";
import WalletList from "~/modules/wallet/components/WalletList.vue";
import UserOrders from "~/components/main/userOrders/userOrders.vue";
import Recent from "../components/Recent.vue";
import TradeMenus from "../components/TradeMenus.vue";
import TradeGraphic from "../components/TradeGraphic.vue";
import InfoModal from "~/modules/wallet/components/modals/InfoModal.vue";

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
  name: "TradePage",
  metaInfo() {
    return {
      title: this.pairprop + " " + this.$t("pages.titles.trade"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.walletDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    SellOrders,
    CurrencyList,
    WalletList,
    UserOrders,
    Recent,
    TradeMenus,
    TradeGraphic,
  },
  mixins: [mainPageDataMocks, getFixedDecimal, getFormattedDate, getPair],
  props: {
    pairprop: {
      type: String,
      default: "BTC-USDT",
      useDefaultForNull: true,
    },
  },
  data() {
    return {
      currentPair: ["BTC", "USDT"],
      showbluewallet: true,
      pagination: {
        open_orders: {
          countPages: 1,
          currentPage: 1,
          offset: 0,
          perPage: 7,
        },
        close_orders: {
          countPages: 1,
          currentPage: 1,
          offset: 0,
          perPage: 7,
        },
      },
      savedPrecision: null,
    };
  },
  computed: {
    ...mapGetters({
      stack: "core/stack",
      wsMessage: "wsMessage",
      isConnectedSocket: "isConnectedSocket",
      reconnectError: "reconnectError",
      coins: "core/coins",
      pairs: "core/pairs",
      profile: "core/profile",
      wsUserIsAuthenticated: "wsUserIsAuthenticated",
      user_notification: "core/user_notification",
      currentPrecisions: "core/currentPrecisions",
    }),
    showPage() {
      return (
        this.pairsList.length &&
        this.coins &&
        this.coins[this.currentBaseCurrency] &&
        this.coins[this.currentQuoteCurrency]
      );
    },
    headerAccountData() {
      return {
        currentBaseCurrency: this.currentBaseCurrency,
        currentQuoteCurrency: this.currentQuoteCurrency,
        pairs: this.pairs,
        pairprop: this.pairprop,
        currentPair: this.currentPair,
      };
    },
    ordersLimit() {
      return 7;
    },
    isAuthorized() {
      return !!this.$store.getters["core/isAuthorized"];
    },
    currentBaseCurrency() {
      return this.$store.getters["getCurrentBaseCurrency"];
    },
    currentQuoteCurrency() {
      return this.$store.getters["getCurrentQuoteCurrency"];
    },
    pairsList() {
      return Object.keys(this.pairs);
    },
    isAuthorizedSession() {
      return this.$store.getters["core/profile"].user.username;
    },
    pairPrecisions() {
      const pair = `${this.currentPair[0]}-${this.currentPair[1]}`;
      let pairPrecisions = [];

      if (this.pairs[pair]) {
        pairPrecisions = this.pairs[pair].stack_precisions;
      }

      return pairPrecisions;
    },
  },
  watch: {
    isAuthorizedSession(val) {
      if (!val) {
        location.reload();
      }
    },
    pairprop: {
      immediate: true,
      handler(val) {
        this.setCurrentPairsInStore(val);
      },
    },
    headerAccountData: {
      immediate: true,
      handler(val) {
        this.$store.commit("core/UPDATE_HEADER", val);
      },
    },
    pairsList(to, from) {
      if (!to.length || from.length) {
        return;
      }

      if (!to.includes(this.pairprop)) {
        this.$router.replace("/404");
      }
    },
    wsMessage(message) {
      switch (message.kind) {
        case "executed_order_notification":
          this.drawOrderClosed(message.order);
          break;
      }
    },
    stack: {
      deep: true,
      handler(data) {
        if (this.isConnectedSocket) {
          this.updateStack(data);
        }
      },
    },
    isConnectedSocket(isConected) {
      if (isConected) {
        if (localStorage.getItem("token")) {
          this.$store.dispatch(
            "sendWSMessage",
            JSON.stringify({
              token: localStorage.getItem("token"),
            })
          );
        }
        this.getTradesHistory();
        this.getPairsVolume();
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
    wsUserIsAuthenticated(isAuthenticated) {
      if (isAuthenticated) {
        this.sendSocketMessage("add_executed_orders", {}, false, true);
        this.getOpenOrders();
        this.getClosedOrders();
        this.getOpenOrdersByPair();
        this.getClosedOrdersByPair();
        this.getBalance();
      }
    },
    profile(data) {
      if (data.user) {
        this.$store.dispatch("core/getUserNotifications");
      }
    },
    pairPrecisions() {
      if (this.currentPrecisions) {
        const pairData =
          this.currentPrecisions[
            `${this.currentPair[0]}-${this.currentPair[1]}`
          ];
        if (!this.savedPrecision && pairData && pairData.default) {
          this.savedPrecision = pairData.default;
          this.sendPairToWS();
        }
      }
    },
    currentPrecisions(data) {
      if (data && this.currentPair) {
        const pairData = data[`${this.currentPair[0]}-${this.currentPair[1]}`];
        this.sendPairToWS(pairData.default);
      }
    },
  },
  beforeUnmount() {
    this.unsubscribeWsData();
    this.$store.commit("core/STACK", []);
    this.$store.commit("core/UPDATE_HEADER", null);
  },
  mounted() {
    this.check2faUpdates();

    Init.Pairs();

    if (this.isAuthorized) {
      setInterval(() => {
        if (!localStorage.getItem("token")) {
          location.reload();
        }
      }, 10000);
    }
    if (this.isConnectedSocket) {
      if (localStorage.getItem("token")) {
        this.sendToken();
      }

      this.sendPairToWS();
      this.getTradesHistory();
      this.getPairsVolume();

      if (this.wsUserIsAuthenticated) {
        this.sendSocketMessage("add_executed_orders", {}, false, true);
        this.getOpenOrders();
        this.getClosedOrders();
        this.getOpenOrdersByPair();
        this.getClosedOrdersByPair();
        this.getBalance();
      }
    }

    if (this.profile.user) {
      this.$store.dispatch("core/getUserNotifications");
    }
  },
  methods: {
    setLimitOrder(operation, quantity, price) {
      this.$store.commit("setSuggestedOrderParameters", {
        operation,
        quantity: Number(quantity),
        price: Number(price),
      });
    },
    bluewallet(tabName) {
      this.showbluewallet = tabName === "mywallets";
    },
    setCurrentPair(base, quote) {
      if (location.pathname === `/account/trade/${this.getPair(base, quote)}`) {
        return;
      }
      this.$router.push(`/trade/${this.getPair(base, quote)}`);
    },
    showErrorMessage(message) {
      let text = "";
      if (message === "NotEnoughFunds") {
        text = this.$t("common.not_enough_funds");
      } else if (message === "NotEnoughHold") {
        text = this.$t("common.not_enough_holds");
      } else {
        text = message;
      }

      this.$notify({
        type: "error",
        title: this.$t("common.error"),
        text: text,
      });
    },
    drawOrderClosed(order) {
      const titleMessage =
          order.quantity_left === 0
            ? "order_executed"
            : "order_partially_executed",
        title = `${this.$t(`common.${titleMessage}`)}`,
        quantity = order.quantity - order.quantity_left;
      let text = null;

      if (order.operation === 0) {
        text = `${this.$t("common.buying")} ${quantity} ${order.pair} ${this.$t(
          "common.for_price"
        )} ${order.price}`;
      } else {
        if (order.price) {
          text = `${this.$t("common.sells")} ${quantity} ${
            order.pair
          } ${this.$t("common.for_price")} ${order.price}`;
        } else {
          text = `${this.$t("common.sells")} ${quantity} ${this.$t(
            "common.on_market"
          )}`;
        }
      }
      this.$notify({
        title,
        type: "success",
        text: `${text}`,
      });
    },
    updateStack(stack) {
      if (stack) {
        if (stack.rate && precision(stack.rate) > 4) {
          this.pairPrices[stack.pair] = stack.rate.toFixed(4);
        } else if (stack.rate) {
          this.pairPrices[stack.pair] = stack.rate.toFixed(
            precision(stack.rate)
          );
        }

        if (
          (stack.buys_volume || stack.sells_volume) &&
          precision(stack.buys_volume + stack.sells_volume) > 6
        ) {
          this.pairVolume[stack.pair] = (
            stack.buys_volume + stack.sells_volume
          ).toFixed(6);
        } else if (stack.buys_volume || stack.sells_volume) {
          this.pairVolume[stack.pair] = (
            stack.buys_volume + stack.sells_volume
          ).toFixed(precision(stack.buys_volume + stack.sells_volume));
        }

        if (stack.top_sell && precision(stack.top_sell) > 4) {
          this.pairTopSell[stack.pair] = stack.top_sell
            ? stack.top_sell.toFixed(4)
            : 0;
        } else if (stack.top_sell) {
          this.pairTopSell[stack.pair] = stack.top_sell
            ? stack.top_sell.toFixed(precision(stack.top_sell))
            : 0;
        }

        if (stack.top_buy && precision(stack.top_buy) > 4) {
          this.pairTopBuy[stack.pair] = stack.top_buy
            ? stack.top_buy.toFixed(4)
            : 0;
        } else if (stack.top_buy) {
          this.pairTopBuy[stack.pair] = stack.top_buy
            ? stack.top_buy.toFixed(precision(stack.top_buy))
            : 0;
        }

        if (stack.sells_volume) {
          this.$store.commit("setSellVolume", stack.sells_volume.toFixed(8));
        }

        if (stack.buys_volume) {
          const buyVolume = stack.buys_volume.toFixed(8);
          this.$store.commit("setBuyVolume", buyVolume);
        }
      }

      if (this.reconnectError) {
        this.$store.dispatch("core/getStack", {
          pair: this.getPair(this.currentPair[0], this.currentPair[1]),
        });
      }
    },
    check2faUpdates() {
      if (localStorage.getItem("is2faenabled") === "OK") {
        setTimeout(() => {
          this.$notify({
            type: "success",
            title: ``,
            text: `
               ${this.$t("common.modal2fa1")} -
               ${this.$t("common.modal2fa2")} -
               ${this.$t("common.modal2fa3")}
            `,
          });
          localStorage.removeItem("is2faenabled");
        }, 1100);
      }
      if (localStorage.getItem("is2fadisabled") === "OK") {
        setTimeout(() => {
          this.$notify({
            type: "success",
            title: ``,
            text: `
              ${this.$t("common.modal2faoff1")} -
              ${this.$t("common.modal2faoff2")}
            `,
          });
          localStorage.removeItem("is2fadisabled");
        }, 1100);
      }
    },
    setCurrentPairsInStore(newPair) {
      const pair = newPair || this.pairprop;
      this.currentPair = pair.split("-");

      this.$store.commit("setCurrentBaseCurrency", this.currentPair[0]);
      this.$store.commit("setCurrentQuoteCurrency", this.currentPair[1]);
    },
    sendSocketMessage(msgCommand, msgParams, needPair, needToken) {
      let wsMessage = {
        command: msgCommand,
      };

      if (msgParams && Object.keys(msgParams)) {
        wsMessage.params = msgParams;
      }
      if (needToken) {
        wsMessage.token = localStorage.getItem("token") || null;
      }
      if (needPair) {
        wsMessage.params.pair_name = `${this.currentPair[0]}-${this.currentPair[1]}`;
      }

      this.$store.dispatch("sendWSMessage", JSON.stringify(wsMessage));
    },
    sendToken() {
      this.sendSocketMessage("token", {}, false, true);
    },
    sendPairToWS(precision) {
      let params = {};
      if (precision) {
        params = {
          precision: this.savedPrecision,
        };
      } else {
        if (this.currentPrecisions) {
          const pair = `${this.currentPair[0]}-${this.currentPair[1]}`;
          if (this.currentPrecisions[pair].default) {
            params = {
              precision: this.currentPrecisions[pair].default,
            };
          }
        }
      }
      if (params.precision) {
        this.sendSocketMessage("add_stack", params, true, false);
      }
    },
    getTradesHistory() {
      this.sendSocketMessage("add_trades", { page: 1 }, true, false);
    },
    getBalance() {
      this.sendSocketMessage("add_balance", {}, false, true);
      this.$store.dispatch("core/getBalance");
    },
    getOpenOrders(currentPage, updateOrders, data) {
      const command = updateOrders ? "get_opened_orders" : "add_opened_orders";
      this.sendSocketMessage(
        command,
        {
          limit: this.ordersLimit,
          page: currentPage || 1,
          ...data,
        },
        true,
        true
      );
    },
    getClosedOrders(currentPage, updateOrders, data) {
      const command = updateOrders ? "get_closed_orders" : "add_closed_orders";
      this.sendSocketMessage(
        command,
        {
          limit: this.ordersLimit,
          page: currentPage || 1,
          ...data,
        },
        true,
        true
      );
    },
    getOpenOrdersByPair(currentPage, updateOrders, data) {
      const command = updateOrders
        ? "get_opened_orders_by_pair"
        : "add_opened_orders_by_pair";
      this.sendSocketMessage(
        command,
        {
          limit: this.ordersLimit,
          page: currentPage || 1,
          ...data,
        },
        true,
        true
      );
    },
    getClosedOrdersByPair(currentPage, updateOrders, data) {
      const command = updateOrders
        ? "get_closed_orders_by_pair"
        : "add_closed_orders_by_pair";
      this.sendSocketMessage(
        command,
        {
          limit: this.ordersLimit,
          page: currentPage || 1,
          ...data,
        },
        true,
        true
      );
    },
    getPairsVolume() {
      this.sendSocketMessage("add_pairs_volume", {}, false, false);
    },
    unsubscribeWsData() {
      this.sendSocketMessage(
        "del_stack",
        { precision: this.savedPrecision },
        true,
        false
      );
      this.sendSocketMessage("del_trades", {}, true, false);
      if (this.wsUserIsAuthenticated) {
        this.sendSocketMessage("del_balance", {}, false, true);
        this.sendSocketMessage("del_closed_orders", {}, true, true);
        this.sendSocketMessage("del_opened_orders", {}, false, true);
        this.sendSocketMessage("del_opened_orders_by_pair", {}, true, true);
        this.sendSocketMessage("del_closed_orders_by_pair", {}, true, true);
        this.sendSocketMessage("del_executed_orders", {}, false, true);
      }
    },
    getOrders(
      data /** { orderType, page, activePair, filter: { date_from, date_to } } */
    ) {
      if (data.orderType === "close") {
        if (data.activePair) {
          this.getClosedOrdersByPair(data.page, true, data.filter);
        } else {
          this.getClosedOrders(data.page, true, data.filter);
        }
      } else if (data.orderType === "open") {
        if (data.activePair) {
          this.getOpenOrdersByPair(data.page, true, data.filter);
        } else {
          this.getOpenOrders(data.page, true, data.filter);
        }
      }
    },
    changePrecision(precision) {
      if (precision.old && precision.new) {
        this.savedPrecision = precision.new;
        this.sendSocketMessage(
          "del_stack",
          { precision: precision.old },
          true,
          false
        );
        this.sendSocketMessage(
          "add_stack",
          { precision: precision.new },
          true,
          false
        );
      }
    },
  },
};
</script>

<style>
.order-notification-title {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
<style lang="scss" scoped>
@import "~/assets/css/variables";

.graphic-order-wrapper {
  height: 457px;
}

.order-tables {
  position: relative;
  top: -1px;
}

.trade-menus {
  margin-top: 15px;
}
.wallet-list--tooltip-layer {
  z-index: 2;
  background: #fff;
  opacity: 0.4;
}
.wallet {
  font-size: 14px;
  bottom: 1px;
  right: 0;
  padding-right: 10px;
  left: inherit;
  text-align: right;
  width: 100%;
  background: #ffffff;

  &__link {
    text-transform: lowercase;
    text-decoration: none;
  }

  &__link-image {
    height: 11px;
  }
}

.wallet-list {
  position: relative;

  &--tooltip-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  &.blocked {
    opacity: 0.5;
  }
}
</style>

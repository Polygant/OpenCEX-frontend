<template>
  <div class="trade-menus" :class="{ 'trade-menus_blocked': !isAuthorized }">
    <div v-if="!isAuthorized" class="trade-menus--tooltip-layer"></div>
    <div>
      <ul class="nav nav-tabs trade-menus__links" role="tablist">
        <li class="nav-item trade-menus__nav-item">
          <a
            class="trade-menus__link nav-link"
            :class="{ active: tab === 1 }"
            @click="setTab(1)"
          >
            {{ $t("common.limit") }}
          </a>
        </li>
        <li class="nav-item trade-menus__nav-item">
          <a
            class="trade-menus__link nav-link"
            :class="{ active: tab === 2 }"
            @click="setTab(2)"
          >
            {{ $t("common.stop_limit") }}
          </a>
        </li>
        <li v-if="otcenabled" class="nav-item trade-menus__nav-item">
          <a
            class="trade-menus__link nav-link"
            :class="{ active: tab === 3 }"
            @click="setTab(3)"
          >
            {{ $t("common.automatic") }}
          </a>
        </li>
      </ul>

      <div class="trade-menus__content tab-content">
        <div
          id="limit-list-1"
          class="tab-pane fade show"
          role="tabpanel"
          :class="{ active: tab === 1 || !tab }"
        >
          <div class="xl:flex block">
            <LimitList
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :disable-operations="disableOperations"
              operation="buy"
              @add-order="
                addOrder('buy', $event.orderData, $event.type, $event.callback)
              "
            />
            <LimitList
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :disable-operations="disableOperations"
              operation="sell"
              @add-order="
                addOrder('sell', $event.orderData, $event.type, $event.callback)
              "
            />
          </div>
        </div>
        <div
          id="stop-limit-1"
          class="tab-pane fade show"
          :class="{ active: tab === 2 }"
        >
          <div class="xl:flex block">
            <StopLimit
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :bitfinex-price="bitfinex.price"
              operation="buy"
              @add-order="
                addOrder('buy', $event.orderData, $event.type, $event.callback)
              "
            />
            <StopLimit
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :bitfinex-price="bitfinex.price"
              operation="sell"
              @add-order="
                addOrder('sell', $event.orderData, $event.type, $event.callback)
              "
            />
          </div>
        </div>
        <div
          v-if="otcenabled"
          id="otc-1"
          class="tab-pane fade"
          :class="{ active: tab === 3 }"
        >
          <div class="xl:flex block">
            <OTC
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :bitfinex-price="bitfinex.price"
              operation="buy"
              @add-order="
                addOrder('buy', $event.orderData, $event.type, $event.callback)
              "
            />
            <OTC
              class="trade-menus__block"
              :base-currency="baseCurrency"
              :quote-currency="quoteCurrency"
              :bitfinex-price="bitfinex.price"
              operation="sell"
              @add-order="
                addOrder('sell', $event.orderData, $event.type, $event.callback)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LimitList from "../components/LimitsList.vue";
import OTC from "../components/OTC.vue";
import getPair from "~/mixins/getPair";
import StopLimit from "../components/StopLimit.vue";
import { mapGetters, mapActions } from "vuex";
import { OTCPrices } from "~/api/otcprices";
import errorManager from "~/helpers/errorHundle";

export default {
  components: {
    LimitList,
    StopLimit,
    OTC,
  },
  mixins: [getPair],
  props: {
    baseCurrency: {
      type: String,
      required: true,
    },

    quoteCurrency: {
      type: String,
      required: true,
    },
  },
  emits: ["error", "updateOrder", "deleteOrder"],

  data() {
    return {
      tab: 1,
      disableOperations: false,
      bitfinex: {
        interval: null,
        price: 0,
      },
    };
  },

  mounted() {
    this.subscribeBitfinex();
  },

  beforeUnmount() {
    this.unsubscribeBitfinex();
  },

  methods: {
    setTab(id) {
      this.tab = id;
    },
    ...mapActions({ createOrder: "core/createOrder" }),
    subscribeBitfinex() {
      if (this.bitfinex.interval) clearInterval(this.bitfinex.interval);

      this.updateBitfinexPrice();
      this.bitfinex.interval = setInterval(this.updateBitfinexPrice, 30000);
    },

    unsubscribeBitfinex() {
      clearInterval(this.bitfinex.interval);
    },

    updateBitfinexPrice() {
      OTCPrices.get(this.baseCurrency, this.quoteCurrency)
        .then((data) => (this.bitfinex.price = data.price))
        .catch((error) => {
          const detail = error.body.detail;
          if (error.body && error.body.detail.message)
            this.$emit("error", detail.message);
        });
    },

    notifyOrderOpened(order) {
      let text = "";
      if (order.operation === 0) {
        text = `${this.$t("common.buying")} ${order.quantity} ${
          order.pair
        } ${this.$t("common.for_price")} ${order.price}`;
      } else {
        text = order.price
          ? `${this.$t("common.sells")} ${order.quantity} ${
              order.pair
            } ${this.$t("common.for_price")} ${order.price}`
          : `${this.$t("common.sells")} ${order.quantity} ${this.$t(
              "common.on_market"
            )}`;
      }

      this.$notify({
        title: `${this.$t("common.order_opened")}`,
        type: "warning",
        text: `${text}`,
      });
    },

    addOrder(operation, orderData, type, callback) {
      this.disableOperations = true;
      setTimeout(() => (this.disableOperations = false), 1500);

      if (!this.isAuthorized) {
        return;
      }

      this.createOrder({
        pair: this.getPair(this.baseCurrency, this.quoteCurrency),
        operation: operation == "buy" ? 0 : 1,

        ...orderData,
        type,

        fc: (order) => {
          let orderStatus = order.status;
          const data = order.data;
          if (200 <= orderStatus && orderStatus < 300) {
            this.notifyOrderOpened(data);
            if (callback) callback();
          } else {
            if (data.message?.code === "order_price_invalid_error") {
              this.$emit("error", this.$t("common.order_price_invalid"));
            }
            if (data.message?.code === "order_stop_invalid_error") {
              this.$emit("error", this.$t("common.order_price_invalid"));
            }
            if (data.detail && data.detail.message) {
              if (Array.isArray(data.detail.message))
                this.$emit("error", data.detail.message[0]);
              else this.$emit("error", data.detail.message);
            } else {
              errorManager.parse(order, this, [
                "bad_min_amount",
                "bad_max_amount",
                "order_max_cost",
                "not_enough_funds",
                "order_price_invalid",
                "order_stop_price_invalid",
                "percent_min_value",
              ]);
            }
          }
        },
      });
    },
  },

  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters({
      isAuthorized: "core/isAuthorized",
      profile: "core/profile",
    }),

    otcenabled() {
      return this.profile && this.profile.is_auto_orders_enabled;
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-menus {
  position: relative;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0.53px -0.848px 6px 0px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  padding: 0.5rem;
  transition: all 0.3s linear;

  &:hover {
    -webkit-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  &_blocked {
    opacity: 0.5;
  }

  &__links {
    border-bottom: 1px solid #eceeef;
  }

  &__link {
    padding: 0.5em 2em;
    border-top-right-radius: unset;
    border-top-left-radius: unset;
    font-weight: bold;
    background-color: #f6f6f8;
    border: none;
  }

  &__nav-item {
    border-left: 1px solid #eceeef;
    border-top: 1px solid #eceeef;
    border-right: 1px solid #eceeef;
    border-bottom: none;
    margin-right: -1px;
  }

  &__content {
    border-bottom: 1px solid #eceeef;
    border-left: 1px solid #eceeef;
  }

  &__block {
    height: 309px;
    border-right: 1px solid #eceeef;
    flex-grow: 1;
    @media (max-width: 767px) {
      height: auto;
      border-bottom: 1px solid #eceeef;
    }
  }

  &--tooltip-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>

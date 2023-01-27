<template>
  <div
    ref="sell_order_wrapper"
    class="table-responsive sell-orders sell-orders-up sell-orders-table orders-rows-wrapper"
  >
    <div
      ref="sell_order"
      class="desktop-orders-wrapper"
      style="
        position: absolute;
        top: 0;
        left: 0;
        height: 328px !important;
        width: 100%;
      "
    >
      <div
        :id="`${type}-orders-wrapper`"
        :class="{ 'sell-not-full': isNotFull }"
        style="width: 100%; max-height: 100%; height: 100%"
      >
        <table id="sellstable" class="table table-hover table-striped">
          <tbody id="stakansellsbody" ref="sellsGlassBody">
            <perfect-scrollbar id="scrollb" ref="scr">
              <slot></slot>
            </perfect-scrollbar>
          </tbody>
        </table>
      </div>
    </div>
    <div
      :id="`order-list-${type}`"
      ref="sell_order"
      class="mobile-orders-wrapper"
    >
      <div :class="{ 'sell-not-full': isNotFull }">
        <table class="table table-hover table-striped">
          <tbody
            id="stakansellsbody1"
            ref="sellsGlassBody"
            style="padding-right: 10px"
          >
            <perfect-scrollbar id="scrollb1">
              <slot></slot>
            </perfect-scrollbar>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrdersTable",
  props: {
    type: {
      type: String,
      required: true,
    },
    sellOrders: {
      type: Array,
      default: () => [],
    },
    isNotFull: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      topPct: 100,
    };
  },
  computed: {
    isSell() {
      return this.$props.type === "sell";
    },
    wrapperId() {
      return `#${this.$props.type}-orders-wrapper`;
    },
  },
  watch: {
    sellOrders(val) {
      val && val.length && this.scrollToBottom();
    },
  },
  mounted() {
    this.initScrollBar();
  },
  methods: {
    scrollToBottom() {
      if (this.topPct > 70) {
        this.scrollBottom();
      }
    },
    scrollBottom() {
      setTimeout(() => {
        let s = document.getElementById("scrollb");
        if (s) {
          s.scrollTop = 30000;
        }
      }, 1500);
    },
    initScrollBar() {
      setTimeout(() => {
        () => {
          let s = document.getElementById("scrollb");
          s.scrollTop = 213123;
        };
      }, 1000);
      setTimeout(() => {
        () => {
          let s = document.getElementById("scrollb1");
          s.scrollTop = 0;
        };
      }, 0);
    },
  },
};
</script>

<style lang="scss">
#sell-orders-wrapper .mCSB_inside {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

#buy-orders-wrapper #stakansellsbody {
  justify-content: flex-start;
}

#sell-orders-wrapper .mCSB_container {
  width: 100%;
}
#sell-orders-wrapper.sell-not-full .mCSB_container {
  top: auto !important;
}

.sell-orders-table.sell-not-full {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
}

.order-tables .table-responsive.sell-orders-up {
  position: relative;
  height: 328px !important;
}

.order-tables .table-responsive.sell-orders-up #order-list-sell {
  position: absolute;
  bottom: 0;
  left: 0;
  height: auto !important;
  max-height: 328px;
  width: 100%;
  overflow-y: scroll;
}

.order-tables .table-responsive.sell-orders-up #order-list-buy {
  position: absolute;
  top: 0;
  left: 0;
  height: 328px;
  width: 100%;
  overflow-y: scroll;
}

.mobile-orders-wrapper {
  display: none;
}

@media screen and (max-width: 767px) {
  .desktop-orders-wrapper {
    display: none;
  }

  .mobile-orders-wrapper {
    display: block;
  }
}
</style>

<style lang="scss" scoped>
.sell-orders-table {
  max-height: 328px;
  position: relative;
}
.orders-rows-wrapper {
  @media screen and (max-width: 1280px) {
    min-height: 328px;
    overflow: hidden;
  }
}
@media (max-width: 500px) {
  #scrollb1 {
    padding-right: 10px;
  }
}
</style>

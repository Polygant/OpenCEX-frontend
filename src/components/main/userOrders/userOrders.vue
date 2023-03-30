<template>
  <div class="user-orders">
    <div class="sell-orders__top sell-orders__top--title">
      <div class="sell-orders__title">
        <span
          class="cursor-pointer"
          :class="
            currentOrdersTab === 'open' ? 'ordersEnabled' : 'ordersDisabled'
          "
          @click="clickActiveOrders"
        >
          {{ $t("common.activeorders") }}
        </span>
        <span
          class="cursor-pointer"
          style="margin-left: 5px"
          :class="
            currentOrdersTab === 'close' ? 'ordersEnabled' : 'ordersDisabled'
          "
          @click="clickClosedOrders"
        >
          {{ $t("common.closedorders") }}
        </span>
        <span class="sell-orders__pair">
          <label class="input_checkbox" style="margin-bottom: 14px">
            <input
              v-model="showActivePairs"
              type="checkbox"
              class="input_hidden"
              @change="activePairCheckboxClicked"
            />
            <span class="checkmark"></span>
            {{ $t("common.activepair") }}
          </label>
        </span>
      </div>
      <div
        class="flex flex-col md:flex-row items-start md:items-center sell-orders__date-filter mt-3 md:mt-0"
      >
        <span class="whitespace-nowrap">
          {{ $t("common.display_period") }}</span
        >
        <div class="md:ml-6 mt-3 md:mt-0">
          <label class="mr-1"> {{ $t("common.from_period") }}: </label>
          <date-picker
            ref="datepicker"
            v-model:value="filter.from"
            :clearable="datePickerOptions.isClearable"
            :editable="datePickerOptions.editable"
            :format="datePickerOptions.format"
            :placeholder="datePickerOptions.placeholder"
            :first-day-of-week="datePickerOptions.firstDay"
            value-type="timestamp"
            :lang="$locale === 'en' ? 'en' : 'ru'"
            class="wallet-birthday"
            @open="onDateOpen"
          />
        </div>
        <div class="md:ml-4 mt-3 md:mt-0">
          <label class="mr-1">{{ $t("common.to_period") }}:</label>
          <date-picker
            ref="datepicker"
            v-model:value="filter.to"
            :clearable="datePickerOptions.isClearable"
            :editable="datePickerOptions.editable"
            :format="datePickerOptions.format"
            :placeholder="datePickerOptions.placeholder"
            :first-day-of-week="datePickerOptions.firstDay"
            value-type="timestamp"
            :lang="$locale === 'en' ? 'en' : 'ru'"
            class="wallet-birthday"
            @open="onDateOpen"
          />
        </div>
      </div>
    </div>
    <div v-if="!isAuthorized" class="wallet-list--tooltip-layer"></div>
    <div v-if="showActivePairs">
      <orders-table
        v-if="currentOrdersTab == 'open'"
        :orders="openOrdersByPair.list"
        :total-pages="openOrdersByPair.totalPages"
        :current-page="openOrdersByPair.currentPage"
        :order-type="currentOrdersTab"
        :is-active-pair="showActivePairs"
        @change-page="pullOrders"
        @delete-order="deleteOrder"
        @update-order="updateOrder"
      />
      <orders-table
        v-if="currentOrdersTab == 'close'"
        :orders="closedOrdersByPair.list"
        :total-pages="closedOrdersByPair.totalPages"
        :current-page="closedOrdersByPair.currentPage"
        :order-type="currentOrdersTab"
        :is-active-pair="showActivePairs"
        @change-page="pullOrders"
        @delete-order="deleteOrder"
        @update-order="updateOrder"
      />
    </div>
    <div v-else>
      <orders-table
        v-if="currentOrdersTab == 'open'"
        :orders="orders.list"
        :total-pages="orders.totalPages"
        :current-page="orders.currentPage"
        :order-type="currentOrdersTab"
        @change-page="pullOrders"
        @delete-order="deleteOrder"
        @update-order="updateOrder"
      />
      <orders-table
        v-if="currentOrdersTab == 'close'"
        :orders="closedorders.list"
        :total-pages="closedorders.totalPages"
        :current-page="closedorders.currentPage"
        :order-type="currentOrdersTab"
        @change-page="pullOrders"
        @delete-order="deleteOrder"
        @update-order="updateOrder"
      />
    </div>
  </div>
</template>

<script>
import OrdersTable from "./ordersTable.vue";
import UpdateOrderModal from "~/components/modals/UpdateOrderModal.vue";
import { mapGetters } from "vuex";
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

export default {
  components: {
    DatePicker,
    OrdersTable,
  },
  emits: ["error", "updateOrder", "deleteOrder", "pullOrders"],
  data() {
    return {
      showActiveOrders: true,
      currentOrdersTab: "open",
      showActivePairs: true,
      pullOrdersData: null,
      filter: {
        from: null,
        to: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      orders: "core/orders",
      closedorders: "core/closedorders",
      openOrdersByPair: "core/openOrdersByPair",
      closedOrdersByPair: "core/closedOrdersByPair",
    }),
    isAuthorized() {
      return !!this.$store.getters["core/isAuthorized"];
    },
    ordersFilter() {
      return {
        date_from:
          this.filter.from &&
          this.filter.from - new Date().getTimezoneOffset() * 60 * 1000,
        date_to:
          this.filter.to &&
          this.filter.to -
            new Date().getTimezoneOffset() * 60 * 1000 +
            (1000 * 60 * 60 * 24 - 1),
      };
    },

    datePickerOptions() {
      return {
        isClearable: false,
        format: "DD.MM.YYYY",
        editable: true,
        firstDay: 1,
        placeholder: this.$locale === "ru" ? "ЧЧ.ММ.ГГГГ" : "DD.MM.YYYY",
      };
    },
  },

  watch: {
    ordersFilter: {
      deep: true,
      handler() {
        this.pullOrders({
          orderType: this.currentOrdersTab,
          page: 1,
          activePair: this.showActivePairs,
        });
      },
    },
  },

  mounted() {
    this.checkActivePairFromLS();
  },

  methods: {
    pullOrders(data) {
      this.pullOrdersData = data;

      const resultData = {
        ...this.pullOrdersData,
        filter: this.ordersFilter,
      };

      this.$emit("pullOrders", resultData);
    },
    onDateOpen() {
      if (!this.filter.from && !this.filter.to) {
        this.filter.from = +new Date() - 1000 * 60 * 60 * 24;
        this.filter.to = +new Date();
      }
    },
    activePairCheckboxClicked() {
      if (this.showActivePairs) {
        localStorage.setItem("active-pair-check", "true");
      } else {
        localStorage.removeItem("active-pair-check");
      }
    },
    clickActiveOrders() {
      this.showActiveOrders = true;
      this.currentOrdersTab = "open";
    },
    clickClosedOrders() {
      this.showActiveOrders = false;
      this.currentOrdersTab = "close";
    },
    checkActivePairFromLS() {
      this.showActivePairs = !!localStorage.getItem("active-pair-check");
    },
    deleteOrder(id) {
      this.$store.dispatch("core/deleteOrder", {
        id,
        fc: (order) => {
          if (order.detail && order.detail.message) {
            this.$emit("error", order.detail.message);
          } else {
            setTimeout(() => {
              this.drawCancelOrder(order);
            }, 1000);
          }
        },
      });
    },
    drawCancelOrder() {
      this.$notify({
        title: `${this.$t("common.order_canceled")}`,
        type: "error",
        text: `${this.$t("common.order_canceled_desc")}`,
      });
    },
    updateOrder(order) {
      this.$modal.show(
        UpdateOrderModal,
        {
          order,
          onError: (message) => this.$emit("error", message),
        },
        {
          height: "auto",
          scrollable: true,
        }
      );
    },
  },
};
</script>

<style>
.user-orders {
  overflow: hidden;
  margin-top: 15px;
  -webkit-transition: all 0.3s linear;
  -o-transition: all 0.3s linear;
  transition: all 0.3s linear;
  padding: 0;
  transition: all 0.3s linear;
  -webkit-box-shadow: 0.53px -0.848px 6px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 0.53px -0.848px 6px 0 rgba(0, 0, 0, 0.14);
  -webkit-box-shadow: 0.53px -0.848px 6px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 0.53px -0.848px 6px 0 rgba(0, 0, 0, 0.14);
  border-radius: 3px;
  background: #fff;
  position: relative;
}

.cursor-pointer {
  cursor: pointer;
}

.input_checkbox {
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  font-size: 14px;
  cursor: pointer;
}
/* When the checkbox is checked, add a blue background */
.input_checkbox input:checked ~ .checkmark {
  background-color: var(--theme-primary-color);
}
/* Show the checkmark when checked */
.input_checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.input_checkbox .checkmark:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.input_hidden {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  -webkit-border-radius: 3px;
  border-radius: 3px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.wallet-list--tooltip-layer {
  z-index: 2;
  background: #fff;
  opacity: 0.4;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
}
</style>

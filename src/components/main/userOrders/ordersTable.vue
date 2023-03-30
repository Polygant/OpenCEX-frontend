<template>
  <div class="user-orders-table">
    <div v-if="orders && orders.length" class="orders-table">
      <div class="table-responsive">
        <perfect-scrollbar>
          <table class="table table-hover table-striped">
            <thead>
              <tr class="order-head">
                <td class="order-cell">{{ $t("common.date") }}</td>
                <td v-if="!isActivePair" class="order-cell">
                  {{ $t("common.pair") }}
                </td>
                <td class="order-cell">{{ $t("common.operation") }}</td>
                <td class="order-cell">{{ $t("common.price") }}</td>
                <td v-if="orderType === 'open'" class="order-cell">
                  {{ $t("common.amountoriginal") }}
                </td>
                <td v-if="orderType === 'close'" class="order-cell">
                  {{ $t("common.amountTableHeader") }}
                </td>
                <td v-if="orderType === 'open'" class="order-cell">
                  {{ $t("common.amountleft") }}
                </td>
                <td class="order-cell">{{ $t("common.sum") }}</td>
                <td v-if="orderType === 'close'" class="order-cell">
                  {{ $t("common.status") }}
                </td>
                <td v-if="orderType === 'open'" class="order-cell"></td>
              </tr>
            </thead>
            <tbody>
              <order-row
                v-for="(order, index) in orders"
                :key="index"
                :order="order"
                :type="orderType"
                :is-active-pair="isActivePair"
                @update-order="updateOrder"
                @delete-order="deleteOrder"
              />
            </tbody>
          </table>
        </perfect-scrollbar>
      </div>
      <div v-if="totalPages > 1">
        <paginate
          v-model="page"
          :page-range="5"
          :margin-pages="0"
          :page-count="totalPages"
          :click-handler="handleOrderPagination"
          :prev-text="'❮'"
          :next-text="'❯'"
          container-class="pagination pagination-custom"
          :page-class="'page-item page-item-custom noselect'"
          :prev-class="'page-item page-item-custom-prev noselect'"
          :next-class="'page-item page-item-custom-prev noselect'"
          :break-view-class="'page-item page-item-custom-break'"
          :break-view-text="''"
        >
        </paginate>
      </div>
    </div>
    <div v-else class="not-information">
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
</template>

<script>
import OrderRow from "./orderRow.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    OrderRow,
    Paginate,
  },
  props: {
    orders: {
      type: Array,
      default: () => [],
    },
    orderType: {
      type: String,
      default: "",
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    isActivePair: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["changePage", "updateOrder", "deleteOrder"],
  data() {
    return {
      page: this.currentPage,
    };
  },
  computed: {
    currentTablePage() {
      return this.currentPage;
    },
  },
  watch: {
    currentTablePage(page) {
      this.page = page;
    },
  },
  methods: {
    handleOrderPagination(page) {
      const data = {
        orderType: this.orderType,
        page: page,
        activePair: this.isActivePair,
      };
      this.$emit("changePage", data);
    },
    deleteOrder(id) {
      this.$emit("deleteOrder", id);
    },
    updateOrder(order) {
      this.$emit("updateOrder", order);
    },
  },
};
</script>

<style lang="scss">
.user-orders-table {
  overflow-x: auto;
  height: 305px;
  .table-responsive {
    margin-bottom: 5px;
    height: 270px;
  }
  .orders-table {
    width: 100%;
  }
  .order-head {
    font-size: 12px;
    line-height: 1;
    font-weight: bold;
    .order-cell {
      padding: 5px 11px;
      line-height: 16px;
      display: table-cell;
    }
  }
}
</style>

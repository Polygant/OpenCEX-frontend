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
        <img src="/public/img/Smile.svg" alt="" />
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

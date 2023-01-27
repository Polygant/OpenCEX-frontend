<template>
  <div class="sell-orders-header">
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <td v-for="(item, key) in headers" :key="key">
              <div class="sell-orders__td">
                <b>
                  {{ item.title }},<br />
                  {{ item.currencyName }}
                </b>
              </div>
            </td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrdersHeader",
  // eslint-disable-next-line vue/require-prop-types
  props: ["baseCurrency", "quoteCurrency", "isBottomHeader"],
  computed: {
    headers() {
      return [
        {
          title: this.$t("common.price"),
          currencyName: this.quoteCurrency,
        },
        {
          title: this.$t("common.amountTableHeader"),
          currencyName: this.baseCurrency,
        },
        {
          title: this.$t("common.amountTableHeader"),
          currencyName: this.quoteCurrency,
        },
        {
          title: this.$t("common.depth"),
          currencyName: this.baseCurrency,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
.sell-orders-header {
  background-color: white;

  td {
    border-top: none;
  }
}
</style>

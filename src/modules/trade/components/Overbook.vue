<template>
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
</template>

<script>
import SellOrders from "~/components/trade/orders/Orders.vue";
export default {
  name: "OverBook",
  components: {
    SellOrders,
  },
};
</script>

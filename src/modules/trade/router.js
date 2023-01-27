import lazyLoadView from "~/utilities/lazyLoad";

export default [
  {
    path: "/trade/:pairprop",
    name: "trade-pair",
    component: lazyLoadView(import("~/modules/trade/pages/Trade.vue")),
    props: true,
  },
  {
    path: "/trade",
    name: "trade",
    redirect: "/trade/BTC-USDT",
  },
];

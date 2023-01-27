import lazyLoadView from "~/utilities/lazyLoad";

const router = [
  {
    path: "/quick-buy-sell",
    name: "quick-buy-sell",
    component: lazyLoadView(import("./pages/FastBuySell.vue")),
  },
  {
    path: "/exchanger",
    redirect: "/quick-buy-sell",
  },
  {
    path: "/fast-buy-sell",
    redirect: "/quick-buy-sell",
  },
];

export default router;

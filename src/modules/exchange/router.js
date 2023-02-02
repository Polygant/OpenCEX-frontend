import lazyLoadView from "~/utilities/lazyLoad";

const router = [
  {
    path: "/quick-swap",
    name: "quick-swap",
    component: lazyLoadView(import("./pages/FastBuySell.vue")),
  },
  {
    path: "/exchanger",
    redirect: "/quick-swap",
  },
  {
    path: "/fast-buy-sell",
    redirect: "/quick-swap",
  },
];

export default router;

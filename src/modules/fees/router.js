import lazyLoadView from "~/utilities/lazyLoad";

const router = [
  {
    path: "/fees",
    component: lazyLoadView(import("./pages/Fees.vue")),
    name: "fees",
  },
];

export default router;

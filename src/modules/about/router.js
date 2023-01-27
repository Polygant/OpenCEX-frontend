import lazyLoadView from "~/utilities/lazyLoad";

const router = [
  {
    path: "/support",
    component: lazyLoadView(import("./pages/Support.vue")),
    name: "support",
  },
];

export default router;

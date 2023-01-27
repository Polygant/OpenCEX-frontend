import lazyLoadView from "~/utilities/lazyLoad";

const router = [
  {
    path: "/interface-select",
    component: lazyLoadView(import("./pages/InterfaceSelect.vue")),
    meta: {
      authRequired: true,
    },
    name: "interface-select",
  },
  {
    path: "/email-verify/:token",
    component: lazyLoadView(import("./pages/EmailVerify.vue")),
    props: true,
    name: "email-verify",
  },
  {
    path: "/confirm-withdrawal-request/:token",
    component: lazyLoadView(import("./pages/ConfirmWithdrawalUrl.vue")),
    props: true,
    meta: {
      authRequired: true,
    },
    name: "confirm-withdrawal-request",
  },
  {
    path: "/settings",
    component: lazyLoadView(import("./pages/ProfileSettings.vue")),
    meta: {
      authRequired: true,
    },
    name: "settings",
  },
];

export default router;

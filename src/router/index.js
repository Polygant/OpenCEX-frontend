import { createRouter, createWebHistory } from "vue-router";
import store from "~/store";
import lazyLoadView from "~/utilities/lazyLoad";

export const beforeEnterUnAuthorizedRoute = (routeTo, routeFrom, next) => {
  function redirectToLogin() {
    if (routeTo.name === "login" || routeTo.name === "404") {
      next({ name: "login" });
    } else if (routeTo.params.token || routeTo.params.pairprop) {
      next({
        name: "login",
        query: {
          redirectFrom: routeTo.fullPath,
          params: encodeURI(routeTo.params.token || routeTo.params.pairprop),
        },
      });
    } else {
      next({
        name: "login",
        query: {
          redirectFrom: routeTo.fullPath,
        },
      });
    }
  }

  const authRequired = routeTo.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next();

  if (store.getters.isLoggedIn) {
    next();
    return;
  }
  redirectToLogin();
};

let routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("~/modules/account/pages/Login.vue"),
    beforeEnter: beforeEnterUnAuthorizedRoute,
  },
  {
    name: "register",
    path: "/register/:refcode?",
    component: () => import("~/modules/account/pages/Register.vue"),
    props: true,
    beforeEnter: beforeEnterUnAuthorizedRoute,
  },
  {
    path: "/forgot",
    name: "forgot",
    component: lazyLoadView(import("~/modules/account/pages/Forgot.vue")),
    beforeEnter: beforeEnterUnAuthorizedRoute,
  },
  {
    path: "/reset-password/:uid/:token",
    name: "reset-password",
    component: lazyLoadView(import("~/modules/account/pages/UserResetUrl.vue")),
    props: true,
    beforeEnter: beforeEnterUnAuthorizedRoute,
  },
  {
    name: "confirm-register",
    path: "/confirm-register",
    component: lazyLoadView(
      import("~/modules/account/pages/ConfirmRegister.vue")
    ),
    props: true,
    beforeEnter: beforeEnterUnAuthorizedRoute,
  },
  {
    path: "/",
    name: "account-root",
    redirect: "/trade/BTC-USDT",
  },
  {
    path: "/404",
    name: "404",
    component: lazyLoadView(import("~/pages/404.vue")),
  },
  {
    path: "/kyc",
    component: lazyLoadView(import("~/pages/KYC.vue")),
    meta: {
      authRequired: true,
    },
    name: "kyc",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

import wallet from "~/modules/wallet/router";
import trade from "~/modules/trade/router";
import quickBuy from "~/modules/exchange/router";
import support from "~/modules/about/router";
import fees from "~/modules/fees/router";
import account from "~/modules/account/router";

routes = [
  ...routes,
  ...wallet,
  ...trade,
  ...quickBuy,
  ...support,
  ...fees,
  ...account,
];

export const router = createRouter({
  history: createWebHistory("/account/"),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});

export const initRouter = (app) => {
  app.config.globalProperties.$router = router;
  app.use(router);
};

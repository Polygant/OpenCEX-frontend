import { defineAsyncComponent } from "vue";
import Timeout from "~/components/layout/Timeout.vue";
import Loader from "~/components/layout/Loading.vue";

const lazyLoadView = (path) => {
  return defineAsyncComponent({
    errorComponent: Timeout,
    loader: async () => {
      return path;
    },
    loadingComponent: Loader,
  });
};

export const beforeEnterUnAuthorizedRoute = (routeTo, routeFrom, next) => {
  // eslint-disable-next-line no-unused-vars
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
};

export default lazyLoadView;

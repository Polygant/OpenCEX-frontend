import axios from "axios";
import config from "~/local_config";
import store from "~/store";

export default (app) => {
  app.config.globalProperties.$http = axios.create({
    baseURL: config.api.baseURL,
  });

  const router = app.config.globalProperties.$router;

  const noAuthRequireRoutes = ["/account/trade/BTC-USDT"];

  router.options.routes.forEach((item) => {
    if (!item.meta || !item.meta.authRequired) {
      if (item.path && item.path !== "/") {
        if (item.path.indexOf("/:") > 0) {
          noAuthRequireRoutes.push(
            "/account" + item.path.slice(0, item.path.indexOf("/:"))
          );
        } else {
          noAuthRequireRoutes.push("/account" + item.path);
        }
      }
    }
  });

  const noAuthRequireApis = [
    "/auth/login/",
    "/auth/registration/",
    "/auth/registration/verify-email/",
    "/auth/password/reset/",
    "/check2falogin/",
    "/checkgooglecode/",
    "/check_invite/",
    "/pairs_volume/",
    "/withdrawal/confirm-withdrawal-request",
    "/withdrawal/cancel-withdrawal-request",
    "/check_captcha/",
    "/auth/password/reset/confirm/",
  ].map((uri) => config.api.baseURL + uri);

  app.config.globalProperties.$http.interceptors.request.use(
    function (config) {
      config.headers["X-API-LANG"] = localStorage.getItem("planguage") || "en";

      if (
        !noAuthRequireApis.includes(config.url) &&
        localStorage.getItem("token")
      ) {
        config.headers["Authorization"] =
          "Token " + localStorage.getItem("token");
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$http.interceptors.response.use(
    function (response) {
      return transformResponse(response);
    },
    function (error) {
      if (
        error.response.status === 401 &&
        !noAuthRequireApis.includes(error.response.config.url)
      ) {
        if (!localStorage.getItem("wiz-auth")) {
          localStorage.removeItem("token");
        }

        store.dispatch("core/logout");

        const pathname = window.location.pathname;

        const matchNotAuthViews = noAuthRequireRoutes.find((route) =>
          pathname.startsWith(route)
        );

        if (pathname !== "/" && !matchNotAuthViews) {
          const lastPage = router.currentRoute.value.fullPath;

          if (lastPage) {
            router.push({ name: "login", query: { redirectFrom: lastPage } });
          } else {
            router.push({ name: "login" });
          }
        }
      }

      return Promise.reject(
        error && error.response ? transformResponse(error.response) : error
      );
    }
  );

  function transformResponse(response) {
    return {
      ...response,
      body: response.data,
    };
  }
};

export const http = axios.create({
  baseURL: config.api.baseURL,
});

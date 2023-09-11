import axios from "axios";
import config from "~/local_config";
import store from "~/store";
import jwt_decode from "jwt-decode";

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
    async function (config) {
      config.headers["X-API-LANG"] = localStorage.getItem("planguage") || "en";
      let token = localStorage.getItem("token");
      try {
        let payload = jwt_decode(token);
        let expTime = payload.exp * 1000;
        let curTime = new Date().getTime();
        if (expTime - curTime <= 3000) {
          if (config.url !== "auth/token/refresh/") {
            await store.dispatch("core/refreshToken");
          }
        }
      } catch (err) {
        if (config.url !== "auth/token/refresh/") {
          await store.dispatch("core/refreshToken");
        }
      }
      if (
        !noAuthRequireApis.includes(config.url) &&
        localStorage.getItem("token")
      ) {
        config.headers["Authorization"] =
          "Bearer " + localStorage.getItem("token");
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
    async function (error) {
      if (
        error.response?.status === 401 &&
        !noAuthRequireApis.includes(error.response.config.url) &&
        error.response.config.url !== "auth/token/refresh/"
      ) {
        if (
          error.response &&
          error.response?.data?.code?.code === "token_not_valid"
        ) {
          const originalRequest = error.config;
          try {
            await store.dispatch("core/refreshToken");
            originalRequest.headers["Authorization"] =
              "Bearer " + localStorage.getItem("token");
            return app.config.globalProperties.$http(originalRequest);
          } catch (e) {
            console.log(e);
          }
        }
        const pathname = window.location.pathname;
        const matchNotAuthViews = noAuthRequireRoutes.find((route) =>
          pathname.startsWith(route)
        );
        if (pathname !== "/" && !matchNotAuthViews) {
          const lastPage = router.currentRoute.value.fullPath;
          if (
            error.response &&
            error.response?.data?.code?.code === "token_not_valid"
          ) {
            if (lastPage) {
              router.push({ name: "login", query: { redirectFrom: lastPage } });
            } else {
              router.push({ name: "login" });
            }
          }
        }
      }
      if (
        error.response &&
        error.response?.data?.code?.code === "token_not_valid"
      ) {
        return Promise.reject();
      } else {
        return Promise.reject(
          error && error.response ? transformResponse(error.response) : error
        );
      }
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

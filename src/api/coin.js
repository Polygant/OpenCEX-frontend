import { app } from "../main";

export const Coin = {
  list() {
    return app.config.globalProperties.$http
      .get("coins/")
      .then((promise) => promise.data);
  },
  getCoinsLimits() {
    return app.config.globalProperties.$http
      .get("limits/")
      .then((promise) => promise.data);
  },
  getCoinsAddresses() {
    return app.config.globalProperties.$http
      .post("getwallets/", {})
      .then((promise) => promise.data);
  },
};

import { app } from "../main";

export const Pairs = {
  list() {
    return app.config.globalProperties.$http.get("pairs/").then((promise) => {
      return promise.data;
    });
  },
};

export const PairsVolume = {
  list() {
    return app.config.globalProperties.$http
      .get("pairs_volume/")
      .then((promise) => {
        return promise;
      });
  },
};

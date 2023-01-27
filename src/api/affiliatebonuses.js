import { app } from "../main";

export const AffiliateBonuses = {
  list() {
    const resp = app.config.globalProperties.$http
      .get("affilate/bonuses/?limit=50&offset=0")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

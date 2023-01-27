import { app } from "../main";

export const AffiliateStatus = {
  list() {
    const resp = app.config.globalProperties.$http
      .get("affilate/status/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

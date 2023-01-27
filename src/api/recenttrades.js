import { app } from "../main";

export const RecentTrades = {
  list(pairid) {
    const resp = app.config.globalProperties.$http
      .get("recent_trades/?limit=50&offset=0&pair=" + pairid)
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const WalletHistory = {
  list(limit, offset) {
    const resp = app.config.globalProperties.$http
      .get("wallet-history/?limit=" + limit + "&offset=" + offset)
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const Transactions = {
  list(limit, offset) {
    const resp = app.config.globalProperties.$http
      .get(
        "transactions/?limit=" + limit + "&offset=" + offset + "&wallet=True"
      )
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const Balance = {
  list() {
    const resp = app.config.globalProperties.$http
      .get("balance/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const OrderInfo = {
  list(uuid) {
    const resp = app.config.globalProperties.$http
      .get("merchant/order/" + uuid + "/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

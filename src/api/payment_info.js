import { app } from "../main";

export const PaymentInfo = {
  list(uuid) {
    const resp = app.config.globalProperties.$http
      .get("merchant/payment/" + uuid + "/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

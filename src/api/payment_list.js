import { app } from "../main";

export const PaymentList = {
  list(storeUuid) {
    return app.config.globalProperties.$http
      .get("merchant/payment/", {
        params: {
          store_uuid: storeUuid,
        },
      })
      .then((promise) => {
        return promise;
      });
  },
};

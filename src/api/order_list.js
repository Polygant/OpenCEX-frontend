import { app } from "../main";

export const OrderList = {
  list(storeUuid) {
    const resp = app.config.globalProperties.$http
      .get("merchant/order/", {
        params: {
          store_uuid: storeUuid,
        },
      })
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const StoreInfo = {
  list(uuid) {
    const resp = app.config.globalProperties.$http
      .get("merchant/store/" + uuid + "/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

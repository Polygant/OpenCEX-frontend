import { app } from "../main";

export const StoreList = {
  list() {
    const resp = app.config.globalProperties.$http
      .get("merchant/store/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

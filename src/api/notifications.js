import { app } from "../main";

export const Notifications = {
  list() {
    const resp = app.config.globalProperties.$http
      .get("notifications/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

import { app } from "../main";

export const Stack = {
  list(pair) {
    const resp = app.config.globalProperties.$http
      .get("stack/" + pair + "/")
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

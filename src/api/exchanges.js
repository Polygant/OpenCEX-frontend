import { app } from "../main";

export const Exchanges = {
  list(limit = 10000000, offset = 0, st = 1) {
    const resp = app.config.globalProperties.$http
      .get("exchange/?limit=" + limit + "&offset=" + offset + "&state=" + st)
      .then((promise) => {
        return promise;
      });
    return resp;
  },
};

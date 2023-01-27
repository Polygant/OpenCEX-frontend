import { app } from "../main";

export const Countries = {
  fetchList(lang) {
    return app.config.globalProperties.$http
      .get("countries/?lang=" + lang)
      .then((promise) => {
        return promise;
      });
  },
};

import localConfig from "../local_config";
import { app } from "../main";

export const OTCPrices = {
  get(baseCurrency, quoteCurrency) {
    return app.config.globalProperties.$http
      .get("otcprice", {
        params: {
          pair: baseCurrency + "-" + quoteCurrency,
        },
        baseURL: localConfig.api.basePublicURL,
      })
      .then((promise) => {
        return promise;
      });
  },
};

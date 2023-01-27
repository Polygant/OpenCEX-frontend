import { app } from "../main";

export const Orders = {
  list(params) {
    let strParams = "";
    if (params && Object.keys(params).length) {
      strParams = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");
    }
    let resp = app.config.globalProperties.$http
      .get("orders/?" + strParams)
      .then((promise) => {
        return promise.body;
      });
    return resp;
  },
  create(config1) {
    let uri = "orders/";

    if (config1.type === 4) {
      uri = "stop-limit/";
    }

    return app.config.globalProperties.$http.post(uri, config1).then(
      (response) => {
        return { data: response.data, status: response.status };
      },
      (error) => {
        throw { data: error.data, status: error.status };
      }
    );
  },
  createmarket(config1) {
    return app.config.globalProperties.$http.post("market/", config1).then(
      (response) => {
        return response.data;
      },
      (error) => {
        return error.data;
      }
    );
  },
  delete(orderid) {
    return app.config.globalProperties.$http.delete(
      "orders/" + orderid.toString() + "/"
    );
  },
};

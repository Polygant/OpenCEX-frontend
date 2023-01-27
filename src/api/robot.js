import { app } from "../main";

export const Robot = {
  trades(page) {
    const currentPage = page || 1;
    const resp = app.config.globalProperties.$http
      .get("robots/trades/?page=" + currentPage)
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  transactions(page) {
    const currentPage = page || 1;
    const resp = app.config.globalProperties.$http
      .get("robots/transactions/?page=" + currentPage)
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  info() {
    const resp = app.config.globalProperties.$http
      .get("robots/robot/")
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  stats() {
    const resp = app.config.globalProperties.$http
      .get("robots/robot/stats/")
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  deposit(amount) {
    const resp = app.config.globalProperties.$http
      .post("robots/deposit/", {
        amount,
      })
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  withdraw(amount) {
    const resp = app.config.globalProperties.$http
      .post("robots/withdrawal/", {
        amount,
      })
      .then((res) => {
        return res.data;
      });
    return resp;
  },
  charts(from, to) {
    const resp = app.config.globalProperties.$http
      .post("robots/chart/", {
        from,
        to,
      })
      .then((res) => {
        return res.data;
      });
    return resp;
  },
};

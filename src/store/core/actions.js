import { app } from "~/main";
import { Coin } from "~/api/coin";
import { UserNotifications } from "~/api/user_notifications";
import { Pairs, PairsVolume } from "~/api/pairs";
import { Balance } from "~/api/balance";
import { Orders } from "~/api/orders";
import { StoreList } from "~/api/store_list";
import { Exchanges } from "~/api/exchanges";
import { AffiliateStatus } from "~/api/affiliatestatus";
import { Countries } from "~/api/countries";
import { OrderList } from "~/api/order_list";
import { Transactions } from "~/api/transactions";
import * as mutationTypes from "./mutation-types";
import { Stack } from "~/api/stack";
import { AffiliateBonuses } from "~/api/affiliatebonuses";
import { StoreInfo } from "~/api/store_info";
import { OrderInfo } from "~/api/order_info";
import { WalletHistory } from "~/api/wallethistory";
import { PaymentInfo } from "~/api/payment_info";
import { Profile } from "~/api/profile";
import { PaymentList } from "~/api/payment_list";
import { Notifications } from "~/api/notifications";

let refreshTokenPromise = null;

export default {
  changeTheme({ state }, val) {
    state.theme = val;
  },
  async getCoins({ commit }) {
    await Coin.list().then(({ coins, commons }) => {
      commit(mutationTypes.COINS, { coins });
      commit(mutationTypes.COINS_COMMONS, { commons });
    });
  },
  async getCoinsLimits({ commit }) {
    await Coin.getCoinsLimits().then((response) => {
      commit(mutationTypes.COINS_LIMITS_UPDATE, response);
    });
  },
  async getUserNotifications({ commit }) {
    await UserNotifications.get().then((response) => {
      commit(mutationTypes.USER_NOTIFICATION, response);
    });
  },
  deleteUserNotifications({ dispatch }, id) {
    UserNotifications.remove(id).then(() => {
      dispatch("core/getUserNotifications");
    });
  },
  setPrecisions({ commit, state }, paris) {
    if (!state.currentPrecisions) {
      let data = {};
      paris.map((item) => {
        data[item.pair] = {
          default:
            item.pair_data.stack_precisions[
              item.pair_data.stack_precisions.length - 1
            ],
          stack_precisions: item.pair_data.stack_precisions,
        };
      });
      commit("CURRENT_PRECISIONS", data);
    }
  },
  getCountryList({ commit }, lang) {
    Countries.fetchList(lang).then((data) => {
      commit(mutationTypes.SET_COUNTRIES, data.data);
    });
  },
  setLocale({ commit }, lang) {
    commit("SET_LOCALE", lang);
  },
  getAffiliateBonuses({ commit }) {
    AffiliateBonuses.list().then((bonuses) => {
      commit(mutationTypes.AFFILIATEBONUSES, bonuses);
    });
  },
  getAffiliateStatus({ commit }) {
    AffiliateStatus.list().then((status) => {
      let ans = {};
      ans["balances"] = {
        BTC: { currency: "BTC", on_balance: 0, pending: 0 },
        ETH: { currency: "ETH", on_balance: 0, pending: 0 },
        CBC: { currency: "CBC", on_balance: 0, pending: 0 },
        LTC: { currency: "LTC", on_balance: 0, pending: 0 },
        BCH: { currency: "BCH", on_balance: 0, pending: 0 },
        USD: { currency: "USD", on_balance: 0, pending: 0 },
        RUB: { currency: "RUB", on_balance: 0, pending: 0 },
        EUR: { currency: "EUR", on_balance: 0, pending: 0 },
        XRP: { currency: "XRP", on_balance: 0, pending: 0 },
      };
      ans["total"] = status["total"];
      ans["last_24"] = status["last_24"];

      for (let i in status.amount_on_balance) {
        ans.balances[i].on_balance = status.amount_on_balance[i];
      }
      for (let i in status.amount_pending) {
        ans.balances[i].pending = status.amount_pending[i];
      }

      commit(mutationTypes.AFFILIATESTATUS, ans);
    });
  },
  getPairs({ commit }, callback) {
    return Pairs.list().then((pairs) => {
      commit(mutationTypes.PAIRS, pairs.pairs);

      if (callback) {
        callback(pairs.pairs);
      }
    });
  },

  getPairsVolume({ commit }, callback) {
    return new Promise((resolve, reject) => {
      PairsVolume.list()
        .then((response) => {
          if ("pairs" in response) {
            commit(mutationTypes.PAIRS_VOLUME, response["pairs"]);
            resolve(response.pairs);
          }

          if (callback && typeof callback === "function") {
            callback(response.pairs);
          }
        })
        .catch(reject);
    });
  },
  getBalance({ commit }, callback) {
    Balance.list().then((response) => {
      commit(mutationTypes.BALANCE, response.data["balance"]);
      commit(mutationTypes.COINS_BALANCE, response.data["balance"]);

      if (callback) {
        callback(response["balance"]);
      }
    });
  },
  getExchanges({ commit }, { limit, offset, st, callback }) {
    return Exchanges.list(limit, offset, st).then((exs) => {
      let ans = [];
      for (let i = 0; i < exs["data"]["results"].length; i++) {
        ans.push(exs["data"]["results"][i]);
      }
      ans.sort(function (a, b) {
        let keyA = a.id;
        let keyB = b.id;
        // Compare the 2 ids
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });

      ans = ans.slice(0, 20);
      commit(mutationTypes.EXCHANGES, ans);
      commit(mutationTypes.EXCHANGES_COUNT, exs["data"]["count"]);

      if (callback) {
        callback(ans);
      }
    });
  },
  getWalletHistory({ commit }, historyData) {
    let callback = false;
    if (typeof historyData["fc"] !== "undefined") {
      callback = historyData["fc"];
      delete historyData["fc"];
    }

    WalletHistory.list(historyData["limit"], historyData["offset"]).then(
      (txs) => {
        let ans = txs;
        commit(mutationTypes.WALLETHISTORY, {
          currentPage: historyData["page"],
          totalPages: ans.count / historyData["limit"],
          list: ans.results,
        });

        if (callback) {
          callback(ans, historyData["page"] + 1);
        }
      }
    );
  },
  getWalletTopupsHistory({ commit }, historyData) {
    let callback = false;
    if (typeof historyData["fc"] !== "undefined") {
      callback = historyData["fc"];
      delete historyData["fc"];
    }

    WalletHistory.list(historyData["limit"], historyData["offset"]).then(
      (txs) => {
        let ans = txs;
        commit(mutationTypes.WALLETTOPUPSHISTORY, {
          currentPage: historyData["page"],
          totalPages: ans.count / historyData["limit"],
          list: ans.results,
        });

        if (callback) {
          callback(ans, historyData["page"] + 1);
        }
      }
    );
  },
  getWalletWithdrawalHistory({ commit }, historyData) {
    let callback = false;
    if (typeof historyData["fc"] !== "undefined") {
      callback = historyData["fc"];
      delete historyData["fc"];
    }

    WalletHistory.list(historyData["limit"], historyData["offset"]).then(
      (txs) => {
        let ans = txs;
        commit(mutationTypes.WALLETWITHDRAWALSHISTORY, {
          currentPage: historyData["page"],
          totalPages: ans.count / historyData["limit"],
          list: ans.results,
        });

        if (callback) {
          callback(ans, historyData["page"] + 1);
        }
      }
    );
  },
  getWalletTickerHistory({ commit }, historyData) {
    let callback = false;
    if (typeof historyData["fc"] !== "undefined") {
      callback = historyData["fc"];
      delete historyData["fc"];
    }

    WalletHistory.list(historyData["limit"], historyData["offset"]).then(
      (txs) => {
        let ans = txs;
        commit(mutationTypes.WALLETTICKERHISTORY, {
          currentPage: historyData["page"],
          totalPages: ans.count / historyData["limit"],
          list: ans.results,
        });

        if (callback) {
          callback(ans, historyData["page"] + 1);
        }
      }
    );
  },
  getCloseOrders({ commit }, orderData) {
    let callback = false;
    if (typeof orderData["fc"] !== "undefined") {
      callback = orderData["fc"];
      delete orderData["fc"];
    }

    Orders.list(orderData).then((response) => {
      commit(mutationTypes.CLOSED_ORDERS, response["results"]);

      if (callback) {
        callback(response);
      }
    });
  },
  getTransactions({ commit }, transactionData) {
    let callback = false;
    if (typeof transactionData["fc"] !== "undefined") {
      callback = transactionData["fc"];
      delete transactionData["fc"];
    }

    Transactions.list(transactionData["limit"], transactionData["offset"]).then(
      (txs) => {
        let ans = [];
        for (let i = 0; i < txs["results"].length; i++) {
          ans.push(txs["results"][i]);
        }
        ans.sort(function (a, b) {
          let keyA = new Date();
          let keyB = new Date();
          keyA.setTime(parseInt(a.updated) * 1000);
          keyB.setTime(parseInt(b.updated) * 1000);
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });

        commit(mutationTypes.TRANSACTIONS, ans);

        if (callback) {
          callback(ans, txs["count"]);
        }
      }
    );
  },
  getRecentTrades({ commit }, trades) {
    if (trades && trades.length) {
      let ans = [];
      for (let i = 0; i < trades.length; i++) {
        ans.push(trades[i]);
      }

      ans.sort(function (a, b) {
        let keyA = new Date(a.id);
        let keyB = new Date(b.id);
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      });
      ans = ans.slice(0, 40);
      commit(mutationTypes.RECENT_TRADES, ans);
    }
  },
  createOrder({ commit }, orderData) {
    let callback = false;
    if (typeof orderData["fc"] !== "undefined") {
      callback = orderData["fc"];
      delete orderData["fc"];
    }
    Orders.create(orderData).then(
      (order) => {
        if (!order["data"].detail) {
          commit(mutationTypes.ADD_ORDER, order["data"]);
        }

        if (callback) {
          callback(order);
        }
      },
      (error) => {
        if (callback) {
          callback(error);
        }
      }
    );
  },
  createMarketOrder({ commit }, orderData) {
    let callback = false;
    if (typeof orderData["fc"] !== "undefined") {
      callback = orderData["fc"];
      delete orderData["fc"];
    }
    Orders.createmarket(orderData).then((order) => {
      if (order.detail && order.detail === "NotEnoughFunds") {
        console.error("NotEnoughFunds");
      } else if (
        order.detail &&
        order.detail.substr(0, 16) === "Order cost limit"
      ) {
        console.error("Order cost limit");
      } else {
        commit(mutationTypes.ADD_ORDER, order);
      }

      if (callback) {
        callback(order);
      }
    });
  },
  deleteOrder(ctx, orderData) {
    let callback = false;
    if (typeof orderData.fc !== "undefined") {
      callback = orderData.fc;
      delete orderData.fc;
    }

    Orders.delete(orderData.id).then((order) => {
      if (callback) {
        callback(order);
      }
    });
  },
  getStack({ commit }, stackData) {
    let callback = false;
    if (typeof stackData.fc !== "undefined") {
      callback = stackData.fc;
      delete stackData.fc;
    }

    Stack.list(stackData.pair).then((stack) => {
      let ans = stack;

      commit(mutationTypes.STACK, ans);

      if (callback) {
        callback(ans);
      }
    });
  },
  loginSuccess({ commit }) {
    commit(mutationTypes.LOGIN_SUCCESS);
  },
  getNotifications({ commit }) {
    return Notifications.list().then((response) => {
      commit(mutationTypes.STACK, response);

      return response;
    });
  },
  logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("refresh_token");
    commit(mutationTypes.LOGOUT);
  },
  refreshToken({ dispatch }) {
    if (!refreshTokenPromise)
      refreshTokenPromise = (async function () {
        if (
          localStorage.getItem("refresh_token") &&
          localStorage.getItem("refresh_token") !== "undefined"
        ) {
          await app.config.globalProperties.$http
            .post("auth/token/refresh/", {
              refresh: localStorage.getItem("refresh_token") ?? "",
            })
            .then((response) => {
              localStorage.setItem("token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);
            })
            .catch((e) => {
              dispatch("logout");
              return Promise.reject(e);
            })
            .finally(() => {
              refreshTokenPromise = null;
            });
        }
      })();

    return refreshTokenPromise;
  },
  getStoreList({ commit }, callback) {
    StoreList.list().then((response) => {
      commit(mutationTypes.STORE_LIST, response["data"]);

      if (callback) {
        callback(response);
      }
    });
  },
  getStoreInfo({ commit }, args) {
    let uuid = args["data"]["uuid"];
    let callback = args["callback"];
    StoreInfo.list(uuid).then((storeInfo) => {
      commit(mutationTypes.STORE_INFO, storeInfo);

      if (callback) {
        callback(storeInfo);
      }
    });
  },
  getOrderList({ commit }, args) {
    let storeUuid = args["data"]["store_uuid"];
    let callback = args["callback"];
    OrderList.list(storeUuid).then((response) => {
      commit(mutationTypes.ORDER_LIST, response["data"]);

      if (callback) {
        callback(response);
      }
    });
  },
  getOrderInfo({ commit }, args) {
    let uuid = args["data"]["uuid"];
    let callback = args["callback"];
    OrderInfo.list(uuid).then((response) => {
      commit(mutationTypes.ORDER_INFO, response);

      if (callback) {
        callback(response);
      }
    });
  },
  getPaymentInfo({ commit }, args) {
    let uuid = args["data"]["uuid"];
    let callback = args["callback"];
    PaymentInfo.list(uuid).then((response) => {
      commit(mutationTypes.PAYMENT_INFO, response.data);

      if (callback) {
        callback(response);
      }
    });
  },
  getPaymentList({ commit }, args) {
    let storeUuid = args["data"]["store_uuid"];
    let callback = args["callback"];
    PaymentList.list(storeUuid).then((response) => {
      commit(mutationTypes.PAYMENT_LIST, response.data);

      if (callback) {
        callback(response);
      }
    });
  },
  getProfile({ commit }, args) {
    let callback =
      args && args["callback"] !== "undefined" ? args["callback"] : undefined;
    return new Promise((resolve, reject) => {
      Profile.get().then(
        (response) => {
          commit(mutationTypes.PROFILE, response.body);
          if (callback) {
            callback(response.body);
          }

          resolve(response.body);
        },
        (e) => {
          reject(e);
        }
      );
    });
  },
};

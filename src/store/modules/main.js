import { app } from "../../main";

const _state = {
  currentBaseCurrency: "BTC",
  currentQuoteCurrency: "USD",
  buyVolume: "",
  sellVolume: "",
  isStakanPriceRising: true,
  suggestedOrderParameters: null,
  isAuthenticatedWS: false,
  socket: {
    isConnected: false,
    message: "",
    reconnectError: false,
    sendMessage: null,
  },
};

const actions = {
  sendWSMessage({ commit, state }, msg) {
    if (state.socket.isConnected) {
      app.config.globalProperties.$socket.send(msg);
      commit("SOCKET_MESSAGE", msg);
    }
  },
  getWSMessage({ commit, dispatch, getters }, data) {
    switch (data.kind) {
      case "user_notification":
        commit("WS_USER_IS_AUTHENTICATED", true);
        break;
      case "stack":
        if (data.pair !== getters.getCurrencyPairProp) break;
        commit("core/STACK", data.stack);
        break;
      case "opened_orders":
        commit("core/ORDERS", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "opened_orders_pair":
        commit("core/OPEN_ORDERS_BY_PAIR", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "closed_orders":
        commit("core/CLOSED_ORDERS", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "closed_orders_pair":
        commit("core/CLOSED_ORDERS_BY_PAIR", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "trades":
        dispatch("core/getRecentTrades", data.results);
        break;
      case "balance":
        commit("core/BALANCE", data.balance);
        commit("core/COINS_BALANCE", data.balance);
        break;
      case "locked_balance":
        commit("core/LOCKED_BALANCE", data.balance);
        break;
      case "pairs_volume":
        commit("core/PAIRS_VOLUME", data.pairs);
        dispatch("core/setPrecisions", data.pairs);
        break;
      case "wallet_history":
        commit("core/WALLETHISTORY", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "wallet_topups_history":
        commit("core/WALLETTOPUPSHISTORY", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "wallet_withdrawals_history":
        commit("core/WALLETWITHDRAWALSHISTORY", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
      case "wallet_history_ticker":
        commit("core/WALLETTICKERHISTORY", {
          currentPage: data.page,
          totalPages: data.total_pages,
          list: data.results,
        });
        break;
    }
  },
};

const mutations = {
  setCurrentBaseCurrency(state, value) {
    state.currentBaseCurrency = value;
  },
  setCurrentQuoteCurrency(state, value) {
    state.currentQuoteCurrency = value;
  },
  setSellVolume(state, value) {
    state.sellVolume = value;
  },
  setBuyVolume(state, value) {
    state.buyVolume = value;
  },
  setIsStakanPriceRising(state, value) {
    state.isStakanPriceRising = value;
  },
  setSuggestedOrderParameters(state, { operation, quantity, price }) {
    state.suggestedOrderParameters = { operation, quantity, price };
  },
  SOCKET_ONOPEN(state) {
    state.socket.isConnected = true;
  },
  SOCKET_ONCLOSE(state) {
    state.socket.isConnected = false;
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event);
  },
  SOCKET_ONMESSAGE(state, message) {
    state.socket.message = JSON.parse(message.data);
  },
  SOCKET_RECONNECT(state, count) {
    console.info(state, count);
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  },
  SOCKET_MESSAGE(state, msg) {
    state.socket.sendMessage = msg;
  },
  WS_USER_IS_AUTHENTICATED(state, status) {
    state.isAuthenticatedWS = status;
  },
};

const getters = {
  getCurrentBaseCurrency: (state) => state.currentBaseCurrency,
  getCurrentQuoteCurrency: (state) => state.currentQuoteCurrency,
  getCurrencyPairProp: (state) =>
    state.currentBaseCurrency + "-" + state.currentQuoteCurrency,
  getSellVolume: (state) => state.sellVolume,
  getBuyVolume: (state) => state.buyVolume,
  isStakanPriceRising: (state) => state.isStakanPriceRising,
  getSuggestedOrderParameters: (state) => state.suggestedOrderParameters,
  wsMessage: (state) => state.socket.message,
  isConnectedSocket: (state) => state.socket.isConnected,
  reconnectError: (state) => state.socket.reconnectError,
  wsUserIsAuthenticated: (state) => state.isAuthenticatedWS,
};

export default {
  state: _state,
  mutations,
  getters,
  actions,
};

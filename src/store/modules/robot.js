import { Robot } from "../../api/robot";
import {
  ROBOT_SET_INFO,
  ROBOT_SET_TRANSACTIONS,
  ROBOT_SET_TRADES,
  ROBOT_SET_CHART_DATA,
  ROBOT_SET_STATS_DATA,
} from "../core/mutation-types";

const state = () => ({
  info: {
    license: {},
  },
  trades: [],
  tradesCount: 0,
  transactions: [],
  transactionsCount: 0,
  transactionsNext: false,
  chartData: [],
  statsData: {},
});

const actions = {
  async fetchInfo({ commit }) {
    return Robot.info().then((data) => {
      commit(ROBOT_SET_INFO, data);
      return data;
    });
  },
  async fetchTrades({ commit }, page) {
    return Robot.trades(page).then((data) => {
      commit(ROBOT_SET_TRADES, data);
      return data;
    });
  },
  async fetchTransactions({ commit }, page) {
    return Robot.transactions(page).then((data) => {
      commit(ROBOT_SET_TRANSACTIONS, data);
      return data;
    });
  },
  async deposit(store, amount) {
    return Robot.deposit(amount).then((data) => {
      return data;
    });
  },
  async withdraw(store, amount) {
    return Robot.withdraw(amount).then((data) => {
      return data;
    });
  },
  async fetchChartsData({ commit }, { from, to }) {
    return Robot.charts(from, to).then((data) => {
      commit(ROBOT_SET_CHART_DATA, data);
      return data;
    });
  },
  async fetchStatsData({ commit }) {
    return Robot.stats().then((data) => {
      commit(ROBOT_SET_STATS_DATA, data);
      return data;
    });
  },
};

const mutations = {
  [ROBOT_SET_INFO](state, data) {
    state.info = {
      license: data.license || {},
      pending: data.pending,
      balance: data.balance,
      active: data.active,
      trade_session: data.trade_session,
    };
  },
  [ROBOT_SET_TRANSACTIONS](state, data) {
    state.transactions = data.results;
    state.transactionsCount = data.count;
    state.transactionsNext = !!data.next;
  },
  [ROBOT_SET_TRADES](state, data) {
    state.trades = data.results;
    state.tradesCount = data.count;
  },
  [ROBOT_SET_CHART_DATA](state, data) {
    state.chartData = data;
  },
  [ROBOT_SET_STATS_DATA](state, data) {
    state.statsData = data;
  },
};

const getters = {
  info: (state) => state.info,
  tradesPageCount: (state) => Math.ceil(state.tradesCount / 10),
  transactionsPageCount: (state) => Math.ceil(state.transactionsCount / 10),
  transactionsNext: (state) => state.transactionsNext,
  transactions: (state) =>
    state.transactions.map((tx) => ({
      ...tx,
      date: new Date(tx.created * 1000).toLocaleString("ru-RU"),
    })),
  trades: (state) =>
    state.trades.map((trade) => ({
      ...trade,
      base: trade.pair.split("-")[0],
      quote: trade.pair.split("-")[1],
      date: new Date(trade.created * 1000).toLocaleString("ru-RU"),
      earnings: trade.profit - trade.fee,
      percent: trade.percent * 100,
    })),
  chartData: (state) =>
    state.chartData.map((d) => {
      return [d[0] * 1000, d[1]];
    }),
  statsData: (state) => state.statsData,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

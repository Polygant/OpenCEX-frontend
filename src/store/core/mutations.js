import * as mutationTypes from "./mutation-types";

const errorLoggers = {
  noCoin: (() => {
    const loggedCoins = new Set([]);
    return (mutationName, coinName, coins) => {
      if (!loggedCoins.has(coinName)) {
        console.error(
          `mutations.${mutationName}: монеты ${coinName} нет в сторе:`,
          Object.keys(coins)
        );
        loggedCoins.add(coinName);
      }
    };
  })(),
};

export default {
  [mutationTypes.COINS_LIMITS_UPDATE](state, data) {
    Object.keys(data).forEach((coinName) => {
      if (state.coins) {
        if (!(coinName in state.coins)) {
          errorLoggers.noCoin(
            mutationTypes.COINS_LIMITS_UPDATE,
            coinName,
            state.coins
          );
          return;
        }
        state.coins[coinName].fee = data[coinName].fee;
        state.coins[coinName].limits = data[coinName].limits;
      }
    });
  },
  [mutationTypes.COINS](state, { coins }) {
    state.coins = state.coins || {};
    const sortedCoinNames = Object.keys(coins).sort(
      (a, b) => coins[a].index - coins[b].index
    );
    for (var i in sortedCoinNames) {
      const code = sortedCoinNames[i],
        received = coins[code],
        oldCoin = state.coins[code];
      state.coins[code] = {
        ...oldCoin,
        base: received.base,
        blockchain_list: received.blockchain_list,
        name: received.name,
        links: received.links,
        pairs: (oldCoin && oldCoin.pairs) || {},
        tx_explorer: received.tx_explorer,
        active: true,
        decimals: received.decimals,
        disable_all: received.disable_all,
        disable_exchange: received.disable_exchange,
        disable_pairs: received.disable_pairs,
        disable_stack: received.disable_stack,
        disable_topups: received.disable_topups,
        disable_withdrawals: received.disable_withdrawals,
        logo: received.logo,
      };
    }
  },
  [mutationTypes.COINS_BALANCE](state, balance) {
    Object.keys(balance).map(function (objectKey) {
      let value = balance[objectKey];
      if (typeof state.coins?.[objectKey] === "undefined") {
        errorLoggers.noCoin(
          mutationTypes.COINS_BALANCE,
          objectKey,
          state.coins
        );
        return;
      }
      if (state.coins?.[objectKey]) {
        state.coins[objectKey]["actual"] = value["actual"];
        state.coins[objectKey]["orders"] = value["orders"];
        state.balanceSum += value["actual"];
      }
    });
  },
  [mutationTypes.COINS_COMMONS](state, { commons }) {
    state.coinsCommons.blockchainDefinitions = commons.blockchain_definitions;
    state.coinsCommons.tokenTxExplorers = commons.token_tx_explorers;
  },
  [mutationTypes.USER_NOTIFICATION](state, notifications) {
    state.userNotifications = notifications;
  },
  [mutationTypes.CURRENT_PRECISIONS](state, precisions) {
    state.currentPrecisions = precisions;
  },
  [mutationTypes.SET_LOCALE](state, data) {
    state.locale = data;
  },
  [mutationTypes.SET_COUNTRIES](state, data) {
    state.countriesList = data;
  },
  [mutationTypes.STACK](state, stack) {
    state.stack = stack;
  },
  [mutationTypes.ADD_ORDER](state, order) {
    if (state.orders && state.orders.list) {
      if (state.orders.list[0] && state.orders.list[0].id !== order.id) {
        state.orders.list = state.orders.list.slice(0, 6);
        state.orders.list = [order, ...state.orders.list];
      }
    }
  },
  [mutationTypes.LOGIN](state) {
    state.pending = true;
  },
  [mutationTypes.LOGIN_SUCCESS](state) {
    state.isLoggedIn = true;
    state.pending = false;
  },
  [mutationTypes.UPDATE_HEADER](state, data) {
    state.headerAccountData = data;
  },
  [mutationTypes.LOGOUT](state) {
    state.profile.user = {};
    state.isLoggedIn = false;
  },
  [mutationTypes.KYC_CHECK](state) {
    state.pending = true;
  },
  [mutationTypes.KYC_SUCCESS](state) {
    state.isKYC = true;
    state.pending = false;
  },
  [mutationTypes.BALANCE](state, balance) {
    state.balance = balance;
  },
  [mutationTypes.LOCKED_BALANCE](state, balance) {
    state.locked_balance = balance;
  },
  [mutationTypes.TRANSACTIONS](state, txs) {
    state.transactions = txs;
  },
  [mutationTypes.WALLETHISTORY](state, txs) {
    state.wallethistory = txs;
  },
  [mutationTypes.WALLETTOPUPSHISTORY](state, txs) {
    state.walletTopupsHistory = txs;
  },
  [mutationTypes.WALLETWITHDRAWALSHISTORY](state, txs) {
    state.walletWithdrawalsHistory = txs;
  },
  [mutationTypes.WALLETTICKERHISTORY](state, txs) {
    state.walletTickerHistory = txs;
  },
  [mutationTypes.AFFILIATESTATUS](state, status) {
    state.affiliatestatus = status;
  },
  [mutationTypes.AFFILIATEBONUSES](state, bonuses) {
    state.affiliatebonuses = bonuses;
  },
  [mutationTypes.EXCHANGES](state, exs) {
    state.exchanges = exs;
  },
  [mutationTypes.EXCHANGES_COUNT](state, exs) {
    state.exchangesCount = exs;
  },
  [mutationTypes.ORDERS](state, orders) {
    state.orders = orders;
  },
  [mutationTypes.OPEN_ORDERS](state, openorders) {
    state.openorders = openorders;
  },
  [mutationTypes.CLOSED_ORDERS](state, closedorders) {
    state.closedorders = closedorders;
  },
  [mutationTypes.OPEN_ORDERS_BY_PAIR](state, data) {
    state.openOrdersByPair = data;
  },
  [mutationTypes.CLOSED_ORDERS_BY_PAIR](state, data) {
    state.closedOrdersByPair = data;
  },
  [mutationTypes.RECENT_TRADES](state, recenttrades) {
    state.recenttrades = recenttrades;
  },
  [mutationTypes.STORE_LIST](state, data) {
    state.store_list = data;
  },
  [mutationTypes.STORE_INFO](state, data) {
    state.store_info = data;
  },
  [mutationTypes.ORDER_LIST](state, data) {
    state.order_list = data;
  },
  [mutationTypes.ORDER_INFO](state, data) {
    state.order_info = data;
  },
  [mutationTypes.PAIRS](state, data) {
    // /coins
    let resultPairs = {};
    if (data && data.length) {
      const coins = JSON.parse(JSON.stringify(state.coins));
      data.forEach((item) => {
        let { code, base, quote, id } = item;
        let result = JSON.parse(JSON.stringify(state.pairs[code] || {}));
        result = { ...result, base, quote, id, code };
        resultPairs = { ...resultPairs, [code]: result };
        if (coins && coins[base.code] && coins[quote.code]) {
          coins[base.code].pairs[`${base.code}-${quote.code}`] = {
            base: base.code,
            quote: quote.code,
            active: true,
          };

          coins[quote.code].pairs[`${base.code}-${quote.code}`] = {
            base: base.code,
            quote: quote.code,
            active: true,
          };
        }
      });
      state.coins = coins;
      state.pairs = { ...state.pairs, ...resultPairs };
    }
  },
  [mutationTypes.PAIRS_VOLUME](state, data) {
    if (data && data.length) {
      data.forEach((pairItem) => {
        let { pair, volume, price_24h: price24h, price } = pairItem;
        volume = volume || 0;
        price24h = price24h || 0;
        price = price || 0;
        state.pairs[pair] = {
          ...state.pairs[pair],
          volume,
          ...{ price_24h: price24h },
          price,
          ...{ stack_precisions: pairItem.pair_data.stack_precisions },
        };
      });
    }
  },
  [mutationTypes.PAYMENT_INFO](state, data) {
    state.payment_info = data;
  },
  [mutationTypes.PAYMENT_LIST](state, data) {
    state.payment_list = data;
  },
  [mutationTypes.PROFILE](state, data) {
    state.profile = data;
  },
  [mutationTypes.PROFILE_AUTO_LOGOUT_TIMEOUT](state, timeout) {
    state.profile["auto_logout_timeout"] = timeout;
  },
};

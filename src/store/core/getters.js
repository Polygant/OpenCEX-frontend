export default {
  theme: (state) => state.theme,
  countriesList: (state) => state.countriesList,
  isLoggedIn: (state) => state.isLoggedIn,
  isAuthorized: (state) => state.profile.user.username,
  isKYC: (state) => state.isKYC,
  balance: (state) => state.balance,
  lockedBalance: (state) => state.locked_balance,
  ethprice: (state) => state.ethprice,
  btcprice: (state) => state.btcprice,
  usdprice: (state) => state.usdprice,
  eurprice: (state) => state.eurprice,
  rubprice: (state) => state.rubprice,
  headerAccountData: (state) => state.headerAccountData,
  transactions: (state) => state.transactions,
  wallethistory: (state) => state.wallethistory,
  walletTopupsHistory: (state) => state.walletTopupsHistory,
  walletWithdrawalHistory: (state) => state.walletWithdrawalsHistory,
  walletTickerHistory: (state) => state.walletTickerHistory,
  affiliatebonuses: (state) => state.affiliatebonuses,
  exchanges: (state) => state.exchanges,
  exchangesCount: (state) => state.exchangesCount,
  orders: (state) => state.orders,
  openorders: (state) => state.openorders,
  closedorders: (state) => state.closedorders,
  openOrdersByPair: (state) => state.openOrdersByPair,
  closedOrdersByPair: (state) => state.closedOrdersByPair,
  recenttrades: (state) => state.recenttrades,
  tradesExist: (state) => state.recenttrades && state.recenttrades.length !== 0,
  affiliatestatus: (state) => state.affiliatestatus,
  pairs: (state) => state.pairs,
  wizardLoaded: (state) => state.wizardLoaded,
  profile: (state) => state.profile,
  stack: (state) => state.stack,
  store_list: (state) => state.store_list,
  store_info: (state) => state.store_info,
  order_list: (state) => state.order_list,
  order_info: (state) => state.order_info,
  payment_info: (state) => state.payment_info,
  payment_list: (state) => state.payment_list,
  user_notification: (state) => state.userNotifications,
  currentPrecisions: (state) => state.currentPrecisions,
  coins: (state) =>
    state.coins
      ? Object.fromEntries(
          Object.entries(state.coins).filter(
            (property) => property[1].disable_all === false
          )
        )
      : {},
  coinsCommons: (state) => state.coinsCommons,
  areCoinsLoaded: (state) => state.coins !== null,
  isBalanceLoaded: (state) => Object.keys(state.balance).length !== 0,
  isKYCPassed(state) {
    return state.profile?.kyc_status !== "no";
  },
};

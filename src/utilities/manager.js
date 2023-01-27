import store from "~/store";

export const Init = {
  async Base() {
    await store.dispatch("core/getCoins");
    await store.dispatch("core/getCoinsLimits");
    await store.dispatch("core/getPairs");
    await store.dispatch("core/getBalance");
  },
  Pairs() {
    store.dispatch("core/getPairs");
  },
};

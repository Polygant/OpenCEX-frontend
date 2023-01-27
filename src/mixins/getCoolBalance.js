import { floor10 } from "~/utilities/helpers";

export default {
  methods: {
    getCoolBalance(cur) {
      if (!cur) return;
      let res = 0;
      if (this.coins?.[cur]["actual"] > 9999999) {
        res = floor10(this.coins?.[cur]["actual"], 0).toFixed(0);
      } else if (this.coins?.[cur]["actual"] > 999) {
        res = floor10(this.coins?.[cur]["actual"], -2).toFixed(2);
      } else {
        res = floor10(this.coins?.[cur]["actual"], -8).toFixed(8);
      }
      return res === "NaN" ? 0 : res;
    },
  },
};

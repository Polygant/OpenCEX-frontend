import { floor10 } from "~/utilities/helpers";

export default {
  methods: {
    getCoolBalanceFIAT(cur) {
      return floor10(this.coins[cur]["actual"], -2).toFixed(2);
    },
  },
};

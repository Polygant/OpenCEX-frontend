export default {
  methods: {
    isFiat(currency) {
      try {
        return currency.toLowerCase() === "usdt";
      } catch (err) {
        console.warn("Seems like this.coins is not definedon instance");
      }
    },
  },
};

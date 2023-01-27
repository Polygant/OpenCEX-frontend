export default {
  methods: {
    getPairs24h(pair) {
      try {
        let pricediff = this.getFromObj(this.pairs, pair + ":price_24h", 0);
        if (pricediff === 0) {
          return "0.0";
        } else if (pricediff > 0) {
          return "+" + pricediff.toFixed(1);
        } else if (pricediff < 0) {
          return pricediff.toFixed(1);
        }
      } catch (err) {
        console.warn("Seems like this.pairs is not defined on instance");
      }
    },
  },
};

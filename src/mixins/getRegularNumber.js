export default {
  methods: {
    getRegularNumber(n) {
      let sign = +n < 0 ? "-" : "",
        toStr = n.toString();
      if (!/e/i.test(toStr)) {
        return n;
      }
      let [lead, decimal, pow] = n
        .toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
      return +pow < 0
        ? sign +
            "0." +
            "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
            lead +
            decimal
        : sign +
            lead +
            (+pow >= decimal.length
              ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
              : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
    },
  },
};

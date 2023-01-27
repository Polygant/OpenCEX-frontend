export default {
  methods: {
    getDecimalWLength(val, length = 5) {
      const value = Number(val);
      const res = val.toString().split(".");
      const resLength = res[0].length;
      const diff = length - resLength;
      return value.toFixed(diff);
    },
  },
};

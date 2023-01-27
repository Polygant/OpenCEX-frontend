import { Decimal } from "decimal.js";

export default {
  methods: {
    getFixedDecimal(val, precision = 8, toClosest = false) {
      return val
        ? new Decimal(
            new Decimal(val).toFixed(
              precision,
              toClosest ? Decimal.ROUND_HALF_FLOOR : Decimal.ROUND_DOWN
            )
          ).toNumber()
        : 0;
    },
  },
};

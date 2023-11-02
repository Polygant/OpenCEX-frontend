import { Decimal } from "decimal.js";

/**
 * @param number {String. Number}
 */

function toString(number) {
  if (Number.isNaN(Number(number)) || number === null) {
    console.error("Error while formatting number, cannot format value", number);
    return number;
  } else {
    if (typeof number === "string") return number;
    else return String(number);
  }
}

/**
 * @param number {String, Number}
 */

function addSpace(number) {
  number = toString(number);

  let negative = false;

  let [whole, decimal] = number.split(".");

  if (whole.startsWith("-")) {
    whole = whole.slice(1);
    negative = true;
  }

  for (let i = whole.length - 3; i > 0; i -= 3) {
    whole = whole.slice(0, i) + "," + whole.slice(i);
  }

  if (negative) whole = "-" + whole;

  if (decimal && Number(decimal) !== 0)
    return whole + "." + decimal.replace(/0+$/g, "");
  else return whole;
}

/**
 * @param number {String, Number}
 * @param precision {Number}
 * @param toClosest {Boolean}
 */

function getFixedDecimal(val, precision = 8, toClosest = false) {
  console.log(val, precision);
  if (val === Infinity) debugger;
  return val
    ? new Decimal(
        new Decimal(val).toFixed(
          precision,
          toClosest ? Decimal.ROUND_HALF_FLOOR : Decimal.ROUND_DOWN
        )
      ).toNumber()
    : 0;
}

export default {
  methods: {
    addSpaceFixDecimal(number, precision, toClosest = false) {
      return addSpace(getFixedDecimal(number, precision, toClosest));
    },

    getFixedDecimal,

    addSpace,
  },
};

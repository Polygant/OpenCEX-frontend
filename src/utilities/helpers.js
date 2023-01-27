export const truncateCenter = (string, maxLength, separator = "***") => {
  if (string.length <= maxLength) return string;
  const separatorLength = separator.length;
  const charsToShow = maxLength - separatorLength;
  const startChars = Math.ceil(charsToShow / 2);
  const endChars = Math.floor(charsToShow / 2);
  return (
    string.substr(0, startChars) +
    separator +
    string.substr(string.length - endChars)
  );
};

export const getDecimalWLength = (val, length = 5) => {
  const value = Number(val);
  const res = val.toString().split(".");
  const resLength = res[0].length;
  const diff = length - resLength;
  return value.toFixed(diff);
};

export const floor10 = (value, exp) => {
  return decimalAdjust("floor", value, exp);
};

// Private methods
function decimalAdjust(type, value, exp) {
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

import pages from "./lang/pages";
import common from "./lang/common";
import support from "~/modules/about/locales";
import wallet from "~/modules/wallet/locales";
import quickBuy from "~/modules/exchange/locales";
import fees from "~/modules/fees/locales";
const locales = {
  pages,
  common,
  support,
  wallet,
  quickBuy,
  fees,
};
const dictionary = {};

Object.keys(locales).forEach((prop) => {
  Object.keys(locales[prop]).forEach((lang) => {
    if (!dictionary[lang]) dictionary[lang] = {};

    dictionary[lang][prop] = locales[prop][lang];
  });
});

export default dictionary;

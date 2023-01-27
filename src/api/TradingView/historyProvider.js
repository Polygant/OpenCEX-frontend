import { http } from "~/plugins/http";

const history = {};

export default {
  history: history,

  getBars: function (symbolInfo, resolution, from, to) {
    const splitSymbol = symbolInfo.name.split(/[:/]/);
    const frame =
      resolution === "1D" ? "day" : resolution >= 60 ? "hour" : "minute";
    return http.post("stats/", {
      start_ts: from * 1000,
      stop_ts: to * 1000,
      frame: frame,
      pair: splitSymbol[0] + "-" + splitSymbol[1],
    });
  },
};

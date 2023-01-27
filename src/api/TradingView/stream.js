import historyProvider from "./historyProvider.js";
import { http } from "~/plugins/http";
let sub;
let subInterval = null;

export default {
  subscribeBars: function (symbolInfo, resolution, updateCb, uid) {
    let newSub = {
      uid,
      resolution,
      symbolInfo,
      lastBar: historyProvider.history[symbolInfo.name].lastBar,
      listener: updateCb,
    };
    sub = newSub;

    this.unsubscribeBars();
    getNewBar(symbolInfo, resolution);
  },
  unsubscribeBars: function () {
    if (subInterval) {
      clearInterval(subInterval);
      subInterval = null;
    }
  },
};

function getNewBar(symbolInfo, resolution) {
  let splitSymbol = symbolInfo.name.split(/[:/]/);
  let frame =
    resolution === "D" || resolution === "W"
      ? "day"
      : resolution >= 60
      ? "hour"
      : "minute";

  if (frame === "day") {
    subInterval = setInterval(function () {
      let nowDate = new Date();
      nowDate.setDate(nowDate.getDate() + 5);
      let hAgo = new Date();
      hAgo.setSeconds(hAgo.getSeconds() - 9);

      http
        .post("stats/", {
          start_ts: hAgo.getTime(),
          stop_ts: nowDate.getTime(),
          frame: frame,
          pair: splitSymbol[0] + "-" + splitSymbol[1],
        })
        .then((data) => {
          let dataLength = data.data["records"].length;
          let barfromapi = data.data["records"][dataLength - 1];

          if (!(barfromapi && barfromapi[0] < sub.lastBar.time)) {
            let lastBar;
            if (barfromapi && barfromapi[1] > 0) {
              lastBar = {
                time: barfromapi[0], // the date
                open: barfromapi[4], // open
                high: barfromapi[1], // high
                low: barfromapi[2], // low
                close: barfromapi[5], // close
                volume: barfromapi[3], // volume
              };
              sub.listener(lastBar);
            }
          }
        });
    }, 60000);
  } else if (frame === "hour") {
    subInterval = setInterval(function () {
      let nowDate = new Date();
      nowDate.setDate(nowDate.getDate() + 5);
      let hAgo = new Date();
      hAgo.setSeconds(hAgo.getSeconds() - 9);

      http
        .post("stats/", {
          start_ts: hAgo.getTime(),
          stop_ts: nowDate.getTime(),
          frame: frame,
          pair: splitSymbol[0] + "-" + splitSymbol[1],
        })
        .then((data) => {
          let dataLength = data.data["records"].length;
          let barfromapi = data.data["records"][dataLength - 1];

          // eslint-disable-next-line no-empty
          if (barfromapi && barfromapi[0] < sub.lastBar.time) {
          } else {
            let lastBar;
            if (barfromapi && barfromapi[1] > 0) {
              lastBar = {
                time: barfromapi[0], // the date
                open: barfromapi[4], // open
                high: barfromapi[1], // high
                low: barfromapi[2], // low
                close: barfromapi[5], // close
                volume: barfromapi[3], // volume
              };
              sub.listener(lastBar);
            }
          }
        });
    }, 60000);
  } else if (frame === "minute") {
    subInterval = setInterval(function () {
      let nowDate = new Date();
      nowDate.setDate(nowDate.getDate() + 5);
      let minuteAgo = new Date();
      minuteAgo.setSeconds(minuteAgo.getSeconds() - 9);

      http
        .post("stats/", {
          start_ts: minuteAgo.getTime(),
          stop_ts: nowDate.getTime(),
          frame: frame,
          pair: splitSymbol[0] + "-" + splitSymbol[1],
        })
        .then((data) => {
          let dataLength = data.data["records"].length;
          let barfromapi = data.data["records"][dataLength - 1];

          if (barfromapi && barfromapi[0] < sub.lastBar.time) {
            return;
          }

          let lastBar;
          if (barfromapi && barfromapi[1] > 0) {
            lastBar = {
              time: barfromapi[0], // the date
              open: barfromapi[4], // open
              high: barfromapi[1], // high
              low: barfromapi[2], // low
              close: barfromapi[5], // close
              volume: barfromapi[3], // volume
            };
            sub.listener(lastBar);
          }
        });
    }, 60000);
  }
}

import historyProvider from "./historyProvider";
import stream from "./stream";
const supportedResolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "D",
  "W",
];

const config = {
  supported_resolutions: supportedResolutions,
};
export default (precision = null) => {
  return {
    onReady: (cb) => {
      setTimeout(() => cb(config), 0);
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback) => {
      var projectTitle = localStorage.getItem("project_title");
      if (!projectTitle) {
        projectTitle = "Crypto exchange";
      }
      var symbolStub = {
        name: symbolName,
        description: "",
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        has_empty_bars: true,
        ticker: symbolName,
        exchange: projectTitle,
        minmov: 1,
        pricescale: Math.round(1 / (precision || 0.01)),
        has_intraday: true,
        intraday_multipliers: ["1", "60"],
        supported_resolution: supportedResolutions,
        volume_precision: 8,
        data_status: "streaming",
      };
      setTimeout(function () {
        onSymbolResolvedCallback(symbolStub);
      }, 0);
    },
    getBars: function (
      symbolInfo,
      resolution,
      periodParams,
      onHistoryCallback
    ) {
      historyProvider
        .getBars(symbolInfo, resolution, periodParams.from, periodParams.to)
        .then(async (data) => {
          let ohlc = [];
          let dataLength = data.data["records"].length;
          let i = 0;
          for (i; i < dataLength; i += 1) {
            if (data.data["records"][i][1] > 0) {
              ohlc.push({
                time: data.data["records"][i][0], // the date
                open: data.data["records"][i][4], // open
                high: data.data["records"][i][1], // high
                low: data.data["records"][i][2], // low
                close: data.data["records"][i][5], // close
                volume: data.data["records"][i][3], // volume
              });
            }
          }
          historyProvider.history[symbolInfo.name] = {
            lastBar: ohlc[ohlc.length - 1],
          };
          if (ohlc.length) {
            onHistoryCallback(ohlc, { noData: false });
          } else {
            onHistoryCallback(ohlc, { noData: true });
          }
        });
    },
    subscribeBars: (
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback
    ) => {
      stream.subscribeBars(
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback
      );
    },
    unsubscribeBars: () => {
      stream.unsubscribeBars();
    },
  };
};

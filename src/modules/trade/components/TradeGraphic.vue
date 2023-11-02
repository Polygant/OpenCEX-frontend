<template>
  <div id="graphic" ref="graphic" class="graphic"></div>
</template>

<script>
import { mapGetters } from "vuex";
import getDatafeed from "~/api/TradingView";
import { widget } from "~/assets/TradingView/charting_library/charting_library.esm.js";
import localConfig from "~/local_config";

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    precision: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      tvWidget: null,
      datafeed: null,
    };
  },
  computed: {
    ...mapGetters({
      baseCurrency: "getCurrentBaseCurrency",
      quoteCurrency: "getCurrentQuoteCurrency",
    }),
    blockColorLocal() {
      return localConfig?.themes?.[this.currentTheme]?.block_color || "#FFF";
    },
    mainTextLocal() {
      return localConfig?.themes?.[this.currentTheme]?.main_text || "#000000";
    },
    lang() {
      return this.$locale;
    },
  },
  watch: {
    lang() {
      try {
        this.setGraphColor();
        this.makeChart();
      } catch (e) {
        console.log(e);
      }
    },
    precision: {
      immediate: true,
      handler(value) {
        if (!value) return;
        try {
          this.setGraphColor();
          this.makeChart();
        } catch (e) {
          console.log(e);
        }
      },
    },
    currentTheme() {
      this.setGraphColor();
      this.makeChart();
    },
  },

  mounted() {
    const graphInterval = setInterval(() => {
      if (this.$refs.graphic) {
        try {
          this.makeChart();
        } catch (e) {
          console.log(e);
        }
        clearInterval(graphInterval);
      }
    }, 300);
    this.setGraphColor();
  },

  beforeUnmount() {
    if (this.datafeed) this.datafeed.unsubscribeBars();
  },

  methods: {
    changeTopColor() {
      setTimeout(() => {
        let iframe = document
          .getElementById("graphic")
          .getElementsByTagName("iframe")[0];
        let element = document.createElement("style");
        element.innerHTML = `.layout__area--top { background: ${this.blockColorLocal}; height: 39px !important;} .layout__area--top * { color: ${this.mainTextLocal} !important; }`;
        if (iframe) iframe.contentWindow.document.body.appendChild(element);
      }, 1000);
    },
    makeChart() {
      if (this.datafeed) {
        this.datafeed.unsubscribeBars();
      }
      this.datafeed = getDatafeed(this.precision);
      const intervalFromLocalStorage =
          localStorage.getItem("chart_interval") || "5",
        tvWidget = new widget({
          symbol: this.baseCurrency + "/" + this.quoteCurrency,
          interval: intervalFromLocalStorage,
          timezone: "Etc/UTC",
          container: this.$refs.graphic,
          locale: this.lang,
          datafeed: this.datafeed,
          library_path: "/public/TV/charting_library/",
          autosize: true,
          toolbar_bg: "#f6f6f8",
          disabled_features: [
            "left_toolbar",
            "header_symbol_search",
            "header_indicators",
            "header_compare",
            "header_undo_redo",
            "header_interval_dialog_button",
            "show_interval_dialog_on_key_press",
            "header_fullscreen_button",
            "timeframes_toolbar",
            "context_menus",
          ],
        });

      tvWidget.onChartReady(() => {
        try {
          tvWidget
            .chart()
            .onIntervalChanged()
            .subscribe(null, (interval) =>
              localStorage.setItem("chart_interval", interval)
            );
          // eslint-disable-next-line no-empty
        } catch (e) {}
      });
    },
    setGraphColor() {
      let graphTheme = {
        timezone: "Etc/UTC",
        priceScaleSelectionStrategyName: "auto",
        dataWindowProperties: {
          background: this.blockColorLocal,
          border: "rgba( 96, 96, 144, 1)",
          font: "Verdana",
          fontBold: false,
          fontItalic: false,
          fontSize: 10,
          transparency: 80,
          visible: true,
        },
        paneProperties: {
          backgroundType: "solid",
          background: this.blockColorLocal,
          backgroundGradientStartColor: this.blockColorLocal,
          backgroundGradientEndColor: this.blockColorLocal,
          vertGridProperties: {
            color: "rgba(42, 46, 57, 0.06)",
            style: 0,
          },
          horzGridProperties: {
            color: "rgba(42, 46, 57, 0.06)",
            style: 0,
          },
          crossHairProperties: {
            color: "#9598A1",
            style: 2,
            transparency: 0,
            width: 1,
          },
          topMargin: 10,
          bottomMargin: 8,
          axisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            lockScale: false,
            percentage: false,
            percentageDisabled: false,
            indexedTo100: false,
            log: false,
            logDisabled: false,
            alignLabels: true,
            isInverted: false,
          },
          legendProperties: {
            showStudyArguments: true,
            showStudyTitles: true,
            showStudyValues: true,
            showSeriesTitle: true,
            showSeriesOHLC: true,
            showLegend: true,
            showBarChange: true,
            showBackground: true,
            backgroundTransparency: 50,
            wrapText: false,
          },
        },
        scalesProperties: {
          backgroundColor: "#ffffff",
          lineColor: "rgba(42, 46, 57, 0.14)",
          textColor: this.mainTextLocal,
          fontSize: 12,
          scaleSeriesOnly: false,
          showSeriesLastValue: true,
          seriesLastValueMode: 1,
          showSeriesPrevCloseValue: false,
          showStudyLastValue: false,
          showSymbolLabels: false,
          showStudyPlotLabels: false,
          showBidAskLabels: false,
          showPrePostMarketPriceLabel: true,
          showFundamentalNameLabel: false,
          showFundamentalLastValue: false,
          barSpacing: 6,
          showCurrency: true,
          showUnit: true,
        },
        mainSeriesProperties: {
          style: 1,
          esdShowDividends: true,
          esdShowSplits: true,
          esdShowEarnings: true,
          esdShowBreaks: false,
          esdFlagSize: 2,
          showCountdown: false,
          bidAsk: {
            visible: false,
            lineStyle: 1,
            lineWidth: 1,
            bidLineColor: "#2962FF",
            askLineColor: "#EF5350",
          },
          prePostMarket: {
            visible: true,
            lineStyle: 1,
            lineWidth: 1,
            preMarketColor: "#fb8c00",
            postMarketColor: "#2962FF",
          },
          highLowAvgPrice: {
            highLowPriceLinesVisible: false,
            highLowPriceLabelsVisible: false,
            averageClosePriceLineVisible: false,
            averageClosePriceLabelVisible: false,
          },
          showInDataWindow: true,
          visible: true,
          showPriceLine: true,
          priceLineWidth: 1,
          priceLineColor: "",
          baseLineColor: "#5d606b",
          showPrevClosePriceLine: false,
          prevClosePriceLineWidth: 1,
          prevClosePriceLineColor: "rgba( 85, 85, 85, 1)",
          minTick: "default",
          dividendsAdjustment: {},
          sessionId: "regular",
          sessVis: false,
          statusViewStyle: {
            fontSize: 16,
            showExchange: true,
            showInterval: true,
            symbolTextSource: "description",
          },
          candleStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            drawWick: true,
            drawBorder: true,
            borderColor: "#378658",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            wickColor: "#B5B5B8",
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
            barColorsOnPrevClose: false,
            drawBody: true,
          },
          hollowCandleStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            drawWick: true,
            drawBorder: true,
            borderColor: "#378658",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            wickColor: "#B5B5B8",
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
            drawBody: true,
          },
          haStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            drawWick: true,
            drawBorder: true,
            borderColor: "#378658",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            wickColor: "#B5B5B8",
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
            showRealLastPrice: false,
            barColorsOnPrevClose: false,
            inputs: {},
            inputInfo: {},
            drawBody: true,
          },
          barStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            barColorsOnPrevClose: false,
            dontDrawOpen: false,
            thinBars: true,
          },
          hiloStyle: {
            color: "#2962FF",
            showBorders: true,
            borderColor: "#2962FF",
            showLabels: true,
            labelColor: "#2962FF",
            fontSize: 7,
            drawBody: true,
          },
          lineStyle: {
            color: "#2962FF",
            linestyle: 0,
            linewidth: 2,
            priceSource: "close",
            styleType: 2,
          },
          areaStyle: {
            color1: "rgba(41, 98, 255, 0.28)",
            color2: "#2962FF",
            linecolor: "#2962FF",
            linestyle: 0,
            linewidth: 2,
            priceSource: "close",
            transparency: 100,
          },
          priceAxisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            lockScale: false,
            percentage: false,
            percentageDisabled: false,
            indexedTo100: false,
            log: false,
            logDisabled: false,
            isInverted: false,
            alignLabels: true,
          },
          renkoStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            upColorProjection: "#336854",
            downColorProjection: "#7f323f",
            borderUpColorProjection: "#336854",
            borderDownColorProjection: "#7f323f",
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
            inputs: {
              source: "close",
              sources: "Close",
              boxSize: 3,
              style: "ATR",
              atrLength: 14,
              wicks: true,
            },
            inputInfo: {
              source: {
                name: "source",
              },
              sources: {
                name: "Source",
              },
              boxSize: {
                name: "Box size",
              },
              style: {
                name: "Style",
              },
              atrLength: {
                name: "ATR length",
              },
              wicks: {
                name: "Wicks",
              },
            },
          },
          pbStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderUpColor: "#26a69a",
            borderDownColor: "#ef5350",
            upColorProjection: "#336854",
            downColorProjection: "#7f323f",
            borderUpColorProjection: "#336854",
            borderDownColorProjection: "#7f323f",
            inputs: {
              source: "close",
              lb: 3,
            },
            inputInfo: {
              source: {
                name: "Source",
              },
              lb: {
                name: "Number of line",
              },
            },
          },
          kagiStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            upColorProjection: "#336854",
            downColorProjection: "#7f323f",
            inputs: {
              source: "close",
              style: "ATR",
              atrLength: 14,
              reversalAmount: 1,
            },
            inputInfo: {
              source: {
                name: "Source",
              },
              style: {
                name: "Style",
              },
              atrLength: {
                name: "ATR length",
              },
              reversalAmount: {
                name: "Reversal amount",
              },
            },
          },
          pnfStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            upColorProjection: "#336854",
            downColorProjection: "#7f323f",
            inputs: {
              sources: "Close",
              reversalAmount: 3,
              boxSize: 1,
              style: "ATR",
              atrLength: 14,
              oneStepBackBuilding: false,
            },
            inputInfo: {
              sources: {
                name: "Source",
              },
              boxSize: {
                name: "Box size",
              },
              reversalAmount: {
                name: "Reversal amount",
              },
              style: {
                name: "Style",
              },
              atrLength: {
                name: "ATR length",
              },
              oneStepBackBuilding: {
                name: "One step back building",
              },
            },
          },
          baselineStyle: {
            baselineColor: "rgba( 117, 134, 150, 1)",
            topFillColor1: "rgba( 38, 166, 154, 0.28)",
            topFillColor2: "rgba( 38, 166, 154, 0.05)",
            bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
            bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
            topLineColor: "rgba( 38, 166, 154, 1)",
            bottomLineColor: "rgba( 239, 83, 80, 1)",
            topLineWidth: 2,
            bottomLineWidth: 2,
            priceSource: "close",
            transparency: 50,
            baseLevelPercentage: 50,
          },
          rangeStyle: {
            upColor: "#26a69a",
            downColor: "#ef5350",
            thinBars: true,
            upColorProjection: "#336854",
            downColorProjection: "#7f323f",
            inputs: {
              range: 10,
              phantomBars: false,
            },
            inputInfo: {
              range: {
                name: "Range",
              },
              phantomBars: {
                name: "Phantom bars",
              },
            },
          },
          symbol: "BTC/USDT",
          shortName: "",
          timeframe: "",
          onWidget: false,
          interval: "5",
          unitId: null,
          currencyId: null,
        },
        chartEventsSourceProperties: {
          visible: true,
          futureOnly: true,
          breaks: {
            color: "rgba(85, 85, 85, 1)",
            visible: false,
            style: 2,
            width: 1,
          },
        },
        tradingProperties: {
          showPositions: true,
          positionPL: {
            visibility: true,
            display: 0,
          },
          showOrders: true,
          showExecutions: true,
          horizontalAlignment: 0,
          extendLeft: true,
          lineLength: 5,
          lineWidth: 1,
          lineStyle: 0,
        },
        editorFontsList: {
          0: "Verdana",
          1: "Courier New",
          2: "Times New Roman",
          3: "Arial",
        },
        volumePaneSize: "large",
      };
      try {
        localStorage.setItem(
          "tradingview.chartproperties",
          JSON.stringify(graphTheme)
        );
        // eslint-disable-next-line no-empty
      } catch {}
      this.changeTopColor();
    },
  },
};
</script>

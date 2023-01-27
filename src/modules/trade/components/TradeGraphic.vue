<template>
  <div ref="graphic" class="graphic"></div>
</template>

<script>
import { mapGetters } from "vuex";
import Datafeed from "~/api/TradingView";
import { widget } from "~/assets/TradingView/charting_library/charting_library.esm.js";

export default {
  data() {
    return {
      tvWidget: null,
    };
  },
  computed: {
    ...mapGetters({
      baseCurrency: "getCurrentBaseCurrency",
      quoteCurrency: "getCurrentQuoteCurrency",
    }),

    lang() {
      return this.$locale;
    },
  },
  watch: {
    lang() {
      try {
        this.makeChart();
      } catch (e) {
        console.log(e);
      }
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
  },

  beforeUnmount() {
    Datafeed.unsubscribeBars();
  },

  methods: {
    makeChart() {
      const intervalFromLocalStorage =
          localStorage.getItem("chart_interval") || "5",
        tvWidget = new widget({
          symbol: this.baseCurrency + "/" + this.quoteCurrency,
          interval: intervalFromLocalStorage,
          timezone: "Etc/UTC",
          container: this.$refs.graphic,
          locale: this.lang,
          datafeed: Datafeed,
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
  },
};
</script>

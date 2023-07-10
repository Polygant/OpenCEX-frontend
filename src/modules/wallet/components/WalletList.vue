<template>
  <TabBlock :tab-id="tabId" :items="items" @tab-chosen="handleTabChose">
  </TabBlock>
</template>
<script>
import getRegularNumber from "~/mixins/getRegularNumber";
import getFixedDecimal from "@/mixins/getFixedDecimal";
import TabBlock from "~/components/ui/TabBlock.vue";
import { mapGetters } from "vuex";

const TAB_ID = "walletlist";

const FIELDS_COLS_MAP = {
  icon: "icon",
  currency: "currency",
  actual: "availablebalance",
  orders: "inorders",
};

const COLS_HEAD = ["icon", "currency", "availablebalance", "inorders"];

const FIELDS_TO_FORMAT = ["availablebalance", "inorders"];

export default {
  name: "WalletList",
  components: { TabBlock },
  mixins: [getRegularNumber, getFixedDecimal],
  props: {
    coins: {
      type: Object,
      required: true,
    },
  },
  emits: ["tab-chosen"],
  data() {
    return {
      tabId: TAB_ID,
    };
  },
  computed: {
    ...mapGetters({ isAuthorized: "core/isAuthorized" }),

    list() {
      let finalResult = [];
      Object.keys(this.coins).forEach((ticker) => {
        let coin = this.coins[ticker];
        if (
          !coin.disable_all &&
          !coin.disable_pairs &&
          (typeof coin["actual"] === "undefined" ||
            coin["actual"] ||
            coin["orders"])
        ) {
          let result = {};
          Object.keys(FIELDS_COLS_MAP).forEach((field) => {
            let alias = FIELDS_COLS_MAP[field];
            if (typeof coin[field] !== "undefined") {
              let needToBeFormatted = ~FIELDS_TO_FORMAT.indexOf(alias);
              result[alias] = needToBeFormatted
                ? this.getFormattedNum(coin, coin[field])
                : coin[field];
            }
          });
          result.currency = ticker;
          result.icon =
            coin.logo.length > 0
              ? coin.logo
              : "/public/img/common/svgcrypto/" + ticker.toLowerCase() + ".svg";
          finalResult.push(result);
        }
      });
      if (!this.isAuthorized) return finalResult.slice(0, 5);
      else return finalResult;
    },
    items() {
      return [
        {
          name: "mywallets",
          selected: true,
          component: "BaseList",
          listClass: "wallet",
          headers: COLS_HEAD,
          list: this.list,
          search: true,
        },
      ];
    },
  },

  methods: {
    getFormattedNum(coin, val) {
      val = parseFloat(val);

      switch (true) {
        case val > 9999999:
          val = this.addSpaceFixDecimal(val, 0);
          break;

        case val > 999:
          val = this.addSpaceFixDecimal(val, 2);
          break;

        default:
          val = this.addSpaceFixDecimal(val, 8);
      }

      return val === "-0.00" || val === "-0.01" ? "0.00" : val;
    },
    handleTabChose(tabName) {
      this.$emit("tab-chosen", tabName);
    },
  },
};
</script>

<style scoped></style>

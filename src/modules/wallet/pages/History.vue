<template>
  <div class="w-full wallet-history">
    <div class="plate">
      <div class="plate-back" @click="$router.push({ name: `wallet` })">
        {{ $t("common.history") }}
      </div>
      <div class="history__coin">
        <img width="20" height="20" class="inline-block" :src="coinImg" />
        {{ $route.params.walletitem }}
      </div>
      <WalletHistory
        :wallethistory="walletTickerHistory.list"
        :cur-page="walletTickerHistory.currentPage"
        :page-count="walletTickerHistory.totalPages"
        :get-pretty-date="getPrettyDate"
        :handle-pagination="handlePagination"
        :update-table="updateTable"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { floor10 } from "~/utilities/helpers";
import copyToBuffer from "~/mixins/copyToBuffer";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import WalletHistory from "../components/WalletHistory.vue";

export default {
  name: "HistoryPage",
  metaInfo() {
    return {
      title: this.$t("pages.wallet"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.walletDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    WalletHistory,
  },
  mixins: [getFixedDecimal, copyToBuffer],
  data() {
    return {
      payout_form_view: "pending",
      curPage: 1,
      txscount: 0,
      amountOnPage: 25,
      amountOfPages: 1,
      timers: [],
      resend_loader: {},
      floor10,
    };
  },
  computed: {
    ...mapGetters({
      coins: "core/coins",
      profile: "core/profile",
      isConnectedSocket: "isConnectedSocket",
      wsUserIsAuthenticated: "wsUserIsAuthenticated",
      user_notification: "core/user_notification",
      walletTickerHistory: "core/walletTickerHistory",
      reconnectError: "reconnectError",
      lockedBalance: "core/lockedBalance",
    }),
    coinImg() {
      return this.coins[this.$route.params.walletitem]?.logo?.length > 0
        ? this.coins[this.$route.params.walletitem]?.logo
        : `/public/img/common/svgcrypto/${this.$route.params.walletitem.toLowerCase()}.svg`;
    },
  },
  watch: {
    isConnectedSocket(isConnected) {
      if (isConnected) {
        if (localStorage.getItem("token")) {
          this.$store.dispatch(
            "sendWSMessage",
            JSON.stringify({ token: localStorage.getItem("token") })
          );
        }
      }
    },
    wsUserIsAuthenticated(isAuthenticated) {
      if (isAuthenticated) {
        this.getWalletHistory();
      }
    },
    reconnectError(error) {
      if (error) {
        this.updateWalletHistory(this.curPage, this.amountOnPage);
      }
    },
  },
  mounted() {
    this.$store.dispatch("core/getUserNotifications");
    if (this.isConnectedSocket) {
      if (localStorage.getItem("token")) {
        this.$store.dispatch(
          "sendWSMessage",
          JSON.stringify({ token: localStorage.getItem("token") })
        );
      }
      if (this.wsUserIsAuthenticated) {
        this.getWalletHistory();
      }
    }
  },
  beforeUnmount() {
    this.unsubscribeWsData();
    while (this.timers.length) {
      clearTimeout(this.timers.shift());
    }
  },
  methods: {
    toDetails(type, ticker) {
      this.$router.push({
        name: `wallet-${type}`,
        params: {
          walletitem: ticker,
        },
      });
    },
    fromPagetoLimits(pageNum) {
      let limit = this.amountOnPage;
      let offset = limit * (pageNum - 1);

      return {
        limit,
        offset,
        pageNum,
      };
    },
    getPageCount() {
      return this.amountOfPages;
    },
    changePage(pageNum) {
      this.curPage = pageNum;
    },
    handlePagination(pageNum) {
      this.changePage(pageNum);
      if (!this.reconnectError) {
        this.getWalletHistory(pageNum, this.amountOnPage, true);
      } else {
        this.updateWalletHistory(pageNum, this.amountOnPage);
      }
    },
    getPrettyDate(ptime) {
      let a = new Date();
      a.setTime(parseInt(ptime) * 1000);
      return a.toLocaleString("ru-RU");
    },
    updateTable() {
      this.getWalletHistory(this.curPage, this.amountOnPage, true);
      if (this.reconnectError) {
        this.updateWalletHistory(this.curPage);
      }
    },
    sendSocketMessage(msgCommand, msgParams, needPair, needToken) {
      let wsMessage = {
        command: msgCommand,
      };

      if (msgParams && Object.keys(msgParams)) {
        wsMessage.params = msgParams;
      }
      if (needToken) {
        wsMessage.token = localStorage.getItem("token") || null;
      }
      if (needPair) {
        wsMessage.params.pair_name = `${this.currentPair[0]}-${this.currentPair[1]}`;
      }

      this.$store.dispatch("sendWSMessage", JSON.stringify(wsMessage));
    },
    updateWalletHistory(page, limit) {
      let offset = limit * (page - 1);
      this.$store.dispatch("core/getWalletTickerHistory", {
        limit,
        offset,
        page,
        fc: () => {
          this.changePage(page);
        },
      });
    },
    getWalletHistory(page, limit) {
      const command = "add_wallet_ticker_history";
      if (!this.reconnectError) {
        this.sendSocketMessage(
          command,
          {
            limit: limit || 25,
            page: page || 1,
            ticker: this.$route.params.walletitem,
          },
          false,
          true
        );
      }
    },
    unsubscribeWsData() {
      this.sendSocketMessage(
        "del_wallet_ticker_history",
        {
          ticker: this.$route.params.walletitem,
        },
        false,
        true
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.history__coin {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #343535;
  margin-bottom: 20px;
}
</style>

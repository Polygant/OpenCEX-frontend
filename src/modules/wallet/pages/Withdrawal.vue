<template>
  <div>
    <div class="container-lg">
      <div class="deposit xl:grid grid-cols-5 gap-4">
        <div class="col-span-2">
          <div class="plate">
            <div class="plate-back" @click="$router.push({ name: `wallet` })">
              {{ $t("common.withdrawal") }}
            </div>
            <div class="wallet__panel">
              <div class="selector">
                <label>{{ $t("common.select_coin") }}</label>
                <SelectAdvanced
                  :total-title="$t('common.allbalance')"
                  :items="filteredCoins"
                  :selected-default="selectedDefault"
                  :image="true"
                  :all-coins="coins"
                  @select="coinChoose"
                />
              </div>
              <component :is="openedAction" v-bind="openedActionProperties" />
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <div class="plate">
            <div class="wallet__title wallet__title--single">
              {{ $t("common.walletwithdrawal_title") }}
            </div>
            <div>
              {{ $t("common.walletwithdrawal_text") }}
            </div>
          </div>
          <div class="plate">
            <div class="wallet__title wallet__title--table">
              {{ $t("common.walletwithdrawal") }}
            </div>
            <WalletHistory
              :wallethistory="walletWithdrawalHistory.list"
              :cur-page="walletWithdrawalHistory.currentPage"
              :page-count="walletWithdrawalHistory.totalPages"
              :get-pretty-date="getPrettyDate"
              :handle-pagination="handlePagination"
              :update-table="updateTable"
              @page-change="changePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { floor10 } from "~/utilities/helpers";
import copyToBuffer from "~/mixins/copyToBuffer";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import WalletHistory from "../components/WalletHistory.vue";
import WalletDepositSepaFialModal from "../components/modals/WalletDepositSepaFialModal.vue";
import WalletWithdrawalCryptoAddress from "../components/modals/WalletWithdrawalCryptoAddress.vue";
import SecurityNoticeModal from "../components/modals/SecurityNoticeModal.vue";
import InfoModal from "../components/modals/InfoModal.vue";
import SelectAdvanced from "~/components/ui/SelectAdvanced.vue";

export default {
  name: "WalletWithdrawall",
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
    SelectAdvanced,
    WalletHistory,
  },
  mixins: [getFixedDecimal, copyToBuffer],
  data() {
    return {
      selectedCoin: "",
      openedAction: "",
      selectedDefault: this.$route?.params?.walletitem,
      openedActionProperties: {},
      payout_form_view: "pending",
      errorMSGwithADVCASH: "",
      currencyWWWwithINTERKASSA: "USDT",
      curPage: 1,
      txscount: 0,
      amountOnPage: 10,
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
      walletWithdrawalHistory: "core/walletWithdrawalHistory",
      reconnectError: "reconnectError",
      lockedBalance: "core/lockedBalance",
    }),
    filteredCoins() {
      return Object.fromEntries(
        Object.entries(this.coins).filter(([, coin]) => {
          return coin.active && !coin.disable_all;
        })
      );
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
        this.getBalance();
        this.getLockedBalance();
        this.getWalletHistory();
      }
    },
    user_notification(notifications) {
      if (notifications.length) {
        this.$modal.show(
          InfoModal,
          {},
          {
            adaptive: true,
            height: "auto",
            scrollable: true,
            width: 500,
          }
        );
      }
    },
    reconnectError(error) {
      if (error) {
        this.updateWalletHistory(this.curPage, this.amountOnPage);
        this.updateBalance();
      }
    },
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch("core/getCoinsLimits"),
      this.loadWallets(),
      this.$store.dispatch("core/getUserNotifications"),
    ]);
    this.showSecurityNotice();
    if (this.isConnectedSocket) {
      if (localStorage.getItem("token")) {
        this.$store.dispatch(
          "sendWSMessage",
          JSON.stringify({ token: localStorage.getItem("token") })
        );
      }
      if (this.wsUserIsAuthenticated) {
        this.getBalance();
        this.getLockedBalance();
        this.getWalletHistory();
      }
    }
    this.cryptoWithdrawalClickHandler(this.$route?.params?.walletitem);
  },
  beforeUnmount() {
    this.unsubscribeWsData();
    while (this.timers.length) {
      clearTimeout(this.timers.shift());
    }
  },
  methods: {
    coinChoose(value) {
      if (this.$route.params.walletitem !== value) {
        this.$router.push({
          name: `wallet-withdrawal`,
          params: {
            walletitem: value,
          },
        });
      }
    },
    blockchainCurrencyByCoin(coin) {
      return coin.blockchain_list
        ? coin.blockchain_list.map((code) => ({
            code,
            name: code,
          }))
        : [];
    },
    formatingCommission(address) {
      const newArray = Object.values(address);
      if (newArray.length > 1) {
        return `${Math.min(...newArray)} - ${Math.max(...newArray)}`;
      }
      if (newArray.length === 1) {
        return `${newArray[0]}`;
      }
      return "0";
    },
    formatingBalanceAndOrder(value) {
      return value !== 0 ? value.toFixed(8) : value.toFixed();
    },
    showLockedBalance(ticker) {
      return this.lockedBalance[ticker];
    },
    getCoinWithdrawalFee(coin) {
      return coin.fee.withdrawal[this.$config.currentWithdrawCardPaySystem];
    },
    getCoinDepositFee(coin) {
      return coin.fee.deposit[this.$config.currentTopUpCardPaySystem];
    },
    sepaDepositButtonHandler(currency) {
      this.$modal.show(
        WalletDepositSepaFialModal,
        {
          currency,
        },
        {
          adaptive: true,
          height: "auto",
          scrollable: true,
          width: 500,
        }
      );
    },
    cryptoWithdrawalClickHandler(ticker) {
      this.openedAction = WalletWithdrawalCryptoAddress;
      this.openedActionProperties = {
        ticker,
      };
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
    getBalance() {
      this.sendSocketMessage("add_balance", {}, false, true);
    },
    getLockedBalance() {
      this.sendSocketMessage("add_locked_balance", {}, false, true);
    },
    updateBalance() {
      this.$store.dispatch("core/getBalance");
    },
    updateWalletHistory(page, limit) {
      let offset = limit * (page - 1);
      this.$store.dispatch("core/getWalletWithdrawalHistory", {
        limit,
        offset,
        page,
        fc: () => {
          this.changePage(page);
        },
      });
    },
    getWalletHistory(page, limit) {
      const command = "add_wallet_withdrawals_history";
      if (!this.reconnectError) {
        this.sendSocketMessage(
          command,
          {
            limit: limit || 10,
            page: page || 1,
          },
          false,
          true
        );
      }
    },
    unsubscribeWsData() {
      this.sendSocketMessage("del_balance", {}, false, true);
      this.sendSocketMessage("del_wallet_withdrawals_history", {}, false, true);
    },
    async loadWallets() {
      await this.$http.post("getwallets/", {}).then((response) => {
        response.data.forEach((wallet) => {
          if (!this.coins[wallet.currency]) {
            this.coins[wallet.currency] = {};
          }
          if (!this.coins[wallet.currency].address) {
            this.coins[wallet.currency]["address"] = wallet;
          }
          if (
            Array.isArray(this.coins[wallet.currency].address) &&
            !this.coins[wallet.currency].address.find(
              (item) => item.address === wallet.address
            )
          ) {
            this.coins[wallet.currency]["address"] = [
              ...this.coins[wallet.currency].address,
              wallet,
            ];
          }
          if (
            typeof this.coins[wallet.currency].address === "object" &&
            !Array.isArray(this.coins[wallet.currency].address) &&
            this.coins[wallet.currency].address !== null &&
            this.coins[wallet.currency].address.address !== wallet.address
          ) {
            this.coins[wallet.currency]["address"] = [
              this.coins[wallet.currency].address,
              wallet,
            ];
          }
        });
      });
    },
    showSecurityNoticeModal() {
      this.$modal.show(
        SecurityNoticeModal,
        {},
        {
          adaptive: true,
          height: "auto",
          scrollable: true,
          width: 500,
        }
      );
    },
    showSecurityNotice() {
      const securityNotice = localStorage.getItem("show_security_notice");
      if (securityNotice != "OFF") {
        this.$http.post("check2fa/").then((response) => {
          const needTwoFa = response.data === "OFF";
          const needSMS = !this.profile.withdrawals_sms_confirmation;

          if (needTwoFa && needSMS) {
            this.showSecurityNoticeModal();
          }
        });
      }
    },
    formatAmount(amount) {
      return parseFloat(amount) > 0 ? amount : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.deposit-address {
  width: auto;
}
</style>

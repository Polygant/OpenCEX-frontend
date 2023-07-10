<template>
  <div>
    <div class="container-lg">
      <div class="deposit xl:grid grid-cols-5 gap-4">
        <div class="col-span-2">
          <div class="plate">
            <div class="plate-back" @click="$router.push({ name: `wallet` })">
              {{ $t("common.deposit") }}
            </div>
            <div class="wallet__panel">
              <div class="selector">
                <label>{{ $t("common.select_coin") }}</label>
                <SelectAdvanced
                  :items="filteredCoins"
                  :image="true"
                  :selected-default="selectedDefault"
                  :total-title="$t('common.allbalance')"
                  :all-coins="coins"
                  @select="coinChoose"
                />
              </div>
              <div v-if="Object.keys(networksList).length > 0" class="selector">
                <label>{{ $t("common.select_network_selector") }}</label>
                <SelectAdvanced
                  :items="networksList"
                  :all-coins="coins"
                  @select="networkSelected"
                />
              </div>
              <component :is="openedAction" v-bind="openedActionProperties" />
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <div class="plate">
            <div class="wallet__title wallet__title--single">
              {{ $t("common.walletdeposit_title") }}
            </div>
            <div>
              {{ $t("common.walletdeposit_text") }}
            </div>
          </div>
          <div class="plate">
            <div class="wallet__title wallet__title--table">
              {{ $t("common.deposit_history") }}
            </div>
            <WalletHistory
              :wallethistory="walletTopupsHistory.list"
              :cur-page="walletTopupsHistory.currentPage"
              :page-count="walletTopupsHistory.totalPages"
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

import WalletDepositAddress from "../components/modals/WalletDepositAddress.vue";
import SecurityNoticeModal from "../components/modals/SecurityNoticeModal.vue";
import DepositNoticeModal from "../components/modals/DepositNoticeModal.vue";
import InfoModal from "../components/modals/InfoModal.vue";
import SelectAdvanced from "~/components/ui/SelectAdvanced.vue";

export default {
  name: "WalletDeposit",
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
      networksList: [],
      selectedDefault: this.$route?.params?.walletitem,
      openedActionProperties: {},
      createCodePending: false,
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
      walletTopupsHistory: "core/walletTopupsHistory",
      reconnectError: "reconnectError",
      lockedBalance: "core/lockedBalance",
    }),
    filteredCoins() {
      return Object.fromEntries(
        Object.entries(this.coins).filter(
          ([, coin]) => coin.active && !coin.disable_all
        )
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
    deep: true,
  },
  mounted() {
    if (localStorage.getItem("showDepositNoticeModal")) {
      this.showDepositNoticeModal();
      localStorage.removeItem("showDepositNoticeModal");
    }
    this.$store.dispatch("core/getCoinsLimits");
    this.loadWallets();
    this.showSecurityNotice();
    this.$store.dispatch("core/getUserNotifications");
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
    setTimeout(() => {
      this.coinSelected(this.$route?.params?.walletitem, this.coins);
    }, 300);
  },
  beforeUnmount() {
    this.unsubscribeWsData();
    while (this.timers.length) {
      clearTimeout(this.timers.shift());
    }
  },
  methods: {
    showDepositNoticeModal() {
      this.$modal.show(
        DepositNoticeModal,
        {},
        {
          adaptive: true,
          height: "auto",
          scrollable: true,
          width: 500,
        }
      );
    },
    coinChoose(value) {
      this.$store.dispatch("core/getCoinsLimits");
      if (this.$route.params.walletitem !== value) {
        this.$router.push({
          name: `wallet-deposit`,
          params: {
            walletitem: value,
          },
        });
      }
    },

    coinSelected(value, coins) {
      if (coins) {
        this.selectedCoin = { coin: value, ...coins[value] };
      } else {
        this.selectedDefault = "";
        this.selectedCoin = { coin: value, ...this.filteredCoins[value] };
      }
      this.networksList = {};
      if (this.blockchainCurrencyByCoin(this.selectedCoin).length === 0) {
        this.networksList[this.selectedCoin.name] = {
          id: this.selectedCoin.name,
          name: this.$t("common.address"),
          action: () =>
            this.depositAddressHandler(
              this.selectedCoin,
              this.selectedCoin.coin
            ),
        };
      }
      this.blockchainCurrencyByCoin(this.selectedCoin).map((item) => {
        this.networksList[item.name] = {
          id: item.name,
          name: this.$t("common.address"),
          action: () =>
            this.depositAddressHandler(
              this.selectedCoin,
              this.selectedCoin.coin,
              item.code
            ),
        };
      });
      this.networksList[Object.values(this.networksList)[0].id].action();
    },
    networkSelected(id) {
      this.networksList[id].action();
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
    depositAddressHandler(currentCoin, ticker, blockchain) {
      let coin = {
        ...currentCoin,
      };

      let address = null;

      if (blockchain) {
        if (coin.address && coin.address.length) {
          coin.address.forEach((item) => {
            if (item.blockchain_currency === blockchain) {
              address = item;
            }
          });

          coin.address = address;
        }
        if (coin.address && coin.address.length < 1) {
          coin.address = null;
        }
      }
      this.openedAction = WalletDepositAddress;
      this.openedActionProperties = { coin, ticker, blockchain };
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
      this.$store.dispatch("core/getWalletTopupsHistory", {
        limit,
        offset,
        page,
        fc: () => {
          this.changePage(page);
        },
      });
    },
    getWalletHistory(page, limit) {
      const command = "add_wallet_topups_history";
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
      this.sendSocketMessage("del_wallet_topups_history", {}, false, true);
    },
    loadWallets() {
      this.$http.post("getwallets/", {}).then((response) => {
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
.selector {
  position: relative;
}
</style>

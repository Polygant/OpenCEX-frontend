<template>
  <div>
    <div>
      <div class="w-full wallets-list">
        <div class="plate">
          <div class="wallet__title wallet__title--top">
            {{ $t("common.wallet") }}
          </div>
          <input
            v-model="searchParameter"
            v-pattern="/^[a-zA-Z\s]{0,24}$/"
            type="text"
            :placeholder="$t('common.search_currency')"
            class="tab-pane__search"
          />
          <label class="input_checkbox hideSmall__checkbox">
            <input v-model="hideLess" type="checkbox" class="input_hidden" />
            <span class="checkmark"></span>
            {{ $t("common.hideSmallBallance") }}
          </label>
          <div class="table-responsive">
            <table class="walletTable">
              <thead>
                <tr>
                  <th class="walletTable__header walletTable__header_val">
                    {{ $t("common.currency") }}
                    <div
                      class="wallet__sortButton"
                      @click="sortWalletTable('currency')"
                    ></div>
                  </th>
                  <th class="walletTable__header walletTable__header_balans">
                    {{ $t("common.allbalance") }}
                    <div
                      class="wallet__sortButton"
                      @click="sortWalletTable('total')"
                    ></div>
                  </th>
                  <th class="walletTable__header walletTable__header_order">
                    {{ $t("common.inorders") }}
                    <div
                      class="wallet__sortButton"
                      @click="sortWalletTable('orders')"
                    ></div>
                  </th>
                  <th
                    class="walletTable__header walletTable__header_locked-balance"
                  >
                    {{ $t("common.lockedBalance") }}
                  </th>
                  <th
                    class="walletTable__header walletTable__header_offset"
                  ></th>
                  <th
                    class="walletTable__header walletTable__header walletTable__header_button"
                  >
                    {{ $t("common.action") }}
                  </th>
                </tr>
              </thead>
              <tbody v-if="filteredCoins">
                <tr
                  v-for="(coin, ticker) in filteredCoins"
                  :key="'coin-' + ticker"
                >
                  <td
                    class="walletTable__item walletTable__item_val"
                    :data-thead="$t('common.currency')"
                  >
                    <div
                      class="walletTable__item_main walletTable__item_main--coin"
                    >
                      <img
                        width="50"
                        :src="
                          '/public/img/common/svgcrypto/' +
                          ticker.toLowerCase() +
                          '.svg'
                        "
                        :alt="ticker.toUpperCase()"
                        class="mCS_img_loaded walletTable__item_img"
                      />
                      <div class="walletTable__coin">
                        <strong>{{ ticker }}</strong>
                        <span>{{ coin.name }}</span>
                      </div>
                    </div>
                  </td>
                  <td
                    class="walletTable__item walletTable__item_balans"
                    :data-thead="$t('common.allbalance')"
                  >
                    {{
                      formatingBalanceAndOrder(
                        floor10(coin["actual"] + coin["orders"], -coin.decimals)
                      )
                    }}
                  </td>
                  <td
                    class="walletTable__item walletTable__item_order"
                    :data-thead="$t('common.inorders')"
                  >
                    {{
                      formatingBalanceAndOrder(
                        floor10(coin["orders"], -coin.decimals)
                      )
                    }}
                  </td>
                  <td
                    class="walletTable__item walletTable__item_order"
                    :data-thead="$t('common.lockedBalance')"
                  >
                    {{ showLockedBalance(ticker) }}
                  </td>
                  <td
                    class="walletTable__item walletTable__item--hide-mobile"
                  ></td>
                  <td
                    class="walletTable__item walletTable__item_button wallet-button-desktop"
                    style="text-align: right"
                  >
                    <div class="btn-group dropup dropup-line">
                      <span
                        class="wallet__action wallet__action--deposit"
                        :class="coins[ticker].disable_topups ? 'disabled' : ''"
                        :style="
                          mainColor ? `color: ${secondColor} !important` : {}
                        "
                        @click="
                          toDetails(
                            'deposit',
                            ticker,
                            coins[ticker].disable_topups
                          )
                        "
                      >
                        <svg width="18" height="18" class="inline">
                          <use
                            :fill="
                              mainColor
                                ? `${mainColor}`
                                : 'var(--theme-primary-color)'
                            "
                            href="/public/sprite.svg#deposit"
                          ></use>
                        </svg>
                        {{ $t("common.deposit").toUpperCase() }}
                      </span>
                      <span
                        class="wallet__action wallet__action--withdrawal"
                        :class="
                          coins[ticker].disable_withdrawals ? 'disabled' : ''
                        "
                        @click="
                          toDetails(
                            'withdrawal',
                            ticker,
                            coins[ticker].disable_withdrawals
                          )
                        "
                      >
                        <img
                          src="/public/img/withdrawal.svg"
                          width="16"
                          height="16"
                        />
                        {{ $t("common.withdrawal").toUpperCase() }}
                      </span>
                      <span
                        class="wallet__action wallet__action--history"
                        @click="toDetails('history', ticker)"
                      >
                        <img
                          src="/public/img/history.svg"
                          width="16"
                          height="16"
                        />
                        {{ $t("common.history").toUpperCase() }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="w-full wallet-history">
        <div class="plate">
          <div class="wallet__title wallet__title--top">
            {{ $t("common.wallethistory") }}
          </div>
          <WalletHistory
            :wallethistory="wallethistory.list"
            :cur-page="wallethistory.currentPage"
            :page-count="wallethistory.totalPages"
            :get-pretty-date="getPrettyDate"
            :handle-pagination="handlePagination"
            :update-table="updateTable"
            @page-change="changePage"
          />
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
import wallet from "~/mixins/wallet";
import SecurityNoticeModal from "../components/modals/SecurityNoticeModal.vue";
import WalletHistory from "../components/WalletHistory.vue";
import InfoModal from "../components/modals/InfoModal.vue";
import WalletDepositSepaFialModal from "../components/modals/WalletDepositSepaFialModal.vue";

export default {
  name: "WalletPage",
  metaInfo() {
    return {
      title: this.$t("pages.titles.wallet"),
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
  mixins: [getFixedDecimal, copyToBuffer, wallet],
  data() {
    return {
      hideLess: false,
      sortField: "",
      sortTypeAsc: true,
      searchParameter: "",
      isInitialized: false,
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
      areCoinsLoaded: "core/areCoinsLoaded",
      coins: "core/coins",
      profile: "core/profile",
      isConnectedSocket: "isConnectedSocket",
      wsUserIsAuthenticated: "wsUserIsAuthenticated",
      user_notification: "core/user_notification",
      wallethistory: "core/wallethistory",
      reconnectError: "reconnectError",
      lockedBalance: "core/lockedBalance",
    }),
    filteredCoins() {
      let filtered = Object.fromEntries(
        Object.entries(this.coins).filter((coin) => {
          let total = coin[1].actual + coin[1].orders;
          if (this.hideLess) {
            return (
              coin[0].includes(this.searchParameter.toUpperCase()) &&
              total > 0.0001
            );
          } else {
            return coin[0].includes(this.searchParameter.toUpperCase());
          }
        })
      );
      let sorted = {};
      if (this.sortField !== "") {
        let sortFieldValue = this.sortField;
        let sortFieldAsc = this.sortTypeAsc;
        sorted = Object.fromEntries(
          Object.entries(filtered).sort(function (a, b) {
            let res = 1;
            let x, y;
            switch (sortFieldValue) {
              case "currency":
                x = a[0].toLowerCase();
                y = b[0].toLowerCase();
                if (sortFieldAsc) {
                  res = x < y ? 1 : x > y ? -1 : 0;
                } else {
                  res = x < y ? -1 : x > y ? 1 : 0;
                }
                break;
              case "total":
                x = a[1].actual + a[1].orders;
                y = b[1].actual + b[1].orders;
                if (sortFieldAsc) {
                  res = x < y ? 1 : x > y ? -1 : 0;
                } else {
                  res = x < y ? -1 : x > y ? 1 : 0;
                }
                break;
              case "orders":
                x = a[1].orders;
                y = b[1].orders;
                if (sortFieldAsc) {
                  res = x < y ? 1 : x > y ? -1 : 0;
                } else {
                  res = x < y ? -1 : x > y ? 1 : 0;
                }
                break;
            }

            return res;
          })
        );
      } else {
        sorted = filtered;
      }
      return Object.fromEntries(
        Object.entries(sorted).filter(([, coin]) => !coin.disable_all)
      );
    },
    filteredList() {
      return Object.entries(this.filteredCoins).filter((item) => {
        return item.currency
          .toUpperCase()
          .includes(this.searchParameter.toUpperCase());
      });
    },
  },
  watch: {
    areCoinsLoaded: {
      immediate: true,
      handler(value) {
        if (value && !this.isInitialized) {
          this.init();
          this.isInitialized = true;
        }
      },
    },
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
  beforeUnmount() {
    this.unsubscribeWsData();
    while (this.timers.length) {
      clearTimeout(this.timers.shift());
    }
  },
  methods: {
    init() {
      this.sortField = localStorage.getItem("sort-field") || "";
      this.sortTypeAsc = localStorage.getItem("sort-asc") === "1" || "";
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
    },
    sortWalletTable(sortType) {
      if (sortType !== this.sortField) {
        this.sortTypeAsc = true;
        localStorage.setItem("sort-asc", "1");
      } else {
        this.sortTypeAsc = !this.sortTypeAsc;
        if (this.sortTypeAsc) {
          localStorage.setItem("sort-asc", "1");
        } else {
          localStorage.setItem("sort-asc", "0");
        }
      }
      this.sortField = sortType;
      localStorage.setItem("sort-field", sortType);
    },
    toDetails(type, ticker, disabled) {
      if (!disabled)
        this.$router.push({
          name: `wallet-${type}`,
          params: {
            walletitem: ticker,
          },
        });
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
      return (value !== 0 ? value.toFixed(8) : value.toFixed()) * 1;
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
      this.$store.dispatch("core/getWalletHistory", {
        limit,
        offset,
        page,
        fc: () => {
          this.changePage(page);
        },
      });
    },
    getWalletHistory(page, limit, updateHistory) {
      const command = updateHistory
        ? "get_wallet_history"
        : "add_wallet_history";
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
      this.sendSocketMessage("del_wallet_history", {}, false, true);
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
.walletlist {
  min-height: unset;
  height: auto;
  @media (min-width: 700px) {
    overflow: auto;
    min-height: 640px;
  }
}
button:focus {
  outline: none;
}

.dropdown-menu {
  z-index: 1001;
  box-shadow: rgb(171, 171, 171) 0px 4px 10px !important;
  line-height: 38px;
  width: 250px;
  padding: 0;
  border-radius: 3px;
  margin: -3px 0 0;
  border: 1px solid #dedede;
  box-shadow: 0 4px 15px #ababab;
}

.dropdown-item--header {
  pointer-events: none;
  background: #f3f3f3;
  height: 28px;
  font-size: 11px;
  padding-top: 0px;
  line-height: 30px;
}

.dropdown-item {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.walletTable__item,
.walletTable__header {
  padding: 0 5px;
}
.walletTable__header {
  background: #f5f5f5;
  font-weight: 600;
  font-family: "Open Sans";
  font-size: 14px;
}
.walletTable__header_button {
  padding-left: 39px !important;
}

.walletTable__item_val {
  white-space: nowrap;
  padding-left: 20px;
}

.wallet__button_operation {
  background: #fff;
  padding: 0 20px;

  &:hover {
    background: var(--theme-primary-color);
    color: #fff;
  }
}

.wallet__action {
  display: inline-block;
  margin-left: 52px;
  font-weight: 700;
  cursor: pointer;
  &.disabled {
    opacity: 0.5;
  }
}
.wallet__action img {
  display: inline-block;
}
.wallet__action--deposit {
  color: var(--theme-primary-color);
}

.wallets-list {
  width: 100%;
}

@media screen and (max-width: 1199px) {
  #wwwwithINTERKASSA .modal-dialog,
  #interkassatopupdialog {
    max-width: 400px !important;
  }
}

@media (min-width: 576px) {
  #wwwwithINTERKASSA .modal-dialog,
  #interkassatopupdialog {
    max-width: 350px;

    h3 {
      font-size: 1.5rem;
    }
  }
}

.response-message-hint {
  color: #d69d51;
  margin-left: 10px;
  text-align: center;
}
.walletTable__item {
  font-family: "Open Sans";
}
.walletTable__item_order {
  padding-right: 10px;
}

.blocked {
  opacity: 0.75;
  pointer-events: none;
}

.wallets-list.kyc {
  display: flex;
  flex-direction: column;
  padding-right: 15px;
}

.walletTable__header_val {
  padding-left: 30px !important;
}

.wallets-list .table-responsive {
  overflow: initial;
}

.walletTable__header {
  padding: 11px 0 10px;
}

.walletTable__header_order {
  white-space: nowrap;
}

.walletTable__header_locked-balance {
  white-space: nowrap;
}

.wallets-list.kyc .walletlist {
  flex-grow: 2;
  overflow: visible;

  @media screen and (max-width: 1260px) {
    overflow: initial;
  }
}

.fiat-table {
  @media screen and (max-width: 1260px) {
    overflow: initial;
  }
}

.wallets-list.kyc .wallet__title.kyc {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 25px;
}

.wallet__title {
  margin-bottom: 20px;
}

.kyc-check {
  display: flex;
  flex-grow: 2;
  flex-direction: column;
  padding: 20px;
}

button[disabled] {
  opacity: 0.75;
  pointer-events: none;
}

.wallet-button-desktop {
  white-space: nowrap;
}

.wallet-button-desktop {
  @media (max-width: 687px) {
    .btn-group {
      display: flex;
      justify-content: space-around;
      span {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
}

.walletTable__item_img {
  float: left;
}
.walletTable__coin {
  padding-left: 35px;
  span {
    display: block;
    font-size: 12px;
    color: #717b8b;
    line-height: 1em;
    font-weight: 300;
  }
  strong {
    color: #2b395b;
    display: block;
    font-size: 14px;
    line-height: 1em;
    padding-bottom: 2px;
  }
}

@media screen and (max-width: 1260px) {
  .wallets-list,
  .wallet-history {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media screen and (min-width: 687px) {
  .dropleft.withdraw {
    margin-right: 5px;
  }
}

@media screen and (max-width: 686px) {
  .walletTable thead {
    display: none;
  }

  .walletTable > tbody > tr {
    display: block;
  }

  .walletTable > tbody > tr + tr {
    margin-top: 20px;
    white-space: nowrap;
  }
  .walletTable__item {
    padding: 5px 10px 5px 20px;
    display: flex;
    justify-content: space-between;
    border: 0;
    border-bottom: 1px solid #f2f2f2;
    width: 100%;
    text-align: right;
  }

  .walletTable__item:before {
    content: attr(data-thead);
    display: inline-block;
    margin: -5px 10px -5px -10px;
    padding: 5px 10px;
    width: 50%;
    text-align: left;
  }

  .walletTable__item_button {
    display: block;
    border: 0;
  }

  .walletTable__item_button:before {
    content: none;
  }

  .walletTable__item:last-child:before {
    display: none;
  }

  .walletTable__item {
    padding-right: 15px;

    &--hide-mobile {
      display: none;
    }
  }

  .wallet-button-desktop {
    display: inline-block;
    padding: 5px 10px 20px;
    width: 100%;
  }
}
.wallet__title--top {
  padding-left: 0;
}
.tab-pane__search {
  background: url("/public/img/searchicon.png") no-repeat 15px center;
  font-size: 14px;
  height: 37px;
  padding: 5px 40px 5px;
  width: 280px;
}
.dropup-line {
  @media (max-width: 950px) {
    flex-wrap: wrap;
  }
}
.wallet__sortButton {
  position: relative;
  display: inline-block;
  top: -1px;
  left: 4px;
  cursor: pointer;
  width: 20px;
  height: 10px;
  padding-left: 10px;
  &:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 4px 4px 4px;
    border-color: transparent transparent #000000 transparent;
    position: absolute;
    top: 0;
    left: 0;
  }
  &:before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 4px 0 4px;
    border-color: #000000 transparent transparent transparent;
    position: absolute;
    top: 8px;
    left: 0;
  }
}
.hideSmall__checkbox {
  margin-left: 30px;
  @media (max-width: 542px) {
    margin-left: 0;
    display: block;
    margin-top: 10px;
  }
}
@media (max-width: 687px) {
  .walletTable__item_main--coin {
    padding-top: 14px;
  }
}
</style>

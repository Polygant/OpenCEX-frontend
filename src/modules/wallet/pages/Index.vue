<template>
  <div>
    <div>
      <div class="w-full wallets-list">
        <div class="plate">
          <div class="wallet__title wallet__title--top">
            {{ $t("common.wallet") }}
          </div>
          <div class="md:flex justify-start">
            <div class="search-input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                version="1.1"
                width="20"
                height="20"
                viewBox="0 0 256 256"
                xml:space="preserve"
                class="search-input-icon"
              >
                <defs></defs>
                <g
                  transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                >
                  <path
                    d="M 87.803 77.194 L 68.212 57.602 c 9.5 -14.422 7.912 -34.054 -4.766 -46.732 c 0 0 -0.001 0 -0.001 0 c -14.495 -14.493 -38.08 -14.494 -52.574 0 c -14.494 14.495 -14.494 38.079 0 52.575 c 7.248 7.247 16.767 10.87 26.287 10.87 c 7.134 0 14.267 -2.035 20.445 -6.104 l 19.591 19.591 C 78.659 89.267 80.579 90 82.498 90 s 3.84 -0.733 5.305 -2.197 C 90.732 84.873 90.732 80.124 87.803 77.194 z M 21.48 52.837 c -8.645 -8.646 -8.645 -22.713 0 -31.358 c 4.323 -4.322 10 -6.483 15.679 -6.483 c 5.678 0 11.356 2.161 15.678 6.483 c 8.644 8.644 8.645 22.707 0.005 31.352 c -0.002 0.002 -0.004 0.003 -0.005 0.005 c -0.002 0.002 -0.003 0.003 -0.004 0.005 C 44.184 61.481 30.123 61.48 21.48 52.837 z"
                    transform=" matrix(1 0 0 1 0 0) "
                    stroke-linecap="round"
                  />
                </g>
              </svg>
              <input
                v-model="searchParameter"
                v-pattern="/^[a-zA-Z\s]{0,24}$/"
                type="text"
                :placeholder="$t('common.search_currency')"
                class="tab-pane__search"
              />
            </div>
            <label class="input_checkbox hideSmall__checkbox">
              <input v-model="hideLess" type="checkbox" class="input_hidden" />
              <span class="checkmark"></span>
              {{ $t("common.hideSmallBallance") }}
            </label>
          </div>
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
                          coin.logo.length > 0
                            ? coin.logo
                            : `/public/img/common/svgcrypto/${ticker.toLowerCase()}.svg`
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
                      addSpaceFixDecimal(
                        coin["actual"] + coin["orders"],
                        coin.decimals
                      )
                    }}
                  </td>
                  <td
                    class="walletTable__item walletTable__item_order"
                    :data-thead="$t('common.inorders')"
                  >
                    {{ addSpaceFixDecimal(coin["orders"], coin.decimals) }}
                  </td>
                  <td
                    class="walletTable__item walletTable__item_order"
                    :data-thead="$t('common.lockedBalance')"
                  >
                    {{
                      addSpaceFixDecimal(
                        showLockedBalance(ticker),
                        coin.decimals
                      )
                    }}
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
                        <svg
                          width="18"
                          height="16"
                          viewBox="0 0 18 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="inline-block"
                        >
                          <path
                            d="M13.1667 3.83333L11.9917 5.00833L14.1417 7.16667H5.66666V8.83333H14.1417L11.9917 10.9833L13.1667 12.1667L17.3333 8L13.1667 3.83333ZM2.33332 2.16667H8.99999V0.5H2.33332C1.41666 0.5 0.666656 1.25 0.666656 2.16667V13.8333C0.666656 14.75 1.41666 15.5 2.33332 15.5H8.99999V13.8333H2.33332V2.16667Z"
                          />
                        </svg>
                        {{ $t("common.withdrawal").toUpperCase() }}
                      </span>
                      <span
                        class="wallet__action wallet__action--history"
                        @click="toDetails('history', ticker)"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          class="inline-block"
                        >
                          <path
                            d="M11.5833 15.1417L12.4166 16.5917C11.6166 16.9583 10.7416 17.2 9.83331 17.2917V15.6083C10.45 15.5333 11.0333 15.375 11.5833 15.1417ZM2.39165 9.83334H0.708313C0.79998 10.75 1.04165 11.6167 1.40831 12.4167L2.85831 11.5833C2.62498 11.0333 2.46665 10.45 2.39165 9.83334ZM11.5833 2.85834L12.4166 1.40834C11.6166 1.04168 10.75 0.80001 9.83331 0.708344V2.39168C10.45 2.46668 11.0333 2.62501 11.5833 2.85834ZM15.6083 8.16668H17.2916C17.2 7.25001 16.9583 6.38334 16.5916 5.58334L15.1416 6.41668C15.375 6.96668 15.5333 7.55001 15.6083 8.16668ZM6.41665 15.1417L5.58331 16.5917C6.38331 16.9583 7.25831 17.2 8.16665 17.2917V15.6083C7.54998 15.5333 6.96665 15.375 6.41665 15.1417ZM8.16665 2.39168V0.708344C7.24998 0.80001 6.38331 1.04168 5.58331 1.40834L6.41665 2.85834C6.96665 2.62501 7.54998 2.46668 8.16665 2.39168ZM14.3 4.97501L15.75 4.13334C15.225 3.40834 14.5833 2.76668 13.8583 2.24168L13.0166 3.69168C13.5083 4.06668 13.9333 4.49168 14.3 4.97501ZM2.85831 6.41668L1.40831 5.58334C1.04165 6.38334 0.79998 7.25001 0.708313 8.16668H2.39165C2.46665 7.55001 2.62498 6.96668 2.85831 6.41668ZM15.6083 9.83334C15.5333 10.45 15.375 11.0333 15.1416 11.5833L16.5916 12.4167C16.9583 11.6167 17.2 10.7417 17.2916 9.83334H15.6083ZM13.025 14.3L13.8666 15.75C14.5916 15.225 15.2333 14.5833 15.7583 13.8583L14.3083 13.0167C13.9333 13.5083 13.5083 13.9333 13.025 14.3ZM4.97498 3.70001L4.14165 2.24168C3.40831 2.77501 2.77498 3.40834 2.24998 4.14168L3.69998 4.98334C4.06665 4.49168 4.49165 4.06668 4.97498 3.70001ZM3.69998 13.025L2.24998 13.8583C2.77498 14.5833 3.41665 15.225 4.14165 15.75L4.98331 14.3C4.49165 13.9333 4.06665 13.5083 3.69998 13.025ZM9.83331 4.83334H8.16665V9.34168L11.7416 12.9167L12.9166 11.7417L9.83331 8.65834V4.83334Z"
                          />
                        </svg>
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
  padding-right: 20px;
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
  position: relative;
  top: 8px;
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
.currency__filter-search {
  border: none !important;
}
.search-input {
  width: auto;
  position: relative;
  margin-bottom: 10px;
}
.search-input-icon {
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 7px;
}
@media (max-width: 542px) {
  .search-input {
    width: 100%;
  }
}
.wallets-list .plate {
  padding-bottom: 4px;
}
</style>

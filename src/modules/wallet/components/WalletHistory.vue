<template>
  <div class="wallet-history__wrapper">
    <button class="pull-right wallet-history__refresh" @click="updateTable">
      <img src="/public/img/refresh.svg" width="22" height="16" alt="update" />
    </button>
    <div v-if="wallethistory && wallethistory.length" class="wallet-history">
      <div class="wallet-history__header">
        <span class="wallet-history__date">{{ $t("common.date") }}</span>
        <span class="wallet-history__operation">{{
          $t("common.operation")
        }}</span>
        <span class="wallet-history__blockchain">
          {{ $t("common.blockchain") }}
        </span>
        <span class="wallet-history__amount">{{
          $t("common.amountTableHeader")
        }}</span>
        <span class="wallet-history__status">{{ $t("common.status") }}</span>
        <span class="wallet-history__destination">{{
          $t("common.destination")
        }}</span>
        <span class="wallet-history__tx">tx</span>
      </div>
      <div class="wallet-history__content">
        <div
          v-for="tx in wallethistory"
          :key="tx.id + tx.created"
          class="wallet-history__items"
        >
          <div class="wallet-history__item wallet-history__date">
            <span class="thead">{{ $t("common.date") }}</span>
            {{ getprettyDate(tx.updated) }}
          </div>
          <div
            class="wallet-history__item wallet-history__operation"
            :class="{
              itemStatusUp: tx.operation_type === 1 || tx.operation_type === 3,
              itemStatusDown: tx.operation_type === 2,
            }"
          >
            <span class="thead">{{ $t("common.operation") }}</span>
            {{ getWalletHistoryStatusOperation("operation", tx) }}
          </div>
          <div class="wallet-history__item wallet-history__amount">
            <span v-if="tx.blockchain_currency">
              {{ tx.blockchain_currency }}
            </span>
            <span v-else>
              {{ tx.currency }}
            </span>
          </div>
          <div class="wallet-history__item wallet-history__amount">
            <span class="thead">{{ $t("common.amountTableHeader") }}</span>
            {{
              addSpaceFixDecimal(tx.amount, coins[tx.currency].decimals)
            }}&nbsp;&nbsp;{{ tx.currency }}
          </div>
          <div
            v-if="
              tx.state === 0 ||
              tx.state === 1 ||
              tx.state === 6 ||
              tx.state === 8 ||
              tx.operation_type === 4
            "
            class="wallet-history__item wallet-history__status itemStatusYellow"
          >
            <span class="thead">{{ $t("common.status") }}</span>
            {{ getWalletHistoryStatusOperation("status", tx) }}
          </div>
          <div
            v-else-if="
              tx.state === 3 ||
              tx.state === 4 ||
              tx.state === 5 ||
              tx.state === 7 ||
              tx.operation_type === 6
            "
            class="wallet-history__item wallet-history__status itemStatusDown"
          >
            <span class="thead">{{ $t("common.status") }}</span>
            {{ getWalletHistoryStatusOperation("status", tx) }}
          </div>
          <div
            v-else
            class="wallet-history__item wallet-history__status itemStatusUp"
          >
            <span class="thead">{{ $t("common.status") }}</span>
            {{ getWalletHistoryStatusOperation("status", tx) }}
          </div>
          <div
            class="wallet-history__item wallet-history__destination"
            :title="getWalletHistoryDestination(tx)"
          >
            <span class="thead">Destination</span>
            {{ prettifyDestination(getWalletHistoryDestination(tx), 13) }}
          </div>
          <div
            v-if="!isCurFiat(tx.currency)"
            class="wallet-history__item wallet-history__tx"
          >
            <span class="thead">TX</span>
            <button v-if="tx.tx_hash" @click="goToExplorerLink(tx)">
              Info
            </button>
          </div>
          <div
            v-if="isCurFiat(tx.currency)"
            class="wallet-history__item wallet-history__tx"
          >
            <span class="thead">TX</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="not-information" style="padding: 10px">
        <div class="icon smile">
          <svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            style="width: 60px; height: 60px"
          >
            <path
              class="smile-st0"
              d="M44.5 43.2C40.6 38.6 36 36 30 36s-10.6 2.6-14.5 7.2c-.5.6-.4 1.5.2 2 .3.2.6.3.9.3.4 0 .8-.2 1.1-.5 3.3-3.9 7.2-6.2 12.3-6.2 5.1 0 9 2.3 12.3 6.2.3.3.7.5 1.1.5.3 0 .7-.1.9-.3.6-.5.7-1.4.2-2z"
            />
            <path
              class="smile-st1"
              d="M30 60C13.4 60 0 46.6 0 30S13.4 0 30 0s30 13.4 30 30-13.4 30-30 30zm0-56C15.6 4 4 15.6 4 30s11.6 26 26 26 26-11.6 26-26S44.4 4 30 4z"
            />
            <path
              class="smile-st1"
              d="M18.5 15c4.1 0 7.5 3.4 7.5 7.5S22.6 30 18.5 30 11 26.6 11 22.5s3.4-7.5 7.5-7.5z"
            />
            <path
              class="smile-st3"
              d="M18.5 18c2.5 0 4.5 2 4.5 4.5S21 27 18.5 27 14 25 14 22.5s2-4.5 4.5-4.5z"
            />
            <path
              class="smile-st1"
              d="M18.5 20c1.4 0 2.5 1.1 2.5 2.5S19.9 25 18.5 25 16 23.9 16 22.5s1.1-2.5 2.5-2.5zm-5.2-4.4l4.2-4.2c.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.2 4.2c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.6 0-2.1zm28.2-.6c4.1 0 7.5 3.4 7.5 7.5S45.6 30 41.5 30 34 26.6 34 22.5s3.4-7.5 7.5-7.5z"
            />
            <path
              class="smile-st3"
              d="M41.5 18c2.5 0 4.5 2 4.5 4.5S44 27 41.5 27 37 25 37 22.5s2-4.5 4.5-4.5z"
            />
            <path
              class="smile-st1"
              d="M41.5 20c1.4 0 2.5 1.1 2.5 2.5S42.9 25 41.5 25 39 23.9 39 22.5s1.1-2.5 2.5-2.5zm5.2-4.4l-4.2-4.2c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l4.2 4.2c.6.6 1.5.6 2.1 0 .6-.6.6-1.6 0-2.1z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div v-show="pageCount && pageCount > 1" class="paginator-div">
      <paginate
        v-model="currentPage"
        :page-range="5"
        :margin-pages="0"
        :page-count="pageCount * 1"
        :click-handler="handlePagination"
        :prev-text="'❮'"
        :next-text="'❯'"
        :container-class="`pagination pagination-custom ${
          pageCount > 5 ? 'over-pages' : ''
        }`"
        :page-class="'page-item page-item-custom noselect'"
        :prev-class="'page-item page-item-custom-prev noselect'"
        :next-class="'page-item page-item-custom-prev noselect'"
        :break-view-class="'page-item page-item-custom-break'"
        :break-view-text="''"
      >
      </paginate>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Paginate from "vuejs-paginate-next";
import getRegularNumber from "~/mixins/getRegularNumber";
import { truncateCenter } from "~/utilities/helpers";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletHistory",
  components: { Paginate },
  mixins: [getRegularNumber, getFixedDecimal],
  props: {
    curPage: {
      type: Number,
      default: 0,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    handlePagination: {
      type: Object,
      default: null,
    },
    updateTable: {
      type: Object,
      default: null,
    },
    wallethistory: {
      type: Object,
      default: null,
    },
  },
  emits: ["page-change"],
  data() {
    return {
      resendLoader: {},
      cancelLoader: {},
      paygateMethod: ["Visa", "Mastercard", "Qiwi", "Account"],
    };
  },
  computed: {
    ...mapGetters({ coins: "core/coins", coinsCommons: "core/coinsCommons" }),
    txHasActionColumn() {
      return this.wallethistory.find((tx) => {
        return tx.state === 6;
      });
    },
    currentPage: {
      get() {
        return this.curPage;
      },
      set(val) {
        this.$emit("page-change", val);
      },
    },
  },
  methods: {
    getprettyDate(ptime) {
      const a = new Date();
      a.setTime(parseInt(ptime));
      return a.toLocaleString("ru-RU");
    },
    prettifyDestination(string = "", maxLength) {
      return truncateCenter(string, maxLength);
    },

    resendLetter(tx) {
      let config = {};
      let path = "";
      this.setLoaderState("resendLoader", tx.id, 1);

      if (tx.is_p2p_code) {
        config["confirm_token"] = tx.confirmation_token;
        path = "sendfunds/resend-confirmation/";
      } else {
        config["confirmation_token"] = tx.confirmation_token;
        path = "withdrawal/resend-withdrawal-request";
      }

      this.$http.post(path, config).then(
        () => {
          this.$notify({
            type: "success",
            text: this.$t("common.resented"),
          });
          this.setLoaderState("resendLoader", tx.id, 2);
          this.dropLoader("resendLoader", tx.id);
        },
        (e) => {
          this.$notify({
            type: "error",
            text: e.body.detail || e.statusText,
          });
          this.setLoaderState("resendLoader", tx.id, 2);
          this.dropLoader("resendLoader", tx.id);
        }
      );
    },
    dropLoader(loaderName, id, delay = 1500) {
      const self = this;
      setTimeout(() => {
        self.$delete(this[loaderName], id);
      }, delay);
    },
    setLoaderState(loaderName, id, state) {
      this[loaderName][id] = state;
    },
    cancelWithdraw(tx) {
      let config = {};
      let path = "";

      this.setLoaderState("cancelLoader", tx.id, 1);

      if (tx.is_p2p_code) {
        config["confirm_token"] = tx.confirmation_token;
        path = "sendfunds/cancel/";
      } else {
        config["confirmation_token"] = tx.confirmation_token;
        path = "withdrawal/cancel-withdrawal-request";
      }

      this.$http.post(path, config).then(
        () => {
          this.updateTable();

          this.$notify({
            type: "success",
            text: this.$t("common.cancelw"),
          });

          this.setLoaderState("cancelLoader", tx.id, 2);
          this.dropLoader("cancelLoader", tx.id);
        },
        (e) => {
          this.$notify({
            type: "error",
            text: e.body.detail || e.statusText,
          });

          this.setLoaderState("cancelLoader", tx.id, 2);
          this.dropLoader("cancelLoader", tx.id);
        }
      );
    },
    isCurFiat(cur) {
      return cur === "USD" || cur === "RUB" || cur === "EUR";
    },
    goToExplorerLink(data) {
      let path =
        this.coinsCommons.tokenTxExplorers[data.blockchain_currency] ||
        this.coins[data.currency].tx_explorer;

      path = path.replace("{locale}", this.$locale);
      if (path) {
        window.open(path + data.tx_hash, "_blank");
      }
    },
    getWalletHistoryStatusOperation(column, data) {
      if (column === "operation") {
        if (data.is_p2p_code && data.operation_type < 4) {
          return "Exchange-CODE";
        } else {
          const operationMessages = {
            1: this.$t("common.deposit_low"),
            2: this.$t("common.withdrawal"),
            3: this.$t("common.merchant"),
            4: data.is_p2p_code
              ? this.$t("common.codeRevert")
              : this.$t("common.orderRevert"),
            5: data.is_p2p_code
              ? this.$t("common.codeRevert")
              : this.$t("common.orderRevert"),
            6: data.is_p2p_code
              ? this.$t("common.codeRevert")
              : this.$t("common.orderRevert"),
            7: this.$t("common.stake"),
            8: this.$t("common.unstake"),
            9: this.$t("common.lock"),
            10: this.$t("common.unlock"),
            11: this.$t("common.stake_reward"),
            12: this.$t("common.p2p_exchange_lock"),
            13: this.$t("common.p2p_exchange_unlock"),
            14: this.$t("common.p2p_offer_cancel"),
          };
          return operationMessages[data.operation_type];
        }
      }
      if (column === "status") {
        const statusMessages = {
          0: this.$t("common.pending"),
          1: this.$t("common.to_be_sent"),
          2: this.$t("common.done"),
          3: this.$t("common.cancelled_1"),
          4: this.$t("common.failed"),
          5: this.$t("common.unknown"),
          6: this.$t("common.wait_confirmation"),
          7: this.$t("common.revert"),
          8: this.$t("common.verifying"),
        };
        return statusMessages[data.state];
      }
    },
    getWalletHistoryDestination(data) {
      const PAYGATE_METHOD_REF_BONUS = 4;
      let destination = "";

      if (data.paygate_method === PAYGATE_METHOD_REF_BONUS) {
        destination = "Referral bonus";
      } else if (data.is_p2p_code) {
        destination = "";
      } else {
        destination = data.address;
      }

      return destination;
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet__title {
  margin-bottom: 20px;
}
.wallet-history__header {
  background: #f5f5f5;
  font-weight: 600;
  font-family: "Open Sans";
  font-size: 14px !important;
}
.wallethistory {
  width: 100%;
  display: flex;
  flex-direction: column;
  max-height: initial;
  height: calc(100% - 65px);
  margin-bottom: 50px;

  .table-responsive {
    flex-grow: 1;
  }
}

.wallet-history__items {
  border-top: 1px solid #f0f1f5;
}
.paginator-div {
  position: static;
}

.action-button-cell {
  min-width: 77px;
  padding: 0 3px;

  .btn {
    min-width: 32px;
  }
}

.walletTable__item:not(.walletTable__column_data) {
  @media screen and (max-width: 900px) {
    padding-left: 5px;
  }
}

.walletTable__column_data {
  white-space: nowrap;
}

.wallet-history {
  margin-bottom: 1em;
  flex-basis: 100%;

  &__header {
    padding: 0 27px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-size: 12px;

    @media screen and (max-width: 900px) {
      display: none;
    }

    span {
      padding: 10px 5px;
    }
  }

  &__date {
    width: 15%;
  }

  &__operation {
    width: 15%;
  }

  &__blockchain {
    width: 15%;
  }

  &__amount {
    width: 15%;
  }

  &__status {
    width: 15%;
  }

  &__destination {
    width: 18%;
  }

  &__tx {
    width: 10%;

    button {
      color: #5759e6;
      font-size: 13px;
      text-decoration: underline;
    }
  }

  &__content {
    font-size: 12px;
  }

  &__items {
    min-height: 40px;
    padding: 0 27px;
    display: flex;
    width: 100%;

    @media screen and (max-width: 900px) {
      flex-direction: column;
    }
  }

  &__item {
    padding: 5px;
    display: flex;
    align-items: center;

    @media screen and (max-width: 900px) {
      width: 100% !important;
      display: flex;
      justify-content: space-between;
    }
  }
}

.thead {
  display: none;

  @media screen and (max-width: 900px) {
    display: block;
  }
}

.hidden {
  width: 32%;
  display: flex;

  @media screen and (max-width: 900px) {
    width: 100%;
    flex-direction: column;
  }

  .wallet-history__destination {
    width: 71%;
  }

  .wallet-history__tx {
    width: 29%;
  }
}

.expandData {
  display: flex;
  justify-content: center;
  padding: 0.5em;
  background: #f8f9fa;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #007bff;

  .fa {
    transition: all 0.3s ease-in-out;
  }

  &--expanded {
    .fa {
      transform: rotate(45deg);
    }
  }
}
.wallet-history__wrapper {
  position: relative;
}
.wallet-history__refresh {
  position: absolute;
  top: -40px;
  right: 0;
}
</style>

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
        <span class="wallet-history__actions"></span>
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
            {{ getRegularNumber(tx.amount) }}&nbsp;&nbsp;{{ tx.currency }}
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
          <div class="wallet-history__item wallet-history__actions">
            <button
              v-if="tx.state === 6"
              class="btn btn-sm btn-link"
              :title="$t('common.resend_letter_code')"
              @click="resendLetter(tx)"
            >
              <img
                v-if="!resendLoader[tx.id]"
                class="inline-block"
                src="/public/img/envelope.svg"
                width="20"
                alt=""
              />
              <img
                v-if="resendLoader[tx.id] === 2"
                class="inline-block"
                src="/public/img/launchpad/icons/check.svg"
                width="20"
                alt=""
              />
              <img
                v-if="resendLoader[tx.id] === 1"
                class="inline-block"
                src="/public/img/spinner.svg"
                width="20"
              />
            </button>
            <button
              v-if="tx.state === 6"
              class="btn btn-sm btn-link text-danger"
              :title="$t('common.cancel')"
              @click="cancelWithdraw(tx)"
            >
              <img
                v-if="!cancelLoader[tx.id]"
                class="inline-block"
                src="/public/img/times_r.svg"
                width="20"
                alt=""
              />
              <img
                v-if="cancelLoader[tx.id] === 2"
                class="inline-block"
                src="/public/img/launchpad/icons/check.svg"
                width="20"
                alt=""
              />
              <img
                v-if="cancelLoader[tx.id] === 1"
                class="inline-block"
                src="/public/img/spinner.svg"
                width="20"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="not-information" style="padding: 10px">
        <div class="icon smile"><img src="/public/img/Smile.svg" alt="" /></div>
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

export default {
  name: "WalletHistory",
  components: { Paginate },
  mixins: [getRegularNumber],
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
    width: 12%;
  }

  &__blockchain {
    width: 12%;
  }

  &__amount {
    width: 12%;
  }

  &__status {
    width: 14%;
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

  &__actions {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 900px) {
      justify-content: center !important;
      padding-bottom: 10px;
    }

    .btn {
      width: 20px;
      height: 20px;
      padding: 0;
      font-size: 1em;
      margin: 0;
    }

    .btn:not(:last-child) {
      margin-right: 10px;
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

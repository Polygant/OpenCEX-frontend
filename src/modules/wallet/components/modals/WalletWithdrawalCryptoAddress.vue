<template>
  <div role="document">
    <div>
      <template v-if="payout_form_view === 'pending'">
        <div
          v-if="currentBlockchainList && currentBlockchainList.length > 1"
          class="formField"
        >
          <label>{{ $t("common.blockchain_currency") }}</label>
          <select-advanced
            :items="blockChains"
            :image="false"
            :all-coins="coins"
            @select="blockchainChoose"
          />
        </div>
        <div class="formField">
          <label>{{ $t("common.lost_balance") }}</label>
          <div class="formField__readonly">{{ toFxd(coin["actual"], 8) }}</div>
        </div>

        <div class="formField">
          <label>{{ $t("common.balanceafterwithdrawal") }}</label>
          <div class="formField__readonly">
            {{
              toFxd(coin["actual"] - (parseFloat(amountToPayMe) || 0), 8) < 0
                ? 0
                : toFxd(coin["actual"] - (parseFloat(amountToPayMe) || 0), 8)
            }}
          </div>
        </div>

        <form @submit.prevent="payMe">
          <div class="formField">
            <label>{{ $t("common.amount_sum") }}</label>
            <div class="stake-field_input_w">
              <input
                v-model="amountToPayMe"
                v-numeric.number.decimal.fractional
                fractional="8"
                class="formField__input"
                type="text"
                maxlength="16"
                autocomplete="off"
                name="amountToPayMe"
                @input="changeAmount('amountToPayMe')"
              />
              <div class="stake-field_input-max" @click="setMax">
                <span>max</span>
              </div>
            </div>
          </div>
          <div class="formField">
            <label>{{ $t("common.addressto") }}</label>
            <input
              v-model="addrToPayMe"
              v-pattern="/^[a-zA-Z_0-9\-]*$/"
              class="formField__input"
              :class="{ 'not-empty': addrToPayMe.length }"
              type="text"
              placeholder=""
              autocomplete="off"
              @focus="addressInputFocused = true"
              @blur="addressInputFocused = false"
              @change="validateXrpAddr"
            />
          </div>
          <div
            v-if="lastaddressesexists"
            style="
              text-align: center;
              margin: 20px auto 0px auto;
              padding: 5px;
              border-radius: 5px;
              color: #2a3040;
            "
          >
            <p class="title">{{ $t("common.lastaddresses") }}</p>
            <button
              v-for="address in lastWithdrawalAdresses[ticker]"
              :key="address"
              type="button"
              class="width-button-link"
              style="
                font-size: 11px;
                margin: 0px auto;
                color: #6868f1;
                text-decoration: underline;
                display: block;
              "
              @click="setAddress(address)"
            >
              {{ address }}
            </button>
          </div>

          <p v-if="['XRP', 'EOS'].includes(ticker)" class="title mt-2">
            {{ $t("common." + ticker + ".addressTag") }}
          </p>
          <input
            v-if="['XRP', 'EOS'].includes(ticker)"
            v-model="destinationTag"
            class="form-control"
            type="text"
            autocomplete="off"
            name="destinationTag"
            style="
              color: lightslategrey;
              font-weight: 400;
              height: 42px;
              font-size: 11px;
            "
          />
          <p
            v-if="['USDT', 'BNB', 'MMETA'].includes(ticker)"
            style="font-size: 12px; text-align: center; margin-top: 10px"
          >
            <span class="text-danger">{{
              $t(`common.${currentWithdrawText}`)
            }}</span>
          </p>

          <div class="withdrawal__minMax">
            <div class="withdrawal__minMax-blockLeft">
              <img src="/public/img/minmax.svg" width="30" height="30" />
            </div>
            <div class="withdrawal__minMax-blockCenter">
              {{ $t("common.minamount") }}: <br />
              <strong
                >{{ addSpace(coin.limits.withdrawal.min) }} {{ ticker }}</strong
              >
              <br />
              <br />
              {{ $t("common.second_table_withdraw_fee") }}: <br />
              <strong v-if="selectedBlockchainCurrencyWithdrawal"
                >{{
                  toFxd(
                    getRegularNumber(selectedBlockchainCurrencyWithdrawal),
                    8
                  )
                }}
                {{ ticker }}
              </strong>
            </div>
            <div class="withdrawal__minMax-blockRight">
              {{ $t("common.maxamount") }}: <br />
              <strong
                >{{ addSpace(coin.limits.withdrawal.max) }} {{ ticker }}</strong
              >
            </div>
          </div>

          <div class="receivedBlock">
            <label>{{ $t("common.amounttowww") }}</label>
            <div>
              {{
                parseFloat(toFxd(getRegularNumber(finalAmount), 8)) < 0
                  ? 0
                  : addSpaceFixDecimal(finalAmount)
              }}
            </div>
          </div>
          <div class="withdrawal__btnWrapper">
            <button
              type="submit"
              :disabled="
                !addrToPayMe.length ||
                !amountToPayMe ||
                coin.disable_withdrawals
              "
              class="withdrawal__btn"
            >
              {{ $t("common.withdrawal") }}
              <div class="withdrawal__btnIcon"></div>
            </button>
          </div>
          <p v-if="coin.disable_withdrawals" class="text-center text-danger">
            {{ $t("common.withdrawals_disabled") }}
          </p>
          <p
            style="
              text-align: center;
              color: #777777;
              font-size: 14px;
              margin-bottom: 3px;
              font-weight: 600;
              text-transform: uppercase;
            "
            class="text-danger"
          >
            {{ $t("common.h24") }}
          </p>
        </form>
      </template>
      <!--SUCCESS-->
      <template v-if="payout_form_view === 'success'">
        <div class="text-center">
          <img
            class="inline-block"
            src="/public/img/check-circle.svg"
            width="20"
            alt=""
          />
        </div>
        <h3 style="text-align: center">{{ $t("common.success") }}</h3>
        <br />
        <p style="text-align: center; font-weight: 600">
          {{ $t("common.withdrawalprocessing") }}
        </p>
        <br />
        <div class="withdrawal__btnWrapper">
          <div class="big_btn" @click="$router.go()">
            {{ $t("common.continue") }}
          </div>
        </div>
      </template>
      <!--SUCCESS-->
      <template v-if="payout_form_view === 'confirm_by_email'">
        <form @submit.prevent="sendConfirmationCode">
          <div class="formField">
            <label>{{ $t("common.email_sent") }}</label>
            <input
              v-model="confirmationCode"
              required
              class="formField__input"
              type="text"
            />
          </div>
          <div v-if="confirmEmailTimer > 0" class="logIn__descr mb-4">
            <strong>{{ $t("common.getCode") }}</strong>
            {{ $t("common.againAfter", { n: confirmEmailTimer }) }}
          </div>
          <button
            v-else
            class="withdrawal__btn withdrawal__btn_yellow mx-auto mb-4 w-[292px]"
            type="button"
            @click="resendCode"
          >
            {{ $t("common.resend") }}
          </button>

          <button class="withdrawal__btn mx-auto mb-4 w-[292px]" type="submit">
            {{ $t("common.confirm") }}
          </button>

          <button
            class="withdrawal__btn withdrawal__btn_red w-[292px] mx-auto mb-4"
            type="button"
            @click="cancelWithdrawal"
          >
            {{ $t("common.cancel_withdrawal") }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import errorManager from "~/helpers/errorHundle";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import accountSettingMixin from "~/modules/account/components/mixin";
import SelectAdvanced from "~/components/ui/SelectAdvanced.vue";
import getRegularNumber from "~/mixins/getRegularNumber";

export default {
  name: "WalletWithdrawalCryptoAddress",
  components: {
    SelectAdvanced,
  },
  mixins: [getFixedDecimal, accountSettingMixin, getRegularNumber],
  props: {
    ticker: {
      type: String,
      require: true,
      default: "",
    },
  },
  emits: ["close"],
  data() {
    return {
      confirmationCode: "",
      confirmEmailTimer: 0,
      lastWithdrawalAdresses: {},
      destinationTag: "",
      addrToPayMe: "",
      amountToPayMe: "",
      payout_form_view: "pending",
      addressInputFocused: false,
      sms_code: null,
      blockchainCurrency: null,
    };
  },
  computed: {
    ...mapGetters({ balance: "core/balance", coins: "core/coins" }),
    blockChains() {
      let blockChainsObj = {};
      this.currentBlockchainList.map((item) => {
        blockChainsObj[item] = {
          id: item,
        };
      });
      return blockChainsObj;
    },
    currentBlockchainList() {
      return this.coin.blockchain_list;
    },
    currentWithdrawText() {
      switch (
        ["BNB"].includes(this.ticker) ? this.ticker : this.blockchainCurrency
      ) {
        case "ETH":
          return "sendOnlyErc20";
        case "BNB":
          return "sendOnlyBep20";
        case "MMETA":
          return "sendOnlyBep20";
        case "BSC":
          return "sendOnlyBep20";
        case "TRX":
          return "sendOnlyTrc20";
        default:
          return "sendOnlyErc20";
      }
    },
    lastaddressesexists() {
      if (this.lastWithdrawalAdresses[this.ticker]) {
        return this.lastWithdrawalAdresses[this.ticker].length > 0;
      }

      return false;
    },
    coin() {
      return this.coins[this.ticker];
    },
    finalAmount() {
      if (this.amountToPayMe >= this.coin.limits.withdrawal.min) {
        return this.amountToPayMe - this.selectedBlockchainCurrencyWithdrawal;
      }
      return 0.0;
    },
    selectedBlockchainCurrencyWithdrawal() {
      let blockchainCurrenciesArray = Object.values(
        this.coin.fee.withdrawal.address
      );
      if (blockchainCurrenciesArray.length > 1) {
        return this.coin.fee.withdrawal.address[`${this.blockchainCurrency}`];
      }
      if (blockchainCurrenciesArray.length === 1) {
        return (
          this.coin.fee.withdrawal.address[`${this.ticker}`] ||
          this.coin.fee.withdrawal.address[`${this.blockchainCurrency}`]
        );
      }
      return 0;
    },
  },
  mounted() {
    this.getLastCryptoAdresses();

    if (this.currentBlockchainList && this.currentBlockchainList.length) {
      this.blockchainCurrency = this.currentBlockchainList[0];
    }
  },
  methods: {
    cancelWithdrawal() {
      this.$http
        .post("withdrawal/cancel-withdrawal-request", {
          withdrawal_request_id: this.requestId,
        })
        .then(() => {
          this.payout_form_view = "pending";
        });
    },

    sendConfirmationCode() {
      this.$http
        .post("withdrawal/confirm-withdrawal-request", {
          confirmation_token: this.confirmationCode,
        })
        .then(() => {
          this.payout_form_view = "success";
        })
        .catch(() => {
          this.$notify({
            type: "error",
            title: "",
            text: this.$t("common.invalid_code"),
          });
        });
    },

    runConfirmEmailTimer() {
      if (this.confirmEmailTimer > 0) return;

      this.confirmEmailTimer = 180;

      const interval = setInterval(() => {
        this.confirmEmailTimer--;
        if (this.confirmEmailTimer < 0) {
          clearInterval(interval);
        }
      }, 1000);
    },

    resendCode() {
      this.$http
        .post("withdrawal/resend-withdrawal-request", {
          withdrawal_request_id: this.requestId,
        })
        .then(() => {
          this.runConfirmEmailTimer();
        });
    },

    setMax() {
      this.amountToPayMe = this.balance[this.ticker].actual;
    },
    blockchainChoose(val) {
      this.blockchainCurrency = val;
    },
    toFxd(value, decimals) {
      return value ? parseFloat(value).toFixed(decimals) : 0;
    },
    setErrorMessage(errorMsg) {
      if (errorMsg) {
        this.$notify({
          title: this.$t("common.error"),
          type: "error",
          text: `${errorMsg}`,
        });
      }
    },
    validateXrpAddr() {
      if (
        ["XRP", "EOS"].includes(this.ticker) &&
        this.localConfig[this.ticker.toLowerCase() + "_wallet"] ===
          this.addrToPayMe
      ) {
        this.addrToPayMe = "";
      }
    },
    setAddress(addr) {
      this.addrToPayMe = addr;
    },
    payMe() {
      let self = this;

      if (
        this.amountToPayMe &&
        !isNaN(this.amountToPayMe) &&
        this.getFixedDecimal(this.amountToPayMe) > 0
      ) {
        this.setErrorMessage("");
        let data = {
          amount: this.getFixedDecimal(this.amountToPayMe),
          currency: this.ticker,
          destination: this.addrToPayMe,
        };

        if (this.blockchainCurrency) {
          data.blockchain_currency = this.blockchainCurrency;
        }

        if (this.ticker === "XRP") {
          data["data"] = {
            destination_tag: parseInt(this.destinationTag),
          };
        }
        if (this.ticker === "EOS") {
          data["data"] = {
            memo: this.destinationTag,
          };
        }
        if (this.sms_code) {
          data["sms_code"] = this.sms_code;
        }
        this.$http.post("wallet_withdrawal/", data).then(
          (response) => {
            this.amountToPayMe = "";
            this.addrToPayMe = "";
            setTimeout(function () {
              self.$modal.close();
            }, 3500);
            this.payout_form_view = "confirm_by_email";
            this.confirmationCode = "";
            this.runConfirmEmailTimer();
            this.requestId = response.data.id;
          },
          (err) => {
            errorManager.parse(err, this, [
              "bad_min_amount",
              "bad_max_amount",
              "not_enough_funds",
              "invalid_address",
              "currency_not_found",
              "wrong_data",
              "payouts_freezed",
              "out_of_limit",
            ]);
          }
        );
      } else {
        this.setErrorMessage(this.$t("common.enter_valid_sum"));
      }
    },
    getLastCryptoAdresses() {
      this.$http.get("getlastaddresses/").then(
        (response) => {
          for (let x in response.data) {
            this.lastWithdrawalAdresses[response.data[x]["currency"]] =
              response.data[x]["addresses"];
          }
        },
        (err) => {
          console.error(err.data);
        }
      );
    },
    verifiedPhone(code) {
      this.sms_code = code;
      this.payout_form_view = "pending";
      this.payMe();
    },
    changeAmount(item) {
      this[item] = this[item].replace(/,/g, ".");
    },
  },
};
</script>
<style lang="scss" scoped>
input.address {
  font-size: 11px;
  opacity: 0.8;

  &.not-empty {
    font-size: 14px;
    opacity: 1;
  }
}
.wallet-modal .modal-content {
  border: none;
  background: none;
}
.withdrawal__minMax {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
  font-family: "Open Sans";
}
.withdrawal__minMax strong,
.withdrawal__minMax b {
  font-weight: bold;
}
.withdrawal__minMax-blockLeft {
  width: 60px;
  padding-top: 9px;
}
.withdrawal__minMax-blockCenter {
  width: 180px;
  text-align: left;
}
.withdrawal__minMax-blockRight {
  width: 130px;
  text-align: left;
}
.receivedBlock {
  font-family: "Open Sans";
  text-align: center;
  label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.05em;
    color: #1f2021;
  }
  div {
    font-style: normal;
    font-weight: 700;
    font-size: 25px;
    line-height: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #343535;
  }
}
.withdrawal__btnWrapper {
  display: flex;
  justify-content: center;
  padding: 30px 0 20px;
}
.big_btn,
.withdrawal__btn {
  background: var(--theme-primary-color);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  height: 51px;
  font-family: "Open Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  padding: 0 50px;
}
.withdrawal__btn_red {
  background: #e34848;
}
.withdrawal__btn_yellow {
  background: #ffba38;
}

.withdrawal__btnIcon {
  background-color: #fff;
  mask: url("/public/img/withdrawal.svg") no-repeat center;
  width: 30px;
  height: 30px;
}
.stake-field_input_w {
  position: relative;
}
.stake-field_input-max {
  position: absolute;
  right: 8px;
  top: 20px;
  transform: translateY(-50%);
  background: #e7e9ee;
  border-radius: 5px;
  width: 45px;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 12px;
  line-height: 21px;
}
</style>

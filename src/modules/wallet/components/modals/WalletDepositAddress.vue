<template>
  <div class="wallet-modal deposit-address">
    <!-- SHOW -->
    <template v-if="checkingBlockchainCurrencyAddress">
      <div class="address__label">
        {{ $t("common.address") }}
      </div>
      <div style="min-width: 70%; position: relative; margin-bottom: 30px">
        <div
          v-if="['XRP', 'EOS'].includes(ticker)"
          style="width: 100%; padding-right: 42px"
        >
          <AddressTextField
            :address="
              coin.disable_topups
                ? $t('common.deposits_disabled')
                : coin.address.main_address
            "
          />
        </div>
        <div v-else style="width: 100%; padding-right: 42px">
          <AddressTextField
            :address="
              coin.disable_topups
                ? $t('common.deposits_disabled')
                : coin.address.address
            "
          />
        </div>
        <button
          v-if="['XRP', 'EOS'].includes(ticker)"
          class="btn address_btn"
          @click="copyToBuffer(coin.address.main_address)"
        >
          <img src="/public/img/copy.svg" width="12" height="12" />
        </button>
        <button
          v-else
          class="btn address_btn"
          @click="copyToBuffer(coin.address.address)"
        >
          <img src="/public/img/copy.svg" width="12" height="12" />
        </button>
      </div>
      <div v-if="['XRP', 'EOS'].includes(ticker)" class="address__label">
        {{ $t("common.addressTag") }}
      </div>
      <div
        v-if="['XRP', 'EOS'].includes(ticker)"
        style="min-width: 70%; position: relative; margin-bottom: 30px"
      >
        <div style="width: 100%">
          <AddressTextField :address="coin.address.address" />
        </div>
        <button
          class="btn address_btn"
          @click="copyToBuffer(coin.address.address)"
        >
          <img src="/public/img/copy.svg" width="12" height="12" />
        </button>
      </div>
      <div class="deposit__minMax">
        <div class="deposit__minMax-blockLeft">
          <img src="/public/img/minmax.svg" width="30" height="30" />
        </div>
        <div class="deposit__minMax-blockCenter">
          {{ $t("common.mindepositamount") }} <br />
          <strong class="font-weight-bold"
            >{{ addSpace(coin?.limits?.deposit.min) }} {{ ticker }}</strong
          >
        </div>
        <div class="deposit__minMax-blockRight">
          {{ $t("common.maxdepositamount") }} <br />
          <strong class="font-weight-bold"
            >{{ addSpace(coin?.limits?.deposit.max) }} {{ ticker }}</strong
          >
        </div>
      </div>
      <div class="pb-4 flex justify-center">
        <img src="/public/img/minmax.svg" class="mr-8" width="30" height="30" />
        <div class="text-left">
          {{ $t("common.second_table_deposit_fee") }} <br />
          <strong class="font-weight-bold">
            {{ toFxd(getRegularNumber(coin?.fee?.deposit?.address), 8) }}
            {{ ticker }}
          </strong>
        </div>
      </div>
      <p
        class="text-danger mb-3 px-4 block font-weight-bold"
        style="text-transform: uppercase; font-size: 16px"
      >
        {{ $t("common.mindepositalert") }}
        <span v-if="['ETH', 'USDT'].includes(ticker)">
          {{ $t("wallet.contract_funds_are_ignored") }}
        </span>
      </p>
      <p v-if="['BNB'].includes(ticker)">
        <strong class="font-weight-bold" style="font-size: 16px">{{
          $t("wallet.binance_smart_chain_text")
        }}</strong>
      </p>
      <p v-if="['XRP', 'EOS'].includes(ticker)">
        <span class="text-danger" style="font-size: 16px">{{
          $t("wallet.dest_tag_required")
        }}</span>
      </p>
      <p
        v-if="coin?.blockchain_list?.length"
        style="width: 90%; margin: 0 auto; text-transform: uppercase"
      >
        <span class="text-danger" style="font-size: 16px">{{
          $t("common.depositOnly", {
            blockchain: coinsCommons.blockchainDefinitions[blockchain],
          })
        }}</span>
      </p>
      <div
        v-if="!coin.disable_topups"
        style="margin: 20px auto"
        class="text-center"
      >
        <img :src="qrCode" alt="" class="inline-block" />
      </div>
      <p
        class="title"
        style="color: #a5b3a7; font-size: 16px; text-transform: uppercase"
      >
        {{ $t("common.coinsafter1") }}
      </p>
    </template>
    <!-- SHOW END -->

    <!--CREATE-->
    <template v-else>
      <p style="text-align: center; font-size: 20px">
        {{ $t("common.createyournew") }} {{ ticker }} {{ $t("common.address") }}
      </p>
      <div class="blockchain-currency">
        <span
          >{{ $t("common.blockchain_currency") }} {{ blockchainCurrency }}</span
        >
      </div>
      <button
        class="btn btn-create"
        :class="{ 'fs-0': isLoading }"
        :style="mainColor ? `background: ${mainColor} !important` : {}"
        :disabled="isLoading"
        @click="createAddress(ticker)"
      >
        {{ $t("common.create") }}
        <span v-if="isLoading" class="loader"></span>
      </button>
    </template>
    <!--CREATE END-->
  </div>
</template>

<script>
import qrCode from "qrcode-generator";
import copyToBuffer from "~/mixins/copyToBuffer";
import { mapGetters } from "vuex";
import AddressTextField from "@/components/AddressTextField.vue";
import getRegularNumber from "~/mixins/getRegularNumber";
import getFixedDecimal from "~/mixins/getFixedDecimal";

export default {
  name: "WalletDepositAddress",
  components: { AddressTextField },
  mixins: [copyToBuffer, getRegularNumber, getFixedDecimal],
  props: {
    coin: {
      type: Object,
      default: () => {},
    },
    ticker: {
      type: String,
      default: "",
    },
    blockchain: {
      type: String,
      default: "",
    },
    title: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      qrCode: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({ coinsCommons: "core/coinsCommons" }),
    blockchainCurrency() {
      return this.blockchain;
    },
    currencyNewtwor() {
      if (this.blockchain === "ETH") {
        return this.$t("common.ethereum_network");
      }
      if (this.blockchain === "BNB") {
        return this.$t("common.binance_network");
      }
      if (this.blockchain === "TRX") {
        return this.$t("common.tron_network");
      }
      return "";
    },
    checkingBlockchainCurrencyAddress() {
      if (this.blockchain && this.coin.address) {
        return this.blockchain === this.coin.address.blockchain_currency;
      }
      return this.coin.address;
    },
  },
  watch: {
    coin(val) {
      this.makeQR(val.address.address);
    },
    deep: true,
  },
  mounted() {
    if (this.coin.address) {
      setTimeout(() => {
        this.makeQR(this.coin.address.address);
      }, 1000);
    }
  },
  methods: {
    toFxd(value, decimals) {
      return value ? parseFloat(value).toFixed(decimals) : 0;
    },
    createAddress(ticker) {
      let data = {
        currency: ticker,
      };

      if (this.blockchainCurrency) {
        data.blockchain_currency = this.blockchainCurrency;
      }

      this.isLoading = true;
      this.$http.post("create_new_wallet/", data).then(
        (response) => {
          this.isLoading = false;
          // eslint-disable-next-line vue/no-mutating-props
          this.coin["address"] = response.data[0];
          this.makeQR(this.coin.address.address);
        },
        () => {
          this.isLoading = false;
        }
      );
    },
    makeQR(value) {
      if (this.isBlockedByPhoneVerification) return;

      let typeNumber = 0;
      let errorCorrectionLevel = "L";
      let qr = qrCode(typeNumber, errorCorrectionLevel);

      qr.addData(value);
      qr.make();

      this.qrCode = qr.createDataURL(8, 6);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-create {
  position: relative;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  background: var(--theme-primary-color);
  border-radius: 4px;
  margin-top: 59px;
  height: 80px;
  width: 70%;
  color: white;
  margin-bottom: 30px;

  .loader {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
  }
}

.fs-0 {
  font-size: 0;
}

.deposit-address {
  border-left: none;
  margin-bottom: 0;
  text-align: center;
  width: 615px;

  @media screen and (max-width: 675px) {
    width: 100%;
  }

  p {
    text-align: center;
  }
}

.address-text-field {
  text-align: center;
  line-height: 22px;
  font-size: 12px;
  background: #e8f1fb;
  font-weight: bold;
  border-radius: 5px;
  height: 34px;
  display: block;
  width: 100%;
  padding: 7px 12px;
  padding-right: 41px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  @media all and (max-width: 475px) {
    font-size: 12px;
  }
}
.deposit__minMax {
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}
.deposit__minMax-blockLeft {
  width: 80px;
  padding-top: 9px;
  @media all and (max-width: 475px) {
    margin-left: 0;
  }
}
.deposit__minMax-blockCenter {
  width: 160px;
  text-align: left;
}
.deposit__minMax-blockRight {
  width: 160px;
  text-align: left;
}
.address__label {
  font-size: 14px;
  font-family: "Open Sans";
  font-weight: 400;
  margin-bottom: 0;
  text-align: left;
}
.address_btn {
  position: absolute;
  background: #f4f7f9;
  border-radius: 5px;
  height: 33px;
  width: 33px;
  color: #ffffff;
  top: 0;
  right: 0;
  padding-top: 2px;
  padding-left: 11px;
}
</style>

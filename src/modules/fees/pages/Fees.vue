<template>
  <div :class="contentClass">
    <div
      v-if="
        getFilteredCoins[Object.keys(getFilteredCoins)[0]]?.limits !== undefined
      "
      class="root-row"
    >
      <div class="w-full">
        <div class="plate">
          <h5 style="font-family: 'Open Sans', sans-serif">
            {{ $t("fees.first_table_header") }}
          </h5>
          <table
            class="walletTable walletTable--adaptive"
            style="margin-top: 30px"
          >
            <thead>
              <tr>
                <th class="walletTable__header walletTable__header_val">
                  {{ $t("fees.first_table_maker") }}
                </th>
                <th class="walletTable__header" style="width: 30%">
                  {{ $t("fees.first_table_taker") }}
                </th>
                <th class="walletTable__header" style="width: 31%">
                  {{ $t("fees.first_table_volume") }}
                </th>
              </tr>
            </thead>

            <tbody
              :style="
                borderColor
                  ? `border-top: 1px solid ${borderColor} !important`
                  : {}
              "
            >
              <tr v-for="item in tradingVolume" :key="item.id">
                <td
                  class="walletTable__item1 walletTable__item_val1"
                  :data-thead="$t('fees.first_table_maker')"
                >
                  {{ item.maker }} %
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.first_table_taker')"
                >
                  {{ item.taker }} %
                </td>
                <!-- eslint-disable vue/no-v-html -->
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.first_table_volume')"
                  v-html="item.volume"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="plate">
          <h5 style="font-family: 'Open Sans', sans-serif">
            {{ $t("fees.second_table_header") }}
          </h5>
          <table
            class="walletTable walletTable--adaptive"
            style="margin-top: 30px"
          >
            <thead>
              <tr>
                <th
                  class="walletTable__header walletTable__header_val"
                  style="width: 20% !important"
                >
                  {{ $t("fees.second_table_currency") }}
                </th>
                <th class="walletTable__header" style="width: 20%">
                  {{ $t("common.second_table_deposit_fee") }}
                </th>
                <th class="walletTable__header" style="width: 20%">
                  {{ $t("common.second_table_withdraw_fee") }}
                </th>
                <th class="walletTable__header" style="width: 20%">
                  {{ $t("fees.second_table_min_deposit") }}
                  <sup class="text-danger" style="font-size: 12px">*</sup>
                </th>
                <th class="walletTable__header" style="width: 20%">
                  {{ $t("fees.second_table_max_deposit") }}
                  <sup class="text-danger" style="font-size: 12px">*</sup>
                </th>
                <th class="walletTable__header" style="width: 20%">
                  {{ $t("fees.second_table_w_limits") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(coin, ticker) in getFilteredCoins"
                :key="ticker"
                class="walletTable__item_val1"
              >
                <td
                  class="walletTable__item1 walletTable__item_val1"
                  :data-thead="$t('fees.second_table_currency')"
                >
                  <img
                    :src="
                      coins[ticker].logo.length > 0
                        ? coins[ticker].logo
                        : `/public/img/common/svgcrypto/${ticker.toLowerCase()}.svg`
                    "
                    width="30"
                    class="inline-block mr-2"
                  />{{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.second_table_deposit_fee')"
                >
                  {{ addSpace(getStringOfFloat(coin.fee?.deposit?.address)) }}
                  {{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.second_table_withdraw_fee')"
                >
                  {{ formatingCommission(coin.fee?.withdrawal?.address) }}
                  {{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.second_table_min_deposit')"
                >
                  {{ addSpace(coin?.limits?.deposit.min) }} {{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.second_table_max_deposit')"
                >
                  {{ addSpace(coin?.limits?.deposit.max) }} {{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.second_table_w_limits')"
                >
                  {{ addSpace(coin?.limits?.withdrawal.min) }} -
                  {{ addSpace(coin?.limits?.withdrawal.max) }}
                  {{ ticker }}
                </td>
              </tr>
            </tbody>
          </table>
          <small class="text-danger mt-3 block font-weight-bold">
            * {{ $t("fees.mindepositalert") }}
          </small>
        </div>
        <div class="plate">
          <h5 style="font-family: 'Open Sans', sans-serif">
            {{ $t("fees.third_table_header") }}
          </h5>
          <table
            class="walletTable walletTable--adaptive"
            style="margin-top: 30px"
          >
            <thead>
              <tr>
                <th
                  class="walletTable__header walletTable__header_val"
                  style="width: 50%"
                >
                  {{ $t("fees.second_table_currency") }}
                </th>
                <th class="walletTable__header" style="width: 25%">
                  {{ $t("fees.third_table_min") }}
                </th>
                <th class="walletTable__header" style="width: 25%">
                  {{ $t("fees.third_table_1c") }}
                </th>
              </tr>
            </thead>

            <tbody
              :style="
                borderColor
                  ? `border-top: 1px solid ${borderColor} !important`
                  : {}
              "
            >
              <tr v-for="(coin, ticker) in getFilteredCoins" :key="ticker">
                <td
                  class="walletTable__item1 walletTable__item_val1"
                  :data-thead="$t('fees.second_table_currency')"
                >
                  <img
                    :src="
                      coins[ticker].logo.length > 0
                        ? coins[ticker].logo
                        : `/public/img/common/svgcrypto/${ticker.toLowerCase()}.svg`
                    "
                    width="30"
                    class="inline-block mr-2"
                  />{{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.third_table_min')"
                >
                  {{ coin?.limits?.order.min }}
                  {{ ticker }}
                </td>
                <td
                  class="walletTable__item1"
                  :data-thead="$t('fees.third_table_1c')"
                >
                  {{ addSpace(coin?.limits?.order.max) }} {{ ticker }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import getFixedDecimal from "~/mixins/getFixedDecimal";

import { TRADING_VOLUME } from "~/utilities/consts";

const CONTENT_CLASS = "fees_page container fees_page__cnt mx-auto";

export default {
  name: "FeesPage",
  metaInfo() {
    return {
      title: this.$t("pages.titles.fees"),
      meta: [{ name: "description", content: this.$t("fees.fees") }],
    };
  },
  mixins: [getFixedDecimal],
  data() {
    return {
      contentClass: CONTENT_CLASS,
      tradingVolume: TRADING_VOLUME,
    };
  },
  computed: {
    getFilteredCoins() {
      return Object.fromEntries(
        Object.entries(this.coins).filter(([, coin]) => !coin.disable_all)
      );
    },
    ...mapGetters({ coins: "core/coins", profile: "core/profile" }),
  },
  methods: {
    getStringOfFloat(number) {
      const notation = number.toExponential();
      const [base, exp] = notation.split("e-");
      return number.toFixed(Math.max(base.length - 1, exp));
    },
    formatingCommission(address) {
      let res = "0";
      const newArray = Object.values(address);
      if (newArray.length > 1) {
        res = `${Math.min(...newArray)} - ${Math.max(...newArray)}`;
      }
      if (newArray.length === 1) {
        res = parseFloat(`${newArray[0]}`);
        res = this.getStringOfFloat(res);
      }
      return res;
    },
  },
};
</script>

<style scoped lang="scss">
.root-row {
  margin-bottom: 20px;
  margin-top: 20px;

  > .col-12 {
    padding: 0 0.5rem;
  }
}

.walletTable {
  .walletTable__header {
    white-space: unset;
  }

  & > tbody > tr > td img {
    margin-right: 13px;
  }
}
@media screen and (max-width: 600px) {
  .walletTable > tbody > tr > td {
    height: 32px;
    padding: 0;
    line-height: 32px;

    img {
      height: 20px;
      margin-right: 8px;
      width: 20px;
    }
  }
}
.fees_page__cnt {
  max-width: 1250px;
}
</style>

<template>
  <div class="balancelist">
    <div class="wallet__title wallet__title--left">
      <span>{{ $t("common.wallet") }}</span>
      <router-link to="/wallet" class="link">
        <button
          class="btn exchange__top-up-button"
          :style="mainColor ? `background: ${mainColor} !important` : {}"
        >
          {{ $t("common.topupCapitalize") }}
        </button>
      </router-link>
    </div>
    <div class="wallet-list">
      <div id="walletTabsContent" class="tab-content">
        <div
          id="my-wallets"
          class="tab-pane fade show active"
          role="tabpanel"
          aria-labelledby="my-wallets-tab"
        >
          <div class="tab-pane__row">
            <div
              class="table-responsive sell-orders wallet-table"
              style="max-height: initial"
            >
              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <td>
                      <div class="sell-orders__td"></div>
                    </td>
                    <td>
                      <div class="sell-orders__td">
                        <b>{{ $t("common.currency") }}</b>
                      </div>
                    </td>
                    <td>
                      <div class="sell-orders__td">
                        <b>{{ $t("quickBuy.availablebalance") }}</b>
                      </div>
                    </td>
                    <td>
                      <div class="sell-orders__td"></div>
                    </td>
                  </tr>
                </thead>
                <tbody v-if="sortedCoins.length">
                  <tr v-for="ticker in sortedCoins" :key="'coin-' + ticker">
                    <td>
                      <div class="wallet-table__td">
                        <img
                          :src="
                            '/public/img/common/svgcrypto/' +
                            ticker.toLowerCase().trim() +
                            '.svg'
                          "
                          :alt="ticker"
                        />
                      </div>
                    </td>
                    <td>
                      <div class="wallet-table__td wallet-table__td-name">
                        {{ ticker }}
                      </div>
                    </td>
                    <td>
                      <div class="wallet-table__td">
                        {{ getCoolBalance(ticker) }}
                      </div>
                    </td>
                    <td>
                      <div class="wallet-table__td">
                        <span
                          class="wallet-table__sell-buy-btn"
                          :style="
                            mainColor ? `color: ${mainColor} !important` : {}
                          "
                          @click="
                            $emit('set-pair', { currency: ticker, type: 'buy' })
                          "
                          >{{ $t("common.buy") }}
                        </span>
                        <span style="padding: 0 2px">/</span>
                        <span
                          class="wallet-table__sell-buy-btn"
                          :style="
                            mainColor ? `color: ${mainColor} !important` : {}
                          "
                          @click="
                            $emit('set-pair', {
                              currency: ticker,
                              type: 'sell',
                            })
                          "
                        >
                          {{ $t("common.sell") }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import getCoolBalance from "~/mixins/getCoolBalance";

export default {
  name: "FastBuySellWalletList",
  mixins: [getCoolBalance],
  emits: ["set-pair"],
  computed: {
    ...mapGetters({ coins: "core/coins" }),
    sortedCoins() {
      return Object.keys(this.coins).filter(
        (ticker) =>
          !this.coins[ticker].disable_exchange &&
          !this.coins[ticker].disable_all
      );
    },
  },
};
</script>

<style lang="scss" scoped>
::placeholder {
  color: #d9d9d9 !important;
  font-size: 25px !important;
  font-weight: 400 !important;
}

.balancelist .exchange__top-up-button {
  margin: 0;
}

.balancelist {
  height: 100%;
  margin-top: 0;
}

.exchange__top-up-button {
  color: #ffffff;
  line-height: 30px;
  font-weight: 400;
  border-radius: 5px;
  background-color: var(--theme-primary-color);
  width: 130px;
  display: flex;
  margin: auto;
  justify-content: center;
  box-shadow: 0 2px 5px 0 #bfbfbf;
  font-size: 0.7em;

  &:hover {
    box-shadow: 0 4px 7px 0 #bfbfbf;
  }
}

.link {
  text-decoration: none;
}

.wallet__title--left {
  display: flex;
  justify-content: space-between;
  padding-right: 30px;
}

.wallet__title {
  display: flex;
  align-items: center;
  margin-top: 0;
  min-height: 90px;
}

.wallet-list {
  margin-top: 0;
  box-shadow: none;
  height: auto !important;
}

.wallet-table__sell-buy-btn {
  color: var(--theme-primary-color);
  text-decoration: underline;
  cursor: pointer;
}
</style>

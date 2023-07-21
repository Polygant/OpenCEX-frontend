<template>
  <div v-click-outside="closeSelect">
    <div v-if="currentOption" class="coinSelector">
      <div class="selector__current" @click="open">
        <img
          v-if="image"
          width="50"
          :src="
            allCoins[currentOption.id].logo.length > 0
              ? allCoins[currentOption.id].logo
              : `/public/img/common/svgcrypto/${currentOption.id.toLowerCase()}.svg`
          "
          :alt="currentOption.id.toUpperCase()"
          class="mCS_img_loaded walletTable__item_img walletTable__item_img_small coinSelector__img"
        />
        <span class="coinSelector__name">{{ currentOption.id }}</span>
        <span class="coinSelector__title">{{ currentOption.title }}</span>
        <span
          v-if="
            currentOption.price &&
            currentOption.price !== '0' &&
            currentOption.price !== 'NAN'
          "
          class="coinSelector__price"
          >{{
            addSpaceFixDecimal(
              currentOption.price,
              coins[currentOption.id]?.decimals
            )
          }}</span
        >
        <span v-if="totalTitle" class="totalBalance">{{ totalTitle }}</span>
      </div>
      <ul v-if="opened">
        <li
          v-for="coin in optionsList"
          :key="coin.id"
          @click="onSelect(coin.id)"
        >
          <div class="coinSelector__elem">
            <img
              v-if="image"
              width="50"
              :src="
                allCoins[coin.id].logo.length > 0
                  ? allCoins[coin.id].logo
                  : `/public/img/common/svgcrypto/${coin.id.toLowerCase()}.svg`
              "
              :alt="coin.id.toUpperCase()"
              class="mCS_img_loaded walletTable__item_img walletTable__item_img_small coinSelector__img"
            />
            <span class="coinSelector__name">{{ coin.id }}</span>
            <span class="coinSelector__title">{{ coin.title }}</span>
            <span
              v-if="coin.price && coin.price !== '0' && coin.price !== 'NAN'"
              class="coinSelector__price"
            >
              {{
                addSpaceFixDecimal(coin.price, coins[coin.id]?.decimals || 8)
              }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { floor10 } from "~/utilities/helpers";
import vClickOutside from "click-outside-vue3";
import getFixedDecimal from "@/mixins/getFixedDecimal";
import { mapGetters } from "vuex";

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  mixins: [getFixedDecimal],
  props: {
    items: {
      type: Object,
      required: true,
    },
    selectedDefault: {
      type: String,
      default: "",
    },
    image: {
      type: Boolean,
      default: false,
    },
    totalTitle: {
      type: String,
      required: false,
      default: "",
    },
    allCoins: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["select"],
  data() {
    return {
      selected: "",
      opened: false,
      floor10,
    };
  },
  computed: {
    ...mapGetters({ coins: "core/coins" }),
    currentOption() {
      return (
        this.optionsList.find((item) => item.selected) || this.optionsList[0]
      );
    },
    optionsList() {
      let list = [];
      for (const [key, value] of Object.entries(this.items)) {
        list.push({
          id: key,
          selected: this.selectedDefault === key || this.selected === key,
          title: value.name,
          price:
            typeof value["actual"] !== "undefined"
              ? this.formatingBalanceAndOrder(
                  floor10(value["actual"] + value["orders"], -8)
                )
              : "",
        });
      }
      return list;
    },
  },
  methods: {
    closeSelect() {
      this.opened = false;
    },
    open() {
      this.opened = !this.opened;
    },
    onSelect(id) {
      this.selected = id;
      this.opened = false;
      this.$emit("select", this.selected);
    },
    formatingBalanceAndOrder(value) {
      return value !== 0 ? value.toFixed(8) : value.toFixed();
    },
  },
};
</script>

<style lang="scss" scoped>
.coinSelector__img {
  margin-left: 0;
}
.coinSelector li {
  cursor: pointer;
}
.coinSelector li:hover {
  background: #cccccc;
}
.coinSelector__elem {
  height: 30px;
  padding-left: 13px;
}
.coinSelector {
  position: relative;
}
.coinSelector ul {
  position: absolute;
  top: 34px;
  width: 100%;
  background: #fff;
  border: 1px solid #c5c5c5;
  border-top: none;
  box-sizing: border-box;
  border-radius: 5px;
  z-index: 4;
}
.selector__current {
  border: 1px solid #c5c5c5;
  box-sizing: border-box;
  border-radius: 5px;
  height: 34px;
  padding-top: 4px;
  position: relative;
  padding-left: 13px;
  padding-right: 19px;
}
.selector__current:after {
  content: "";
  display: block;
  position: absolute;
  top: 14px;
  right: 10px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: #000000 transparent transparent transparent;
}
.walletTable__item_img {
  margin-top: -3px;
}
.coinSelector__name {
  font-weight: bold;
  font-size: 14px;
}
.coinSelector__title {
  font-size: 12px;
  color: #717b8b;
  padding-left: 8px;
  display: inline-block;
}
.coinSelector__price {
  font-size: 14px;
  color: #343535;
  font-weight: 600;
  float: right;
  margin-right: 5px;
  text-align: right;
  padding-top: 2px;
}
.totalBalance {
  color: #717b8b;
  font-size: 12px;
  float: right;
  margin-right: 5px;
  margin-top: 4px;
}
@media (max-width: 1400px) {
  .totalBalance {
    display: none;
  }
}

@media (max-width: 400px) {
  .coinSelector__price {
    display: none;
  }
}
</style>

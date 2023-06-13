<template>
  <div v-click-outside="closeSelect">
    <div v-if="currentOption" class="coinSelector">
      <div class="selector__current" @click="open">
        <img
          width="50"
          :src="
            allCoins[currentOption.id].logo.length > 0
              ? allCoins[currentOption.id].logo
              : `/public/img/common/svgcrypto/${currentOption.id.toLowerCase()}.svg`
          "
          :alt="currentOption.id.toUpperCase()"
          class="mCS_img_loaded walletTable__item_img coinSelector__img"
        />
        <span class="coinSelector__title">{{ currentOption.title }}</span>
      </div>
      <ul v-if="opened">
        <li
          v-for="coin in optionsList"
          :key="coin.id"
          @click="onSelect(coin.id)"
        >
          <div class="coinSelector__elem">
            <img
              width="50"
              :src="
                allCoins[coin.id].logo.length > 0
                  ? allCoins[coin.id].logo
                  : `/public/img/common/svgcrypto/${coin.id.toLowerCase()}.svg`
              "
              :alt="coin.id.toUpperCase()"
              class="mCS_img_loaded walletTable__item_img coinSelector__img"
            />
            <span class="coinSelector__title">{{ coin.title }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import vClickOutside from "click-outside-vue3";
export default {
  name: "VSelect3",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    allCoins: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["input"],
  data() {
    return {
      selected: "",
      opened: false,
    };
  },
  computed: {
    currentOption() {
      return (
        this.optionsList.find((item) => item.selected) || this.optionsList[0]
      );
    },
    optionsList() {
      let list = [];
      console.log("this.options", this.options);
      // eslint-disable-next-line no-unused-vars
      for (const [key, value] of Object.entries(this.options)) {
        list.push({
          id: key,
          selected: this.value === key || this.selected === key,
          title: key,
          icon: value.icon,
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
      this.$emit("input", this.selected);
    },
  },
};
</script>

<style lang="scss" scoped>
.coinSelector {
  font-size: 25px !important;
  font-weight: 400 !important;
  width: 200px;
}
.coinSelector__img {
  margin-left: 0;
}
.coinSelector li {
  cursor: pointer;
}
.coinSelector li:hover {
  background: #5eac81;
  color: #ffffff;
}
.coinSelector li:hover .coinSelector__title {
  color: #ffffff;
}
.coinSelector__elem {
  height: 50px;
  padding-left: 13px;
  padding-top: 6px;
}
.coinSelector {
  position: relative;
}
.coinSelector ul {
  position: absolute;
  top: 65px;
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
  padding-top: 16px;
  position: relative;
  padding-left: 13px;
  height: 79px;
}
.selector__current:after {
  content: "";
  display: block;
  position: absolute;
  top: 33px;
  right: 10px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: #000000 transparent transparent transparent;
}
.coinSelector__name {
  font-weight: bold;
  font-size: 14px;
}
.coinSelector__title {
  font-size: 25px;
  font-weight: 400;
  color: #717b8b;
  padding-left: 8px;
  display: inline-block;
  cursor: pointer;
}
</style>

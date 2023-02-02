<template>
  <div v-click-outside="closeMenu" class="header__menu" @click="toggleIsOpen">
    <div class="burger">
      <img class="burger__image" src="/public/img/burger.png" alt="burger" />
      <span class="burger__text">{{ $t("common.menu") }}</span>
    </div>
    <ul class="navigation" :class="{ navigation__open: isOpenMenu }">
      <li
        v-for="item in menuItems"
        :key="item.key"
        class="navigation__item"
        :class="{ 'navigation__item--disabled': item.disabled }"
      >
        <router-link v-if="item.rout" class="navigation__link" :to="item.path">
          <img
            class="navigation__link__img"
            width="20"
            height="20"
            :src="`/public/img/menu/${item.iconClass}.svg`"
          />
          {{ $t(`common.${item.key}`) }}
          <span v-if="item.soon" class="soon"> ({{ $t("common.soon") }}) </span>
        </router-link>

        <a
          v-if="!item.rout"
          class="navigation__link"
          rel="noopener noreferrer nofollow"
          :href="item.path"
        >
          <i
            class="fa"
            :class="[
              item.iconClass,
              { 'wallet-margin-fix': item.key === 'wallet' },
            ]"
            aria-hidden="true"
          ></i>
          {{ $t(`common.${item.key}`) }}
          <span v-if="item.soon" class="soon"> ({{ $t("common.soon") }}) </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import menuHelper from "~/mixins/menuHelper";

export default {
  name: "MenuBlock",
  mixins: [menuHelper],
  computed: {
    ...mapGetters({ profile: "core/profile" }),
    menuItems() {
      const items = [
        {
          key: "wallet",
          iconClass: "credit-card-alt",
          path: "/wallet",
          rout: true,
        },
        {
          key: "buysell",
          iconClass: "line-chart",
          path: "/trade/BTC-USDT",
          rout: true,
        },
        {
          key: "exchange",
          iconClass: "exchange",
          path: "/quick-swap",
          rout: true,
        },
        {
          key: "fees",
          iconClass: "list-ul",
          path: "/fees",
          rout: true,
        },
      ];
      return items;
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation {
  position: absolute;
  font-family: "Open Sans", arial, sans-serif;
  min-width: 210px;
  background-color: #fff;
  top: 40px;
  right: 40px;
  opacity: 0;
  visibility: hidden;
  height: 0;
  transition: height 0.05s ease-in;
  z-index: 1;
  max-height: 80vh;
  overflow-y: auto;

  &__link {
    color: #19243c;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    font-size: 16px;
    padding: 0.5rem;

    &:hover {
      color: black;
      text-decoration: none;
      background-color: #dcdcdc;
    }

    img {
      margin-left: 15px;
    }
  }

  &__open {
    height: auto;
    opacity: 1;
    visibility: visible;
    position: absolute;
    background-color: #fff;
    top: 40px;
    right: 40px;
    z-index: 1;
    box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.25);
    border-radius: 0px;
    padding: 0;
  }

  &__item {
    height: 50px;

    .soon {
      color: red;
      font-weight: 200;
      font-size: 10px;
      text-transform: lowercase;
      margin-left: 5px;
    }

    &--disabled {
      pointer-events: none;
      opacity: 0.75;
    }

    .wallet-margin-fix {
      margin-right: 22px;
    }

    &.router-link-active {
      background-color: #f3f3f3;
    }
  }
}

.fa {
  margin: 0 27px 0 3px;
  font-size: 20px;
}

.navigation {
  .fa-line-chart {
    margin-right: 24px;
  }

  .fa-users {
    margin-right: 25px;
  }

  .fa-fw {
    margin-right: 20px;
  }
}
.navigation__link__img {
  margin-right: 20px;
  margin-left: 0;
}
</style>

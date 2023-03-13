<template>
  <div v-click-outside="closeMenu" class="header__menu" @click="toggleIsOpen">
    <div class="burger">
      <svg
        class="burger__image"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
      </svg>
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
          <svg
            v-if="item.iconClass === 'credit-card-alt'"
            class="navigation__link__img"
            width="20"
            height="20"
            viewBox="0 0 2304 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 1504v-608h2304v608q0 66-47 113t-113 47h-1984q-66 0-113-47t-47-113zm640-224v128h384v-128h-384zm-384 0v128h256v-128h-256zm1888-1152q66 0 113 47t47 113v224h-2304v-224q0-66 47-113t113-47h1984z"
            />
          </svg>
          <svg
            v-if="item.iconClass === 'line-chart'"
            class="navigation__link__img"
            width="20"
            height="20"
            viewBox="0 0 2048 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2048 1536v128h-2048v-1536h128v1408h1920zm-128-1248v435q0 21-19.5 29.5t-35.5-7.5l-121-121-633 633q-10 10-23 10t-23-10l-233-233-416 416-192-192 585-585q10-10 23-10t23 10l233 233 464-464-121-121q-16-16-7.5-35.5t29.5-19.5h435q14 0 23 9t9 23z"
            />
          </svg>
          <svg
            v-if="item.iconClass === 'exchange'"
            class="navigation__link__img"
            width="20"
            height="20"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1792 1184v192q0 13-9.5 22.5t-22.5 9.5h-1376v192q0 13-9.5 22.5t-22.5 9.5q-12 0-24-10l-319-320q-9-9-9-22 0-14 9-23l320-320q9-9 23-9 13 0 22.5 9.5t9.5 22.5v192h1376q13 0 22.5 9.5t9.5 22.5zm0-544q0 14-9 23l-320 320q-9 9-23 9-13 0-22.5-9.5t-9.5-22.5v-192h-1376q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1376v-192q0-14 9-23t23-9q12 0 24 10l319 319q9 9 9 23z"
            />
          </svg>
          <svg
            v-if="item.iconClass === 'list-ul'"
            class="navigation__link__img"
            width="20"
            height="20"
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M384 1408q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm0-512q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm-1408-928q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm0-512v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5z"
            />
          </svg>
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

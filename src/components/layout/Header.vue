<template>
  <header
    v-show="isVisible"
    id="header"
    :class="[
      'header',
      $route.name === 'trade-pair' || $route.path === '/'
        ? 'header--market'
        : '',
      isAuthorized ? '' : 'header--no-auth',
    ]"
  >
    <div class="header__logo">
      <a class="header__logo-link" href="/">
        <img
          width="135"
          :src="
            localConfig.logo ? localConfig.logo : '/public/img/logo-white.svg'
          "
        />
      </a>
    </div>

    <div v-if="accountData" class="header__ether">
      <div class="header__ether-img">
        <img
          style="height: 46px"
          :src="
            coins[accountData?.currentBaseCurrency].logo.length > 0
              ? coins[accountData?.currentBaseCurrency].logo
              : `/public/img/common/svgcrypto/${accountData?.currentBaseCurrency?.toLowerCase()}.svg`
          "
          :alt="accountData.currentBaseCurrency"
        />
      </div>
      <div class="header__ether-info">
        <div class="header__ether-info-title">
          {{ accountData?.currentPair[0] }}/{{ accountData?.currentPair[1] }}
        </div>
        <span class="header__ether-info-text v1">
          {{ $t("common.header.volume") }}:
          {{
            addSpaceFixDecimal(
              volume() || 0,
              coins[accountData?.currentQuoteCurrency]?.decimals || 8
            )
          }}&nbsp;
          {{ accountData?.currentQuoteCurrency }}
        </span>
      </div>
    </div>
    <div class="header__etc">
      <div class="header__etc-middle">
        <div v-if="accountData" class="middle-list__title">
          {{ coins[accountData?.currentPair?.[0]]?.name }}
          <span class="header__ether-info-text"></span>
          <ul class="header__links">
            <li class="header__links-item">{{ $t("common.site") }}:</li>
            <li
              v-for="link in getLinkInfo(accountData.currentBaseCurrency)"
              :key="link.href"
              class="header__links-item"
            >
              <a
                :href="link.href"
                rel="noopener noreferrer nofollow"
                target="_blank"
                class="header__links-link"
                >{{ link.title }}</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="header__author-wrap">
        <router-link
          v-if="isAuthorized"
          to="/wallet/deposit/USDT"
          class="header-deopsit-btn"
        >
          {{ $t("common.deposit") }}
        </router-link>
        <router-link
          v-if="!isAuthorized"
          to="/login"
          class="header__login-no-auth"
        >
          <div class="burger">
            <span class="burger__text">{{ $t("common.login") }}</span>
          </div>
        </router-link>
        <div
          v-if="isAuthorized"
          v-click-outside="closeSettingMenu"
          class="header__author"
          @click="toggleIsSettingsOpen"
        >
          <svg
            class="header__author-img"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1_1878)">
              <path
                d="M21.2286 19.6541C22.4604 18.1732 23.3172 16.4177 23.7264 14.536C24.1356 12.6543 24.0852 10.7018 23.5794 8.84364C23.0737 6.98551 22.1275 5.27643 20.8209 3.86096C19.5142 2.4455 17.8857 1.36529 16.0729 0.711731C14.2601 0.0581692 12.3164 -0.149525 10.4063 0.10622C8.49614 0.361964 6.67576 1.07362 5.09911 2.18099C3.52247 3.28836 2.23595 4.75887 1.34839 6.46811C0.460819 8.17735 -0.00168342 10.075 4.60413e-06 12.0007C0.000652359 14.8 0.98792 17.5096 2.78857 19.6541L2.77141 19.6687C2.83146 19.7407 2.90008 19.8024 2.96183 19.8735C3.03903 19.9618 3.12223 20.0449 3.20201 20.1307C3.44218 20.3912 3.68921 20.6415 3.94825 20.8763C4.02717 20.9483 4.10865 21.0151 4.18842 21.0837C4.46291 21.3202 4.74511 21.5448 5.0376 21.7539C5.07534 21.7796 5.10965 21.813 5.1474 21.8396V21.8293C7.15635 23.2419 9.55292 24 12.0094 24C14.466 24 16.8625 23.2419 18.8715 21.8293V21.8396C18.9092 21.813 18.9427 21.7796 18.9813 21.7539C19.2729 21.5439 19.556 21.3202 19.8305 21.0837C19.9102 21.0151 19.9917 20.9474 20.0706 20.8763C20.3297 20.6406 20.5767 20.3912 20.8169 20.1307C20.8966 20.0449 20.979 19.9618 21.057 19.8735C21.1179 19.8024 21.1874 19.7407 21.2475 19.6678L21.2286 19.6541ZM12.0086 5.14424C12.772 5.14424 13.5183 5.37044 14.153 5.79422C14.7878 6.218 15.2825 6.82034 15.5747 7.52507C15.8668 8.2298 15.9432 9.00526 15.7943 9.75339C15.6454 10.5015 15.2778 11.1887 14.7379 11.7281C14.1981 12.2675 13.5104 12.6348 12.7616 12.7836C12.0129 12.9324 11.2368 12.856 10.5315 12.5641C9.82616 12.2722 9.22332 11.7779 8.79919 11.1437C8.37506 10.5094 8.14868 9.76377 8.14868 9.00098C8.14868 7.97811 8.55535 6.99713 9.27922 6.27386C10.0031 5.55058 10.9849 5.14424 12.0086 5.14424ZM5.15254 19.6541C5.16742 18.5288 5.62512 17.4546 6.42662 16.6638C7.22811 15.8731 8.30896 15.4294 9.43532 15.4289H14.5818C15.7082 15.4294 16.7891 15.8731 17.5905 16.6638C18.392 17.4546 18.8497 18.5288 18.8646 19.6541C16.9834 21.3479 14.5409 22.2853 12.0086 22.2853C9.47626 22.2853 7.03374 21.3479 5.15254 19.6541Z"
                fill="#FFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_1_1878">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span class="header__author-name">
            {{ username }}
          </span>
          <svg
            class="header__author-image"
            width="10"
            height="10"
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            @click.stop="toggleIsSettingsOpen"
          >
            <g id="" transform="translate(-254 -232)">
              <rect
                data-name="Rectangle 1"
                width="21"
                height="21"
                transform="translate(254 232)"
                style="fill: transparent"
              />
              <path
                d="M107.741,10.99l-8.3,8.6a1.318,1.318,0,0,1-1.911,0,1.437,1.437,0,0,1,0-1.981L104.875,10,97.535,2.391a1.437,1.437,0,0,1,0-1.981,1.318,1.318,0,0,1,1.911,0l8.3,8.6a1.436,1.436,0,0,1,0,1.98Z"
                transform="translate(274.5 139.862) rotate(90)"
              />
            </g>
          </svg>
          <ul
            v-if="isAuthorized"
            class="author-list"
            :class="{ 'author-list-open': isOpenSettingsMenu }"
          >
            <template v-for="item in authorizedMenuItems">
              <li
                v-if="RegExp('^https?://|^//').test(item.path)"
                :key="item.key"
                class="author-list__item"
              >
                <a
                  :href="item.path"
                  rel="noopener noreferrer nofollow"
                  :target="item.target"
                  class="author-list__link"
                >
                  <i class="fa" :class="item.iconClass" aria-hidden="true"></i>
                  {{ $t(`common.${item.key}`) }}
                </a>
              </li>

              <!-- eslint-disable-next-line -->
              <router-link v-else :to="item.path" class="author-list__item">
                <a class="author-list__link">
                  <svg
                    v-if="item.iconClass === 'cog'"
                    class="author-list__link-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"
                    />
                  </svg>
                  <svg
                    v-if="item.iconClass === 'headphones'"
                    class="author-list__link-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1728 886q0 166-60 314l-20 49-185 33q-22 83-90.5 136.5t-156.5 53.5v32q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-576q0-14 9-23t23-9h64q14 0 23 9t9 23v32q71 0 130 35.5t93 95.5l68-12q29-95 29-193 0-148-88-279t-236.5-209-315.5-78-315.5 78-236.5 209-88 279q0 98 29 193l68 12q34-60 93-95.5t130-35.5v-32q0-14 9-23t23-9h64q14 0 23 9t9 23v576q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-32q-88 0-156.5-53.5t-90.5-136.5l-185-33-20-49q-60-148-60-314 0-151 67-291t179-242.5 266-163.5 320-61 320 61 266 163.5 179 242.5 67 291z"
                    />
                  </svg>
                  {{ $t(`common.${item.key}`) }}
                </a>
              </router-link>
            </template>
            <li class="author-list__item">
              <a class="author-list__link" @click="handleLogout()">
                <svg
                  class="author-list__link-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M704 1440q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-119 0-203.5-84.5t-84.5-203.5v-704q0-119 84.5-203.5t203.5-84.5h320q13 0 22.5 9.5t9.5 22.5q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-66 0-113 47t-47 113v704q0 66 47 113t113 47h312l11.5 1 11.5 3 8 5.5 7 9 2 13.5zm928-544q0 26-19 45l-544 544q-19 19-45 19t-45-19-19-45v-288h-448q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h448v-288q0-26 19-45t45-19 45 19l544 544q19 19 19 45z"
                  />
                </svg>
                {{ $t("common.logout") }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <MenuComponent />
      <LanguageSelector />
      <div
        class="themeSelector"
        :class="{ dark: theme === 'dark' }"
        @click="changeTheme"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g stroke="none" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd">
            <g id="themeSelector" fill="#212121" fill-rule="nonzero">
              <path
                d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 L12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z"
              ></path>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </header>
</template>

<script>
import MenuComponent from "~/components/layout/parts/Menu.vue";
import { mapGetters } from "vuex";
import menuHelper from "~/mixins/menuHelper";
import helpers from "~/mixins/helpers";
import handleLogout from "~/mixins/handleLogout";
import getFixedDecimal from "~/mixins/getFixedDecimal";
import LanguageSelector from "~/components/layout/parts/LanguageSelector.vue";
import { useCookies } from "vue3-cookies";

export default {
  name: "HeaderComponent",
  components: { LanguageSelector, MenuComponent },
  mixins: [menuHelper, handleLogout, helpers, getFixedDecimal],
  props: {
    routeName: {
      type: String,
      default: "",
    },
  },
  setup() {
    const { cookies } = useCookies();
    return { cookies };
  },
  data() {
    return {
      hideHeaderPages: [
        "login",
        "confirm-withdrawal-request",
        "confirm_sendfunds",
        "register",
        "404",
        "reset-password",
        "forgot",
        "interface-select",
        "email-verify",
      ],
    };
  },
  computed: {
    isVisible() {
      return !this.hideHeaderPages.includes(this.routeName);
    },
    accountData() {
      return this.$store.getters["core/headerAccountData"];
    },
    ...mapGetters({
      isKYC: "core/isKYC",
      profile: "core/profile",
      coins: "core/coins",
      theme: "core/theme",
    }),
    isAuthorized() {
      return this.$store.getters["core/isAuthorized"];
    },
    username() {
      return this.$store.getters["core/profile"].user.username;
    },
    authorizedMenuItems() {
      return [
        {
          key: "settings",
          iconClass: "cog",
          path: "/settings",
        },
        {
          key: "support",
          iconClass: "headphones",
          path: "/support",
          target: "_blank",
        },
      ];
    },
  },
  mounted() {
    if (localStorage.getItem("token")) {
      this.$store.dispatch("core/getProfile");
    }
  },
  methods: {
    changeTheme() {
      const newTheme = this.theme === "dark" ? "light" : "dark";
      this.$store.dispatch("core/changeTheme", newTheme);
      this.cookies.set("theme", newTheme);
    },
    volume() {
      return parseFloat(
        this.getFromObj(
          this.accountData.pairs,
          this.accountData.pairprop + ":volume",
          0
        ) || 0
      ).toFixed(2);
    },

    getLocation() {
      return window.location;
    },

    getLinkInfo(ticker) {
      return this.coins?.[ticker]?.["links"];
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 0.5rem;
  background: var(--theme-secondary-color);
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 500;

  &__links {
    display: flex;
  }

  &__links-item {
    font-weight: 100;
  }

  &__links-link {
    display: block;
    font-size: 13px;
    margin-top: 1px;

    &:before {
      color: #ffffff;
      content: "/";
      padding: 0 5px;
    }

    &:hover {
      text-decoration: none;
    }
  }

  &__login-no-auth {
    border: 1px solid #333d59;
    border-radius: 20px;
    position: relative;
    text-align: center;
    line-height: 2;

    &:hover {
      text-decoration: none;
    }

    @media screen and (max-width: 450px) {
      flex: 0 0 80px;
    }
  }

  &__logo {
    padding-right: 1rem;
    padding-left: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #29324a;
    min-height: 70px;

    & img {
      max-height: 48px;
    }

    @media screen and (max-width: 675px) {
      border-right: none;
    }
  }

  &__logo-link {
    position: relative;
  }

  &__logo-beta {
    position: absolute;
    top: -10px;
    left: 16px;
    color: #008766;
    border: 2px solid #008766;
    border-radius: 3px;
    padding: 0px 3px;
    font-size: 9px;
    font-weight: 600;
    background-color: #1b293d;
  }

  &__author {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    border-radius: 20px;
    position: relative;
    min-width: 50px;
    height: 32px;
    margin-right: 10px;
    padding-left: 30px;
    background-size: 18px;

    &:before {
      content: "";
      width: 1px;
      height: 70px;
      background-color: #29324a;
      position: absolute;
      left: -7px;
      top: 50%;
      margin-top: -35px;
    }

    @media screen and (max-width: 425px) {
      min-width: 38px;
    }

    img {
      margin-left: 3px;
      height: 10px;
      margin-right: 3px;
    }
  }

  &__author-name {
    max-width: 150px;
    padding: 0 5px;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media screen and (max-width: 510px) {
      display: none;
    }
  }

  &__author-image {
    margin-left: 5px;
    margin-right: 5px;
  }

  &__author-wrap {
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  &__ether {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    border-right: 1px solid #29324a;

    @media screen and (max-width: 675px) {
      border-right: none;
    }
  }

  &__ether-img {
    width: 71px;
    height: 46px;

    img {
      margin-right: 25px;
    }
  }

  &__ether-info {
    font-size: 14px;
    font-family: "Open Sans", arial, sans-serif;
    color: white;
    line-height: 1.2;
  }

  &__ether-info-text {
    display: inline-block;
    font-size: 12px;
  }

  &__ether-info-title {
    font-weight: bold;
    text-transform: uppercase;
  }

  &__etc {
    flex: 1;
    padding-left: 1rem;
    display: flex;
    justify-content: flex-end;
    position: relative;
  }

  &__language {
    position: relative;
    margin-left: 15px;
    border-radius: 50px;
    cursor: pointer;
    width: 40px;
    height: 32px;
    text-align: center;

    &:before {
      content: "";
      width: 1px;
      height: 70px;
      background-color: #29324a;
      position: absolute;
      left: -7px;
      top: 50%;
      margin-top: -35px;
    }
  }
}

.header__links-item:nth-child(2) .header__links-link:before,
.header__links .first:before {
  content: "";
  padding-left: 0;
}

.middle-list__title {
  font-size: 14px;
  font-family: "Open Sans", arial, sans-serif;
  font-weight: bold;
  color: white;
  line-height: 1.2;

  .header__ether-info-text {
    font-size: 14px;
  }
}

.middle-list__link {
  color: #b4cee2;
  display: inline-block;
  font-size: 12px;
  font-weight: bold;

  &:hover {
    color: #88b3d4;
  }
}

.author-list {
  font-family: "Open Sans", arial, sans-serif;
  min-width: 140px;
  position: absolute;
  background-color: #fff;
  top: 40px;
  right: 40px;
  opacity: 0;
  visibility: hidden;
  height: 0;
  transition: height 0.05s ease-in;
  z-index: 1;

  &__item {
    height: 50px;

    &.router-link-active {
      background-color: #f0edf3;
    }
  }

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

  .fa-credit-card-alt {
    margin: 0 23px 0 2px;
    font-size: 15px;
  }

  .fa-cog {
    margin: 0 24px 0 2px;
    font-size: 21px;
  }

  .fa-headphones {
    margin: 0 23px 0 2px;
    font-size: 20px;
  }

  .fa-sign-out {
    margin: 0 21px 0 4px;
    font-size: 20px;
  }
}

.author-list-open {
  height: auto;
  opacity: 1;
  visibility: visible;
  -webkit-box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.25);
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.25);
  border-radius: 0px;
  padding: 0;
}

.activateCODE {
  text-align: center;
  padding: 4px 1px;
  -webkit-flex: 0 0 245px;
  -ms-flex: 0 0 245px;
  cursor: pointer;
  flex: 0 0 245px;
  color: #ffffff;
  margin-right: auto;
  border: 1px solid #333d59;
  border-radius: 20px;
  margin-left: 15px;
  position: relative;
  -webkit-border-radius: 20px;
  @media screen and (max-width: 850px) {
    font-size: 0;
    border: none;
    flex: 0;
  }
}

.header__etc-middle {
  flex: 1;
}

.header__etc {
  position: relative;
  padding-right: 35px;
  &.p-codes {
    flex: 1;
  }
}

.header--market {
  .header__ether {
    min-height: 70px;

    @media screen and (max-width: 670px) {
      display: none;
    }
  }

  .header__etc-middle {
    flex: 1;
    margin-right: 10px;

    @media screen and (max-width: 1024px) {
      .middle-list__title {
        display: none;
      }
    }
  }

  .header__author-name {
    font-weight: 400;
    @media screen and (max-width: 1090px) {
      display: none;
    }
  }
}

.header--no-auth {
  .burger__text {
    display: initial;
  }
}

.header__author-wrap {
  padding: 0 5px;
  margin-right: 15px;
}

.header__menu:before {
  content: "";
  width: 1px;
  height: 70px;
  background-color: #29324a;
  position: absolute;
  left: -7px;
  top: 50%;
  margin-top: -35px;
}

.header__menu {
  padding-left: 12px;
  border-radius: 20px;
  position: relative;
}

.burger {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  height: 32px;
}
.author-list .author-list__link-icon {
  width: 30px;
  height: 21px;
  margin-left: 0;
  margin-right: 15px;
}
.author-list__link {
  height: 50px;
}
.themeSelector {
  cursor: pointer;
  width: 30px;
  height: 30px;
  position: absolute;
  right: 0;
  top: 0;
}
.themeSelector.dark {
  transform: scaleX(-1);
}
.header-deopsit-btn {
  position: relative;
  left: -40px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  height: 33px;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  padding: 7px 13px 10px;
}
@media (max-width: 800px) {
  .header-deopsit-btn {
    display: none;
  }
}
</style>

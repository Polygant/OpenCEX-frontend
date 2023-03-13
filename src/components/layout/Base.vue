<template>
  <div :style="mainTextLocal ? `color: ${mainTextLocal}` : {}">
    <div
      :style="
        mainBackgroundLocal
          ? `background: ${mainBackgroundLocal} !important`
          : {}
      "
    >
      <HeaderComponent v-if="!simpleLayout" />
      <div class="content" :class="{ 'content--simple': simpleLayout }">
        <slot />
      </div>
      <FooterComponent v-if="!simpleLayout" />
      <notification-root />
      <modal-root />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="customCss"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotificationRoot from "~/components/notifications/NotificationRoot.vue";
import ModalRoot from "~/components/modal/ModalRoot.vue";
import HeaderComponent from "~/components/layout/Header.vue";
import FooterComponent from "~/components/layout/Footer.vue";
import { Init } from "~/utilities/manager";
import localConfig from "~/local_config";
import { useCookies } from "vue3-cookies";

export default {
  name: "LayoutComponent",
  components: {
    HeaderComponent,
    FooterComponent,
    NotificationRoot,
    ModalRoot,
  },
  props: {
    contentClass: {
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
      interval: null,
      isLoading: false,
      simpleLayout: true,
      color: "#CCC",
    };
  },
  computed: {
    ...mapGetters({
      areCoinsLoaded: "core/areCoinsLoaded",
      coins: "core/coins",
    }),
    colorFromScript() {
      return "red";
    },
    inputColorLocal() {
      return localConfig?.themes?.[this.currentTheme]?.input_color || "#FFF";
    },
    inputTextLocal() {
      return localConfig?.themes?.[this.currentTheme]?.input_text || "#000";
    },
    loginTextLocal() {
      return localConfig?.themes?.[this.currentTheme]?.login_text || "#FFF";
    },
    blockColorLocal() {
      return localConfig?.themes?.[this.currentTheme]?.block_color || "#FFF";
    },
    mainColorLocal() {
      return localConfig?.themes?.[this.currentTheme]?.main_color || "#6352cd";
    },
    mainBackgroundLocal() {
      return (
        localConfig?.themes?.[this.currentTheme]?.main_background || "#edf1fa"
      );
    },
    mainTextLocal() {
      return localConfig?.themes?.[this.currentTheme]?.main_text || "#000000";
    },
    cancelLocal() {
      return (
        localConfig?.themes?.[this.currentTheme]?.cancel_color || "#ff0000"
      );
    },
    secondLocal() {
      return localConfig?.themes?.[this.currentTheme]?.second_color || "#000";
    },
  },
  watch: {
    "$route.path": "checkLayout",
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  mounted() {
    let theme = this.cookies.get("theme");
    if (theme && theme === "dark") {
      this.$store.dispatch("core/changeTheme", "dark");
    } else {
      this.$store.dispatch("core/changeTheme", "light");
    }
    this.updateCoinsData();
    this.interval = setInterval(() => this.updateCoinsData(), 5 * 60 * 1000);
  },
  methods: {
    async updateCoinsData() {
      Init.Base();
    },
    checkLayout() {
      if (
        this.$route.name === "login" ||
        this.$route.name === "register" ||
        this.$route.name === "forgot" ||
        this.$route.name === "email-verify" ||
        this.$route.name === "confirm-withdrawal-request" ||
        this.$route.name === "reset-password" ||
        this.$route.name === "confirm-register" ||
        this.$route.name === "interface-select" ||
        this.$route.name === "404"
      ) {
        this.simpleLayout = true;
      } else {
        this.simpleLayout = false;
      }
    },
  },
};
</script>

<style lang="scss">
.content--simple {
  background: #36373c;
  padding: 0 !important;
}
.address-text-field,
input[type="text"],
input[type="password"],
.country-select__selected-country,
.changePassword__input,
.coinSelector__elem,
.selector__current,
.formField__readonly,
.formField__input,
.trade-input__input,
.mx-input {
  color: v-bind(inputTextLocal) !important;
  background: v-bind(inputColorLocal) !important;
}
.navigation-language__link.selected,
.navigation-language,
.author-list,
.navigation__open,
.walletlist,
.exchange,
.table,
.balancelist,
.historylist,
.trade-menus,
.recent-trades__title,
.trades,
.user-orders,
.plate,
.card {
  background: v-bind(blockColorLocal) !important;
}
.support__title-bar {
  background: v-bind(mainColorLocal) !important;
}
.register__link span,
.register__link,
.footer-links-column a,
.support__content-item a,
.support__nav-item:hover a {
  color: v-bind(mainColorLocal) !important;
}
.support__nav-item:hover .faq-icon {
  background-color: v-bind(mainColorLocal) !important;
}
.support__content-card,
.support__nav-card,
.select__item {
  background-color: v-bind(blockColorLocal) !important;
}
.select__item:hover {
  background-color: v-bind(mainColorLocal) !important;
}
.alert-container,
.footer {
  background-color: v-bind(mainBackgroundLocal) !important;
}
.footer__social-item {
  color: v-bind(mainColorLocal) !important;
}
.footer__social-item path {
  fill: v-bind(mainColorLocal) !important;
}

.burger__text,
.header__author-name,
.non-auth-page__sub-title,
.select__description-title,
.select__description-subtitle {
  color: v-bind(loginTextLocal) !important;
}
.header__author-image {
  fill: v-bind(loginTextLocal) !important;
}
.navigation-language__link,
.navigation-language__link.selected,
.author-list__link,
.navigation__link,
h1,
h2,
h3,
h4,
h5,
p {
  color: v-bind(mainTextLocal) !important;
  opacity: 1;
}
.navigation-language__link {
  opacity: 0.5;
}
.author-list__link-icon,
.navigation__link__img {
  fill: v-bind(mainTextLocal) !important;
}
.btn-danger {
  background: v-bind(cancelLocal) !important;
}
.support__nav-link--active .faq-icon {
  background: v-bind(secondLocal) !important;
}
.support__content-item a,
.support__nav-card--contacts a,
.support__content-voc span {
  color: v-bind(secondLocal) !important;
}
</style>

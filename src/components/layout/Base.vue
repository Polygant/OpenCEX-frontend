<template>
  <div :style="mainText ? `color: ${mainText}` : {}">
    <div
      :style="mainBackground ? `background: ${mainBackground} !important` : {}"
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
    inputColor() {
      return localConfig?.themes?.[this.currentTheme]?.input_color || "#FFF";
    },
    inputText() {
      return localConfig?.themes?.[this.currentTheme]?.input_text || "#000";
    },
    loginText() {
      return localConfig?.themes?.[this.currentTheme]?.login_text || "#FFF";
    },
    blockColor() {
      return localConfig?.themes?.[this.currentTheme]?.block_color || "#FFF";
    },
    mainColor() {
      return localConfig?.themes?.[this.currentTheme]?.main_color || "#75147C";
    },
    mainBackground() {
      return (
        localConfig?.themes?.[this.currentTheme]?.main_background || "#75147C"
      );
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
  color: v-bind(inputText) !important;
  background: v-bind(inputColor) !important;
}
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
  background: v-bind(blockColor) !important;
}
.support__title-bar {
  background: v-bind(mainColor) !important;
}
.register__link span,
.register__link,
.footer-links-column a,
.support__content-item a,
.support__nav-card--contacts a,
.support__content-voc span,
.support__nav-item:hover a {
  color: v-bind(mainColor) !important;
}
.support__nav-link--active .faq-icon,
.support__nav-item:hover .faq-icon {
  background-color: v-bind(mainColor) !important;
}
.select__item:hover,
.footer {
  background-color: v-bind(mainBackground) !important;
}
.footer__social-item {
  color: v-bind(mainColor) !important;
}
.footer__social-item path {
  fill: v-bind(mainColor) !important;
}
.non-auth-page__sub-title,
.select__description-title,
.select__description-subtitle {
  color: v-bind(loginText) !important;
}
</style>

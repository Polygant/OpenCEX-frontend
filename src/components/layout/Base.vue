<template>
  <div :style="mainText ? `color: ${mainText}` : {}">
    <div
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
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
  },
  watch: {
    "$route.path": "checkLayout",
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  mounted() {
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
  padding-top: 0;
}
.changePassword__input,
.coinSelector__elem,
.selector__current,
.formField__readonly,
.formField__input,
.modal-body input[type="text"],
.trade-input__input,
.mx-input {
  color: v-bind(inputText) !important;
  background: v-bind(inputColor) !important;
}
</style>

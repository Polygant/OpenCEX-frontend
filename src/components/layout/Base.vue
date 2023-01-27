<template>
  <div>
    <HeaderComponent v-if="!simpleLayout" />
    <div class="content" :class="{ 'content--simple': simpleLayout }">
      <slot />
    </div>
    <FooterComponent v-if="!simpleLayout" />
    <notification-root />
    <modal-root />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NotificationRoot from "~/components/notifications/NotificationRoot.vue";
import ModalRoot from "~/components/modal/ModalRoot.vue";
import HeaderComponent from "~/components/layout/Header.vue";
import FooterComponent from "~/components/layout/Footer.vue";
import { Init } from "~/utilities/manager";

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
    };
  },
  computed: mapGetters({
    areCoinsLoaded: "core/areCoinsLoaded",
    coins: "core/coins",
  }),
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
</style>

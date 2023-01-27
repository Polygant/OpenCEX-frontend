import globalComponentsPlugin from "~/plugins/global-components";
import axios from "axios";
import VueNativeSock from "vue-native-websocket-vue3";
import i18n from "~/locales/index";
import http from "~/plugins/http";
import localConfig from "~/local_config";
import store from "~/store/index";
import vClickOutside from "click-outside-vue3";
import NumericDirective from "~/directives/numeric";
import PatternDirective from "~/directives/pattern";
import TooltipDirective from "~/directives/tooltip";
import restrictNumberInput from "~/directives/restrictNumberInput";
import copyText from "@meforma/vue-copy-to-clipboard";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { createMetaManager, plugin as vueMetaPlugin } from "vue-meta";

const urlForSocket =
  (localConfig.wss_url || "wss://") +
  (localConfig.wss_url_plane || localConfig.api.host) +
  "/wsapi/v1/live_notifications";

const initPlugins = (app) => {
  app.use(globalComponentsPlugin);
  app.use(i18n);
  app.use(http);
  app.use(vClickOutside);
  app.use(copyText);
  app.use(PerfectScrollbar);
  app.use(createMetaManager());
  app.use(vueMetaPlugin);
  app.directive("numeric", NumericDirective);
  app.directive("pattern", PatternDirective);
  app.directive("tooltip", TooltipDirective);
  app.directive("restrictNumberInput", restrictNumberInput);
  app.use(VueNativeSock, urlForSocket, {
    store: store,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 3000,
  });

  if (localStorage.getItem("planguage") === "undefined") {
    localStorage.setItem("planguage", "en");
  }
  app.config.globalProperties.$locale =
    localStorage.getItem("planguage") || "en";
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$i18n = i18n;
  app.config.globalProperties.axios = axios;
  app.config.globalProperties.$notify = (body) => {
    console.log(body);
  };
  app.config.globalProperties.localConfig = localConfig;
};

export default initPlugins;

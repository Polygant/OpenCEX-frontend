<template>
  <BaseComponent>
    <metainfo>
      <template #title="data">{{ data.content.replace(/%7C/g, "|") }}</template>
    </metainfo>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" :key="ind" />
      </transition>
    </router-view>
  </BaseComponent>
</template>

<script>
import BaseComponent from "~/components/layout/Base.vue";
import globalWSSubscriptions from "~/helpers/globalWSSubscriptions";
import localConfig from "./local_config";

export default {
  components: {
    BaseComponent,
  },
  mixins: [globalWSSubscriptions],
  metaInfo() {
    return {
      title: localConfig.project_title ? localConfig.project_title : "OpenCex",
      description: `${localConfig.project_title} ${this.$t(
        "common.invalid_code"
      )} `,
    };
  },
  data: () => ({
    ind: 1,
  }),
  watch: {
    "$route.params.walletitem": {
      handler: function (value, old) {
        if (value && old && value != old) this.ind++;
      },
    },
    "$route.params.pairprop": {
      handler: function (value, old) {
        if (value && old && value != old) this.ind++;
      },
    },
  },
  mounted() {
    localStorage.setItem(
      "project_title",
      localConfig.project_title ? localConfig.project_title : "OpenCex"
    );
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = `https://api.sumsub.com/idensic/static/sumsub-kyc.js`;
    let x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

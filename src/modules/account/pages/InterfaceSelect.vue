<template>
  <div
    class="select non-auth-page pb-5 px-1"
    :style="loginBackground ? `background: ${loginBackground} !important` : {}"
  >
    <ModalPagesHeader />
    <div
      class="non-auth-page__title"
      :style="loginText ? `color: ${loginText} !important` : {}"
    >
      {{ $t("common.chooseInterface") }}
    </div>
    <div
      class="non-auth-page__sub-title"
      :style="loginText ? `color: ${loginText} !important` : {}"
    >
      {{ $t("common.chooseInterfaceSubtitle") }}
    </div>
    <div class="select__container">
      <div class="select__item select__item--exchange" @click="goExchange">
        <p class="select__description-title text-white mb-3">
          {{ $t("common.basic") }}
        </p>
        <p class="select__description-subtitle text-white">
          {{ $t("common.buysellDescription") }}
        </p>
      </div>
      <div class="select__item select__item--trade" @click="goTrade">
        <p class="select__description-title text-white mb-3">
          {{ $t("common.advanced") }}
        </p>
        <p class="select__description-subtitle text-white">
          {{ $t("common.exchangeDescription") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ModalPagesHeader from "~/components/layout/ModalPagesHeader.vue";

export default {
  name: "InterfaceSelect",
  metaInfo() {
    return {
      title: this.$t("pages.titles.interface_select"),
      meta: [
        {
          name: "description",
          content: `${this.localConfig.project_title} ${this.$t(
            "pages.interfaceSelectDescription"
          )}`,
        },
      ],
    };
  },
  components: {
    ModalPagesHeader,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from.path;
    });
  },
  data() {
    return {
      prevRoute: "",
    };
  },
  methods: {
    goExchange() {
      this.setDefaultView("simple");
      if (this.prevRoute === "/settings") {
        this.$router.push("/settings");
      } else {
        this.$router.push("/quick-swap");
      }
    },
    goTrade() {
      this.setDefaultView("advance");
      if (this.prevRoute === "/settings") {
        this.$router.push("/settings");
      } else {
        this.$router.push("/trade/BTC-USDT");
      }
    },
    setDefaultView(type) {
      const successMessage = this.$t("common.saved");

      this.$http
        .post("profile/", {
          interface: type,
        })
        .then(() => {
          this.$notify({
            type: "success",
            text: successMessage,
          });
          this.$store.dispatch("core/getProfile");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.non-auth-page {
  color: #fff;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #36373c;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  &__title,
  &__sub-title {
    text-align: center;
    max-width: 500px;
    margin-top: 30px;
    font-size: 35px;
    font-weight: 300;
    line-height: 35px;
    margin-bottom: 20px;
  }

  &__sub-title {
    font-size: 20px;
    line-height: 20px;
    margin-top: 0;
  }
}

.select {
  &__container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 600px;
    margin: 15px auto;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__description-subtitle {
    max-width: 205px;
    margin: 0 auto;
  }

  &__description-subtitle,
  &__description-title {
    font-size: 16px;
    text-align: center;
  }

  &__description-title {
    font-size: 25px;
  }

  &__item {
    width: 46%;
    max-width: 275px;
    height: 340px;
    background-color: #898c8e;
    border-radius: 30px;
    padding-top: 200px;
    cursor: pointer;

    @media (max-width: 600px) {
      width: 100%;
      margin-bottom: 20px;
    }

    &:hover {
      background-color: var(--theme-primary-color);
    }

    &--exchange,
    &--trade {
      background-size: 75%;
      background-position: 50% 20%;
      background-repeat: no-repeat;
      background-image: url("/public/img/trade-preview.png");
    }

    &--exchange {
      background-image: url("/public/img/exchange-preview.png");
    }
  }
}
</style>

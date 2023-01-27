<template>
  <div class="h-screen fixed inset-0 overflow-auto">
    <div class="error">
      <div class="error__header">
        <router-link :to="homeLink">
          <img
            width="200"
            class="error__logo"
            :src="
              localConfig.logo ? localConfig.logo : '/public/img/logo-white.svg'
            "
        /></router-link>
      </div>
      <div class="error__container">
        <div class="error__images">
          <img
            class="error__main-image"
            src="/public/img/info-main-page/human/2.svg"
          />

          <img
            v-for="(coin, i) in coins"
            :key="i"
            :src="`/public/img/common/svgcrypto/${coin}.svg`"
            class="levitated-coin"
            :class="`levitated-coin_n_${i + 1}`"
          />
        </div>
        <div class="error__text-block">
          <h1 class="error__title">
            {{ error.statusCode }}
            <div class="error__subtitle">{{ subtitle }}</div>
          </h1>
          <p class="error__explaination">{{ details }}</p>
          <router-link :to="homeLink" class="error__go-home-button">{{
            $t("common.errors.go_back_button")
          }}</router-link>
          <div class="error__links">
            <a
              v-for="link in links"
              :key="link.href"
              class="error__link"
              :href="link.href"
            >
              {{ link.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",

  layout: "errorLayout",

  computed: {
    error() {
      return { statusCode: 404 };
    },

    links() {
      return [
        {
          text: this.$t("common.errors.links.wallet"),
          href: "/account/wallet",
        },
        {
          text: this.$t("common.errors.links.registration"),
          href: "/account/register",
        },
        {
          text: this.$t("common.errors.links.authorization"),
          href: "/account/login",
        },
      ];
    },

    homeLink() {
      return { name: "account-root" };
    },

    coins() {
      return ["btc", "xrp", "rep", "usdt", "eth"];
    },

    subtitle() {
      const subtitles = {
        404: this.$t("common.errors.subtitles.404"),
        default: this.$t("common.errors.subtitles.default"),
      };

      return subtitles[this.error.statusCode] || subtitles.default;
    },

    details() {
      const details = {
        404: this.$t("common.errors.details.404"),
        default: this.$t("common.errors.details.default"),
      };

      return details[this.error.statusCode] || details.default;
    },
  },
};
</script>

<style lang="scss">
.error {
  background: #ebf3fa;
  font-family: Open Sans;
  color: #2b395b;
  min-height: 100vh;
  background-image: url("public/img/info-main-page/top-background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom -156px left 0;

  &__header,
  &__container {
    padding: 15px 22px;
  }

  &__container {
    display: flex;
    max-width: 1870px;
    margin: 0 auto;
    margin-top: 37px;

    @media (max-width: 1200px) {
      display: block;
      padding-bottom: 150px;
    }
  }

  &__text-block {
    margin-left: 180px;
    margin-top: 55px;

    @media (max-width: 1200px) {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
  }

  &__title {
    font-size: 148px;
    font-weight: 600;
    letter-spacing: 0.1em;
    font-family: Open Sans;
  }

  &__subtitle {
    font-size: 64px;
    font-weight: 600;
    letter-spacing: 0em;
    margin-top: -9px;
    margin-bottom: 0;
    line-height: initial;
    text-transform: uppercase;

    @media (max-width: 1200px) {
      margin-top: 5px;
    }
  }

  &__explaination {
    font-size: 28px;
    font-weight: 400;
    margin-top: -9px;
    margin-bottom: 0;
    line-height: initial;

    @media (max-width: 1200px) {
      margin-top: 10px;
    }
  }

  &__go-home-button {
    display: inline-block;
    min-width: 307px;
    margin-top: 30px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    background: #48b58b;
    border-radius: 5px;
    padding: 15px;
    color: white !important;
    text-decoration: none !important;

    @media (max-width: 1200px) {
      font-size: 23px;
      padding: 20px 30px;
    }
  }

  &__images {
    position: relative;
    width: 672px;
    max-width: 100%;
    left: 10px;

    @media (max-width: 1200px) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__main-image {
    width: 424px;
    max-width: 100%;
    display: block;
    padding-top: 150px;
    margin: 0 auto 0;
  }

  &__links {
    margin-top: 114px;
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 1200px) {
      justify-content: center;
    }
  }

  &__link {
    font-size: 20px;
    font-weight: 600;
    margin-right: 53px;
    color: #4267a3 !important;
    text-decoration: none !important;

    @media (max-width: 1200px) {
      margin: 20px;
    }
  }
}

.levitated-coin {
  position: absolute;
  width: 11%;

  &_n_1 {
    top: 50%;
    left: 6%;
  }
  &_n_2 {
    top: 21%;
    left: 13%;
  }
  &_n_3 {
    top: 3%;
    left: 44.5%;
  }
  &_n_4 {
    top: 21%;
    right: 13%;
  }
  &_n_5 {
    top: 50%;
    right: 6%;
  }
}
</style>

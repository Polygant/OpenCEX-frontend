<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-content-wrapper">
        <div class="footer-copy">
          <div class="copyright">
            2022 ©
            {{ $t("common.copyright", { title: localConfig.project_title }) }}
          </div>
          <div class="rights">{{ $t("common.rights") }}</div>
          <div class="footer__socials-container">
            <a
              v-if="
                localConfig.socials.facebook &&
                localConfig.socials.facebook !== ''
              "
              class="footer__social-item"
              :href="`https://facebook.com/${localConfig.socials.facebook.link}`"
            >
              <span><img width="10" src="/public/img/facebook.svg" /></span>
              {{ localConfig.socials.facebook.link }}
            </a>
            <a
              v-if="
                localConfig.socials.twitter &&
                localConfig.socials.twitter !== ''
              "
              class="footer__social-item"
              :href="`https://twitter.com/${localConfig.socials.twitter.link}`"
            >
              <span><img width="10" src="/public/img/twitter.svg" /></span>
              {{ localConfig.socials.twitter.link }}
            </a>
            <a
              v-if="
                localConfig.socials.telegram &&
                localConfig.socials.telegram !== ''
              "
              class="footer__social-item"
              :href="`https://t.me/${localConfig.socials.telegram.link}`"
            >
              <span><img width="15" src="/public/img/telegram.svg" /></span>
              {{ localConfig.socials.telegram.link }}
            </a>
            <a
              v-if="
                localConfig.socials.linkedin &&
                localConfig.socials.linkedin !== ''
              "
              class="footer__social-item"
              :href="`https://linkedin.com/company/${localConfig.socials.linkedin.link}`"
            >
              <span><img width="15" src="/public/img/linkedin.svg" /></span>
              {{ localConfig.socials.linkedin.link }}
            </a>
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-links-column">
            <div class="footer-links-title">
              {{ $t("common.products") }}
            </div>
            <router-link to="/trade/BTC-USDT">
              {{ $t("common.buysell") }}
            </router-link>
            <router-link to="/quick-buy-sell">
              {{ $t("common.exchange") }}
            </router-link>
            <router-link to="/wallet">
              {{ $t("common.wallet") }}
            </router-link>
          </div>
          <div class="footer-links-column">
            <div class="footer-links-title">
              {{ $t("common.information") }}
            </div>
            <a href="/account/support">
              {{ $t("common.customer_support") }}
            </a>
            <router-link to="/fees">
              {{ $t("common.feeslimits") }}
            </router-link>
            <a href="/account/settings">{{ $t("common.settings") }}</a>
          </div>
        </div>
        <div class="footer-text">
          <div class="footer-text-title">
            {{ $t("common.tradeOn", { trade: localConfig.project_title }) }}
          </div>
          <div class="footer-text-p">
            {{ $t("common.allDay") }}
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FooterBlock",
  data() {
    return {
      current_date: new Date(),
      cookie_message_accept: !!localStorage.getItem("cookie_message_accept"),
    };
  },
  computed: {
    ...mapGetters({
      profile: "core/profile",
    }),
    lang() {
      return this.$locale;
    },
  },
  methods: {
    hideCookieMessage() {
      localStorage.setItem("cookie_message_accept", true);
      this.cookie_message_accept = true;
    },
  },
};
</script>

<style scoped lang="scss">
.footer {
  padding: 65px 0 77px;
  border-top: 1px solid #d9d9d9;
  background: #fff;
}
.footer-content-wrapper {
  display: flex;
  justify-content: space-between;
}
.footer-copy {
  width: 18%;
}
.copyright {
  font-size: 15px;
  color: #29292d;
  margin-bottom: 13px;
}
.rights {
  font-size: 14px;
  color: #b4b4c2;
  margin-bottom: 22px;
}
.footer-langs {
  position: relative;
  display: inline-block;
}
.footer-langs-btn {
  font-size: 14px;
  width: 98px;
  height: 46px;
  border: 1px solid #b4c0db;
  border-radius: 5px;
  padding: 5px 17px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--theme-primary-color);
  font-size: 13px;
  white-space: nowrap;
}
.footer-links {
  display: flex;
  justify-content: space-around;
  width: 43%;
}
.footer-links-column {
  display: flex;
  flex-direction: column;
}
.footer-links-column a {
  color: #42a4ff;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 500;
}
.footer-links-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 21px;
  text-transform: capitalize;
}
.footer-text {
  width: 24%;
}
.footer-text-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 9px;
}
.footer-text-p {
  font-size: 14px;
  margin-bottom: 19px;
}
.navigation-language {
  display: none;
  position: absolute;
  top: 51px;
  left: 0;
  border: 1px solid #b4c0db;
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
}
.navigation-language__link {
  color: #000;
  text-transform: capitalize;
  cursor: pointer;
  display: block;
  padding: 4px 0;
}
.navigation-language.active {
  display: block;
}

.footer-content {
  width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1400px) {
  .footer-content {
    width: 100%;
    padding: 0 20px;
  }
}

@media (max-width: 900px) {
  .footer-content-wrapper {
    display: flex;
    flex-direction: column;
  }
  .footer {
    padding: 26px 0 29px;
  }
  .footer-links {
    order: -1;
  }
  .footer-links {
    flex-wrap: wrap;
    width: 100%;
  }
  .footer-links-column {
    width: 50%;
  }
  .footer-links-column a {
    font-size: 12px;
    margin-bottom: 14px;
  }
  .footer-links-title {
    font-size: 16px;
    margin-bottom: 9px;
  }
  .footer-text {
    width: 100%;
    order: -1;
    padding-top: 16px;
  }
  .footer-copy {
    width: 100%;
    padding-top: 30px;
  }
  .footer-text-p {
    font-size: 12px;
    margin-bottom: 10px;
  }
  .copyright {
    font-size: 12px;
  }
  .footer-langs-btn {
    font-size: 13px;
    width: 71px;
    height: 38px;
    border: 1px solid #b4c0db;
    border-radius: 5px;
    padding: 5px 9px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .rights {
    font-size: 12px;
  }
}
.footer-langs {
  display: none !important;
}
.footer .btn {
  height: 52px;
  background: var(--theme-primary-color);
  border-radius: 5px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  font-size: 16px;
  padding: 15px 26px;
  display: inline-block;
  width: 102px;
}
.footer__socials-container {
  display: flex;
  flex-wrap: wrap;
}
.footer__social-item {
  width: 40%;
  padding-right: 10px;
  color: #42a4ff;
}
.footer__social-item span {
  width: 20px;
  height: 15px;
  display: inline-block;
  text-align: center;
  margin-left: -5px;
}
</style>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-content-wrapper">
        <div class="footer-copy">
          <div class="copyright">
            {{ new Date().getFullYear() }} ©
            {{ $t("common.copyright", { title: localConfig.project_title }) }}
          </div>
          <div class="rights !mb-2">{{ $t("common.built_by") }}</div>
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
              <span class="pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="17"
                  viewBox="0 0 10 17"
                >
                  <g>
                    <g>
                      <path
                        fill="#42a4ff"
                        d="M7 15.998a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6H0V5.996h3v-3a3 3 0 0 1 3-3c.182 0 .352.053.5.14a.988.988 0 0 1 .5-.14h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7v2h3v4H7z"
                      />
                    </g>
                  </g>
                </svg>
              </span>
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
              <span class="pl-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  viewBox="0 0 12 17"
                >
                  <path
                    d="M4 11c0 1.7 1.2 2 1.8 2H10c1.1 0 2 .9 2 2s-.9 2-2 2H6c-1.7 0-3.1-.6-4.3-1.9C.6 13.9 0 12.4 0 10.6V2C0 .9.9 0 2 0s2 .9 2 2v3h6c1.1 0 2 .9 2 2s-.9 2-2 2H4v2z"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    fill="#42a4ff"
                  />
                </svg>
              </span>
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
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 19 17"
                >
                  <g>
                    <g>
                      <path
                        fill="#42a4ff"
                        d="M.31 7.16L18.316.041c.382-.152.776.192.693.602L15.778 16.57a.514.514 0 0 1-.81.32l-4.411-3.281a.716.716 0 0 0-.89.025l-2.446 2.043a.512.512 0 0 1-.82-.253L4.703 9.828.316 8.15c-.446-.17-.45-.815-.006-.99zm5.44 2.77l.928 3.338c.065.237.4.212.432-.032l.241-1.83c.046-.345.206-.662.455-.9l7.076-6.74c.133-.125-.026-.339-.18-.242L6.128 8.935a.896.896 0 0 0-.378.996z"
                      />
                    </g>
                  </g>
                </svg>
              </span>
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
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 72 72"
                  width="20"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path
                      d="M59,57 L49.959375,57 L49.959375,41.6017895 C49.959375,37.3800228 48.3552083,35.0207581 45.0136719,35.0207581 C41.3785156,35.0207581 39.4792969,37.4759395 39.4792969,41.6017895 L39.4792969,57 L30.7666667,57 L30.7666667,27.6666667 L39.4792969,27.6666667 L39.4792969,31.6178624 C39.4792969,31.6178624 42.0989583,26.7704897 48.3236979,26.7704897 C54.5455729,26.7704897 59,30.5699366 59,38.4279486 L59,57 Z M20.372526,23.8257036 C17.4048177,23.8257036 15,21.4020172 15,18.4128518 C15,15.4236864 17.4048177,13 20.372526,13 C23.3402344,13 25.7436198,15.4236864 25.7436198,18.4128518 C25.7436198,21.4020172 23.3402344,23.8257036 20.372526,23.8257036 Z M15.8736979,57 L24.958724,57 L24.958724,27.6666667 L15.8736979,27.6666667 L15.8736979,57 Z"
                      fill="#42a4ff"
                    />
                  </g>
                </svg>
              </span>
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
            <router-link to="/quick-swap">
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
  margin-bottom: 13px;
}
.rights {
  font-size: 14px;
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
.footer__socials-container svg {
  display: inline-block;
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

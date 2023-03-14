<template>
  <div class="ref_page">
    <div class="support">
      <aside class="support__sidebar">
        <div class="support__nav-card">
          <div class="support__title-bar">
            {{ questions[activeQuestionIndex].title }}
          </div>
          <nav class="support__nav">
            <ul class="support__nav-list">
              <li
                v-for="(question, index) in questions"
                :key="index"
                class="support__nav-item"
              >
                <router-link
                  :data-category="question.category"
                  :class="[
                    'support__nav-link',
                    question.title === questions[activeQuestionIndex].title
                      ? 'support__nav-link--active'
                      : '',
                  ]"
                  :style="
                    secondColor &&
                    question.title === questions[activeQuestionIndex].title
                      ? `color: ${secondColor} !important`
                      : {}
                  "
                  :to="{
                    name: 'support',
                    query: {
                      c: question.category,
                    },
                  }"
                >
                  <div class="faq-icon" :class="question.icon"></div>
                  {{ question.title }}
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="support__nav-card support__nav-card--contacts">
          <p class="mb-4">{{ $t("support.contacts") }}</p>
          <p class="mb-4">
            <a
              :href="'mailto:' + localConfig.socials.mail"
              target="_blank"
              rel="noopener noreferrer nofollow"
              >{{ localConfig.socials.mail }}</a
            >
          </p>
          <p class="mb-4">
            <a
              :href="`https://t.me/${localConfig.socials.telegram.link}`"
              target="_blank"
              rel="noopener noreferrer nofollow"
              >{{ localConfig.socials.telegram.link }}</a
            >
          </p>
        </div>
      </aside>
      <div class="support__content-card">
        <div class="support__title-bar">
          {{ $t("support.welcome") }}
        </div>
        <div class="support__content">
          <div class="support__content-voc">
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-for="(item, index) in questions[activeQuestionIndex].items"
              :key="index"
              :data-id="item.qNumber"
              @click="scrollToL(item.qNumber)"
              v-html="item.title"
            ></span>
          </div>
          <div class="support__content-items">
            <div
              v-for="content in questions[activeQuestionIndex].items"
              :id="content.qNumber"
              :key="content.id"
              class="support__content-item"
            >
              <h3 class="support__content-title">
                <!-- eslint-disable vue/no-v-html -->
                <span v-html="content.title"></span>&nbsp;<button
                  :title="$t('common.copyLink')"
                  class="btn"
                  @click="copyLink(content)"
                >
                  <img
                    src="/public/img/copy.svg"
                    width="20"
                    class="inline-block"
                    alt=""
                  />
                </button>
              </h3>
              <!-- eslint-disable vue/no-v-html -->
              <div v-html="content.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import supportLocales from "../locales";
import copyToBuffer from "~/mixins/copyToBuffer";
import "~/helpers/widget";

const ICONS = {
  general_questions: "bars",
  security: "shield",
  settings: "cog",
  wallet: "credit_card",
  in_out: "money",
  exchange: "line_chart",
  fast: "exchange1",
  verification: "id_badge",
  code: "shopping_cart",
  buy_sell_code: "shopping_cart",
  other: "list_ul",
};

export default {
  name: "SupportPage",
  metaInfo() {
    return {
      title: this.$t("pages.titles.support"),
    };
  },
  mixins: [copyToBuffer],
  computed: {
    activeQuestionIndex() {
      const index = this.questions.findIndex(
        (question) => question.category === this.$route.query.c
      );
      return index === -1 ? 0 : index;
    },
    questions() {
      const arr = [];
      const exceptKeys = ["welcome", "create_ticket", "contacts"];
      Object.keys(supportLocales[this.$locale]).forEach((item) => {
        if (!exceptKeys.includes(item)) {
          this.addCategory(arr, supportLocales, item);
        }
      });
      return arr;
    },
  },
  created() {
    const widgetScript = document.createElement("script");

    widgetScript.setAttribute("src", this.localConfig.help_widget);
    widgetScript.setAttribute("defer", "defer");
    widgetScript.setAttribute("async", "async");
    widgetScript.setAttribute("type", "text/javascript");
    document.head.append(widgetScript);
  },

  mounted() {
    if (this.$route.query.q) {
      this.$nextTick(() => this.scrollToL(this.$route.query.q));
    }
  },

  unmounted() {
    window.FreshworksWidget("hide");
  },

  methods: {
    copyLink(content) {
      this.copyToBuffer(
        `${window.location.origin}${window.location.pathname}?c=${content.category}&q=${content.qNumber}`
      );
    },
    addCategory(accumulator, langObject, categoryName) {
      const obj = {
        category: categoryName,
        title: this.$t(`support.${categoryName}.title`),
        icon: ICONS[categoryName],
        items: [],
      };

      const questionsCount = Object.keys(
        langObject[this.$locale][categoryName].items
      ).filter((key) => {
        return key.startsWith("title");
      }).length;

      for (let i = 1; i <= questionsCount - 1; i++) {
        obj.items.push({
          id: categoryName + i,
          category: categoryName,
          qNumber: `q` + i,
          title: this.$t(`support.${categoryName}.items.title${i}`),
          content: this.$t(`support.${categoryName}.items.content${i}`),
        });
      }
      accumulator.push(obj);
    },
    handleCreateTicket() {
      window.zE("webWidget", "open");
    },
    scrollToL(id) {
      document.getElementById(id).scrollIntoView();
    },
  },
};
</script>

<style lang="scss">
.support__nav-card--contacts p,
.support__nav-card--contacts a {
  font-size: 16px;
}
.support__content p {
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 20px;
}
.support__nav-card--contacts a {
  color: #006be5;
  font-weight: lighter !important;
}

.support__content-item {
  a {
    color: #006be5;
    font-weight: lighter !important;
  }
  ul.dotted-list {
    padding-left: 29px;
    margin-bottom: 1rem;
    li {
      list-style: disc;
      display: list-item;
      text-align: -webkit-match-parent;
    }
  }

  li {
    margin-bottom: 15px;
    margin-top: 10px;
    display: list-item;
    text-align: -webkit-match-parent;
  }
  ol {
    padding-left: 30px;
    li {
      list-style: normal;
      list-style-position: initial;
    }
  }
}
</style>

<style lang="scss" scoped>
.support {
  padding-bottom: 35px;
  display: flex;
  align-items: flex-start;
  padding-top: 30px;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }

  &__title-bar {
    padding: 10px;
    background-color: var(--theme-primary-color);
    color: #ffffff;
    font-size: 16px;
    text-align: center;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &__sidebar {
    margin-right: 30px;
    flex: 0 0 300px;

    @media screen and (max-width: 800px) {
      margin-right: 0;
      width: 100%;
      margin-bottom: 30px;
    }
  }

  &__nav-card {
    margin-bottom: 15px;
    background-color: #ffffff;
    border-radius: 5px;

    &--contacts {
      padding: 20px;

      p:last-child {
        margin-bottom: 0;
      }
    }
  }

  &__content-card {
    flex-grow: 1;
    background: #ffffff;
    border-radius: 5px;

    @media screen and (max-width: 800px) {
      width: 100%;
    }
  }

  &__nav {
    padding: 20px 25px;
  }

  &__nav-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__nav-item {
    &:not(:last-child) {
      margin-bottom: 0.5em;
    }

    .fa {
      width: 16px;
      margin-right: 0.2em;

      &:before {
        display: flex;
        justify-content: center;
      }
    }

    &:hover .support__nav-link {
      color: #1da772;
    }
  }

  &__nav-link {
    cursor: pointer;
    white-space: nowrap;
    font-weight: lighter;

    &:hover {
      text-decoration: none;
    }

    &--active {
      color: #1da772;
    }
  }

  &__content {
    padding: 20px 25px 50px;
  }

  &__content-voc {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: #006be5;

    span {
      cursor: pointer;

      &:not(:last-child) {
        margin-bottom: 0.5em;
      }
    }
  }

  &__content-items {
    margin-top: 30px;
  }

  &__content-item {
    scroll-margin-top: 95px;
    &:not(:last-child) {
      margin-bottom: 2em;
    }
  }

  &__content-title {
    margin: 0 0 0.5em;
    font-size: 1.5rem;

    .btn {
      padding: 0 3px;
      opacity: 0.3;
    }
  }
}
.support {
  max-width: 1280px;
  margin: 0 auto;
}
.support-icon {
  width: 20px;
  height: 20px;
}
.support-icon svg {
  width: 20px;
  height: 20px;
  fill: red;
}

.faq-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #0c0e15;
  mask-image: url("/public/img/faq/bars.svg");
  mask-size: contain;
  mask-repeat: no-repeat;
  position: relative;
  margin-right: 8px;
  top: 4px;
}
.support__nav-link--active .faq-icon {
  background-color: #5eac81;
}
.support__nav-item:hover .faq-icon {
  background-color: #5eac81;
}

.faq-icon.bars {
  mask-image: url("/public/img/faq/bars.svg");
}
.faq-icon.shield {
  mask-image: url("/public/img/faq/shield.svg");
}
.faq-icon.cog {
  mask-image: url("/public/img/faq/cog.svg");
}
.faq-icon.credit_card {
  mask-image: url("/public/img/faq/credit_card.svg");
}
.faq-icon.money {
  mask-image: url("/public/img/faq/money.svg");
}
.faq-icon.line_chart {
  mask-image: url("/public/img/faq/line_chart.svg");
}
.faq-icon.exchange1 {
  mask-image: url("/public/img/faq/exchange.svg");
}
.faq-icon.id_badge {
  mask-image: url("/public/img/faq/bars.svg");
}
.faq-icon.users {
  mask-image: url("/public/img/faq/users.svg");
}
.faq-icon.shopping_cart {
  mask-image: url("/public/img/faq/bars.svg");
}
.faq-icon.list_ul {
  mask-image: url("/public/img/faq/list_ul.svg");
}
.faq-icon.rocket {
  mask-image: url("/public/img/faq/rocket.svg");
}
.faq-icon.bolt {
  mask-image: url("/public/img/faq/bolt.svg");
}
.faq-icon.gift {
  mask-image: url("/public/img/faq/gift.svg");
}
.faq-icon.handshake {
  mask-image: url("/public/img/menu/handshake.svg");
}
</style>

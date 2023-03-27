<template>
  <div v-click-outside="closeMenu" class="header__language">
    <div class="header__language__block" @click="toggleIsOpen">
      <i
        class="mainflag"
        :class="{
          'icn-lang-en': selectedLang === 'en',
          'icn-lang-ru': selectedLang === 'ru',
          'icn-lang-es': selectedLang === 'es',
          'icn-lang-fr': selectedLang === 'fr',
        }"
      >
      </i>
    </div>
    <ul
      class="navigation-language"
      :class="{ 'navigation-language__open': isOpenMenu }"
    >
      <li
        v-for="lang in supportedLanguages"
        :key="lang"
        class="navigation-language__item"
      >
        <span
          class="navigation-language__link"
          :class="{ selected: selectedLang === lang }"
          @click="setLang(lang)"
          >{{ lang }}</span
        >
      </li>
    </ul>
  </div>
</template>
<script>
import config from "~/app-config";
import menuHelper from "~/mixins/menuHelper";
import { mapActions } from "vuex";

export default {
  name: "LanguageSelector",
  mixins: [menuHelper],
  data() {
    return {
      langChanged: false,
      selectedLang: "",
      supportedLanguages: config.supportedLanguages,
    };
  },
  computed: {
    userLanguage() {
      return (
        this.$store.getters["core/profile"] &&
        this.$store.getters["core/profile"].language
      );
    },
  },
  watch: {
    userLanguage(val) {
      if (this.langChanged) {
        this.langChanged = false;
        this.$http.post("language/", {
          lang: this.selectedLang,
        });
        this.setLang(this.selectedLang);
      } else {
        this.setLang(val);
      }
    },
    $locale(val) {
      this.selectedLang = val;
    },
    selectedLang(value) {
      if (this.userLanguage) {
        this.$http.post("language/", {
          lang: value,
        });
      } else {
        this.langChanged = true;
      }
      localStorage.setItem("planguage", value);
      this.$locale = value;
      this.$i18n.locale = value;
    },
  },
  beforeMount() {
    this.selectedLang = this.$locale;
  },
  methods: {
    ...mapActions({ setLocale: "core/setLocale" }),
    setLang(lang) {
      this.closeMenu();
      this.setLocale(lang);
      this.selectedLang = lang;
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  &__language {
    cursor: pointer;
  }
}

.navigation-language {
  -webkit-border-radius: 0;
  border-radius: 0;
  position: absolute;
  background-color: #fff;
  top: 40px;
  right: 1rem;
  width: 50px;
  opacity: 0;
  visibility: hidden;
  height: 0;
  transition: all 0.1s linear;
  z-index: 1;
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.5);

  &__link {
    display: flex;
    height: 100%;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    padding: 0.5rem;
    justify-content: center;
    cursor: pointer;

    &.selected {
      background-color: #ece7f1;
    }

    &:hover {
      text-decoration: none;
      background-color: #dcdcdc;
    }

    img {
      margin-left: 15px;
    }
  }
}

.navigation-language__open {
  height: auto;
  opacity: 1;
  visibility: visible;
}

.mainflag {
  width: 22px;
  font-size: 16px;
  height: 22px;
  margin: 4px auto auto;
  background-size: contain;
  display: block;
}
</style>

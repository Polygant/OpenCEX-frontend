<template>
  <div v-click-outside="close" class="country-select">
    <div
      class="country-select__selected-country"
      :class="{ 'country-select__selected-country--opened': isOpen }"
      @click="toggle"
    >
      <span v-if="selected && !isOpen">
        <img :src="flag" :alt="selectedLabel" class="country-select__flag" />
        <span>{{ selectedLabel }}</span>
      </span>
      <span
        v-else-if="!selectedLabel && !isOpen"
        class="country-select__label-hint"
      >
        {{ $t("common.chooseCountry") }}
      </span>
      <span v-else>
        <input
          ref="search"
          v-model="searchQuery"
          class="country-select__filter-input"
          type="text"
          :placeholder="$t('common.countrySearch')"
          @click.stop
        />
      </span>
      <i class="material-icons country-select__open-close-arrow">
        <img
          width="20"
          :src="`/public/img/angle-${isOpen ? 'up' : 'down'}.svg`"
        />
      </i>
    </div>
    <template v-if="countryList.length">
      <ul
        class="country-select__list"
        :class="{ 'country-select__list--opened': isOpen }"
      >
        <li
          v-for="country in countryList"
          :key="country.value"
          class="country-select__list-item"
          @click="selectCountry(country)"
        >
          <img
            :src="country.flag"
            :alt="country.value"
            class="country-select__flag"
          />
          <span>{{ country.label }}</span>
        </li>
      </ul>
    </template>
    <template v-else>
      <div
        v-if="isOpen"
        class="country-select__list country-select__list--empty"
        :class="{ 'country-select__list--opened': isOpen }"
      >
        <span>{{ $t("common.countryNotFound") }}</span>
      </div>
    </template>
  </div>
</template>
<script>
import vClickOutside from "click-outside-vue3";

export default {
  name: "CountrySelect",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  emits: ["valid-country", "change-value"],
  data() {
    return {
      searchQuery: "",
      selected: null,
      isOpen: false,
    };
  },
  computed: {
    countries() {
      const countries = this.$store.getters["core/countriesList"];

      return Object.entries(countries).map((country) => {
        const flagId =
          country[0].toLowerCase() === "ad"
            ? "andora"
            : country[0].toLowerCase();

        return {
          label: country[1],
          value: country[0],
          flag: `/public/img/common/flags/${flagId}.gif`,
        };
      });
    },
    countryList() {
      const qString = this.searchQuery.toLowerCase();

      if (qString === "") return this.countries;

      return this.countries.filter((country) => {
        return country.label.toLowerCase().includes(qString);
      });
    },
    selectedCountryInfo() {
      return this.countryList.find(
        (country) => country.value === this.selected
      );
    },
    selectedLabel() {
      return this.selectedCountryInfo?.label || null;
    },
    flag() {
      return this.selectedCountryInfo?.flag || null;
    },
  },
  methods: {
    selectCountry(country) {
      const excludeCountries = [];

      if (excludeCountries.includes(country.value)) {
        this.$emit("valid-country", false);
        this.$notify({
          type: "error",
          text: this.$t("common.countryIncorrect"),
        });
      } else {
        this.$emit("valid-country", true);
      }

      this.close();
      this.selected = country.value;
      this.$emit("change-value", country.value);
    },
    close() {
      this.isOpen = false;
      this.searchQuery = "";
    },
    open() {
      if (!this.isOpen) {
        this.isOpen = true;
      }
    },
    toggle() {
      this.isOpen ? this.close() : this.open();
    },
  },
};
</script>

<style lang="scss">
.country-select {
  position: relative;

  &__label-hint {
    font-weight: 700;
    vertical-align: middle;
  }

  &__selected-country,
  &__list {
    background-color: white;
    border-radius: 5px;
  }

  &__selected-country {
    height: 45px;
    padding: 10px;
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: solid 1px #e0e0e0;
    color: #222222;
    border-radius: 5px;
    font-weight: 700;

    &--opened {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  &__filter-input {
    height: 25px;
    padding: 5px 10px;
    border: none !important;

    &::placeholder {
      color: lightgrey;
      font-weight: 400;
    }
  }

  &__open-close-arrow {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__list {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    overflow: auto;
    z-index: 5;
    cursor: pointer;
    max-height: 0;

    &--opened {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      max-height: 200px;
      transition: max-height 0.1s ease-out;
      outline: none;
      -webkit-box-shadow: none;
      box-shadow: none;
      border: solid 1px #e0e0e0;
      color: #222222;
      border-radius: 5px;
      font-weight: 700;
    }

    &--empty {
      height: 50px;
      color: black;
      padding: 10px;
    }
  }

  &__list-item {
    color: #000;
    border-bottom: 1px solid #cdd2d3;
    padding: 10px;

    &:first-child {
      border-top: 1px solid #cdd2d3;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  &__flag {
    margin-right: 15px;
    display: inline-block;
  }
}
</style>

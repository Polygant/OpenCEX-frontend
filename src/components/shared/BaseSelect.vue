<template>
  <div class="relative mt-8">
    <label class="base-label">{{ label }}</label>
    <div
      class="base-text-field base-select"
      :class="{ 'base-select_open': open }"
      @click="open = !open"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="base-select__selected-option pr-4"
        v-html="chosenOption?.html"
      ></div>
      <div class="base-select__options">
        <!-- eslint-disable vue/no-v-html -->
        <div
          v-for="(option, i) in options"
          :key="`${option.html}_${i}`"
          class="base-select__option base-text-field mt-1 pr-4"
          @click="ch(option.value)"
          v-html="option.html"
        />
      </div>
    </div>
  </div>
</template>

<script>
// TODO: м.б. сделать вывод html в опциях через слоты вместо v-html?
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    options: {
      type: Array,
      validator: (value) =>
        value.every(
          (option) =>
            typeof option.value !== "undefined" &&
            typeof option.html === "string"
        ),
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
  emits: ["input", "choose"],
  data() {
    return {
      open: false,
    };
  },

  computed: {
    chosenOption() {
      const output = this.options.find((option) => option.value === this.value);
      if (output) return output;
      return null;
    },
  },
  methods: {
    ch(v) {
      this.$emit("choose", v);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-select {
  position: relative;
  user-select: none;

  &__options {
    position: absolute;
    right: 0;
    left: 0;
    top: 100%;
    max-height: 300px;
    background: white;
    border-radius: 5px;
    overflow: auto;
    display: none;
  }

  &__option {
    cursor: pointer;
  }

  &__selected-option {
    cursor: pointer;
    width: 100%;
    height: 51px;

    &::after {
      content: "";
      background: url(/public/img/launchpad/icons/select_dropdown.svg);
      height: 10px;
      width: 12px;
      position: absolute;
      top: 29px;
      right: 16px;
      background-position: center;
      transform: translateY(-50%);
      z-index: 2;
    }
  }

  &_open {
    .base-select {
      &__options {
        display: block;
      }

      &__selected-option {
        &::after {
          transform: translateY(-50%) scaleY(-1);
        }
      }
    }
  }
}
.base-select__option {
  padding: 10px 20px;
  margin-bottom: 1px;
  background: #e7e9ed;
  border-radius: 5px;
}
.base-select__options {
  position: absolute;
  top: 52px;
  width: 100%;
  z-index: 3;
}
.stake-change-stake-modal__select {
  background: #e7e9ed;
  width: 100%;
  border-radius: 5px;
  font-weight: bold;
}
.base-label {
  position: absolute;
  top: -25px;
  font-weight: normal;
}
.stake-change-stake-modal-color-charcoal {
  position: relative;
  top: 20px;
}
</style>

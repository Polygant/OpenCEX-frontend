<template>
  <component
    :is="to ? (disabled ? 'span' : 'router-link') : 'button'"
    :disabled="disabled"
    :to="to"
    class="base-button"
    :class="[
      `base-button_size-${size}`,
      `base-button_variant-${variant}`,
      { 'base-button_disabled': disabled },
    ]"
    :style="{ '--base-button-color': computedColor }"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <slot />
  </component>
</template>

<script>
const colors = {
    green: "#41A07B",
    black: "#343A40",
    yellow: "#E4A542",
    orange: "#F48046",
    blue: "#2c81b0",
    lightblue: "#2399f1",
    red: "#D84F4F",
  },
  sizes = ["big", "default", "small"],
  variants = ["flat", "default"];

export default {
  props: {
    color: {
      type: String,
      default: "green",
      validator: (value) => Object.keys(colors).includes(value),
    },
    size: {
      type: String,
      default: "default",
      validator: (size) => sizes.includes(size),
    },
    variant: {
      type: String,
      default: "default",
      validator: (variant) => variants.includes(variant),
    },

    /** принудительно использовать имена вместо урлов */
    to: {
      type: Object,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["click"],

  computed: {
    computedColor() {
      return colors[this.color] || this.color;
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/css/variables";

.base-button {
  user-select: none;
  line-height: initial;
  padding: 8px 20px;
  font-size: 16px;
  text-decoration: none !important;
  font-weight: 700;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0 #bfbfbf;
  font-family: "Open Sans", sans-serif;
  white-space: nowrap;
  background: var(--base-button-color);
  align-items: center;
  height: 46px;

  &_disabled {
    opacity: 0.75;
  }

  &:hover,
  & {
    color: #fff;
  }

  &_size {
    &-big {
      font-family: Proxima Nova, sans-serif;
    }

    &-small {
      padding: 5px 15px;
      font-size: 13px;
      height: 35px;
    }
  }

  &_variant {
    &-flat {
      background: transparent;
      border-color: #eaecef;
      border-width: 1px;
      border-style: solid;
      box-shadow: none;
      &,
      &:hover {
        color: var(--base-button-color);
      }
    }
  }
}
</style>

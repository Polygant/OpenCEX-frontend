<template>
  <component
    :is="componentName"
    :to="to"
    :class="[color, btnClass, 'flex']"
    @click="$emit('click')"
  >
    <div v-if="icon" class="flex-1 flex flex-col justify-center">
      <v-icon :icon="icon" />
    </div>
    <span :class="txtClass" style="flex: 1 1 100%" class="text-left">
      <slot />
    </span>
  </component>
</template>

<script>
export default {
  name: "VButton",
  props: {
    submit: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: () => "",
    },
    color: {
      type: String,
      default: () => "white",
    },
    big: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    mobileIcon: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: () => "",
    },
    shadow: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click"],
  data: () => ({
    prepend: false,
  }),
  computed: {
    componentName() {
      return this.to ? "router-link" : this.submit ? "button" : "a";
    },
    txtClass() {
      const c = [];
      if (this.mobileIcon && this.$isMobile()) {
        c.push("hidden");
      }
      return c;
    },
    btnClass() {
      const c = ["btn"];
      if (this.prepend) {
        c.push("text-left");
      }
      if (this.big) {
        c.push("big");
      }
      if (this.small) {
        c.push("small");
      }
      if (this.disabled) {
        c.push("disabled");
      }
      return c;
    },
  },
  mounted() {
    if (this.$slots && this.$slots.prepend) {
      this.prepend = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.btn {
  font-size: 12px;
  text-transform: uppercase;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  height: 45px;
  min-width: 175px;
  text-align: center;
  padding: 11px 10px 5px;
  @apply inline-block font-bold items-center text-base cursor-pointer;
  &.green {
    @apply text-black bg-green;
  }
  &.black {
    @apply text-white bg-black;
  }
  &.yellow {
    @apply text-white bg-yellow;
  }
  &.orange {
    @apply text-white bg-orange;
  }
  &.blue {
    @apply text-white bg-blue;
  }
  &.lightblue {
    @apply text-black bg-lightblue;
  }
  &.red {
    @apply text-white bg-red;
  }
  &.big {
    height: 45px;
    font-size: 15px;
    width: 175px;
    & i {
      position: relative;
      left: -10px;
    }
  }
  &.small {
    padding: 5px 50px 5px;
    height: 34px;
    font-size: 12px;
    width: 170px;
  }
  &.large {
    padding: 7px 63px 6px;
    font-size: 15px;
  }
  &.disabled {
    color: lightgrey;
    pointer-events: none;
  }
  &:hover {
    @apply bg-opacity-75;
  }
}
</style>

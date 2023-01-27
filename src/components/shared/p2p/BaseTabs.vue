<template>
  <div class="base-tabs" :class="`base-tabs_variant_${variant}`">
    <div
      v-for="(option, i) in options"
      :key="i"
      class="base-tabs__item"
      :style="{
        background: (modelValue === option.value && option.color) || null,
      }"
      :class="{
        'base-tabs__item_active': modelValue === option.value,
        'base-tabs__item_disabled': disabled,
      }"
      @click="onSelect(i)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<script>
const variants = ["default", "light"];

export default {
  props: {
    options: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every(
          (option) =>
            typeof option.label === "string" &&
            typeof option.value !== "undefined" &&
            (!option.color || typeof option.color) // необязательный параметр, но если передан, то строка
        ),
    },

    modelValue: {
      type: [Number, String],
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    variant: {
      type: String,
      default: "default",
      validator: (variant) => variants.includes(variant),
    },
  },
  emits: ["update:modelValue"],
  methods: {
    onSelect(index) {
      if (this.disabled) return;
      this.$emit("update:modelValue", this.options[index].value);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-tabs {
  font-family: "Open Sans";
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  letter-spacing: 0.05em;
  display: inline-flex;
  border-radius: 5px;
  width: fit-content;
  &__item {
    width: 50%;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    &_active {
      cursor: default;
      user-select: none;
    }
    &_disabled {
      cursor: default;
      opacity: 0.66;
    }
  }

  &_variant {
    &_default {
      overflow: hidden;
      background: #e8e9ec;

      .base-tabs__item {
        padding: 11px 19px;
        min-width: 106px;
        transition: background-color 0.05s, color 0.05s;

        &_active {
          border-radius: 5px;
          box-shadow: 0 2px 5px 0 #bfbfbf;
          background: #41a07b;
          color: white;
        }
      }
    }

    &_light {
      .base-tabs__item {
        font-family: Open Sans;
        font-size: 14px;
        font-weight: 600;
        color: #757575;
        position: relative;
        transition: color 0.1s;

        &:not(:first-child) {
          margin-left: 23px;
        }

        &::after {
          content: "";
          position: absolute;
          height: 2px;
          background: transparent;
          transition: background-color 0.3s;
          top: 100%;
          left: 0;
          right: 0;
        }

        &_active {
          color: #2e2e2e;

          &::after {
            background: #41a07b;
          }
        }
      }
    }
  }
}
</style>

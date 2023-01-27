<template>
  <div class="base-text-field-2">
    <label
      v-if="label"
      class="base-text-field-2__label p2p-utils-label"
      :for="inputId"
      >{{ label }}</label
    >
    <input
      :id="inputId"
      ref="input"
      v-numeric.number="{
        enabled: numeric,
        dynamicModifiers: { decimal, fractional },
      }"
      :value="modelValue"
      v-bind="{
        ...$attrs,
        type: 'text',
        style: null,
        class: null,
      }"
      :fractional="digitsAfterDecimal"
      class="base-text-field-2__input p2p-utils-input"
      :class="{
        'base-text-field-2__input_trim-right': trimRight,
        'base-text-field-2__input_bold': bold,
      }"
      @input="
        isValid($event.target.value)
          ? $emit('update:modelValue', $event.target.value)
          : null
      "
    />
    <slot name="caption" />
    <div v-if="postfix || $slots.postfix" class="base-text-field-2__postfix">
      <slot name="postfix">{{ postfix }}</slot>
    </div>
  </div>
</template>

<script>
let counter = 1;

export default {
  props: {
    inputmask: {
      type: String,
      default: null,
    },

    digitsAfterDecimal: {
      type: Number,
      default: 8,
    },

    bold: {
      type: Boolean,
      default: false,
    },

    modelValue: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    postfix: {
      type: String,
      default: "",
    },

    trimRight: {
      type: Boolean,
      default: false,
    },

    numeric: {
      type: Boolean,
      default: true,
    },

    fractional: {
      type: Boolean,
      default: true,
    },

    decimal: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inputId: `base-text-field-2__unique-id-${counter++}`,
    };
  },

  mounted() {
    this.mask();
  },
  methods: {
    mask() {
      this.$refs.input.oninput = (e) => {
        if (!this.isValid(e.target.value)) {
          if (this.isValid(this.modelValue)) e.target.value = this.modelValue;
          else e.target.value = "";
        }
      };
    },

    isValid(value) {
      if (!this.inputmask) return true;
      else {
        const regex = new RegExp("^" + this.inputmask + "$");
        return regex.test(value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.base-text-field-2 {
  display: inline-block;
  position: relative;
  height: fit-content;

  &__input {
    color: #4b4b4d;
    position: relative;
    padding: 10px;
    line-height: 1.5;
    height: 43px;
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 600;
    &::placeholder {
      color: rgba(75, 75, 77, 0.8);
    }

    &:disabled {
      background: rgba(75, 75, 77, 0.09);
    }

    &_trim-right {
      border-right: none;
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    &_bold {
      font-weight: 700;
      font-size: 18px;
    }
  }

  &__postfix {
    color: rgba(75, 75, 77, 0.8);
    position: absolute;
    right: 0;
    bottom: 20px;
    transform: translateY(50%);
    padding: 2px 12px;
    pointer-events: none;
    font-weight: 600;
    &::after {
      content: "";
      position: absolute;
      right: 100%;
      top: calc(50% + 1px);
      border-left: 2px solid #e8e9ec;
      height: 12px;
      transform: translateY(-50%);
    }
  }

  &__label {
    display: block;
  }
}
</style>

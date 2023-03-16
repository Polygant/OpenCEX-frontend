<template>
  <div class="trade-input__wrapper">
    <div class="trade-input__label">
      <template v-if="label">{{ label }}:</template>
      <slot v-else name="label" />
    </div>
    <div class="trade-input">
      <input
        v-bind="{ ...$attrs, class: null }"
        :value="modelValue"
        :disabled="disabled"
        :type="textInput ? 'text' : 'number'"
        step="0.00000001"
        class="trade-input__input pr-4"
        :min="negative ? -Infinity : 0"
        :class="{ 'trade-input__input_disabled': disabled }"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span v-if="placeholder" class="trade-input__caption">
        {{ placeholder }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    negative: {
      type: Boolean,
      default: false,
    },

    textInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "focus", "blur"],
};
</script>

<style lang="scss" scoped>
.trade-input {
  position: relative;
  width: 51%;
  font-size: 14px;
  flex-shrink: 0;
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__label {
    font-size: 14px;
    font-weight: bold;
  }
  &__input {
    padding-right: 45px;
    height: 31px;
    font-size: 14px;
    &_disabled {
      font-weight: normal;
    }

    & {
      // убрать стрелочки с input[type=number]
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }
  &__caption {
    color: #eceeef;
    font-weight: bold;
    font-size: 12px;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>

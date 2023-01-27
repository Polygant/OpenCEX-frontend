<template>
  <div>
    <div v-if="label" class="base-radios__label p2p-utils-label">
      {{ label }}
    </div>
    <div class="flex flex-wrap" :class="{ 'flex-col': vertical }">
      <div
        v-for="(option, i) in options"
        :key="i"
        class="base-radios__option mb-2"
        :class="{
          'base-radios__option_widened': widenOptions,
          'base-radios__option_disabled': disabled,
        }"
        @click="selectValue(option.value)"
      >
        <div
          class="base-radios__circle mr-2"
          :class="{
            'base-radios__circle_selected': isValueSelected(option.value),
            'base-radios__circle_multiple-choice': multipleChoice,
            'base-radios__circle_disabled': disabled,
          }"
        ></div>
        <div class="base-radios__name">
          <slot v-bind="{ label: option.label, value: option.value, option }">
            {{ option.label }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    options: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every(
          (option) =>
            typeof option.label === "string" &&
            typeof option.value !== "undefined"
        ),
    },

    modelValue: {
      required: true,
    },

    widenOptions: {
      type: Boolean,
      default: false,
    },

    vertical: {
      type: Boolean,
      default: false,
    },

    multipleChoice: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],

  methods: {
    isValueSelected(value) {
      if (this.multipleChoice) {
        return this.modelValue.includes(value);
      } else return value === this.modelValue;
    },

    selectValue(value) {
      if (this.disabled) return;
      if (this.multipleChoice) {
        const valuesWithoutCurrent = this.modelValue.filter(
          (selectedValue) => selectedValue !== value
        );
        if (this.isValueSelected(value))
          this.$emit("update:modelValue", valuesWithoutCurrent);
        else
          this.$emit("update:modelValue", valuesWithoutCurrent.concat([value]));
      } else this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-radios {
  user-select: none;

  &__label {
    margin-bottom: 16px;
  }

  &__name {
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
  }

  &__option {
    display: flex;
    align-items: center;
    cursor: pointer;
    min-width: 91px;
    &:not(:last-child) {
      margin-right: 15px;
    }
    &_widened {
      flex-grow: 1;
    }
    &_disabled {
      cursor: default;
    }
  }

  &__circle {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 1.5px solid #a2a2a2;
    position: relative;
    transition: border-color 0.2s;
    &::after {
      content: "";
      width: 8px;
      height: 8px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: transparent;
      transition: background-color 0.2s;
    }

    &_multiple-choice {
      border-radius: 25%;
      &::after {
        border-radius: 25%;
      }
    }

    &_selected {
      border-color: #3dbf8c;
      &::after {
        background: #3dbf8c;
      }
    }

    &_disabled {
      opacity: 0.66;
    }
  }
}
</style>

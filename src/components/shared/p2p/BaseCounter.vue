<template>
  <div>
    <label class="p2p-utils-label">{{ label }}</label>
    <div class="p2p-utils-input base-counter">
      <button class="base-counter__operator" @click="setValue(modelValue - 1)">
        -
      </button>
      <input
        ref="input"
        v-numeric.number.decimal.fractional="{
          dynamicModifiers: { negative: isPercent },
        }"
        :value="modelValue"
        class="base-counter__input"
        :fractional="2"
        @input="setValue($event.target.value)"
      />
      <button
        class="base-counter__operator"
        @click="setValue(modelValue * 1 + 1)"
      >
        +
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isPercent: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    setValue(value) {
      this.$emit("update:modelValue", String(value));
    },
  },
};
</script>

<style lang="scss" scoped>
.base-counter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 85px;
  &__operator {
    font-size: 25px;
    font-weight: 700;
    color: #41a07b;
    width: 53px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
  &__input {
    height: 100%;
    flex-grow: 1;
    border: none;
    text-align: center !important;
    font-size: 20px;
    font-weight: 600;
    width: 0;
  }
}
</style>

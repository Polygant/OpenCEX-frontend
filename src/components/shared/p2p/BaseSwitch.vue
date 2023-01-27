<template>
  <div class="base-checkbox" @click="setValue(!modelValue)">
    <div
      class="base-checkbox__back"
      :class="{ 'base-checkbox__back_active': modelValue }"
    >
      <div
        :class="{ 'base-checkbox__slider_active': modelValue }"
        class="base-checkbox__slider"
      ></div>
    </div>
    <div class="ml-2">Professional Interface</div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue"],

  methods: {
    setValue(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-checkbox {
  $slider-height: 31px;
  $slider-width: 51px;
  align-items: center;
  display: flex;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  user-select: none;

  &__back {
    position: relative;
    height: $slider-height;
    background-color: rgba(120, 120, 128, 0.16);
    width: $slider-width;
    border-radius: #{$slider-height / 2};
    transition: background-color 0.4s;

    &_active {
      background-color: #3dbf8c;
    }
  }

  &__slider {
    position: absolute;
    top: 2px;
    left: 2px;
    height: #{$slider-height - 4px};
    width: #{$slider-height - 4px};
    background: #ffffff;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06);
    border-radius: 50%;
    transition: left 0.2s;
    &_active {
      left: calc(100% - #{$slider-height - 2px});
    }
  }
}
</style>

<template>
  <label class="base-checkbox">
    <input
      :checked="modelValue"
      type="checkbox"
      class="base-checkbox__hidden-input"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="base-checkbox__checkmark"></span>
    <span v-if="label" class="p2p-utils-label">{{ label }}</span>
  </label>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },

    label: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
};
</script>

<style lang="scss" scoped>
.base-checkbox {
  position: relative;
  padding-left: 35px;
  margin-bottom: 0;
  cursor: pointer;
}

.base-checkbox input:checked ~ .base-checkbox__checkmark {
  background-color: var(--theme-primary-color);
  border-color: var(--theme-primary-color);
}

.base-checkbox input:checked ~ .base-checkbox__checkmark:after {
  opacity: 1;
}

.base-checkbox .base-checkbox__checkmark:after {
  content: "";
  opacity: 0;
  display: block;
  position: absolute;
  top: calc(50% - 1px);
  left: calc(50%);
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: 0.2s opacity;
}

.base-checkbox__hidden-input {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  cursor: pointer;
}

.base-checkbox__checkmark {
  position: absolute;
  top: 50%;
  left: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05));
  border-radius: 5px;
  background: transparent;
  width: 23px;
  height: 23px;
  transform: translateY(-50%);
  transition: 0.25s border-color, 0.25s background-color;
}
</style>

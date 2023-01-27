<template>
  <div class="base-textarea-2">
    <label
      v-if="label"
      class="base-textarea-2__label p2p-utils-label"
      :for="inputId"
      >{{ label }}</label
    >
    <textarea
      v-bind="$attrs"
      :id="inputId"
      :placeholder="placeholder"
      :value="modelValue"
      class="base-textarea-2__input p2p-utils-input"
      type="text"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
let counter = 1;

export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
      requited: true,
    },
  },
  emits: ["update:modelValue"],

  data() {
    return {
      inputId: `base-textarea-2__unique-id-${counter++}`,
    };
  },
};
</script>

<style lang="scss" scoped>
.base-textarea-2 {
  display: flex;
  flex-direction: column;

  &__input {
    color: #4b4b4d;
    position: relative;
    padding: 10px;
    line-height: 1.5;
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 400;
    &::placeholder {
      color: rgba(75, 75, 77, 0.8);
    }
    resize: none;
  }

  &__label {
    display: block;
  }
}
</style>

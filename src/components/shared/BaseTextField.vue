<template>
  <div>
    <label v-if="label" :for="fieldId" class="base-label">{{ label }}</label>
    <component
      :is="$slots.default ? 'div' : 'input'"
      :id="fieldId"
      v-bind="$attrs"
      :value="value"
      class="base-text-field__input"
      @input="$emit('input', $event.target.value)"
    >
      <slot />
    </component>
  </div>
</template>

<script>
let uid = 0;

/**
 * переданные свойства input (например placeholder) автоматически передаются в элемент input
 *
 * SLOTS
 * - default. Если непуст, input становится div с контентом, переданным в слоте
 *            (эта фича нужна чтобы выводить текстовые блоки, выглядящие как инпуты)
 */

export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  emits: ["input"],
  data() {
    uid += 1;
    return {
      fieldId: `base-text-field__unique-id-${uid}`,
    };
  },
};
</script>

<style lang="scss" scoped>
// @import "~@/assets/styles/components";

.base-text-field__input {
  /**
    заменили класс base-text-field на base-text-field__input в этом компоненте, 
    чтобы этот стиль применялся как scoped и поэтому оверрайдил стили из main.css
  */
}
</style>

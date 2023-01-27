<template>
  <div class="relative">
    <label class="block flex customCheckbox">
      <input
        :ref="name"
        :disabled="disabled"
        :name="name"
        :checked="isChecked"
        type="checkbox"
        class="mr-2"
        @change="changeValue"
      />
      <span class="checkmark"></span>
      <slot />
    </label>
    <p v-show="errorMessage" class="font-thin text-xs h-4" :class="errorColor">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import baseFormMixin from "~/components/ui/form/mixins/baseFormMixin";
import { emittedUseField } from "~/components/ui/form/setup/emittedUseField";
import { computed, toRefs } from "vue";

export default {
  name: "CheckBox",
  mixins: [baseFormMixin],
  props: {
    trueValue: {
      type: null,
      default: true,
    },
    falseValue: {
      type: null,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { trueValue, falseValue, modelValue } = toRefs(props);
    const field = emittedUseField(props, context);
    const isChecked = computed(() => {
      return modelValue.value === trueValue.value;
    });
    const changeValue = () => {
      const val = !isChecked.value ? trueValue.value : falseValue.value;
      field.onInput(val);
    };
    return {
      ...field,
      isChecked,
      changeValue,
    };
  },
};
</script>

<style lang="sass">
.customCheckbox
  position: relative
  padding-left: 15px
  cursor: pointer
  font-size: 22px
  -webkit-user-select: none
  -moz-user-select: none
  -ms-user-select: none
  user-select: none

.customCheckbox input:checked ~ .checkmark:after
  display: block

.customCheckbox .checkmark:after
  left: 6px
  top: 2px
  width: 5px
  height: 10px
  border: solid white
  border-width: 0 3px 3px 0
  transform: rotate(45deg)

.customCheckbox .checkmark:after
  content: ""
  position: absolute
  display: none

.customCheckbox input
  position: absolute
  opacity: 0
  cursor: pointer
  height: 0
  width: 0

.customCheckbox input:checked ~ .checkmark
  background-color: var(--theme-primary-color)
  border-color: var(--theme-primary-color)

.customCheckbox .checkmark
  position: absolute
  top: 0
  left: 0
  height: 18px
  width: 18px
  background-color: #fff
  border-radius: 3px
  border: 1px solid var(--theme-primary-color)
  margin-right: 10px

.customCheckbox span
  position: relative
  left: 10px
  font-size: 15px
  font-weight: bold
  line-height: 1.2
</style>

<template>
  <div class="relative mt-4 mb-4 flex flex-col" :class="stateClass">
    <label>{{ label }}</label>
    <input
      ref="elref"
      :value="inputValue"
      :name="name"
      :type="type"
      class="w-full py-1 focus:outline-none input"
      :class="borderColor"
      @input="onInput"
    />
    <p v-show="errorMessage" class="font-thin text-xs h-4" :class="errorColor">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { emittedUseField } from "~/components/ui/form/setup/emittedUseField";
import { useFocusClass } from "~/components/ui/form/setup/useFocusClass";
import baseFormMixin from "~/components/ui/form/mixins/baseFormMixin";

export default {
  mixins: [baseFormMixin],
  props: {
    append: {
      type: String,
      default: "",
    },
    borderColor: {
      type: String,
      default: "border-gray-400",
    },
  },
  setup(props, context) {
    const field = emittedUseField(props, context);
    const focusClass = useFocusClass(field.inputValue);
    return {
      ...focusClass,
      ...field,
    };
  },
};
</script>

<style lang="sass" scoped>

input
  background-color: transparent
  border: 1px solid #C5C5C5
  border-radius: 5px
  height: 34px
  padding: 6px 10px 5px
  font-size: 14px

label
  position: absolute
  top: 7px
  transition: .3s cubic-bezier(.25,.8,.5,1)
  pointer-events: none
  transform-origin: top left

.input-focus,
.input-filled
  & label
    display: block
    transform: translateY(-22px) scale(.75)
</style>

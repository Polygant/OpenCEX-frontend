<template>
  <div class="relative mb-4 mt-4 flex flex-col" :class="stateClass">
    <label class="whitespace-nowrap">{{ label }}</label>
    <div class="select">
      <select
        ref="elref"
        :name="name"
        :value="inputValue"
        @change="
          (event) => {
            onInput(event);
            $emit('change', event);
          }
        "
      >
        <option
          v-for="item in items"
          :key="item.id"
          :value="item.id"
          :selected="modelValue === item.id"
        >
          {{ item.text }}
        </option>
      </select>
      <span class="focus" />
    </div>
    <p v-show="errorMessage" class="font-thin text-xs h-4" :class="errorColor">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import baseFormMixin from "~/components/ui/form/mixins/baseFormMixin";
import { emittedUseField } from "~/components/ui/form/setup/emittedUseField";
import { useFocusClass } from "~/components/ui/form/setup/useFocusClass";
export default {
  mixins: [baseFormMixin],
  props: {
    items: {
      type: Array,
      required: true,
    },
    selectClasses: {
      type: String,
      default: "",
    },
  },
  emits: ["change"],
  setup(props, context) {
    const fieldData = emittedUseField(props, context);
    return {
      ...useFocusClass(fieldData.inputValue),
      ...fieldData,
    };
  },
};
</script>

<style lang="sass" scoped>

select
  appearance: none
  background-color: transparent
  border: none
  margin: 0
  width: 100%
  font-family: inherit
  font-size: inherit
  cursor: inherit
  line-height: inherit
  outline: none
  padding: 7px 20px 7px 15px

select::-ms-expand
  display: none


.select
  width: 100%
  @apply border-solid border-gray-400
  border: 1px solid #a0a0a0
  border-radius: 10px
  cursor: pointer
  line-height: 1.1
  background-color: transparent
  display: grid
  grid-template-areas: "select"
  align-items: center
  position: relative

.select:not(.select--multiple)::after
  content: ">"
  transform: rotate(90deg) scaleX(0.75) scale(1.15)
  position: relative
  right: 10px
  pointer-events: none
  @apply font-medium
  justify-self: end

select,
.select:after
  grid-area: select


select[multiple]
  padding-right: 0
  height: 6rem

select[multiple] option
  white-space: normal


.select--disabled
  cursor: not-allowed
  background-color: #eee
  background-image: linear-gradient(to top, #ddd, #eee 33%)


input
  background-color: transparent

label
  position: absolute
  top: 6px
  left: 0.75rem
  transition: .3s cubic-bezier(.25,.8,.5,1)
  pointer-events: none
  transform-origin: top left

.input-focus,
.input-filled
  & label
    display: block
    top: 0px
    transform: translateY(-21px) translateX(-0.75rem) scale(.75)
    @media (max-width: 1024px)
      width: 150%
      overflow-x: hidden
      white-space: nowrap
</style>

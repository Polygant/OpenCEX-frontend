<template>
  <i :class="['inline-block v-icon', { disabled: disabled }]">
    <svg
      :width="iconWidth"
      :height="iconHeight"
      class="icon-object"
      :style="styleObject"
    >
      <use :xlink:href="`/public/sprite.svg#${iconName}`"></use>
    </svg>
  </i>
</template>

<script setup>
import { defineProps, computed, toRefs } from "vue";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  selected: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    required: false,
    default: 30,
  },
  height: {
    type: Number,
    required: false,
    default: 30,
  },
});

const styleObject = computed(() => {
  return { fill: props.color };
});

const iconName = computed(() => {
  let name = props.icon;
  if (props.selected && name === "Radio") {
    name = "RadioActive";
  }
  return name;
});

const iconWidth = toRefs(props).width;
const iconHeight = toRefs(props).height;
</script>

<style scoped>
.icon-object {
  max-width: 32px;
  max-height: 32px;
}
</style>

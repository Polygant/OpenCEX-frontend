<template>
  <div>
    <div v-for="label in labels" :key="label" @click="onLabelClick(label)">
      {{ label }}
    </div>
    {{ activeLabel }}
    <slot :name="activeLabel">Default {{ activeLabel }}</slot>
  </div>
</template>

<script>
export default {
  name: "VTabs",
  props: {
    labels: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  data() {
    return {
      activeLabel: this.$props.labels[0],
    };
  },
  methods: {
    onLabelClick(label) {
      this.activeLabel = label;
    },
  },
};
</script>

<style lang="scss"></style>

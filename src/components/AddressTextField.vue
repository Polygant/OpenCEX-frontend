<template>
  <span class="address-text-field" @copy="onCopy">
    <span @click="select">{{ shortAddress }}</span></span
  >
</template>

<script>
export default {
  props: {
    address: {
      type: String,
      required: true,
    },
  },

  computed: {
    shortAddress() {
      return this.address.length > 20
        ? this.address.slice(0, 10) +
            "..." +
            this.address.slice(this.address.length - 10)
        : this.address;
    },
  },

  methods: {
    select() {
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }

      const range = document.createRange();
      range.selectNode(this.$el);
      selection.addRange(range);
    },
    onCopy(event) {
      event.clipboardData.setData("text/plain", this.address);
      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" scoped>
.address-text-field {
  text-align: center;
  color: #000;
  line-height: 22px;
  font-size: 12px;
  background: #e8f1fb;
  font-weight: bold;
  border-radius: 5px;
  height: 34px;
  display: block;
  width: 100%;
  padding: 7px 12px;
  padding-right: 41px !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

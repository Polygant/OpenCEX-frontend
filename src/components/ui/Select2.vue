<template>
  <select
    v-model="selectedData"
    :name="name"
    class="form-control"
    :multiple="multiple"
  >
    <option
      v-for="val in select2data"
      :key="'get_coin_' + name + val.id"
      :value="val.id"
    >
      {{ val.text }}
    </option>
  </select>
</template>

<script>
export default {
  name: "VSelect2",
  props: {
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  data() {
    return {
      select2data: [],
      selectedData: "",
      optionsData: this.options,
    };
  },
  watch: {
    selectedData(val) {
      this.$emit("input", val);
    },
    options(val) {
      this.optionsData = val;
      this.formatOptions();
    },
  },
  mounted() {
    this.formatOptions();
  },
  methods: {
    formatOptions() {
      this.select2data = [];
      for (let key in this.optionsData) {
        this.select2data.push({ id: key, text: this.optionsData[key] });
      }
    },
    formatOptionTemplate(state) {
      if (!state.id) return state.text;
      return "";
    },
  },
};
</script>

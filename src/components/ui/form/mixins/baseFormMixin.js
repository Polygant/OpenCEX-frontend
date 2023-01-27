export default {
  emits: ["change", "update:modelValue"],
  props: {
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: {
      default: "",
    },
    rules: {
      type: [Object, String],
      default: undefined,
    },
    name: {
      type: String,
      default: () => Math.random().toString(16).slice(2),
    },
    errorColor: {
      type: String,
      default: "red",
    },
    shouldValidate: {
      type: Boolean,
      default: true,
    },
  },
};

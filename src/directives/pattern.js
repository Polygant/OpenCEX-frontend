const premadePatterns = {
  email:
    /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@([a-zA-Z0-9-]+\.)*([a-zA-Z0-9-]+)?)?)?$/,
};

export default {
  updated(el, binding) {
    if (el.tagName !== "INPUT") {
      el = el.querySelector("input");
    }

    const pattern = binding.value || premadePatterns[binding.arg];

    if (!pattern) {
      console.error("no pattern for v-pattern!", { el, binding });
    }

    el.patternDirectivePattern = pattern;
  },

  mounted(el) {
    if (el.tagName !== "INPUT") {
      el = el.querySelector("input");
    }

    el.oninput = () => {
      if (el.patternDirectivePattern.test(el.value))
        el.dataset.previous_input = el.value;
    };

    el.onkeyup = () => {
      if (!el.patternDirectivePattern.test(el.value)) {
        el.value = el.dataset.previous_input || "";
        el.dispatchEvent(new Event("input"));
      }
    };
  },
};

export default {
  mounted(el, binding) {
    if (typeof binding.value !== "number") return;

    const bindingElement =
      el.tagName === "INPUT" ? el : el.querySelector("input");

    bindingElement.addEventListener("input", (e) => {
      const count = binding.value;
      if (e.target.value.indexOf(".") == -1) {
        return;
      }
      if (e.target.value.length - e.target.value.indexOf(".") - 1 > count) {
        e.target.value = parseFloat(e.target.value).toFixed(count);
        e.preventDefault();
        e.target.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true,
          })
        );
      }
    });
  },
};

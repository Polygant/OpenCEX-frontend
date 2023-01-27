export default {
  mounted(el, binding) {
    init(el, binding);
  },
  updated(el, binding) {
    init(el, binding);
  },
};

function init(el, binding) {
  let position = binding.arg || "top";
  let tooltipText = binding.value || "Tooltip text";
  el.setAttribute("position", position);
  el.setAttribute("tooltip", tooltipText);
}

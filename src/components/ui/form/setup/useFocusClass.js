import { computed, onBeforeUnmount, onMounted, ref } from "vue";

export const useFocusClass = (inputValue) => {
  const elref = ref(null);
  const isFocused = ref(false);

  const stateClass = computed(() => {
    const c = [];
    if (isFocused.value) {
      c.push("input-focus");
    }
    if (inputValue.value !== null && inputValue.value !== "") {
      c.push("input-filled");
    }
    return c;
  });

  const focus = () => (isFocused.value = true);
  const blur = () => (isFocused.value = false);
  onMounted(() => {
    if (elref.value) {
      elref.value.addEventListener("focus", focus);
      elref.value.addEventListener("blur", blur);
    }
  });
  onBeforeUnmount(() => {
    if (elref.value) {
      elref.value.removeEventListener("focus", focus);
      elref.value.removeEventListener("blur", blur);
    }
  });

  return {
    stateClass,
    elref,
  };
};

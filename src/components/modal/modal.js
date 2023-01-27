import { ref } from "vue";

export const modals = ref([]);

const showModal = (params) => {
  modals.value = params;
};

const closeModal = () => {
  modals.value = [];
};

export const useModals = {
  show: showModal,
  close: closeModal,
};

export default useModals;

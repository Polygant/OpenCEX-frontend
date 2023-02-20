<template>
  <div v-if="modals.a" class="modal-wrapper">
    <div class="modal-fade" @click="clickToClose ? close() : null"></div>
    <div class="modal-window shadow-2xl">
      <img
        v-if="clickToClose"
        src="/public/img/common/close.svg"
        class="modal-root__close-button"
        @click="close"
      />
      <component :is="modals.a" v-bind="modals.b" />
    </div>
  </div>
</template>

<script setup>
import { modals } from "./modal";
import { watch, computed } from "vue";

const close = () => {
  modals.value = [];
};

const clickToClose = computed(() => modals?.c?.clickToClose !== false);

watch(modals, (value) => {
  document.body.style.overflow = (
    Array.isArray(value) ? value.length !== 0 : value
  )
    ? "hidden"
    : null;
});
</script>

<style lang="scss">
.modal-root {
  &__close-button {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}

.modal-fade {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.4;
  z-index: 111;
}
.modal-window {
  position: fixed;
  top: calc(50% + 35px);
  right: 50%;
  transform: translate(50%, -50%);
  min-width: 300px;
  max-width: 100%;
  // min-height: 200px;
  background: #fff;
  padding: 30px;
  z-index: 222;
  max-height: calc(100vh - 70px);
  overflow: auto;
}

.wallet-modal {
  .modal-content {
    font-size: 25px;
  }

  h3 {
    font-size: 1.65rem;
    text-align: center;
  }

  .title {
    font-size: 16px;
    text-align: left;

    span {
      font-size: 12px;
    }

    &--example {
      font-size: 14px;
      padding-top: 5px;
      opacity: 0.6;
      margin-bottom: 0;
    }
  }

  .input-modal {
    font-weight: 600;
    height: 42px;
    font-size: 16px;
    margin-bottom: 15px;
  }

  .error-modal {
    margin-top: 20px;
    color: #d69d51;
    font-size: 14px;
  }

  .server-fee {
    text-align: left;
    line-height: 41px;
    font-size: 16px;
    font-weight: 600;
    text-indent: 11px;
    background: none;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    height: 42px;
    width: 100%;
  }
}

.modal-action-button {
  font-weight: 600;
  text-align: left;
  background: var(--theme-primary-color);
  border: 1px solid var(--theme-primary-color);
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 50px;
  width: 100%;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    color: white;
  }
}

.modal-dialog-paragraph {
  text-align: center;
  color: #777777;
  font-size: 12px;
  margin-bottom: 3px;

  &--checkbox {
    margin-bottom: 0;
    margin-top: 15px;
    text-align: left;
    margin-left: 10px;
  }
}

.modal-dialog-title-paragraph {
  font-weight: 600;
}

// adaptive modal specific styles
.v--modal-box.v--modal {
  margin-bottom: 15px !important;
  display: flex;
  width: fit-content !important;
  left: 50% !important;
  transform: translateX(-50%);
  //margin-top: 90px !important;

  @media (max-width: 375px) {
    width: 285px !important;
  }

  @media (max-width: 750px) {
    margin-top: 65px;
  }

  .modal-dialog {
    margin: 0 !important;
    width: 100%;
  }
}

@media (min-width: 576px) {
  .modal-sm {
    max-width: 345px;
  }
}

.modal-success {
  background: var(--theme-primary-color);
  color: #fff;
  font-size: 16px;
}

.form-control.form-control-modal {
  font-weight: 600;
  font-size: 16px;
  height: 42px;
}
</style>

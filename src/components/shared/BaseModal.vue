<template>
  <div v-if="visible" class="base-modal__backdrop" @click.self="onHide">
    <div
      class="base-modal__content"
      :class="{ [`base-modal__content_${size}`]: size !== 'md' }"
    >
      <div class="base-modal__title pb-4">{{ title }}</div>
      <slot />
      <img
        v-if="!hideHeaderClose"
        class="base-modal__close-button"
        src="/public/img/common/close.svg"
        @click="onHide"
      />
    </div>
  </div>
</template>

<script>
/**
 * Компонент модалки.
 * Некоторые props компонента сделаны по апи компонента
 * b-modal из bootstrap-vue (https://bootstrap-vue.org/docs/components/modal).
 *
 * важно:
 * 1. v-model из b-modal не поддерживается, только visible
 * 2. как и в b-modal, с этим объектом нельзя использовать v-if. Используйте prop :visible
 *
 * SLOTS (https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-slots):
 * - default
 *
 * EVENTS (https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-events)
 * - hidden
 *
 * TODO: добавить no-close-on-backdrop, no-close-on-esc
 */

let uid = 1;
const shownModals = new Set(),
  widthSizes = ["sm", "md", "lg", "xl"];

export default {
  props: {
    // https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-props
    visible: {
      type: Boolean,
      default: false,
    },

    // https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-props
    hideHeaderClose: {
      type: Boolean,
      default: false,
    },

    // https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-props
    title: {
      type: String,
      default: "",
    },

    // https://bootstrap-vue.org/docs/components/modal#comp-ref-b-modal-props
    size: {
      type: String,
      default: "md",
      validator: (value) => widthSizes.includes(value),
    },
  },
  emits: ["hidden"],
  data() {
    return {
      modalId: uid++,
    };
  },

  watch: {
    visible: "toggleShow",
  },

  beforeUnmount() {
    this.toggleShow(false);
  },

  methods: {
    a() {
      return shownModals;
    },

    toggleShow(isVisible) {
      if (isVisible) shownModals.add(this.modalId);
      else shownModals.delete(this.modalId);

      this.updateBodyScroll();
    },

    updateBodyScroll() {
      if (typeof document === "undefined") return;

      const canScroll = shownModals.size === 0,
        className = "base-modal__body-scroll-mixin";

      if (canScroll) document.body.classList.remove(className);
      else document.body.classList.add(className);
    },

    onHide() {
      this.$emit("hidden");
    },
  },
};
</script>

<style lang="scss">
.base-modal__body-scroll-mixin {
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.base-modal {
  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 4;
    display: flex;
    align-items: center;
    background: rgba(27, 27, 27, 0.7);
    cursor: pointer;
  }

  &__content {
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    padding: 26px 36px;
    position: relative;
    margin: 0.5rem;
    cursor: default;

    // media queries украдены с b-modal, можно поменять как лучше
    @media (min-width: 576px) {
      max-width: 500px;
      margin: 1.75rem auto;
      &_sm {
        max-width: 300px;
      }
    }

    @media (min-width: 992px) {
      &_lg,
      &_xl {
        max-width: 800px;
      }
    }

    @media (min-width: 1200px) {
      &_xl {
        max-width: 1140px;
      }
    }
  }

  &__close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  &__title {
    font-weight: 600;
    font-size: 36px;
    line-height: 50px;
    letter-spacing: 0.05em;
    color: #2b395b;
  }
}
</style>

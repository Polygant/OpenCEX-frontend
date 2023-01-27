<template>
  <div
    v-if="showConfirmModal"
    class="modal-dialog wallet-modal"
    role="document"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div class="confirm-message">
          <p style="font-size: 16px" class="mb-4">
            {{ $t("common.confirm_action") }}
          </p>
          <slot></slot>
          <div class="confirm-message-btn-group">
            <button class="btn btn-primary" @click="onSubmit(true)">
              {{ $t("common.yes") }}
            </button>
            <button class="btn btn-danger" @click="onSubmit(false)">
              {{ $t("common.no") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showConfirmModal: {
      type: Boolean,
      default: false,
    },

    action: {
      type: Function,
      default: null,
    },

    hideOnClick: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["confirm", "close"],
  methods: {
    onSubmit(isYes) {
      if (this.action) {
        this.action(isYes);
      }
      if (this.hideOnClick) {
        this.$modal.close();
      }
      this.$emit("confirm", { confirm: isYes, hideModal: false });
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm-message {
  max-width: 400px;
  min-width: 300px;
  margin: 0 auto;
  background: #fff;
  padding: 15px 25px;
  border-radius: 5px;
  text-align: center;

  &-btn-group {
    .btn {
      width: 70px;
    }
    .btn-primary {
      margin-right: 10px;
    }
  }
}
</style>

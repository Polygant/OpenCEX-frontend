<template>
  <div
    v-if="shownNotification"
    class="modal-dialog wallet-modal"
    role="document"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div>
          <h3 class="text-capitalize">{{ shownNotification.title }}</h3>
          <div class="security-notice">
            <!-- eslint-disable vue/no-v-html -->
            <p class="my-3" v-html="shownNotification.text"></p>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary btn-block py-2"
                @click="removeNotification(shownNotification.id)"
              >
                {{ buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      default: null,
    },

    callback: {
      type: Function,
      default: null,
    },

    buttonText: {
      type: String,
      default: "OK",
    },
  },
  emits: ["close"],
  computed: {
    shownNotification() {
      return this.notification || this.$store.state.userNotifications[0];
    },
  },
  methods: {
    removeNotification(id) {
      if (!this.notification) {
        this.$store.dispatch("core/deleteUserNotifications", id);
      }
      if (this.callback) {
        this.callback();
      }
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.security-notice {
  font-size: 14px;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 40px;
}

.btn-block {
  width: 180px;
  margin: 10px auto 0 auto;
}

ul {
  list-style: disc;
  padding-left: 40px;
}

@media screen and (max-width: 600px) {
  .security-notice {
    padding: 0;
  }
}
</style>

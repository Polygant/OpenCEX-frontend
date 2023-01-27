<template>
  <div class="modal-dialog wallet-modal" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div>
          <h3 class="text-capitalize">
            {{ $t("common.security_notice.title") }}
          </h3>
          <div class="security-notice">
            <p>{{ $t("common.security_notice.info") }}</p>
            <ul>
              <li>{{ $t("common.security_notice.list_item_1") }}</li>
            </ul>
            <p>{{ $t("common.security_notice.description") }}</p>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary btn-block py-2"
                @click="goToSettings"
              >
                {{ $t("common.setup") }}
              </button>
              <button
                type="button"
                class="btn btn-danger btn-block py-2"
                @click="remindMeLater()"
              >
                {{ $t("common.remind_me_later") }}
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
  name: "Enable2FAModal",
  emits: ["close"],
  mounted() {
    localStorage.setItem("show_security_notice", "OFF");
  },
  methods: {
    remindMeLater() {
      this.$modal.close();
    },
    goToSettings() {
      this.$router.push("/settings");
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

p {
  margin-top: 15px;
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

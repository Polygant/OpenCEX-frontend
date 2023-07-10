<template>
  <div class="modal-dialog wallet-modal" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div>
          <h3 class="text-capitalize">
            {{ $t("common.deposit_modal.title") }}
          </h3>
          <div class="security-notice">
            <p class="font-bold text-center">
              {{ $t("common.deposit_modal.text") }}<br />{{
                $t("common.deposit_modal.subtext")
              }}
            </p>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary btn-block py-2"
                @click="close"
              >
                {{ $t("common.ok") }}
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
  name: "DepositModal",
  emits: ["close"],
  methods: {
    close() {
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

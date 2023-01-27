<template>
  <div class="modal-dialog wallet-modal modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div v-if="requestStatus === 'pending'">
          <h3>{{ $t("common.activation") }}</h3>
          <hr />
          <form @submit.prevent="activateP2PCode">
            <p class="title">
              {{ $t("common.p2pcode") }}
            </p>
            <input
              v-model="exchangeCode"
              class="form-control input-modal"
              type="text"
              autocomplete="off"
            />
            <button type="submit" class="btn modal-action-button">
              {{ $t("common.activatecode") }}
              <img
                width="20"
                class="float-right"
                float-right
                src="/public/img/long-arrow-right.svg"
              />
            </button>
            <div class="error-modal">
              {{ responseMessage }}
            </div>
          </form>
        </div>
        <!--SUCCESS-->
        <div v-if="requestStatus === 'success'" class="success">
          <img
            class="inline-block mt-4"
            src="/public/img/check-circle.svg"
            width="20"
            alt=""
          />
          <h3>{{ $t("common.success") }}</h3>
          <p>{{ $t("common.p2pcodeactivated") }}</p>
          <p>{{ $t("common.checkyourwallet") }}</p>
        </div>
        <!--SUCCESS-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WalletDepositFiatP2PCode",
  emits: ["close"],
  data() {
    return {
      requestStatus: "pending",
      exchangeCode: "",
      responseMessage: "",
    };
  },
  watch: {
    $route() {
      this.$modal.close();
    },
  },
  methods: {
    activateP2PCode() {
      let self = this;

      this.$http
        .post("sendfunds/activate/", {
          code: this.exchangeCode,
        })
        .then(
          () => {
            this.requestStatus = "success";
            this.exchangeCode = "";
            this.responseMessage = "";
            setTimeout(function () {
              self.exchangeCode = "";
              self.responseMessage = "";
              self.requestStatus = "pending";
            }, 3000);
          },
          (r) => {
            if (r.status === 500) {
              this.responseMessage = this.$t("common.invalid_code");
            } else if (r.data[0] === "code locked") {
              this.responseMessage = this.$t("common.freezed_code");
            } else {
              this.responseMessage = this.$t("common.invalid_code");
            }
            setTimeout(function () {
              self.responseMessage = "";
              self.requestStatus = "pending";
            }, 3000);
          }
        );
    },
  },
};
</script>
<style scoped>
.error-modal {
  color: #d69d51;
}

p {
  text-align: center;
  margin-top: 15px;
}

.success i {
  text-align: center;
  color: var(--theme-primary-color);
  width: 100%;
}
</style>

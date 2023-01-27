<template>
  <div class="modal-dialog wallet-modal modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div>
          <h3 class="text-capitalize">{{ $t("common.withdrawal") }}</h3>
          <hr />
          <div v-if="requestStatus === 'loading'" class="text-center">
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw mx-auto"></i>
          </div>
          <div v-if="requestStatus === 'fail'" class="failed text-center">
            <i class="fa fa-times-circle fa-3x fa-fw"></i>
            <h3>{{ $t("common.failed") }}</h3>
            <p>{{ $t("common.internal_error") }}</p>
          </div>
          <div v-if="requestStatus === 'success'" class="text-center">
            <img
              class="inline-block mt-4"
              src="/public/img/check-circle.svg"
              width="20"
              alt=""
            />
            <h3 class="px-5 py-3">{{ $t("common.success") }}</h3>
          </div>
          <form
            v-if="requestStatus === 'pending'"
            target="_blank"
            @submit.prevent="submitForm"
          >
            <label for="amount" class="title">
              {{ $t("common.amount") }} USDT
            </label>
            <input
              id="amount"
              v-model="amount"
              v-numeric.number.fractional
              class="form-control input-modal"
              type="phone"
              autocomplete="off"
              name="amount"
              fractional="2"
            />
            <button type="submit" class="btn modal-action-button">
              {{ $t("common.withdrawal") }}
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "RobotWithdrawModal",
  emits: ["success", "fail"],
  data() {
    return {
      requestStatus: "pending",
      responseMessage: "",
      isLoading: false,
      amount: null,
    };
  },
  methods: {
    ...mapActions({
      withdraw: "core/robot/withdraw",
      fetchInfo: "core/robot/fetchInfo",
      fetchTransactions: "core/robot/fetchTransactions",
    }),
    submitForm() {
      this.requestStatus = "loading";
      this.withdraw(-Number(this.amount))
        .then(() => {
          this.requestStatus = "success";
          this.fetchInfo();
          this.fetchTransactions();
          this.$emit("success");
        })
        .catch(() => {
          this.requestStatus = "fail";
          this.$emit("fail");
        });
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
.failed i {
  text-align: center;
  color: #a73b41;
  width: 100%;
}
</style>

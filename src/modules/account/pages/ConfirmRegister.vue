<template>
  <div
    class="logIn pb-5 confirm_reg_email"
    :style="loginBackground ? `background: ${loginBackground} !important` : {}"
  >
    <MainLogo />
    <div class="flex box white flex-col">
      <div class="logIn__title">
        {{ $t("common.email_confirmation") }}
      </div>
    </div>
    <div class="logIn__descr mb-4">
      <strong>{{ $t("common.email_sent") }}</strong>
    </div>
    <form class="logIn_form" autocomplete="off" @submit.prevent="confirmEmail">
      <input
        v-model="confirmationCode"
        required
        autocomplete="google2fa"
        class="text-center mb-4"
        type="text"
      />
      <template v-if="email">
        <div v-if="showBanner" class="logIn__descr mb-4">
          <strong>{{ $t("common.getCode") }}</strong>
          {{ $t("common.againAfter", { n: timer }) }}
        </div>
        <button
          v-else
          class="logIn__form__input logIn__form__input_button !bg-[#ffba38] block uppercase"
          type="button"
          @click="resendCode"
        >
          {{ $t("common.resend") }}
        </button>
      </template>

      <button
        class="logIn__form__input logIn__form__input_button block uppercase mb-[13px]"
        type="submit"
      >
        {{ $t("common.confirm_email") }}
      </button>

      <button
        class="logIn__register button-red block uppercase mb-[13px]"
        type="button"
        @click="cancel"
      >
        {{ $t("common.cancel") }}
      </button>
    </form>
  </div>
</template>

<script>
import MainLogo from "~/components/layout/parts/MainLogo.vue";

export default {
  components: { MainLogo },
  data() {
    return {
      showBanner: false,
      token: this.$route.params.token,
      timer: 300,
      awaitSeconds: 300,
      confirmationCode: "",
      email: "",
    };
  },
  mounted() {
    const savedTime = localStorage.getItem("confirm-email");
    this.email = this.$route.query.login_email || "";

    if (savedTime) {
      this.showBanner = true;
      this.runTimer();
    }
  },
  methods: {
    resendCode() {
      this.$http
        .post("auth/registration/resend-email/", {
          email: this.email,
        })
        .then(this.runTimer);
    },

    cancel() {
      this.$router.push("/login");
    },
    runTimer() {
      let savedTime =
        localStorage.getItem("confirm-email") ||
        `${Math.round(new Date().getTime() / 1000)}`;
      this.showBanner = true;

      localStorage.setItem("confirm-email", savedTime);

      const timerFn = () => {
        const currentTime = `${Math.round(new Date().getTime() / 1000)}`;
        if (savedTime) {
          if (this.timer > 1) {
            this.showBanner = true;
          } else {
            localStorage.removeItem("confirm-email");
            this.timer = this.awaitSeconds;
            this.showBanner = false;
            location.reload();
            clearInterval(interval);
          }
          this.timer =
            this.awaitSeconds +
            (parseFloat(savedTime) - parseFloat(currentTime));
        }
      };
      timerFn();
      let interval = setInterval(timerFn, 1000);
    },

    confirmEmail() {
      this.$http
        .post("auth/registration/verify-email/", {
          key: this.confirmationCode,
        })
        .then(() => {
          this.$notify({
            type: "success",
            title: "",
            text: this.$t("common.you_were_registered"),
          });
          this.$router.push({ name: "login" });
        })
        .catch((r) => {
          if (r.data?.type === "not_found") {
            this.$notify({
              type: "error",
              title: "",
              text: this.$t("common.invalid_code"),
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.button-red {
  background: #ff5d55;
}
.confirm_reg_email {
  text-align: center;
  .logIn__title {
    max-width: 430px;
  }

  &-actions {
    width: 220px;
    .btn {
      width: 100%;
      font-weight: bold;
      min-height: 54px;
      border: none;
      color: #fff;
      margin-bottom: 15px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 10px 25px;
      align-items: center;
    }
  }
}
.text-danger {
  width: 268px;
}
.email-again {
  color: #ffffff !important;
}
.logIn__descr {
  width: 304px;
}
</style>

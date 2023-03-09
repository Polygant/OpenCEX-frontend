<template>
  <div
    class="logIn pb-5 confirm_reg_email"
    :style="loginBackground ? `background: ${loginBackground} !important` : {}"
  >
    <MainLogo />
    <template v-if="!showBanner">
      <div class="flex box white flex-col">
        <div
          class="logIn__title"
          :style="loginText ? `color: ${loginText} !important` : {}"
        >
          {{ $t("common.confirm_reg_email") }}
        </div>
      </div>
      <div class="confirm_reg_email-actions">
        <button class="btn btn-primary btn-block" @click="resendEmail">
          <span>{{ $t("common.send") }}</span>
          <img src="/public/img/p/arrow-right.svg" height="15" alt="" />
        </button>
        <button class="btn btn-danger btn-block" @click="cancel">
          <span>{{ $t("common.cancel") }}</span>
          <img src="/public/img/p/arrow-right.svg" height="15" alt="" />
        </button>
      </div>
    </template>
    <template v-else>
      <div class="logIn__title">
        {{ $t("common.resend_reg_email_after") }} {{ timer }}
        {{ $t("common.seconds") }}
      </div>
    </template>
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
    };
  },
  mounted() {
    const savedTime = localStorage.getItem("confirm-email");
    if (savedTime) {
      this.showBanner = true;
      this.runTimer();
    }
  },
  methods: {
    resendEmail() {
      if (this.token) {
        this.$http
          .post("resend-email-confirmation/", {
            token: this.token,
          })
          .then(() => {
            localStorage.setItem(
              "confirm-email",
              `${Math.round(new Date().getTime() / 1000)}`
            );
            this.showBanner = true;
            this.runTimer();
          })
          .catch((error) => {
            this.$notify({
              type: "error",
              text: error.data?.code,
            });
            this.$router.push("/login");
          });
      } else {
        this.$router.push("/login");
      }
    },
    cancel() {
      this.$router.push("/login");
    },
    runTimer() {
      let savedTime = localStorage.getItem("confirm-email");
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>

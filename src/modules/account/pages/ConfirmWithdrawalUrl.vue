<template>
  <div>
    <div
      v-if="!show_data"
      class="logIn pb-5"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <MainLogo />
      <div
        class="logIn__title"
        :style="loginText ? `color: ${loginText} !important` : {}"
      >
        {{ $t("common.pleasewait") }}
      </div>
    </div>
    <div
      v-if="show_data && wrong_token"
      class="logIn pb-5"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <MainLogo />
      <div class="logIn__title">{{ $t("common.wrongtoken") }}</div>
      <br />
      <button class="btn btn--wallet btn-primary" @click="goToWallet()">
        {{ $t("common.wallet") }}
        <img
          width="20"
          class="float-right"
          float-right
          src="/public/img/long-arrow-right.svg"
        />
      </button>
    </div>
    <div
      v-if="show_data && !wrong_token"
      class="logIn pb-5"
      :style="
        loginBackground ? `background: ${loginBackground} !important` : {}
      "
    >
      <MainLogo />
      <div v-if="!isEverythingOk" class="logIn__title" style="max-width: 426px">
        {{ $t("common.withdreq") }}
      </div>
      <br v-if="!isEverythingOk" />
      <div v-if="!isEverythingOk">
        <div class="grid grid-cols-2">
          <div class="col-xs-6" style="text-align: left">
            <div style="max-width: 426px" class="wr-line">
              <b>{{ $t("common.date") }}:</b>
            </div>
            <div style="max-width: 426px" class="wr-line">
              <b>{{ $t("common.currency") }}:</b>
            </div>
            <div style="max-width: 426px" class="wr-line">
              <b>{{ $t("common.amount") }}:</b>
            </div>
            <div style="max-width: 426px" class="wr-line">
              <b>{{ $t("common.method") }}:</b>
            </div>
            <div style="max-width: 426px" class="wr-line">
              <b>{{ $t("common.dest") }}:</b>
            </div>
          </div>
          <div class="col-xs-6" style="text-align: left; max-width: 200px">
            <div style="max-width: 426px" class="wr-line">
              {{ convertDate(request_data["created"]) }}
            </div>
            <div style="max-width: 426px" class="wr-line">
              {{ request_data["currency"] }}
            </div>
            <div style="max-width: 426px" class="wr-line">
              {{ request_data["amount"] }}
            </div>
            <div style="max-width: 426px" class="wr-line">
              {{ request_data["method"] }}
            </div>
            <div style="max-width: 426px" class="wr-line">
              {{ request_data["destination"] }}
            </div>
          </div>
        </div>
      </div>
      <br />
      <button
        v-if="!isEverythingOk"
        type="submit"
        class="btn btn-primary"
        style="margin-top: 20px; height: 50px; width: 200px"
        @click="confirmWithdrawal()"
      >
        {{ $t("common.confirm") }}
        <img
          width="20"
          class="float-right"
          float-right
          src="/public/img/long-arrow-right.svg"
        />
      </button>
      <button
        v-if="!isEverythingOk"
        type="submit"
        class="btn btn-danger"
        style="text-align: left; margin-top: 20px; height: 50px; width: 200px"
        @click="cancelWithdrawal()"
      >
        {{ $t("common.cancel") }}
        <img
          width="20"
          class="float-right"
          float-right
          src="/public/img/long-arrow-right.svg"
        />
      </button>
      <div
        v-if="!isEverythingOk"
        style="max-width: 426px; color: #b74a4a; height: 25px"
      >
        {{ errormsg }}
      </div>
      <div
        v-if="isEverythingOk && confirmed_ans"
        class="logIn__title"
        style="max-width: 426px"
      >
        {{ $t("common.requestconfirmed") }}
      </div>
      <div
        v-if="isEverythingOk && !confirmed_ans"
        class="logIn__title"
        style="max-width: 426px"
      >
        {{ $t("common.cancelled") }}
      </div>
      <button
        v-if="isEverythingOk"
        class="btn btn--wallet btn-primary"
        @click="goToWallet()"
      >
        {{ $t("common.wallet") }}
        <img
          width="20"
          class="float-right"
          float-right
          src="/public/img/long-arrow-right.svg"
        />
      </button>
    </div>
  </div>
</template>

<script>
import MainLogo from "~/components/layout/parts/MainLogo.vue";

export default {
  name: "ConfirmWithdrawalUrl",
  components: { MainLogo },
  // eslint-disable-next-line vue/require-prop-types
  props: ["token"],
  data() {
    return {
      user_token: this.token,
      show_data: false,
      wrong_token: false,
      request_data: {
        amount: 0,
        created: "",
        currency: "",
        method: "",
        destination: "",
      },
      isEverythingOk: false,
      errormsg: "",
      confirmed_ans: false,
    };
  },
  mounted() {
    this.$http
      .get("withdrawal/withdrawal-request-info/" + this.user_token)
      .then(
        (response) => {
          this.request_data = response.data;
          this.request_data["amount"] = response.data["amount"];
          this.request_data["currency"] = response.data["currency"];

          if (response.data["sci_gate_id"]) {
            const id = response.data["sci_gate_id"];

            if (id === 1) {
              const resDataMethod = (this.request_data["method"] =
                response.data["data"]["method"]);

              if (resDataMethod === "qiwi") {
                this.request_data["destination"] =
                  response.data["data"]["details"]["phone"];
              } else if (
                resDataMethod === "mastercard" ||
                resDataMethod === "visa"
              ) {
                this.request_data["destination"] =
                  response.data["data"]["details"]["pan"];
              }
            } else if (id === 2) {
              this.request_data["method"] = "AdvCash";
              this.request_data["destination"] =
                response.data["data"]["recipient"];
            } else if (id === 3) {
              this.request_data["method"] =
                response.data["data"]["payment_system"];
              this.request_data["destination"] =
                response.data["data"]["recipient_account"];
            }
          } else {
            this.request_data["method"] = response.data["currency"];
            this.request_data["destination"] =
              response.data["data"]["destination"];
          }
          this.wrong_token = false;
          this.show_data = true;
        },
        () => {
          this.wrong_token = true;
          this.show_data = true;
        }
      );
  },
  methods: {
    convertDate(ptime) {
      let dateArr = ptime.split(" ");
      let date = dateArr[0].split("-");
      return `${date[2]}.${date[1]}.${date[0]} ${dateArr[1]}`;
    },
    goToWallet() {
      this.$router.push("/wallet");
    },
    confirmWithdrawal() {
      this.$http
        .post("withdrawal/confirm-withdrawal-request", {
          confirmation_token: this.user_token,
        })
        .then(
          () => {
            this.confirmed_ans = true;
            this.isEverythingOk = true;
            this.errormsg = "";
          },
          (r) => {
            console.error(r.data);
            this.errormsg = this.$t("common.wrongtoken");
          }
        );
    },
    cancelWithdrawal() {
      this.$http
        .post("withdrawal/cancel-withdrawal-request", {
          confirmation_token: this.user_token,
        })
        .then(
          () => {
            this.confirmed_ans = false;
            this.isEverythingOk = true;
            this.errormsg = "";
          },
          (r) => {
            console.error(r.data);
            this.errormsg = this.$t("common.wrongtoken");
          }
        );
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  border: none;
  background-color: transparent;
  outline: none;

  &--wallet {
    text-transform: uppercase;
    font-weight: 600;
    text-align: left;
    background: var(--theme-primary-color);
    border: 1px solid var(--theme-primary-color);
    border-radius: 4px;
    margin-top: 20px;
    height: 50px;
    width: 200px;
    color: white;
  }
}
.btn--wallet {
  border: none !important;
}
</style>

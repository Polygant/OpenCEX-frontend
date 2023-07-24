<template>
  <div class="update-order-modal">
    <div class="modal-body">
      <div v-if="!isSuccess">
        <h3 class="text-center">
          <template v-if="order.type === 0">
            {{ $t("common.updlimitord") }}
          </template>
          <template v-else-if="order.type === 2">
            {{ $t("common.updbfxord") }}
          </template>
          <template v-else-if="order.type === 4">
            {{ $t("common.updstoplimitord") }}
          </template>
        </h3>
        <hr />
        <p class="update-order-modal__label text-center">
          {{ order.quantity_left }}
          {{ currencies.base }}
          {{ $t("common.leftinord") }}
        </p>
        <div v-if="minSum > 0.0" class="update-order-modal__caption">
          {{ $t("common.youcant") }} {{ minSum }}
          {{ currencies.base }}
        </div>
        <form @submit.prevent="onSubmit">
          <template v-if="order.type === 0">
            <p class="update-order-modal__label">
              {{ $t("common.changeprice") }} ({{ currencies.quote }}):
            </p>
            <input
              v-model="formData.price"
              v-numeric.number.decimal.fractional
              fractional="8"
              required
              type="text"
              autocomplete="off"
            />
          </template>
          <template v-else-if="order.type === 2">
            <p class="update-order-modal__label">
              {{ $t("common.changepercent") }} (%):
            </p>
            <input
              v-model="formData.otc_percent"
              v-numeric.number.decimal.fractional.negative
              fractional="8"
              type="text"
              autocomplete="off"
            />
            <p class="update-order-modal__label">
              <template v-if="order.type === 0">{{
                $t("common.changemaxprice")
              }}</template>
              <template v-else-if="order.type === 2">{{
                $t("common.changeminprice")
              }}</template>
              ({{ currencies.quote }}):
            </p>
            <input
              v-model="formData.otc_limit"
              v-numeric.number.decimal.fractional
              fractional="8"
              type="text"
              autocomplete="off"
            />
          </template>
          <template v-else-if="order.type === 4">
            <p class="update-order-modal__label">
              {{ $t("common.change_stop_price") }} ({{ currencies.base }}):
            </p>
            <input
              v-model="formData.stop"
              v-numeric.number.decimal.fractional
              fractional="8"
              type="text"
              autocomplete="off"
            />
            <p class="update-order-modal__label">
              {{ $t("common.change_limit_price") }} ({{ currencies.base }}):
            </p>
            <input
              v-model="formData.price"
              v-numeric.number.decimal.fractional
              fractional="8"
              type="text"
              autocomplete="off"
            />
          </template>
          <p class="update-order-modal__label">
            {{ $t("common.changequantity") }} ({{ currencies.base }}):
          </p>
          <input
            v-model="formData.quantity"
            v-numeric.number.decimal.fractional
            fractional="8"
            required
            type="text"
            autocomplete="off"
          />
          <div class="bottom-text">
            {{ $t("common.allbalance") }}:
            {{ filteredCoins?.[balanceCoin]?.actual }} {{ balanceCoin }}
          </div>
          <button
            type="submit"
            :disabled="isFormDisabled"
            class="btn update-order-modal__submit-button"
            :style="mainColor ? `background: ${mainColor} !important` : {}"
          >
            {{ $t("common.updateord") }}
            <i class="fa fa-long-arrow-right pull-right"></i>
          </button>
        </form>
      </div>
      <div v-else class="p-4 text-center">
        <img
          class="inline-block"
          src="/public/img/check-circle.svg"
          width="20"
          alt=""
        />
        <h3 class="text-center">{{ $t("common.success") }}</h3>
        <p class="text-center" style="font-size: 16px">
          {{ $t("common.ordwaschanged") }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import getFixedDecimal from "~/mixins/getFixedDecimal";
import { mapGetters } from "vuex";

export default {
  mixins: [getFixedDecimal],
  props: {
    order: {
      type: Object,
      required: true,
    },

    onError: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      isSuccess: false,
      isFormDisabled: false,
      formData: {
        price: 0,
        quantity: 0,
        otc_percent: 0,
        otc_limit: 0,
        stop: 0,
      },
    };
  },

  computed: {
    ...mapGetters({ coins: "core/coins" }),
    currencies() {
      return {
        base: this.order.pair.split("-")[0],
        quote: this.order.pair.split("-")[1],
      };
    },
    balanceCoin() {
      if (this.order.operation === 1) {
        return this.order.pair.split("-")[0];
      } else {
        return this.order.pair.split("-")[1];
      }
    },
    minSum() {
      return parseFloat(
        (this.order.quantity - this.order.quantity_left).toFixed(8)
      );
    },
    filteredCoins() {
      return Object.fromEntries(
        Object.entries(this.coins).filter(([, coin]) => {
          return coin.active && !coin.disable_all;
        })
      );
    },
  },

  watch: {
    order: {
      deep: true,
      immediate: true,
      handler(order) {
        if (!order) return;
        else if (order.type === 0) {
          this.formData.price = order.price;
          this.formData.quantity = order.quantity;
        } else if (order.type === 2) {
          this.formData.otc_percent = order.otc_percent;
          this.formData.otc_limit = order.otc_limit;
          this.formData.quantity = order.quantity;
        } else if (order.type === 4) {
          this.formData.price = order.price;
          this.formData.quantity = order.quantity;
          this.formData.stop = order.stop;
        }
      },
    },
  },

  methods: {
    toNumber(value) {
      return this.getFixedDecimal(value.toString().replace(",", "."));
    },

    onSubmit() {
      this.isFormDisabled = true;

      let formData = {};

      if (this.order.type === 0)
        formData = {
          id: this.order.id,
          quantity: String(this.toNumber(this.formData.quantity)),
          price: this.toNumber(this.formData.price),
        };
      else if (this.order.type === 2)
        formData = {
          id: this.order.id,
          quantity: String(this.toNumber(this.formData.quantity)),
          otc_limit: this.toNumber(this.formData.otc_limit),
          otc_percent: this.toNumber(this.formData.otc_percent),
        };
      else if (this.order.type === 4)
        formData = {
          id: this.order.id,
          quantity: String(this.toNumber(this.formData.quantity)),
          price: this.toNumber(this.formData.price),
          stop: this.toNumber(this.formData.stop),
        };

      this.$http
        .post("order_update/", formData)
        .then(
          () => {
            this.isSuccess = true;
            setTimeout(() => this.$modal.close(), 3000);
          },
          (r) => this.onError(this.updateOrderErrorParser(r.data))
        )
        .finally(() => (this.isFormDisabled = false));
    },

    updateOrderErrorParser(data) {
      const detail = data.detail;

      if (detail && detail.message) return detail.message;

      let ans = "";
      switch (true) {
        case data.non_field_errors &&
          data.non_field_errors[0] === "quantity <= 0":
        case !!data.quantity || !!detail?.quantity:
          ans = this.$t("common.order_errors.wrong_quantity");
          break;
        case data.non_field_errors && data.non_field_errors[0] === "price <= 0":
        case !!data.price || !!detail?.price:
          ans = this.$t("common.order_errors.wrong_price");
          break;
        case !!data.percent || !!detail?.percent:
          ans = this.$t("common.order_errors.wrong_percent");
          break;
        case !!data.limit || !!detail?.limit:
          ans = this.$t("common.order_errors.wrong_limit");
          break;
        case detail === "can not change not opened order":
          ans = this.$t("common.order_errors.order_closed");
          break;
        case detail === "Bar order type!":
          ans = this.$t("common.order_errors.wrong_order_type");
          break;
        case detail === "special data is valid only for bitfinex!":
          ans = this.$t("common.order_errors.not_auto");
          break;
        case detail === "bad quantity!":
          ans = this.$t("common.order_errors.bad_quantity");
          break;
        case detail === "order no found":
          ans = this.$t("common.order_errors.order_not_found");
          break;
        case detail === "order not opened":
          ans = this.$t("common.order_errors.not_opened");
          break;
        case detail === "too small quantity":
          ans = this.$t("common.order_errors.small_quantity");
          break;
        case detail &&
          detail.slice &&
          detail.slice(0, 16) === "Order cost limit":
          ans = this.$t("common.order_errors.cost_limit");
          break;
        case data.message.code === "not_enough_funds":
          ans = this.$t("common.order_errors.no_funds");
          break;
        case data?.type?.message === "order_max_cost":
          ans = this.$t("common.check_maximum_limit");
          break;
        case data?.message?.code === "order_quantity_invalid_error":
          ans = this.$t("common.check_min_limit");
          break;
        case data?.message?.code === "order_price_invalid_error":
          ans = this.$t("common.order_price_invalid");
          break;
        case data?.message?.code === "order_stop_price_invalid_error":
          ans = this.$t("common.order_price_invalid");
          break;
        // case data?.message?.code === "order_price_invalid_error":
        //   ans = this.$t("common.order_price_invalid");
        //   break;
        // case data?.message?.code === "order_price_invalid_error":
        //   ans = this.$t("common.order_price_invalid");
        //   break;
        default:
          ans = this.$t("common.order_errors.error");
      }
      return ans;
    },
  },
};
</script>

<style lang="scss" scoped>
.update-order-modal {
  max-width: 343px;
  font-size: 25px;
  background-color: #fff;

  &__label {
    margin-top: 17px;
    margin-bottom: 12px;
    font-size: 16px;
  }

  &__caption {
    font-size: 13px;
    text-align: center;
    margin: 10px auto;
    padding: 5px;
    border-radius: 4px;
    background-color: rgb(231, 244, 253);
    border: 1px solid rgb(212, 212, 212);
  }

  &__submit-button {
    font-weight: 600;
    text-align: left;
    background: rgb(60, 191, 141);
    border-radius: 4px;
    margin-top: 20px;
    height: 50px;
    width: 100%;
    color: white;
  }

  &__success-icon {
    text-align: center;
    color: var(--theme-primary-color);
    display: inline-block;
    width: 100%;
  }
  .bottom-text {
    font-size: 15px;
    padding-top: 12px;
  }
}
</style>

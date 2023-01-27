<template>
  <div class="walletlist walletlist--codes">
    <!--CODES-->
    <div class="wallet__title">
      {{ $t("common.myp2pcodes") }}
      <button class="pull-right" style="margin: 0 20px" @click="updateCodes">
        <img
          src="/public/img/common/updata.png"
          style="width: 11px"
          alt="update"
        />
      </button>
    </div>
    <div class="codes">
      <div class="codes__content">
        <div style="max-height: 550px">
          <div class="nodata not-information">
            <div class="icon smile">
              <img src="/public/img/Smile.svg" alt />
            </div>
            <div class="txt">{{ $t("common.nodata") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getRegularNumber from "~/mixins/getRegularNumber";

export default {
  name: "WalletList",
  mixins: [getRegularNumber],
  props: {
    getPrettyDate: {
      type: [Array, Object],
      default: function () {
        return {};
      },
    },
    updateCodes: {
      type: [Array, Object],
      default: function () {
        return {};
      },
    },
    resendLoader: {
      type: [Array, Object],
      default: function () {
        return {};
      },
    },
    resendCode: {
      type: [Array, Object],
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      windowWidth: 0,
      back: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.nodata {
  padding: 20px;
}

.walletlist--codes {
  max-height: none;
  height: inherit;
  min-height: 170px;
}

.codes {
  margin-bottom: 1em;

  &__header {
    padding: 0 27px;
    display: flex;
    align-items: center;
    text-transform: uppercase;
    font-size: 11px;

    @media screen and (max-width: 900px) {
      display: none;
    }

    span {
      padding: 10px 5px;
    }
  }

  &__code {
    width: 16%;
  }

  &__status {
    width: 17%;
  }

  &__amount {
    width: 10%;
  }

  &__currency {
    width: 9%;
  }

  &__date {
    width: 16%;
  }

  &__recipient {
    width: 22%;
  }

  &__actions {
    width: 10%;
    text-align: right;
    justify-content: flex-end !important;
  }

  &__content {
    font-size: 12px;
    overflow-x: auto;

    .codes__item {
      padding: 5px;
      display: flex;
      align-items: center;

      @media screen and (max-width: 900px) {
        width: 100% !important;
        display: flex;
        justify-content: space-between;
      }

      button {
        width: 50px;
        height: 30px;
        font-size: 1em;
        @media screen and (max-width: 900px) {
          margin: auto;
        }
      }
    }
  }

  &__items {
    min-height: 40px;
    padding: 0 27px;
    display: flex;
    width: 100%;

    &:nth-child(even) {
      background: rgba(0, 0, 0, 0.05);
    }

    @media screen and (max-width: 900px) {
      flex-direction: column;
    }
  }
}

.thead {
  display: none;

  @media screen and (max-width: 900px) {
    display: block;
  }
}

.hidden {
  width: 55%;
  display: flex;

  @media screen and (max-width: 900px) {
    width: 100%;
    flex-direction: column;
  }

  .codes__code {
    width: 29%;
  }

  .codes__status {
    width: 31%;
  }
}

.expandData {
  display: flex;
  justify-content: center;
  padding: 0.5em;
  background: #f8f9fa;
  border-radius: 3px;
  cursor: pointer;
  font-size: 1.5rem;
  color: #007bff;

  .fa {
    transition: all 0.3s ease-in-out;
  }

  &--expanded {
    .fa {
      transform: rotate(45deg);
    }
  }
}

@media screen and (max-width: 686px) {
  .walletTable__item {
    line-height: 25px;
  }
}
</style>

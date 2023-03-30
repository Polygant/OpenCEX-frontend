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
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 60 60"
                style="width: 60px; height: 60px"
              >
                <path
                  class="smile-st0"
                  d="M44.5 43.2C40.6 38.6 36 36 30 36s-10.6 2.6-14.5 7.2c-.5.6-.4 1.5.2 2 .3.2.6.3.9.3.4 0 .8-.2 1.1-.5 3.3-3.9 7.2-6.2 12.3-6.2 5.1 0 9 2.3 12.3 6.2.3.3.7.5 1.1.5.3 0 .7-.1.9-.3.6-.5.7-1.4.2-2z"
                />
                <path
                  class="smile-st1"
                  d="M30 60C13.4 60 0 46.6 0 30S13.4 0 30 0s30 13.4 30 30-13.4 30-30 30zm0-56C15.6 4 4 15.6 4 30s11.6 26 26 26 26-11.6 26-26S44.4 4 30 4z"
                />
                <path
                  class="smile-st1"
                  d="M18.5 15c4.1 0 7.5 3.4 7.5 7.5S22.6 30 18.5 30 11 26.6 11 22.5s3.4-7.5 7.5-7.5z"
                />
                <path
                  class="smile-st3"
                  d="M18.5 18c2.5 0 4.5 2 4.5 4.5S21 27 18.5 27 14 25 14 22.5s2-4.5 4.5-4.5z"
                />
                <path
                  class="smile-st1"
                  d="M18.5 20c1.4 0 2.5 1.1 2.5 2.5S19.9 25 18.5 25 16 23.9 16 22.5s1.1-2.5 2.5-2.5zm-5.2-4.4l4.2-4.2c.6-.6 1.5-.6 2.1 0 .6.6.6 1.5 0 2.1l-4.2 4.2c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.6 0-2.1zm28.2-.6c4.1 0 7.5 3.4 7.5 7.5S45.6 30 41.5 30 34 26.6 34 22.5s3.4-7.5 7.5-7.5z"
                />
                <path
                  class="smile-st3"
                  d="M41.5 18c2.5 0 4.5 2 4.5 4.5S44 27 41.5 27 37 25 37 22.5s2-4.5 4.5-4.5z"
                />
                <path
                  class="smile-st1"
                  d="M41.5 20c1.4 0 2.5 1.1 2.5 2.5S42.9 25 41.5 25 39 23.9 39 22.5s1.1-2.5 2.5-2.5zm5.2-4.4l-4.2-4.2c-.6-.6-1.5-.6-2.1 0-.6.6-.6 1.5 0 2.1l4.2 4.2c.6.6 1.5.6 2.1 0 .6-.6.6-1.6 0-2.1z"
                />
              </svg>
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

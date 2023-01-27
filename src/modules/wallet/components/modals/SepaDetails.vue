<template>
  <div class="deposit-address">
    <p>
      <b>Account holder:</b>
      <span>
        <b>{{ acc }}</b>
        <button class="btn" @click="copyToBuffer(acc)">
          <i class="fa fa-copy"></i>
        </button>
      </span>
    </p>
    <p>
      <b>IBAN Number:</b>
      <span>
        <b>{{ iban }}</b>
        <button class="btn" @click="copyToBuffer(iban)">
          <i class="fa fa-copy"></i>
        </button>
      </span>
    </p>
    <p>
      <b>BIC Code:</b>
      <span>
        <b>{{ bic }}</b>
        <button class="btn" @click="copyToBuffer(bic)">
          <i class="fa fa-copy"></i>
        </button>
      </span>
    </p>
    <p>
      <b>Payment Reference:</b>
      <span>
        <b>{{ id }}</b>
        <button class="btn" @click="copyToBuffer(id)">
          <i class="fa fa-copy"></i>
        </button>
      </span>
    </p>
    <p class="hint">
      {{ $t("common.sepaInfoHint") }}
    </p>
  </div>
</template>
<script>
import copyToBuffer from "~/mixins/copyToBuffer";

export default {
  name: "SepaDetails",
  mixins: [copyToBuffer],
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      bic: "VIPULT22",
      acc: "OpenCEXchange OÜ",
      iban: "LT533570020000005230",
    };
  },
};
</script>
<style lang="scss" scoped>
.deposit-address {
  border-left: none;
  margin-bottom: 0;
  width: 460px;

  .hint {
    font-size: 14px;
    margin-top: 25px;
    justify-content: center;
    text-align: center;
    color: #ef3d3d;
  }

  @media (min-width: 1460px) {
    width: 510px;
  }

  @media screen and (max-width: 675px) {
    width: 100%;
  }

  p {
    margin: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @media (max-width: 375px) {
      align-items: flex-start;
    }

    b {
      display: inline-block;
      flex: 1;
      font-weight: 400;

      @media (min-width: 1460px) {
        width: 190px;
      }
    }

    span {
      margin-left: 5px;

      b {
        min-width: 190px;
        font-family: monospace;
        font-weight: 600;
      }
    }

    @media (max-width: 460px) {
      flex-direction: column;

      & > b {
        width: 100%;
      }

      span {
        margin-left: 0;
      }
    }
  }

  .btn {
    background: #a9a6a6;
    border-radius: 5px;
    height: 30px;
    width: 30px;
    color: #ffffff;
    padding: 0;
  }

  .id {
    margin: 1rem;
    overflow: hidden;
    min-width: 70%;
    position: relative;
  }
}
</style>

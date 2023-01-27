<template>
  <div :class="contentClass" style="min-height: 681px">
    <div class="" style="margin-bottom: 20px; margin-top: 20px">
      <div class="kyc-block">
        <div class="plate">
          <KycFrame class="frame" />
          <button class="btn btn-success" type="button" @click="$router.go(-1)">
            {{ $t("common.back") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import KycFrame from "~/components/profileSettings/KycFrame.vue";

const CONTENT_CLASS = "fees_page";

export default {
  name: "KYC",
  components: {
    KycFrame,
  },
  data() {
    return {
      contentClass: CONTENT_CLASS,
    };
  },
};
</script>
<style lang="scss" scoped>
.btn {
  margin: 10px auto;
}

.plate {
  min-height: 460px;
  text-align: center;
}

@media (min-width: 850px) {
  .plate {
    min-height: 660px;
  }
  .frame {
    min-height: 575px;
  }
}
.kyc-block {
  width: 100%;
  margin-left: auto;
  left: auto;
  right: auto;
  float: left;
  box-sizing: border-box;
  padding: 0 0.5rem;
  min-height: 681px;
}
</style>

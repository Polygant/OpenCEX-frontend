<template>
  <div class="base-steps">
    <div v-for="(step, i) in steps" :key="i" class="base-steps__step">
      <div
        :class="{
          'base-steps__step-number_following': i + 1 > currentStep,
        }"
        class="base-steps__step-number"
      >
        <template v-if="i + 1 < currentStep">
          <svg height="18" width="18">
            <use
              color="white"
              href="/public/img/p2p/sprite.svg#checkmark"
            ></use>
          </svg>
        </template>
        <template v-else>
          {{ i + 1 }}
        </template>
      </div>
      <div class="base-steps__step-name">{{ step }}</div>
      <div v-if="i !== steps.length - 1" class="base-steps__dash"></div>
      <div v-if="i !== steps.length - 1" class="base-steps__dash"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
      validator: (value) => value.every((el) => typeof el === "string"),
    },

    currentStep: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-steps {
  display: flex;
  height: 52px;

  &__step {
    flex-grow: 1;
    position: relative;

    &:last-child {
      flex-grow: 0;
      width: 0;
    }
  }

  &__step-number {
    font-size: 14px;
    font-weight: 600;
    width: 20px;
    height: 20px;
    background: #41a07b;
    border-radius: 50%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateX(-50%);
    transition: background-color 0.35s;
    z-index: 1;
    line-height: 0;
    padding-top: 2px;

    &_following {
      background: #eaecef;
      color: #a1a1a1;
    }
  }

  &__step-name {
    font-size: 12px;
    font-weight: 400;
    position: absolute;
    left: 0;
    top: 34px;
    transform: translateX(-50%);
    text-align: center;
  }

  &__dash {
    width: 100%;
    position: absolute;
    top: 10px;
    left: 0;
    border-top: 1px dashed #cccdcf;
    z-index: 0;
  }
}
</style>

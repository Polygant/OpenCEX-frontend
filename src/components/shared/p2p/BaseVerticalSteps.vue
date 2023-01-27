<template>
  <div class="base-vertical-steps">
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="base-vertical-steps__step-block"
      :class="{ 'base-vertical-steps__step-block_hide-steps': hideSteps }"
    >
      <div class="base-vertical-steps__title">{{ step }}</div>
      <div
        v-if="$slots[`step(${i + 1})`]"
        class="base-vertical-steps__step-content"
        :class="{
          'base-vertical-steps__step-content_bordered-bottom': hideSteps,
        }"
      >
        <slot :name="`step(${i + 1})`"> </slot>
      </div>
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

    hideSteps: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.base-vertical-steps {
  &__title {
    font-family: Open Sans;
    font-size: 18px;
    font-weight: 600;
  }

  &__step-content {
    padding: 23px 0;

    &_bordered-bottom {
      margin-bottom: 23px;
      border-bottom: 1px dashed #cccdcf;
    }
  }

  &__step-block {
    padding-left: 29px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      border: 1px solid #61a667;
      width: 10px;
      height: 10px;
      border-radius: 50%;

      left: 0;
      top: 8px;
    }
    &:not(:last-child)::before {
      content: "";
      border-left: 1px dashed #cccdcf;
      bottom: -8px;
      position: absolute;
      top: 18px;
      left: 5px;
    }

    &_hide-steps {
      &::after {
        content: none;
      }
      &:not(:last-child)::before {
        content: none;
      }
    }
  }
}
</style>

<template>
  <div class="flex align-center">
    <input
      class="base-copy-input__input base-copy-input__active-element"
      onClick="this.setSelectionRange(0, this.value.length)"
      readonly="readonly"
      :value="value"
    />
    <button class="ml-3 p-0" @click="copyToBuffer(value)">
      <div class="base-copy-input__icon base-copy-input__active-element">
        <img src="/public/img/copy.svg" />
      </div>
    </button>
  </div>
</template>

<script>
import copyToBuffer from "~/mixins/copyToBuffer";

export default {
  mixins: [copyToBuffer],
  props: {
    value: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.base-copy-input {
  &__active-element {
    height: 40px;
    background: #f4f7f9;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
    border-radius: 3px;
  }
  &__icon {
    color: #2b395b;
    margin-left: 0px;
    padding: 8px 17px;
    font-size: 22px;
    margin-right: 0;
    img {
      width: 22px;
    }
  }
  &__input {
    width: 100px; // https://stackoverflow.com/questions/29470676/why-doesnt-the-input-element-respect-min-width/29990524
    font-style: normal;
    font-weight: 800;
    font-size: 14px;
    line-height: 143%;
    letter-spacing: 0.05em;
    outline: none;
    border: none;
    padding: 0 20px;
    text-overflow: ellipsis;
    flex-grow: 1;
  }
}
</style>

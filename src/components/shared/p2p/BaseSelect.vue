<template>
  <div class="base-select">
    <div v-if="label" class="base-select__label p2p-utils-label">
      {{ label }}
    </div>
    <div
      class="base-select__selected-option p2p-utils-input"
      :class="{
        'base-select__selected-option_trim-left': trimLeft,
        'base-select__selected-option_open': isOpen,
      }"
      @click="setIsOpen(!isOpen)"
    >
      <slot
        v-if="selectedOption"
        name="selected"
        v-bind="{ value: selectedOption.value, label: selectedOption.label }"
      >
        <div class="flex">
          <img
            v-if="selectedOption && selectedOption.image"
            class="base-select__option-image mr-2"
            :src="selectedOption.image"
            alt=""
          />
          {{ selectedOption && selectedOption.label }}
        </div></slot
      >
      <div
        v-show="isOpen"
        class="base-select__options p2p-utils-input"
        @click.stop="setIsOpen(false)"
      >
        <div
          v-for="(option, i) in options"
          :key="i"
          class="base-select__option"
          @click="onSelect(i)"
        >
          <slot
            name="option"
            v-bind="{ value: option.value, label: option.label }"
          >
            <div class="flex">
              <img
                v-if="option.image"
                class="base-select__option-image mr-2"
                :src="option.image"
                alt=""
              />
              {{ option.label }}
            </div></slot
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    options: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every(
          (option) =>
            typeof option.label === "string" &&
            typeof option.value !== "undefined"
        ),
    },

    modelValue: {
      required: true,
    },

    trimLeft: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],

  data() {
    return { isOpen: false };
  },

  computed: {
    selectedOption() {
      return this.options.find((option) => option.value === this.modelValue);
    },
  },

  mounted() {
    this.addOutsideClickListener();
  },

  unmounted() {
    this.removeOutsideClickListener;
  },

  methods: {
    addOutsideClickListener() {
      document.body.addEventListener("click", this.outsideClickListener);
    },

    removeOutsideClickListener() {
      document.body.removeEventListener("click", this.outsideClickListener);
    },

    outsideClickListener(e) {
      if (!this.$el.contains(e.target)) {
        this.setIsOpen(false);
      }
    },

    onSelect(index) {
      this.$emit("update:modelValue", this.options[index].value);
    },

    setIsOpen(value) {
      this.isOpen = value;
    },
  },
};
</script>

<style lang="scss" scoped>
.base-select {
  display: inline-block;

  &__label {
    margin-bottom: 5px;
  }

  &__selected-option {
    cursor: pointer;
    user-select: none;
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    color: #4b4b4d;
    position: relative;
    padding: 10px 27px 10px 10px;
    width: 100%;
    height: 100%;
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 10px;
      border: 5px solid transparent;
      border-top-color: #3dbf8c;
      transform: scaleY(1.3);
    }

    &_open {
      &::after {
        border-top-color: transparent;
        border-bottom-color: #41a07b;
        top: calc(50% - 10px);
      }
    }

    &_trim-left {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }

  &__option {
    padding: 7px 10px;
    &:not(:first-child) {
      border-top: 0.5px solid rgba(0, 0, 0, 0.1);
    }
  }

  &__options {
    position: absolute;
    top: calc(100% + 2px);
    min-width: calc(100% + 2px);
    left: -1px;
    z-index: 99;
    max-height: 300px;
    overflow-y: auto;
  }

  &__option-image {
    max-width: none;
    width: 20px;
    height: 20px;
  }
}
</style>

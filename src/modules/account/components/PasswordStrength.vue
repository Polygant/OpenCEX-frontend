<template>
  <div class="password-strength">
    <span
      v-for="(l, i) in level"
      :key="i"
      :style="`background-color: ${bgColor};`"
    >
    </span>
  </div>
</template>
<script>
export default {
  name: "PasswordStrength",
  props: {
    level: {
      type: Number,
      required: true,
    },
  },
  computed: {
    bgColor() {
      let color = "red";

      switch (this.level) {
        case 1:
        case 2:
          color = "#eb1d1d";
          break;
        case 3:
        case 4:
          color = "#e0ae26";
          break;
        case 5:
          color = "var(--theme-primary-color)";
          break;
      }

      return color;
    },
  },
};
</script>
<style lang="scss">
.password-strength {
  width: 100%;

  span {
    display: inline-block;
    width: 18%;
    height: 3px;
    border-radius: 3px;
    margin-right: 6px;

    @media (max-width: 530px) {
      width: 18.3%;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>

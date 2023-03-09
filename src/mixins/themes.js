import localConfig from "../local_config";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ theme: "core/theme" }),
    currentTheme() {
      return this.theme === "dark" ? 1 : 0;
    },
    mainColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.main_color || false;
      return color && color.length > 0 ? color : false;
    },
    secondColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.second_color || false;
      return color && color.length > 0 ? color : false;
    },
    cancelColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.cancel_color || false;
      return color && color.length > 0 ? color : false;
    },
    loginBackground() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.login_background || false;
      return color && color.length > 0 ? color : false;
    },
    loginText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.login_text || false;
      return color && color.length > 0 ? color : false;
    },
    mainBackground() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.main_background || false;
      return color && color.length > 0 ? color : false;
    },
    mainText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.main_text || false;
      return color && color.length > 0 ? color : false;
    },
    inputColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.input_color || false;
      return color && color.length > 0 ? color : false;
    },
    inputText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.input_text || false;
      return color && color.length > 0 ? color : false;
    },
    blockColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.block_color || false;
      return color && color.length > 0 ? color : false;
    },
  },
};

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
      return color && color.length > 0 ? color : "#2A2259";
    },
    secondColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.second_color || false;
      return color && color.length > 0 ? color : "#ffac2a";
    },
    cancelColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.cancel_color || false;
      return color && color.length > 0 ? color : "#FF0000";
    },
    loginBackground() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.login_background || false;
      return color && color.length > 0 ? color : "#36373c";
    },
    loginText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.login_text || false;
      return color && color.length > 0 ? color : "#FFFFFF";
    },
    mainBackground() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.main_background || false;
      return color && color.length > 0 ? color : "#edf1fa";
    },
    mainText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.main_text || false;
      return color && color.length > 0 ? color : "#000000";
    },
    inputColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.input_color || false;
      return color && color.length > 0 ? color : "#FFFFFF";
    },
    inputText() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.input_text || false;
      return color && color.length > 0 ? color : "#000000";
    },
    blockColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.block_color || false;
      return color && color.length > 0 ? color : "#FFFFFF";
    },
    borderColor() {
      const color =
        localConfig?.themes?.[this.currentTheme]?.border_color || false;
      return color && color.length > 0 ? color : "#CCCCCC";
    },
  },
};

import localConfig from "../local_config";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({ theme: "core/theme" }),
    currentTheme() {
      return this.theme === "dark" ? 1 : 0;
    },
    mainColor() {
      return localConfig?.themes?.[this.currentTheme]?.main_color || false;
    },
    secondColor() {
      return localConfig?.themes?.[this.currentTheme]?.second_color || false;
    },
    cancelColor() {
      return localConfig?.themes?.[this.currentTheme]?.second_color || false;
    },
    loginBackground() {
      return (
        localConfig?.themes?.[this.currentTheme]?.login_background || false
      );
    },
    loginText() {
      return localConfig?.themes?.[this.currentTheme]?.login_text || false;
    },
    mainBackground() {
      return localConfig?.themes?.[this.currentTheme]?.main_background || false;
    },
    mainText() {
      return localConfig?.themes?.[this.currentTheme]?.main_text || false;
    },
    InputColor() {
      return localConfig?.themes?.[this.currentTheme]?.input_color || false;
    },
    InputText() {
      return localConfig?.themes?.[this.currentTheme]?.input_text || false;
    },
    BlockColor() {
      return localConfig?.themes?.[this.currentTheme]?.block_color || false;
    },
  },
};

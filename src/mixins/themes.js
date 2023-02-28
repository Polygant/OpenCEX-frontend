import localConfig from "../local_config";

export default {
  computed: {
    mainColor() {
      return localConfig.theme.main_color || false;
    },
    secondColor() {
      return localConfig.theme.second_color || false;
    },
    loginBackground() {
      return localConfig.theme.login_background || false;
    },
    loginText() {
      return localConfig.theme.login_text || false;
    },
  },
};

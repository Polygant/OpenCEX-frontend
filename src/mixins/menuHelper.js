import vClickOutside from "click-outside-vue3";

export default {
  data() {
    return {
      isOpenMenu: false,
      isOpenSettingsMenu: false,
    };
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  methods: {
    toggleIsOpen() {
      this.isOpenMenu = !this.isOpenMenu;
    },
    toggleIsSettingsOpen() {
      this.isOpenSettingsMenu = !this.isOpenSettingsMenu;
    },
    closeMenu() {
      this.isOpenMenu = false;
      this.isOpenSettingsMenu = false;
    },
    closeSettingMenu() {
      this.isOpenSettingsMenu = false;
    },
  },
};

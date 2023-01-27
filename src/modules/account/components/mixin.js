export default {
  data() {
    return {
      isEditSoF: true,
      logoutTimeout: null,
      secretkey: "",
      secretkeyToDisable: "",
      errtext: "",
      username: "",
      twofaStepNumber: 1,
      dangertextpassgcode: "",
      googleCodeToPreCheck: "",
      errtextPreCheck: "",
      testSecret: "",
      testToken: "",
      tokenToCheck: "",
      newautoLogoutTimeout: "",
      errtextChangeTime: "",
    };
  },
  computed: {
    profile() {
      return this.$store.getters["core/profile"];
    },
  },
};

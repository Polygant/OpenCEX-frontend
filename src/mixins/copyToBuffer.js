export default {
  methods: {
    copyToBuffer(value) {
      const self = this;

      this.$copyText(value).then(
        function () {
          self.$notify({
            type: "success",
            text: self.$t("common.successCopy"),
          });
        },
        function () {
          self.$notify({
            type: "error",
            text: self.$t("common.errorCopy"),
          });
        }
      );
    },
  },
};

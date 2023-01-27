<template>
  <div></div>
</template>
<script>
export default {
  name: "WalletActivateCancelCodeModals",
  beforeCreate() {
    const justactivateCODE = localStorage.getItem("justactivateCODE");

    if (justactivateCODE === "true") {
      setTimeout(() => {
        this.$notify({
          type: "success",
          title: ``,
          text: `${this.$t("common.modalactivcode")}`,
        });
        localStorage.removeItem("justactivateCODE");
      }, 2100);
    } else if (justactivateCODE === "false") {
      setTimeout(() => {
        this.$notify({
          type: "success",
          title: ``,
          text: `${this.$t("common.modalactivcodeCancel")}`,
        });
        localStorage.removeItem("justactivateCODE");
      }, 2100);
    }
  },
};
</script>

import config from "../local_config";
export default {
  methods: {
    handleLogout() {
      this.$store.dispatch("core/logout");
      this.$store.dispatch("sendWSMessage", JSON.stringify({ token: null }));

      if (window.location.host.includes(config.host)) {
        window.location.replace("/");
      }
    },
  },
};

import { mapGetters, mapActions } from "vuex";

const subscriptionConfig = [],
  onMessage = function (message) {
    this.$store.dispatch("getWSMessage", message);
    switch (message.kind) {
      case "deals":
        message.data.forEach((deal) => {
          this.$notify({
            type: "success",
            text: this.$t("p2p.changing_state_notification", {
              dealID: deal.id,
            }),
          });
        });
        break;
    }
  };

const subscriptions = {};

export default {
  methods: {
    ...mapActions({ sendWSMessage: "sendWSMessage" }),

    globalWsSubscribe() {
      if (this.globalWSIsConnectedSocket) {
        if (localStorage.getItem("token"))
          this.sendWSMessage(
            JSON.stringify({
              command: "",
              params: {},
              token: localStorage.getItem("token"),
            })
          );
        subscriptionConfig.forEach((subscription) => {
          if (
            (this.globalWSUserIsAuthenticated ||
              !subscription.authenticationRequired) &&
            !subscriptions[subscription.name]
          ) {
            this.sendWSMessage(
              JSON.stringify({
                command: `add_${subscription.name}`,
                params: {},
              })
            );
            subscriptions[subscription.name] = true;
          }
        });
      }
    },

    globalWsUnsubscribe() {
      subscriptionConfig.forEach((subscription) => {
        if (subscriptions[subscription.name]) {
          this.sendWSMessage(
            JSON.stringify({ command: `del_${subscription.name}`, params: {} })
          );
          subscriptions[subscription.name] = false;
        }
      });
    },

    globalWsOnMessage: onMessage,
  },

  created() {
    this.globalWsSubscribe();
  },

  beforeDestroy() {
    this.globalWsUnsubscribe();
  },

  watch: {
    globalWSIsConnectedSocket: "globalWsSubscribe",
    globalWSUserIsAuthenticated: "globalWsSubscribe",
    globalWSMessage: "globalWsOnMessage",
  },

  computed: {
    ...mapGetters({
      globalWSIsConnectedSocket: "isConnectedSocket",
      globalWSUserIsAuthenticated: "wsUserIsAuthenticated",
      globalWSMessage: "wsMessage",
    }),
  },
};

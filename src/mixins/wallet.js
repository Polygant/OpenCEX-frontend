import { app } from "../main";

export default {
  methods: {
    loadWallets() {
      app.config.globalProperties.$http
        .post("getwallets/", {})
        .then((response) => {
          response.data.forEach((wallet) => {
            if (!this.coins[wallet.currency]) {
              return;
            }
            if (!this.coins[wallet.currency].address) {
              this.coins[wallet.currency]["address"] = wallet;
            }
            if (
              Array.isArray(this.coins[wallet.currency].address) &&
              !this.coins[wallet.currency].address.find(
                (item) => item.address === wallet.address
              )
            ) {
              this.coins[wallet.currency]["address"] = [
                ...this.coins[wallet.currency].address,
                wallet,
              ];
            }
            if (
              typeof this.coins[wallet.currency].address === "object" &&
              !Array.isArray(this.coins[wallet.currency].address) &&
              this.coins[wallet.currency].address !== null &&
              this.coins[wallet.currency].address.address !== wallet.address
            ) {
              this.coins[wallet.currency]["address"] = [
                this.coins[wallet.currency].address,
                wallet,
              ];
            }
          });
        });
    },
  },
};

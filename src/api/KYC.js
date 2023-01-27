import { app } from "../main";

export const KYC = {
  check() {
    return app.config.globalProperties.$http
      .post("check_kyc/")
      .then((response) => {
        return response;
      });
  },
};

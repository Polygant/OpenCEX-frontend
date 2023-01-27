import { app } from "../main";

export const Profile = {
  get() {
    return new Promise((resolve, reject) => {
      app.config.globalProperties.$http
        .get("profile/")
        .then((response) => {
          if (response.body.interface === undefined) {
            response.body.interface = null;
          }

          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

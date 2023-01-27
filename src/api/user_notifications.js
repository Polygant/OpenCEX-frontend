import { app } from "../main";

export const UserNotifications = {
  get() {
    return new Promise((resolve, reject) => {
      app.config.globalProperties.$http
        .get("user_notifications/")
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  remove(id) {
    return new Promise((resolve, reject) => {
      app.config.globalProperties.$http
        .delete("user_notifications/" + id)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

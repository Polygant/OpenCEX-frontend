import { ref } from "vue";
import defaultsDeep from "lodash/defaultsDeep";

const defaultOptions = {
  type: "success",
  duration: 10000,
  showClose: false,
  component: false,
};

export const notifications = ref([]);

let id = 0;
const showNotification = (params) => {
  const opts = defaultsDeep(params, defaultOptions);

  const notification = { id: id++, ...opts };
  const closeNotification = () => {
    notifications.value = notifications.value.filter(
      ($) => $.id !== notification.id
    );
  };
  notification.close = closeNotification;

  setTimeout(closeNotification, opts.duration);
  notifications.value.push(notification);
};

export const useNotifications = {
  show: showNotification,
};

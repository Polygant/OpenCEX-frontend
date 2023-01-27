<template>
  <div
    aria-live="assertive"
    class="notifications fixed inset-0 flex items-start px-4 py-6 pointer-events-none sm:p-6 sm:start z-40"
  >
    <div
      class="w-full flex flex-col items-center space-y-4 sm:items-end"
      style="margin-top: 52px"
    >
      <transition-group
        enter-active-class="ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="max-w-sm w-full bg-white shadow-lg pointer-events-auto overflow-hidden notification-item"
          :class="notification.type"
        >
          <div class="p-4">
            <component
              :is="notification.component"
              v-if="notification.component"
              :notification="notification"
            />
            <div v-else class="flex items-start">
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-white">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-white">
                  {{ notification.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { notifications } from "./index";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";

export default {
  name: "NotificationRoot",
  components: {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XIcon,
  },
  setup() {
    return { notifications };
  },
};
</script>

<style scoped>
.notifications {
  z-index: 11000;
}
.notification-item.success {
  background: #82cb8c;
  color: #ffffff;
  border-left: 4px solid #5fa666;
  min-height: 0;
}
.notification-item.error {
  background: #d4584a;
  color: #ffffff;
  border-left: 4px solid #a93a2d;
  min-height: 0;
}
.notification-item.warning {
  background: #5ea0f2;
  color: #ffffff;
  border-left: 4px solid #3c7de0;
  min-height: 0;
}
</style>

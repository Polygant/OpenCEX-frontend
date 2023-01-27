<template>
  <div class="spin-wrapper">
    <div class="spin1 spinner"></div>
  </div>
</template>

<script>
export default {
  name: "LoadingComponent",
  data() {
    return {};
  },
};
</script>
<style scoped>
.spin-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.spin1 {
  width: 3px;
  height: 3px;
  box-shadow: 0 8px #555, 8px 0 #a2a2a2, 0px -8px #d5d5d5, -8px 0px #f3f3f3,
    0 9px #555, 9px 0 #a2a2a2, 0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555,
    10px 0 #a2a2a2, 0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555,
    11px 0 #a2a2a2, 0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555,
    12px 0 #a2a2a2, 0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555,
    13px 0 #a2a2a2, 0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555,
    14px 0 #a2a2a2, 0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555,
    15px 0 #a2a2a2, 0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555,
    16px 0 #a2a2a2, 0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555,
    17px 0 #a2a2a2, 0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555,
    18px 0 #a2a2a2, 0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555,
    8px 0 #a2a2a2, 0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 0 8px #555, 8px 0 #a2a2a2,
    0px -8px #d5d5d5, -8px 0px #f3f3f3, 0 9px #555, 9px 0 #a2a2a2,
    0px -9px #d5d5d5, -9px 0px #f3f3f3, 0 10px #555, 10px 0 #a2a2a2,
    0px -10px #d5d5d5, -10px 0px #f3f3f3, 0 11px #555, 11px 0 #a2a2a2,
    0px -11px #d5d5d5, -11px 0px #f3f3f3, 0 12px #555, 12px 0 #a2a2a2,
    0px -12px #d5d5d5, -12px 0px #f3f3f3, 0 13px #555, 13px 0 #a2a2a2,
    0px -13px #d5d5d5, -13px 0px #f3f3f3, 0 14px #555, 14px 0 #a2a2a2,
    0px -14px #d5d5d5, -14px 0px #f3f3f3, 0 15px #555, 15px 0 #a2a2a2,
    0px -15px #d5d5d5, -15px 0px #f3f3f3, 0 16px #555, 16px 0 #a2a2a2,
    0px -16px #d5d5d5, -16px 0px #f3f3f3, 0 17px #555, 17px 0 #a2a2a2,
    0px -17px #d5d5d5, -17px 0px #f3f3f3, 0 18px #555, 18px 0 #a2a2a2,
    0px -18px #d5d5d5, -18px 0px #f3f3f3, 6px 6px #888888, -6px -6px #eeeeee,
    6px -6px #bbbbbb, -6px 6px #fbfbfb, 7px 7px #888888, -7px -7px #eeeeee,
    7px -7px #bbbbbb, -7px 7px #fbfbfb, 8px 8px #888888, -8px -8px #eeeeee,
    8px -8px #bbbbbb, -8px 8px #fbfbfb, 9px 9px #888888, -9px -9px #eeeeee,
    9px -9px #bbbbbb, -9px 9px #fbfbfb, 10px 10px #888888, -10px -10px #eeeeee,
    10px -10px #bbbbbb, -10px 10px #fbfbfb, 11px 11px #888888,
    -11px -11px #eeeeee, 11px -11px #bbbbbb, -11px 11px #fbfbfb,
    12px 12px #888888, -12px -12px #eeeeee, 12px -12px #bbbbbb,
    -12px 12px #fbfbfb, 13px 13px #888888, -13px -13px #eeeeee,
    13px -13px #bbbbbb, -13px 13px #fbfbfb;
}

.spinner {
  display: inline-block;
  margin: 100px 100px;
  background: transparent;
  border-radius: 100%;
  animation: spin 1s infinite steps(8);
  transform-origin: 50% 50%;
}
</style>

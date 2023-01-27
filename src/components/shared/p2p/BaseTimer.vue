<template>
  <div v-if="timeRemained" class="base-timer">
    <div
      v-for="(digit, i) in timeRemained.minutes"
      :key="`${i} ${iteration}`"
      class="base-timer__digit"
      :class="{ 'base-timer__digit_first': i === 0 }"
    >
      {{ digit }}
    </div>
    <div class="base-timer__colon">:</div>
    <div
      v-for="(digit, i) in timeRemained.seconds"
      :key="`${i + 10} ${iteration}`"
      class="base-timer__digit"
      :class="{
        'base-timer__digit_last': i === timeRemained.minutes.length - 1,
      }"
    >
      {{ digit }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    end: {
      type: Number,
      required: true,
    },
  },

  emits: ["ended"],

  data() {
    return {
      iteration: 0,
      timeRemained: null,
      interval: null,
    };
  },

  created() {
    this.getTimeRemained();
    setInterval(this.getTimeRemained, 500);
  },

  beforeUnmount() {
    clearInterval(this.interval);
  },

  methods: {
    getTimeRemained() {
      this.iteration++;
      const pad = (number) =>
          String(number).length === 1 ? "0" + number : String(number),
        date = this.end - new Date() / 1000,
        seconds = Math.floor(date % 60),
        minutes = Math.floor(date / 60);

      if (date < 0) {
        if (this.timeRemained !== null) {
          this.$emit("ended");
        }
        this.timeRemained = null;
      } else
        this.timeRemained = {
          seconds: [...pad(seconds)],
          minutes: [...pad(minutes)],
        };
    },
  },
};
</script>

<style lang="scss" scoped>
.base-timer {
  display: inline-flex;
  align-items: center;
  font-family: Open Sans;
  font-size: 14px;

  &__colon {
    font-weight: 600;
    margin: 0 5px;
  }

  &__digit {
    background: #36373c;
    font-weight: 800;
    color: white;
    width: 32px;
    height: 27px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;

    &_first {
      margin-left: 0;
    }

    &_last {
      margin-right: 0;
    }
  }
}
</style>

import DateTimeFormat from "format-date-time";

export default {
  data() {
    return {
      DateTimeFormat: new DateTimeFormat(),
    };
  },
  methods: {
    getFormattedDate(date, showTime = true) {
      return this.DateTimeFormat.parse(
        date,
        this.$locale === "ru"
          ? "DD.MM.YY" + (showTime ? ", HH:mm:ss" : "")
          : "MM/DD/YY" + (showTime ? ", HH:mm:ss" : "")
      );
    },
    getFormattedDateOrders(date, showTime = true) {
      return this.DateTimeFormat.parse(
        date,
        this.$locale === "ru"
          ? "DD.MM" + (showTime ? ", HH:mm:ss" : "")
          : "MM/DD" + (showTime ? ", HH:mm:ss" : "")
      );
    },
  },
};

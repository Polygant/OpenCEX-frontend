export default {
  methods: {
    delay: (() => {
      let delay = {};
      return (id, f, time = 100) => {
        clearTimeout(delay[id]);
        delay[id] = setTimeout(f, time);
      };
    })(),
  },
};

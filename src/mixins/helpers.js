export default {
  methods: {
    getFromObj(obj, link, def) {
      let key;
      let keys = [];
      if (link.toString().indexOf(":") !== -1) {
        keys = link.split(":", 2);
        key = keys.shift();
      } else {
        key = link;
      }

      if (typeof obj[key] !== "undefined") {
        if (keys.length) {
          return this.getFromObj(obj[key], keys[0]);
        } else {
          return obj[key];
        }
      }

      return def;
    },
  },
};

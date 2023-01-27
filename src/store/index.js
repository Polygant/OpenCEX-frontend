/* eslint-disable */
import { createStore } from "vuex";
import main from "./modules/main";
import core from "./core";

const storeModules = {
  modules: {
    main,
    core
  },
};

export default createStore(storeModules);

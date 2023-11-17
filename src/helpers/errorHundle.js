const errorManager = {
  errors: {
    out_of_limit: {
      triggers: ["out_of_limit"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          text: component.$t("common.outOfLimit"),
        });
      },
    },
    order_max_cost: {
      triggers: ["order_max_cost"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          text: component.$t("common.check_maximum_limit"),
        });
      },
    },
    check_captcha: {
      triggers: ["captcha_required"],
      callback(r, item, component) {
        component.resetAndShowCaptcha();
        component.$delete(component.dangertext, "wrong_data");
        component.usernameFixed = true;
      },
    },
    not_suitable_pair: {
      triggers: ["pair_not_found"],
      callback(r, item, component) {
        component.$notify({
          type: "warning",
          text: component.$t("common.notSuitablePair"),
        });
      },
    },
    wrong_captcha: {
      triggers: ["captcha_required", "bad_captcha"],
      callback(r, item, component) {
        let msg = component.$t("common.wrong_captcha");
        component.dangertext["wrong_captcha"] = msg;
        component.$notify({
          type: "error",
          title: ``,
          text: msg,
        });
        component.resetAndShowCaptcha();
      },
    },
    bad_confirm_token: {
      triggers: ["bad_confirm_token"],
      callback(r, item, component) {
        component.state = "wrong_token";
      },
    },
    email_not_verified: {
      triggers: ["email_not_verified"],
      callback(r, item, component) {
        component.$router.push({
          name: "confirm-register",
          query: { login_email: component.username },
        });
      },
    },
    wrong_2fa_many_times: {
      triggers: ["wrong_2fa_many_times"],
      callback(r, item, component) {
        component.on2FATooManyTimes();
      },
    },
    "2fa_failed": {
      triggers: ["2fa_failed"],
      callback(r, item, component) {
        if (component.showGoogleCodeInput)
          component.errtext = component.$t("common.invalid_code");
        else component.showGoogleCodeInput = true;
        setTimeout(function () {
          location.reload();
        }, 5 * 60 * 1000);
        component.googlecode = "";
        component.dangertext = {};
        setTimeout(() => {
          component.$refs.googlecodeinput.focus();
        }, 500);
      },
    },
    pwd_change_2fa_failed: {
      triggers: ["2fa_failed"],
      callback(r, item, component) {
        component.changePassPending = false;
        component.passChangeFormStatus = "2fa";
      },
    },
    wrong_data: {
      triggers: ["wrong_data"],
      callback(r, item, component) {
        let msg = component.$t("common.wrong_data");
        component.dangertext["wrong_data"] = msg;
        component.$notify({
          type: "error",
          title: ``,
          text: msg,
        });
        component.resetAndShowCaptcha();
      },
    },
    bad_min_amount: {
      triggers: ["bad_min_amount", "order_min_qty"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.check_min_limit"),
        });
      },
    },
    bad_max_amount: {
      triggers: ["bad_max_amount", "order_max_qty"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.check_max_limit"),
        });
      },
    },
    not_enough_funds: {
      triggers: ["not_enough_funds", "not_enough_balance", "NotEnoughFunds"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.not_enough_funds"),
        });
      },
    },
    invalid_address: {
      triggers: ["invalid_address"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.wrong_address"),
        });
      },
    },
    payouts_freezed: {
      triggers: ["payouts_freezed"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.payouts_freezed"),
        });
      },
    },
    bad_amount: {
      triggers: ["bad_amount"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.errors.bad_amount"),
        });
      },
    },
    currency_not_found: {
      triggers: ["currency_not_found"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.wrong_data"),
        });
      },
    },
    percent_min_value: {
      triggers: ["percent_min_value"],
      callback(r, item, component) {
        component.$notify({
          type: "error",
          title: ``,
          text: component.$t("common.percent_min_value"),
        });
      },
    },
  },
  handle(r, key, msg, type_list, item, component, callback) {
    for (let i in type_list) {
      let type = type_list[i];
      if (
        type in this.errors &&
        this.errors[type].triggers.indexOf(item) >= 0
      ) {
        let error = this.errors[type];
        if ("callback" in error) {
          error.callback(r, item, component, type, key, msg);
        }
        if (typeof callback === "function") {
          callback(r, component, key, msg, error);
        }
      }
    }
  },
  check(r, item, component, type, callback) {
    let key;
    let msg;
    if (typeof type === "string") {
      type = [type];
    }

    switch (item) {
      case "bad_captcha":
      case "wrong_captcha":
      case "captcha_required":
        key = "wrong_captcha";
        msg = component.$t("common.wrong_captcha");
        this.handle(r, key, msg, type, item, component, callback);
        break;
      default:
        key = item;
        msg = component.$te(`common.${item}`)
          ? component.$t(`common.${item}`)
          : `common.${item}`;
        this.handle(r, key, msg, type, item, component, callback);
    }
    return { key, msg };
  },
  parse(r, component, type, callback) {
    if ("type" in r.data) {
      if (Array.isArray(r.data.type)) {
        for (let i in r.data.type) {
          let message = r.data.type[i].message;
          this.check(r, message, component, type, callback);
        }
      }

      if (typeof r.data.type === "string") {
        let message = r.data.type;
        this.check(r, message, component, type, callback);
      }

      if (typeof r.data.type === "object" && "message" in r.data.type) {
        let message = r.data.type.message;
        this.check(r, message, component, type, callback);
      }
    }
    return this;
  },
};

export default errorManager;

export default {
  updated(el, binding) {
    const onKeyup = (e) => {
        const modifiers = {
          ...binding.modifiers,
          ...binding?.value?.dynamicModifiers,
          ...e.target.numericValue?.dynamicModifiers,
        };

        if (binding?.value?.enabled === false) return;
        let special = [46, 8, 9, 27, 13];
        if (modifiers["decimal"]) {
          special.push(110, 190);
        }
        if (modifiers["fractional"]) {
          let value = el.value.replace(/\s/g, "");
          if (value.length > 0) {
            // eslint-disable-next-line no-useless-escape
            let basePattern = /[^0-9\.]/g;
            if (modifiers["negative"]) {
              basePattern = /[^0-9|.-]+/g;
            }

            let trimmed = value
              .replace(/,/g, ".")
              .replace(basePattern, "")
              .replace(/\./, "dot")
              // eslint-disable-next-line no-useless-escape
              .replace(/[\.\s]/g, "")
              .replace(/dot/, ".")
              .replace(/^0+/, "")
              .replace(/^\./, "0.");

            if (trimmed.length == 0) {
              trimmed = "0";
            }
            let decimal = parseInt(el.getAttribute("fractional")) || 8;
            if (trimmed.indexOf(".") != -1) {
              if (decimal > 0) {
                let temp = trimmed.split(".");
                if (temp[0] == "") {
                  temp[0] = "0";
                }
                if (temp[1].length > decimal) {
                  temp[1] = temp[1].slice(0, decimal);
                }
                trimmed = temp.join(".");
              } else {
                trimmed = trimmed.split(".")[0];
              }
            }

            if (trimmed.indexOf("-") != -1) {
              trimmed = trimmed.replace("--", "-");
              trimmed = trimmed.replace("-.", "-0");

              const dashLength = (trimmed.match(/-/g) || []).length;

              if (dashLength > 1) {
                trimmed = parseFloat(trimmed) || "-";
              }

              el.value = trimmed;
            }

            if (value != trimmed) {
              value = trimmed;
            }
            if (el.value != value) {
              el.value = value;
            }

            el.dispatchEvent(new Event("input"));
          }
        }
        if (modifiers["negative"]) {
          special.push(189, 109, 173);
        }
        // special from above
        if (
          special.indexOf(e.keyCode) !== -1 ||
          // Ctrl+A
          (e.keyCode === 65 && e.ctrlKey === true) ||
          // Ctrl+C
          (e.keyCode === 67 && e.ctrlKey === true) ||
          // Ctrl+X
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39) ||
          // Cmd+A
          (e.keyCode === 65 && e.metaKey === true) ||
          // Cmd+C
          (e.keyCode === 67 && e.metaKey === true) ||
          // Cmd+X
          (e.keyCode === 88 && e.metaKey === true)
        ) {
          return;
        }
        if (
          modifiers["number"] &&
          // number keys without shift
          ((!e.shiftKey && e.keyCode >= 48 && e.keyCode <= 57) ||
            // numpad number keys
            (e.keyCode >= 96 && e.keyCode <= 105))
        ) {
          return;
        }
        e.preventDefault();
      },
      onBlur = () => {
        const value = el.value;

        if (value.indexOf(".") > -1 && value.length == value.indexOf(".") + 1) {
          el.value = value + "0";
        }
      };

    if (el.numericDirectiveKeyupHandler)
      el.removeEventListener("keyup", el.numericDirectiveKeyupHandler);
    if (el.numericDirectiveBlurHandler)
      el.removeEventListener("focusout", el.numericDirectiveBlurHandler);

    el.numericDirectiveKeyupHandler = onKeyup;
    el.numericDirectiveBlurHandler = onBlur;

    el.addEventListener("keyup", onKeyup);
    el.addEventListener("focusout", onBlur);
  },
};

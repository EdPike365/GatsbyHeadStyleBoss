// This is the code that gets injected just below the page <body> tag, encircled by magic IIFE code.
// It is defined here as a function so it will not immediately execute when imported.
// but it will let us use the code editor for formatting etc., and someday, testing.
function HSBFunction() {
  const lvl = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
  };

  // number set from gatsby.config
  const logLevel = window.__HSBiifeDebugLevel;

  log = function (level, msg) {
    if (level <= logLevel) {
      msg = "HSB IIFE: " + msg;
      if (level === lvl.ERROR) console.error(msg);
      else if (level === lvl.WARN) console.warn(msg);
      else if (level === lvl.INFO) console.info(msg);
      else if (level === lvl.DEBUG) console.debug(msg);
      else if (level === lvl.TRACE) console.trace(msg);
    }
  };

  log(
    lvl.INFO,
    "Gatsby Head Style Boss (aka HSB) IIFE Flash Prevention Code is running. Debug level = " +
      logLevel
  );

  // HSBModel is loaded by an IIFE that runs before the body loads.
  // So it reflects the style links and elements that ACTUALLY got inserted on SSR, and their actual state.
  class HSBModel {
    constructor() {
      log(lvl.DEBUG, "constructor() running...");
      this.storageKey = "HeadStyleBossStyleKey";
      // We use datasets a lot: https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

      // combo of style elements and style links
      this.managedStyles = this.getManagedStylesFromPage();
      // preloaded for speed
      this.optionalStyles = this.managedStyles.filter(
        style => !(style.dataset.hsbAlwaysEnabled === "true")
      );
      this.darkStyles = this.managedStyles.filter(style => style.dataset.hsbUses.includes("dark"));

      this.darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      // If you use the arrow function, "this" will be the real this,
      // and not the media query list's "this".
      this.darkQuery.addEventListener("change", evt => this.handleDarkQueryChange(evt));

      this.enableInitialStyle();

      log(lvl.DEBUG, "constructor() done!");
    }

    isUsingADarkStyle() {
      return this.darkStyles.filter(style => style.disabled == false).length > 0;
    }

    toggleDarkStyle() {
      if (this.isUsingADarkStyle()) {
        const style = this.getLightOrDefaultOrAnyOptionalStyle();
        if (style) this.setAndSaveStyle(style);
      } else {
        this.setStyleByUse("dark");
      }
    }

    setStyleByUse = function (styleUse) {
      const style = this.getLastStyleWithUse(styleUse);
      if (style) {
        this.setAndSaveStyle(style);
      }
    };

    // Used by style selector component
    setStyleByKey = function (keyVal) {
      const style = this.getStyleForKey(this.managedStyles, keyVal);
      if (style) {
        this.setAndSaveStyle(style);
      }
    };

    // The HSB_Context code will have a listener mapped here.
    // It updates the context every time the model changes.
    modelStateChanged = () => {
      const modelStateChangEvent = new Event("modelStateChanged");
      dispatchEvent(modelStateChangEvent);
      log(lvl.DEBUG, "modelStateChanged(), HSB UI components should update now.");
    };

    getManagedStylesFromPage = () => {
      var styleNodes = document.querySelectorAll("[data-hsb-managed*='true']");
      var arr = Array.from(styleNodes);
      log(lvl.DEBUG, "Number of managed styles: " + arr.length);
      return arr;
    };

    enableInitialStyle = () => {
      let style = this.getStyleForStoredStyleKey();
      if (!style) {
        style = this.getStyleForDarkQueryState();
      }
      if (!style) {
        log(
          lvl.WARN,
          "enableInitialStyle(): Could not get style for stored key or dark mode. Setting to use default."
        );
        style = this.getLastStyleWithUse("default");
      }
      this.setAndSaveStyle(style);
    };

    handleDarkQueryChange = evt => {
      log(
        lvl.DEBUG,
        " darkQueryListener: prefers-color-scheme just changed, wants dark = " + evt.matches
      );
      let style = this.getStyleForDarkQueryState();
      this.setAndSaveStyle(style);
    };

    // This function should be the ONLY place that commits model changes after initiation.
    // If you do it somewhere else, remember to call HSB_Context modelStateChanged(this)
    setAndSaveStyle = style => {
      // final style=null failsafe,
      log(lvl.DEBUG, "setAndSaveStyle() style: " + style.dataset.hsbDisplayname);

      if (style) {
        this.toggleEnabledStyles(this.optionalStyles, style);
        this.setStoredStyleKey(style.dataset.hsbKey);
        this.modelStateChanged(this); //Let the UI components know something changed
      } else {
        log(lvl.ERROR, "setAndSaveStyle(): Someone tried to setAndSaveStyle to null. ");
      }
    };

    getStyleForDarkQueryState = () => {
      if (this.darkQuery.matches) {
        return this.getLastStyleWithUse("dark");
      } else {
        return this.getLightOrDefaultOrAnyOptionalStyle();
      }
    };

    toggleEnabledStyles = (styles, styleToEnable) => {
      const enableKey = styleToEnable.dataset.hsbKey;
      styles.forEach(style => {
        if (style.dataset.hsbKey === enableKey) {
          style.disabled = false;
        } else {
          style.disabled = true;
        }
      });
    };

    getLightOrDefaultOrAnyOptionalStyle() {
      let style = this.getLastStyleWithUse("light");
      if (!style) style = this.getLastStyleWithUse("default");
      if (!style) style = this.optionalStyles.slice(-1)[0];
      if (!style) {
        log(
          lvl.WARN,
          "getLightOrDefaultOrAnyOptionalStyle(): could not find any light, default or optional styles. Check you your config, you might only have a dark style."
        );
      }
      return style;
    }

    getLastStyleWithUse = function (useVal) {
      let results = this.getStylesWithUse(useVal);
      if (results.length > 0) {
        return results[results.length - 1];
      } else {
        return null;
      }
    };

    getEnabledOptionalStyles = () => {
      return this.optionalStyles.filter(style => style.disabled == false);
    };

    getStylesWithUse = function (useVal) {
      return this.optionalStyles.filter(style => style.dataset.hsbUses.includes(useVal));
    };

    getStyleForKey = (styles, key) => {
      const list = styles.filter(style => style.dataset.hsbKey === key);
      return list.length > 0 ? list[list.length - 1] : null;
    };

    getStyleForStoredStyleKey = () => {
      const styleKey = this.getStoredStyleKey();
      if (styleKey) {
        return this.getStyleForKey(this.managedStyles, styleKey);
      } else {
        return null;
      }
    };

    getStoredStyleKey = () => {
      var styleKey = null;
      try {
        styleKey = localStorage.getItem(this.storageKey);
        log(lvl.DEBUG, "getStoredStyleKey(): found stored styleKey " + styleKey);
      } catch (err) {
        log(lvl.ERROR, "getStoredStyleKey(): " + err);
      }
      return styleKey;
    };

    setStoredStyleKey = keyValue => {
      try {
        localStorage.setItem(this.storageKey, keyValue);
      } catch (err) {
        log(lvl.ERROR, "setStoredStyleKey(): " + err);
      }
    };
  }

  const thisHSBModel = new HSBModel();
  window.__HSBModel = thisHSBModel;
}

// We work in js for editor support and formatting. But we need to inject a string in the IIFE or it will execute immediately.
const hsbFunctionString = String(HSBFunction);
export { hsbFunctionString };

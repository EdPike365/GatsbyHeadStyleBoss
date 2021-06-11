<div style="display: flex; width: 100%;">
  <div>
  <img src="headstyleboss.jpg" alt="Head Style Boss Logo" title="Gary Larsons Farside Boss Lady" style="width: 100px; height: auto; padding: 0px 20px;" >
  </div>
  <div style="height: 150px;">
    <h1> Head <i>Style</i> Boss (HSB) </h1>
    <i>Boss The Styles in Your Head Element</i>
    <li>JS and ReactJS, Supports GatsbyJS SSR</li>
    <li>Dark Mode with no loading flash</li>
    <li>Supports Multiple User Selected Styles</li>
    <li>Use CSS style sheets in your head, use <i>whatever</i> in your components.</li>
  </div>
</div>

## Features

- Offer Dark Mode _with no flash on initial load_.
- Support multiple legacy CSS style sheets and the order that they appear in `<Head>`.
- Offer the user multiple style options, not just Dark Mode.
  - Avoid having Gatsby combine your style sheets randomly in a common css file.
  - Each style sheet can be in its own CSS file.
  - Each CSS file is _inlined_ into its own seperate head style element **_on the server_**.
- Manage style options with a JSON Config File
  - Use JSON config file to annotate the `<style>` elements to make them manageable at runtime.
- Contains optional React components:
  - HSB Context object, ready for use with Gatsby SSR.
  - Dark Mode Toggle
  - Style Selector: List all of your style options based on HSB_Config.
  - Style State Display: Real time feedback on the status of all managed styles.
  - Show user's live "prefers dark mode" setting.
- No external dependencies. Default styles use css vars. Define the vars in your :root or edit the module.css file.
- Caveat: If you change values on the HSB managed style sheets, you must bounce Gatsby. This works fine for me because I mostly only use :root variables (ex: "--media-width-xs: 320px;") on the style sheets and style my components independently.

## How?

- Edit the HSB_Config.json configuration file:
  - Configured style attributes become "data" attributes written into the `<style>` elements during SSR.
  - `HSB_Browser.js` is injected just below the `<body>` tag. It reads the configured styles into a `HSBModel` object at runtime.
  - Style state (`enabled`) is then managed via HSBModel.
  - Each CSS file is configured for 1 or more _uses_ (via `data-use` attribute):
    - "always" enabled styles
    - Optionally Enabled Styles
      - "default" styles
      - "dark" styles
      - generic "alternative" styles
  - Styles are injected in the order listed.
  - Setting styles by `use` will `enable` the last style with that `use`, and disable all other _optional_ styles.
  - You can always manually set `enable` state via SHBModel method calls.

> **WARNING: Title Attr and "Alternate" Style Sheets**  
> There is an ancient tech called "Alternate Style Sheets". If you use the `title` attr on more than 1 style, the browser will only enable the first one it finds. It will disable any named sheets or styles past that one. Its a bit like radio buttons for styles.
> **_The javascript code will be ignored by the browser (at least on Chrome)._**
> I'm leaving title implemented in case someone wants to get their freak on but I highly recommend that you don't use the _title_ field in the config file.

### Components:

- The on page style mgt code is in `HSB_Browser.js`. It is an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). It is mandartory for everything else to work. It must appear just below the `<body>` element. Import the mandatory `onPreRenderHTML` function into `gatsby-ssr.js` and to inject the CSS
- Get the required javascript function on Gatsby's html.js template.
  - Option 1: Import the onPreBody function to `gatsby-ssr.js` which injects the code.
  - Option 2: Not recommended. Copy the Gatsby `html.js` page to your local project root and paste the code in. Do this if you already have a custom `html.js`.

### Installation

- Copy and paste the `headstyleboss` folder into:
  - Gatsby: `src` folder.
- Modify `HSB_Config`. If your css file is already minified, leave `minifyCSS` setting as false.
- Use `HSB_Context` (or `HSBStyleContextProvider` if you have mulitple contexts) in `gatsby-browser.js` and `gatsby-server.js`. See examples.
- Use `HSB_Utils` in `gatsby-ssr.js` to do file injections. You will also need a ref to `fs` filesystem. See examples.

> Typical minimal setup:
>
> - You have a legacy/core CSS file that always needs to be enabled.
> - You have a _modifying_ CSS file for dark mode.
> - In the HSB config file, list the core file first, configure it with use="default always".
> - List the "dark" file second, configure it with use="dark". When dark mode is activated, the dark css cascades over the core. The JS code on the html page handles everything.
> - You can optionally add React components like the ToggleDarkMode component. If you use your own toggler, it has to work with `HSB_Context`.

## Notes For Hackers

- You can manually add all, or some additional, style elements to the head (e.g. the Gatsby html.js template file). They need to follow the element attribute patterns as they would have appeared in the JSON config file. Formeost they must contain the HSB id prefix from the config file.
- HSBModel has methods to enable or disable styles based on ID or use types. Use them to micromanage style state without selectors and also to make sure the HSB components update as expected.

## General Default Rules:

- All styles appear on the page in the order that they are listed in the config.
- All styles marked `always` will be `enabled` at all times.
- **Non** `always` styles are called options. Only one option can be enabled at time by default. If they have no special `use` add `alternate`.
- Functions on HSBModel are available to let you get around the default behavior.

> If you have a large core CSS file that you always want enabled, _and_ you want simple StyleSelector options for, say, a dark mode style, create an empty CSS file with the desired name for the default to proxy for the `use` = `always` core file.

### On Initial Page Load:

- Javascript file on page runs before first render. It is blocking.
- It reads the page for specially id'd style elements and enter them into HSBModel object.
- Set style enabled based on "use" attribute:
  - `use` contains `always`: Styles are enabled (always). Combining with other uses not advised.
  - `use` contains `default`: The **_lAST_** style marked `default` is enabled at load time. Previous "defaults" are ignored. If a style is not labeled "default", it is not enabled at initial load time (unless also has "always"). If there is no default, the last non-always will be enabled.
  - `use` contains `dark`: The _last_ style marked "dark" will be enabled if user has OS or browser set to "prefers dark mode". In that case other, non "always", styles are disabled. Previous "dark" styles are ignored.
  - `use` contains `default dark`: Last style marked both will be enabled for "default" OR "dark". In other words, the site will load in a dark mode no matter what the "prefers dark mode" settings are.
- Find any saved (local storage) style ID. If the style exists, enable it; disable other styles.
- If there is no stored style ID, or its style element cant be found, check for "prefers dark mode". If "dark" styles exist, enable the last one. Disable other styles.
- Nothing modifies any preferred style names stored in local storage.

### On "Prefers Dark Mode" Change Event:

- Can be triggered by the web browser using emulation OR can be changed in the OS.
- The last dark style is enabled, all other options will be turned off, except "always" themes.
- That style's ID is stored to local storage for next visit.

### On Change From StyleSelector or DarkModeToggle Widgets:

- If the selected style exists, it is enabled. All other styles are disabled.
- The style is stored in local storage.

## Component Notes:

- StyleSelector: All styles are listed. I use a normal `<style>` component and the `onchange` event handler so a giant red warning sign pops up during `gatsby develop`. The linter also fusses about how I should use `onblur`.
- DarkModeToggle: Will enable the last style with `use` containing `dark`.

## Coming Soon

- Manually test on more browsers
- Node module, Gatsby plugin
- Manage CSS style sheet `<link>`s (currently only tested on `<style>`)
- Minify your style sheets and `HSB_Browser.js` at SSR.
- More efficient SSR **build**: change to read files once, inject many times. Currently, during build, runs entire process on every page.
- Auto JS unit test. Selenium test for runtime.
- Add `use` `never` for those edge cases.
- Move `minifyCSS` setting to per style entry.

## History

Written originally for Gatsby 3 to fix dynamic theming issues.

### Wish List

- Dark Mode
- No bright flash on initial Dark Mode load.
- Multiple User Selectable Styles
- CSS variables in the `:root` and offer the styles by modifying the variable values using layered css sheets, not by assigning whole new classes to the body, etc., with JS.
- No black box plugins.
- Compatible with `Emotion CSS`

### The Problem

- If CSS files were loaded by a React component using `import`, Gatsby 3's Webpack configuration combined the contents with multiple CSS files into one common CSS file, in unpredicatable order, wrecking cascading behavior. The Webpack config was super complicated so I did not want to modify it.
- I attempted to add CSS configuration in the `gatsby-config` file and to leverage Gatsby's cool GraphQL. I had the file contents loaded into GraphQL as well. But when I tried to inject them into `html.js` via `gatsby-ssr.js`, I could not get access to GraphQL, so I could not access the configuration or inject the styles or JS code (using `onPreRenderHTML()`).
- I tried to use the `use-dark-mode` Gatsby plugin but it did not support multiple style sheets being enabled and disabled. It forces you to modify the "body" class. Too limited.
- Luckily, `gatsby-ssr.js` **_does_** allow access to the file system because it only runs on the server. Head Style Boss takes advantage of this to turn my dreams into reality....

## Helpful Links

- https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app

- and he was referencing this live code from Overreacted.io:
  https://github.com/gaearon/overreacted.io/blob/master/src/html.js

- how to get rid of flash https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app

- how to minify and inline stylesheets https://stackoverflow.com/questions/50768575/is-it-possible-to-have-html-webpack-plugin-generate-style-elements-from-css

- this is a really good thread about inlining css in the header, trying to modify webpack
  I think this is the default webpack minifier https://survivejs.com/webpack/styling/separating-css/

JS wrapped as IIFE to use private variables and functions
https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app

---

Free for reuse but not sale

Copyright 2021, Ed Pike (EdPike365), All rights reserved.

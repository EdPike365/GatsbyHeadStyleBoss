# gatsby-head-style-boss 

[![npm][npm]][npm-url]

- Provide multiple style options, including Dark Mode.
- Prevent default style flash on page load.
- Uses CSS style elements embedded in the `<head>` during SSR. 
- `gatsby-config` settings decorate the elements with attributes that let you list, select, and enable/disable them with components.
- Great for supporting multiple delicate legacy CSS style sheets that rely on cascading.
- Contains optional React widgets to control or monitor style sheets.

## How to install

- `npm i gatsby-head-style-boss`
- Add `gatsby-head-style-boss` to your `gatsby-config.js` file.
- Edit the the plugin config (see examples below):
  - change "stylesFolder" path
  - modify the list of css files to match yours.  
- In **your** React layout component or Gatsby page template, you will need to remove anywhere you were importing those css files or you will get a double copy.
- If you change a style sheet that is managed by HSB, you must bounce Gatsby to make the changes appear on your site. This works fine for me because I mostly only use `:root` css variables (ex: "--media-width-xs: 320px;") on my site's style sheets and style my components independently using Emotion (css in js).

## When do I use this plugin?

My story: I was using a `normalize.css` followed by a `core.css` stylesheet. My core.css style sheet is mostly css variables in the `:root`, using the materialize UI approach. I use Emotion or css modules for everything else. 

I wanted to add `dark mode`. Solutions like `gatsby-use-dark-mode` achieve dark mode by adding or removing `<body>` css classes . I wanted to achieve dark mode by enabling and disabling an entire dark css **style sheet**. I also had a minor desire to offer the users **multiple style options**, not just dark and light. I did not want to copy and edit Gatsby's [html.js](https://www.gatsbyjs.com/docs/custom-html/), which could open a whole can of worms later.

I tried global theme switching with Emotion, but the style sheets were being combined into one common style sheet (by WebPack I think). The order was unpredictable, ruining the cascading behavior. I looked into modifying the WebPack config using the Gatsby api, but Gatsby's WebPack is understandably gnarly and I'm new to WebPack so I wrote this partly as a work around.

I've worked with legacy web sites that had many layers of css style sheets, that had to occur in a very specific order, and they were not willing to refactor them. Head Style Boss would work well in that situation. 

Head Style Boss is also good for letting decision makers see different theme ideas before finalizing the ones that ship, at which point you just modify `gatsby-config` to remove that style.

## Example of usage

I'm using it on my own website: [EdPike365.com](https://www.edpike365.com)

gatsby-config.js
```json
  {
    resolve: `gatsby-head-style-boss`,
    options: {
      config: {
        stylesFolder: "./src/styles/",
        idPrefix: "HeadStyleBossID_",
        minifyBrowserFunction: false,
        styleElements: {
          styles: [
            {
              "data-filename": "normalize2.css",
              "data-displayname": "Noramlize2 Reset",
              "data-use": "always",
              id: "HeadStyleBossID_normalize2",
              minifyCSS: false,
            },
            {
              "data-filename": "coreTheme.css",
              "data-displayname": "Core Theme",
              "data-use": "always",
              id: "HeadStyleBossID_coreTheme",
              minifyCSS: false,
            },
            {
              "data-filename": "lightTheme.css",
              "data-displayname": "Default, Light Theme",
              "data-use": "default",
              id: "HeadStyleBossID_lightTheme",
              minifyCSS: false,
            },
            {
              "data-filename": "darkTheme.css",
              "data-displayname": "Dark Theme",
              "data-use": "alternate dark",
              id: "HeadStyleBossID_darkTheme",
              minifyCSS: false,
            },
            {
              "data-filename": "fireTheme.css",
              "data-displayname": "Fire Theme",
              "data-use": "alternate",
              id: "HeadStyleBossID_fireTheme",
              minifyCSS: false,
            },
          ],
        },
      },
    },
  },
```

```js
//Importing components
import DarkModeToggle from "gatsby-head-style-boss/components/DarkModeToggle"
import StyleSelector from "gatsby-head-style-boss/components/StyleSelector"
import StylesSummary from "gatsby-head-style-boss/components/StylesSummary"
import PrefersDarkMode from "gatsby-head-style-boss/components/PrefersDarkMode"
```
---
## Details For the Curious

### How Does it Work?
- Manage style options with `gatsby-config`
  - Each configured sheet will be injected into it's own `<style>` element during SSG
  - (COMING SOON) Each sheet is minified based on its `minifyCSS` config.
  - HSB annotates the `<style>` elements to make them manageable at runtime.
- HSB injects a JS function that prevents flash on load. It wraps the style elements ina an MVC model with controller code that allows you to modify the `enabled` state of the head `<style>` elements.
  
- HSB uses `wrapRootElement()` in `gatsby-ssr` and `gatsby-browser` to provide `HSB_Context`   
- Optional React components:
  - `DarkModeToggle`
  - `StyleSelector`: Lists the styles that you configured in HSB_Config.
  - `StylesSummary`: Table that displays real time feedback on the status of all managed styles.
  - `PrefersDarkMode`: Show a live view of the user's "prefers dark mode" setting. Good for sanity checking while developing.


### More Config Details

  - Configured style attributes become "data" attributes written into the `<style>` elements during SSR, ***not on page load***. The fields are written into the element; you can see them in the page source code. This means that they bascially work with JS disabled (needs testing).
  - Each CSS file is configured for 1 or more _uses_ (via `data-use` attribute):
    - "always" styles are always enabled
    - Optionally Enabled Styles
      - "default" styles
      - "dark" styles
      - generic "alternative" styles
  - Styles are injected in the order listed.
- `BrowserFunction.js` is injected just below the `<body>` tag. The browser code reads the configured styles into a `HSBModel` object at runtime.
  - The function is an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). It is mandartory for everything else to work.
  - Each style's `enabled` state is then managed via HSBModel.
  - You can manually set `enabled` state via HSBModel method calls. HSBModel is available via a context provider.
  - Setting styles by `use` will `enable` the last style with that `use`, and disable all other _optional_ styles.
- `HSB_Context` wraps the `<root>` element using the `wrapRootElement` hook in the modules `gatsby-ssr.js` and `gatsby-browser.js`.

- __Caveats__:
  - HSB does not currently minify anything.
  - There is no automated testing or Typescript.
  - This has only been tested on Chrome.

> **WARNING: Title Attr and "Alternate" Style Sheets**  
> There is an ancient tech called "Alternate Style Sheets". If you use the `title` attr on more than 1 style, the browser will only enable the first one it finds. It will disable any named sheets or styles past that one. Its a bit like radio buttons for styles.
> **_The javascript code will be ignored by the browser (at least on Chrome)._**
> I'm leaving title implemented in case someone wants to get their freak on but I highly recommend that you don't use the _title_ field in the config file.


## Typical minimal setup:

- You have a normalize CSS file and a legacy core CSS file. They must always be enabled and come in the same order. 
- You have a _modifying_ CSS file for dark mode (and maybe more options). It is meant to overwrite some previous values. It can be enabled or disabled.
- In the HSB config, list the files in order of how they should cascade: 
  - normalize.css, use "always"
  - coretheme.css, use "always"
  - corethemeproxy.css, use "default"
  - yourdarkmode.css, use "dark"
- `corethemeproxy.css` is an empty css file that makes the interface work if you want your coretheme to always be enabled. 
- Add HSB_Components DarkModeToggle to one or more components.
- When dark mode is activated, the dark CSS **cascades** over the core like it was meant to in the days of yore. The HSB BrowserFunction code on the html page handles everything.
- You can optionally add other React components. If you use your own components, they get to (have to) work with the HSBModel in `HSB_Context`.

## Notes For Hackers

- HSBModel reads the style elements in the head at run time. It is decoupled from the config info.
- Therefore, you can manually add all style elements to the head (e.g. the Gatsby html.js template file). They need to follow the element attribute patterns as they would have appeared in the HSB config. Formeost they must contain the HSB id prefix from the config.
- You **might** be able to add them via React-Helmet and still be able to control them. Untested.
- HSBModel has methods to enable or disable styles based on ID or use types. Use them to micromanage style state without selectors and also to make sure the HSB components update as expected.


### Life Cylce and Events:

- IIFE Javascript file on page runs before first render. It is blocking.
- It reads the page for specially id'd style elements and enter them into HSBModel object.
- Set style enabled based on "use" attribute:
  - `use` contains `always`: Styles are enabled (always). Combining with other uses not advised.
  - `use` contains `default`: The **LAST** style marked `default` is enabled at load time. Previous "defaults" are ignored. If a style is not labeled "default", it is not enabled at initial load time (unless also has "always"). If there is no default, the last non-always will be enabled.
  - `use` contains `dark`: The _last_ style marked "dark" will be enabled if user has OS or browser set to "prefers dark mode". In that case other, non "always", styles are disabled. Previous "dark" styles are ignored.
  - `use` contains `default dark`: Last style marked both will be enabled for "default" OR "dark". In other words, the site will load in a dark mode no matter what the "prefers dark mode" settings are.
- Find any saved (local storage) style ID. If the style exists, enable it; disable other styles.
- If there is no stored style ID, or its style element cant be found, check for "prefers dark mode". If "dark" styles exist, enable the last one. Disable other styles.
- Nothing modifies any preferred style names stored in local storage.

### On "Prefers Dark Mode" Change Event:

- Can be triggered by the web browser using emulation OR can be changed in the OS.
- The last dark style is enabled, all other options will be turned off, except "always" themes.
- That style's ID is stored to `local storage` for next visit.

### On Change From StyleSelector or DarkModeToggle Widgets:

- If the selected style exists, it is enabled. All other styles are disabled.
- The style is stored in `local storage`.

## Component Notes:

- StyleSelector: All styles are listed. I use a normal `<style>` component and the `onchange` event handler so a giant red warning sign pops up during `gatsby develop`. The linter also fusses about how I should use `onblur`. Figuring out how to suppress those is on my backburner.
- DarkModeToggle: Will enable the last style with `use` containing `dark`.

## Coming Soon

- Manually test on more browsers
- Manage CSS style sheet `<link>`s (currently only tested on `<style>`)
- Replace the current CSS file injection code to make it hot reloadable. I'm looking at [gatsby-plugin-typography](https://www.gatsbyjs.com/plugins/gatsby-plugin-typography/ ) implementation.


### Notes

- I attempted to add CSS files using `gatsby-source-filesystem` in the `gatsby-config` file and to leverage Gatsby's cool GraphQL. I had the file contents loaded into GraphQL. But when I tried to inject them into `html.js` via `gatsby-ssr.js`, I could not get access to GraphQL, so I could not access the configuration or inject the styles or JS code (using `onPreRenderHTML()`).
- I tried to use the `gatsby-use-dark-mode` Gatsby plugin but it did not support multiple style sheets being enabled and disabled. Too limited.


## Helpful Links

- Josh Comeau wrote a good plugin after I wrote mine. However, he implemented the IIFE code config a little better, so I borrowed that and refactored. The fact that he said this was one of the hardest things he's done for his Gatsby site made me feel better. [The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)

- [Avoid Default Theme Flash in Dark Mode](https://hangindev.com/blog/avoid-flash-of-default-theme-an-implementation-of-dark-mode-in-react-app)

- ... and he was referencing this live code from Overreacted.io:
  https://github.com/gaearon/overreacted.io/blob/master/src/html.js


- This is a really good thread about inlining css in the header, trying to modify webpack
  I think this is the default webpack minifier https://survivejs.com/webpack/styling/separating-css/


---

Copyright 2021, Ed Pike (EdPike365), All rights reserved.

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/gatsby-head-style-boss.svg
[npm-url]: https://npmjs.com/package/gatsby-head-style-boss
[node]: https://img.shields.io/node/v/gatsby-head-style-boss.svg
[node-url]: https://nodejs.org
[twitter]: https://img.shields.io/twitter/url?url=https%3A%2F%2Fshields.io
[twitter-url]: https://twitter.com/EdPike365

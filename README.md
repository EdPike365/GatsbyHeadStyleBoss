# gatsby-head-style-boss

[![npm][npm]][npm-url]
[![npm-downloads][npm-downloads]][npm-url]

- Great for supporting multiple delicate legacy CSS style sheets that rely on cascading.
- Configure plugin to embed multiple style sheets in order, in the `<head>`, during SSR.
  - Sheets are available for IIFE flash prevention.
  - WebPack will NOT combine them into `common.css`
- Provide multiple style options, **including Dark Mode**.
- **Prevent default style flash** on page load.
- Configure each sheet to use `<style>` or `<link>`
  - Download and cache remote css files at build time (optional)
  - Dynamically minimize css files (optional) using `postcss` and `cssnano`
- Contains optional React widgets to enable/disable or monitor style sheets.
  - Or write your own components using the API and MVC provider.

## How to install

- `npm i gatsby-head-style-boss`

- Add `gatsby-head-style-boss` to your `gatsby-config.js` file.

- Edit the the plugin config (see examples below):

  - modify the list of css files to match yours.

- In **your** React layout component or Gatsby page template, you will need to remove anywhere you were importing those css files or you will get a double copy.

- If you change a style sheet that is managed by HSB, you must bounce Gatsby to make the changes appear on your site. This works fine for me because I mostly only use `:root` css variables (ex: "--media-width-xs: 320px;") on my site's style sheets and style my components independently using Emotion (css in js).

## Example of usage

`gatsby-config` plugin options give you fine grained control. Settings are used to control the build process and decorate the elements with attributes that let you list, select, and enable/disable them with components. The attributes are name spaced so they won't conflict with anything else you may be using.

`gatsby-config.js`

```js
  {
    resolve: `gatsby-head-style-boss`,
    options: {
      config: {
        minifyBrowserFunction: false,
        styleElements: {
          styleConfigs: [
            {
              key: "normalize",
              displayName: "Normalize2 Reset",
              alwaysEnabled: true,
              componentType: "STYLE",
              crossorigin: "false",
              pathToCSSFile: "./src/styles/normalize2.css",
              staticFileNameOverride: "normalize22.css",
            },
            {
              key: "core",
              displayName: "Core Theme",
              alwaysEnabled: true,
              componentType: "STYLE",
              crossorigin: "false",
              pathToCSSFile: "./src/styles/coreTheme.css",
              minify: true,
            },
            {
              key: "light",
              displayName: "Default, Light Theme",
              alwaysEnabled: false,
              uses: "default",
              componentType: "STYLE",
              pathToCSSFile: "./src/styles/lightTheme.css",
              minify: false,
            },
            {
              key: "dark",
              displayName: "Dark Theme",
              alwaysEnabled: false,
              uses: "dark",
              componentType: "STYLE",
              pathToCSSFile: "./src/styles/darkTheme.css",
              minify: false,
            },
            {
              key: "fire",
              displayName: "Fire Theme",
              alwaysEnabled: false,
              componentType: "STYLE",
              pathToCSSFile: "./src/styles/fireTheme.css",
              remoteHREF: "",
              media: "(max-width: 900px)",
              minify: false,
            },
            {
              key: "jetpack",
              displayName: "Jet Pack",
              componentType: "STYLE",
              remoteHREF:
                "https://hawkwood.com/wp-content/plugins/jetpack/css/jetpack.css?ver=9.8.1",
              cacheRemoteCSS: true,
              minify: true,
            },
          ],
        },
      },
    },
  },
```

```js
//Example of Importing components
import DarkModeToggle from "gatsby-head-style-boss/components/DarkModeToggle"
import StyleSelector from "gatsby-head-style-boss/components/StyleSelector"
import StylesSummary from "gatsby-head-style-boss/components/StylesSummary"
import PrefersDarkMode from "gatsby-head-style-boss/components/PrefersDarkMode"
```

## Top Level Config Options

- `minifyBrowserFunction`: boolean. Default is true.

- `styleConfigs`: array. One per style component that you want. The components will appear in the head in the order that you list them. Only one optional style can be enabled at once.

## Per Style Config Options

- `key`: String. **Required**. Ex: "normalize".

- `displayName`: String. **Required**. Ex: "Normalize2 Reset". Appears in the multi style selector if you are using it.

- `componentType`: String. **\*Required**. "STYLE" or "LINK". Links will have a preceding `preload <link>`, which is how WebPack does it. `STYLE` will always embed the CSS from the specified style sheet.

- `alwaysEnabled`: boolean. true or false. Default false

- `uses`: String. "default", "dark" and "light" are handled with special code associated with the included dark mode toggle component and the flash prevention IIFE.

  - Each style can have multiple space seperated values. If values include "dark", that style will be used for the dark mode toggle. If multiple styles have "dark" or "default", the last one will be used, respectively. "default" will cause that style to be enabled on first load. "default dark" would make that style enabled by default AND if the user has set their OS to "prefers dark mode = true". Do not mark a single style "dark light" because they will conflict. The API will let you write custom controls to leverage "uses" for other things.

- `pathToCSSFile`: string path. Directory must be somewhere below your top project directory. Ex: "./src/styles/normalize2.css".

- `remoteHREF`: string url. Default = "". If you specify an HREF **and** `componentType: STYLE`, the file will automatically be downloaded and inlined. Minification is still an option. If you have the style sheet inside Gatsby src, you should not use `remoteHREF` and `LINK`; use `STYLE` instead, which will inline the style sheet.

- `cacheRemoteCSS`: boolean. Default = true.

  - If you specified `componentType: "LINK"`, and you set `cacheRemoteCSS: false`, the `<link>` will be dynamic. It will stil have a `preload` Link in front of it.
  - If `componentType: "STYLE"`, it will always be cached locally, then injected into the style component.

- `minify`: boolean. Default = true.

- `crossorigin`: String. Default "". Options: "", "anonymous", "use-credentials". [CORS Ref](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Experimental, especially "use-credentials".

- `media`: String. Default "". Lets you specify when your style will become active. [Ref](https://www.w3schools.com/tags/att_style_media.asp). Ex: "(max-width: 600px)". This is experimental. If the media state is not met, the style will still appear in the control components, but when enabled, it will still not take effect until the media query is met. Test by resizing the webpage.

# Notes

## Caveats

- There is no automated testing or Typescript.
- This has only been tested on Chrome.
- The gatsby-node and gatsby-ssr processes use some file system reads and writes. Gatsby wants to warn you that you have to rerun the build to make changes in the read files to appear. HOWEVER, during `gatsby-build` it logs an "error" message. The message is not there for `gatsby-develop`. The message looks like:

> warn Unsafe builtin method was used, future builds will need to rebuild all pages
>
> warn WebpackError: Unsafe builtin usage fs.readFileSync:

## TODO

- Test the LINK components.
- Manually test IIFE and components on more browsers
- TS
- Config settings constraits in gatsby-node.js, using JOI.
- Automated testing
- Make sure the file processing is done in parralel. Try to reduce the number of asyn and awaits to the bare minimum.
- Replace the current CSS file injection code to make it hot reloadable and to be managed and compressed by Babel and WebPack. **This will also get rid of the build warnings about `fs` use.**

See [details.md](details.md) for additonal info.

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/gatsby-head-style-boss.svg
[npm-url]: https://npmjs.com/package/gatsby-head-style-boss
[npm-downloads]: https://img.shields.io/npm/dw/gatsby-head-style-boss
[node]: https://img.shields.io/node/v/gatsby-head-style-boss.svg
[node-url]: https://nodejs.org
[twitter]: https://img.shields.io/twitter/url?url=https%3A%2F%2Fshields.io
[twitter-url]: https://twitter.com/EdPike365

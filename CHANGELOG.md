# CHANGELOG

## v3.2.0

Enabled minifying the IIFE flash prevention function. I had it working with Terser 4 a few days ago. Updated to latest Gatsby before going to bed. Next morning it wouldn't work because Gatsby had upgraded to Terser 5. Terser 4 minify() was `sync`. Terser 5 now only has an `async` minify function. Generally, I try to keep all of the dependencies as **peer dependencies**, so my code was now trying to use sync on an async function. `gatsby-ssr` does NOT allow async so I had to move the logic to `gatsby-node`. This is OK because I want to eventually not use fs.readFile in Gatsby SSR, and I want to leverage caching, which means I need to be using WebPack or only allow LINK options.

Now it uses Terser 5 and has an explicit dependency though the rest are still peers. TODO: test install with Gatsby starter to see if peers are there.

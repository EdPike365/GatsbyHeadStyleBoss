import {minify} from "terser"
//const {minify} = require("terser")

export const minifyJSAsync = async (jsString) => {
  
  //format: { `wrap_iife`: true }
  const options = {
    mangle: false,
    keep_classnames: true,
    keep_fnames: true,
    compress: {
      negate_iife: false
    }
  }

  const result = await minify(jsString, options)
  return result.code

}
/*
module.exports = {
  minifyJSAsync
}
*/
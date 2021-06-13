
export function arrayEquals(a, b) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    )
  }

export const minifyCSSString = (s) => {
  s.replace(/\n/g, '').replace(/\s\s+/g, ' ')
}

export const minifyJSString = (s) => {
  s.replace(/\n/g, '').replace(/\s\s+/g, ' ')
}

export const makeRandomNumberKey = ( max = 1000000) => {
  return Math.floor(Math.random() * max)
}

export const isSSR = () => {
  return typeof window === "undefined"
}
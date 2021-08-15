const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

const makeRandomNumberKey = ( max = 1000000) => {
  return Math.floor(Math.random() * max)
}

const isSSR = () => {
  return typeof window === "undefined"
}

module.exports = {
  arrayEquals,
  makeRandomNumberKey,
  isSSR
}


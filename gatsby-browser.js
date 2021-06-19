import React from "react"
import { HSBStyleContextProvider } from "./contexts/HSB_Context"

export const wrapRootElement = ({ element }) => {
  return (
    <HSBStyleContextProvider >{element}</HSBStyleContextProvider >
  )
}


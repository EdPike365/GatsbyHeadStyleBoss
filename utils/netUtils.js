const axios = require("axios")
const path = require("path")

const downloadStringFromURL = async (urlString) => {
    try {
        const response = await axios.get(urlString)
        return response.data
    } catch (error) {
        console.error(error.response.body)
    }
}

const getFileNameFromURL = (urlString) => {
    const parsedURL = new URL(urlString);
    return path.basename(parsedURL.pathname)
}

module.exports = {
    downloadStringFromURL,
    getFileNameFromURL
}
  

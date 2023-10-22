//import { get } from "axios"
import { basename } from "path"
import pkg from 'axios';
const { get } = pkg;

export const downloadStringFromURL = async (urlString) => {
    try {
        const response = await get(urlString)
        return response.data
    } catch (error) {
        console.error(error.response.body)
    }
}

export const getFileNameFromURL = (urlString) => {
    const parsedURL = new URL(urlString);
    return basename(parsedURL.pathname)
}

  

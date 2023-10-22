import fs, { copyFile as _copyFile, rename, existsSync, mkdirSync } from "fs"
import { resolve, join } from "path"

export const getStringFromFileUTF8Sync = (filePath) => {
  return getStringFromFileUTF8SyncFS(fs, filePath)  
}

//In SSR, you only have one ref to FS and it has to be passed in
export const getStringFromFileUTF8SyncFS = (thisFS, filePath) => {

  let fileContent = ""
  try {
      if(thisFS.existsSync){
          fileContent = thisFS.readFileSync(filePath, "utf-8")
          thisFS.close
      }else{
          console.warn(
              "HSB: getStringFromFileUTF8(): Could not find file " + filePath + ". Check json config file."
              )
      }
  } catch (err) {
      console.error(err)
      thisFS.close
      throw(err)
  }

  return fileContent
}
  
export const copyFile = (currentPath, destinationPath) => {

  _copyFile(currentPath, destinationPath, (err) => {
    if (err) {
      console.error(`Error copying ${currentPath} to ${destinationPath} file!`);
      throw err
    } else {
      console.log(`Successfully copied ${currentPath} to ${destinationPath} file!`);
    }
  });

}
  
export const moveFile = (currentPath, destinationPath) => {

  rename(currentPath, destinationPath, function (err) {
    if (err) {
      console.error(`Successfully moved ${currentPath} to ${destinationPath} file!`);
      throw err
    } else {
      console.log(`Successfully moved ${currentPath} to ${destinationPath} file!`);
    }
  });

}
  
export const showPaths = () => {
  console.log("GatsbyHeadStyleBoss Node Module paths:  ")
  console.log(":\t process.cwd is " + process.cwd())
  console.log(":\t path.resolve(./) " + resolve('./'))
  console.log(":\t __dirname " + __dirname)
  console.log(":\t __filename " + __filename)
}

export const initAppFolder = (folderPath) => {
  const folder = join(process.cwd(), folderPath )
  if (!existsSync(folder)){
    mkdirSync(folder);
  }
  return folder
}

export const getFileNameFromFilePath = (filePath) => {
  //fastest as of https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return filePath.split('\\').pop().split('/').pop();
}

export const insertStringBeforeExtension = (insertion, str) => {
  const pos = str.lastIndexOf(".")
  return [str.slice(0, pos), insertion, str.slice(pos)].join("")
}

export const getCacheDir = () => {
  return join(process.cwd(), ".cache")
}

export const getPublicDir = () => {
  return join(process.cwd(), "public")
}

export const getStaticDir = () => {
  return join(process.cwd(), "static")
}
  /*
export default {
  getStringFromFileUTF8SyncFS,
  getStringFromFileUTF8Sync,
  copyFile,
  moveFile,
  showPaths,
  initAppFolder,
  getFileNameFromFilePath,
  insertStringBeforeExtension,
  getCacheDir,
  getPublicDir,
  getStaticDir
}
  */
const fs = require("fs")
const path = require("path")

const getStringFromFileUTF8Sync = (filePath) => {
  return getStringFromFileUTF8SyncFS(fs, filePath)  
}

//In SSR, you only have one ref to FS and it has to be passed in
const getStringFromFileUTF8SyncFS = (thisFS, filePath) => {

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
  
const copyFile = (currentPath, destinationPath) => {

  fs.copyFile(currentPath, destinationPath, (err) => {
    if (err) {
      console.error(`Error copying ${currentPath} to ${destinationPath} file!`);
      throw err
    } else {
      console.log(`Successfully copied ${currentPath} to ${destinationPath} file!`);
    }
  });

}
  
const moveFile = (currentPath, destinationPath) => {

  fs.rename(currentPath, destinationPath, function (err) {
    if (err) {
      console.error(`Successfully moved ${currentPath} to ${destinationPath} file!`);
      throw err
    } else {
      console.log(`Successfully moved ${currentPath} to ${destinationPath} file!`);
    }
  });

}
  
const showPaths = () => {
  console.log("GatsbyHeadStyleBoss Node Module paths:  ")
  console.log(":\t process.cwd is " + process.cwd())
  console.log(":\t path.resolve(./) " + path.resolve('./'))
  console.log(":\t __dirname " + __dirname)
  console.log(":\t __filename " + __filename)
}

const initAppFolder = (folderPath) => {
  const folder = path.join(process.cwd(), folderPath )
  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
  }
  return folder
}

const getFileNameFromFilePath = (filePath) => {
  //fastest as of https://stackoverflow.com/questions/423376/how-to-get-the-file-name-from-a-full-path-using-javascript
  return filePath.split('\\').pop().split('/').pop();
}

const insertStringBeforeExtension = (insertion, str) => {
  const pos = str.lastIndexOf(".")
  return [str.slice(0, pos), insertion, str.slice(pos)].join("")
}

const getCacheDir = () => {
  return path.join(process.cwd(), ".cache")
}

const getPublicDir = () => {
  return path.join(process.cwd(), "public")
}

const getStaticDir = () => {
  return path.join(process.cwd(), "static")
}
  
module.exports = {
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
  
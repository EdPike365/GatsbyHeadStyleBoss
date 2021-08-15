const path = require("path")

const getStringFromFileUTF8 = (fs, filePath) => {
  
    console.log("HSB: getStringFromFileUTF8(): Loading file: " + filePath)
  
    let fileContent = ""
    try {
        if(fs.existsSync){
            fileContent = fs.readFileSync(filePath, "utf-8")
            fs.close
        }else{
            console.warn(
                "HSB: getStringFromFileUTF8(): Could not find file " + filePath + ". Check json config file."
                )
        }
    } catch (err) {
        console.error(err)
        fs.close
        throw(err)
    }
  
    return fileContent
  }
  
  const copyFile = (fs, currentPath, destinationPath) => {

    fs.copyFile(currentPath, destinationPath, (err) => {
      if (err) {
        console.error(`Error copying ${currentPath} to ${destinationPath} file!`);
        throw err
      } else {
        console.log(`Successfully copied ${currentPath} to ${destinationPath} file!`);
      }
    });
  
  }
  
  const moveFile = (fs, currentPath, destinationPath) => {
  
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

  const initAppFolder = (folderPath, fs) => {
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
  
  module.exports = {
    getStringFromFileUTF8,
    copyFile,
    moveFile,
    showPaths,
    initAppFolder,
    getFileNameFromFilePath
  }
  
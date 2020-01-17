const path = require("path");
const fs = require("fs");

// needs to be launched as a worker thread so that it can be terminated

function loadScript(scriptFileName, sendCommandToGame, globals) {
  return new Promise((resolve, reject) => {
    if (!scriptFileName) return console.error("Must specify a file name!");
    const directoryPath = path.join(__dirname, "scripts");
    fs.readdir(directoryPath, async (err, fileNameList) => {
      if (err)
        return console.log(
          "Unable to open list of script files in /script directory:",
          err
        );
      // for now, no fancy checking:
      if (!fileNameList.includes(scriptFileName + ".js")) {
        console.error("Could not find script named", scriptFileName);
      }
      const scriptFullPath = path.join(directoryPath, scriptFileName + ".js");
      try {
        removeScriptFromCache(scriptFullPath);
        let load = require(scriptFullPath);
        let { run, parseText } = await load(sendCommandToGame, globals);
        resolve(parseText);
        await run();
        parseText = () => { };
        console.log("Script ended:", scriptFileName);
      } catch (err) {
        console.error("Error running script", scriptFileName, ":", err);
        return reject(() => { });
      }
    });
  });
}

module.exports = { loadScript };

function removeScriptFromCache(path) {
  console.log('clearing script cache:', path);
  delete require.cache[path];
}
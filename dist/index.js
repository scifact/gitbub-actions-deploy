(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs = require("fs");
    const path = require("path");
    // console.log(JSON.stringify(github.context));
    const util = require("util");
    const readFileAsync = util.promisify(fs.readFile);
    try {
        var readFileTasks = [];
        getFilesFromDir("../demo", [".json"])
            .forEach(function (filePath) {
            if (filePath.toLowerCase().endsWith('scif.json')) {
                var t = readFileAsync(filePath, { encoding: 'utf-8' });
                readFileTasks.push(t);
            }
            console.log(filePath);
        });
        Promise.all(readFileTasks).then(fileContents => {
            fileContents
                .forEach(function (fileContent) {
                var flow = JSON.parse(fileContent);
                flow.elements.forEach(element => {
                    if (element.settings != null) {
                        // console.log(element.settings);
                        for (var setting in element.settings) {
                            // setting.value;
                            console.log(setting);
                        }
                        ;
                    }
                });
            });
        });
    }
    catch (ex) {
        console.error(ex);
    }
    function getFilesFromDir(dir, fileTypes) {
        var filesToReturn = [];
        function walkDir(currentPath) {
            var files = fs.readdirSync(currentPath);
            for (var i in files) {
                var curFile = path.join(currentPath, files[i]);
                if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                    filesToReturn.push(curFile.replace(dir, ''));
                }
                else if (fs.statSync(curFile).isDirectory()) {
                    walkDir(curFile);
                }
            }
        }
        ;
        walkDir(dir);
        return filesToReturn;
    }
});

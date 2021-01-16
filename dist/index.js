(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@actions/core", "@actions/github", "fs", "path", "util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const core = require("@actions/core");
    const github = require("@actions/github");
    const fs = require("fs");
    const path = require("path");
    const util = require("util");
    const readFileAsync = util.promisify(fs.readFile);
    const mainPath = './';
    try {
        let readFileTasks = getFilesContentAsync('scif.json');
        getSettingVariableNames(readFileTasks)
            .then(settingNames => {
            settingNames.forEach(settingName => {
                let value = core.getInput(settingName);
                if (value) {
                    core.info(`SettingName ${settingName} has value with a length of ${value.length}`);
                }
                else {
                    throw new Error(`SettingName ${settingName} does not contain a value`);
                }
            });
        })
            .catch(e => { });
        core.info(`ref: ${github.context.ref}`);
        core.info(`repo: ${github.context.repo}`);
        core.info(`sha: ${github.context.sha}`);
    }
    catch (ex) {
        console.error(ex);
    }
    async function getSettingVariableNames(readFileTasks) {
        var fileContents = await Promise.all(readFileTasks);
        var settingNames = [];
        fileContents
            .forEach(function (fileContent) {
            var flow = JSON.parse(fileContent);
            flow.elements.forEach(element => {
                if (element.settings != null) {
                    for (var setting in element.settings) {
                        var value = element.settings[setting];
                        if (value) {
                            if (settingNames.indexOf(value.toUpperCase()) < 0) {
                                settingNames.push(value.toUpperCase());
                            }
                        }
                    }
                    ;
                }
            });
        });
        return settingNames;
    }
    function getFilesContentAsync(fileExtention) {
        var readFileTasks = [];
        getFilesFromDir(mainPath, ['.json'])
            .forEach(function (filePath) {
            if (filePath.toLowerCase().endsWith(fileExtention)) {
                var t = readFileAsync(filePath, { encoding: 'utf-8' });
                readFileTasks.push(t);
            }
            console.log(filePath);
        });
        return readFileTasks;
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

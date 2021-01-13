import * as core from '@actions/core';
import * as  github from '@actions/github';
import * as fs from 'fs';
import * as path from 'path';

// console.log(JSON.stringify(github.context));
import * as util from 'util';
const readFileAsync = util.promisify(fs.readFile)

try {

    let readFileTasks = getFilesContentAsync('scif.json');

    getSettingVariableNames(readFileTasks)
        .then(settingNames => settingNames.forEach(s => console.log(s)));

} catch (ex) {
    console.error(ex);
}

async function getSettingVariableNames(readFileTasks: Promise<string>[]): Promise<string[]> {

    var fileContents = await Promise.all(readFileTasks);

    var settingNames: string[] = [];

    fileContents
        .forEach(function (fileContent: string) {
            var flow = JSON.parse(fileContent) as Flow;
            flow.elements.forEach(element => {

                if (element.settings != null) {
                    for (var setting in element.settings) {
                        var value = element.settings[setting]?.toUpperCase();
                        if (value) {
                            if (settingNames.indexOf(value) < 0) {
                                settingNames.push(value);
                            }
                        }
                    };
                }

            });

        });

    return settingNames;
}

function getFilesContentAsync(fileExtention: string): Promise<string>[] {
    var readFileTasks = [];
    getFilesFromDir("../demo", [".json"])
        .forEach(function (filePath: string) {

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
            } else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    };
    walkDir(dir);
    return filesToReturn;
}
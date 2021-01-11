import * as core from '@actions/core';
import * as  github from '@actions/github';
var fs = require('fs');

console.log(JSON.stringify(github.context));

fs.readdir('./', function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
});

// core.getInput
// const nameToGreet = core.getInput('who-to-greet');
// console.log(`Hello ${nameToGreet.length}!`);

// for (var element in process.env) {
//     core.log(`${element}: ${process.env[element].length}`);
// };


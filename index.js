define("index", ["require", "exports", "@actions/core"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet.length}!`);
});
// for (var element in process.env) {
//     core.log(`${element}: ${process.env[element].length}`);
// };

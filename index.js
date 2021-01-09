System.register("index", ["@actions/core"], function (exports_1, context_1) {
    "use strict";
    var core, nameToGreet;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (core_1) {
                core = core_1;
            }
        ],
        execute: function () {
            nameToGreet = core.getInput('who-to-greet');
            console.log(`Hello ${nameToGreet.length}!`);
            // for (var element in process.env) {
            //     core.log(`${element}: ${process.env[element].length}`);
            // };
        }
    };
});

const core = require('@actions/core');

const nameToGreet = core.getInput('who-to-greet');
console.log(`Hello ${nameToGreet.length}!`);

// for (var element in process.env) {
//     core.log(`${element}: ${process.env[element].length}`);
// };


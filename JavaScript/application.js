'use strict';

// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log(require('testmod'));
console.log('From application global context');

const fs = require('fs');
console.dir( fs.OTL );
// console.log(fs.readdirSync('../../../../../s'));
// const mkdirp = require('mkdirp');
// console.dir({ mkdirp });

// mkdirp('/hello/world', (err) => {
//   if (err) console.error(err);
//   else console.log('pow!');
// });
console.log('BBBBBBBBBBBBBBBBBBBBBBBBBBBB')
module.exports = () => {
  // Print from the exported function context
  console.log('From application exported function');
};


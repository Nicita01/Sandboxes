'use strict';

// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

// The framework can require core libraries
const fs = require('fs');
const vm = require('vm');
const sfs = require('sandboxed-fs');

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
const context = {
  module: {},
  console,
  __dirname,
  require: (name) => {
    if (name === 'fs') return sfs.bind('./');
    module.paths.forEach((curPath) => {
      fs.access(curPath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.readdirSync(curPath).forEach((curModule) => {
            if (name === curModule) {
              console.log(curPath + '/' + curModule);
              return execute(curPath + '/' + curModule)
            }
          });
        } 
      });
    });
    fs.readdirSync('./').forEach((curFile) => {
      console.log('REQUIRE ++++++++++++++++++++++++++++')
      if (name === __dirname + '/' + curFile) {
        console.log('./' + curFile);
        return execute('./' + curFile)
      }
    });
    // return require();
  }
};

context.global = context;
const sandbox = vm.createContext(context);

function execute(fileName) {
  console.log(fileName);
  fs.readFile(fileName, (err, src) => {
    console.log(src.toString());
    let script;
    try {
      script = new vm.Script(src, { timeout: PARSING_TIMEOUT });
      //console.dir({ script });
    } catch (e) {
      console.dir(e);
      process.exit(1);
    }
    try {
      script.runInNewContext(sandbox, { timeout: EXECUTION_TIMEOUT });
      const exported = sandbox.module.exports;
      console.dir({ exported });
      return exported;
    } catch (e) {
      console.dir(e);
      process.exit(1);
    }
  });
}

execute('./application.js');

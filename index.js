var FindApp = require('fxos-findapp');
var repl = require("repl");
var FirefoxREPL = require('fxconsole');
var Q = require('q');

module.exports = Console;

function Console(opts, callback) {
  opts = opts || {};
    
  return FindApp(opts)
    .then(function(app) {
      var fxconsole = new FirefoxREPL();
      fxconsole.client = opts.client;
      fxconsole.page = app;
      fxconsole.repl = repl.start({
        prompt: fxconsole.getPrompt(),
        eval: fxconsole.eval.bind(fxconsole),
        input: opts.stdin || process.stdin,
        output: opts.stdout || process.stdout,
        writer: fxconsole.writer.bind(fxconsole)
      });
    })
    .nodeify(callback);
}

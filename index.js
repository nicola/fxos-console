var FindApp = require('fxos-findapp');
var repl = require("repl");
var FirefoxREPL = require('fxconsole');
var Q = require('q');

module.exports = Console;

function Console(opts, callback) {
  opts = opts || {};
  
  var promise = FindApp(opts)
    .then(function(app) {
      var deferred = Q.defer();

      app.Console.startListening(function(a,b) {

        var fxconsole = new FirefoxREPL();
        fxconsole.client = opts.client;
        fxconsole.page = app;
        fxconsole.repl = repl.start({
          prompt: fxconsole.getPrompt(),
          eval: fxconsole.eval.bind(fxconsole),
          input: process.stdin,
          output: process.stdout,
          writer: fxconsole.writer.bind(fxconsole)
        });

        app.Console.on("page-error", function(event) {
          fxconsole.write(event.errorMessage);
        });

        app.Console.on("console-api-call", function(event) {
          if (event.level == 'log') {
            if (typeof event.arguments[0] == 'string' ||
                typeof event.arguments[0] == 'number') {
              fxconsole.write(event.arguments[0].toString());
            }
            else if (event.arguments[0] && event.arguments[0].obj) {
              fxconsole.write(event.arguments[0].obj);
            }
          }
        });

        deferred.resolve(app);
      });

      return deferred.promise;
    });

    if (callback) {
      return promise.then(
        function(app) { callback(null, app); }
      ).done();
    }
    else {
      return promise;
    }
}
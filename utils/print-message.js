const chalk = require('chalk');
const log = console.log;
let debug = false;

function printConvertedOutput(orig, cvt) {
  const input = Array.isArray(orig) ? orig.join(' ') : orig;
  log(
    chalk.green('The given input time ') +
      chalk.blue(`${input}`) +
      chalk.green(' equals: ') +
      chalk.blue(`${cvt}`) +
      chalk.green(' ms')
  );
}

function reportError(msg, exitCode) {
  const exit = exitCode || 1;
  if (msg && typeof msg === 'string' && msg.trim().length > 1) {
    log(chalk.red(msg));
  }
  if (exit !== -1) {
    process.exit(exit);
  }
}

function printDebug(msg) {
  if(debug) {
    log(chalk.grey(`[DEBUG] ${msg}`));
  }
}

module.exports = {
    printConvertedOutput,
    reportError,
    printDebug,
    enableDebug: function (enableDebug) { debug = enableDebug; }
};
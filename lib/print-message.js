const chalk = require('chalk');

const { log } = console;
let debug = false;

function printConvertedOutput(orig, cvt, unit) {
  log(
    chalk.green('The given input time ') +
      chalk.blue(`${orig}`) +
      chalk.green(' equals: ') +
      chalk.blue(`${cvt}${unit}`),
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
  if (debug) {
    log(chalk.grey(`[DEBUG] ${msg}`));
  }
}

module.exports = {
  printConvertedOutput,
  reportError,
  printDebug,
  enableDebug: (enableDebug) => {
    debug = enableDebug;
  },
};

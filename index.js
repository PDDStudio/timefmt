const { msg, fmt } = require('./utils');

module.exports = function(val) {
  if (!val) {
    msg.reportError('No input value specified!');
  }
  msg.printDebug(`Input value: ${val}`);
  
  const result = Array.isArray(val) ? fmt.fmtArray(val) : fmt.fmtSingle(val);
  if (!result) {
    msg.reportError('An error occurred when trying to parse converted result!');
  }
  msg.printConvertedOutput(val, result);
};

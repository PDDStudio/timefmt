const { convertTime } = require('./convert');
const { printConvertedOutput } = require('./print-message');
const timeUnits = require('./time-units');

module.exports = {
  convertTime: (input, opts) => convertTime(input, opts),
  printOutput: (input, output) => printConvertedOutput(input, output.value, output.unit),
  TimeUnits: timeUnits,
};

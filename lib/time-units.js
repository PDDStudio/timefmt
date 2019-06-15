const { isArray } = require('util');
const { printDebug } = require('./print-message');

const unitMappings = new Map();

unitMappings.set('h', ['h', 'hour', 'hours']);
unitMappings.set('min', ['m', 'min', 'minute', 'minutes']);
unitMappings.set('s', ['s', 'sec', 'secs', 'second', 'seconds']);
unitMappings.set('ms', ['ms', 'millisecond', 'milliseconds']);

function getUnitForAlias(alias) {
  printDebug(`getUnitForAlias(): Trying to resolve proper time unit for alias '${alias}'`);

  unitMappings.forEach((val, key) => {
    if (isArray(val) && val.includes(alias)) {
      return key;
    }
  });
  printDebug(`Unable to resolve unit for alias '${alias}'`);
  return undefined;
}

function getAllTimeUnitAliases() {
  const aliases = [];
  unitMappings.forEach((val) => {
    if (isArray(val)) {
      aliases.push(...val);
    }
  });
  return aliases;
}

module.exports = {
  resolveTimeUnit: alias => getUnitForAlias(alias),
  getAvailableAliases: () => getAllTimeUnitAliases(),
};

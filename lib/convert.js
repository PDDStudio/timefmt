const convert = require('convert-units');
const merge = require('lodash.merge');
const {
  isNumber,
  isString,
  isNullOrUndefined,
  isArray,
} = require('util');
const { enableDebug, printDebug } = require('./print-message');

const defaultOpts = {
  targetUnit: 'ms', // TODO: set target unit via cli param
  debug: (process.env.NODE_ENV !== 'production'),
};

function configureDebugOutput(options) {
  if ((process.env.NODE_ENV !== 'production') || (options && options.debug)) {
    enableDebug(true);
  }
}

function validateInput(input) {
  if (isNullOrUndefined(input) || !isString(input)) {
    throw new Error('Unable to split input value: It\'s either not defined or not a string!');
  }
}

function validateIfInputIsNumber(input) {
  validateInput(input);
  try {
    const parsedValue = parseInt(input);
    return parsedValue && isNumber(parsedValue);
  } catch (error) {
    printDebug(`An error occurred during input validation: ${error.message}`);
  }
  return false;
}

// sample input: 12h / 4s / 1min
function processInputBlock(input) {
  validateInput(input);
  printDebug(`processInputBlock() Input: ${JSON.stringify(input)}`);

  let numbers = '';
  let targetUnit = '';
  let unitProcessed = false;

  for (let i = 0; i < input.length; i++) {
    if (unitProcessed) {
      break;
    }

    const currentChar = input.charAt(i);

    if (validateIfInputIsNumber(currentChar)) {
      numbers += currentChar;
    } else {
      targetUnit = input.substring(i);
      unitProcessed = true;
    }
  }

  const obj = { value: parseInt(numbers), unit: targetUnit };
  printDebug(`Created input block object: ${JSON.stringify(obj)}`);
  return obj;
}

/**
 * Takes the whole input value (e.g "1d 12h 40min") and splits the different pieces into "blocks".
 * A block is a simple, plain JavaScript object which holds information about the actual input value (numbers) & unit (string)
 *
 * @returns An array of "block" items.
 */
function splitInputString(input) {
  validateInput(input);
  const splitted = input.split(' ');
  printDebug(`splitInputString(): ${input} -> ${JSON.stringify(splitted)}`);

  const blocks = [];
  splitted.forEach((item, index) => {
    const position = index + 1;
    printDebug(`Splitted Input #${position}: ${JSON.stringify(item)}`);
    const blockItem = processInputBlock(item);
    if (!isNullOrUndefined(blockItem)) {
      blocks.push(blockItem);
    }
  });
  return blocks;
}

function convertValueToUnit(inputObject, target) {
  if (!inputObject || isNullOrUndefined(inputObject) || isNullOrUndefined(target)) {
    throw new Error(`Invalid input provided for conversation operation! Input: ${inputObject ? JSON.stringify(inputObject) : undefined} / Target: ${target}`);
  }

  try {
    const cvtResult = convert(inputObject.value).from(inputObject.unit).to(target);
    printDebug(`Converted input ${JSON.stringify(inputObject)}. Result value: ${cvtResult}${target}`);
    return { input: inputObject, targetUnit: target, outputResult: cvtResult };
  } catch (error) {
    throw new Error(`An error occurred during conversion: ${error.message}`);
  }
}

function convertInputBlock(inputBlock, opts) {
  const { value, unit } = inputBlock;
  if (isNullOrUndefined(value) || isNullOrUndefined(unit)) {
    throw new Error('Missing at least one required property [value, unit] in input block!');
  }

  const resultObject = convertValueToUnit(inputBlock, opts.targetUnit);
  if (!resultObject || isNullOrUndefined(resultObject)) {
    throw new Error('No result returned from convertValueToUnit!');
  }
  return resultObject;
}

module.exports = {
  convertTime: (input, options) => {

    // prepare and configure converter module
    const opts = merge({}, defaultOpts, options);
    configureDebugOutput(opts);
    printDebug(`convertTime(): Options provided by user: ${isNullOrUndefined(options) ? undefined : JSON.stringify(options)}`);
    printDebug(`convertTime(): Starting conversion with options: ${JSON.stringify(opts)}`);

    // start processing data
    const data = splitInputString(input);
    if (!isArray(data)) {
      throw new Error(`Splitted data is not an array! Actual: ${data}`);
    }
    printDebug(`Splitted input string: ${JSON.stringify(data)}`);

    let totalResult = 0;

    data.forEach((item) => {
      const convertedResult = convertInputBlock(item, opts);
      if (isNullOrUndefined(convertedResult)) {
        throw new Error('Failed to convert target input block. Conversion result is not defined.');
      }
      if (convertedResult.outputResult && isNumber(convertedResult.outputResult)) {
        totalResult += convertedResult.outputResult;
      }
    });
    const returnObject = { value: totalResult, unit: opts.targetUnit };
    printDebug(`Conversation completed. Output: ${JSON.stringify(returnObject)}`);
    return returnObject;
  },
};

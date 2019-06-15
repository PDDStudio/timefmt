#!/usr/bin/env node

/* eslint-disable */

// import library module
const lib = require('../lib');
const { TimeUnits } = lib;

// import and setup external requirements
const yargs = require('yargs')
              .scriptName('timefmt')
              .usage('Usage: $0 [time] --output <unit>')
              .example('$0 1min 30s --output ms', 'Converts 1min 30secs into milliseconds')
              .option('output', {
                alias: ['o', 'out', 'to'],
                describe: 'Set the output unit used for input conversion',
                choices: TimeUnits.getAvailableAliases(),
              })
              .option('debug', {
                alias: 'd',
                default: false,
                required: false,
              })
              .help()
              .alias('h', 'help')
              .alias('v', 'version')
              .showHelpOnFail(true)
              .version();

// prepare parsed arguments
const { argv } = yargs;

// configure conversion options
const conversionOptions = {
  debug: (argv.d || argv.debug),
  targetUnit: TimeUnits.resolveTimeUnit(argv.output),
};

function convertInput(input, opts) {
  const result = lib.convertTime(input, opts);
  if (result) {
    lib.printOutput(input, result);
  }
}

// TODO: better input validation in case of invalid/missing options/args (?)
const input = argv._.join(' ').toLowerCase().trim();

// input should contain at least 1 digit and one character for the target unit
if (input.length >= 2) {
  convertInput(input, conversionOptions);
} else {
  yargs.showHelp();
}

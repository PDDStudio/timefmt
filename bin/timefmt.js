#!/usr/bin/env node

const argv = require ('yargs')
                .usage('Usage: $0 --ms [time] [...time]')
                .example('$0 --ms 1m 30s', 'Format 1min 30secs into milliseconds')
                .options({
                  ms: {
                    alias: 'milliseconds',
                    description: 'Time to convert to ms',
                    required: true,
                    requiresArg: true,
                    array: true,
                  }
                })
                .boolean('d')
                .alias('d', 'debug')
                .default('d', false)
                .help('h')
                .alias('h', 'help')
                .version('v')
                .alias('v', 'version')
                .argv;

const cvt = require('../');
const msg = require('../lib/print-message');

msg.enableDebug(argv.d || argv.debug);

msg.printDebug(JSON.stringify(argv));
const val = argv.ms.concat(argv._);
if(val) {
    cvt(val);
} else {
    msg.reportError('Missing args: <ms>');
}

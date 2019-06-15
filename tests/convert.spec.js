const { isNullOrUndefined } = require('util');
const expect = require('expect.js');
const converter = require('../lib/convert');

const CVT_INPUT_TIME = '2h 5min 13s';

describe('Running test-suite for converter module', () => {

  it('Conversion module should return converted result', (done) => {
    setTimeout(done, 1000);
    const convertedResultObj = converter.convertTime(CVT_INPUT_TIME, { targetUnit: 's' });

    expect(convertedResultObj).not.to.be(undefined);
    expect(convertedResultObj.value).not.to.be(undefined);
    expect(convertedResultObj.unit).not.to.be(undefined);

    if (!isNullOrUndefined(convertedResultObj)) {
      console.log(`${CVT_INPUT_TIME} => ${convertedResultObj.value}${convertedResultObj.unit}`);
    }
  });

});

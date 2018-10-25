const ms = require('ms');

module.exports = {
    fmtSingle: function (input) {
        if (!input) {
          return 0;
        }
        return ms(input);
    },
    fmtArray: function (input) {
        let result = 0;
        input.forEach(element => {
            const res = this.fmtSingle(element);
            result += res;
        });
        return result;
    },
};
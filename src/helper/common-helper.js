const request = require("request");

export const dlFile = (url, callback) => {
    var request = require('request').defaults({ encoding: null });
    request.get(url, function (err, res, body) {
        if (callback)
            callback(body);
    });
}

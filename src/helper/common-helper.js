const request = require("request");
const fs = require('fs')

export const dlFile = (url, callback) => {
    var request = require('request').defaults({ encoding: null });
    request.get(url, function (err, res, body) {
        if (callback)
            callback(body);
    });
}

export const addAppLog = (content) => {
    try {
        const todayDate = getTodayDate();
        const filePathCalc = `./app-log/log-${todayDate}.json`;

        try {
            content = JSON.stringify(content);
        } catch {
            // Do nothing
        }

        content = JSON.stringify(content) + "\r\n--------------------------------------------------\r\n";

        fs.appendFile(filePathCalc, content, 'utf8', () => { });
    } catch (err) {
        // Do nothing
    }
}

const getTodayDate = (splitter = "") => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = `${yyyy}${splitter}${mm}${splitter}${dd}`;

    return today;
}

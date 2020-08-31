const request = require("request");
const fs = require("fs")

export const dlFile = (url, callback) => {
    var request = require("request").defaults({ encoding: null });
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
            try {
                if (content?.from?.id) {
                    const username = content?.from?.id + "_" + content?.from?.username;

                    addToSubscribedUserLog(username);
                }
            } catch {

            }

            content = JSON.stringify(content);
        } catch {
            // Do nothing
        }

        content = JSON.stringify(content) + "\r\n--------------------------------------------------\r\n";

        fs.appendFile(filePathCalc, content, "utf8", () => { });
    } catch (err) {
        // Do nothing
    }
}

const getTodayDate = (splitter = "") => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();

    today = `${yyyy}${splitter}${mm}${splitter}${dd}`;

    return today;
}

export const getSubscribedUserCount = (callback) => {
    try {
        const fileSubscribedUser = `./app-log/log-subscribed-user.json`;

        fs.readFile(fileSubscribedUser, "utf8", function (err, data) {
            const count = data.split("\r\n");

            if (callback)
                callback(count);
        });
    }
    catch {
    }
}

const addToSubscribedUserLog = (username) => {
    try {
        const todayDate = getTodayDate();
        const fileSubscribedUser = `./app-log/log-subscribed-user.txt`;
        const content = `${todayDate}: ${username}\r\n`;
        
        fs.readFile(fileSubscribedUser, "utf8", function (err, data) {
            console.log(data);
            if (data && !data.includes(username))
                fs.appendFile(fileSubscribedUser, content, "utf8", () => { });
        });
    }
    catch {
    }
}

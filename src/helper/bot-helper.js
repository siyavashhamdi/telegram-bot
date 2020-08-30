/**
 * This example demonstrates using polling.
 * It also demonstrates how you would process and send messages.
 */

import sharp from "sharp";
import { overlayImage } from "./image-helper.js";
import { dlFile, dlFileToFile } from "./common-helper.js";
var https = require('https');

const TOKEN = process.env.TELEGRAM_TOKEN || "678473327:AAEhecNnoRB5e2PvFUpTc0bpE82loli6iZA";
import TelegramBot from "node-telegram-bot-api";
const request = require("request");
const options = {
    polling: true
};
const bot = new TelegramBot(TOKEN, options);

bot.on('message', msg => {
    console.log("Message received. msg.message_id: " + msg.message_id);

    if (msg.photo != undefined) {
        const fileId = msg.photo[2].file_id;

        bot.getFile(fileId).then(async fileUri => {
            const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${fileUri.file_path}`;

            dlFile(fileUrl, body => {
                console.log(body);
                const in1 = "img/father.png";
                const in2 = "img/example.jpg";
                const out = "img/output/02.jpg";

                sharp(in1)
                    //.resize(300, 200)
                    .toBuffer()
                    .then(outputBuffer => {
                        // outputBuffer contains upside down, 300px wide, alpha channel flattened
                        // onto orange background, composited with overlay.png with SE gravity,
                        // sharpened, with metadata, 90% quality WebP image data. Phew!

                        bot.sendPhoto(msg.chat.id, outputBuffer);
                        console.log(outputBuffer)
                    });;
            });
        });
    }
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;

    switch (action) {
        case "father":
            text = "👨‍🦰";
            break;

        case "mother":
            text = "👱‍♀️";
            break;

        case "parents":
            text = "👨‍👨‍👦";
            break;

        default:
            return;
    }

    text = `شما "${text}" را انتخاب کردید.`;


    bot.editMessageText(text, opts);
});

// // Matches /photo
// bot.onText(/\/photo/, (msg) => {
//     // From file path
//     const photo = `${__dirname}/../test/data/photo.gif`;
//     bot.sendPhoto(msg.chat.id, photo, {
//         caption: "I'm a bot!"
//     });
// });


// // Matches /audio
// bot.onText(/\/audio/, (msg) => {
//     // From HTTP request
//     const url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg";
//     const audio = request(url);
//     bot.sendAudio(msg.chat.id, audio);
// });


// // Matches /love
// bot.onText(/\/love/, (msg) => {
//     const opts = {
//         reply_to_message_id: msg.message_id,
//         reply_markup: JSON.stringify({
//             keyboard: [
//                 ["Yes, you are the bot of my life ❤"],
//                 ["No, sorry there is another one..."]
//             ]
//         })
//     };
//     bot.sendMessage(msg.chat.id, "Do you love me?", opts);
// });


// // Matches /echo [whatever]
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     const resp = match[1];
//     bot.sendMessage(msg.chat.id, resp);
// });


// // Matches /editable
// bot.onText(/\/editable/, (msg) => {
//     // we shall check for this value when we listen for "callback_query"

//     const opts = {
//         reply_markup: {
//             inline_keyboard: [
//                 [{
//                     text: "#من_پدر_فرزندپذیرم - 👨‍🦰",
//                     callback_data: "father"
//                 }],
//                 [{
//                     text: "#من_مادر_فرزندپذیرم - 👱‍♀️",
//                     callback_data: "mother"
//                 }],
//                 [{
//                     text: "#ما_والدین_فرزندپذیریم - 👨‍👨‍👦",
//                     callback_data: "parents"
//                 }]
//             ]
//         }
//     };

//     bot.sendMessage(msg.from.id, "لطفاً یک هشتگ را انتخاب کنید...", opts);
// });


// // Matches photo received
// bot.on(/\/editable/, (msg) => {
//     // we shall check for this value when we listen for "callback_query"

//     const opts = {
//         reply_markup: {
//             inline_keyboard: [
//                 [{
//                     text: "#من_پدر_فرزندپذیرم - 👨‍🦰",
//                     callback_data: "father"
//                 }],
//                 [{
//                     text: "#من_مادر_فرزندپذیرم - 👱‍♀️",
//                     callback_data: "mother"
//                 }],
//                 [{
//                     text: "#ما_والدین_فرزندپذیریم - 👨‍👨‍👦",
//                     callback_data: "parents"
//                 }]
//             ]
//         }
//     };

//     bot.sendMessage(msg.from.id, "لطفاً یک هشتگ را انتخاب کنید...", opts);
// });

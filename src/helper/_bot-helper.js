import { overlayImage } from "./image-helper.js";
import { dlFile } from "./common-helper.js";
import TelegramBot from "node-telegram-bot-api";

const botToken = process.env.TELEGRAM_TOKEN || "678473327:AAEhecNnoRB5e2PvFUpTc0bpE82loli6iZA";
const botOptions = { polling: true };
const bot = new TelegramBot(botToken, botOptions);

const savedPhotoMsgId = {};

// Handle message receieved
bot.on('message', msg => {
    if (msg.photo == undefined)
        return;

    const fileId = msg.photo[msg.photo.length - 1].file_id;

    savedPhotoMsgId[msg.message_id] = fileId;

    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "#من_پدر_فرزندپذیرم - 👨‍🦰",
                    callback_data: `father_${msg.message_id}`
                }],
                [{
                    text: "#من_مادر_فرزندپذیرم - 👱‍♀️",
                    callback_data: `mother_${msg.message_id}`
                }],
                [{
                    text: "#ما_والدین_فرزندپذیریم - 👨‍👨‍👦",
                    callback_data: `parents_${msg.message_id}`
                }]
            ]
        }
    };

    bot.sendMessage(msg.from.id, "لطفاً یک هشتگ را انتخاب کنید...", opts);
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
    const cbqData = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };

    const cbDataAction = cbqData.split("_")[0];
    const cbMsgId = cbqData.split("_")[1] * 1;
    const cbFileId = savedPhotoMsgId[cbMsgId];

    delete savedPhotoMsgId[cbMsgId];

    // let text;
    let selectedImgOverlayKey = '';
    switch (cbDataAction) {
        case "father":
            // text = "👨‍🦰";
            selectedImgOverlayKey = cbDataAction;
            break;

        case "mother":
            // text = "👱‍♀️";
            selectedImgOverlayKey = cbDataAction;
            break;

        case "parents":
            // text = "👨‍👨‍👦";
            selectedImgOverlayKey = cbDataAction;
            break;

        default:
            text = "گزینه نامشخص";
    }

    // text = `شما "${text}" را انتخاب کردید.`;

    bot.deleteMessage(msg.chat.id, msg.message_id);

    bot.getFile(cbFileId).then(async fileUri => {
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileUri.file_path}`;

        dlFile(fileUrl, imgStream => {
            overlayImage(imgStream, selectedImgOverlayKey, outImgStream => {
                bot.sendPhoto(msg.chat.id, outImgStream);
            });
        });
    });
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

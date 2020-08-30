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

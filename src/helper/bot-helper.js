import { overlayImage } from "./image-helper.js";
import { dlFile, addAppLog, getSubscribedUserCount } from "./common-helper.js";
import TelegramBot from "node-telegram-bot-api";

const botToken = "1301311004:AAHQE_gP7-AuqtrKdk_NUb5ErkfMty-dUeQ";
const botOptions = { polling: true };
const bot = new TelegramBot(botToken, botOptions);

const logGroup = { chatId: -429304995, fromChatId: 399011801 };
const savedPhotoMsgId = {};

// Handle message receieved
bot.on('message', msg => {
    // Make logs
    console.log(msg);
    addAppLog(msg);
    try { bot.sendMessage(logGroup.chatId, JSON.stringify(msg, null, "    ")); } catch { }

    if (msg?.chat?.type !== "private")
        return;

    if (msg?.text === "/start")
        bot.sendMessage(msg.from.id, "سلام، خوش آمدید.\r\nبرای شروع تصویری را بارگذاری نمایید.");

    if (msg?.text === "/get-subscribed-user-count") {

        getSubscribedUserCount(count => {
            const sendData = `تعداد افراد استفاده‌کننده: ${count}`;
            bot.sendMessage(msg.from.id, sendData);
        });
    }

    if (msg.photo == undefined)
        return;

    const fileId = msg.photo[msg.photo.length - 1].file_id;

    savedPhotoMsgId[msg.message_id] = fileId;

    // Make log
    bot.getFile(fileId).then(async fileUri => {
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileUri.file_path}`;

        dlFile(fileUrl, imgStream => {
            try { bot.sendPhoto(logGroup.chatId, imgStream, { caption: JSON.stringify(msg.chat, null, "    ") }); } catch { }
        });
    });

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
        },
        reply_to_message_id: msg.message_id
    };

    bot.sendMessage(msg.from.id, "لطفاً یک هشتگ را انتخاب کنید...", opts);
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
    const cbqData = callbackQuery.data;
    const msg = callbackQuery.message;

    // Make logs
    console.log(msg);
    addAppLog(msg);
    try { bot.sendMessage(logGroup.chatId, JSON.stringify(msg, null, "    ")); } catch { }

    if (msg?.chat?.type !== "private")
        return;

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

    bot.deleteMessage(msg?.chat?.id, msg.message_id);

    bot.getFile(cbFileId).then(async fileUri => {
        const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileUri.file_path}`;

        dlFile(fileUrl, imgStream => {
            overlayImage(imgStream, selectedImgOverlayKey, async outImgStream => {
                const sentPhoto = await bot.sendPhoto(msg.chat.id, outImgStream, { reply_to_message_id: cbMsgId });

                try {
                    const frwdPhoto = await bot.forwardMessage(logGroup.chatId, logGroup.fromChatId, sentPhoto.message_id, { caption: "ss" });

                    bot.sendMessage(logGroup.chatId, JSON.stringify(msg.chat, null, "    "), { reply_to_message_id: frwdPhoto.message_id });
                } catch { }
            });
        });
    });
});

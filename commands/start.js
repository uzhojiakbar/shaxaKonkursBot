const User = require("../models/User");

async function startCommand(bot, msg) {
  const chatId = msg.chat.id;
  const referalId =
    msg.text && msg.text.startsWith("/start ") ? msg.text.split(" ")[1] : null; // Referal ID ni aniqlash

  let user = await User.findOne({ telegramId: chatId });

  if (!user) {
    user = new User({
      telegramId: chatId,
      tempReferalId: referalId, // Referal ID vaqtinchalik saqlanadi
    });
    await user.save();
  }

  bot.sendMessage(
    chatId,
    "Ro'yxatdan otishs uchun Telefon raqamingizni yuboring: \n\n*(Sms korinishidagi yubormang!, pastdagi tugmadan foydalaning)*",
    {
      parse_mode: "Markdown",
      reply_markup: {
        keyboard: [[{ text: "Kontakt yuborish", request_contact: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    }
  );
}

module.exports = { startCommand };

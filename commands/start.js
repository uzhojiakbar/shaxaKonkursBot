const User = require("../models/User");

async function startCommand(bot, msg) {
  const chatId = msg.chat.id;

  // Taklif qilgan odamning ID'sini olish
  const referalId = msg.text.split(" ")[1];

  // User mavjud bo‘lmasa, vaqtinchalik referal ID saqlanadi
  let user = await User.findOne({ telegramId: chatId });
  if (!user) {
    user = new User({
      telegramId: chatId,
      tempReferalId: referalId || null, // Taklif qilgan odam ID'sini vaqtinchalik saqlash
    });
    await user.save();
  }

  // Foydalanuvchiga kontakt yuborishni so‘rash
  bot.sendMessage(
    chatId,
    "🌟 Ro'yxatdan o'tish uchun telefon raqamingizni yuboring 🌟",
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

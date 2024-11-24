const texts = require("../mock/texts");
const User = require("../models/User");
const Participant = require("../models/Participants");

const { userPanel } = require("./userPanel");
const { uploadParticipantToSheet } = require("./googleSheets");

async function registerUser(bot, msg) {
  const { contact } = msg;
  const chatId = msg.chat.id;

  if (contact) {
    try {
      // Foydalanuvchi ob'ektini olish
      const user = await User.findOne({ telegramId: chatId });

      // Agar foydalanuvchi allaqachon ro'yxatdan o'tgan bo'lsa, qaytaradi
      if (!user) {
        bot.sendMessage(
          chatId,
          "❌ Avval ro'yxatdan o'tish jarayonini boshlang.",
          { parse_mode: "Markdown" }
        );
        return;
      }

      // Taklif qilgan odam ID'sini olamiz
      const referalId = user.tempReferalId;
      console.log("REFFER", referalId);

      // Foydalanuvchini yangilash
      user.phoneNumber = contact.phone_number;
      user.username = msg.from.username;
      user.firstName = msg.from.first_name;
      user.lastName = msg.from.last_name;
      await user.save();

      // Agar referal bo‘lsa, taklif qilgan odamni ishtirokchilar ro‘yxatiga qo‘shish
      if (referalId) {
        const inviter = await User.findOne({ telegramId: referalId });
        console.log(inviter);

        if (inviter) {
          console.log({
            telegramId: referalId,
            username: inviter.username || "Noma'lum",
            firstName: inviter.firstName || "Noma'lum",
            lastName: inviter.lastName || "Noma'lum",
          });

          const inviterParticipant = new Participant({
            telegramId: referalId,
            username: inviter.username || "Noma'lum",
            firstName: inviter.firstName || "Noma'lum",
            lastName: inviter.lastName || "Noma'lum",
          });
          await inviterParticipant.save();

          const uploadSuccess = await uploadParticipantToSheet({
            telegramId: referalId,
            username: inviter.username || "Noma'lum",
            firstName: inviter.firstName || "Noma'lum",
            lastName: inviter.lastName || "Noma'lum",
          });
          // Taklif qilgan odamga muvaffaqiyatli xabar
          bot.sendMessage(
            referalId,
            `✅ Siz ishtirokchilar ro‘yxatiga muvaffaqiyatli qo‘shildingiz!`
          );

          // Taklif qilgan odamga referal xabar
          bot.sendMessage(
            referalId,
            `🎉 Tabriklaymiz! Sizning referal linkingiz orqali yangi foydalanuvchi ro‘yxatdan o‘tdi!`
          );
        }
      }

      // Foydalanuvchini asosiy panelga yo'naltirish
      userPanel(bot, chatId);
    } catch (error) {
      console.error("Ro'yxatdan o'tishda xatolik:", error);
      bot.sendMessage(
        chatId,
        "*❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.*",
        { parse_mode: "Markdown" }
      );
    }
  }
}

module.exports = { registerUser };

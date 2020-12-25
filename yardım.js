const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json")
exports.run = async (client, message, args) => {

const yardım = new Discord.MessageEmbed()
.setColor("RANDOM")
.setTitle("Yardım")
 .setTimestamp()
.setDescription(`
**● ${ayarlar.prefix}çal müzik ismi yada link = İstediğiniz müziği çalar.
\n● ${ayarlar.prefix}çalan = Çalan müziği gösterir.
\n● ${ayarlar.prefix}tekrarla = Komutu her girdiğinizde tekrarlama parametresi güncellenir.
\n● ${ayarlar.prefix}ses düzey = Ses düzeyini değiştirir.
\n● ${ayarlar.prefix}dur = Müziği durdurur (Müzik KAPANIR).
\n● ${ayarlar.prefix}duraklat = Müziği duraklatır.
\n● ${ayarlar.prefix}devam = Müziği devam ettirir.
\n● ${ayarlar.prefix}geç = Müziği geçer.
\n● ${ayarlar.prefix}otooynat = Youtubedeki otomatik oynatma mantığı ile çalışır. Kapalı olarak ayarlıdır otooynat komutunu girdiğinizde açılacaktır.
\n● ${ayarlar.prefix}sıra = Şarkı sırasını gösterir.
**`)
message.channel.send(yardım)
}

exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: [],
  permLevel: 0 
};

exports.help = {
  name: 'yardım',
  description: 'Yardım Menüsü.',
  usage:'!eğlence'
}
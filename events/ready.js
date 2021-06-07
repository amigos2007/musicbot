const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
  console.log(`${client.user.username} ismi ile giriş yapıldı!`);
  client.user.setStatus("online");
  client.user.setActivity(`NE BAKIYON LAN`, { type: "PLAYING"});
  
  console.log(`${client.user.username}: Şu an ` + client.guilds.cache.size + ` adet sunucuya ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} adet kullanıcıya ve ${client.channels.cache.size} adet kanala hizmet veriliyor!`);
};

/*
idle = boşta
dnd = rahatsız etmeyin
online = çevrimiçi
LISTENING = DİNLİYOR
WATCHING = İZLİYOR
PLAYING = OYNUYOR 
*/

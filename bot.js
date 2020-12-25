const Discord = require("discord.js");
const discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { MessageAttachment} = require('discord.js')
const client = new Discord.Client({ disableMentions: 'everyone' });
const fs = require("fs");
const ayarlar = require("./ayarlar.json");
var prefix = ayarlar.prefix;
require("./util/eventLoader.js")(client);

const DisTube = require('distube'),
 distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true }); // searchSongs'u true yaparsanız !çal müzikismi yazdığınızda size bir liste çıkar ve listeden numara ile istediğiniz müziği seçme hakkı verir

client.on("ready", () => {
	let playing = client.voice.connections.size; 
    console.log(`${ayarlar.botadı}: Ses Sistemi Bağlandı`);
	
});

const log = message => {
  console.log(` ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);

    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};


client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};
client.login(ayarlar.token);
//---------------------------------------BOT GEREKLİ YER SON------------------------------------------//

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == "çal")
        distube.play(message, args.join(" "));
        
    if (command == "çalan"){
     let queue = distube.getQueue(message); 
     message.channel.send('Çalan Müzik:\n' + queue.songs.map((song) => `**${song.name} - \`${song.formattedDuration}\`\nYoutube Linki: ${song.url}**`));
    }
    if (command == "tekrarla") {
      let tekrar = distube.setRepeatMode(message, parseInt(args[0]));
      tekrar = tekrar ? tekrar == 2 ? "Tüm Sıra"  : "Bu Şarkı" : "Kapalı";
      message.channel.send("Tekrarlama modu `" + tekrar + "` olarak ayarlandı");
    }
    if (command == "ses") {
        distube.setVolume(message, args[0]);
        message.channel.send("Ses `"+ args[0] +"` düzeyine getirildi.")
    };
    if (command == "dur") {
        distube.stop(message);
        message.channel.send("Müzik Kapatıldı");
    }
     if (command == "duraklat") {
        distube.pause(message);
        message.channel.send("Müzik Duraklatıldı");
    }
    if (command == "devam") {
        distube.resume(message);
        message.channel.send("Müzik Devam Ettiriliyor");
    }
    if (command == "geç")
        distube.skip(message);

    if (command == "otooynat") {
        let mode = distube.toggleAutoplay(message);
        message.channel.send("Otomatik oynatma modu: `" + (mode ? "Açık" : "Kapalı") + "`");
    } 
    if (command == "sıra") {
        let queue = distube.getQueue(message);
        message.channel.send('Mevcut Sıra:\n' + queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n"));
    }
});

distube.on("initQueue", queue => {
    queue.autoplay = false; // Otomatik random başka şarkıya geçme
    queue.volume = 90; // Varsayılan Ses Seviyesi
});

const status = (queue) => `Ses: \`${queue.volume}%\` | Tekrar: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Tüm Sıra" : "Bu şarkı" : "Kapalı"}\` | Otomatik Oynat: \`${queue.autoplay ? "Açık" : "Kapalı"}\``;

distube
    .on("playSong", (message, queue, song) => message.channel.send(
        `Çalınıyor \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}\nYoutube Linki: ${song.url}\nMüziği İsteyen: ${song.user}`
    ))
    .on("addSong", (message, queue, song) => message.channel.send(
        `**${song.name} - \`${song.formattedDuration}\` ${song.user} Tarafından Kuyruğa Eklendi.**`
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send(
        `Oyna \`${playlist.name}\` Oynatma Listesi (${playlist.songs.length} şarkılar).\nŞuan Çalıyor: \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}\nMüziği İsteyen: ${song.user}`
    ))
    .on("addList", (message, queue, playlist) => message.channel.send(
        `Eklendi \`${playlist.name}\` Oynatma Listesi (${playlist.songs.length} şarkılar) sıraya\n${status(queue)}`
    ))
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(`**Aşağıdan bir seçenek seçin**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Bu komut işlem yapılmazsa 60 saniye içinde iptal olacaktır*`);
    })
    .on("searchCancel", (message) => message.channel.send(`Arama iptal edildi`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("Bir hata ile karşılaşıldı: " + e);
    });

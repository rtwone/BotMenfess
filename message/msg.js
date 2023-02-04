/**
  * Created by Irfan
  * Contact me on WhatsApp wa.me/6285175222272
  * Follow me on Instagram @irfann._x
  * If you want to buy an updated script that is not encrypted, please WhatsApp me
*/

"use strict";
const {
	downloadContentFromMessage
} = require("@adiwajshing/baileys")
const { color, bgcolor } = require('../lib/color')

const fs = require ("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");
const { makeid } = require("../lib/myfunc")

// database
let secreto = JSON.parse(fs.readFileSync('./database/secreto_balas.json'))
let chat_with = JSON.parse(fs.readFileSync('./database/chatwith.json'))

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(conn, msg, m, setting, store) => {
	try {
		let { ownerNumber } = setting
		const { type, isQuotedMsg, quotedMsg, mentioned, now, fromMe } = msg
		if (msg.isBaileys) return
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)
		const content = JSON.stringify(msg.message)
		const toJSON = j => JSON.stringify(j, null,'\t')
		const from = msg.key.remoteJid
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
		if (conn.multi) {
			var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		} else {
			if (conn.nopref) {
				prefix = ''
			} else {
				prefix = conn.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber == sender ? true : ["6285791458996@s.whatsapp.net" ,"62877877772777@s.whatsapp.net"].includes(sender) ? true : false
		const pushname = msg.pushName
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''
		const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)

		const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []

		async function downloadAndSaveMediaMessage(type_file, path_file) {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		const reply = (teks) => {
			conn.sendMessage(from, { text: teks }, { quoted: msg })
		}
		const sleep = async (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		const sendMess = (from, teks) => {
			return conn.sendMessage(from, { text: teks })
		}
		const tempButton = async(remoteJid, text, footer, content) => {
			// const { displayText, url, contentText, footer } = content
			//send a template message!
			const templateMessage = {
			  viewOnceMessage: {
				message: {
				  templateMessage: {
					hydratedTemplate: {
					  hydratedContentText: text,
					  hydratedContentFooter: footer,
					  hydratedButtons: content
					},
				  }
				}
			  }
			}
			const sendMsg = await conn.relayMessage(remoteJid, templateMessage, {})
		  }

		// Function for Chat With
		function checkChat(who = '', _db) {
			return [_db.a, _db.b].includes(who)
		}

		function otherSender(who = '', _db) {
			return who == _db.a ? _db.b : who == _db.b ? _db.a : ''
		}

		function isChat(who = '', _db) {
			var posi = _db.find(i => [i.a, i.b].includes(who))
			return posi
		}

		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

		// Auto Read & Presence Online
		conn.readMessages([msg.key])
		conn.sendPresenceUpdate('available', from)

		if (chats.startsWith("x ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
		 try {
	       let evaled = await eval(chats.slice(2))
		   if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
			reply(`${evaled}`)
		 } catch (err) {
		   reply(`${err}`)
		 }
		}

		// Function Menfess
		if (!msg.key.fromMe && secreto.find(i => i.sender === sender)) {
			var dbx = secreto.find(i => i.sender === sender)
			if (dbx.status === 'ENTER-MESSAGE') {
			  if (['conversation', 'extendedTextMessage'].includes(msg.type)) {
				if (chats.startsWith(prefix+'balas_secreto')) return reply(`Bales satu-satu kak, masukin pesan balasan yang sebelumnya!`)
				if (chats.startsWith(prefix)) return reply(`Jangan diawali dengan simbol jika kamu ingin membalas pesan menfess`)
				var teks_balasan = `Hai kak, kamu menerima pesan balasan nih\n\nPesan yang kamu kirim sebelumnya :\n${dbx.pesan}\n\nPesan Balasannya :\n${chats}`
				var button_balas = {
					text: teks_balasan,
					buttons: [
						{
							buttonId: `.connect_chat ${sender}_with_${dbx.pengirim}`, buttonText: { displayText: `Connect Chat`}, type: 1
						}
					],
					footer: `Pencet tombol dibawah jika ingin ngobrol secara anonim`
				}
				conn.sendMessage(dbx.pengirim, button_balas)
				reply(`Sukses mengirimkan balasan`)
			  } else {
				if (chats.startsWith(prefix+'balas_secreto')) return reply(`Bales satu-satu kak, masukin pesan balasan yang sebelumnya!`)
				if (chats.startsWith(prefix)) return reply(`Jangan diawali dengan simbol jika kamu ingin membalas pesan menfess`)
				var teks_balasan = `Hai kak, kamu menerima pesan balasan nih\n\nPesan yang kamu kirim sebelumnya :\n${dbx.pesan}\n\nPesan Balasannya :\n${chats}`
				var button_balas2 = {
					text: `Pencet tombol dibawah jika ingin ngobrol secara anonim`,
					buttons: [
						{
							buttonId: `.connect_chat ${sender}_with_${dbx.pengirim}`, buttonText: { displayText: `Connect Chat`}, type: 1
						}
					]
				}
				var pes = await conn.sendMessage(dbx.pengirim, { text: teks_balasan })
				conn.sendMessage(dbx.pengirim, { forward: msg }, { quoted: pes }).then(res => conn.sendMessage(dbx.pengirim, button_balas2))
				reply(`Sukses mengirimkan balasan`)
			  }
			  var pos = secreto.indexOf(dbx)
			  secreto.splice(pos, 1)
			  fs.writeFileSync('./database/secreto_balas.json', JSON.stringify(secreto, null, 2))
			}
		}

		// Chat With Function
		var cekForChat = false
            if (isCmd) {
                var anw = command.split(prefix)[1]
                var filter_chat = ["connecct_chat", "stopchat", "acc_chat", "dn_acc"]
                if (filter_chat.includes(anw)) cekForChat = true
        }
		if (!isGroup && !msg.key.fromMe && !cekForChat) {
			let rumcet = isChat(sender, chat_with)
			if (rumcet !== undefined && rumcet.status === 'CHAT') {
			  var chat_jid = [rumcet.a, rumcet.b].find(user => user !== sender)
			  if (msg.type == "conversation") {
				conn.sendMessage(chat_jid, { text: chats })
			  } else {
				var contextInfo = msg.message[msg.type].contextInfo
				conn.sendMessageFromContent(chat_jid, msg.message, { contextInfo })
			  }
			}
		 }

		// Logs;
		if (!isGroup && isCmd && !fromMe) {
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}

		switch (command) {
			case prefix+'start': case prefix+'menu':
				var teks_menu = `Hai ${pushname}, ${ucapanWaktu}\n\nSilahkan kirim perintah ${prefix}menfess untuk mengirim pesan rahasia`
				reply(teks_menu)
				break
			case prefix+'menfess':
				if (isGroup) return reply('Fitur menfess khusus chat pribadi!')
				if (args.length < 2) return reply(`Silahkan masukkan format seperti contoh dibawah\n\nContoh format:\n${command} Nomer|Nama|Pesan`)
				var number_to = q.split('|')[0]; var sender_name = q.split('|')[1]; var msg_send = q.split('|')[2]
				if (!number_to) return reply(`Format salah, masukkan nomer tujuan\n\nContoh Format:\n${command} Nomer|Secret|Hai Kak`)
				if (isNaN(number_to)) return reply(`Tujuan Harus Berupa Nomor!\n\nContoh Format:\n${command} `+botNumber.split("@")[0]+'|Secret|Hai Kak')
				number_to = number_to.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
				if (!sender_name) return reply(`Format salah, masukkan nama Anda atau nama rahasia\n\nContoh Format:\n${command} `+number_to.split("@")[0]+'|Nama|Hai Kak')
				if (!msg_send) return reply(`Format salah, masukkan pesan yang akan dikirim\n\nContoh Format:\n${command} ${number_to.split("@")[0]}|${sender_name}|Hai Kak`)
				var cek_number = await conn.onWhatsApp(number_to)
				if (cek_number.length === 0) return reply(`Nomer yang anda masukkan tidak terdaftar di WhatsApp!`)
				number_to = cek_number[0].jid
				if (sender === number_to) return reply(`Jangan kirim ke diri sendiri dong🥲`)
        if (botNumber === number_to) return reply(`Jangan kirim ke nomer bot kak🥲`)
				var buttonMessage = {
					text: `Hai kamu menerima pesan Rahasia nih\n\nDari : *${sender_name}*\nIsi Pesannya :\n${msg_send}`,
					buttons: [
					  { buttonId: `${prefix}balas_secreto ${msg_send}`, buttonText: { displayText: `Balas Pesan` }, type: 1 }
					],
					mentions: [sender]
				}
				conn.sendMessage(number_to, buttonMessage)
				reply(`Sukses mengirim pesan Rahasia ke nomer tersebut, silahkan tunggu jawaban dari penerima pesan, jika sudah dibalas bot akan otomatis mengirim balasannya!`)
				break
			case prefix+'balas_secreto':
				if (!isQuotedMsg) return
				if (quotedMsg.type !== 'buttonsMessage') return
				if (msg.type !== 'buttonsResponseMessage') return
				var isSecreto = secreto.find(i => i.sender === sender)
				if (isSecreto) {
					if (isSecreto.status === 'ENTER-MESSAGE') {
					   reply(`Mau dibalas apa kak? Silahkan kirim pesan balasannya`)
					}
				} else {
					var obj = {
					   sender: sender,
					   pengirim: quotedMsg.buttonsMessage.contextInfo.mentionedJid[0],
					   pesan: q,
					   status: 'ENTER-MESSAGE'
				    }
					secreto.push(obj)
					fs.writeFileSync('./database/secreto_balas.json', JSON.stringify(secreto, null, 2))
					reply(`Mau dibalas apa kak? Silahkan kirim pesan balasannya`)
				}
				break
			case prefix+'connect_chat':
				if (!isQuotedMsg) return
				if (quotedMsg.type !== 'buttonsMessage') return
				if (msg.type !== 'buttonsResponseMessage') return
				var cek_chat = isChat(sender, chat_with)
                   if (cek_chat !== undefined) {
                      if (cek_chat.status === 'WAIT') {
                        if (cek_chat.a === sender) return reply(`Kamu sedang menunggu konfirmasi dari nomer yang tadi, ketik ${prefix}stopchat untuk membatalkan chat sebelumnya`)
                        if (cek_chat.b === sender) return reply(`Sebelumnya ada yang mengajak kamu untuk chatan, silahkan cek pesan diatas lalu pencet tombol Terima atau Tolak\nJika sudah tidak ada pesannya, silahkan ketik ${prefix}batalchat`)
                      }
                      if (cek_chat.status === 'CHAT') return reply(`Kamu sedang berada dalam sesi chat, ketik ${prefix}stopchat untuk memberhentikan sesi chat sebelumnya`)
                   }
				   var id_chat = makeid(15)
                   var obj = {
					 id: id_chat,
                     a: sender,
                     b: q.split('_with_')[0],
                     status: 'WAIT'
                   }
                   chat_with.push(obj)
                   fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
                   var btnMsg = {
                     text: `Pengirim pesan rahasia ingin ngobrol sama kamu nih, mau terima atau tolak?`,
                     buttons: [
                       { buttonId: '.acc_chat '+id_chat, buttonText: { displayText: 'Terima' }, type: 1 },
                       { buttonId: '.dn_acc '+id_chat, buttonText: { displayText: 'Tolak' }, type: 1 }
                     ]
                   }
                   conn.sendMessage(q.split('_with_')[0], btnMsg)
                   reply(`Sukses mengirim permintaan chat dengan nomer tersebut, tunggu konfirmasi dari dia...`)
				break
				case prefix+'acc_chat':
					if (!isQuotedMsg) return
					if (quotedMsg.type !== 'buttonsMessage') return
					if (msg.type !== 'buttonsResponseMessage') return
					if (isChat(sender, chat_with) === undefined) return reply(`Kamu sedang tidak berada didalam sesi chat manapun!`)
					var data1 = isChat(sender, chat_with)
					if (data1.id !== args[1]) return reply(`Tombol yang kamu pencet sudah tidak berlaku lagi`)
					var posi1 = chat_with.indexOf(data1)
					chat_with[posi1].status = 'CHAT'
					fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
					reply(`Sukses menerima permintaan chat, silahkan kirim pesan\n\nketik ${prefix}stopchat untuk memberhentikan sesi obrolan!`)
					sendMess(data1.a, `Penerima telah menyetujui permintaan kamu, silahkan kirim pesan\n\nketik ${prefix}stopchat untuk memberhentikan sesi obrolan!`)
					break
				 case prefix+'dn_acc':
					if (!isQuotedMsg) return
					if (quotedMsg.type !== 'buttonsMessage') return
					if (msg.type !== 'buttonsResponseMessage') return
					if (isChat(sender, chat_with) === undefined) return reply(`Kamu sedang tidak berada didalam sesi chat manapun!`)
					var data2 = isChat(sender, chat_with)
					if (data2.id !== args[1]) return reply(`Tombol yang kamu pencet sudah tidak berlaku lagi`)
					if (data2.status === 'CHAT') return reply(`Tombol yang kamu pencet sudah tidak berlaku lagi, silahkan ketik ${prefix}stopchat untuk menghentikan sesi chat ini`)
					var posi2 = chat_with.indexOf(data2)
					chat_with.splice(posi2, 1)
					fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
					reply(`Sukses menolak permintaan Chat tersebut`)
					sendMess(data2.a, `Yahh permintaan chat kamu ditolak, NT cuy:(`)
					break
					case prefix+'stopchat':
						if (isGroup) return reply(mess.OnlyPM)
						if (isChat(sender, chat_with) === undefined) return reply(`Kamu sedang tidak berada didalam sesi chat manapun!`)
						var cek_data = isChat(sender, chat_with)
						if (cek_data.status === 'WAIT') {
						  var posi_x = chat_with.indexOf(cek_data)
						  if (cek_data.a === sender) {
							 sendMess(cek_data.b, `Seseorang telah membatalkan permintaan chatnya denganmu`)
							 chat_with.splice(posi_x, 1)
							 fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
							 reply(`Sukses membatalkan chat`)
							 return
						  } else if (cek_data.b === sender) {
							 sendMess(cek_data.a, `Seseorang telah menolak permintaan chat kamu`)
							 chat_with.splice(posi_x, 1)
							 fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
							 reply(`Sukses menolak chat tersebut`)
							 return
						  }
						} else if (cek_data.status === 'CHAT') {
						  var posi_y = chat_with.indexOf(cek_data)
						  if (cek_data.a === sender) {
							sendMess(cek_data.b, `Yahh, lawan chat kamu sudah memberhentikan sesi chat ini🥲`)
							chat_with.splice(posi_y, 1)
							fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
							reply(`Sukses memberhentikan sesi chat ini`)
							return
						  } else if (cek_data.b === sender) {
							sendMess(cek_data.a, `Yahh, lawan chat kamu sudah memberhentikan sesi chat ini🥲`)
							chat_with.splice(posi_y, 1)
							fs.writeFileSync('./database/chatwith.json', JSON.stringify(chat_with, null, 2))
							reply(`Sukses memberhentikan sesi chat ini`)
							return
						  }
						}
						break
	    }
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
}

const { Client, LocalAuth} = require('whatsapp-web.js');
const open = require('open');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');

const client = new Client({
	authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
	// Generate and scan this code with your phone
	console.log('QR RECEIVED', qr);
	open('https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(qr), { wait: false });

	// Falls back to terminal if it's not possible to open the browser
	qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
	console.log('Client is ready!');

	const chatId = '4915905017385-1574505912@g.us'

	schedule.scheduleJob('0 7 * * *', async () => {
		const randomFact = await getTodaysRandomFact();
		await client.sendMessage(chatId, 'Guten Morgen 🌞\n\n' + randomFact);
	});
});

async function getTodaysRandomFact() {
	const response = await fetch('https://uselessfacts.jsph.pl/today.json?language=de');
	const data = await response.json();
	return data.text;
}

client.on('message_create', async (msg) => {
	if (msg.body === '!ping') {
		await msg.reply('pong');
	}

	if (msg.body.toLowerCase() === "wer" || msg.body.toLowerCase() === "wer?") {
		await msg.reply('wer hat gefragt');
	}
});

client.on('message_create', (msg) => {
	// console.log('MESSAGE CREATED', msg);
});

client.initialize();
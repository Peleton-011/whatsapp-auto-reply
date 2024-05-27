//const obama = new whatsapp.GroupChat("GxrW1DZhTxbFp2LMQEYFtB");

const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
	webVersionCache: {
		type: "remote",
		remotePath:
			"https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
	},
});

client.on("ready", () => {
	console.log("Client is ready!");
});

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("message_create", (message) => {
	if (message.body === "ping") {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, "pong");
	} else if (message.body === "boob") {
		client.sendMessage(message.from, "🤤");
	}
});

client.initialize();

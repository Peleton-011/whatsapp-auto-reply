//const obama = new whatsapp.GroupChat("GxrW1DZhTxbFp2LMQEYFtB");

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

function writeFile(fileName, data) {
	fs.writeFile(fileName, data, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
}

const client = new Client({
	authStrategy: new LocalAuth(),
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
	writeFile("message.txt", JSON.stringify(message));
	if (message.body.includes("ping")) {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, "pong");
	} else if (message.body.includes("boob")) {
		client.sendMessage(message.from, "🤤");
	}
});

client.initialize();
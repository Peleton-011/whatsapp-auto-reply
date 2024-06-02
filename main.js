const { Client, RemoteAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");

const Bot = require("./bot.js");
const pattern = require("./patterns/test.json");

const bot = new Bot(pattern);

const env = require("dotenv").config().parsed;

function writeFile(fileName, data) {
	fs.writeFile(fileName, data, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
}

mongoose.connect(env.MONGODB_URI).then(() => {
	const store = new MongoStore({ mongoose: mongoose });
	const client = new Client({
		authStrategy: new RemoteAuth({
			store: store,
			backupSyncIntervalMs: 300000,
		}),
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

	client.on("remote_session_saved", () => {
		console.log("Session saved");
	});

	client.on("message_create", (message) => {

        const response = bot.handleNewMessage(message.body)

        if (response) {
            client.sendMessage(message.from, response);
        }
		// console.log(message.body);
		// writeFile("message.txt", JSON.stringify(message));
		// if (message.body.includes("ping")) {
		// 	// send back "pong" to the chat the message was sent in
		// 	client.sendMessage(message.from, "pong");
		// } else if (message.body.includes("boob")) {
		// 	client.sendMessage(message.from, "🤤");
		// }
	});

	client.initialize();
});
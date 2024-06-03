const { Client, RemoteAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const http = require("http");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");

const Bot = require("./bot.js");
const pattern = require("./patterns/test.json");

const bot = new Bot(pattern);

// const env = require("dotenv").config().parsed;

mongoose.connect(process.env.MONGODB_URI 
    //env.MONGODB_URI
).then(() => {
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
        console.log(message.body);

        if (message.fromMe) {
            if (message.body === "Stop talking to urself, nerd!") {
                return;
            }
            client.sendMessage(message.from, "Stop talking to urself, nerd!");
            return;
        }

        const response = bot.handleNewMessage(message.body);

        if (response) {
            client.sendMessage(message.from, response);
        }
    });

    client.initialize();
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is running\n');
});

// Listen on port 8000
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

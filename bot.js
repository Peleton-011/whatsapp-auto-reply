emojis = require("./emojis.json");

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Bot {
	constructor(pattern) {
		this.emojis = emojis;
		this.patterns = pattern.patterns;
	}

	handleNewMessage(message) {
		const pattern = this.checkAllPatterns(message);
		if (pattern === null) {
			return;
		}
		return this.generateResponse(pattern.response, pattern.tags);
	}

	checkAllPatterns(message) {
		let finalPattern = null;

		this.patterns.every((pattern) => {
			const check = this.checkPattern(pattern, message);
			if (check) {
				finalPattern = pattern;
				return false;
			}
			return true;
		});

		return finalPattern;
	}

	checkPattern(pattern, message) {
		const options = {
			isCaseInsensitive: pattern.on.tags.includes("i"),
		};

		return pattern.on.message.every((c) =>
			this.checkMessageCondition(c, message, options)
		);
	}

	checkMessageCondition(argcondition, argmessage, options) {
		const message = options.isCaseInsensitive
			? argmessage.toLowerCase()
			: argmessage;
		const condition = options.isCaseInsensitive
			? argcondition.toLowerCase()
			: argcondition;
		if (typeof condition === "string") {
			return message.includes(condition);
		}

		return condition.some((c) => message.toLowerCase().includes(c));
	}

	generateResponse(response, tags) {
        const options = {
            firstCapitalized: tags.includes("fc"),
            fullCapitalized: tags.includes("FC"),
        }
		let finalResponse = response.map((item) => this.handleResponseItem(item)).join(" ").trim();

        if (options.firstCapitalized) {
            finalResponse = finalResponse.charAt(0).toUpperCase() + finalResponse.slice(1);
        }
        if (options.fullCapitalized) {
            finalResponse = finalResponse.toUpperCase();
        }

        return finalResponse;
	}

	handleResponseItem(item) {
		if (typeof item === "string") {
			return item;
		}
		if (item.type) {
			return this.handleResponseObject(item);
		}

		return this.handleResponseItem(item[getRandomInt(0, item.length - 1)]);
	}

	handleResponseObject(obj) {
		let text;
		switch (obj.type) {
			case "text":
				text = obj.content;
				break;
			case "emoji":
				text = this.handleEmojiPath(obj.content);
				break;
		}

		const length = getRandomInt(obj.times[0], obj.times[1]);

		return new Array(length).fill(text).join("");
	}

	handleEmojiPath(argpath) {
		const path = argpath[getRandomInt(0, argpath.length - 1)];
		const pathParts = ["emojis", ...path.split("/")];
		const emojis = pathParts.reduce((emojis, pathPart) => {
			return emojis[pathPart] || this.emojis[pathPart];
		});

		return emojis[getRandomInt(0, emojis.length - 1)];
	}
}

module.exports = Bot;

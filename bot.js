emojis = require("./emojis.json");

class Bot {
	constructor(pattern) {
		this.emojis = emojis;
		this.patterns = pattern.patterns;
	}

	checkPattern(pattern, message) {
		const options = {
			isCaseInsensitive: ~pattern.on.tags.indexOf("i"),
		};

        return pattern.on.message.every((c) => this.checkMessageCondition(c, message, options))
	}

	checkMessageCondition(condition, message, options) {
		if (typeof condition === "string") {
			return message.includes(
				options.isCaseInsensitive ? condition.toLowerCase() : condition
			);
		}

		return condition.some((c) => message.includes(c));
	}
}

module.exports = Bot;

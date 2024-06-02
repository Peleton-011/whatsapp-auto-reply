emojis = require("./emojis.json");

class Bot {
	constructor(pattern) {
		this.emojis = emojis;
		this.patterns = pattern.patterns;
	}

    handleNewMessage(message) {
        const pattern = this.checkAllPatterns(message.body);
        if (pattern === null) {
            return;
        }
        return generateResponse(pattern.response);
    }

    checkAllPatterns(message) {
        let finalPattern = null;

        this.patterns.every((pattern) => {
            const check = this.checkPattern(pattern, message)
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

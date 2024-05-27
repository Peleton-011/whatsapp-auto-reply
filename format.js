const fs = require("fs");


function writeFile(fileName, data) {
	fs.writeFile(fileName, data, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});
}

function readFile(fileName) {
    return fs.readFileSync(fileName, "utf8");
}

function formatFile(fileName) {
    const data = readFile(fileName);
    const formattedData = JSON.stringify(JSON.parse(data), null, 2);
    writeFile(fileName, formattedData);
}

formatFile("message.txt");
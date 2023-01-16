const fs = require("fs");

async function getAdBlockRules(url) {
	try {
		const response = await fetch(url);
		const text = await response.text();
		const lines = text.split("\n");
		let table = lines.slice(16);
		let i = 0;
		while (i < table.length && !table[i].startsWith("|")) i++;
		table = table.slice(i);
		const adBlockRules = [];
		adBlockRules.push("! Whitelist for FastForward Bypassed List");
		adBlockRules.push("! Up to date as of " + new Date().toUTCString());
		adBlockRules.push(
			"! Generated by https://github.com/Edgeburn/fastforward-bypass-allowlist-generator"
		);
		adBlockRules.push(
			"! Learn more about FastForward at https://fastforward.team"
		);
		adBlockRules.push("");
		table.forEach((line) => {
			if (!line.startsWith("|")) return;
			let domain = line.split("|")[1].trim();
			domain = domain
				.replace(/\/+$/, "")
				.replace(/^\*\./, "")
				.replace(/^https?:\/\//, "");
			adBlockRules.push("@@||" + domain + "^$important");
		});
		return adBlockRules;
	} catch (error) {
		console.log(error);
	}
}

getAdBlockRules(
	"https://raw.githubusercontent.com/FastForwardTeam/FastForward/manifest-v3/Bypassed.md"
).then((rules) => {
	fs.writeFileSync("adblock-rules.txt", rules.join("\n"));
});

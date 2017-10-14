const BotSettings = require ('../botSettings.json');
const Console = require('console');
const DiscordJS = require('discord.js-commando');

const CLIENT = new DiscordJS.Client({
	owner: BotSettings.owner,
	commandPrefix: '' //Disable prefix and use only mentions.
});

CLIENT.on('ready', () => {
	Console.info('Ready.');
});

CLIENT.login(BotSettings.token);

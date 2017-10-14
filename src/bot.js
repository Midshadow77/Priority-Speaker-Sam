const BotSettings = require ('../botSettings.json');
const Console = require('console');
const DiscordJS = require('discord.js-commando');
const SQLite = require('sqlite');

const CLIENT = new DiscordJS.Client({
	owner: BotSettings.owner,
	commandPrefix: '' //Disable prefix and use only mentions.
});

CLIENT.on('ready', () => { Console.info('Ready.'); });

CLIENT.setProvider(SQLite.open('./commands.sqlite3').then(
	(db) => new DiscordJS.SQLiteProvider(db),
	(err) => Console.error(err))
);

CLIENT.login(BotSettings.token);

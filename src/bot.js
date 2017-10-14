const BotSettings = require ('../botSettings.json');
const Console = require('console');
const DiscordJS = require('discord.js-commando');
const Path = require('path');
const SQLite = require('sqlite');

const CLIENT = new DiscordJS.Client({
	owner: BotSettings.owner,
	commandPrefix: '' //Disable prefix and use only mentions.
});

CLIENT.prioritySpeakers = new Map();

CLIENT.on('ready', () => {
	CLIENT.user.setStatus('dnd')
		.then(
			() => {
				const GUILD = CLIENT.guilds.get(BotSettings.guild);

				if(typeof GUILD !== 'undefined' && GUILD.available) {
					Console.info('Ready.');
				} else {
					throw new Error('Guild don\'t available.');
				}
			},
			(err) => Console.error(err)
		).catch(Console.error);
});

CLIENT.setProvider(SQLite.open(Path.join(__dirname, './commands.sqlite3')).then(
	(db) => new DiscordJS.SQLiteProvider(db),
	(err) => Console.error(err))
).catch(Console.error);

CLIENT
	.registry
	.registerDefaults() //Registers all built-in groups, commands, and argument types
	.registerGroup('priority_speaker', 'Priority speaker commands.')
	.registerCommandsIn(Path.join(__dirname, 'commands')); //Registers all of your commands in the ./commands/ directory

CLIENT.login(BotSettings.token);

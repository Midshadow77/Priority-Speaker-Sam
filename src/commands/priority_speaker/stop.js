const DiscordJS = require('discord.js-commando');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../../BotSettings.json');

module.exports = class StopCommand extends DiscordJS.Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'priority_speaker',
			memberName: 'stop',
			description: 'Stops the priority speaker bot.',
			details: oneLine`
				This command stops the priority speaker bot.
				By doing this, users we'll no longer be muted even if someone in the priority speakers list speaks.
			`,
			examples: ['stop'],
			guarded: true
		});
	}

	hasPermission(msg) {
		const havePermission = msg.member.roles.has(BotSettings.administrationRole) || msg.member.id === BotSettings.owner;

		if(!havePermission) {
			Console.log('<' + msg.member.displayName + '> tried to execute the "' + this.name + '" command, but he didn\'t have the permission to do this.');
		}

		return havePermission;
	}

	async run(msg, ) {
		msg.client.user.setStatus('dnd').then(
			() => msg.reply('Priority speaker disabled.').catch(Console.error)
		).catch(Console.error);

		msg.client.guilds.get(BotSettings.guild).members.map((member) => {
			return member.setMute(false).catch(Console.error);
		});

		Console.log('<' + msg.member.displayName + '> disabled the priority speaker bot.');
	}
};

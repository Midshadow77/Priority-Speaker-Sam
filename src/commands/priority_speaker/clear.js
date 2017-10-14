const Commando = require('discord.js-commando');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../BotSettings.json');

module.exports = class ClearCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			group: 'priority_speaker',
			memberName: 'clear',
			description: 'Empty the priority speakers list.',
			details: oneLine`This command is used to clear the priority speakers list.`,
			examples: ['clear'],
			guarded: true
		});
	}

	hasPermission(msg) {
		const havePermission = msg.member.roles.has(BotSettings.userRoleNeeded) || msg.member.id === BotSettings.owner;

		if(!havePermission) {
			Console.log('<' + msg.member.displayName + '> tried to execute the "' + this.name + '" command, but he didn\'t have the permission to do this.');
		}

		return havePermission;
	}

	async run(msg, ) {
		msg.client.prioritySpeakers.clear();

		msg.client.guilds.get(BotSettings.botGuild).members.map((member) => {
			return member.setMute(false).catch(Console.error);
		});

		Console.log('<' + msg.member.displayName + '> cleared the priority speakers list.');
		msg.channel.send(msg.author.toString() + ' cleared the priority speakers list.').catch(Console.error);
	}
};

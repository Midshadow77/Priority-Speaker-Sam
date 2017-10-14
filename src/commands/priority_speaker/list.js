const Commando = require('discord.js-commando');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../../BotSettings.json');

module.exports = class ListCommand extends Commando.Command {
	constructor(client) {
		super(client, {
			name: 'list',
			group: 'priority_speaker',
			memberName: 'list',
			description: 'Display the priority speakers list.',
			details: oneLine`This command is used to display the priority speakers list.`,
			examples: ['list'],
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
		if(msg.client.prioritySpeakers.size > 0) {
			const prioritySpeakersChat = Array.from(msg.client.prioritySpeakers.values()).map(function(user) {
				return user.toString();
			});

			const prioritySpeakersLog = Array.from(msg.client.prioritySpeakers.values()).map(function(user) {
				return user.displayName;
			});

			msg.reply('Users in the priority speakers list: ' + prioritySpeakersChat).catch(Console.error);
			Console.log('<' + msg.member.displayName + '> displayed the priority speakers list: ' + prioritySpeakersLog);
		} else {
			msg.reply('The priority speakers list is empty.').catch(Console.error);
			Console.log('<' + msg.member.displayName + '> displayed the priority speakers list but it\'s empty.');
		}
	}
};

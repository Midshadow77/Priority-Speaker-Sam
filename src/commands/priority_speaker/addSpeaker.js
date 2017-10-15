const DiscordJS = require('discord.js-DiscordJS');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../../BotSettings.json');

module.exports = class AddSpeakerCommand extends DiscordJS.Command {
	constructor(client) {
		super(client, {
			name: 'addspeaker',
			aliases: ['add'],
			group: 'priority_speaker',
			memberName: 'addspeaker',
			description: 'Adds one or multiple users to the priority speakers list.',
			details: oneLine`
				This command is used to add one or multiple users to the priority speakers list.
				By doing this, these users we'll no longer be muted when they'll speak.
			`,
			examples: ['addspeaker <mention0[, mention1, mention2, ...]>', 'add <mention0[, mention1, mention2, ...]>'],
			args: [
				{
					key: 'mentions',
					label: 'Users mention',
					prompt: 'Which users do you want to add to the priority speakers list ?',
					type: 'string',
					infinite: true
				}
			]
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
		let mentionedUsers = '';

		for(const user of msg.mentions.members.values()) {
			if(msg.client.user.id !== user.id) {
				if(!msg.client.prioritySpeakers.has(user.id)) {
					Console.log('<' + user.displayName + '> have been added to the priority speakers list.');
					msg.client.prioritySpeakers.set(user.id, user);

					if(msg.author.id === user.id) {
						msg.reply('you\'ve been added to the priority speakers list.').catch(Console.error);
					} else {
						mentionedUsers += user.toString() + ', ';
					}
				} else {
					Console.log('<' + user.displayName + '> have not been added to the priority speakers list because he\'s already in it.');

					if(msg.author.id === user.id) {
						msg.reply('you\'ve not been added to the priority speakers list because you\'re already in it.').catch(Console.error);
					} else {
						msg.reply(user.toString() + ' have not been added to the priority speakers list because he\'s already in it.').catch(Console.error);
					}
				}
			} else if(msg.content.substring(msg.content.indexOf(' add')).includes(user.toString())) {
				Console.log('<' + msg.client.user.displayName + '> can\'t be added to the priority speakers list because it\'s a bot.');
				msg.reply(msg.client.user.toString() + ' can\'t be added to the priority speakers list because it\'s a bot.').catch(Console.error);
			}
		}

		if(mentionedUsers.length > 2) {
			mentionedUsers = mentionedUsers.substring(0, mentionedUsers.length - 2);

			if(!mentionedUsers.includes(',')) {
				msg.channel.send(mentionedUsers + ' is now in the priority speakers list.').catch(Console.error);
			} else {
				msg.channel.send(mentionedUsers + ' are now in the priority speakers list.').catch(Console.error);
			}
		}
	}
};

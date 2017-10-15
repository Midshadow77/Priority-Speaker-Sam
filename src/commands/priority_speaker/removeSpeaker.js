const DiscordJS = require('discord.js-commando');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../../BotSettings.json');

module.exports = class RemoveSpeakerCommand extends DiscordJS.Command {
	constructor(client) {
		super(client, {
			name: 'removespeaker',
			aliases: ['remove'],
			group: 'priority_speaker',
			memberName: 'removespeaker',
			description: 'Removes one or multiple users from the priority speakers list.',
			details: oneLine`
				This command is used to remove one or multiple users from the priority speakers list.
				By doing this, these users we'll no longer mute others one when they'll speak.
			`,
			examples: ['removespeaker <mention0[, mention1, mention2, ...]>', 'remove <mention0[, mention1, mention2, ...]>', 'del <mention0[, mention1, mention2, ...]>'],
			guarded: true,
			args: [
				{
					key: 'mentions',
					label: 'Users mention',
					prompt: 'Which users do you want to remove from the priority speaker slist ?',
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
				if(msg.client.prioritySpeakers.has(user.id)) {
					Console.log('<' + user.displayName + '> have been removed from the priority speakers list.');
					msg.client.prioritySpeakers.delete(user.id);

					if(msg.author.id === user.id) {
						msg.reply('you\'ve been removed from the priority speakers list.').catch(Console.error);
					} else {
						mentionedUsers += user.toString() + ', ';
					}
				} else {
					Console.log('<' + user.displayName + '> have not been removed from the priority speakers list because he isn\'t in it.');

					if(msg.author.id === user.id) {
						msg.reply('you\'ve not been remove from the priority speakers list because you weren\'t in it.').catch(Console.error);
					} else {
						msg.reply(user.toString() + ' have not been remove from the priority speakers list because he isn\'t in it.').catch(Console.error);
					}
				}
			} else if(msg.content.substring(msg.content.indexOf(' remove')).includes(user.toString())) {
				Console.log('<' + msg.client.user.displayName + '> can\'t be removed from the priority speakers list because it\'s a bot.');
				msg.reply(msg.client.user.toString() + ' can\'t be remove from the priority speakers list because it\'s a bot.').catch(Console.error);
			}
		}

		if(mentionedUsers.length > 2) {
			mentionedUsers = mentionedUsers.substring(0, mentionedUsers.length - 2);

			if(!mentionedUsers.includes(',')) {
				msg.channel.send(mentionedUsers + ' is no longer in the priority speakers list.').catch(Console.error);
			} else {
				msg.channel.send(mentionedUsers + ' are no longer in the priority speakers list.').catch(Console.error);
			}
		}
	}
};

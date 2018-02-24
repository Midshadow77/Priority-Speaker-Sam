const DiscordJS = require('discord.js-commando');
const Console = require('console');
const oneLine = require('common-tags').oneLine;
const BotSettings = require('../../../BotSettings.json');

module.exports = class StartCommand extends DiscordJS.Command {
	constructor(client) {
		super(client, {
			name: 'start',
			group: 'priority_speaker',
			memberName: 'start',
			description: 'Starts the priority speaker bot.',
			details: oneLine`
				This command starts the priority speaker bot.
				By doing this, users who're not in the priority speakers list we'll be muted,
				during the ones who're in we'll not.
			`,
			examples: ['start'],
			guarded: true
		});
	}

	hasPermission(msg) {
		const havePermission = msg.member.roles.has(BotSettings.administrationRole) || msg.member.id === BotSettings.owner;

		if (!havePermission) {
			Console.log('<' + msg.member.displayName + '> tried to execute the "' + this.name + '" command, but he didn\'t have the permission to do this.');
		}

		return havePermission;
	}

	speakingCallback(user, speaking) {
		const CLIENT = user.client;

		if (CLIENT.user.presence.status === 'online' && CLIENT.prioritySpeakers.has(user.id)) {
			const guildMember = CLIENT.guilds.get(BotSettings.guild).member(user);

			if (speaking) {
				Console.log('<' + guildMember.displayName + '> is talking. Mute those who arn\'t in the priority speakers list and in the same channel.');

				guildMember.voiceChannel.members.map((member) => {
					return member.setMute(!CLIENT.prioritySpeakers.has(member.id)).catch(Console.error);
				});

			} else {
				Console.log('<' + guildMember.displayName + '> stopped talking. Unmute those who are muted if nobody in the priority speakers list speaks.');

				guildMember.voiceChannel.members.map((member) => {
					return member.setMute(false).catch(Console.error);
				});
			}
		}
	}

	async run(msg, ) {
		const VOICE_CHANNEL = msg.member.voiceChannel;

		if (VOICE_CHANNEL) {
			if (Array.from(BotSettings.notPrioritizedChannel).indexOf(VOICE_CHANNEL.id) === -1) {
				msg.member.voiceChannel
					.join()
					.then((connection) => msg.client.user.setStatus('online')
						.then(() => msg.reply('Priority speaker enabled.')
							.then(() => {
								connection.on('speaking', this.speakingCallback);
								Console.log('<' + msg.member.displayName + '> enabled the priority speaker bot.');
							}).catch(Console.error)
						).catch(Console.error)
					).catch(Console.error);
			} else {
				msg.reply('Priority speaker can\'t be enabled because you\'re voice channel is in the non prioritize channels list.')
					.then(
					() => Console.log('<' + msg.member.displayName + '> tried to enable the priority speaker bot but the voice channel is in the non prioritize channels list.')
					).catch(Console.error);
			}
		} else {
			msg.reply('Priority speaker can\'t be enabled because you\'re not in a voice channel.')
				.then(
				() => Console.log('<' + msg.member.displayName + '> tried to enable the priority speaker bot but he wasn\'t in a voice channel.')
				).catch(Console.error);
		}
	}
};

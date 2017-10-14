# Priority speaker bot for Discord

A Discord bot which imitates a priority speaker function. Made with Discord.js API.

## Dependencies

> -   [Erlpack](https://github.com/hammerandchisel/erlpack) (npm install discordapp/erlpack --save): for significantly faster WebSocket data (de)serialisation
> -   [Node-opus](https://www.npmjs.com/package/node-opus) (npm install node-opus --save): for voice support
> -   [Sodium](https://www.npmjs.com/package/sodium) (npm install sodium --save): for faster voice packet encryption and decryption
> -   [UWS](https://www.npmjs.com/package/uws) (npm install uws --save): for a much faster WebSocket connection
> -   [SQLite](https://www.npmjs.com/package/sqlite) (npm install sqlite --save): dependency for Discord.js-Commando
> -   [Discord.js-Commando](https://www.npmjs.com/package/discord.js-commando) (npm install discord.js-commando --save): an extension to the Discord.js API which handles commands.
> -   [Discord.js](https://www.npmjs.com/package/discord.js) (npm install discord.js --save): the Discord API wrote in javascript

## Bot settings

> -   __token__: The token used to identify the bot.
> -   __owner__: A user ID. This user will be able to use any command of the bot.
> -   __administrationRole__: A role ID. This role allows users in it to use all bot commands (like the owner).
> -   __notPrioritizedChannel__: A channels ID list. In these channels, the bot will not have any effect.

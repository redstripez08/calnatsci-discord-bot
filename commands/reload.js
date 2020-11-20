const Discord = require("discord.js");
const roles = require("../json/roles.json");

module.exports = {
    name: "reload",
    aliases: ["r"],
    description: "Reloads a command",
    usage: "<Commmand Name>",
    cooldown: 0,
    guildOnly: false,
    args: true,
    roles: [roles.owner],
    /**
     * Reloads a command.
     * @param   {Discord.Message}     message 
     * @param   {Array<String>}       args 
     */
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) ||
        message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`\`${commandName}\` not Found!`);

        
        try {
            delete require.cache[require.resolve(`./${command.name}.js`)];
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
	        message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        message.channel.send(`Command \`${command.name}\` was reloaded!`);
    }
};
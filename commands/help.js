const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["command", "cmd", "commands", "cmds"],
    description: "Helps stuff n whatever",
    usage: "<Command Name>",
    cooldown: 0,
    guildOnly: false,
    args: false,
    /**
     * Sends help message
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    async execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const { prefix } = process.env;
        const { commands } = message.client;
        const commandArray = commands.map(command => command.name);

        const helpEmbed = new MessageEmbed()
            .setColor("#6600ff")
            .setAuthor("CalNatSci", 'https://i.imgur.com/kBKuF03.png')
            .setThumbnail("https://i.imgur.com/xJf6bqz.png")
            .setTitle("Here's a list of all my commands:")
            .setDescription(`\`${commandArray.join('\`, \`')}\`.`)
            .addField("Tip:", `\nYou can send \`${prefix}help <Command Name>\` to get info on a specific command!`);            
        
        if (!args.length) {
            //* Separate General commands from Role-restricted commands
            try {
                message.author.send(helpEmbed)
                if (message.channel.type === 'dm') return;
                return message.reply('I\'ve sent you a DM with all my commands!');    
            } catch (error) {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply(`it seems like I can't DM you! Do you have DMs disabled\nIf you do, type \`${prefix}help now.\``);
            }
        }

        if (args[0].toLowerCase() === "now") return message.channel.send(helpEmbed);

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.reply('that\'s not a valid command!');

            //* Ternary operators for Formatting
        const checkAlias = aliases => (!aliases || !aliases.length) ? "No Aliases" : aliases.join("\`, \`"); 
        const checkCooldown = cooldown => (!cooldown || cooldown === 0) ? "None" : `${cooldown} seconds`; 
        const checkUsage = usage => !usage ? "" : ` ${usage}`;
        const checkFlags = flags => (!flags || !flags.length) ? "No Flags" : flags.join("\`, \`") 

        const cmdInfo = new MessageEmbed()
            .setColor("#3400a6")
            .setThumbnail("https://i.imgur.com/xJf6bqz.png")
            .setTitle(`Command: \`${command.name}\``)
            .setDescription(command.description)
            .addFields(
                {name: "Aliases:", value: `\`${checkAlias(command.aliases)}\``},
                {name: "Usage:", value: `\`${prefix}${command.name}${checkUsage(command.usage)}\``},
                {name: "Flags:", value: `\`${checkFlags(command.flags)} \``},
                {name: "Cooldown:", value: `\`${checkCooldown(command.cooldown)}\``}
            );

        message.channel.send(cmdInfo)

        //if (message.channel.type === "dm") return;
        // message.delete({timeout:1000})
        // .then(message => message.delete({timeout: 10000}));
    }
};
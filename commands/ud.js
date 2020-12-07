const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "ud",
    aliases: ["urban", "udict", "urbandict"],
    description: "Gets the definition of the supplied argument in Urban Dictionary",
    usage: "<Search Term>",
    cooldown: 5,
    guildOnly: false,
    args: true,
    roles: [],
    /**
     * Retrieves the definition of supplied search term in Urban Dictionary
     * @param {Discord.Message} message 
     * @param {Array<String>} args 
     */
    async execute(message, args) {

        const originLink = "https://api.urbandictionary.com";
        const link = new URL("/v0/define", originLink);
        link.search = new URLSearchParams({term: args.join(" ")}).toString();
        const linkOptions = {
            method: 'GET',
            headers: {"Accept": "application/json"}
        };

        try {
            const res = await fetch(link, linkOptions);
            if (!res.ok) throw `${res.status}, ${res.statusText}, ${res.error}`;

            const { list } = await res.json();
            if (!list.length) return message.channel.send(`No Results Found for **${args.join(" ")}**`);
            
            const checkChar = (str, max = 2048) => (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
            const embed = new Discord.MessageEmbed()
                .setColor(Math.floor(Math.random() * 10000000))
                .setTitle(list[0].word)
                .setDescription(checkChar(list[0].definition))
                .setURL(list[0].permalink)
                .addField("Example", checkChar(list[0].example, 1024))
                .setFooter(`Author: ${checkChar(list[0].author, 100)}`);

            message.channel.send(embed);
        } catch (error) {
            message.channel.send(`Something went wrong!\n\`${error}\``);
            console.error(error);
        }
    }
};
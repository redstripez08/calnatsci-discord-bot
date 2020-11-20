const Discord = require("discord.js");

module.exports = {
    name: "fact",
    aliases: ["facts"],
    description: "Gets a random fact from the internet",
    usage: null,
    cooldown: 0,
    guildOnly: false,
    args: false,
    /**
     * Gets a random fact from the internet
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    async execute(message, args) {
        try {
            const fetch = require("node-fetch"); 

            const originLink = "https://uselessfacts.jsph.pl";
            const link = new URL("/random.json", originLink);
            link.search = new URLSearchParams({language: "en"}).toString();
            const linkOptions = {
                method: "GET",
                headers: {"Accept": "application/json"}
            };
            
            const res = await fetch(link, linkOptions);
            if (!res.ok) throw res.status;

            const { text } = await res.json();
            message.channel.send(text);
    
        } catch (error) {
            console.error(error);
        }
    }
};
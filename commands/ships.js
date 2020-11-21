const Discord = require("discord.js");

module.exports = {
    name: "ships",
    aliases: ["ship"],
    description: "Gets ships from my ships API",
    usage: null,
    cooldown: 10,
    guildOnly: false,
    args: false,
    roles: [],
    /**
     * Gets a List of ships from my API
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    async execute(message, args) {
        const fetch = require("node-fetch");
        const Cryptr = require("cryptr");
        const cryptr = new Cryptr(process.env.cryptrKey);

        const { content } = require("../secret.json");
        const { shipKey } = JSON.parse(cryptr.decrypt(content));

        const originLink = "http://localhost:3000";
        const link = new URL("/ships", originLink);
        link.search = new URLSearchParams({secret: shipKey}).toString();
        const linkOptions = {
            method: 'GET',
            headers: {"Accept": "application/json"}
        };

        try {
            const res = await fetch(link, linkOptions);
            if (!res.ok) throw [res.status, res.statusText];

            const data = await res.json();
            //console.log(data);
            const lol = [];
            for (const ship of data) {
                lol.push(ship.ship_name);
            }
            message.channel.send(lol.join(",\n"));
        } catch (error) {
            message.channel.send(`There was an error!\n\`${error}\``);
            console.log(error);
        }
    }
};
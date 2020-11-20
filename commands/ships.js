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
        const { shipKey } = require("../secret.json");

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
            console.log(error);
        }
    }
};
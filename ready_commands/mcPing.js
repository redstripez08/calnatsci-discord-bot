const Discord = require("discord.js");
const pinger = require("minecraft-pinger");

const { SERVER_ADDR } = process.env;

/**
 * @typedef     PingResponse         Response of the pinger
 * @type        {Object}
 * 
 * @property    {Object}    description             Description of stuff
 * @property    {Object[]}  description.extra       Extra stuff
 * @property    {String}    description.text        Text of stuff      
 * 
 * @property    {Object}    version                 Versions of Minecraft
 * @property    {String}    version.name            Name of the version
 * @property    {Number}    version.protocol        Protocol
 * 
 * @property    {Object}    players                 Players
 * @property    {Number}    players.max             Max amount of Players
 * @property    {Number}    players.online          Amount of online PLayers
 * @property    {Object[]}  players.sample          Players and stuff
 * 
 * @property    {Number}    ping                    Ping of server in milliseconds
 */


/** Minecraft Server Representation */
class Server {
    /**
     * Creates instance of a Minecraft Server representation 
     * @param {!String}                     owner           Owner of the Minecraft Server 
     * @param {"freemcserver"|"aternos"}    hostName        Name of hosting service
     * @param {!String}                     address         IP Address or domain of the server 
     * @param {String|Number}               [port=25565]    Port of the server. Defaults to 25565.
     */
    constructor(owner, hostName, address, port) {
        this.owner = owner;
        this.hostName = hostName;
        this.address = address;
        this.port = parseInt(port) || 25565;
    }

    /**
     * Returns logo link
     * @returns {String} Logo link
     */
    get hostLogo() {
        switch (this.hostName) {
            case "freemcserver":    return "https://freemcserver.net/img/logo/logo.png";
            case "aternos":         return "meh";
            default:                return null;
        }
    }

}

/**
 * Builds Embed
 * @param   {"offline"|"online"}        state       State of server whether online or offline. 
 * @param   {!Server}                   server      Server Owner
 * @param   {PingResponse}              [res]       Ping Response
 * @returns {Discord.MessageEmbed}      Discord Embed
 */ 
const embedBuilder = (state, server, res) => {
    if (!state || typeof state !== "string") return console.error("Server state Required!");
    // if (state.toLowerCase() !== "offline" && state.toLowerCase() !== "online") return console.error("Not a valid Server State!");
    if (!["online", "offline"].some(x => x === state.toLowerCase())) return console.error("Not a valid server state");

    switch (state.toLowerCase()) {
        case "online":
            const playerList = [];
            
            if (res.players.sample) {
                for (const player of res.players.sample) playerList.push("> " + player.name);
            }

            return new Discord.MessageEmbed()
                .setColor("#4077e6")
                .setTitle(`:diamond_shape_with_a_dot_inside:  **${server.address}**`)
                .setThumbnail(server.hostLogo)
                .setDescription(`**Status:** Online\nWelcome to rook's Server!`)
                .addField("Version", res.version.name)
                .addField("Players", `${res.players.online}/${res.players.max}\n${res.players.sample ? playerList.sort((a, b) => a.localeCompare(b)).join("\n") : "> No Players!"}`)
                .setFooter(`${res.ping}ms`);

        case "offline":
            return new Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`:red_circle:  **${server.address}**`)
                .setThumbnail(server.hostLogo)
                .setDescription(`**Status:** Offline\n${server.owner}'s server is closed.`);
    }
}


module.exports = {
    name: "mcping",
    description: "Pings Mincraft servers",
    async execute(client) {
        try {
            const channel = client.channels.cache.get("787717584908451897");
            const rookServerEmbed = await channel.messages.fetch("788338866129076224");
            const rookServer = new Server("rook", null, SERVER_ADDR);
            
            setInterval(async() => {
                try {
                     /** @type {PingResponse} */
                    const res = await pinger.pingPromise(rookServer.address);
                    rookServerEmbed.edit(embedBuilder("online", rookServer, res));
                } catch (error) {
                    // console.error(error);
                    rookServerEmbed.edit(embedBuilder("offline", rookServer));
                }
            }, 90 * 1000);
        } catch (error) {
            console.error("Big oof");
            console.error(error);
        }
    }
};
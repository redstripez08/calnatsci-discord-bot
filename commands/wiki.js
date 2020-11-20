const Discord = require("discord.js");

module.exports = {
    name: "wiki",
    aliases: ["wikpedia"],
    description: "Searches Wikipedia using supplied arguments.",
    usage: "<Search Term>",
    cooldown: 5,
    guildOnly: false,
    args: true,
    /**
     * Searches Wikipedia
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    async execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const fetch = require("node-fetch");

        try {
            const originLink = "https://en.wikipedia.org";
            const link = new URL("/w/api.php", originLink);
            link.search = new URLSearchParams({
                action: "query",
                titles: args.join(" "),
                prop: "extracts",
                exintro: true,
                explaintext: true,
                format: "json",
            }).toString();
            const linkOptions = {
                method: "GET",
                headers: {"Accept": "application/json"}
            };
            
            const res = await fetch(link, linkOptions);
            if (!res.ok) throw `Something went wrong!\n\`${res.status}\`, \`${res.statusText}\`, \`${res.error}\``;

            const { query } = await res.json();

            const charCheck = (str, max = 2048) => (str.length > max) ? str.slice(0, max - 3) + "..." : str;
            for (const key in query.pages) {
                const element = query.pages[key];
                if (!element.extract) return message.channel.send("Not Found!\nTry being more specific.");

                const embed = new MessageEmbed()
                    .setTitle(element.title)
                    .setColor(Math.floor(Math.random() * 10000000))
                    .setDescription(charCheck(element.extract))
                    .setFooter("Wikipedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wikipedia-logo-en-big.png/490px-Wikipedia-logo-en-big.png");

                message.channel.send(embed);
            }
        } catch (error) {
            message.channel.send(error); //! Go to JZBot and get error throw there.
            console.error(error);
        }
    }
};
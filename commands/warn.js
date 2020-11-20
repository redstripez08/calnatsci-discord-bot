module.exports = {
    name: "warn",
    aliases: null,
    description: "Warns a person and stores their warning.",
    usage: "<@someone> <Warning>",
    cooldown: 0,
    guildOnly: true,
    args: true,
    roles: [],
    async execute(message, args) {
        // if (!message.member.roles.cache.has("772811239604224023")) {
        //     return message.channel.send("Only memebers with `Dev` role can use this.\nReason: WIP")
        // }

        if (message.author.id !== "627065133599817738") {
            return message.channel.send("Only memebers with `Dev` role can use this.\nReason: WIP")
        }

        const fs = require("fs");
        const huh = JSON.stringify(
            {
                warn: "My pen"
            }
        );
        try {
            const data = await fs.promises.readFile("./json/warn.json");
            console.log(JSON.parse(data));

            await fs.promises.writeFile("./json/warn.json", huh);
        } catch (error) {
            console.error(error);
        }
    }
};
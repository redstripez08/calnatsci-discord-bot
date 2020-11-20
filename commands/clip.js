module.exports = {
    name: "clip",
    aliases: null,
    description: "A collection of clips",
    usage: null,
    cooldown: 3,
    guildOnly: false,
    args: true,
    roles: [],
    execute(message, args) {
        const { MessageAttachment } = require("discord.js");
        //* Parse flags: /(-[A-Z]|--\b[A-Z]{0,20}\b)+/gi

        return message.channel.send("WIP");
        const lol = args.filter(str => /(-[A-Z]|--\b[A-Z]{0,20}\b)+/gi.test(str));
        console.log(lol);
        switch (args.join(" ").toLowerCase()) {
            case "beautiful":
                const lol = new MessageAttachment("./assets/videos/Beautiful.mp4");
                message.channel.send(lol);
                break;
        
            default:
                break;
        }
    }
};
module.exports = {
    name: "test",
    aliases: ["t"],
    async execute(message, args) {
        const Discord = require("discord.js");
        const path = require("path");
        const fs = require("fs");

        const fetch = require("node-fetch");
        
        try {
            if (!args.length) {
                // message.channel.send("BIGG CHUNGUS");
                return message.channel.send("TESTT");

                const res = await fetch("", {method: 'GET'});
                // console.log(res.body);
                const heh = await res.buffer();

                const att = new Discord.MessageAttachment(heh);
                message.channel.send(att);
            } else {
                message.channel.send(args.join(" "));
            }
        } catch (error) {
            message.channel.send("There was an error:\n" + `\`${error}\``);
            console.error(error);
        }
    }
};
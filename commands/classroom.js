const Discord = require("discord.js");
const { dev } = require("../json/roles.json");
module.exports = {
    name: "classroom",
    aliases: ["class"],
    description: "Helps stuff n whatever",
    usage: "<Command Name>",
    cooldown: 0,
    guildOnly: false,
    args: false,
    roles: [dev],
    /**
     * Gets Announcements from Google Classroom
     * @param   {Discord.Message}     message 
     * @param   {Array<String>}       args 
     */
    async execute(message, args) {
        const { Gclass } = require("../classes/gclass");
        try {
            //await Gclass.authorize();
    
            const English = new Gclass(155665494667);
            const ann = await English.getAnnouncements(3);
            const ah = [];
            for (const Aclass of ann) {
                ah.push(Aclass.text);
            }
            //console.log(ah);
            const charCounter = (str, max = 1024) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
            message.channel.send(charCounter(ah.join("\n\n")));       
        } catch (error) {
            console.error(error);
        }
    }
};
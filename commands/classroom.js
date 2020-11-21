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
        // Create command hanler for class commands
    }
};
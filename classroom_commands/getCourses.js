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
        const moment = require("moment-timezone");

        try {
            const webhooks =  await message.channel.fetchWebhooks();
            const webhook = webhooks.first();

            const English = new Gclass({id: "lol", name: "Mathematics", color: "#fff"});
            
            const ann = await English.getCourseWork(3);
            const embeds = [];

            const charCounter = (str, max = 2048) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
            
            const embedConstructor = (subject, params) => new Discord.MessageEmbed()
                .setAuthor(subject.subjectName)
                .setTitle(charCounter(params.title, 256))
                .setURL(params.URL)
                .setDescription(charCounter(params.description))
                .setColor(subject.subjectColor)
                .addField("\u200b", "**(YYYY-MM-DD)**")
                .addFields(
                    {
                        name: "Date Created ", 
                        value: moment(params.creationTime).tz("Asia/Manila").format("YYYY-MM-DD HH:mm z,[\n]Do MMMM, dddd")
                    },
                    {
                        name: "Date Updated", 
                        value: moment(params.updateTime).tz("Asia/Manila").format("YYYY-MM-DD HH:mm z,[\n]Do MMMM, dddd")
                    },

                    {name: "\u200b", value: "\u200b"},

                    {
                        name: "Due Date ", 
                        value: moment(`${params.dueDate.year}-${params.dueDate.month}-${params.dueDate.day} ` +
                        `${params.dueTime.hours}:${params.dueTime.minutes}Z`).tz("Asia/Manila")
                        .format("YYYY-MM-DD HH:mm z,[\n]MMMM dddd, Do")
                    }
                )
            
            for (const Aclass of ann) {
                const params = {
                    title: Aclass.title,
                    description: Aclass.description,
                    URL: Aclass.alternateLink,
                    creationTime: Aclass.creationTime,
                    updateTime: Aclass.updateTime,
                    dueDate: Aclass.dueDate,
                    dueTime: Aclass.dueTime
                };

                embeds.push(embedConstructor(English, params));
            }
            //console.log(ah);
            // const charCounter = (str, max = 1024) => str.length > max ? `${str.slice(0, max - 3)}...` : str;
            // message.channel.send(charCounter(ah.join("\n\n")));

            await webhook.send({
                username: "CalNatSci | Webhook",
                avatarURL: 'https://i.imgur.com/kBKuF03.png',
                embeds
            });
        } catch (error) {
            message.channel.send(`There was an error:\n\`${error}\``);
            //console.error(error);
        }
    }
};
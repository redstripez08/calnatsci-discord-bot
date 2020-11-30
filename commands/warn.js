const Discord = require("discord.js");
const { dev } = require("../json/roles.json");

module.exports = {
    name: "warn",
    aliases: null,
    description: "Warns a person and stores their warning.",
    usage: "<@someone> <Warning>",
    cooldown: 0,
    guildOnly: true,
    args: true,
    roles: [dev],
    /**
     * Does warning stuff
     * @param   {Discord.Message}       message 
     * @param   {Array<String>}         args 
     */
    async execute(message, args) {
        try {
            const mongoose = require("mongoose");
            args.shift();

            const mentioned = message.mentions.users.first();
            if (!message.mentions.users.size) return message.channel.send("You need to mention someone!");
            if (!args.length) return message.channel.send("You need to supply a warning!");

            const WarnSchema = mongoose.Schema({
                name: {
                    type: String,
                    required: true
                },

                warning: {
                    type: String,
                    required: true
                },

                issued_by: {
                    type: String,
                    required: true
                },

                date: {
                    type: Date,
                    default: Date.now
                }
            });

            const MyModel = mongoose.model("warnings", WarnSchema);
            const instance = new MyModel({
                name: mentioned.id,
                warning: args.join(" "),
                issued_by: message.author.id,
            });

            const flagRegex = new RegExp(/-\w+|--\w{2,}/gi);
            const flagArr = args.filter(flag => flagRegex.test(flag));
            console.log(flagArr);
            switch (true) {
                case flagArr.includes("-l") || flagArr.includes("--logs"):
                    logs();
                    break;
            
                default:
                    break;
            }



            // const lol = await instance.save();
            // console.log(lol);
            async function logs(params) {
                const je = await MyModel.find({name: mentioned.id});
                console.log(je);
                const accused = message.client.users.cache.get(je[0].name);
                const accuser = message.client.users.cache.get(je[0].issued_by);

                message.channel.send(`Accused: ${accused}\nAccuser: ${accuser}\nWarning: ${je[0].warning}\nDate: ${je[0].date}`);
                return;
            }

            return;

            message.channel.send("Warning Sent and Stored.");

            const warnEmbed = new Discord.MessageEmbed()
                .setTitle(`You have been warned by ${message.author.tag}\n`)
                .setColor("#FF0000")
                .setDescription(args.join(" "))
                .setFooter("All warnings are stored.")

            mentioned.send(warnEmbed).catch(() => {});
        } catch (error) {
            message.channel.send(`There was an error:\n\`${error}\``);
            console.error(error);
        }
    }
};
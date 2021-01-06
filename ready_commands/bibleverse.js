const Discord = require("discord.js");
const moment = require("moment-timezone");
const path = require("path");
const TOML = require("toml");
const { BIBLE_WEBHOOK_ID, BIBLE_WEBHOOK_TOKEN } = process.env;
const { File } = require("../classes");

const webhook = new Discord.WebhookClient(BIBLE_WEBHOOK_ID, BIBLE_WEBHOOK_TOKEN);
const verseFile = new File(path.resolve(__dirname, "../config/verses.toml"), {encoding: "utf-8"});
// const lolt = new File(path.resolve(__dirname, "./mcPing.js"), {encoding: "base64"});
// console.log(lolt.readFileSync());

const dataFile = verseFile.readFileSync();
const data = TOML.parse(dataFile);

const date = moment.tz(new Date(), "Asia/Manila");
let tripped = false;

module.exports = {
    name: "bibleverse",
    /**
     * Sends pre-defined bible verses at a specific time.
     * I myself am an atheist but my Christian friends wanted me to create this so I did.
     * @param {Discord.Client} client 
     */
    async execute(client) {
        setInterval(() => {
            if (date.hour() === 8 && !tripped) {
                for (const key in data) {
                    if (Object.hasOwnProperty.call(data, key)) {
                        if (date.isoWeekday() === parseInt(key)) {
                            const element = data[key];
                            const embed = new Discord.MessageEmbed()
                                .setTitle(element.location)
                                .setDescription(element.verse)
                                .setColor("#0000ff");

                            webhook.send({embeds: [embed]});
                            break;
                        }
                    }
                }
                tripped = true;
                setTimeout(() => tripped = false, 3600 * 1000);
            }
        }, 40 * 1000);
    }
};
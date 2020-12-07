const Discord = require("discord.js");
const moment = require("moment-timezone");
const schoolTime = require("../json/schooltime.json");

const { SCHED_WEBHOOK_ID, SCHED_WEBHOOK_TOKEN } = process.env;
const schedule = new Discord.Collection();

module.exports = {
    name: "Schedule",
    /**
     * Schedule Notifier
     * @param {Discord.Client} client 
     */
    execute(client) {
        return;
    //     const webhookClient = new Discord.WebhookClient(SCHED_WEBHOOK_ID, SCHED_WEBHOOK_TOKEN);

    //     const embed = new Discord.MessageEmbed()
    //         .setTitle("Test");

    //     webhookClient.send("Test", {
    //         username: "CalNatSci | Webhook - Schedule Notifier",
    //         avatarURL: "https://i.imgur.com/kBKuF03.png",
    //         embeds: [embed]
    //     });

    //     for (const subject of schoolTime) {
    //         subject["time"] = moment(`${subject.dayStart}T${subject.timeStart}`);
    //         schedule.set(subject.subject, subject);
    //     }

    //     console.log(schedule);
    //     const date = moment.tz(new Date(), "Asia/Manila");
    //     console.log(date.format("ddd HH mm"), date.dayOfYear());

    //     console.log(date, date.clone().subtract(15, "minutes"));
    //     let sent = false;

    //     setInterval(() => {
    //         if (sent) return;

    //         sent = true;
    //         setTimeout(() => sent = false, 20 * 1000);
    //     }, 50 * 1000);
    }
};
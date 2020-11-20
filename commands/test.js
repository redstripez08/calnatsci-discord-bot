module.exports = {
    name: "test",
    aliases: ["t"],
    execute(message, args) {
        if (!args.length) {
            message.channel.send("BIGG CHUNGUS");
        } else {
            message.channel.send(args.join(" "));
        }
    }
};
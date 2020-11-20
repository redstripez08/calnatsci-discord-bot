const Discord = require("discord.js");

module.exports = {
    name: "describe",
    aliases: ["desc"],
    description: "Gets info on someone",
    usage: "<@someone>",
    cooldown: 0,
    guildOnly: false,
    args: false,
    flags: ["-r", "--read"],
    role: [],
    /**
     * Receives descriptions and stores them in JSON.
     * @param {Discord.Message} message
     * @param {Array} args 
     */
    async execute(message, args) {
        const { File } = require("../classes/file");
        const flags = args.filter(flag => /-\w{1}|--\b\w{0,20}\b/g.test(flag));
        const newArgs = args.filter(flag => !/-\w{1}|--\b\w{0,20}\b/g.test(flag));
        try {
            const test = new File("./json/test.json");
            switch (true) {
                case flags.includes("-r"):
                case flags.includes("--read"):
                    (async() => {
                        const meeh = await test.read();                    
                        message.channel.send(meeh[message.author.id]);
                    })();
                    break;

                case flags.includes("-w"):
                case flags.includes("--write"):
                    (async() => {
                        const wittt = {};
                        wittt[message.author.id] = newArgs.join(" ");
                        await test.write(JSON.stringify(wittt));    
                    })();
                    break;
        
                default:
                    message.channel.send("Provide a flag!");
                    break;
            }
        } catch (error) {
            message.channel.send("Something went wrong\n" + error)
            console.error(error);
        }

        // try {
            
        //     if (flags.includes("-s")) {
    
        //     }
        //     await fs.promises.writeFile("./json/describe.json", lol);

        //     const data = await fs.promises.readFile("./json/describe.json");
            // console.log(JSON.parse(data));
        //     message.channel.send(data.toString());

        // } catch (error) {
        //     console.error(error);
        // }
    }
};
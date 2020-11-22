console.log("Initializing Client...");
const Discord = require("discord.js");
const client = new Discord.Client({ws:{intents: Discord.Intents.ALL}});

const fs = require("fs");
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
const ready_commandFiles = fs.readdirSync("./ready_commands/").filter(file => file.endsWith(".js"));
const classroom_commandFiles = fs.readdirSync("./classroom_commands/").filter(file => file.endsWith(".js"));

const cooldowns = new Discord.Collection();
const ready_commands = new Discord.Collection();
client.classCommands = new Discord.Collection();
client.commands = new Discord.Collection();

const { Gclass } = require("./classes/gclass.js");
const { version } = require("./package.json");
const { prefix, token } = process.env;

for (const commandFile of commandFiles) {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.name, command);
}

for (const commandFile of ready_commandFiles) {
    const command = require(`./ready_commands/${commandFile}`);
    ready_commands.set(command.name, command);
}

for (const commandFile of classroom_commandFiles) {
    const command = require(`./classroom_commands/${commandFile}`);
    client.classCommands.set(command.name, command);
}

client.on("ready", async() => {
    console.log(`${client.user.username} v${version} Ready`);
    client.user.setActivity(`${prefix}help`, {type: "LISTENING"});

    ready_commands.get("roleselect").execute(client);
    
    await Gclass.authorize();
    console.log("Google Classroom Authorized");
});


client.on("message", message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +|\n/g);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
 
    if (command.guildOnly && message.channel.type !== "text") 
    return message.reply(`\`${prefix}${command.name}\` only works for servers.`);

    if (command.roles && command.roles.length) {
        let roleBool = false;
        
        for (const role of command.roles) {
            if (message.member.roles.cache.has(role.id)) {
                roleBool = true;
                break;
            }
        }
        
        if (!roleBool) {
            const roleArr = [];
            for (const role of command.roles) roleArr.push(role.name);     
            
            const text = `You don't have the required roles!\nYou need \`${roleArr.join("`, `")}\``;
            return message.channel.send(text);
        }
    }

    if (command.args && !args.length) { 
        let reply = "You didn't provide any arguments!";
        if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection()); 
    }

    const now = Date.now();                             
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            const text = `Please wait **${timeLeft.toFixed(1)}** ` +
            `more second(s) before reusing the \`${command.name}\` command.`;

            return message.channel.send(text);
        }
    }
    
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        message.channel.send(`There was an error\n\`${error}\``);
        console.error(error);
    }
});

client.login(token);
console.log("Initializing Client...");
const Discord = require("discord.js");
const client = new Discord.Client({ws:{intents: Discord.Intents.ALL}});

const fs = require("fs");
const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"));
const ready_commandFiles = fs.readdirSync("./ready_commands/").filter(file => file.endsWith(".js"));
const classroom_commandFiles = fs.readdirSync("./classroom_commands/").filter(file => file.endsWith(".js"));

/**
 * @typedef CommandExecute      Command Execute Method
 * @type {Function}
 * 
 * @param       {!Discord.Message}  message         Discord Message 
 * @param       {String[]}          args            Arguments passed
 */

/**
 * @typedef Command         Generic Structure of command files.
 * @type {Object}
 * 
 * @property    {String}            name            Name of the command
 * @property    {String[]}          aliases         Array of Aliases
 * @property    {String}            description     Description of the command
 * @property    {String}            usage           Shows how to use the command
 * @property    {Number}            [cooldown=0]    Time required to elapse before executing command again in seconds
 * @property    {Boolean}           guildOnly       Checks if command is guild or server-only
 * @property    {Boolean}           args            Checks if command requires arguments
 * @property    {Object[]}          [roles=null]    Array of roles that can use the command
 * @property    {CommandExecute}    execute         Executes the command
 */

// const mongoose = require("mongoose");
const cooldowns = new Discord.Collection();

client.classCommands = new Discord.Collection();
client.commands = new Discord.Collection();

/** @type {Discord.Collection<String, Command>} */
const ready_commands = new Discord.Collection();

/** @type {Discord.Collection<String, Command>} */
const classCommands = client.classCommands;

/** @type {Discord.Collection<String, Command>} */
const commands = client.commands;

const { Gclass } = require("./classes");
const { version } = require("./package.json");
const { prefix, token, DB_CONNECTION } = process.env;

// Require and set commands
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

client.on("ready", async () => {
    // execute ready commands
    for (const command of ready_commands.values()) {
        command.execute(client);
    }
    
    await Gclass.authorize();
    console.log("Google Classroom Authorized");
    
    // mongoose.connect(
    //     DB_CONNECTION,
    //     {useNewUrlParser: true, useUnifiedTopology: true}, 
    //     () => console.log("connected to DB")
    // );        
        
    client.user.setActivity(`${prefix}help`, {type: "LISTENING"});
    console.log(`${client.user.username} v${version} Ready`);
});


client.on("message", message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +|\n+/g);
    const commandName = args.shift().toLowerCase();
    
    /** @type {Command} */
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") 
    return message.reply(`\`${prefix}${command.name}\` only works for servers.`);

    if (command.roles && command.roles.length) {
        let roleBool = false;
        
        if (message.channel.type === 'dm') { 
            roleBool = false; 
        } else {
            for (const role of command.roles) {
                if (message.member.roles.cache.has(role.id)) {
                    roleBool = true;
                    break;
                }
            }
        }
        
        if (!roleBool) {
            const roleArr = [];
            for (const role of command.roles) roleArr.push(role.name);     
            
            const text = `You don't have the required roles!\nYou need \`${roleArr.join("`, `")}\` roles.`;
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
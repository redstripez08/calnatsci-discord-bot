const Discord = require("discord.js");

module.exports = {
    name: "roleselect",
    description: "startup_command",
    /**
     * This listens for reactions and gives roles
     * @param {Discord.Client} client 
     */
    async execute(client) {
        if (!client) throw new Error("Client is Gone for some reason");

        const Cryptr = require("cryptr");
        const cryptr = new Cryptr(process.env.cryptrKey);
        const { content } = require("../secret.json");

        
        const { MessageEmbed } = require("discord.js");
        const sectionRoles = require("../json/sectionRoles.json");
        const secret = JSON.parse(cryptr.decrypt(content));
        const channel = client.channels.cache.get(secret.roleChannelId);
        const guild = client.guilds.cache.get(secret.guildId);

        const embed = new MessageEmbed()
            .setColor("#fff")
            .setTitle("React to get Section Role")
            .setDescription(
                "**:regional_indicator_a: : `Andromeda`**\n\n" +
                "**:regional_indicator_c: : `Cassiopeia`**\n\n" +
                "**:regional_indicator_o: : `Orion`**\n\n" +
                "**:regional_indicator_p: : `Perseus`**\n\n" +
                "**:x: : `Clear Section Role`**" 
            );

        const countEmbed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Server Count")
            .setDescription(
                "**Andromeda:** **\`${num}\`"
            );
                
        // const m = await channel.send(embed);

        const androEmoji = "🇦";
        const cassioEmoji = "🇨";
        const orionEmoji = "🇴";
        const perseEmoji = "🇵";
        const clearEmoji = "❌";
        const acceptedEmojis = [
            androEmoji,
            cassioEmoji,
            orionEmoji,
            perseEmoji,
            clearEmoji
        ];

        // m.react(androEmoji);
        // m.react(cassioEmoji);
        // m.react(orionEmoji);
        // m.react(perseEmoji);
        // m.react(clearEmoji);

        // for (const sectRole of sectionRoles) {
        //     const role = guild.roles.cache.get(sectRole.id);
        //     console.log(role.members.size);
        // }

        
        const m = await channel.messages.fetch("776650335422251029");

        const androFilter = (react, user) => react.emoji.name === androEmoji && !user.bot;
        const cassioFilter = (react, user) => react.emoji.name === cassioEmoji && !user.bot;
        const orionFilter = (react, user) => react.emoji.name === orionEmoji && !user.bot;
        const perseFilter = (react, user) => react.emoji.name === perseEmoji && !user.bot;
        const clearFilter = (react, user) => react.emoji.name === clearEmoji && !user.bot;
        const acceptedFilter = (react, user) => !acceptedEmojis.some(emoji => emoji === react.emoji.name) && !user.bot;
        const androCollector = m.createReactionCollector(androFilter);
        const cassioCollector = m.createReactionCollector(cassioFilter);
        const orionCollector = m.createReactionCollector(orionFilter);
        const perseCollector = m.createReactionCollector(perseFilter);
        const clearCollector = m.createReactionCollector(clearFilter);
        const acceptedCollector = m.createReactionCollector(acceptedFilter);

        const roleEmbedCreate = (role, user) => {
            return new MessageEmbed()
                .setColor(role.color)
                .setTitle(`[ ${user.username} ] has been assigned to \`${role.name}\``);
        }

        
        const alreadyRoleReply = async(user, role) => {
            const replyText = `<@${user.id}>, You're already in \`${role.name}\`` +
            `! To change, clear your role first by reacting with :x:.`;
    
            return channel.send(replyText);
        }

        acceptedCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name) || m.reactions.cache.get(reaction.emoji.id);
            react.count -= 1;
            react.users.remove(user.id);
            const msg = await channel.send(`<@!${user.id}>, only react with supplied emojis.`);
            msg.delete({timeout: 5000});
        });

        androCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name);
            react.count -= 1;
            react.users.remove(user.id);

            const mem = guild.members.cache.get(user.id);
            for (const role of sectionRoles) {
                if (mem.roles.cache.has(role.id)) {
                    const reply = await alreadyRoleReply(user, role);
                    return reply.delete({timeout: 10000});
                }                
            }
            const role = guild.roles.cache.get(sectionRoles[0].id);
            //console.log(meh);    
            mem.roles.add(role);
            const msg = await channel.send(roleEmbedCreate(role, user));
            msg.delete({timeout: 20000});
        });

        cassioCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name);
            react.count -= 1;
            react.users.remove(user.id);

            const mem = guild.members.cache.get(user.id);
            for (const role of sectionRoles) {
                if (mem.roles.cache.has(role.id)) {
                    const reply = await alreadyRoleReply(user, role);
                    return reply.delete({timeout: 10000});
                }                
            }
            const role = guild.roles.cache.get(sectionRoles[1].id);
            //console.log(meh);    
            mem.roles.add(role);
            const msg = await channel.send(roleEmbedCreate(role, user));
            msg.delete({timeout: 20000});
        });

        orionCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name);
            react.count -= 1;
            react.users.remove(user.id);

            const mem = guild.members.cache.get(user.id);
            for (const role of sectionRoles) {
                if (mem.roles.cache.has(role.id)) {
                    const reply = await alreadyRoleReply(user, role);
                    return reply.delete({timeout: 10000});
                }                
            }
            const role = guild.roles.cache.get(sectionRoles[2].id);
            //console.log(meh);    
            mem.roles.add(role);
            const msg = await channel.send(roleEmbedCreate(role, user));
            msg.delete({timeout: 20000});
        });

        perseCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name);
            react.count -= 1;
            react.users.remove(user.id);

            const mem = guild.members.cache.get(user.id);
            for (const role of sectionRoles) {
                if (mem.roles.cache.has(role.id)) {
                    const reply = await alreadyRoleReply(user, role);
                    return reply.delete({timeout: 10000});
                }                
            }
            const role = guild.roles.cache.get(sectionRoles[3].id);
            //console.log(meh);    
            mem.roles.add(role);
            const msg = await channel.send(roleEmbedCreate(role, user));
            msg.delete({timeout: 20000});
        });

        clearCollector.on("collect", async(reaction, user) => {
            const react = m.reactions.cache.get(reaction.emoji.name);
            react.count -= 1;
            react.users.remove(user.id);

            const mem = guild.members.cache.get(user.id);
            for (const role of sectionRoles) {
                if (mem.roles.cache.has(role.id)) {
                    //const reply = await channel.send(`<@${user.id}>, You're already in \`${role.name}\`! To change, clear your role first.`);
                    mem.roles.remove(role.id);
                }                
            }
            //const role = guild.roles.cache.get(sectionRoles[1].id);
            //console.log(meh);    
            //mem.roles.add(role);

            const msg = await channel.send(`<@!${user.id}>, all your section roles have been removed.`);
            msg.delete({timeout: 20000});
        });

    }
};
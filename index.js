const Discord = require('discord.js')
const { CommandoClient } = require('discord.js-commando')
const sleep = time => new Promise(resolve => setInterval(resolve, time))
const Enmap = require('enmap')
const path = require('path')

const bot = new Discord.Client({ intents: 33282 })

const db = new Enmap({
    name: "maindb"
});
module.exports.db = db;

bot.on('ready', async () => {
    console.log(`Logged in as ${bot.user.tag} (${bot.user.id})`)
})

bot.on('message', async message => {
    const targetuserid = db.get(`targetuser_${message.guild.id}`)
    if (!targetuserid) return;

    if (message.author.bot || message.author.system) return;
    if (message.content.startsWith(bot.commandPrefix)) return;

    const targetuser = await message.guild.members.fetch(targetuserid)

    if (!targetuser) return;

    if (message.guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_NICKNAMES, Discord.Permissions.FLAGS.MANAGE_GUILD, Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.EMBED_LINKS]) && targetuser.manageable) {
        try {
            if (message.content === "reset") {
                targetuser.setNickname("")
                console.log(`Successfully Reset ${targetuser.user.tag} (${targetuser.id})'s nickname`)                
            } else {
                targetuser.setNickname(message.content.substring(0, 32))
                console.log(`Set nickname of ${targetuser.user.tag} (${targetuser.id}) to ${message.content.substring(0, 32)}`)
            }
        }
        catch (err) {
            console.log(`Failed to set nickname of user!\nError Message: ${err}`)
        }
    }


})

{
    bot.login()
}
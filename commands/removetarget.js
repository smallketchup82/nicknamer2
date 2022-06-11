const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../index.js').db;
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removetarget')
		.setDescription('Remove the current target (disable bot)'),
	async execute(interaction) {
		await interaction.deferReply();

		if (!interaction.member.permissions.has([Discord.Permissions.FLAGS.MANAGE_NICKNAMES, Discord.Permissions.FLAGS.MANAGE_ROLES])) return await interaction.editReply({ content: 'You need `manage nicknames` and `manage roles to use this command.', ephemeral: true });

		// start by checking if the guild already has a listing in the database
		const one = db.prepare(`select * from targetusers where guild = ${interaction.guild.id}`).get();

		if (one) {
			// check if the target user is already the target user and return status code 1 if so
			const two = db.prepare(`select userid from targetusers where guild = ${interaction.guild.id};`).get();
			if (!two) return await interaction.editReply('Unexpected error');

			// so now we know that the target user isnt currently the target user, we can get to making them the target user. let's start with check
			db.prepare(`delete from targetusers where userid = ${two.userid} and guild = ${interaction.guild.id}`).run();

			await interaction.editReply('Successfully removed the target!');
		} else {
			await interaction.editReply('There is not a target currently set for your guild!');
		}
	},
};

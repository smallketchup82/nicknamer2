const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../index.js').db;
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settarget')
		.setDescription('Set the target to update')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user to update')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		await interaction.deferReply();

		if (!interaction.member.permissions.has([Discord.Permissions.FLAGS.MANAGE_NICKNAMES, Discord.Permissions.FLAGS.MANAGE_ROLES])) return await interaction.editReply({ content: 'You need `manage nicknames` and `manage roles to use this command.', ephemeral: true });

		// start by checking if the guild already has a listing in the database
		const one = db.prepare(`select * from targetusers where guild = ${interaction.guild.id}`).get();

		console.log(one);
		if (one) {
			// we know that there is a listing in the database so lets run an update process

			// check if the target user is already the target user and return status code 1 if so
			const two = db.prepare(`select * from targetusers where guild = ${interaction.guild.id} and userid = ${user.id};`).get();
			if (two) return await interaction.editReply('The user you want to set as the target is already the target!');

			// so now we know that the target user isnt currently the target user, we can get to making them the target user. let's start with check
			db.prepare(`update targetusers set userid = ${user.id} where guild = ${interaction.guild.id}`).run();

			await interaction.editReply(`Successfully set ${user} as the target!`);
		} else {
			// its not in the database, we should add it.

			// check if the target user is already the target user and return if so
			const two = db.prepare(`select * from targetusers where guild = ${interaction.guild.id} and userid = ${user.id};`).get();
			if (two) return await interaction.editReply('The user you want to set as the target is already the target!');

			// so now we know that the target user isnt currently the target user, we can get to making them the target user. let's start with check
			db.prepare(`insert into targetusers (guild, userid) values(${interaction.guild.id}, ${user.id})`).run();

			await interaction.editReply(`Successfully set ${user} as the target!`);
		}
	},
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../index.js').db;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('viewtarget')
		.setDescription('View the current target'),
	async execute(interaction) {
		await interaction.deferReply();

		// start by checking if the guild already has a listing in the database
		const one = db.prepare(`select * from targetusers where guild = ${interaction.guild.id}`).get();

		if (one) {
			// check if the target user is already the target user and return status code 1 if so
			const two = db.prepare(`select userid from targetusers where guild = ${interaction.guild.id};`).get();
			if (!two) return await interaction.editReply('Unexpected error');

			await interaction.editReply(`The current target is <@!${two.userid}>!`);
		} else {
			await interaction.editReply('There is not a target currently set for this guild!');
		}
	},
};

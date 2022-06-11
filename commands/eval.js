const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../index.js').db;
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Evaluate code')
		.addStringOption(option =>
			option.setName('content')
				.setDescription('The content')
				.setRequired(true)),
	async execute(interaction) {
		const content = interaction.options.getString('content');
		await interaction.deferReply({ ephemeral: true });

		if (interaction.user.id !== '296052363427315713') return await interaction.editReply({content: 'You do not have permission to use this command', ephemeral: true});

		const clean = async (text) => {
			// If our input is a promise, await it before continuing
			if (text && text.constructor.name == 'Promise') {text = await text;}

			// If the response isn't a string, `util.inspect()`
			// is used to 'stringify' the code in a safe way that
			// won't error out on objects with circular references
			// (like Collections, for example)
			if (typeof text !== 'string') {text = require('util').inspect(text, { depth: 1 });}

			// Replace symbols with character code alternatives
			text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));

			// Send off the cleaned up result
			return text;
		};

		try {
			// Evaluate (execute) our input
			const evaled = eval(content);

			// Put our eval result through the function
			// we defined above
			const cleaned = await clean(evaled);

			// Reply in the channel with our result
			await interaction.editReply({ content: `\`\`\`js\n${cleaned}\n\`\`\``, ephemeral: true });
		} catch (err) {
			// Reply in the channel with our error
			await interaction.editReply({ content: `\`ERROR\` \`\`\`xl\n${cleaned}\n\`\`\``, ephemeral: true });
		}
	},
};
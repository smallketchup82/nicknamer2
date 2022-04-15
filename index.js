const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const sleep = time => new Promise(resolve => setInterval(resolve, time));
const config = require('./config.json');
const Database = require('better-sqlite3');
const fs = require('fs');
const db = new Database('database.sqlite', { verbose: console.log });
module.exports.db = db;

const bot = new Discord.Client({ intents: 33283 });

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		const slashcommands = [];
		const slashcommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of slashcommandFiles) {
			const command = require(`./commands/${file}`);
			slashcommands.push(command.data.toJSON());
		}

		await rest.put(
			Routes.applicationCommands('963799407378186290'),
			{ body: slashcommands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

bot.on('ready', async () => {
	console.log(`Logged in as ${bot.user.tag} (${bot.user.id})`);
	const table = db.prepare('select count(*) from sqlite_master where type=\'table\' and name = \'targetusers\';').get();
	if (!table['count(*)']) {
		db.prepare('create table targetusers (guild text primary key, userid text not null);').run();
	}
});

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

bot.on('messageCreate', async message => {
	if (message.author.bot || message.author.system) return;

	if (message.guild.id === '204965774618656769') {
		const GalaxyFilter = [
			'Auschwitz',
			'Ballsack',
			'Ballsacks',
			'Blowjob',
			'Blowjobs',
			'Boob',
			'Boobies',
			'Boobs',
			'Booby',
			'Castrate',
			'C0c',
			'Coc',
			'Cocc',
			'Cock',
			'C0md0m',
			'Condom',
			'Cont',
			'Cum',
			'Cunt',
			'Dees nut',
			'Dees Nuts',
			'Deesnut',
			'Deesnuts',
			'Deez nut',
			'Deez nuts',
			'Deeznut',
			'Deeznuts',
			'D1ck',
			'Dick',
			'Dickhead',
			'Dickpussy',
			'Dlck',
			'Dlckhead',
			'Dildo',
			'Ejaculate',
			'Fag',
			'Fagg',
			'Faggot',
			'Fagg0t',
			'Fap',
			'Fapp',
			'Fapping',
			'Fuck',
			'Fucker',
			'Fucking',
			'Fuk',
			'Hand job',
			'Handjob',
			'Handjobs',
			'Hentai',
			'Hitler',
			'Hoe',
			'Hoes',
			'H0rny',
			'Horny',
			'Jerking',
			'K@N',
			'KAN',
			'K|nk',
			'K1nk',
			'Kink',
			'K0md0m',
			'Komdom',
			'Kum',
			'Kunt',
			'kys',
			'Miif',
			'Milf',
			'M1lf',
			'N|g',
			'N|ga',
			'N|gga',
			'N|gger',
			'Nahzi',
			'Nazi',
			'Nibba',
			'Nig',
			'Nigga',
			'Nigger',
			'Niqqa',
			'Orgasm',
			'Pen|s',
			'Penis',
			'Porn',
			'P0rn',
			'Porn-hub',
			'P0rnhub',
			'Pornhub',
			'Possy',
			'Pussy',
			'R@p3',
			'R@pe',
			'Rap3',
			'Rape',
			'R@p1ing',
			'Rap1ing',
			'Raping',
			'Rule34',
			'Schutzstaffel',
			'Semen',
			'Sex',
			'ShIong',
			'Shlong',
			'Shota',
			'Skunt',
			'Slut',
			'Sodomite',
			'Sperm',
			'Testicle',
			'Testicles',
			'Tid',
			'Tidd',
			'Tiddi',
			'Tiddie',
			'Tiddies',
			'Tiddy',
			'Tit',
			'Titties',
			'Tits',
			'Vagina',
			'Wanker',
			'Wh0r3',
			'Wh0re',
			'Whor3',
			'Whore',
		];

		const messageparser = message.content.trim().toLowerCase().split(' ');

		if (messageparser.some(r => GalaxyFilter.indexOf(r) >= 0)) return;
	}

	var targetuserid = db.prepare('select userid from targetusers where guild = ?').get(message.guild.id);
	if (!targetuserid) return;
	targetuserid = targetuserid.userid;

	const targetuser = await message.guild.members.fetch(targetuserid);
	if (!targetuser) return;
	if (message.guild.me.permissions.has([Discord.Permissions.FLAGS.MANAGE_NICKNAMES, Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES, Discord.Permissions.FLAGS.EMBED_LINKS]) && targetuser.manageable) {
		try {
			await targetuser.setNickname(message.content.substring(0, 32));
			console.log(`Set nickname of ${targetuser.user.tag} (${targetuser.id}) to ${message.content.substring(0, 32)}`);
		} catch (err) {
			console.log(`Failed to set nickname of user!\nError Message: ${err}`);
		}
	}
});

bot.login(config.token);
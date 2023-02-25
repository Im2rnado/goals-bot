const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Bot and API latency!'),
	async execute(interaction, client) {
		await interaction.reply(`**API Latency**: \`${Math.round(client.ws.ping)}ms\``);
	},
};
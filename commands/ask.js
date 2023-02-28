const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask question to Bing AI")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    const res = await client.bing.sendMessage(
      interaction.options.getString("question")
    );

    await interaction.editReply({
      content: res.text,
    });
  },
};

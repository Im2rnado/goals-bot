const Discord = require("discord.js");
const { IgApiClient } = require("instagram-private-api");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs");

const client = new Discord.Client({
  intents: [Discord.GatewayIntentBits.Guilds],
});
client.commands = new Discord.Collection();
client.caption = "";
client.cover = "";

const ig = new IgApiClient();

async function login() {
  ig.state.generateDevice("goals.bedro");
  await ig.account.login("goals.bedro", "Yassinm2007!");
}

const commands = fs
  .readdirSync(`${__dirname}/commands/`)
  .filter((file) => file.endsWith(".js"));
for (const file of commands) {
  const command = require(`${__dirname}/commands/${file}`);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
    continue;
  }
}

client.once(Discord.Events.ClientReady, async () => {
  const statuses = [
    {
      name: "Real Madrid",
      type: "WATCHING",
    },
    {
      name: "Manchester United",
      type: "WATCHING",
    },
    {
      name: "Arsenal",
      type: "WATCHING",
    },
    {
      name: "Al Ahly",
      type: "WATCHING",
    },
    {
      name: "Napoli",
      type: "WATCHING",
    },
  ];

  let i = 0;
  setInterval(async function () {
    const toDisplay = statuses[parseInt(i, 10)];
    client.user.setActivity(toDisplay, {
      type: statuses[parseInt(i, 10)].type,
    });
    if (statuses[parseInt(i + 1, 10)]) i++;
    else i = 0;
  }, 20000);

  console.log(
    `${client.user.tag} (${client.user.id}), ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
  );

  await login();
  console.log("Successfully logged in to Instagram!");
});

client.on(Discord.Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      console.log(
        `[MESSAGE] '${interaction.user.tag}' used command '${interaction.commandName}'`
      );
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: `⚠️ **Uh Oh! That was unexpected!**\n\`\`\`js\n${error}\`\`\``,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `⚠️ **Uh Oh! That was unexpected!**\n\`\`\`js\n${error}\`\`\``,
          ephemeral: true,
        });
      }
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "quality") {
      await interaction.deferReply();
      const selected = interaction.values[0];

      const vid = await fetch(selected);
      const vidBuff = await vid.arrayBuffer();

      const cov = await fetch(client.cover);
      const covBuff = await cov.arrayBuffer();

      const publishResult = await ig.publish.video({
        // read the file into a Buffer
        video: Buffer.from(vidBuff),
        coverImage: Buffer.from(covBuff),
        caption: client.caption ?? "",
      });

      await interaction.followUp({
        content: `✔️ Successfully Uploaded: https://instagram.com/p/${publishResult.media.code}`,
        components: [],
      });

      client.caption = "";
      client.cover = "";
      console.log(
        `Successfully Uploaded: https://instagram.com/p/${publishResult.media.code}`
      );
    }
  }
});

client.login(
  "MTA3OTExMzAxMzYyMzI3NTU0MA.GvgbgF.GM3Vh2CmzkFJttls7yg0m3SnLA0fc-gzH73AKA"
);

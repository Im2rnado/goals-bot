const cheerio = require("cheerio");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Post goal")
    .addStringOption((option) =>
      option.setName("link").setDescription("The tweet link").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("caption").setDescription("The caption on the post")
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    if (interaction.options.getString("caption"))
      client.caption = interaction.options.getString("caption");

    const resToken = await fetch("https://twittervideodownloader.com/", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        cookie:
          "csrftoken=au5r4nZ6uN48szGKtaEYp4sh4hBWSbL72M7LggD0nPUh8JGajAI403UIpWhrc5dU; _ga=GA1.2.1240680676.1641628632; _gid=GA1.2.414203301.1641628632; __qca=P0-603222438-1641628633090; _pbjs_userid_consent_data=6683316680106290; _pubcid=529c1986-42d2-4dec-a0e8-3a7d7c453add; __gads=ID=c7fcfc8de61626ad:T=1641628636:S=ALNI_MaE6t3k60TjxfxOEU_7fiYOKTdg8Q; session_id=6831c9ed-aeaf-47cd-a4ea-fdf1667efea2; _gat=1; cto_bundle=3Tj6Hl93WmQzcHglMkJDRmdjWnFTYWg1ZHpLeWE5allVRUU2dlFOU1huayUyRjFTM0xYJTJCSzhsajNRRkF1Q2N2OU9JS1NlSjlxWmYzRTFqSzRuaSUyQjlacHNtYXFSRTV1UHZ1UE42djg4TUJuN05FaVdwTTR4c1hkSUlCRlY4WkJaSmd2WXhLc1NDdHRrRm44c25yeTIwMkRRRSUyQkhJalMlMkJBZ3YxZzZwck5VdTIwclNoMkRvbzglM0Q; cto_bundle=3YOlHV93WmQzcHglMkJDRmdjWnFTYWg1ZHpLeVhBUGgzakxaV0xpZTJpJTJCQ3ZDVDd6SyUyQmJsdmxXcW8lMkZtZkZoMVlNNlJ4SU0xaUVxZXg0eGptZU1oZU4xOHIlMkZaamxlY3gwYnJ1ZSUyQkpVVTUyV2p0cm9PNkFRNEl3ZVBoaUtNSmpnNWRjeWtrWktoYTIzV1ZUdEJ6bFZDTWtCSDV4UWdWV2JPbGZJMzBzM2lxaVVRanNWSkElM0Q; cto_bidid=19sjyV9TQVBXTlA4SGwxYUt5Z0JqVFlHUSUyRk1QZ3Vwa1BaUGZubk1meUVmYSUyQmRSSzBUTkdGQiUyQll0bThNbWVGbjVxV293a2RDUVEzNTFvdVZxR09vaWxSWlE4a2lKTVQwYnp3JTJGV05GV0g2UUxWMnc5N2RJWG1NZGtKVWdiRm1WYXNqU0Ey",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });

    const $ = cheerio.load(await resToken.text());

    const payload = {
      csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]')
        .val()
        .toString(),
      tweet: interaction.options.getString("link"),
    };

    const res = await fetch("https://twittervideodownloader.com/download", {
      method: "POST",
      body: new URLSearchParams(Object.entries(payload)),
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "content-type": "application/x-www-form-urlencoded",
        cookie:
          "csrftoken=au5r4nZ6uN48szGKtaEYp4sh4hBWSbL72M7LggD0nPUh8JGajAI403UIpWhrc5dU; _ga=GA1.2.1240680676.1641628632; _gid=GA1.2.414203301.1641628632; __qca=P0-603222438-1641628633090; _pbjs_userid_consent_data=6683316680106290; _pubcid=529c1986-42d2-4dec-a0e8-3a7d7c453add; __gads=ID=c7fcfc8de61626ad:T=1641628636:S=ALNI_MaE6t3k60TjxfxOEU_7fiYOKTdg8Q; session_id=6831c9ed-aeaf-47cd-a4ea-fdf1667efea2; cto_bundle=3Tj6Hl93WmQzcHglMkJDRmdjWnFTYWg1ZHpLeWE5allVRUU2dlFOU1huayUyRjFTM0xYJTJCSzhsajNRRkF1Q2N2OU9JS1NlSjlxWmYzRTFqSzRuaSUyQjlacHNtYXFSRTV1UHZ1UE42djg4TUJuN05FaVdwTTR4c1hkSUlCRlY4WkJaSmd2WXhLc1NDdHRrRm44c25yeTIwMkRRRSUyQkhJalMlMkJBZ3YxZzZwck5VdTIwclNoMkRvbzglM0Q; cto_bundle=ZKGKs193WmQzcHglMkJDRmdjWnFTYWg1ZHpLeWF0Z3V5SVY2JTJGTDNCd3A1MHVWVmJMWCUyQjdLTHh2MGZjRzh3ZU5CdWs4TEJyWTNmN2IlMkZuUCUyQiUyRlBDazBORUZIM2d3d0NUR2E3VWh6bmhxNzNDMm9mQUtnTVNPMjBiOUxpSXNXZGoydGxlZjB0YTZIbkNCeU91NnZ2Y0xUJTJGV0ppYkJ0JTJCZlIxYW8yNXBGRXdLaG1Za3RWZzJrJTNE; cto_bidid=U6ndml9TQVBXTlA4SGwxYUt5Z0JqVFlHUSUyRk1QZ3Vwa1BaUGZubk1meUVmYSUyQmRSSzBUTkdGQiUyQll0bThNbWVGbjVxV293a2RDUVEzNTFvdVZxR09vaWxSWlE4a2lKTVQwYnp3JTJGV05GV0g2UUxWMnc5VkJXSFlsN2x6cExKb3pPQTAzWEZZ",
        origin: "https://twittervideodownloader.com",
        referer: "https://twittervideodownloader.com/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
      },
    });

    let results = [];

    const $$ = cheerio.load(await res.text());

    client.cover = $$("div.row.body-container > div > center")
      .find("img")
      .attr("src");

    $$("div.row.body-container > div > center > div.row").each(function () {
      const el = $(this).find("div");
      const _quality = el.eq(1).find("p").text().split(":");
      const quality = _quality?.[0]?.trim();
      const type = _quality?.[1]?.trim();
      const url = el.eq(0).find("a[download]").attr("href");
      results.push({ quality, type, url });
    });

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("quality")
        .setPlaceholder("Nothing selected")
        .addOptions(
          {
            label: `Quality: ${results[0].quality}`,
            description: results[0].url,
            value: results[0].url,
          },
          {
            label: `Quality: ${results[1].quality}`,
            description: results[1].url,
            value: results[1].url,
          },
          {
            label: `Quality: ${results[2].quality}`,
            description: results[2].url,
            value: results[2].url,
          }
        )
    );

    await interaction.editReply({
      content: "Choose a quality",
      components: [row],
    });
  },
};

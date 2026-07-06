require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    StringSelectMenuBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

const {
    BOT_TOKEN,
    WELCOME_CHANNEL_ID,
    AUTO_ROLE_ID,
    ACCESS_ROLE_ID,
    ACCESS_ROLESHOP_ID,
} = process.env;

const PREFIX = '+';
const ACCESS_BUTTON_ID = 'get_access';
const SHOP_BUTTON_ID = "get_shop_access";
const AUTO_DELETE_CHANNEL = "1523297448699629680";

// Création du client avec les intents nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,   // indispensable pour détecter les arrivées
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // indispensable pour lire le contenu des messages (commandes)
    ],
});

client.once('clientReady', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Message de bienvenue + auto-role à chaque nouvelle arrivée
client.on('guildMemberAdd', async (member) => {
    // --- Message de bienvenue ---
    try {
        const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
        if (channel) {
            await channel.send(
                `${member} vient de nous **rejoindre sur le serveur.** Nous sommes désormais **${member.guild.memberCount}** `
            );
        } else {
            console.warn('⚠️ Salon de bienvenue introuvable. Vérifie WELCOME_CHANNEL_ID dans .env');
        }
    } catch (err) {
        console.error("Erreur lors de l'envoi du message de bienvenue :", err);
    }

    // --- Auto-role ---
    try {
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
        if (role) {
            await member.roles.add(role);
        } else {
            console.warn('⚠️ Rôle introuvable. Vérifie AUTO_ROLE_ID dans .env');
        }
    } catch (err) {
        console.error("Erreur lors de l'ajout du rôle (vérifie que le rôle du bot est bien placé au-dessus dans la hiérarchie) :", err);
    }
});

client.on("messageCreate", async (message) => {

    // Auto suppression dans ce salon
    if (message.channel.id === AUTO_DELETE_CHANNEL) {
        setTimeout(async () => {
            try {
                await message.delete();
            } catch (err) {
                console.log(err);
            }
        }, 30000);
    }

    if (message.author.bot) return;

    // --- Commande +règle : affiche le règlement du serveur en embed ---
    if (message.content.toLowerCase().startsWith(`${PREFIX}règle`) ||
        message.content.toLowerCase().startsWith(`${PREFIX}regle`)) {
        const rulesEmbed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle('FOLLOW TOS DISCORD')
            .setDescription('https://discord.com/terms\nhttps://discord.com/guidelines');

        try {
            await message.channel.send({ embeds: [rulesEmbed] });
            if (message.channel.permissionsFor(message.guild.members.me).has('ManageMessages')) {
                await message.delete().catch(() => {});
            }
        } catch (err) {
            console.error("Erreur lors de l'envoi de l'embed règlement :", err);
        }
        return;
    }   


    if (message.content.toLowerCase() === `${PREFIX}accès` ||
        message.content.toLowerCase().startsWith(`${PREFIX}accès`)) {
        const banner = new AttachmentBuilder("./RYUK_BANNER.png");

const accessEmbed = new EmbedBuilder()
    .setColor(0x9b59b6)
    .setDescription(
        "## <:lock11:1523369243087732886> RYUK™ - ACCES LE4K \n" +
        "En cliquant sur le bouton en dessous de ce message vous obtiendrez l'accès à la catégorie LE4K.\n\n" +
        "**<:folder:1523362660333391893> RYUK LE4K**\n" +
        "```Une catégorie remplie de contenus exclusifs tels que :```\n\n" +
        "**<:eyes:1523365170498240574> Contenu**\n" +
        "```T00l\nvpn\nche4t\nonoff\nsite\net plein d'autres choses...```"
    )
    .setImage("attachment://RYUK_BANNER.png");

        const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId(ACCESS_BUTTON_ID)
        .setLabel("Obtenir l'accès")
        .setStyle(ButtonStyle.Secondary)
);

try {
        await message.channel.send({
    embeds: [accessEmbed],
    files: [banner],
    components: [row]
});

        await message.delete().catch(() => {});
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'embed d'accès :", err);
    }

    return;
}

if (message.content.toLowerCase().startsWith(`${PREFIX}accessshop`)) {
    const banner = new AttachmentBuilder("./RYUK_BANNER.png");
    
const accessEmbed = new EmbedBuilder()
    .setColor(0x9b59b6)
    .setDescription(
        "## <:lock11:1523369243087732886> RYUK™ - ACCES Shop \n" +
        "En cliquant sur le bouton en dessous de ce message vous obtiendrez l'accès à la catégorie SHOP.\n\n" +
        "**<:shop1:1523383488869437614> RYUK Shop**\n" +
        "```Une catégorie pour acheter des produits a petits prix :```\n\n" +
        "**<:eyes:1523365170498240574> Contenu**\n" +
        "```T00l\nnitro\ndeco\nboost\net plein d'autres choses...```"
    )
    .setImage("attachment://RYUK_BANNER.png");

        const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId(SHOP_BUTTON_ID)
        .setLabel("Obtenir l'accès")
        .setStyle(ButtonStyle.Secondary)
);

try {
        await message.channel.send({
    embeds: [accessEmbed],
    files: [banner],
    components: [row]
});

        await message.delete().catch(() => {});
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'embed d'accès :", err);
    }

    return;
}

if (message.content.toLowerCase() === `${PREFIX}ticket`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# RYUK™ - Ticket\n\n" +
            "Sélectionne une catégorie dans le menu déroulant ci-dessous.\n\n"
        );

    const menu = new StringSelectMenuBuilder()
        .setCustomId("ticket_menu")
        .setPlaceholder("Choisis la catégorie du ticket")
        .addOptions([
            {
                label: "Support",
                description: "Besoin d'aide",
                emoji: "<:support:1523423923813875782>",
                value: "support"
            },
            {
                label: "Problème / Bug",
                description: "Signaler un bug",
                emoji: "<:settings:1523424494708854884>",
                value: "bug"
            },
            {
                label: "Achat",
                description: "Achat d'un article",
                emoji: "<:shopping11:1523432205295161595>",
                value: "achat"
            }    
        ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.channel.send({
        embeds: [embed],
        components: [row]
    });

    await message.delete().catch(() => {});
    return;
}

// =======================
// STOCK
// =======================

if (message.content.toLowerCase() === `${PREFIX}stock`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "## <:nitro11:1523641221132718100> **Nitro Boost:**\n" +
            "`+nitro`\n\n" +

            "## <:decors11:1523641697018314843> **Decorations:**\n" +
            "`+decors`\n\n" +

            "## <:boost11:1523642007220650025> **Server Boost:**\n" +
            "`+svb`\n\n" +

            "## <:exchange11:1523642356765687838> **Exchange:**\n" +
            "`+exchange`\n\n" +

            "## <:members11:1523642634869014579> **Discord Members:**\n" +
            "`+members`\n\n" +

            "## <:members11:1523642634869014579> **Payement Info:**\n" +
            "`+infoPay`"
        );

    await message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {});
    return;
}

if (message.content.toLowerCase() === `${PREFIX}nitro`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:nitro11:1523641221132718100> Nitro Boost\n\n" +

            "**1 Month**\n" +
            "~~10€~~ ➜ **5€**"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

if (message.content.toLowerCase() === `${PREFIX}decors`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:deco11:1523643740252667974> Decoration\n\n" +

            "## **4,99€ ➜ 2€ <:ltc11:1523645440313262210>**\n" +

            "## **5,99€ ➜ 2,50€ <:ltc11:1523645440313262210>**\n" +

            "## **6,99€ ➜ 3€ <:ltc11:1523645440313262210>**\n" +

            "## **7,99€ ➜ 4€ <:ltc11:1523645440313262210>**\n" +

            "## **8,49€ ➜ 4,50€ <:ltc11:1523645440313262210>**\n" +

            "## **9,99€ ➜ 6€ <:ltc11:1523645440313262210>**\n" +

            "## **11,99€ ➜ 8€ <:ltc11:1523645440313262210>**\n\n" +

            "### ➜ Ajouter **0,50€** pour <:paypal11:1523644477762441268> .\n\n" +

            "• Fast Delivery"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

if (message.content.toLowerCase() === `${PREFIX}svb`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:boost11:1523642007220650025> Server Boost\n\n" +

            "**x14 • 1 Month**\n" +
            "4,50€ <:ltc11:1523645440313262210> | 5€ <:paypal11:1523644477762441268>\n\n" +

            "**x14 • 3 Months**\n" +
            "15€ <:ltc11:1523645440313262210> | 14€ <:paypal11:1523644477762441268>"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

if (message.content.toLowerCase() === `${PREFIX}exchange`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:exchange11:1523642356765687838> Exchange\n\n" +

            "## Paypal <:paypal11:1523644477762441268> ➜ LTC <:ltc11:1523645440313262210> : **15%** *(min 1€)*\n" +

            "## Paypal Card <:paypalcard11:1523647410918920242> ➜ LTC <:ltc11:1523645440313262210> : **20%** *(min 1€)*\n" +

            "## LTC <:ltc11:1523645440313262210> ➜ Paypal <:paypal11:1523644477762441268> : **2%** *(min 1€)*\n" +

            "## C2C <:exchange11:1523642356765687838> : **Seller Fees**\n" +

            "## Other : **0%**"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

if (message.content.toLowerCase() === `${PREFIX}members`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:members11:1523642634869014579> Members Discord\n\n" +

            "## **1K Offline** : **4€**\n" +

            "## **1K Online** : **5€**"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

if (message.content.toLowerCase() === `${PREFIX}infopay`) {

    const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setDescription(
            "# <:crypto11:1523649552786133105> Payment Information\n\n" +

            "## <:paypal11:1523644477762441268> Paypal\n" +
            "`deepaimer88@outlook.fr`\n" +

            "## <:ltc11:1523645440313262210> Litecoin\n" +
            "`LXaGuzGph1q61jdamn5Af1r6HF72EFdksD`\n" +

            "## <:65900btc:1523651493670948874> Bitecoin\n" +
            "`bc1qf5dzrq4c5v3f7ppnwjxsnl29fznj8eyck6l5re`\n" +

            "## <:eth11:1523651770080034947> Ethereum\n" +
            "`0xD530AD931820Dc4e1FA7e41C24663b6d90517C18`\n" +

            "## Other make a ticket"
        );

    await message.channel.send({ embeds: [embed] });
    return;
}

});

client.on("interactionCreate", async (interaction) => {

    // =======================
    // MENU TICKET
    // =======================
    if (interaction.isStringSelectMenu()) {

        if (interaction.customId !== "ticket_menu") return;

        const category = process.env.TICKET_CATEGORY_ID;
        const staff = process.env.STAFF_ROLE_ID;

        const ticket = await interaction.guild.channels.create({
            name: `${interaction.values[0]}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: category,

            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages
                    ]
                },
                {
                    id: staff,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages
                    ]
                }
            ]
        });

        const close = new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Fermer le ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(close);

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setTitle("🎫 Ticket créé")
            .setDescription(
                `Bienvenue ${interaction.user}\n\nDécris ton problème ou ce que tu veux acheter, le owner arrivera bientôt.`
            );

        await ticket.send({
            content: `<@&${staff}> ${interaction.user}`,
            embeds: [embed],
            components: [row]
        });

        return interaction.reply({
            content: `✅ Ticket créé : ${ticket}`,
            ephemeral: true
        });
    }

    // =======================
    // BOUTONS
    // =======================
    if (!interaction.isButton()) return;

    // Fermer ticket
    if (interaction.customId === "close_ticket") {

        await interaction.reply({
            content: "🔒 Fermeture du ticket...",
            ephemeral: true
        });

        setTimeout(() => {
            interaction.channel.delete().catch(() => {});
        }, 5000);

        return;
    }

    // Boutons d'accès
    let roleId;
    let category;

    if (interaction.customId === ACCESS_BUTTON_ID) {
        roleId = ACCESS_ROLE_ID;
        category = "LE4K";
    }

    if (interaction.customId === SHOP_BUTTON_ID) {
        roleId = ACCESS_ROLESHOP_ID;
        category = "SHOP";
    }

    if (!roleId) return;

    try {

        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({
                content: "⚠️ Le rôle est introuvable.",
                ephemeral: true
            });
        }

        if (interaction.member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: "❌ Tu as déjà accès à cette catégorie.",
                ephemeral: true
            });
        }

        await interaction.member.roles.add(role);

        const confirmEmbed = new EmbedBuilder()
            .setColor(0x57f287)
            .setDescription(`✅ ${interaction.user} Vous avez bien obtenu l'accès à **${category}**.`);

        await interaction.reply({
            embeds: [confirmEmbed],
            ephemeral: true
        });

    } catch (err) {
        console.error(err);
    }

});

client.login(BOT_TOKEN);
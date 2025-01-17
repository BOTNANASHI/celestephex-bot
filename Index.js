const { default: makeWASocket } = require('@adiwajshing/baileys');
const { log } = require('./src/utils/logger');
const { pingCommand } = require('./src/commands/ping');
const { helloCommand } = require('./src/commands/hello');
const { helpCommand } = require('./src/commands/help');
const { botInfoCommand } = require('./src/commands/botinfo');
const { stickerCommand } = require('./src/commands/sticker');

async function startBot() {
    const sock = makeWASocket({
        printQRInTerminal: true
    });

    // Monitora mensagens de grupo ou individuais
    sock.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || "";

        // Comandos de texto
        if (text.startsWith('!ping')) {
            await pingCommand(sock, sender);
        } else if (text.startsWith('!hello')) {
            await helloCommand(sock, sender, message);
        } else if (text.startsWith('!help')) {
            await helpCommand(sock, sender);
        } else if (text.startsWith('!botinfo')) {
            await botInfoCommand(sock, sender);
        }

        // Comando para criar figurinhas
        else if (text.startsWith('!sticker') || message.message.imageMessage || message.message.videoMessage) {
            await stickerCommand(sock, sender, message);
        }

        log(`Mensagem de ${sender}: ${text}`);
    });

    // Monitora eventos de entrada de novos membros no grupo
    sock.ev.on('group-participants.update', async (update) => {
        const { participants, jid } = update;
        if (update.action === 'add') {
            const newMember = participants[0];
            // Envia mensagem de boas-vindas para o novo membro
            await sock.sendMessage(jid, { text: `🎉 `🎉 seja bem vindo(a) a CΞLΞSTPHEX e NARNIA TEAM, Nossa guilda tem o maior prazer em receber você.
Entrem na nossa guilda: 2055173781
São no mínimo 30 dias para colocar a tag : "ᶜᣖˣ" ja com espaço invisível. daremos no Mínimo 30 dias para colocar a tag, mt obrigado qualquer dúvida chame os adms no pv🫡, @${newMember}! 🎉`, mentions: [newMember] });
            log(`Novo membro adicionado: @${newMember}`);
        }
    });

    log("Bot iniciado com sucesso!");
}

startBot();

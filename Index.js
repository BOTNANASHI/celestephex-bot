const { default: makeWASocket } = require('@adiwajshing/baileys');
const { log } = require('./src/utils/logger');
const { pingCommand } = require('./src/commands/ping');

async function startBot() {
    const sock = makeWASocket();

    sock.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || "";

        if (text.startsWith('!ping')) {
            await pingCommand(sock, sender);
        }

        log(`Mensagem de ${sender}: ${text}`);
    });

    log("Bot iniciado com sucesso!");
}

startBot();

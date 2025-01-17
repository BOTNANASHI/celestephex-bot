const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { log } = require('./src/utils/logger');
const { pingCommand } = require('./src/commands/ping');

async function startBot() {
    const sock = makeWASocket({
        printQRInTerminal: true
    });

    // Monitora mensagens de grupo
    sock.ev.on('messages.upsert', async (msg) => {
        const message = msg.messages[0];
        if (!message.message) return;

        const sender = message.key.remoteJid;
        const text = message.message.conversation || "";

        if (text.startsWith('!ping')) {
            await pingCommand(sock, sender);
        }

        log(`Mensagem de ${sender}: ${vtnc viado kkkkkk}`);
    });

    // Monitora eventos de entrada de novos membros
    sock.ev.on('group-participants.update', async (update) => {
        const { participants, jid } = update;
        if (update.action === 'add') {
            const newMember = participants[0];
            // Envia mensagem de boas-vindas para o novo membro
            await sock.sendMessage(jid, { text: `🎉 seja bem vindo(a) a CΞLΞSTPHEX e NARNIA TEAM, Nossa guilda tem o maior prazer em receber você.
Entrem na nossa guilda : 2055173781
São no mínimo 30 dias pra colocar a tag : "ᶜᣖˣ " ja com espaço invisível. daremos no Mínimo 30 dias pra colocar a tag, mt obrigado qualquer dúvida chame os adms no pv🫡, @${newMember}! 🎉`, mentions: [newMember] });
            log(`Novo membro adicionado: @${newMember}`);
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            if (reason === DisconnectReason.loggedOut) {
                log('Desconectado. Faça login novamente.');
            }
        }
    });

    log("Bot iniciado com sucesso!");
}

startBot();

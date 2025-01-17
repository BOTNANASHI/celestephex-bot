async function pingCommand(sock, sender) {
    await sock.sendMessage(sender, { text: "Pong! 🏓" });
}

module.exports = { pingCommand };

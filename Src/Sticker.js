const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Comando para criar figurinhas
async function stickerCommand(sock, sender, message) {
    // Verificar se a mensagem é uma imagem ou vídeo
    const media = message.message.imageMessage || message.message.videoMessage;
    
    if (!media) {
        await sock.sendMessage(sender, { text: "Por favor, envie uma imagem ou vídeo para criar a figurinha." });
        return;
    }

    // Baixar a mídia
    const mediaData = await sock.downloadMediaMessage(message);
    const inputPath = path.join(__dirname, 'input.jpg'); // Caminho temporário para a imagem

    fs.writeFileSync(inputPath, mediaData); // Salvar a mídia temporariamente

    // Criar a figurinha
    const outputPath = path.join(__dirname, 'output.webp'); // Caminho para a figurinha gerada

    try {
        await sharp(inputPath)
            .resize(512, 512) // Redimensionar para 512x512 (tamanho padrão das figurinhas)
            .webp({ quality: 100 }) // Converter para WebP
            .toFile(outputPath); // Salvar como .webp

        // Enviar a figurinha para o usuário
        await sock.sendMessage(sender, { sticker: fs.readFileSync(outputPath) });
        fs.unlinkSync(inputPath); // Remover o arquivo temporário
        fs.unlinkSync(outputPath); // Remover o arquivo da figurinha
    } catch (error) {
        console.error("Erro ao criar a figurinha:", error);
        await sock.sendMessage(sender, { text: "Desculpe, houve um erro ao criar a figurinha." });
    }
}

module.exports = { stickerCommand };

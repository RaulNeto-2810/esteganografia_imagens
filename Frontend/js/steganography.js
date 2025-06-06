/**
 * Classe para manipulação de esteganografia em imagens usando LSB.
 * Implementa funções para ocultar e extrair mensagens em imagens PNG.
 */
class Steganography {
    // Delimitador de fim de mensagem em binário
    static DELIMITER = '1111111111111110';

    /**
     * Converte texto em string binária
     * @param {string} text - Texto a ser convertido
     * @returns {string} String binária (8 bits por caractere)
     */
    static textToBinary(text) {
        return text.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');
    }

    /**
     * Converte string binária em texto
     * @param {string} binary - String binária (múltiplo de 8 bits)
     * @returns {string} Texto decodificado
     */
    static binaryToText(binary) {
        const bytes = binary.match(/.{1,8}/g) || [];
        return bytes.map(byte => 
            String.fromCharCode(parseInt(byte, 2))
        ).join('');
    }

    /**
     * Esconde texto em uma imagem usando LSB
     * @param {File} imageFile - Arquivo de imagem PNG
     * @param {string} message - Mensagem a ser escondida
     * @returns {Promise<Blob>} Blob da imagem com a mensagem escondida
     */
    static async encode(imageFile, message) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                // Configurar canvas
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Obter dados dos pixels
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // Preparar mensagem binária com delimitador
                const binaryMessage = this.textToBinary(message) + this.DELIMITER;

                // Verificar capacidade
                if (binaryMessage.length > (pixels.length / 4) * 3) {
                    reject(new Error('Mensagem muito grande para esta imagem'));
                    return;
                }

                // Esconder bits da mensagem
                let messageIndex = 0;
                for (let i = 0; i < pixels.length; i += 4) {
                    // Processar cada canal RGB
                    for (let j = 0; j < 3; j++) {
                        if (messageIndex < binaryMessage.length) {
                            // Limpa o último bit e define com o bit da mensagem
                            pixels[i + j] = (pixels[i + j] & ~1) | parseInt(binaryMessage[messageIndex]);
                            messageIndex++;
                        }
                    }
                    
                    if (messageIndex >= binaryMessage.length) break;
                }

                // Atualizar imagem
                ctx.putImageData(imageData, 0, 0);

                // Converter para blob
                canvas.toBlob(blob => resolve(blob), 'image/png');
            };

            img.onerror = () => reject(new Error('Erro ao carregar imagem'));

            // Carregar imagem
            const reader = new FileReader();
            reader.onload = e => img.src = e.target.result;
            reader.readAsDataURL(imageFile);
        });
    }

    /**
     * Extrai texto escondido de uma imagem
     * @param {File} imageFile - Arquivo de imagem PNG
     * @returns {Promise<string>} Mensagem extraída
     */
    static async decode(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // Extrair bits menos significativos
                let binaryMessage = '';
                for (let i = 0; i < pixels.length; i += 4) {
                    // Pegar LSB de cada canal RGB
                    for (let j = 0; j < 3; j++) {
                        binaryMessage += pixels[i + j] & 1;
                    }
                }

                // Procurar delimitador
                const endIndex = binaryMessage.indexOf(this.DELIMITER);
                if (endIndex !== -1) {
                    const message = this.binaryToText(binaryMessage.substring(0, endIndex));
                    resolve(message);
                } else {
                    reject(new Error('Nenhuma mensagem encontrada na imagem'));
                }
            };

            img.onerror = () => reject(new Error('Erro ao carregar imagem'));

            // Carregar imagem
            const reader = new FileReader();
            reader.onload = e => img.src = e.target.result;
            reader.readAsDataURL(imageFile);
        });
    }
}
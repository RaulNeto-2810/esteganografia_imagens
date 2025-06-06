"""
Módulo de Esteganografia em Imagens usando LSB (Least Significant Bit).
Implementa funções para ocultar e extrair mensagens em imagens PNG.
"""

from PIL import Image
import io

class Esteganografia:
    """Classe para manipulação de esteganografia em imagens usando LSB."""
    
    # Delimitador de fim de mensagem em binário
    DELIMITER = '1111111111111110'

    @staticmethod
    def str_to_bin(text: str) -> str:
        """
        Converte texto em uma string binária.
        
        Args:
            text (str): Texto a ser convertido
        
        Returns:
            str: String binária (8 bits por caractere)
        """
        return ''.join(format(ord(c), '08b') for c in text)

    @staticmethod
    def bin_to_str(binary: str) -> str:
        """
        Converte uma string binária em texto.
        
        Args:
            binary (str): String binária (múltiplo de 8 bits)
        
        Returns:
            str: Texto decodificado
        """
        chars = [binary[i:i+8] for i in range(0, len(binary), 8)]
        return ''.join([chr(int(char, 2)) for char in chars])

    @classmethod
    def hide_text_in_image(cls, image_data: bytes, secret_text: str) -> bytes:
        """
        Esconde texto em uma imagem usando LSB.
        
        Args:
            image_data (bytes): Dados binários da imagem original
            secret_text (str): Texto a ser escondido
        
        Returns:
            bytes: Dados binários da nova imagem com o texto escondido
        """
        # Carregar imagem dos bytes
        img = Image.open(io.BytesIO(image_data))
        img = img.convert('RGB')
        pixels = img.load()

        # Preparar texto binário com delimitador
        binary_text = cls.str_to_bin(secret_text) + cls.DELIMITER
        idx = 0

        # Verificar se a mensagem cabe na imagem
        if len(binary_text) > (img.width * img.height * 3):
            raise ValueError("Mensagem muito grande para esta imagem")

        # Esconder bits da mensagem
        for y in range(img.height):
            for x in range(img.width):
                r, g, b = pixels[x, y]
                
                if idx < len(binary_text):
                    r = (r & ~1) | int(binary_text[idx])
                    idx += 1
                if idx < len(binary_text):
                    g = (g & ~1) | int(binary_text[idx])
                    idx += 1
                if idx < len(binary_text):
                    b = (b & ~1) | int(binary_text[idx])
                    idx += 1
                    
                pixels[x, y] = (r, g, b)
                if idx >= len(binary_text):
                    break
            if idx >= len(binary_text):
                break

        # Converter imagem para bytes
        output = io.BytesIO()
        img.save(output, format='PNG')
        return output.getvalue()

    @classmethod
    def extract_text_from_image(cls, image_data: bytes) -> str:
        """
        Extrai texto escondido de uma imagem.
        
        Args:
            image_data (bytes): Dados binários da imagem
        
        Returns:
            str: Texto extraído ou None se nenhuma mensagem for encontrada
        """
        # Carregar imagem dos bytes
        img = Image.open(io.BytesIO(image_data))
        img = img.convert('RGB')
        pixels = img.load()

        # Extrair bits menos significativos
        binary_text = ''
        for y in range(img.height):
            for x in range(img.width):
                r, g, b = pixels[x, y]
                binary_text += str(r & 1)
                binary_text += str(g & 1)
                binary_text += str(b & 1)

        # Procurar delimitador de fim
        end_index = binary_text.find(cls.DELIMITER)
        if end_index != -1:
            binary_text = binary_text[:end_index]
            return cls.bin_to_str(binary_text)
            
        return None
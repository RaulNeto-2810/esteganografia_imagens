# 🖼️ Esteganografia em Imagens

Projeto de esteganografia que permite esconder e recuperar mensagens secretas em imagens PNG usando a técnica LSB (Least Significant Bit).

## 🌐 Links

- **GitHub:** [https://github.com/RaulNeto-2810/esteganografia_imagens](https://github.com/RaulNeto-2810/esteganografia_imagens)
- **Site:** [https://raulneto-2810.github.io/esteganografia_imagens/](https://raulneto-2810.github.io/esteganografia_imagens/)

## 💡 Funcionalidades

### Codificação
- Seleção de imagem PNG
- Inserção de mensagem secreta
- Download da imagem com mensagem oculta
- Preview da imagem em tempo real

### Decodificação
- Extração da mensagem oculta
- Suporte a imagens PNG
- Preview da imagem carregada

## 🛠️ Tecnologias

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Técnica LSB para manipulação de pixels

### Backend
- Python
- Flask
- Pillow (PIL) para processamento de imagens

## 📦 Estrutura do Projeto

```
├── Frontend/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── script.js
│       └── steganography.js
│
├── Backend/
│   ├── esteganografia.py
│   ├── main.py
│   └── requirements.txt
│
└── index.html
```

## 🔒 Como Funciona

O projeto utiliza a técnica LSB (Least Significant Bit) para esconder mensagens em imagens:

1. **Codificação:**
   - Converte a mensagem em binário
   - Modifica o bit menos significativo de cada canal RGB dos pixels
   - Adiciona um delimitador especial para marcar o fim da mensagem

2. **Decodificação:**
   - Extrai os bits menos significativos dos pixels
   - Procura pelo delimitador para encontrar o fim da mensagem
   - Converte os bits de volta para texto

## 🚀 Uso

1. Acesse o [site do projeto](https://raulneto-2810.github.io/esteganografia_imagens/)
2. Para esconder uma mensagem:
   - Selecione uma imagem PNG
   - Digite sua mensagem secreta
   - Clique em "Codificar Mensagem"
   - Faça o download da imagem resultante

3. Para ler uma mensagem:
   - Selecione uma imagem que contenha uma mensagem oculta
   - Clique em "Extrair Mensagem"
   - A mensagem secreta será exibida na tela

## 📝 Notas

- Use apenas imagens PNG
- O tamanho da mensagem é limitado pelo tamanho da imagem
- A qualidade visual da imagem é preservada
- Não é possível recuperar mensagens de imagens que foram comprimidas ou modificadas
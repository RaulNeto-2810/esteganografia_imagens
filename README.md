# 🖼️ Esteganografia em Imagens

Projeto de esteganografia que permite esconder e recuperar mensagens secretas em imagens PNG usando a técnica LSB (Least Significant Bit).

## 🌐 Links

- **GitHub:** [https://github.com/RaulNeto-2810/esteganografia_imagens](https://github.com/RaulNeto-2810/esteganografia_imagens)
- **Site:** [#](#)

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
- JavaScript puro
- Técnica LSB para manipulação de pixels

### Backend
- Python com Flask
- Biblioteca Pillow (PIL)

## 📦 Estrutura do Projeto

```
/
├── app/
│   ├── __init__.py        # Configuração do Flask
│   └── esteganografia.py  # Lógica de esteganografia e rotas
├── static/
│   ├── css/
│   │   └── styles.css     # Estilos da aplicação
│   └── js/
│       └── script.js      # Lógica do frontend
├── templates/
│   └── index.html         # Template principal
├── main.py               # Ponto de entrada da aplicação
├── requirements.txt      # Dependências Python
└── vercel.json          # Configuração do Vercel
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

1. Acesse o [site do projeto](#)
2. Para esconder uma mensagem:
   - Clique em "Inserir Mensagem"
   - Selecione uma imagem PNG
   - Digite sua mensagem secreta
   - Clique em "Codificar Mensagem"
   - Baixe a imagem resultante

3. Para ler uma mensagem:
   - Selecione uma imagem que contenha uma mensagem oculta
   - Clique em "Extrair Mensagem"
   - A mensagem secreta será exibida na tela

## 📝 Notas

- Use apenas imagens PNG
- O tamanho da mensagem é limitado pelo tamanho da imagem
- A qualidade visual da imagem é preservada
- Não é possível recuperar mensagens de imagens que foram comprimidas ou modificadas

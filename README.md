# Esteganografia em Imagens

Uma aplicação web para ocultar mensagens em imagens usando esteganografia. A aplicação funciona diretamente no navegador, sem necessidade de servidor.

## 🌐 Acesse a Aplicação

Você pode acessar a aplicação em: https://[seu-usuario].github.io/esteganografia-imagens/

## 💡 Como Usar

1. Para esconder uma mensagem em uma imagem:
   - Clique em "Selecione uma imagem (PNG)"
   - Digite sua mensagem secreta
   - Clique em "Codificar Mensagem"
   - Use o botão "Baixar Imagem" para salvar a imagem com a mensagem oculta

2. Para ler uma mensagem oculta:
   - Clique em "Selecione uma imagem"
   - Clique em "Extrair Mensagem"
   - A mensagem oculta será exibida na caixa de texto abaixo

## 🔧 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- Canvas API

## 📝 Sobre o Projeto

Este projeto implementa esteganografia em imagens usando a técnica LSB (Least Significant Bit), que altera o bit menos significativo de cada pixel para armazenar a mensagem. A implementação é feita inteiramente em JavaScript, usando a API Canvas para manipulação de imagens.

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/[seu-usuario]/esteganografia-imagens.git
```

2. Abra o arquivo `index.html` em seu navegador
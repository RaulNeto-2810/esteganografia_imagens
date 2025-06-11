/**
 * Constantes para elementos da UI
 */
const DOM = {
  // Elementos de navegação
  abasTela: document.querySelectorAll(".aba-tela"),
  secoes: document.querySelectorAll(".secao-codificar, .secao-decodificar"),

  // Elementos da seção de codificação
  codificar: {
    form: document.getElementById("form-codificar"),
    inputImagem: document.getElementById("imagem-codificar"),
    preview: document.getElementById("preview-codificar"),
    inputMensagem: document.getElementById("mensagem-secreta"),
    btnDownload: document.getElementById("btn-download"),
  },

  // Elementos da seção de decodificação
  decodificar: {
    form: document.getElementById("form-decodificar"),
    inputImagem: document.getElementById("imagem-decodificar"),
    preview: document.getElementById("preview-decodificar"),
    outputMensagem: document.getElementById("mensagem-decodificada"),
    containerResultado: document.getElementById("container-resultado"),
  },
};

/**
 * Gerenciamento de navegação
 */
const Navegacao = {
  /**
   * Alterna entre as telas de codificação e decodificação
   * @param {string} idTela - ID da tela a ser mostrada ('codificar' ou 'decodificar')
   */
  alternarTela(idTela) {
    // Remove a classe active de todas as tabs e seções
    DOM.abasTela.forEach((aba) => aba.classList.remove("active"));
    DOM.secoes.forEach((secao) => secao.classList.remove("active"));

    // Ativa a aba e seção selecionadas
    document
      .querySelector(`[data-tela="${idTela}"]`)
      .classList.add("active");
    document.querySelector(`.secao-${idTela}`).classList.add("active");
  },

  /**
   * Inicializa os eventos de navegação
   */
  init() {
    DOM.abasTela.forEach((aba) => {
      aba.addEventListener("click", () =>
        this.alternarTela(aba.dataset.tela)
      );
    });
  },
};

/**
 * Manipulação de imagens
 */
const ManipuladorImagem = {
  /**
   * Mostra preview da imagem selecionada
   * @param {HTMLInputElement} input - Input de arquivo
   * @param {HTMLImageElement} elementoPreview - Elemento de preview
   */
  mostrarPreview(input, elementoPreview) {
    if (input.files && input.files[0]) {
      const leitor = new FileReader();

      leitor.onload = (e) => {
        elementoPreview.style.display = "block";
        elementoPreview.src = e.target.result;
      };

      leitor.readAsDataURL(input.files[0]);
    }
  },
};

/**
 * Operações de esteganografia
 */
const OperacoesEsteganografia = {
  /**
   * Processa a codificação da mensagem na imagem
   * @param {Event} e - Evento do form
   */
  async processarCodificacao(e) {
    e.preventDefault();

    try {
      const arquivoImagem = DOM.codificar.inputImagem.files[0];
      const mensagem = DOM.codificar.inputMensagem.value;

      if (!arquivoImagem) throw new Error("Por favor, selecione uma imagem");
      if (!mensagem) throw new Error("Por favor, digite uma mensagem");

      const dadosForm = new FormData();
      dadosForm.append('image', arquivoImagem);
      dadosForm.append('message', mensagem);

      const resposta = await fetch('/encode', {
        method: 'POST',
        body: dadosForm
      });

      if (!resposta.ok) {
        const dados = await resposta.json();
        throw new Error(dados.error || 'Erro ao codificar mensagem');
      }

      const blob = await resposta.blob();
      const url = window.URL.createObjectURL(blob);

      this.configurarDownload(url);
      alert("Mensagem codificada com sucesso!");
    } catch (erro) {
      alert(erro.message);
    }
  },

  /**
   * Configura o botão de download
   * @param {string} url - URL do blob da imagem codificada
   */
  configurarDownload(url) {
    DOM.codificar.btnDownload.removeAttribute("disabled");
    DOM.codificar.btnDownload.onclick = () => {
      const link = document.createElement("a");
      link.href = url;
      link.download = "imagem_com_mensagem.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };
  },

  /**
   * Processa a decodificação da mensagem da imagem
   * @param {Event} e - Evento do form
   */
  async processarDecodificacao(e) {
    e.preventDefault();

    try {
      const arquivoImagem = DOM.decodificar.inputImagem.files[0];
      if (!arquivoImagem) throw new Error("Por favor, selecione uma imagem");

      const dadosForm = new FormData();
      dadosForm.append('image', arquivoImagem);

      const resposta = await fetch('/decode', {
        method: 'POST',
        body: dadosForm
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.error || 'Erro ao decodificar mensagem');
      }

      DOM.decodificar.containerResultado.classList.remove("oculto");
      DOM.decodificar.outputMensagem.value = dados.message;
    } catch (erro) {
      alert(erro.message);
    }
  },
};

/**
 * Inicialização da aplicação
 */
function inicializarApp() {
  // Inicializa navegação
  Navegacao.init();

  // Eventos de preview de imagem
  DOM.codificar.inputImagem.addEventListener("change", () =>
    ManipuladorImagem.mostrarPreview(DOM.codificar.inputImagem, DOM.codificar.preview)
  );
  DOM.decodificar.inputImagem.addEventListener("change", () =>
    ManipuladorImagem.mostrarPreview(DOM.decodificar.inputImagem, DOM.decodificar.preview)
  );

  // Eventos de formulário
  DOM.codificar.form.addEventListener("submit", (e) =>
    OperacoesEsteganografia.processarCodificacao(e)
  );
  DOM.decodificar.form.addEventListener("submit", (e) =>
    OperacoesEsteganografia.processarDecodificacao(e)
  );
}

// Inicia a aplicação
document.addEventListener('DOMContentLoaded', inicializarApp);

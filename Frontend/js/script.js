/**
 * Constantes para elementos da UI
 */
const DOM = {
  // Elementos de navegação
  screenTabs: document.querySelectorAll(".screen-tab"),
  sections: document.querySelectorAll(".encode-section, .decode-section"),

  // Elementos da seção de codificação
  encode: {
    form: document.getElementById("encode-form"),
    imageInput: document.getElementById("encode-image"),
    preview: document.getElementById("encode-preview"),
    messageInput: document.getElementById("secret-message"),
    downloadBtn: document.getElementById("download-btn"),
  },

  // Elementos da seção de decodificação
  decode: {
    form: document.getElementById("decode-form"),
    imageInput: document.getElementById("decode-image"),
    preview: document.getElementById("decode-preview"),
    messageOutput: document.getElementById("decoded-message"),
    resultContainer: document.getElementById("result-container"),
  },
};

/**
 * Gerenciamento de navegação
 */
const Navigation = {
  /**
   * Alterna entre as telas de codificação e decodificação
   * @param {string} screenId - ID da tela a ser mostrada ('encode' ou 'decode')
   */
  switchScreen(screenId) {
    // Remove a classe active de todas as tabs e seções
    DOM.screenTabs.forEach((tab) => tab.classList.remove("active"));
    DOM.sections.forEach((section) => section.classList.remove("active"));

    // Ativa a tab e seção selecionadas
    document
      .querySelector(`[data-screen="${screenId}"]`)
      .classList.add("active");
    document.querySelector(`.${screenId}-section`).classList.add("active");
  },

  /**
   * Inicializa os eventos de navegação
   */
  init() {
    DOM.screenTabs.forEach((tab) => {
      tab.addEventListener("click", () =>
        this.switchScreen(tab.dataset.screen)
      );
    });
  },
};

/**
 * Manipulação de imagens
 */
const ImageHandler = {
  /**
   * Mostra preview da imagem selecionada
   * @param {HTMLInputElement} input - Input de arquivo
   * @param {HTMLImageElement} previewElement - Elemento de preview
   */
  showPreview(input, previewElement) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        previewElement.style.display = "block";
        previewElement.src = e.target.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  },
};

/**
 * Operações de esteganografia
 */
const SteganographyOperations = {
  /**
   * Processa a codificação da mensagem na imagem
   * @param {Event} e - Evento do form
   */
  async handleEncode(e) {
    e.preventDefault();

    try {
      const imageFile = DOM.encode.imageInput.files[0];
      const message = DOM.encode.messageInput.value;

      if (!imageFile) throw new Error("Por favor, selecione uma imagem");
      if (!message) throw new Error("Por favor, digite uma mensagem");

      const encodedImageBlob = await Steganography.encode(imageFile, message);
      const url = window.URL.createObjectURL(encodedImageBlob);

      this.setupDownload(url);
      alert("Mensagem codificada com sucesso!");
    } catch (error) {
      alert(error.message);
    }
  },

  /**
   * Configura o botão de download
   * @param {string} url - URL do blob da imagem codificada
   */
  setupDownload(url) {
    DOM.encode.downloadBtn.removeAttribute("disabled");
    DOM.encode.downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "imagem_com_mensagem.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };
  },

  /**
   * Processa a decodificação da mensagem da imagem
   * @param {Event} e - Evento do form
   */
  async handleDecode(e) {
    e.preventDefault();

    try {
      const imageFile = DOM.decode.imageInput.files[0];
      if (!imageFile) throw new Error("Por favor, selecione uma imagem");

      const message = await Steganography.decode(imageFile);
      if (!message) throw new Error("Nenhuma mensagem encontrada na imagem");

      DOM.decode.resultContainer.classList.remove("hidden");
      DOM.decode.messageOutput.value = message;
    } catch (error) {
      alert(error.message);
    }
  },
};

/**
 * Inicialização da aplicação
 */
function initializeApp() {
  // Inicializa navegação
  Navigation.init();

  // Eventos de preview de imagem
  DOM.encode.imageInput.addEventListener("change", () =>
    ImageHandler.showPreview(DOM.encode.imageInput, DOM.encode.preview)
  );
  DOM.decode.imageInput.addEventListener("change", () =>
    ImageHandler.showPreview(DOM.decode.imageInput, DOM.decode.preview)
  );

  // Eventos de formulário
  DOM.encode.form.addEventListener("submit", (e) =>
    SteganographyOperations.handleEncode(e)
  );
  DOM.decode.form.addEventListener("submit", (e) =>
    SteganographyOperations.handleDecode(e)
  );
}

// Inicia a aplicação
initializeApp();
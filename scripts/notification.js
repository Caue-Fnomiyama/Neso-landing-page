const notificacoesData = [
  { nome: "Rafael Santos", valor: 999.99 },
  { nome: "Mariana", valor: 1250.0 },
  { nome: "Felipe", valor: 780.5 },
  { nome: "Ana Souza", valor: 499.9 },
  { nome: "Lucas", valor: 2100.0 },
  { nome: "Carla Dias", valor: 1150.75 },
  { nome: "Gustavo Silva", valor: 880.0 },
  { nome: "Paula Mendes", valor: 1450.2 },
  { nome: "Roberto Alves", valor: 670.45 },
  { nome: "Sofia", valor: 1999.99 },
];

const toggleBtn = document.getElementById("toggleView");
const totalAmount = document.getElementById("totalValue");
const instructText = document.getElementById("instruct");
const notifContainer = document.getElementById("notifContainer");

let isViewable = false;
let currentTotal = 500.0;
let notifIndex = 0;
let streamInterval;

const formatarMoeda = (valor) => {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Curva de Easing (Desaceleração suave estilo iOS)
const easeOutExpo = (x) => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

// Animação do Número a 120Hz usando requestAnimationFrame
const animarNumero = (start, end, duration) => {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    // Aplica a física do iOS na progressão
    const easeProgress = easeOutExpo(progress);
    const current = start + easeProgress * (end - start);

    if (isViewable) {
      totalAmount.innerText = formatarMoeda(current);
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Garante o valor exato no final
      if (isViewable) totalAmount.innerText = formatarMoeda(end);
    }
  };

  window.requestAnimationFrame(step);
};

toggleBtn.addEventListener("click", () => {
  isViewable = !isViewable;
  toggleBtn.classList.toggle("eye-open");

  if (isViewable) {
    totalAmount.classList.remove("blurred");
    totalAmount.innerText = formatarMoeda(currentTotal);
    instructText.innerText = "Observando dinheiro recuperado via Neso →";

    if (!streamInterval && notifIndex < notificacoesData.length) {
      iniciarStreamDePagamentos();
    }
  } else {
    totalAmount.classList.add("blurred");
    instructText.innerText =
      "Clique no olho para ver seu dinheiro recuperado →";
  }
});

const criarNotificacaoHTML = (nome, valor) => {
  const card = document.createElement("div");
  card.classList.add("notification-card");

  card.innerHTML = `
        <div class="notif-icon">
            <img
          id="logoPrincipal"
          src="media/logo_NESO.svg"
          alt="Neso"
          class="logo"
        />
        </div>
        <div class="notif-body">
            <span class="notif-title">Pagamento Recebido</span>
            <span class="notif-text">Você recebeu <span class="notif-amount">${formatarMoeda(valor)}</span> de <span class="notif-name">${nome}</span>.</span>
        </div>
    `;

  setTimeout(() => {
    card.remove();
  }, 7000);

  return card;
};

const iniciarStreamDePagamentos = () => {
  const adicionarPagamento = () => {
    if (notifIndex >= notificacoesData.length) {
      clearInterval(streamInterval);
      return;
    }

    const dados = notificacoesData[notifIndex];
    const notifCard = criarNotificacaoHTML(dados.nome, dados.valor);

    notifContainer.prepend(notifCard);

    const novoTotal = currentTotal + dados.valor;

    if (isViewable) {
      // Efeito de "respiração" (pulse) sutil nativo
      totalAmount.style.transition =
        "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)";
      totalAmount.style.transform = "scale(1.02)";

      // Chama o odômetro liso de 800ms
      animarNumero(currentTotal, novoTotal, 800);

      setTimeout(() => {
        totalAmount.style.transform = "scale(1)";
      }, 150);
    }

    currentTotal = novoTotal;
    notifIndex++;
  };

  adicionarPagamento();
  streamInterval = setInterval(adicionarPagamento, 3500);
};


const API = "http://localhost:3000/medicoes";

let graficoTemperatura;
let graficoUmidade;
let graficoLuminosidade;

let medicoesAtuais = [];
let modoIndicadores = "ultima";

function criarGrafico(id, nome, cor) {
  const canvas = document.getElementById(id);

  return new Chart(canvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: nome,
        data: [],
        borderColor: cor,
        backgroundColor: cor + "20",
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

function iniciarGraficos() {
  graficoTemperatura = criarGrafico(
    "graficoTemperatura",
    "Temperatura (°C)",
    "#ef4444"
  );

  graficoUmidade = criarGrafico(
    "graficoUmidade",
    "Umidade (%)",
    "#3b82f6"
  );

  graficoLuminosidade = criarGrafico(
    "graficoLuminosidade",
    "Luminosidade",
    "#eab308"
  );
}

function atualizarGrafico(grafico, labels, valores) {
  grafico.data.labels = labels;
  grafico.data.datasets[0].data = valores;
  grafico.update();
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR");
}

function calcularMedia(medicoes, campo) {
  if (medicoes.length === 0) return 0;

  const soma = medicoes.reduce(
    (total, medicao) => total + Number(medicao[campo]),
    0
  );

  return soma / medicoes.length;
}

function atualizarIndicadores() {
  if (medicoesAtuais.length === 0) {
    document.getElementById("temperatura").textContent = "-- °C";
    document.getElementById("umidade").textContent = "-- %";
    document.getElementById("luminosidade").textContent = "--";
    return;
  }

  let temperatura;
  let umidade;
  let luminosidade;

  if (modoIndicadores === "media") {
    temperatura = calcularMedia(medicoesAtuais, "temperatura");
    umidade = calcularMedia(medicoesAtuais, "umidade");
    luminosidade = calcularMedia(medicoesAtuais, "luminosidade");
  } else {
    const ultima = medicoesAtuais[medicoesAtuais.length - 1];

    temperatura = Number(ultima.temperatura);
    umidade = Number(ultima.umidade);
    luminosidade = Number(ultima.luminosidade);
  }

  document.getElementById("temperatura").textContent =
    temperatura.toFixed(1) + " °C";

  document.getElementById("umidade").textContent =
    umidade.toFixed(1) + " %";

  document.getElementById("luminosidade").textContent =
    luminosidade.toFixed(0);
}

function alterarModo(modo) {
  modoIndicadores = modo;

  document.getElementById("btnUltima").classList.toggle(
    "ativo",
    modo === "ultima"
  );

  document.getElementById("btnMedia").classList.toggle(
    "ativo",
    modo === "media"
  );

  atualizarIndicadores();
}

async function carregarMedicoes() {
  const status = document.getElementById("status");

  try {
    const resposta = await fetch(API, {
      method: "GET",
      cache: "no-store"
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const medicoes = await resposta.json();

    if (!Array.isArray(medicoes)) {
      throw new Error("Formato de dados invalido");
    }

    medicoes.sort((a, b) => {
      const diferenca = new Date(a.data) - new Date(b.data);
      return diferenca || a.id - b.id;
    });

    medicoesAtuais = medicoes;

    atualizarIndicadores();

    const labels = medicoes.map(m =>
      new Date(m.data).toLocaleTimeString("pt-BR")
    );

    atualizarGrafico(
      graficoTemperatura,
      labels,
      medicoes.map(m => Number(m.temperatura))
    );

    atualizarGrafico(
      graficoUmidade,
      labels,
      medicoes.map(m => Number(m.umidade))
    );

    atualizarGrafico(
      graficoLuminosidade,
      labels,
      medicoes.map(m => Number(m.luminosidade))
    );

    const tabela = document.getElementById("tabelaMedicoes");

    tabela.innerHTML = "";

    [...medicoes].reverse().forEach(m => {
      const linha = document.createElement("tr");

      const valores = [
        formatarData(m.data),
        Number(m.temperatura).toFixed(1) + " °C",
        Number(m.umidade).toFixed(1) + " %",
        Number(m.luminosidade).toFixed(0)
      ];

      valores.forEach(valor => {
        const celula = document.createElement("td");
        celula.textContent = valor;
        linha.appendChild(celula);
      });

      tabela.appendChild(linha);
    });

    if (medicoes.length === 0) {
      status.textContent = "Sem medições";
      status.classList.remove("online");
      return;
    }

    const ultima = medicoes[medicoes.length - 1];

    const idade =
      Date.now() - new Date(ultima.data).getTime();

    if (idade >= 0 && idade < 120000) {
      status.textContent = "Recebendo dados";
      status.classList.add("online");
    } else {
      status.textContent = "Sem dados recentes";
      status.classList.remove("online");
    }

  } catch (erro) {
    console.error("Erro ao carregar medições:", erro);

    status.textContent = "Erro de conexão";
    status.classList.remove("online");
  }
}

document.getElementById("btnUltima").addEventListener("click", () => {
  alterarModo("ultima");
});

document.getElementById("btnMedia").addEventListener("click", () => {
  alterarModo("media");
});

iniciarGraficos();
carregarMedicoes();

setInterval(carregarMedicoes, 10000);

const btnAtualizar = document.getElementById("btnAtualizar");

btnAtualizar.addEventListener("click", async () => {
  btnAtualizar.disabled = true;
  btnAtualizar.textContent = "Atualizando...";

  try {
    await carregarMedicoes();
  } finally {
    btnAtualizar.disabled = false;
    btnAtualizar.textContent = "↻ Atualizar dados";
  }
});
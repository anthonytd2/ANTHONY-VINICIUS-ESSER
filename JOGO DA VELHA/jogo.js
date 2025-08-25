let tabuleiro = ["", "", "", "", "", "", "", "", ""];
let jogoAtivo = true;
const jogadorHumano = "X";
const jogadorIA = "O";

const combinacoesVitoriosas = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function verificarVencedor(tabuleiro, jogador) {
  return combinacoesVitoriosas.some((combinacao) => {
    return combinacao.every((indice) => tabuleiro[indice] === jogador);
  });
}

function verificarEmpate(tabuleiro) {
  return tabuleiro.every((celula) => celula !== "");
}

function reiniciarJogo() {
  tabuleiro = ["", "", "", "", "", "", "", "", ""];
  jogoAtivo = true;
  document.querySelectorAll(".celula").forEach((celula) => {
    celula.innerText = "";
  });
}

function minimax(tabuleiro, jogador) {
  if (verificarVencedor(tabuleiro, jogadorIA)) {
    return { score: 10 };
  } else if (verificarVencedor(tabuleiro, jogadorHumano)) {
    return { score: -10 };
  } else if (verificarEmpate(tabuleiro)) {
    return { score: 0 };
  }

  const jogadas = [];
  for (let i = 0; i < tabuleiro.length; i++) {
    if (tabuleiro[i] === "") {
      const jogada = {};
      jogada.indice = i;
      tabuleiro[i] = jogador;

      if (jogador === jogadorIA) {
        const resultado = minimax(tabuleiro, jogadorHumano);
        jogada.score = resultado.score;
      } else {
        const resultado = minimax(tabuleiro, jogadorIA);
        jogada.score = resultado.score;
      }

      tabuleiro[i] = "";
      jogadas.push(jogada);
    }
  }

  let melhorJogada;
  if (jogador === jogadorIA) {
    let melhorPontuacao = -Infinity;
    for (const jogada of jogadas) {
      if (jogada.score > melhorPontuacao) {
        melhorPontuacao = jogada.score;
        melhorJogada = jogada;
      }
    }
  } else {
    let melhorPontuacao = Infinity;
    for (const jogada of jogadas) {
      if (jogada.score < melhorPontuacao) {
        melhorPontuacao = jogada.score;
        melhorJogada = jogada;
      }
    }
  }
  return melhorJogada;
}

document.addEventListener("DOMContentLoaded", () => {
  const celulas = document.querySelectorAll(".celula");
  celulas.forEach((celula) => {
    celula.addEventListener("click", jogarHumano);
  });

  document.getElementById("reiniciar").addEventListener("click", reiniciarJogo);
});

function jogarHumano(event) {
  const indice = event.target.id;

  if (jogoAtivo && tabuleiro[indice] === "") {
    tabuleiro[indice] = jogadorHumano;
    document.getElementById(indice).innerText = jogadorHumano;

    if (verificarVencedor(tabuleiro, jogadorHumano)) {
      alert("Você venceu!");
      jogoAtivo = false;
    } else if (verificarEmpate(tabuleiro)) {
      alert("Empate!");
      jogoAtivo = false;
    } else {
      jogadaIA();
    }
  }
}

function jogadaIA() {
  if (!jogoAtivo) return;

  const melhorJogada = minimax(tabuleiro, jogadorIA);
  tabuleiro[melhorJogada.indice] = jogadorIA;
  document.getElementById(melhorJogada.indice).innerText = jogadorIA;

  setTimeout(() => {
    if (verificarVencedor(tabuleiro, jogadorIA)) {
      alert("A IA venceu!");
      jogoAtivo = false;
    } else if (verificarEmpate(tabuleiro)) {
      alert("Empate!");
      jogoAtivo = false;
    }
  }, 10);
}

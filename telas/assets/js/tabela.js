/*
 * tabela.js - busca e paginação de qualquer tabela.
 * Serve para todas as telas de listagem.
 */
const LINHAS_POR_PAGINA = 10;
let paginaAtual = 1;

const campoBusca = document.getElementById("campoBusca");
const infoPaginas = document.getElementById("infoPaginas");
const btnAnterior = document.getElementById("btnAnterior");
const btnProxima = document.getElementById("btnProxima");
const linhaVazia = document.getElementById("linhaVazia");

// Pega os dados da tabela e guarda num array
const todasAsLinhas = Array.from(document.querySelectorAll("#tabela tbody tr.linha"));


// CPF e telefone.
document.querySelectorAll(".cpf").forEach(function (celula) {
    const n = celula.textContent.trim();
    if (n.length === 11) {
        celula.textContent = n.slice(0, 3) + "." + n.slice(3, 6) + "." + n.slice(6, 9) + "-" + n.slice(9);
    }
});

document.querySelectorAll(".telefone").forEach(function (celula) {
    const n = celula.textContent.trim();
    if (n.length === 11) {
        celula.textContent = "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
    } else if (n.length === 10) {
        celula.textContent = "(" + n.slice(0, 2) + ") " + n.slice(2, 6) + "-" + n.slice(6);
    }
});


let filtrosAplicados = new URLSearchParams();

function aplicarFiltros(parametros) {
    filtrosAplicados = parametros;
    paginaAtual = 1;
    mostrarTabela();
}

//  Busca
function limparTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const CAMPOS_EXATOS = ["propertyId", "herdId", "lotId", "category", "role", "clearedForSlaughter"];
const CAMPOS_LISTA = ["userIds"];
const CAMPOS_NUMEROS = ["cpf", "cnpj", "phone", "zipCode"];

function linhaPassaNosFiltros(linha, parametros) {
    const botao = linha.querySelector(".btn-editar");
    if (!botao) {
        return true;
    }

    for (const [nome, valorFiltro] of parametros) {
        const filtro = valorFiltro.trim();
        const valorLinha = botao.dataset[nome];

        if (filtro === "" || valorLinha === undefined) {
            continue;
        }

        if (CAMPOS_LISTA.includes(nome)) {
            if (!valorLinha.split(",").includes(filtro)) {
                return false;
            }
        } else if (CAMPOS_EXATOS.includes(nome)) {
            if (valorLinha !== filtro) {
                return false;
            }
        } else if (CAMPOS_NUMEROS.includes(nome)) {
            if (!valorLinha.replace(/\D/g, "").includes(filtro.replace(/\D/g, ""))) {
                return false;
            }
        } else if (!limparTexto(valorLinha).includes(limparTexto(filtro))) {
            return false;
        }
    }
    return true;
}

function mostrarTabela() {
    const busca = limparTexto(campoBusca.value);
    const parametros = filtrosAplicados;

    const encontradas = todasAsLinhas.filter(function (linha) {
        return limparTexto(linha.textContent).includes(busca)
            && linhaPassaNosFiltros(linha, parametros);
    });

    const totalPaginas = Math.max(1, Math.ceil(encontradas.length / LINHAS_POR_PAGINA));
    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }

    const inicio = (paginaAtual - 1) * LINHAS_POR_PAGINA;
    const daPagina = encontradas.slice(inicio, inicio + LINHAS_POR_PAGINA);

    todasAsLinhas.forEach(function (linha) {
        linha.hidden = true;
    });
    daPagina.forEach(function (linha) {
        linha.hidden = false;
    });

    linhaVazia.hidden = encontradas.length > 0;

    if (encontradas.length === 0) {
        infoPaginas.textContent = "Nenhum resultado encontrado";
    } else {
        infoPaginas.textContent = "Mostrando " + (inicio + 1) + "-" + (inicio + daPagina.length) +
                                  " de " + encontradas.length;
    }
    btnAnterior.disabled = paginaAtual <= 1;
    btnProxima.disabled = paginaAtual >= totalPaginas;
}

//  Ligar os botões
campoBusca.addEventListener("input", function () {
    paginaAtual = 1;
    mostrarTabela();
});

btnAnterior.addEventListener("click", function () {
    paginaAtual = paginaAtual - 1;
    mostrarTabela();
});

btnProxima.addEventListener("click", function () {
    paginaAtual = paginaAtual + 1;
    mostrarTabela();
});

mostrarTabela();

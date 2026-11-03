/*
 * popup.js - abre e fecha pop-ups e reabre o pop-up
 */

//  Abrir um pop-up
function abrirPopup(botao) {
    const popup = document.getElementById(botao.dataset.abrir);
    const formulario = popup.querySelector("form");

    // Limpa o que foi digitado da última vez que o pop-up abriu
    // não limpa campos escondidos
    formulario.reset();

    formulario.querySelectorAll("input[type=hidden]").forEach(function (campo) {
        if (campo.dataset.original === undefined) {
            campo.dataset.original = campo.value;
        }
        campo.value = campo.dataset.original;
    });

    // Campos "pesquisar e selecionar" começam vazios
    popup.querySelectorAll("[data-pesquisa]").forEach(function (caixa) {
        caixa.pesquisaLimpar();
    });

    for (const nome in botao.dataset) {
        const valor = botao.dataset[nome];

        if (formulario.elements[nome]) {
            formulario.elements[nome].value = valor;
        }

        if (nome === "idProperty") {
            formulario.querySelectorAll("[data-property-user-ids]").forEach(function (campo) {
                campo.disabled = campo.dataset.propertyUserIds !== valor;
            });
        }

        const textos = popup.querySelectorAll('[data-mostrar="' + nome + '"]');
        textos.forEach(function (texto) {
            texto.textContent = valor;
        });
    }

    popup.querySelectorAll("[data-pesquisa]").forEach(function (caixa) {
        const chave = caixa.dataset.name;
        if (caixa.hasAttribute("data-varios")) {
            const ids = (botao.dataset[chave] || "").split(",").filter(function (id) { return id !== ""; });
            caixa.pesquisaDefinir(ids);
        } else {
            caixa.pesquisaSincronizar();
        }
    });

    if (botao.dataset.action) {
        formulario.action = botao.dataset.action;
    }

    if (botao.dataset.titulo) {
        popup.querySelector("h2").textContent = botao.dataset.titulo;
    }

    if (botao.dataset.botao) {
        popup.querySelector("button[type=submit]").textContent = botao.dataset.botao;
    }

    const editando = botao.dataset.acao === "editar";
    popup.querySelectorAll("[data-so-cadastro]").forEach(function (caixa) {
        caixa.hidden = editando;
        caixa.querySelectorAll("input, select").forEach(function (campo) {
            campo.disabled = editando;
        });
    });

    // Senha: obrigatória no cadastro
    popup.querySelectorAll("[data-senha]").forEach(function (campo) {
        campo.required = !editando;
        campo.placeholder = editando ? "Deixe em branco para manter a senha atual" : (campo.dataset.placeholderCadastro || "");
    });
    popup.querySelectorAll("[data-senha-rotulo]").forEach(function (rotulo) {
        rotulo.textContent = editando ? "Nova senha (opcional)" : "Senha";
    });

    popup.showModal();
}

function reabrirComErro(caixaValores) {
    const valores = {};
    caixaValores.querySelectorAll("[data-nome]").forEach(function (item) {
        (valores[item.dataset.nome] = valores[item.dataset.nome] || []).push(item.dataset.valor);
    });

    // Erro numa exclusão ou reativação, só o aviso aparece
    if (location.pathname.endsWith("/delete") || location.pathname.endsWith("/reactivate")) {
        return;
    }

    const editando = location.pathname.endsWith("/edit");
    let botao = null;

    if (editando) {
        const popupEdicao = document.querySelector("dialog.modal:not(#modalExcluir)");
        const campoId = popupEdicao && popupEdicao.querySelector('form input[type=hidden][name^="id"]');
        const idEditado = campoId && valores[campoId.name] ? valores[campoId.name][0] : null;
        botao = Array.from(document.querySelectorAll(".btn-editar")).find(function (candidato) {
            return campoId && idEditado && candidato.dataset[campoId.name] === idEditado;
        });
    } else {
        botao = document.querySelector('[data-abrir][data-acao="criar"]');
    }

    if (!botao) {
        return;
    }

    abrirPopup(botao);

    const formulario = document.getElementById(botao.dataset.abrir).querySelector("form");
    Object.keys(valores).forEach(function (nome) {
        const caixa = formulario.querySelector('[data-pesquisa][data-name="' + nome + '"]');
        if (caixa) {
            if (caixa.hasAttribute("data-varios")) {
                caixa.pesquisaDefinir(valores[nome]);
            } else {
                caixa.pesquisaDefinir(valores[nome].slice(0, 1));
            }
            return;
        }
        const campo = formulario.elements[nome];
        if (campo && campo.type !== "password" && !(campo instanceof RadioNodeList)) {
            campo.value = valores[nome][0];
        }
    });
}

// Ouvir os cliques
document.addEventListener("click", function (evento) {
    const botaoAbrir = evento.target.closest("[data-abrir]");
    if (botaoAbrir) {
        abrirPopup(botaoAbrir);
        return;
    }

    const botaoFechar = evento.target.closest("[data-fechar]");
    if (botaoFechar) {
        botaoFechar.closest("dialog").close();
        return;
    }

    if (evento.target.tagName === "DIALOG") {
        evento.target.close();
    }
});

// Evita envio duplicado
document.addEventListener("submit", function (evento) {
    const formulario = evento.target;

    if (formulario.method.toLowerCase() !== "post") {
        return;
    }

    if (formulario.dataset.enviando === "true") {
        evento.preventDefault();
        return;
    }

    formulario.dataset.enviando = "true";
    formulario.querySelectorAll("button[type=submit]").forEach(function (botao) {
        botao.dataset.textoOriginal = botao.textContent;
        botao.disabled = true;
        botao.textContent = "Enviando...";
    });
});

window.addEventListener("pageshow", function (evento) {
    if (!evento.persisted) {
        return;
    }
    document.querySelectorAll("form[data-enviando]").forEach(function (formulario) {
        delete formulario.dataset.enviando;
        formulario.querySelectorAll("button[type=submit]").forEach(function (botao) {
            botao.disabled = false;
            if (botao.dataset.textoOriginal) {
                botao.textContent = botao.dataset.textoOriginal;
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const valoresErro = document.getElementById("valoresErro");
    if (valoresErro) {
        reabrirComErro(valoresErro);
    }
});

//  Aviso (toast)
const aviso = document.querySelector(".toast");
if (aviso) {
    const fecharAviso = function () {
        aviso.classList.add("saindo");
        setTimeout(function () { aviso.remove(); }, 300);
    };

    aviso.querySelector(".toast-fechar").addEventListener("click", fecharAviso);
    setTimeout(fecharAviso, 6000);
}
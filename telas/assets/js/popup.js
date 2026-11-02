//  Abrir um pop-up
function abrirPopup(botao) {
    const popup = document.getElementById(botao.dataset.abrir);
    const formulario = popup.querySelector("form");

    // Limpa o que foi digitado da última vez que o pop-up abriu, não limpa campos escondidos
    formulario.reset();

    formulario.querySelectorAll("input[type=hidden]").forEach(function (campo) {
        if (campo.dataset.original === undefined) {
            campo.dataset.original = campo.value;
        }
        campo.value = campo.dataset.original;
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

    popup.showModal();
}

// Cliques
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

const aviso = document.querySelector(".toast");

if (aviso) {
    const fecharAviso = function () {
        aviso.classList.add("saindo");
        setTimeout(function () { aviso.remove(); }, 300);
    };

    aviso.querySelector(".toast-fechar").addEventListener("click", fecharAviso);
    setTimeout(fecharAviso, 6000);
}
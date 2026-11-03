/*
 * carregamento.js - mostra a tela de carregamento
 */
(function () {
    const tela = document.getElementById("carregamento");
    if (!tela) {
        return;
    }

    let espera = null;
    let seguranca = null;

    function mostrar() {
        clearTimeout(espera);
        espera = setTimeout(function () {
            tela.classList.add("visivel");
            tela.setAttribute("aria-hidden", "false");
        }, 250);

        clearTimeout(seguranca);
        seguranca = setTimeout(esconder, 20000);
    }

    function esconder() {
        clearTimeout(espera);
        clearTimeout(seguranca);
        tela.classList.remove("visivel");
        tela.setAttribute("aria-hidden", "true");
    }

    // Clique em link interno
    document.addEventListener("click", function (evento) {
        const link = evento.target.closest("a[href]");
        if (!link || evento.defaultPrevented) {
            return;
        }
        if (evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
            return;
        }
        if ((link.target && link.target !== "_self") || link.hasAttribute("download")) {
            return;
        }

        const destino = new URL(link.href, location.href);
        const mesmaPagina = destino.pathname === location.pathname && destino.search === location.search;

        if (destino.origin !== location.origin || (mesmaPagina && destino.hash !== "")) {
            return;
        }
        mostrar();
    });

    // Envio de formulario
    document.addEventListener("submit", function (evento) {
        if (!evento.defaultPrevented) {
            mostrar();
        }
    });

    // Voltar/avancar do navegador
    window.addEventListener("pageshow", esconder);
})();

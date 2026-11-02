document.addEventListener("click", (evento) => {
    document.querySelectorAll("details.filtro[open]").forEach((filtro) => {
        if (!filtro.contains(evento.target)) {
            filtro.open = false;
        }
    });
});

document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape") {
        return;
    }

    document.querySelectorAll("details.filtro[open]").forEach((filtro) => {
        filtro.open = false;
        filtro.querySelector("summary").focus();
    });
});

document.querySelectorAll("details.filtro form").forEach((formulario) => {
    if (typeof aplicarFiltros !== "function") {
        return;
    }

    const filtro = formulario.closest("details.filtro");

    function aplicar(parametros) {
        const temFiltro = Array.from(parametros.values()).some((v) => v.trim() !== "");
        filtro.classList.toggle("filtro-ativo", temFiltro);
        filtro.open = false;
        aplicarFiltros(parametros);
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        aplicar(new URLSearchParams(new FormData(formulario)));
    });

    const botaoLimpar = formulario.querySelector(".filtro-acoes a");
    if (botaoLimpar) {
        botaoLimpar.addEventListener("click", (evento) => {
            evento.preventDefault();
            formulario.querySelectorAll("input, select").forEach((campo) => {
                campo.value = "";
            });
            aplicar(new URLSearchParams());
        });
    }
});

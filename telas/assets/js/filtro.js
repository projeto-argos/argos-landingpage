/*
 * filtro.js - botão Filtrar
 */
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

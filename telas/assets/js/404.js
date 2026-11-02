document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const raiz = document.documentElement;
    const botao = document.getElementById("tap");
    const titulo = document.getElementById("titulo");

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revelar() {
        raiz.classList.remove("conectando");
        raiz.classList.add("revelado");
        titulo.focus();
    }

    botao.addEventListener("click", () => {
        if (raiz.classList.contains("conectando") || raiz.classList.contains("revelado")) {
            return;
        }

        if (reduzMovimento) {
            revelar();
            return;
        }

        botao.textContent = "Conectando ao servidor...";
        botao.disabled = true;
        raiz.classList.add("conectando");

        setTimeout(revelar, 1200);
    });
});

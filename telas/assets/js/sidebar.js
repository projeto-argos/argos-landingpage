const html = document.documentElement;

function lerPreferencia(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (e) {
        return null;
    }
}

function salvarPreferencia(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (e) {}
}

if (lerPreferencia("argos-modo") === "escuro") {
    html.classList.add("dark");
}

const preferenciaSidebar = lerPreferencia("argos-sidebar");

if (preferenciaSidebar === "fechada") {
    html.classList.add("sb-fechada");
} else if (preferenciaSidebar === null && window.innerWidth < 1100) {
    html.classList.add("sb-fechada");
}

window.addEventListener("pageshow", (e) => {
    const nav = performance.getEntriesByType("navigation")[0];
    if (e.persisted || (nav && nav.type === "back_forward")) {
        location.reload();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const botaoToggle = document.querySelector(".sidebar .toggle");
    const botaoModo = document.querySelector(".sidebar .mode-btn");
    const textoModo = document.querySelector(".sidebar .mode-text");

    function atualizarTextoModo() {
        if (textoModo) {
            textoModo.textContent = html.classList.contains("dark")
                ? "Modo claro"
                : "Modo escuro";
        }
    }

    atualizarTextoModo();

    // Menu do celular
    const botaoMenu = document.querySelector(".menu-mobile");
    const botaoFecharMenu = document.querySelector(".sidebar .menu-fechar");
    const fundoMenu = document.querySelector(".sidebar-fundo");

    function abrirMenu(abrir) {
        html.classList.toggle("menu-aberto", abrir);

        if (botaoMenu) {
            botaoMenu.setAttribute("aria-expanded", abrir ? "true" : "false");
        }
    }

    if (botaoMenu) {
        botaoMenu.addEventListener("click", () => {
            abrirMenu(!html.classList.contains("menu-aberto"));
        });
    }

    if (botaoFecharMenu) {
        botaoFecharMenu.addEventListener("click", () => abrirMenu(false));
    }

    if (fundoMenu) {
        fundoMenu.addEventListener("click", () => abrirMenu(false));
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            abrirMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            abrirMenu(false);
        }
    });

    if (botaoToggle) {
        botaoToggle.addEventListener("click", () => {
            const fechada = html.classList.toggle("sb-fechada");

            salvarPreferencia(
                "argos-sidebar",
                fechada ? "fechada" : "aberta"
            );
        });
    }

    if (botaoModo) {
        botaoModo.addEventListener("click", () => {
            const escuro = html.classList.toggle("dark");

            salvarPreferencia(
                "argos-modo",
                escuro ? "escuro" : "claro"
            );

            atualizarTextoModo();
        });
    }
});
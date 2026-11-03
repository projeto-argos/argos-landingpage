/*
 * login.js - botão do olho
 */
const campoSenha = document.getElementById("senha");
const botaoOlho = document.getElementById("btnOlho");
const olhoAberto = document.getElementById("olhoAberto");
const olhoFechado = document.getElementById("olhoFechado");

botaoOlho.addEventListener("click", () => {
    const estavaEscondida = campoSenha.type === "password";

    campoSenha.type = estavaEscondida ? "text" : "password";
    olhoAberto.toggleAttribute("hidden", !estavaEscondida);   // senha visível
    olhoFechado.toggleAttribute("hidden", estavaEscondida);   // senha escondida
    botaoOlho.setAttribute("aria-label", estavaEscondida ? "Esconder senha" : "Mostrar senha");
});

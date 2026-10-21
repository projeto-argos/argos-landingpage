/* =====================================================================
   ARGOS | cadastro.js
   Front-end do cadastro: valida os campos -> envia para a API -> mostra
   o resultado -> leva para o login.
   ===================================================================== */

/* ---------- 1) CONFIGURAÇÕES (mexa só aqui) ---------- */
const API_URL = "http://localhost:8080/api/cadastro"; // rota de cadastro do seu backend
const PAGINA_DEPOIS_CADASTRO = "login.html";
const USAR_SIMULACAO = true;                          // true = testa sem servidor | false = usa a API
const TAMANHO_MIN_SENHA = 8;

/* ---------- 2) ELEMENTOS ---------- */
const form = document.getElementById("formCadastro");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const inputConfirmar = document.getElementById("confirmarSenha");
const btnCriar = document.getElementById("btnCriar");
const msgErro = document.getElementById("msgErro");

/* ---------- 3) MOSTRAR / ESCONDER SENHA (serve para os dois campos) ---------- */
document.querySelectorAll(".btn_olho").forEach(botao => {
    botao.addEventListener("click", () => {
        const campo = document.getElementById(botao.dataset.alvo);
        const vaiMostrar = campo.type === "password";
        campo.type = vaiMostrar ? "text" : "password";
        botao.querySelector(".olho_aberto").toggleAttribute("hidden", !vaiMostrar);
        botao.querySelector(".olho_fechado").toggleAttribute("hidden", vaiMostrar);
        botao.setAttribute("aria-label", vaiMostrar ? "Esconder senha" : "Mostrar senha");
    });
});

/* ---------- 4) AUXILIARES ---------- */
function mostrarMensagem(texto, campo, sucesso = false) {
    msgErro.textContent = texto;
    msgErro.classList.toggle("ok", sucesso);
    document.querySelectorAll(".campo_caixa").forEach(c => c.classList.remove("erro"));
    if (campo) campo.closest(".campo_caixa").classList.add("erro");
}

function validar(nome, email, senha, confirmar) {
    // Validação de conveniência: o servidor TEM que validar de novo.
    if (nome.length < 3) { mostrarMensagem("Informe seu nome completo.", inputNome); inputNome.focus(); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { mostrarMensagem("Digite um e-mail válido.", inputEmail); inputEmail.focus(); return false; }
    if (senha.length < TAMANHO_MIN_SENHA) {
        mostrarMensagem(`A senha precisa ter pelo menos ${TAMANHO_MIN_SENHA} caracteres.`, inputSenha); inputSenha.focus(); return false;
    }
    if (senha !== confirmar) { mostrarMensagem("As senhas não conferem.", inputConfirmar); inputConfirmar.focus(); return false; }
    return true;
}

/* ---------- 5) ENVIO PARA A API ---------- */
async function cadastrar(nome, email, senha) {

    if (USAR_SIMULACAO) {
        await new Promise(r => setTimeout(r, 700));
        if (email === "admin@argos.com") throw new Error("Este e-mail já está cadastrado.");
        return { ok: true };
    }

    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),   // não envia a confirmação
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        // ex.: 400 = dados inválidos, 409 = e-mail já existe
        throw new Error(dados.mensagem || "Não foi possível criar a conta. Tente novamente.");
    }
    return dados;
}

/* ---------- 6) SUBMIT ---------- */
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mostrarMensagem("");

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const senha = inputSenha.value;
    const confirmar = inputConfirmar.value;

    if (!validar(nome, email, senha, confirmar)) return;

    btnCriar.disabled = true;
    btnCriar.textContent = "Criando...";

    try {
        await cadastrar(nome, email, senha);
        mostrarMensagem("Conta criada! Redirecionando para o login...", null, true);
        setTimeout(() => { window.location.href = PAGINA_DEPOIS_CADASTRO; }, 1500);

    } catch (erro) {
        mostrarMensagem(erro.message);
        btnCriar.disabled = false;
        btnCriar.textContent = "Criar";
    }
});

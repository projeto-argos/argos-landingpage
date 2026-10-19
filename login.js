/* =====================================================================
   ARGOS | login.js
   Aqui fica a parte do FRONT-END da autenticação:
   pega o que a pessoa digitou -> valida -> manda para o servidor ->
   guarda o "token" que o servidor devolve -> leva para o painel.
   A verificação REAL da senha acontece no servidor (veja servidor-exemplo.js).
   ===================================================================== */

/* ---------- 1) CONFIGURAÇÕES (mexa só aqui) ---------- */
const API_URL = "http://localhost:8080/api/login"; // endereço da sua API
const PAGINA_DEPOIS_LOGIN = "entrada.html";        // para onde ir após logar
const USAR_SIMULACAO = true;                       // true = testa sem servidor | false = usa a API de verdade

/* ---------- 2) ELEMENTOS DA TELA ---------- */
const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const msgErro = document.getElementById("msgErro");
const btnOlho = document.getElementById("btnOlho");
const olhoAberto = document.getElementById("olhoAberto");
const olhoFechado = document.getElementById("olhoFechado");

/* ---------- 3) MOSTRAR / ESCONDER SENHA ---------- */
btnOlho.addEventListener("click", () => {
    const escondida = inputSenha.type === "password";
    inputSenha.type = escondida ? "text" : "password";
    olhoAberto.toggleAttribute("hidden", !escondida);   // senha visível -> olho aberto
    olhoFechado.toggleAttribute("hidden", escondida);   // senha escondida -> olho riscado
    btnOlho.setAttribute("aria-label", escondida ? "Esconder senha" : "Mostrar senha");
});

/* ---------- 4) FUNÇÕES AUXILIARES ---------- */
function mostrarErro(texto, campo) {
    msgErro.textContent = texto;
    document.querySelectorAll(".campo_caixa").forEach(c => c.classList.remove("erro"));
    if (campo) campo.closest(".campo_caixa").classList.add("erro");
}

function validar(email, senha) {
    // Validação de conveniência (o servidor VALIDA DE NOVO, nunca confie só no front)
    if (!email) { mostrarErro("Informe seu e-mail.", inputEmail); inputEmail.focus(); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { mostrarErro("Digite um e-mail válido.", inputEmail); inputEmail.focus(); return false; }
    if (!senha) { mostrarErro("Informe sua senha.", inputSenha); inputSenha.focus(); return false; }
    return true;
}

/* ---------- 5) A AUTENTICAÇÃO EM SI ---------- */
async function autenticar(email, senha) {

    // --- MODO SIMULAÇÃO: serve só para testar a tela sem backend ---
    if (USAR_SIMULACAO) {
        await new Promise(r => setTimeout(r, 700)); // finge que o servidor demorou
        if (email === "admin@argos.com" && senha === "123456") {
            return { token: "token-de-teste", usuario: { nome: "Administrador", cargo: "Admin" } };
        }
        throw new Error("E-mail ou senha incorretos.");
    }

    // --- MODO REAL: envia para a sua API ---
    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),   // vai no corpo, NUNCA na URL
        // credentials: "include",                // use se o servidor guardar o login em cookie httpOnly
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        // 401 = credenciais erradas, 400 = dados inválidos, 500 = erro do servidor
        throw new Error(dados.mensagem || "Não foi possível entrar. Tente novamente.");
    }

    return dados; // esperado: { token, usuario: { nome, cargo } }
}

/* ---------- 6) ENVIO DO FORMULÁRIO ---------- */
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();          // impede a página de recarregar
    mostrarErro("");                  // limpa erros antigos

    const email = inputEmail.value.trim();
    const senha = inputSenha.value;   // senha NÃO leva trim()

    if (!validar(email, senha)) return;

    btnEntrar.disabled = true;
    btnEntrar.textContent = "Entrando...";

    try {
        const { token, usuario } = await autenticar(email, senha);

        // 7) GUARDAR A SESSÃO
        // localStorage = simples e bom para aprender. Em produção, o mais seguro
        // é o servidor enviar um cookie httpOnly (o JS nem consegue ler).
        localStorage.setItem("argos_token", token);
        localStorage.setItem("argos_usuario", JSON.stringify(usuario));

        // 8) IR PARA O PAINEL
        window.location.href = PAGINA_DEPOIS_LOGIN;

    } catch (erro) {
        mostrarErro(erro.message, inputSenha);
        inputSenha.select();
        btnEntrar.disabled = false;
        btnEntrar.textContent = "Entrar";
    }
});

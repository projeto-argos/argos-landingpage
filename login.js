/* ===== CONFIGURAÇÕES ===== */
const API_URL = "http://localhost:8080/api/login"; 
const PAGINA_DEPOIS_LOGIN = "entrada.html";        
const USAR_SIMULACAO = true;                       

/* ===== ELEMENTOS DA TELA ===== */
const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const btnEntrar = document.getElementById("btnEntrar");
const msgErro = document.getElementById("msgErro");
const btnOlho = document.getElementById("btnOlho");
const olhoAberto = document.getElementById("olhoAberto");
const olhoFechado = document.getElementById("olhoFechado");

/* ===== MOSTRAR / ESCONDER SENHA ===== */
btnOlho.addEventListener("click", () => {
    const escondida = inputSenha.type === "password";
    inputSenha.type = escondida ? "text" : "password";
    olhoAberto.toggleAttribute("hidden", !escondida);   
    olhoFechado.toggleAttribute("hidden", escondida);   
    btnOlho.setAttribute("aria-label", escondida ? "Esconder senha" : "Mostrar senha");
});

/* ===== FUNÇÕES AUXILIARES ===== */
function mostrarErro(texto, campo) {
    msgErro.textContent = texto;
    document.querySelectorAll(".campo_caixa").forEach(c => c.classList.remove("erro"));
    if (campo) campo.closest(".campo_caixa").classList.add("erro");
}

function validar(email, senha) {
    if (!email) { mostrarErro("Informe seu e-mail.", inputEmail); inputEmail.focus(); return false; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { mostrarErro("Digite um e-mail válido.", inputEmail); inputEmail.focus(); return false; }
    if (!senha) { mostrarErro("Informe sua senha.", inputSenha); inputSenha.focus(); return false; }
    return true;
}

/* ===== A AUTENTICAÇÃO EM SI ===== */
async function autenticar(email, senha) {

    if (USAR_SIMULACAO) {
        await new Promise(r => setTimeout(r, 700)); 
        if (email === "admin@argos.com" && senha === "123456") {
            return { token: "token-de-teste", usuario: { nome: "Administrador", cargo: "Admin" } };
        }
        throw new Error("E-mail ou senha incorretos.");
    }

    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),   
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Não foi possível entrar. Tente novamente.");
    }

    return dados; 
}

/* ===== ENVIO DO FORMULÁRIO ===== */
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();          
    mostrarErro("");                  

    const email = inputEmail.value.trim();
    const senha = inputSenha.value;   

    if (!validar(email, senha)) return;

    btnEntrar.disabled = true;
    btnEntrar.textContent = "Entrando...";

    try {
        const { token, usuario } = await autenticar(email, senha);

        localStorage.setItem("argos_token", token);
        localStorage.setItem("argos_usuario", JSON.stringify(usuario));

        window.location.href = PAGINA_DEPOIS_LOGIN;

    } catch (erro) {
        mostrarErro(erro.message, inputSenha);
        inputSenha.select();
        btnEntrar.disabled = false;
        btnEntrar.textContent = "Entrar";
    }
});

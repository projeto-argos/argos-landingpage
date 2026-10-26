document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    const notificacao = document.getElementById('notificacao-sucesso');
    const botao = form ? form.querySelector('button[type="submit"]') : null;

    if (form && notificacao && botao) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const textoOriginal = botao.textContent;
            botao.textContent = 'Enviando...';
            botao.style.opacity = '0.6';
            botao.disabled = true;

            setTimeout(() => {
                botao.textContent = textoOriginal;
                botao.style.opacity = '1';
                botao.disabled = false;

                notificacao.classList.add('visivel');

                form.reset();

                setTimeout(() => {
                    notificacao.classList.remove('visivel');
                }, 5000);
            }, 2000);
        });
    }
});
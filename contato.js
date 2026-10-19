document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    const notificacao = document.getElementById('notificacao-sucesso');

    if (form && notificacao) {
        const botao = form.querySelector('button[type="submit"], button:not([type])');
        const textoOriginal = botao ? botao.textContent : '';

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            
            if (botao && botao.disabled) return;

            if (botao) {
                botao.disabled = true;
                botao.textContent = 'Enviando...';
                botao.style.opacity = '0.6';
                botao.style.cursor = 'not-allowed';
            }

            setTimeout(() => {
                notificacao.classList.add('visivel');

                form.reset();

                if (botao) {
                    botao.disabled = false;
                    botao.textContent = textoOriginal;
                    botao.style.opacity = '';
                    botao.style.cursor = '';
                }

                setTimeout(() => {
                    notificacao.classList.remove('visivel');
                }, 5000);
            }, 2000);
        });
    }
});
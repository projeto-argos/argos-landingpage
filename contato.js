document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-contato');
    const notificacao = document.getElementById('notificacao-sucesso');

    if (form && notificacao) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            notificacao.classList.add('visivel');

            form.reset();

            setTimeout(() => {
                notificacao.classList.remove('visivel');
            }, 5000);
        });
    }
});
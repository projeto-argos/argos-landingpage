document.addEventListener('DOMContentLoaded', () => {
    const itens = document.querySelectorAll('.item-faq');

    itens.forEach((item) => {
        const botao = item.querySelector('.pergunta-faq');
        const resposta = item.querySelector('.resposta-faq');

        function alternar(abrir) {
            botao.setAttribute('aria-expanded', String(abrir));
            item.classList.toggle('aberto', abrir);
        }

        botao.addEventListener('click', () => {
            const aberto = botao.getAttribute('aria-expanded') === 'true';
            alternar(!aberto);
        });

        resposta.addEventListener('click', (event) => {
            if (window.getSelection().toString()) return;
            if (event.target.closest('a')) return;

            alternar(false);
        });
    });
});
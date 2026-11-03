# ARGOS - Telas em HTML, CSS e JS

Cópia estática das telas do sistema ARGOS (projeto interdisciplinar), para organizar no GitHub e ajustar no Figma.
Não precisa de Java, Tomcat nem banco: é só abrir o `index.html` no navegador (precisa de internet para carregar as fontes e os ícones).

## Estrutura
```
index.html              lista de todas as telas
login.html              login
boas-vindas.html        tela de boas-vindas
home.html               página inicial (cards de total + últimas atualizações)
users.html              usuários
properties.html         propriedades
animals.html            animais
lots.html               lotes
herds.html              rebanhos
admins.html             admins
avisos.html             avisos (toast) de sucesso e de erro
carregamento.html       tela de carregamento
erro-404.html           página não encontrada
erro-500.html           erro inesperado
assets/css              estilos (um arquivo por assunto, compartilhados entre as telas)
assets/js               scripts (menu lateral, pop-ups, tabela, filtro, pesquisa)
assets/img              logos e mascote
```

## Como as telas funcionam aqui
- As tabelas têm **dados de exemplo** (nomes, CPFs e e-mails inventados).
- Os botões **Novo ..., editar (lápis) e excluir (lixeira)** abrem os pop-ups de verdade; o JS é o mesmo do sistema.
- Busca, paginação, menu lateral recolhível e **modo escuro** (botão no menu) funcionam.
- Os formulários **não gravam nada**: estão com `action="#"`. No sistema real eles enviam para os Servlets.
- O botão "Filtrar" abre o painel de filtro, mas aplicar o filtro apenas recarrega a página.
- O captcha do login (Cloudflare Turnstile) virou uma caixa tracejada só para mostrar o espaço dele.

## Cores e fontes (identidade do Figma)
Verde escuro `#06412F`, verde `#62BB4D`, verde-água `#1A6A64` e `#6BADA8`, marrom `#7F411A`, bege `#D0C6B2`, `#F4F1EB` e fundo `#F1EADB`.
Fontes: **Rubik** (títulos) e **DM Sans** (textos), via Google Fonts. Ícones: Font Awesome 6.5.2 (CDN).
As cores principais ficam como variáveis no começo de `assets/css/sidebar.css`.

## Observação
Esta pasta foi gerada a partir das páginas JSP do [argos-web-crud](https://github.com/projeto-argos/argos-web-crud). No repositório do sistema o código continua em JSP; esta versão é só para design e documentação.

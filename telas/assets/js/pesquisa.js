/*
 * pesquisa.js - campo "pesquisar e selecionar".
 */
(function () {
    function simplificar(texto) {
        return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    }

    document.querySelectorAll("[data-pesquisa]").forEach(iniciar);

    function iniciar(caixa) {
        const texto = caixa.querySelector(".pesquisa-texto");
        const lista = caixa.querySelector(".pesquisa-lista");
        const escolhidos = caixa.querySelector(".pesquisa-escolhidos");
        const varios = caixa.hasAttribute("data-varios");
        const obrigatorio = caixa.hasAttribute("data-obrigatorio");
        const nome = caixa.dataset.name;
        const itens = Array.from(lista.querySelectorAll("li"));
        const itemVazio = document.createElement("li");
        let posicao = -1;

        let unico = null;
        if (!varios) {
            unico = document.createElement("input");
            unico.type = "hidden";
            unico.name = nome;
            caixa.appendChild(unico);
        }

        itemVazio.className = "pesquisa-vazio";
        itemVazio.textContent = "Nenhum resultado encontrado";
        itemVazio.hidden = true;
        lista.appendChild(itemVazio);

        lista.id = lista.id || "lista-" + nome + "-" + Math.random().toString(36).slice(2, 7);
        lista.setAttribute("role", "listbox");
        texto.setAttribute("role", "combobox");
        texto.setAttribute("aria-autocomplete", "list");
        texto.setAttribute("aria-controls", lista.id);
        texto.setAttribute("aria-expanded", "false");
        texto.setAttribute("autocomplete", "off");
        itens.forEach(function (item) { item.setAttribute("role", "option"); });

        // ESCOLHIDOS
        function idsEscolhidos() {
            if (varios) {
                return Array.from(escolhidos.querySelectorAll("input[type=hidden]")).map(function (campo) { return campo.value; });
            }
            return unico.value ? [unico.value] : [];
        }

        function itemDoId(id) {
            return itens.find(function (item) { return item.dataset.id === id; });
        }

        function adicionarTag(id, rotulo) {
            const tag = document.createElement("li");
            const campo = document.createElement("input");
            const remover = document.createElement("button");

            tag.className = "pesquisa-tag";
            tag.appendChild(document.createTextNode(rotulo));

            campo.type = "hidden";
            campo.name = nome;
            campo.value = id;
            tag.appendChild(campo);

            remover.type = "button";
            remover.className = "pesquisa-remover";
            remover.setAttribute("aria-label", "Remover " + rotulo);
            remover.textContent = "✕";
            remover.addEventListener("click", function () {
                tag.remove();
                validar();
            });
            tag.appendChild(remover);

            escolhidos.appendChild(tag);
        }

        function escolher(item) {
            const id = item.dataset.id;
            const rotulo = item.textContent.trim();

            if (varios) {
                if (idsEscolhidos().indexOf(id) === -1) {
                    adicionarTag(id, rotulo);
                }
                texto.value = "";
            } else {
                unico.value = id;
                texto.value = rotulo;
            }
            fechar();
            validar();
        }

        //  VALIDAÇÃO
        function validar() {
            let mensagem = "";
            const nada = idsEscolhidos().length === 0;

            if (obrigatorio && nada) {
                mensagem = varios ? "Escolha pelo menos um item da lista." : "Escolha um item da lista.";
            } else if (!varios && texto.value.trim() !== "" && !unico.value) {
                mensagem = "Escolha um item da lista.";
            }
            texto.setCustomValidity(mensagem);
        }

        // LISTA
        function abrir() {
            filtrar();
            lista.hidden = false;
            texto.setAttribute("aria-expanded", "true");
        }

        function fechar() {
            lista.hidden = true;
            texto.setAttribute("aria-expanded", "false");
            posicao = -1;
            itens.forEach(function (item) { item.classList.remove("ativo"); });
        }

        function visiveis() {
            return itens.filter(function (item) { return !item.hidden; });
        }

        function filtrar() {
            const busca = simplificar(texto.value.trim());
            const jaEscolhidos = idsEscolhidos();

            itens.forEach(function (item) {
                const repetido = varios && jaEscolhidos.indexOf(item.dataset.id) !== -1;
                item.hidden = repetido || !simplificar(item.textContent).includes(busca);
                item.classList.remove("ativo");
            });
            posicao = -1;
            itemVazio.hidden = visiveis().length > 0;
        }

        function marcar(novaPosicao) {
            const abertos = visiveis();
            if (abertos.length === 0) {
                return;
            }
            posicao = (novaPosicao + abertos.length) % abertos.length;
            abertos.forEach(function (item, indice) {
                item.classList.toggle("ativo", indice === posicao);
            });
            abertos[posicao].scrollIntoView({ block: "nearest" });
        }

        texto.addEventListener("input", function () {
            if (!varios) {
                unico.value = "";
            }
            abrir();
            validar();
        });

        texto.addEventListener("focus", abrir);
        texto.addEventListener("click", abrir);

        texto.addEventListener("keydown", function (evento) {
            if (evento.key === "ArrowDown") {
                evento.preventDefault();
                if (lista.hidden) { abrir(); }
                marcar(posicao + 1);
            } else if (evento.key === "ArrowUp") {
                evento.preventDefault();
                if (lista.hidden) { abrir(); }
                marcar(posicao - 1);
            } else if (evento.key === "Enter") {
                const abertos = visiveis();
                if (!lista.hidden) {
                    evento.preventDefault();
                    if (posicao >= 0) {
                        escolher(abertos[posicao]);
                    } else if (abertos.length === 1) {
                        escolher(abertos[0]);
                    }
                }
            } else if (evento.key === "Escape" && !lista.hidden) {
                evento.stopPropagation();
                evento.preventDefault();
                fechar();
            }
        });

        lista.addEventListener("mousedown", function (evento) {
            const item = evento.target.closest("li[data-id]");
            if (item) {
                evento.preventDefault();
                escolher(item);
            }
        });

        texto.addEventListener("blur", function () {
            fechar();
            if (varios || !unico.value) {
                texto.value = "";
            }
            validar();
        });

        // Apaga tudo
        caixa.pesquisaLimpar = function () {
            texto.value = "";
            if (varios) {
                escolhidos.innerHTML = "";
            } else {
                unico.value = "";
            }
            fechar();
            validar();
        };

        caixa.pesquisaDefinir = function (ids) {
            caixa.pesquisaLimpar();
            ids.forEach(function (id) {
                const item = itemDoId(id);
                if (item) {
                    escolher(item);
                }
            });
            fechar();
        };

        caixa.pesquisaSincronizar = function () {
            if (!varios) {
                const item = unico.value ? itemDoId(unico.value) : null;
                texto.value = item ? item.textContent.trim() : "";
                if (!item) {
                    unico.value = "";
                }
            }
            validar();
        };

        validar();
    }
})();

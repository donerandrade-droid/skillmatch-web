// ui.js — a TELA: validação do formulário, estados (carregando/vazio/erro)
// e renderização dinâmica dos cards. Não calcula compatibilidade nem faz
// fetch — só mexe em DOM.

const secaoResultado = document.getElementById('resultado');

/**
 * Preenche o formulário com um perfil salvo no localStorage.
 * Usado quando o usuário já visitou a página antes (RF14).
 */
export function preencherFormulario(perfil) {
    if (!perfil) return;
    document.getElementById("nome").value = perfil.nome ?? "";
    document.getElementById("area").value = perfil.area ?? "";
    document.getElementById("habilidades").value = (perfil.habilidades ?? []).join(", ");
    document.getElementById("experienciaMeses").value = perfil.experienciaMeses ??"";
}

/**
 * Escreve as mensagens de erro nos <span class="erro"> correspondentes
 * e marca/desmarca os inputs como inválidos (aria-invalid), para
 * acessibilidade. Usa um mapa de IDs para achar o span certo de cada
 * campo sem depender de convenção de nomes.
 */
function exibirErros(erros) {
    const mapaIds = {
        nome: "erroNome",
        area: "erroArea",
        habilidades: "erroHabilidades",
        experienciaMeses: "erroExperiencia"
    };

    Object.keys(mapaIds).forEach(campo => {
        const spanErro = document.getElementById(mapaIds[campo]);
        const input = document.getElementById(campo);
        if (erros[campo]) {
            spanErro.textContent = erros[campo];
            input.setAttribute("aria-invalid", "true");
        } else {
            spanErro.textContent = "";
            input.removeAttribute("aria-invalid");
        }
    });
}

/**
 * Lê e valida os campos do formulário. Se tudo estiver certo, monta
 * o objeto candidato (RF01) e retorna valido: true. Se algo estiver
 * errado, exibe as mensagens de erro e retorna valido: false.
 */
export function validarFormulario (){
    const nome = document.getElementById('nome').value.trim();
    const area = document.getElementById('area').value.trim();
    const habilidadesTexto = document.getElementById('habilidades').value.trim();
    const experienciaMeses = document.getElementById('experienciaMeses').value;


const erros = {};

if (!nome) erros.nome = "informe seu nome";
if (!area) erros.area = "informe sua área de atuação";
if (!habilidadesTexto) erros.habilidades = "Liste ao menos uma habilidade";
if (experienciaMeses === "" || Number(experienciaMeses) < 0) {
        erros.experienciaMeses = "Informe a experiência em meses (0 ou mais).";
}

exibirErros (erros);

if (Object.keys(erros).length > 0) {
    return {valido: false, candidato: null, erros};
}

const candidato ={
    nome,
    area,
    habilidades: habilidadesTexto.split(',').map(habilidade => habilidade.trim()).filter(Boolean), experienciaMeses: Number(experienciaMeses)
};

return {valido: true, candidato, erros:{}};
}

/**
 * Os três estados abaixo (carregando / erro / vazio) implementam o
 * requisito de tratar explicitamente o carregamento assíncrono do
 * fetch (RF13) — cada função limpa a section de resultado e mostra
 * uma mensagem apropriada.
 */
export function mostrarCarregando() {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem";
    div.textContent = "Carregando vagas...";
    secaoResultado.appendChild(div);
}

// Estado: a rede falhou (fetch deu erro ou response não estava ok).
export function mostrarErro(mensagem) {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem erro-estado";
    div.textContent = mensagem || "Não foi possível carregar as vagas. Tente novamente.";
    secaoResultado.appendChild(div);
}

// Estado: não há vagas para mostrar (catálogo vazio ou nenhum resultado).
export function mostrarVazio(mensagem) {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem";
    div.textContent = mensagem || "Nada encontrado.";
    secaoResultado.appendChild(div);
}

/**
 * Estado de sucesso: monta o destaque da melhor vaga e a grade com as
 * demais, ordenadas da maior para a menor compatibilidade. Tudo criado
 * via createElement/classList — nenhuma vaga é escrita à mão no HTML (RF11).
 */
export function renderizarResultado({resultados, melhorResultado, recomendacao}) {
    secaoResultado.innerHTML = "";

    if (!resultados || resultados.length === 0) {
        mostrarVazio("Nenhuma vaga disponivel para análise no momento.");
        return;
    }

    secaoResultado.appendChild(criarDestaqueMelhorVaga(melhorResultado, recomendacao));
    // Remove a vaga que já está em destaque e ordena as demais pelo
    // percentual, da maior para a menor.
    const outrasVagas = resultados
        .filter(resultado => resultado.vaga.id !== melhorResultado.vaga.id)
        .sort((a, b) => b.percentual - a.percentual);

    const grade = document.createElement('div');
    grade.className = "cards-container";
    outrasVagas.forEach(resultado => grade.appendChild(criarCardVaga(resultado)));
    secaoResultado.appendChild(grade);
}

/**
 * Monta o card de destaque da vaga com maior compatibilidade (fica ao
 * lado do formulário, conforme o layout planejado). Função interna —
 * não tem export porque só é usada dentro deste próprio arquivo.
 */
function criarDestaqueMelhorVaga(resultado, recomendacao) {
    const div = document.createElement("div");
    div.className = "melhor-vaga";

    const etiqueta = document.createElement("span");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = "Maior compatibilidade";
    div.appendChild(etiqueta);

    const titulo = document.createElement("h3");
    titulo.textContent = resultado.vaga.obterRotulo();
    div.appendChild(titulo);

    const empresa = document.createElement("p");
    empresa.className = "empresa";
    empresa.textContent = resultado.vaga.empresa;
    div.appendChild(empresa);

    const percentual = document.createElement("p");
    percentual.className = "percentual";
    percentual.textContent = `${resultado.percentual}%`;
    div.appendChild(percentual);

    const recomendacaoEl = document.createElement("p");
    recomendacaoEl.className = "recomendacao";
    recomendacaoEl.textContent = recomendacao;
    div.appendChild(recomendacaoEl);

    return div;
}

/**
 * Monta um card individual de vaga (usado na grade abaixo do destaque).
 * A cor da borda e do badge muda conforme a classificação
 * (Alta/Média/Baixa), via a classe CSS montada dinamicamente.
 */
function criarCardVaga(resultado) {
    const {vaga, percentual, classificacao, encontradas, faltantes} = resultado;
    // Monta o nome da classe CSS a partir da classificação, removendo
    // acentos (ex: "Média" -> "media") para bater com o CSS.
    const classeClassificacao = `classificacao-${classificacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
    
    const card = document.createElement("article");
    card.className = `card-vaga ${classeClassificacao}`;

    const badge = document.createElement("span");
    badge.className = `badge ${classeClassificacao}`;
    badge.textContent = classificacao;
    card.appendChild(badge);

    const cargo = document.createElement("p");
    cargo.className = "cargo";
    cargo.textContent = vaga.obterRotulo();
    card.appendChild(cargo);

    const empresa = document.createElement("p");
    empresa.className = "empresa";
    empresa.textContent = vaga.empresa;
    card.appendChild(empresa);

    const percentualEl = document.createElement("p");
    percentualEl.className = "percentual";
    percentualEl.textContent = `${percentual}%`;
    card.appendChild(percentualEl);

    if (encontradas.length > 0) {
        card.appendChild(criarListaHabilidades("Você tem:", encontradas, "encontradas"));
    }
    if (faltantes.length > 0) {
        card.appendChild(criarListaHabilidades("Falta:", faltantes, "faltantes"));  
    }
    
    const meta = document.createElement("div");
    meta.className = "meta";
    const modalidade = document.createElement("span");
    modalidade.textContent = vaga.modalidade;
    const salario = document.createElement("span");
    salario.textContent = vaga.salario; 
    meta.appendChild(modalidade);
    meta.appendChild(salario);
    card.appendChild(meta);
    return card;
}

/**
 * Cria uma lista <ul> de habilidades (usada tanto para "Você tem"
 * quanto para "Falta"). Reaproveitada pelo criarCardVaga para não
 * repetir esse bloco de código duas vezes.
 */
function criarListaHabilidades(titulo, habilidades, classeExtra) {
    const wrapper = document.createElement("div");

    const tituloEl = document.createElement("strong");
    tituloEl.textContent = titulo;
    wrapper.appendChild(tituloEl);

    const lista = document.createElement("ul");
    lista.className = `habilidades-lista ${classeExtra}`;
    habilidades.forEach(hab => {
        const item = document.createElement("li");
        item.textContent = hab;
        lista.appendChild(item);
    });
    wrapper.appendChild(lista);

    return wrapper;

}
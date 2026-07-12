const secaoResultado = document.getElementById('resultado');

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
    habilidades: habilidadesTexto.split(',').map(habilidade => habilidade.trim()).filter(boolean), experienciaMeses: Number(experienciaMeses)
};

return {valido: true, candidato, erros:{}};
}

export function mostrarCarregando() {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem";
    div.textContent = "Carregando vagas...";
    secaoResultado.appendChild(div);
}

export function mostrarErro(mensagem) {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem erro-estado";
    div.textContent = mensagem || "Não foi possível carregar as vagas. Tente novamente.";
    secaoResultado.appendChild(div);
}

export function mostrarVazio(mensagem) {
    secaoResultado.innerHTML = "";
    const div = document.createElement('div');
    div.className = "status-mensagem";
    div.textContent = mensagem || "Nada encontrado.";
    secaoResultado.appendChild(div);
}

export function renderizaResultado({resultados, melhorResultado, recomendacao}) {
    secaoResultado.innerHTML = "";

    if (!resultados || resultados.length === 0) {
        mostrarVazio("Nenhuma vaga disponivel para análise no momento.");
        return;
    }

    secaoResultado.appendChild(criarDestaqueMelhorVaga(melhorResultado, recomendacao));

    const grade = document.createElement('div');
    grade.className = "cards-container";
    resultados.forEach(resultado => grade.appendChild(criarCardVaga(resultado)));
    secaoResultado.appendChild(grade);
}

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

function criarCardVaga(resultado) {
    const {vaga, percentual, cassificacao, encontradas, faltantes} = resultado;
    const classeClassificacao = `cassificacao-${classificacao.toLowerCase}`;
    
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
        lista.appendChild(lista);
    });
    wrapper.appendChild(lista);

    return wrapper;

}
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

exibir Erros(erros);

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


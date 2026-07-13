import { analisarCandidato, criarContadorAnalises } from "./motor.js";
import { carregarVagas, salvarPerfil, carregarPerfil } from "./dados.js";
import {
    preencherFormulario,
    validarFormulario,
    mostrarCarregando,
    mostrarErro,
    mostrarVazio,
    renderizarResultado
} from "./ui.js";

const contarAnalise = criarContadorAnalises();

document.addEventListener("DOMContentLoaded", () => {
    const perfilSalvo = carregarPerfil();
    if (perfilSalvo) {
        preencherFormulario(perfilSalvo);
    }

    const form = document.getElementById("formPerfil");
    form.addEventListener("submit", aoEnviarFormulario);
});

async function aoEnviarFormulario(evento) {
    evento.preventDefault();

    const { valido, candidato } = validarFormulario();
    if (!valido) return;

    salvarPerfil(candidato);

    mostrarCarregando();

    try {
        const vagas = await carregarVagas();

        if (vagas.length === 0) {
            mostrarVazio("Nenhuma vaga cadastrada no momento.");
            return;
        }

        analisarCandidato(candidato,vagas, relatorio =>{
            const totalAnalises = contarAnalise();
            console.log(`Análise feitas nesta sessão: ${totalAnalises}`);
            renderizarResultado(relatorio);
        });
    
    } catch (erro) {
        console.error(erro);
        mostrarErro("Não foi possével carregar as vagas. Verifique sua conexão e tente novamente.");
    }

}
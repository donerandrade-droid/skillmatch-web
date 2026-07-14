// main.js — o FLUXO: liga motor.js (regras) + dados.js (dados/persistência)
// + ui.js (tela). É o único arquivo que "conhece" os outros três.
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

// Closure criada uma única vez, na abertura da página — guarda o total
// de análises feitas nesta sessão.
const contarAnalise = criarContadorAnalises();

// Espera o HTML terminar de carregar antes de mexer no DOM. Se já
// existir um perfil salvo, preenche o formulário automaticamente.
document.addEventListener("DOMContentLoaded", () => {
    const perfilSalvo = carregarPerfil();
    if (perfilSalvo) {
        preencherFormulario(perfilSalvo);
    }

    const form = document.getElementById("formPerfil");
    form.addEventListener("submit", aoEnviarFormulario);

    const btnLimpar = document.getElementById("limparBtn");
    btnLimpar.addEventListener("click", () => {
        form.reset();
        document.getElementById("resultado").innerHTML = "";
    
    });
});

/**
 * Executada quando o formulário é enviado. Valida, salva o perfil,
 * busca as vagas via fetch, manda o motor calcular e renderiza o
 * resultado — tratando os três estados (carregando/vazio/erro).
 */
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

        // Callback em ação: o motor calcula e, quando termina, executa
    // esta função com o relatório pronto.
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
// dados.js — busca as vagas (fetch) e cuida da persistência (localStorage).
// Não calcula nada e não mexe no DOM — só entra e sai dados.
import { VagaFrontEnd } from "./motor.js";

/**
 * Busca o catálogo de vagas em vagas.json e transforma cada objeto
 * puro do JSON em uma instância de VagaFrontEnd (dados -> regras).
 * Lança erro se a resposta não for ok ou se a rede falhar.
 */
export async function carregarVagas() {
    const response = await fetch("./assets/dados/vagas.json");
    
    if (!response.ok) {
        throw new Error(`Não foi possível carregar as vagas: ${response.status}`);
    }

    const dadosBrutos = await response.json();

    return dadosBrutos.map(vaga => new VagaFrontEnd(vaga.id, vaga.empresa, vaga.cargo, vaga.requisitos, vaga.salario, vaga.modalidade, vaga.senioridade));

}

const CHAVE_PERFIL = "skillmatch:perfil";

/**
 * Salva o perfil do candidato no localStorage. Só dados de perfil —
 * nunca senha, token ou qualquer dado sensível.
 */
export function salvarPerfil(perfil) {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

/**
 * Recupera o perfil salvo. Trata explicitamente a primeira visita,
 * quando getItem retorna null.
 */
export function carregarPerfil() {
    const bruto = localStorage.getItem(CHAVE_PERFIL);
    if (bruto === null) return null;

    try {
        return JSON.parse(bruto);
    } catch {
        return null;
    }
}
import { VagasFrontEnd } from "./motor.js";

export async function carregarVagas() {
    const response = await fetch("./assets/dados/vagas.json");
    
    if (!response.ok) {
        throw new Error(`Não foi possível carregar as vagas: ${response.status}`);
    }

    const dadosBrutos = await response.json();

    return dadosBrutos.map(vaga => new VagasFrontEnd(v.id, v.empresa, v.cargo, v.requisitos, v.salario, v.modalidade, v.senioridade));

}

const CHAVE_PERFIL = "skillmatch:perfil";

export function salvarPerfil(perfil) {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

export function carregarPerfil() {
    const bruto = localStorage.getItem(CHAVE_PERFIL);
    if (bruto === null) return null;

    try {
        return JSON.parse(bruto);
    } catch {
        return null;
    }
}
// motor.js — as REGRAS do SkillMatch (nada de DOM ou fetch aqui, só lógica pura)
/**
 * Representa uma vaga de emprego genérica.
 * Sabe calcular sua própria compatibilidade com um candidato — por isso
 * o cálculo é um MÉTODO da classe, e não uma função solta.
 */

export class Vaga {
    // Recebe os dados brutos da vaga (vindos do vagas.json) e monta o objeto.
    constructor (id, empresa, cargo, requisitos, salario, modalidade){
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
    }

    /**
     * Compara as habilidades do candidato com os requisitos desta vaga.
     * Retorna o percentual de compatibilidade, as habilidades que o
     * candidato tem (encontradas) e as que faltam.
     */
calcularCompatibilidade(habilidadesCandidato) {
    // Normaliza tudo pra minúsculo/sem espaços, senão "JavaScript" e
    // "javascript" seriam tratados como habilidades diferentes.
    const habilidadesNormalizadas = habilidadesCandidato.map(h => h.trim().toLowerCase());
    // Requisitos da vaga que o candidato TEM.
    const encontradas = this.requisitos.filter(req => habilidadesNormalizadas.includes(req.trim().toLowerCase()));
    // Requisitos da vaga que o candidato NÃO tem.
    const faltantes = this.requisitos.filter(req => !encontradas.includes(req));
    // Regra de três: quantos % dos requisitos o candidato atende.
    const percentual = this.requisitos.length === 0 ? 0 : Math.round((encontradas.length / this.requisitos.length) * 100);

    return {
        percentual,
        encontradas,
        faltantes,
        classificacao: this.classificar(percentual)
    };
}

    /**
     * Classifica a vaga pela faixa de compatibilidade:
     * Alta (80-100%), Média (50-79%) ou Baixa (0-49%).
     */
    classificar (percentual) {
     if (percentual >= 80) 
         return 'Alta';
      if (percentual >= 50)
        return 'Média';
        return 'Baixa';
    }
    // Texto de exibição padrão da vaga. A subclasse VagaFrontEnd
    // sobrescreve este método para incluir a senioridade.
     obterRotulo() {
        return this.cargo;
    }
}

/**
 * VagaFrontEnd HERDA de Vaga: toda vaga do catálogo é uma vaga de
 * front-end, então esta classe acrescenta a senioridade (Júnior/Pleno/
 * Sênior) e sobrescreve obterRotulo() para incluir essa informação —
 * sem duplicar nada do cálculo de compatibilidade, herdado da classe-mãe.
 */
export class VagaFrontEnd extends Vaga {
    constructor (id, empresa, cargo, requisitos, salario, modalidade, senioridade){
        super(id, empresa, cargo, requisitos, salario, modalidade);
        this.senioridade = senioridade;
    }

    // Sobrescreve o rótulo da classe-mãe: mesmo nome de método,
    // comportamento diferente (polimorfismo).
    obterRotulo() {
        return `${this.cargo} (${this.senioridade})`;
    }
}

/**
 * Closure: uma "fábrica" de contadores. Cada chamada desta função cria
 * uma variável "total" isolada, que só a função retornada consegue
 * acessar e alterar — usada para saber quantas análises foram feitas
 * na sessão, sem expor esse número como variável global.
 */
export function criarContadorAnalises() {
    let total = 0;
    return function() {
        total += 1;
        return total;
    }
}

/**
 * Gera uma recomendação de estudo com base nas habilidades que mais
 * aparecem como faltantes entre todas as vagas analisadas.
 */
export function gerarRecomendacaoEstudo(resultado) {
    // "Placar" de quantas vezes cada habilidade aparece como faltante.
    const contagemFaltantes = {};

    resultado.forEach(({faltantes}) =>{
        faltantes.forEach(hab => {
            contagemFaltantes[hab] = (contagemFaltantes[hab] || 0) + 1;
        });
    });

    // Transforma o placar num array e ordena da habilidade que mais
    // falta pra que menos falta.
    const habilidadesOrdenadas = Object.entries(contagemFaltantes)
        .sort((a, b) => b[1] - a[1])
        .map(([habilidade]) => habilidade);

    if (habilidadesOrdenadas.length === 0) {
        return 'Parabéns! Você atende a todos os requisitos das vagas analisadas.';
    }

    const topTres = habilidadesOrdenadas.slice(0, 3). join(", ");
    return `Para aumentar suas chances, estude: ${topTres}.`;

}

/**
 * Função principal do motor: calcula a compatibilidade do candidato
 * com todas as vagas, acha a melhor, gera a recomendação, e entrega
 * tudo pronto via CALLBACK (aoConcluir) — quem chamar esta função
 * decide o que fazer com o resultado.
 */
export function analisarCandidato(candidato, vagas, aoConcluir) {
    const habilidadesCandidato = candidato.habilidades;
    // Para cada vaga, calcula a compatibilidade (usa o método da
    // própria classe Vaga/VagaFrontEnd).
    const resultados = vagas.map(vaga => {
        const analise = vaga.calcularCompatibilidade(habilidadesCandidato);
        return {vaga, ...analise};
    });

    // Acha o resultado de maior percentual. Em caso de empate, o
    // desempate é pela experiência do candidato (>= 12 meses ganha).
    const melhorResultado = resultados.reduce((melhorAteAgora, atual) => {
        if (atual.percentual > melhorAteAgora.percentual)
            return atual;
        if (atual.percentual === melhorAteAgora.percentual) {
            return candidato.experienciaMeses >= 12 ? atual : melhorAteAgora;    
        }
        return melhorAteAgora;
    }, resultados[0]);

    const recomendacao = gerarRecomendacaoEstudo(resultados);
    const relatorio = {
        resultados,
        melhorResultado,
        recomendacao
    };

    // Só executa o callback se realmente foi passado um (proteção
    // contra erro caso alguém esqueça de passar).
    if (typeof aoConcluir === 'function') {
        aoConcluir(relatorio);
    }

    return relatorio;
} 

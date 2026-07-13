// motor.js — as REGRAS do SkillMatch (nada de DOM ou fetch aqui, só lógica pura)


export class Vaga {
    constructor (id, empresa, cargo, requisitos, salario, modalidade){
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos;
        this.salario = salario;
        this.modalidade = modalidade;
    }


calcularCompatibilidade(habilidadesCandidato) {

    const habilidadesNormalizadas = habilidadesCandidato.map(h => h.trim().toLowerCase());

    const encontradas = this.requisitos.filter(req => habilidadesNormalizadas.includes(req.trim().toLowerCase()));

    const faltantes = this.requisitos.filter(req => !encontradas.includes(req));

    const percentual = this.requisitos.length === 0 ? 0 : Math.round((encontradas.length / this.requisitos.length) * 100);

    return {
        percentual,
        encontradas,
        faltantes,
        classificacao: this.classificar(percentual)
    };
}

    classificar (percentual) {
     if (percentual >= 80) 
         return 'Alta';
      if (percentual >= 50)
        return 'Média';
        return 'Baixa';
    }

     obterRotulo() {
        return this.cargo;
    }
}

export class VagaFrontEnd extends Vaga {
    constructor (id, empresa, cargo, requisitos, salario, modalidade, senioridade){
        super(id, empresa, cargo, requisitos, salario, modalidade);
        this.senioridade = senioridade;
    }

    obterRotulo() {
        return `${this.cargo} (${this.senioridade})`;
    }
}

export function criarContadorAnalises() {
    let total = 0;
    return function() {
        total += 1;
        return total;
    }
}

export function gerarRecomendacaoEstudo(resultado) {
    const contagemFaltantes = {};

    resultado.forEach(({faltantes}) =>{
        faltantes.forEach(hab => {
            contagemFaltantes[hab] = (contagemFaltantes[hab] || 0) + 1;
        });
    });

    const habilidadesOrdenadas = Object.entries(contagemFaltantes)
        .sort((a, b) => b[1] - a[1])
        .map(([habilidade]) => habilidade);

    if (habilidadesOrdenadas.length === 0) {
        return 'Parabéns! Você atende a todos os requisitos das vagas analisadas.';
    }

    const topTres = habilidadesOrdenadas.slice(0, 3). join(", ");
    return `Para aumentar suas chances, estude: ${topTres}.`;

}

export function analisarCandidato(candidato, vagas, aoConcluir) {
    const habilidadesCandidato = candidato.habilidades;
    const resultados = vagas.map(vaga => {
        const analise = vaga.calcularCompatibilidade(habilidadesCandidato);
        return {vaga, ...analise};
    });

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

    if (typeof aoConcluir === 'function') {
        aoConcluir(relatorio);
    }

    return relatorio;
} 

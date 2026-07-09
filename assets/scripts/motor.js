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
}
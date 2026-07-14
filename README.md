<div align="center">

# SkillMatch JS

**Simulador de compatibilidade entre candidatos e vagas de front-end**

Construído em HTML, CSS e JavaScript puro — sem frameworks, sem bibliotecas externas, sem build.

![HTML5](https://img.shields.io/badge/HTML5-333333?style=flat-square)
![CSS3](https://img.shields.io/badge/CSS3-333333?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-333333?style=flat-square)
![Lighthouse Acessibilidade 100](https://img.shields.io/badge/Lighthouse_Acessibilidade-100-333333?style=flat-square)
![Lighthouse SEO 100](https://img.shields.io/badge/Lighthouse_SEO-100-333333?style=flat-square)

</div>

<br>

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias e conceitos aplicados](#tecnologias-e-conceitos-aplicados)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Como testar](#como-testar)
- [Fluxo da aplicação](#fluxo-da-aplicação)
- [Cobertura dos requisitos](#cobertura-dos-requisitos)
- [Melhorias futuras](#melhorias-futuras)
- [Autor](#autor)

<br>

## Links

| | |
|---|---|
| Repositório | [github.com/donerandrade-droid/skillmatch-web](https://github.com/donerandrade-droid/skillmatch-web) |
| Quadro Kanban (Trello) | [trello.com/b/OzjFglaS/skillmatch-web](https://trello.com/b/OzjFglaS/skillmatch-web) |

<br>

## Sobre o projeto

Candidatos de front-end júnior costumam ter dificuldade em identificar rapidamente quais vagas realmente combinam com o perfil deles, e quais habilidades vale mais a pena estudar para aumentar as chances de contratação.

O SkillMatch resolve isso: o candidato preenche um perfil simples (nome, área, habilidades, experiência) e a aplicação calcula, para cada vaga de um catálogo, o percentual de compatibilidade — destacando a melhor opção e recomendando o próximo passo de estudo.

Este projeto é a evolução do SkillMatch JS (mini-projeto do Módulo 01, que rodava apenas no console) para uma aplicação web completa, com interface, persistência de dados e consumo assíncrono via `fetch`.

*Projeto avaliativo — Módulo 01, Front-End (Semana 13).*

<br>

## Funcionalidades

- Cálculo de compatibilidade entre o perfil do candidato e cada vaga do catálogo
- Classificação automática em Alta, Média ou Baixa compatibilidade
- Destaque da vaga com maior compatibilidade, com recomendação de estudo personalizada
- Formulário com validação em tempo real e mensagens de erro acessíveis
- Renderização 100% dinâmica dos cards via DOM — nenhuma vaga escrita no HTML
- Persistência do perfil via `localStorage` — o formulário já vem preenchido nas próximas visitas
- Catálogo de vagas carregado via `fetch`, com os três estados tratados: carregando, vazio e erro
- Botão de limpar formulário para reiniciar a pesquisa
- Layout responsivo mobile-first: uma coluna no celular, duas no tablet, três no desktop

<br>

## Tecnologias e conceitos aplicados

| Camada | Arquivo | Conceitos |
|---|---|---|
| Lógica | `motor.js` | Classes e herança (`Vaga` → `VagaFrontEnd`), polimorfismo, closures, callbacks, métodos de array (`map`, `filter`, `reduce`) |
| Dados | `dados.js` | `fetch` com `async/await`, `localStorage`, `JSON.stringify`/`JSON.parse` |
| Interface | `ui.js` | Manipulação de DOM (`createElement`, `classList`), validação de formulário, `addEventListener` |
| Orquestração | `main.js` | Módulos ES (`import`/`export`), integração entre as camadas |
| Estilo | `index.style.css` | CSS puro com variáveis, Flexbox, media queries mobile-first |
| Acessibilidade e SEO | — | HTML semântico, `aria-label`, `aria-live`, `label`/`for`, `alt`, foco visível, `meta description` |

<br>

## Estrutura do projeto

```
skillmatch-web/
├── index.html
├── README.md
└── assets/
    ├── styles/
    │   └── index.style.css
    ├── scripts/
    │   ├── main.js      → ponto de entrada, orquestra os demais módulos
    │   ├── motor.js     → regras: classes, compatibilidade, closure/callback
    │   ├── ui.js        → tela: validação, render dos cards, estados
    │   └── dados.js     → fetch das vagas + persistência (localStorage)
    ├── dados/
    │   └── vagas.json   → catálogo de vagas (dado puro)
    └── img/
        └── logo.svg
```

A divisão segue o princípio dados × regras × tela: `vagas.json` guarda os dados, `motor.js` concentra as regras de negócio, `ui.js` cuida exclusivamente da apresentação, e `main.js` liga tudo através de `import`/`export`.

<br>

## Como executar

Este projeto usa módulos ES (`import`/`export`) e `fetch`, por isso não funciona abrindo o `index.html` direto pelo navegador (`file://`). É necessário rodar por um servidor local.

```bash
git clone https://github.com/donerandrade-droid/skillmatch-web.git
cd skillmatch-web
code .
```

1. Instale a extensão Live Server no VS Code (se ainda não tiver).
2. Clique com o botão direito em `index.html` → **Open with Live Server**.
3. A aplicação abre em `http://127.0.0.1:5500` (ou porta similar).

<br>

## Como testar

1. Preencha o formulário: nome, área de atuação, habilidades (ex.: `JavaScript, CSS, HTML, Git`) e experiência em meses.
2. Clique em **Analisar vagas**.
3. A vaga com maior compatibilidade aparece em destaque; as demais são exibidas em cards, ordenadas do maior para o menor percentual.
4. Clique em **Limpar formulário** para reiniciar a pesquisa.
5. Recarregue a página — o perfil preenchido continua salvo.

<br>

## Fluxo da aplicação

```
abrir a página
   │
   ▼
perfil salvo? ──► preenche o formulário automaticamente
   │
   ▼
formulário de perfil ──► valida ──► salva no localStorage
   │
   ▼
fetch das vagas ──► carregando / erro / vazio / sucesso
   │
   ▼
motor calcula compatibilidade ──► callback ──► renderiza os cards
```

<br>

## Cobertura dos requisitos

| Grupo | Requisitos | Status |
|---|---|---|
| A — Motor | RF01–RF08: perfil, catálogo, compatibilidade, classificação, POO com herança, callback e closure | Concluído |
| B — Interface | RF09–RF12: HTML semântico/acessível/SEO, formulário validado, render dinâmico, responsividade | Concluído |
| C — Dados | RF13–RF14: fetch com três estados, localStorage | Concluído |
| D — Organização | RF15–RF16: módulos ES, código comentado | Concluído |

<br>

## Melhorias futuras

- Filtro e ordenação de vagas por modalidade ou faixa salarial
- Tema claro/escuro persistido no localStorage
- Deploy via GitHub Pages
- Testes automatizados para o motor de compatibilidade
- Geolocalização para sugerir vagas presenciais próximas

<br>

## Autor

Desenvolvido por **Doner José de Andrade**
Projeto avaliativo — Módulo 01, Front-End React T1

Repositório: [github.com/donerandrade-droid/skillmatch-web](https://github.com/donerandrade-droid/skillmatch-web) · Kanban: [Trello](https://trello.com/b/OzjFglaS/skillmatch-web)

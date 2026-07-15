# 🛠️ Portfólio Profissional de Engenharia Mecânica & Sistemas

Portfólio interativo de **Gustavo Luiz Heck** (Estudante de Engenharia Mecânica na UDESC-CCT e Técnico em Automação Industrial pelo SENAI). 

O repositório é composto por três blocos principais integrados em uma SPA (Single Page Application) responsiva de alta performance e apelo estético:

1. **Currículo Interativo (`/curriculo`)**: Currículo digital completo e dinâmico com sistema bilíngue (PT-BR / EN), animações fluidas, gráfico radar de competências quantitativas (Chart.js), botão para download de fonte LaTeX (`curriculo.tex`) e formatação CSS otimizada para impressão física (Ctrl+P / salvar em PDF).
2. **Plataforma EngNav (`/engnav`)**: Plataforma inteligente de engenharia contendo:
   - **Biblioteca de 30 Projetos**: Projetos práticos estruturados em 6 trilhas de aprendizagem. Possui lógica de dependências integrada (Projetos bloqueados/desbloqueados conforme conclusão de pré-requisitos).
   - **Modo Kanban Interativo**: Painel de gerenciamento ágil de estudos com suporte a Drag-and-Drop (Arrastar e Soltar) nativo e persistência local (`localStorage`).
   - **Painel de Aprendizagem & Livros**: Gerenciador de Hard/Soft Skills com controle deslizante de proficiência e acervo bibliográfico técnico editável de cabeceira.
   - **Analisador de Lacunas (Gap Finder)**: Algoritmo que calcula afinidade com vagas alvo de engenharia no Brasil e exporta um roadmap de estudos em PDF formatado.
   - **Varredor de Vagas (Scraper Python)**: Script em Python que compila e atualiza estatísticas de vagas reais de engenharia brasileiras no dashboard.
3. **Portal Geral (`/`)**: Página de entrada estilizada em Dark Mode e PWA instalável no celular (acesso offline).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Um navegador de internet moderno.
- Python 3 (opcional, apenas para re-executar o scraper de mercado).

### Execução do Portal Web
Como o projeto utiliza arquivos estáticos puros (HTML/CSS/JS) e recursos assíncronos locais (`fetch` para o arquivo JSON de dados de mercado), **recomenda-se rodar sob um servidor local** para evitar erros de CORS do navegador.

Você pode iniciar um servidor simples de forma rápida:

**Com Python:**
No terminal do seu computador, na pasta raiz do repositório, execute:
```bash
python -m http.server 8000
```
Em seguida, acesse no navegador: `http://localhost:8000`.

**Com Node.js (se instalado):**
```bash
npx serve .
```

---

## 📈 Atualizando Dados de Vagas (Scraper)

O painel de mercado da aba "Mercado & Vagas" do EngNav é alimentado de forma dinâmica por um arquivo estático `engnav/market_data.json` que pode ser gerado/atualizado executando o script do scraper de dados:

```bash
python engnav/scraper.py
```
O script atualizará as métricas de oferta e procura de vagas por polo industrial de forma instantânea para a aplicação web.

---

## 🛠️ Tecnologias Utilizadas

- **Estruturação**: HTML5 Semântico
- **Estilização**: Vanilla CSS3 (Design moderno com Glassmorphism, Neon glow e Responsive Layouts)
- **Comportamentos**: Vanilla JavaScript (ES6+)
- **Gráficos**: [Chart.js (v4.x)](https://www.chartjs.org/) via CDN
- **Relatórios**: [jsPDF (v2.x)](https://github.com/parallax/jsPDF) via CDN
- **Ícones**: [FontAwesome (v6.4.0)](https://fontawesome.com/) via CDN
- **PWA**: Service Worker & Web App Manifest integrado para instalação no Android/iOS.

---

## 📝 Personalização do Currículo (Projetos & Certificados)

As seções **06 (Projetos Técnicos)** e **07 (Certificações e Cursos)** do currículo em `curriculo/index.html` foram deixadas propositalmente vazias como templates editáveis. Para adicionar seus dados:

1. Abra o arquivo [curriculo/index.html](file:///C:/Users/Pichau/Documents/antigravity/beautiful-noether/curriculo/index.html) no seu editor de código.
2. Localize os comentários `<!-- TEMPLATE DE PROJETO -->` ou `<!-- TEMPLATE DE CERTIFICAÇÃO -->`.
3. Copie o bloco de código comentado, cole-o logo abaixo, remova as marcas de comentário (`<!--` e `-->`) e altere os textos de exemplo com suas realizações.
4. Salve o arquivo e atualize a página no navegador. A formatação estética já está configurada por completo!

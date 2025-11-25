---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  O MCP já está desatualizado? A verdadeira razão pela qual a Anthropic enviou
  habilidades - e como combiná-las com Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_162fd27dc1.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Saiba como o Skills funciona para reduzir o consumo de tokens e como o Skills
  e o MCP trabalham em conjunto com o Milvus para melhorar os fluxos de trabalho
  de IA.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>Nas últimas semanas, uma discussão surpreendentemente acalorada irrompeu no X e no Hacker News: <em>Nós realmente precisamos mais de servidores MCP?</em> Alguns desenvolvedores afirmam que o MCP é excessivamente engenhoso, faminto por tokens e fundamentalmente desalinhado com a forma como os agentes devem usar as ferramentas. Outros defendem o MCP como a forma fiável de expor capacidades do mundo real aos modelos de linguagem. Dependendo do tópico que você lê, o MCP é o futuro do uso de ferramentas - ou está morto na chegada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A frustração é compreensível. O MCP dá-lhe um acesso robusto a sistemas externos, mas também obriga o modelo a carregar esquemas longos, descrições detalhadas e listas de ferramentas extensas. Isso adiciona custos reais. Se descarregar a transcrição de uma reunião e, mais tarde, a introduzir noutra ferramenta, o modelo pode reprocessar o mesmo texto várias vezes, aumentando a utilização de tokens sem qualquer benefício óbvio. Para as equipas que operam em grande escala, isto não é um inconveniente - é uma fatura.</p>
<p>Mas declarar o MCP obsoleto é prematuro. Anthropic - a mesma equipa que inventou o MCP - introduziu discretamente algo novo: <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Skills são definições Markdown/YAML leves que descrevem <em>como</em> e <em>quando</em> uma ferramenta deve ser usada. Em vez de despejar esquemas completos na janela de contexto, o modelo primeiro lê metadados compactos e usa isso para planejar. Na prática, as habilidades reduzem drasticamente a sobrecarga de token e dão aos desenvolvedores mais controle sobre a orquestração de ferramentas.</p>
<p>Então, isso significa que o Skills substituirá o MCP? Não exatamente. As habilidades simplificam o planejamento, mas o MCP ainda fornece os recursos reais: ler arquivos, chamar APIs, interagir com sistemas de armazenamento ou conectar-se a uma infraestrutura externa como o <a href="https://milvus.io/"><strong>Milvus</strong></a>, um banco de dados vetorial de código aberto que sustenta a recuperação semântica rápida em escala, tornando-o um back-end crítico quando suas habilidades precisam de acesso real a dados.</p>
<p>Este post detalha o que as Skills fazem bem, onde o MCP ainda é importante e como ambos se encaixam na arquitetura de agente em evolução do Anthropic. Em seguida, mostraremos como criar suas próprias Skills que se integram de forma limpa com o Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">O que são habilidades do agente Anthropic e como elas funcionam<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Um problema de longa data dos agentes de IA tradicionais é que as instruções são apagadas à medida que a conversa cresce.</p>
<p>Mesmo com as instruções do sistema mais cuidadosamente elaboradas, o comportamento do modelo pode se desviar gradualmente ao longo da conversa. Depois de várias voltas, Claude começa a esquecer ou perder o foco nas instruções originais.</p>
<p>O problema está na estrutura da instrução do sistema. É uma injeção única e estática que compete por espaço na janela de contexto do modelo, juntamente com o histórico da conversa, documentos e quaisquer outras entradas. À medida que a janela de contexto se vai enchendo, a atenção do modelo à mensagem do sistema vai-se diluindo, o que leva a uma perda de consistência ao longo do tempo.</p>
<p>As competências foram concebidas para resolver este problema. As competências são pastas que contêm instruções, guiões e recursos. Em vez de depender de um prompt estático do sistema, as habilidades dividem a experiência em pacotes de instruções modulares, reutilizáveis e persistentes que o Claude pode descobrir e carregar dinamicamente quando necessário para uma tarefa.</p>
<p>Quando o Claude inicia uma tarefa, ele primeiro executa uma varredura leve de todas as habilidades disponíveis, lendo apenas seus metadados YAML (apenas algumas dezenas de tokens). Esses metadados fornecem apenas informações suficientes para que o Claude determine se uma habilidade é relevante para a tarefa atual. Em caso afirmativo, o Claude expande para o conjunto completo de instruções (geralmente menos de 5 mil tokens), e recursos ou scripts adicionais são carregados apenas se necessário.</p>
<p>Essa revelação progressiva permite que o Claude inicialize uma habilidade com apenas 30-50 tokens, melhorando significativamente a eficiência e reduzindo a sobrecarga de contexto desnecessária.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">Como as habilidades se comparam a prompts, projetos, MCP e subagentes<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>O cenário atual de ferramentas de modelo pode parecer lotado. Mesmo apenas no ecossistema agêntico do Claude, há vários componentes distintos: Habilidades, prompts, projetos, subagentes e MCP.</p>
<p>Agora que entendemos o que são as habilidades e como elas funcionam por meio de pacotes de instruções modulares e carregamento dinâmico, precisamos saber como as habilidades se relacionam com outras partes do ecossistema do Claude, especialmente o MCP. Aqui está um resumo:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Habilidades</h3><p>As habilidades são pastas que contêm instruções, scripts e recursos. O Claude as descobre e carrega dinamicamente usando a divulgação progressiva: primeiro os metadados, depois as instruções completas e, por fim, todos os arquivos necessários.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Fluxos de trabalho organizacionais (diretrizes de marca, procedimentos de conformidade)</p></li>
<li><p>Experiência no domínio (fórmulas do Excel, análise de dados)</p></li>
<li><p>Preferências pessoais (sistemas de tomada de notas, padrões de codificação)</p></li>
<li><p>Tarefas profissionais que precisam de ser reutilizadas em conversas (revisões de segurança de código baseadas em OWASP)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Avisos</h3><p>Os prompts são as instruções em linguagem natural que dá ao Claude numa conversa. São temporárias e existem apenas na conversa atual.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Pedidos pontuais (resumir um artigo, formatar uma lista)</p></li>
<li><p>Aperfeiçoamento de conversas (ajustar o tom, adicionar detalhes)</p></li>
<li><p>Contexto imediato (analisar dados específicos, interpretar conteúdo)</p></li>
<li><p>Instruções ad-hoc</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Projectos</h3><p>Os projectos são espaços de trabalho autónomos com os seus próprios históricos de conversação e bases de conhecimento. Cada projeto oferece uma janela de contexto de 200K. Quando o conhecimento do seu projeto se aproxima dos limites do contexto, o Claude transita sem problemas para o modo RAG, permitindo uma expansão de até 10 vezes na capacidade efectiva.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Contexto persistente (por exemplo, todas as conversas relacionadas ao lançamento de um produto)</p></li>
<li><p>Organização do espaço de trabalho (contextos separados para diferentes iniciativas)</p></li>
<li><p>Colaboração em equipa (nos planos Team e Enterprise)</p></li>
<li><p>Instruções personalizadas (tom ou perspetiva específicos do projeto)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Subagentes</h3><p>Os subagentes são assistentes de IA especializados com as suas próprias janelas de contexto, avisos de sistema personalizados e permissões de ferramentas específicas. Eles podem trabalhar de forma independente e retornar resultados para o agente principal.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Especialização de tarefas (revisão de código, geração de testes, auditorias de segurança)</p></li>
<li><p>Gerenciamento de contexto (manter a conversa principal focada)</p></li>
<li><p>Processamento paralelo (vários subagentes trabalhando em diferentes aspectos simultaneamente)</p></li>
<li><p>Restrição de ferramentas (por exemplo, acesso só de leitura)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Protocolo de Contexto de Modelo)</h3><p>O Protocolo de Contexto de Modelo (MCP) é uma norma aberta que liga modelos de IA a ferramentas e fontes de dados externas.</p>
<p><strong>Ideal para:</strong></p>
<ul>
<li><p>Aceder a dados externos (Google Drive, Slack, GitHub, bases de dados)</p></li>
<li><p>Utilizar ferramentas empresariais (sistemas CRM, plataformas de gestão de projectos)</p></li>
<li><p>Ligação a ambientes de desenvolvimento (ficheiros locais, IDEs, controlo de versões)</p></li>
<li><p>Integração com sistemas personalizados (ferramentas proprietárias e fontes de dados)</p></li>
</ul>
<p>Com base no exposto, podemos ver que as Competências e o CIM abordam desafios diferentes e trabalham em conjunto para se complementarem.</p>
<table>
<thead>
<tr><th><strong>Dimensão</strong></th><th><strong>CIM</strong></th><th><strong>Competências</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Valor principal</strong></td><td>Liga-se a sistemas externos (bases de dados, APIs, plataformas SaaS)</td><td>Define especificações de comportamento (como processar e apresentar dados)</td></tr>
<tr><td><strong>Perguntas respondidas</strong></td><td>"A que é que o Cláudio pode aceder?"</td><td>"O que é que o Claude deve fazer?"</td></tr>
<tr><td><strong>Implementação</strong></td><td>Protocolo cliente-servidor + esquema JSON</td><td>Ficheiro Markdown + metadados YAML</td></tr>
<tr><td><strong>Consumo de contexto</strong></td><td>Dezenas de milhares de tokens (acumulações de vários servidores)</td><td>30-50 tokens por operação</td></tr>
<tr><td><strong>Casos de utilização</strong></td><td>Consulta de grandes bases de dados, chamada de APIs do GitHub</td><td>Definição de estratégias de pesquisa, aplicação de regras de filtragem, formatação de saída</td></tr>
</tbody>
</table>
<p>Tomemos como exemplo a pesquisa de código.</p>
<ul>
<li><p><strong>MCP (por exemplo, claude-context):</strong> Fornece a capacidade de aceder à base de dados de vectores Milvus.</p></li>
<li><p><strong>Competências:</strong> Define o fluxo de trabalho, como priorizar o código modificado mais recentemente, classificar os resultados por relevância e apresentar os dados em uma tabela Markdown.</p></li>
</ul>
<p>O MCP fornece a capacidade, enquanto as habilidades definem o processo. Juntas, elas formam um par complementar.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Como criar habilidades personalizadas com Claude-Context e Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">O Claude-Context</a> é um plug-in do MCP que adiciona a funcionalidade de pesquisa de código semântico ao Claude Code, transformando toda a base de código no contexto do Claude.</p>
<h3 id="Prerequisite" class="common-anchor-header">Pré-requisito</h3><p>Requisitos do sistema:</p>
<ul>
<li><p><strong>Node.js</strong>: Versão &gt;= 20.0.0 e &lt; 24.0.0</p></li>
<li><p><strong>Chave de API do OpenAI</strong> (para modelos de incorporação)</p></li>
<li><p><strong>Chave de API</strong><a href="https://zilliz.com.cn/"><strong>do Zilliz Cloud</strong></a> (serviço Milvus gerido)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Etapa 1: configurar o serviço MCP (claude-context)</h3><p>Execute o seguinte comando no terminal:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verificar a configuração:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A configuração do MCP está concluída. O Claude pode agora aceder à base de dados de vectores do Milvus.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Passo 2: Criar a competência</h3><p>Crie o diretório Skills:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Criar o ficheiro SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Etapa 3: reiniciar o Claude para aplicar as habilidades</h3><p>Execute o seguinte comando para reiniciar o Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> Depois que a configuração estiver concluída, você pode usar imediatamente as habilidades para consultar a base de código do Milvus.</p>
<p>Abaixo está um exemplo de como isso funciona.</p>
<p>Consulta: Como funciona o Milvus QueryCoord?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>No fundo, as Skills funcionam como um mecanismo de encapsulamento e transferência de conhecimento especializado. Ao usar Skills, a IA pode herdar a experiência de uma equipa e seguir as melhores práticas da indústria - quer seja uma lista de verificação para revisões de código ou padrões de documentação. Quando esse conhecimento tácito é explicitado por meio de arquivos Markdown, a qualidade dos resultados gerados pela IA pode ter uma melhoria significativa.</p>
<p>Olhando para o futuro, a capacidade de aproveitar as competências de forma eficaz pode tornar-se um diferenciador chave na forma como as equipas e os indivíduos utilizam a IA em seu benefício.</p>
<p>À medida que explora o potencial da IA na sua organização, o Milvus é uma ferramenta essencial para gerir e pesquisar dados vectoriais em grande escala. Ao combinar o poderoso banco de dados vetorial do Milvus com ferramentas de IA como o Skills, você pode melhorar não apenas seus fluxos de trabalho, mas também a profundidade e a velocidade de seus insights orientados por dados.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> para conversar com nossos engenheiros e outros engenheiros de IA na comunidade. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>

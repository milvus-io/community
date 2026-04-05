---
id: claude-code-memory-memsearch.md
title: Lemos a fonte que vazou do Claude Code. Eis como funciona a sua memória
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  O código fonte que vazou do Claude Code revela uma memória de 4 camadas
  limitada a 200 linhas com busca apenas por grep. Aqui está como cada camada
  funciona e o que o memsearch corrige.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>O código-fonte do Claude Code foi disponibilizado publicamente por acidente. A versão 2.1.88 incluía um ficheiro de mapa fonte de 59,8 MB que deveria ter sido retirado da compilação. Esse arquivo continha a base de código TypeScript completa e legível - 512.000 linhas, agora espelhadas no GitHub.</p>
<p>O <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">sistema de memória</a> chamou nossa atenção. O Claude Code é o agente de codificação de IA mais popular do mercado, e a memória é a parte com a qual a maioria dos utilizadores interage sem compreender como funciona nos bastidores. Por isso, fomos investigar.</p>
<p>A versão resumida: A memória do Claude Code é mais básica do que se pensa. Tem um limite máximo de 200 linhas de notas. Só consegue encontrar memórias por correspondência exacta de palavras-chave - se perguntar por "conflitos de portas", mas a nota disser "mapeamento docker-compose", não obtém nada. E nada disso sai do Claude Code. Se mudarmos para um agente diferente, começamos do zero.</p>
<p>Aqui estão as quatro camadas:</p>
<ul>
<li><strong>CLAUDE.md</strong> - um arquivo que você mesmo escreve com regras para o Claude seguir. Manual, estático e limitado pela quantidade de coisas que se pensa escrever com antecedência.</li>
<li><strong>Memória automática</strong> - o Claude toma as suas próprias notas durante as sessões. Útil, mas limitado a um índice de 200 linhas, sem pesquisa por significado.</li>
<li><strong>Auto Dream</strong> - um processo de limpeza em segundo plano que consolida memórias confusas enquanto está inativo. Ajuda com a desarrumação de dias, mas não consegue ultrapassar meses.</li>
<li><strong>KAIROS</strong> - um modo daemon sempre ligado não lançado encontrado no código que vazou. Ainda não está em nenhuma versão pública.</li>
</ul>
<p>Abaixo, desempacotamos cada camada, depois cobrimos onde a arquitetura se quebra e o que construímos para resolver as lacunas.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Como funciona o CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md é um arquivo Markdown que você cria e coloca na pasta do seu projeto. Você o preenche com o que quiser que o Claude se lembre: regras de estilo de código, estrutura do projeto, comandos de teste, etapas de implantação. O Claude carrega-o no início de cada sessão.</p>
<p>Existem três escopos: nível de projeto (na raiz do repositório), pessoal (<code translate="no">~/.claude/CLAUDE.md</code>) e organizacional (configuração da empresa). Os ficheiros mais curtos são seguidos de forma mais fiável.</p>
<p>O limite é óbvio: CLAUDE.md só guarda coisas que você escreveu com antecedência. Decisões de depuração, preferências que mencionou a meio da conversa, casos extremos que descobriu em conjunto - nada disso é capturado a menos que pare e o adicione manualmente. A maioria das pessoas não o faz.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Como é que a Memória Automática funciona?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>A Memória Automática capta o que surge durante o trabalho. O Claude decide o que vale a pena guardar e escreve-o numa pasta de memória no seu computador, organizada em quatro categorias: utilizador (função e preferências), feedback (as suas correcções), projeto (decisões e contexto) e referência (onde as coisas vivem).</p>
<p>Cada nota é um ficheiro Markdown separado. O ponto de entrada é <code translate="no">MEMORY.md</code> - um índice em que cada linha é uma etiqueta curta (menos de 150 caracteres) que aponta para um ficheiro detalhado. O Claude lê o índice e depois puxa ficheiros específicos quando estes parecem relevantes.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>As primeiras 200 linhas do MEMORY.md são carregadas em todas as sessões. Qualquer coisa além disso é invisível.</p>
<p>Uma escolha de projeto inteligente: o prompt do sistema vazado diz ao Claude para tratar sua própria memória como uma dica, não um fato. Ele verifica com o código real antes de agir em qualquer coisa lembrada, o que ajuda a reduzir alucinações - um padrão que outros <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">frameworks de agentes de IA</a> estão começando a adotar.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Como é que o Auto Dream consolida as memórias obsoletas?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>O Auto Memory captura notas, mas depois de semanas de uso essas notas ficam obsoletas. Uma entrada que diz "bug de implantação de ontem" torna-se sem sentido uma semana depois. Uma nota diz que você usa PostgreSQL; uma nota mais recente diz que você migrou para MySQL. Os ficheiros eliminados continuam a ter entradas de memória. O índice enche-se de contradições e referências desactualizadas.</p>
<p>O Auto Dream é o processo de limpeza. Ele é executado em segundo plano e:</p>
<ul>
<li>Substitui referências temporais vagas por datas exactas. "Problema de implementação de ontem" → "Problema de implementação de 2026-03-28".</li>
<li>Resolve contradições. Nota PostgreSQL + nota MySQL → mantém a verdade atual.</li>
<li>Elimina entradas obsoletas. As notas que referenciam ficheiros apagados ou tarefas concluídas são removidas.</li>
<li>Mantém <code translate="no">MEMORY.md</code> com menos de 200 linhas.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Condições de ativação:</strong> mais de 24 horas desde a última limpeza E pelo menos 5 novas sessões acumuladas. Também pode escrever "dream" para o executar manualmente. O processo é executado num sub-agente em segundo plano - tal como o sono real, não interrompe o seu trabalho ativo.</p>
<p>A mensagem de sistema do agente de sonho começa com: <em>"Está a realizar um sonho - uma passagem reflexiva sobre os seus ficheiros de memória."</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">O que é o KAIROS? O modo sempre ativo do Claude Code, ainda não lançado<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>As três primeiras camadas estão activas ou a ser lançadas. O código que vazou também contém algo que não foi lançado: KAIROS.</p>
<p>KAIROS - aparentemente com o nome da palavra grega para "o momento certo" - aparece mais de 150 vezes no código fonte. Transformaria o Claude Code de uma ferramenta que se usa ativamente num assistente de fundo que vigia o projeto continuamente.</p>
<p>Com base no código que vazou, o KAIROS:</p>
<ul>
<li>Mantém um registo contínuo de observações, decisões e acções ao longo do dia.</li>
<li>Faz o check-in num temporizador. Em intervalos regulares, recebe um sinal e decide: agir ou ficar quieto.</li>
<li>Fica fora do teu caminho. Qualquer ação que o bloqueie durante mais de 15 segundos é adiada.</li>
<li>Executa internamente a limpeza dos sonhos, além de um loop completo de observar-pensar-agir em segundo plano.</li>
<li>Tem ferramentas exclusivas que o Claude Code normal não tem: enviar arquivos para você, enviar notificações, monitorar suas solicitações de pull do GitHub.</li>
</ul>
<p>KAIROS está por trás de um sinalizador de recurso de tempo de compilação. Não está em nenhuma compilação pública. Pense nisso como o Anthropic explorando o que acontece quando <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">a memória do agente</a> deixa de ser sessão por sessão e se torna sempre ativa.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Onde é que a arquitetura de memória do Claude Code falha?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>A memória do Claude Code faz um trabalho real. Mas cinco limitações estruturais restringem o que ela pode fazer à medida que os projetos crescem.</p>
<table>
<thead>
<tr><th>Limitação</th><th>O que acontece</th></tr>
</thead>
<tbody>
<tr><td><strong>Limite de índice de 200 linhas</strong></td><td><code translate="no">MEMORY.md</code> contém ~25 KB. Execute um projeto por meses, e as entradas antigas são empurradas para fora por novas entradas. "Qual foi a configuração do Redis que escolhemos na semana passada?" - desapareceu.</td></tr>
<tr><td><strong>Recuperação apenas com Grep</strong></td><td>A pesquisa na memória usa <a href="https://milvus.io/docs/full-text-search.md">correspondência</a> literal <a href="https://milvus.io/docs/full-text-search.md">de palavras-chave</a>. Você se lembra de "conflitos de porta em tempo de implantação", mas a nota diz "mapeamento de porta docker-compose". O Grep não consegue preencher essa lacuna.</td></tr>
<tr><td><strong>Apenas resumos, sem raciocínio</strong></td><td>A Memória Automática salva notas de alto nível, não as etapas de depuração ou o raciocínio que o levou até lá. O <em>como</em> é perdido.</td></tr>
<tr><td><strong>A complexidade acumula-se sem corrigir a base</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Cada camada existe porque a anterior não foi suficiente. Mas nenhuma camada altera o que está por baixo: uma ferramenta, ficheiros locais, captura sessão a sessão.</td></tr>
<tr><td><strong>A memória está trancada dentro do Claude Code</strong></td><td>Mude para OpenCode, Codex CLI ou qualquer outro agente e começa do zero. Sem exportação, sem formato partilhado, sem portabilidade.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isso não são bugs. São os limites naturais da arquitetura de ferramenta única e ficheiro local. Novos agentes são lançados todos os meses, os fluxos de trabalho mudam, mas o conhecimento acumulado em um projeto não deve desaparecer com eles. É por isso que criámos <a href="https://github.com/zilliztech/memsearch">o memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">O que é memsearch? Memória persistente para qualquer agente de codificação de IA<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">O memsearch</a> retira a memória do agente e a coloca em sua própria camada. Os agentes vêm e vão. A memória fica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Como instalar o memsearch</h3><p>Os utilizadores do Claude Code instalam a partir do mercado:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Pronto. Nenhuma configuração necessária.</p>
<p>Outras plataformas são igualmente simples. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. API Python via uv ou pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">O que é que o memsearch captura?</h3><p>Uma vez instalado, o memsearch se conecta ao ciclo de vida do agente. Cada conversa é resumida e indexada automaticamente. Quando o usuário faz uma pergunta que precisa de histórico, o recall é acionado por conta própria.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Os ficheiros de memória são armazenados como Markdown datado - um ficheiro por dia:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>Pode abrir, ler e editar ficheiros de memória em qualquer editor de texto. Se quiser migrar, copie a pasta. Se pretender o controlo de versões, o git funciona nativamente.</p>
<p>O <a href="https://milvus.io/docs/index-explained.md">índice vetorial</a> armazenado no <a href="https://milvus.io/docs/overview.md">Milvus</a> é uma camada de cache - se alguma vez se perder, pode reconstruí-lo a partir dos ficheiros Markdown. Os seus dados estão nos ficheiros, não no índice.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Como é que o memsearch encontra memórias? Busca Semântica vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>A recuperação de memórias do Claude Code usa grep - correspondência literal de palavras-chave. Isso funciona quando se tem algumas dúzias de notas, mas quebra depois de meses de história, quando não se consegue lembrar a palavra exacta.</p>
<p>Em vez disso, o memsearch utiliza <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">a pesquisa híbrida</a>. <a href="https://zilliz.com/glossary/semantic-search">Os vectores semânticos</a> encontram conteúdo relacionado com a sua consulta mesmo quando o texto é diferente, enquanto o BM25 corresponde a palavras-chave exactas. <a href="https://milvus.io/docs/rrf-ranker.md">A RRF (Reciprocal Rank Fusion)</a> funde e classifica ambos os conjuntos de resultados em conjunto.</p>
<p>Digamos que pergunta "Como é que resolvemos aquele timeout do Redis na semana passada?" - a pesquisa semântica compreende a intenção e encontra-a. Digamos que pergunta &quot;search for <code translate="no">handleTimeout</code>&quot; - a BM25 encontra o nome exato da função. Os dois caminhos cobrem os pontos cegos um do outro.</p>
<p>Quando a chamada é acionada, o sub-agente pesquisa em três fases, aprofundando apenas quando necessário:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Pesquisa semântica - Pré-visualizações curtas</h3><p>O sub-agente executa <code translate="no">memsearch search</code> contra o índice Milvus e extrai os resultados mais relevantes:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Cada resultado apresenta uma pontuação de relevância, ficheiro de origem e uma pré-visualização de 200 caracteres. A maioria das consultas pára aqui.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Contexto completo - Expandir um resultado específico</h3><p>Se a pré-visualização de L1 não for suficiente, o sub-agente executa <code translate="no">memsearch expand a3f8c1</code> para obter a entrada completa:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Transcrição da conversa em bruto</h3><p>Nos casos raros em que é necessário ver exatamente o que foi dito, o sub-agente extrai a troca original:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>A transcrição preserva tudo: as suas palavras exactas, a resposta exacta do agente e todas as chamadas de ferramentas. As três fases vão do mais leve ao mais pesado - o sub-agente decide a profundidade da pesquisa e, em seguida, devolve os resultados organizados à sua sessão principal.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Como é que o memsearch partilha a memória entre os agentes de codificação de IA?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta é a diferença mais fundamental entre o memsearch e a memória do Claude Code.</p>
<p>A memória do Claude Code está trancada dentro de uma ferramenta. Use OpenCode, OpenClaw, ou Codex CLI, e você começa do zero. O MEMORY.md é local, vinculado a um utilizador e a um agente.</p>
<p>O memsearch suporta quatro agentes de codificação: Claude Code, OpenClaw, OpenCode e Codex CLI. Eles compartilham o mesmo formato de memória Markdown e a mesma <a href="https://milvus.io/docs/manage-collections.md">coleção Milvus</a>. As memórias escritas a partir de qualquer agente são pesquisáveis a partir de todos os outros agentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dois cenários reais:</strong></p>
<p><strong>Troca de ferramentas.</strong> Você passa uma tarde no Claude Code tentando descobrir o pipeline de implantação, encontrando vários problemas. As conversas são resumidas e indexadas automaticamente. No dia seguinte, você muda para o OpenCode e pergunta "como resolvemos aquele conflito de portas ontem?" O OpenCode pesquisa no memsearch, encontra as memórias do Claude Code de ontem e dá-lhe a resposta certa.</p>
<p><strong>Colaboração em equipa.</strong> Aponte o backend do Milvus para o <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> e vários programadores em máquinas diferentes, usando agentes diferentes, lêem e escrevem a mesma memória de projeto. Um novo membro da equipa entra e não precisa de procurar em meses de Slack e documentos - o agente já sabe.</p>
<h2 id="Developer-API" class="common-anchor-header">API do desenvolvedor<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Se estiver a construir as suas próprias <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">ferramentas de agente</a>, o memsearch fornece uma CLI e uma API Python.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>API Python:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sob o capô, o Milvus lida com a pesquisa vetorial. Execute localmente com <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (configuração zero), colabore via <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (camada gratuita disponível) ou auto-hospedagem com Docker. <a href="https://milvus.io/docs/embeddings.md">Embeddings</a> predefinidos para ONNX - funciona em CPU, sem necessidade de GPU. Troque por OpenAI ou Ollama a qualquer momento.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch: Comparação completa<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Funcionalidade</th><th>Memória do código Claude</th><th>pesquisa de memória</th></tr>
</thead>
<tbody>
<tr><td>O que é guardado</td><td>O que o Claude considera importante</td><td>Todas as conversas, resumidas automaticamente</td></tr>
<tr><td>Limite de armazenamento</td><td>~200 linhas de índice (~25 KB)</td><td>Ilimitado (ficheiros diários + índice vetorial)</td></tr>
<tr><td>Encontrar memórias antigas</td><td>Correspondência de palavras-chave Grep</td><td>Pesquisa híbrida baseada no significado + palavra-chave (Milvus)</td></tr>
<tr><td>Consegue lê-las?</td><td>Verificar manualmente a pasta de memórias</td><td>Abrir qualquer ficheiro .md</td></tr>
<tr><td>Consegue editá-los?</td><td>Editar ficheiros à mão</td><td>O mesmo - reindexação automática ao salvar</td></tr>
<tr><td>Controlo de versões</td><td>Não foi concebido para isso</td><td>O git funciona nativamente</td></tr>
<tr><td>Suporte a várias ferramentas</td><td>Apenas o código Claude</td><td>4 agentes, memória partilhada</td></tr>
<tr><td>Recordação a longo prazo</td><td>Degrada-se após semanas</td><td>Persistente ao longo de meses</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Começar a usar o memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>A memória de Claude Code tem verdadeiros pontos fortes - o design auto-cético, o conceito de consolidação de sonhos e o orçamento de bloqueio de 15 segundos no KAIROS. O Anthropic está a pensar muito sobre este problema.</p>
<p>Mas a memória de uma única ferramenta tem um limite máximo. Quando o seu fluxo de trabalho abrange vários agentes, várias pessoas ou mais do que algumas semanas de história, precisa de uma memória que exista por si só.</p>
<ul>
<li>Experimente <a href="https://github.com/zilliztech/memsearch">o memsearch</a> - código aberto, licenciado pelo MIT. Instale no Claude Code com dois comandos.</li>
<li>Leia <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">como o memsearch funciona nos bastidores</a> ou o <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">guia do plug-in do Claude Code</a>.</li>
<li>Tem perguntas? Junte-se à <a href="https://discord.com/invite/8uyFbECzPX">comunidade Milvus Discord</a> ou <a href="https://milvus.io/office-hours">marque uma sessão gratuita do Office Hours</a> para analisar o seu caso de utilização.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Perguntas frequentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Como o sistema de memória do Claude Code funciona nos bastidores?</h3><p>O Claude Code usa uma arquitetura de memória de quatro camadas, todas armazenadas como arquivos Markdown locais. CLAUDE.md é um arquivo de regras estáticas que você escreve manualmente. A Memória Automática permite ao Claude guardar as suas próprias notas durante as sessões, organizadas em quatro categorias - preferências do utilizador, feedback, contexto do projeto e indicadores de referência. O Auto Dream consolida memórias obsoletas em segundo plano. KAIROS é um daemon sempre ligado não lançado encontrado no código fonte que vazou. Todo o sistema está limitado a um índice de 200 linhas e só pode ser pesquisado por correspondência exacta de palavras-chave - não há pesquisa semântica nem recordação baseada no significado.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Os agentes de codificação de IA podem partilhar memória entre diferentes ferramentas?</h3><p>Não nativamente. A memória do Claude Code está bloqueada ao Claude Code - não existe um formato de exportação ou um protocolo entre agentes. Se mudar para o OpenCode, Codex CLI ou OpenClaw, começa do zero. O memsearch resolve isto armazenando memórias como ficheiros Markdown datados indexados numa <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> (Milvus). Todos os quatro agentes suportados lêem e escrevem o mesmo armazenamento de memória, pelo que o contexto é transferido automaticamente quando muda de ferramenta.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">Qual é a diferença entre a pesquisa por palavra-chave e a pesquisa semântica para a memória do agente?</h3><p>A pesquisa por palavra-chave (grep) corresponde a cadeias de caracteres exatas - se sua memória diz "docker-compose port mapping", mas você pesquisa "port conflicts", ela não retorna nada. A pesquisa semântica converte o texto em <a href="https://zilliz.com/glossary/vector-embeddings">vetores</a> que capturam o significado, de modo que os conceitos relacionados correspondem mesmo com palavras diferentes. O memsearch combina as duas abordagens com a pesquisa híbrida, fornecendo recuperação baseada em significado e precisão exata de palavras-chave em uma única consulta.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">O que é que foi divulgado no incidente do código fonte do Claude Code?</h3><p>A versão 2.1.88 do Claude Code foi enviada com um ficheiro de mapa de código fonte de 59,8 MB que deveria ter sido retirado da compilação de produção. O arquivo continha a base de código TypeScript completa e legível - cerca de 512.000 linhas - incluindo a implementação completa do sistema de memória, o processo de consolidação do Auto Dream e referências ao KAIROS, um modo de agente sempre ativo não lançado. O código foi rapidamente espelhado no GitHub antes que pudesse ser retirado.</p>

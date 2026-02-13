---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: Extraímos o sistema de memória do OpenClaw e abrimo-lo (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Extraímos a arquitetura de memória AI do OpenClaw para o memsearch - uma
  biblioteca Python autónoma com registos Markdown, pesquisa vetorial híbrida e
  suporte Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O OpenClaw</a> (anteriormente clawdbot e moltbot) está a tornar-se viral - <a href="https://github.com/openclaw/openclaw">mais de 189 mil estrelas no GitHub</a> em menos de duas semanas. É uma loucura. A maior parte do burburinho gira em torno de seus recursos autônomos e agênticos nos canais de bate-papo do dia a dia, incluindo iMessages, WhatsApp, Slack, Telegram e muito mais.</p>
<p>Mas como engenheiros a trabalhar num sistema de base de dados vetorial, o que realmente nos chamou a atenção foi <strong>a abordagem do OpenClaw à memória de longo prazo</strong>. Ao contrário da maioria dos sistemas de memória existentes, o OpenClaw faz com que a sua IA escreva automaticamente registos diários como ficheiros Markdown. Esses ficheiros são a fonte da verdade e o modelo apenas se "lembra" do que é escrito no disco. Os programadores humanos podem abrir esses ficheiros Markdown, editá-los diretamente, destilar princípios de longo prazo e ver exatamente aquilo de que a IA se lembra em qualquer momento. Sem caixas negras. Honestamente, é uma das arquitecturas de memória mais limpas e fáceis de desenvolver que já vimos.</p>
<p>Então, naturalmente, tivemos uma pergunta: <strong><em>por que isso só funcionaria dentro do OpenClaw? E se qualquer agente pudesse ter uma memória como essa?</em></strong> Pegamos a arquitetura de memória exata do OpenClaw e criamos <a href="https://github.com/zilliztech/memsearch">o memsearch</a> - uma biblioteca de memória de longo prazo independente, plug-and-play, que fornece a qualquer agente uma memória persistente, transparente e editável por humanos. Não há dependência do restante do OpenClaw. Basta inseri-la e o seu agente obtém memória duradoura com pesquisa alimentada por Milvus/Zilliz Cloud, além de registos Markdown como a fonte canónica da verdade.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (código aberto, licença MIT)</p></li>
<li><p><strong>Documentação:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Plugin do código Claude:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">O que torna a memória do OpenClaw diferente<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar na arquitetura de memória do OpenClaw, vamos esclarecer dois conceitos: <strong>contexto</strong> e <strong>memória</strong>. Eles parecem semelhantes, mas funcionam de forma muito diferente na prática.</p>
<ul>
<li><p><strong>O contexto</strong> é tudo o que o agente vê num único pedido - avisos do sistema, ficheiros de orientação ao nível do projeto como <code translate="no">AGENTS.md</code> e <code translate="no">SOUL.md</code>, histórico de conversação (mensagens, chamadas de ferramentas, resumos comprimidos) e a mensagem atual do utilizador. É limitado a uma sessão e é relativamente compacto.</p></li>
<li><p><strong>A memória</strong> é o que persiste ao longo das sessões. Está no disco local: o histórico completo das conversas anteriores, os ficheiros com que o agente trabalhou e as preferências do utilizador. Não é resumido. Não compactado. O material bruto.</p></li>
</ul>
<p>Agora, aqui está a decisão de design que torna a abordagem do OpenClaw especial: <strong>toda a memória é armazenada como arquivos Markdown simples no sistema de arquivos local.</strong> Após cada sessão, a IA escreve automaticamente actualizações nesses registos Markdown. O utilizador - e qualquer programador - pode abri-los, editá-los, reorganizá-los, apagá-los ou refiná-los. Entretanto, a base de dados vetorial acompanha este sistema, criando e mantendo um índice para recuperação. Sempre que um ficheiro Markdown é alterado, o sistema detecta a alteração e volta a indexá-lo automaticamente.</p>
<p>Se já utilizou ferramentas como o Mem0 ou o Zep, notará imediatamente a diferença. Esses sistemas armazenam memórias como embeddings - essa é a única cópia. Não é possível ler o que o agente se lembra. Não é possível corrigir uma má memória editando uma linha. A abordagem do OpenClaw dá-lhe ambas: a transparência dos ficheiros simples <strong>e</strong> o poder de recuperação da pesquisa vetorial utilizando uma base de dados vetorial. Pode lê-lo, <code translate="no">git diff</code>, grepá-lo - são apenas ficheiros.</p>
<p>A única desvantagem? Neste momento, este sistema de memória Markdown-first está fortemente interligado com todo o ecossistema OpenClaw - o processo Gateway, conectores de plataforma, configuração do espaço de trabalho e infraestrutura de mensagens. Se você quer apenas o modelo de memória, é muita maquinaria para arrastar.</p>
<p>Foi exatamente por isso que construímos <a href="http://github.com/zilliztech/memsearch"><strong>o memsearch</strong></a>: a mesma filosofia - Markdown como fonte de verdade, indexação automática de vectores, totalmente editável por humanos - mas fornecida como uma biblioteca leve e autónoma que pode ser inserida em qualquer arquitetura agêntica.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Como funciona o Memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Como mencionado anteriormente, <a href="https://github.com/zilliztech/memsearch">memsearch</a> é uma biblioteca de memória de longo prazo totalmente independente que implementa a mesma arquitetura de memória usada no OpenClaw - sem trazer o resto da pilha do OpenClaw. Você pode conectá-la a qualquer estrutura de agente (Claude, GPT, Llama, agentes personalizados, mecanismos de fluxo de trabalho) e instantaneamente dar ao seu sistema uma memória persistente, transparente e editável por humanos.</p>
<p>Toda a memória do agente no memsearch é armazenada como Markdown de texto simples em um diretório local. A estrutura é intencionalmente simples para que os desenvolvedores possam entendê-la num piscar de olhos:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>O Memsearch usa <a href="https://milvus.io/"><strong>o Milvus</strong></a> como base de dados vetorial para indexar estes ficheiros Markdown para uma rápida recuperação semântica. Mas, crucialmente, o índice vetorial <em>não</em> é a fonte da verdade - os arquivos são. Se eliminar totalmente o índice do Milvus, <strong>não perde nada.</strong> O Memsearch simplesmente reintegra e reindexa os arquivos Markdown, reconstruindo a camada de recuperação completa em poucos minutos. Isso significa que a memória do seu agente é transparente, durável e totalmente reconstruível.</p>
<p>Aqui estão os principais recursos do memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Markdown legível torna a depuração tão simples quanto editar um arquivo</h3><p>A depuração da memória da IA geralmente é dolorosa. Quando um agente produz uma resposta errada, a maioria dos sistemas de memória não oferece uma maneira clara de ver <em>o que</em> ele realmente armazenou. O fluxo de trabalho típico é escrever código personalizado para consultar uma API de memória e, em seguida, peneirar embeddings opacos ou blobs JSON detalhados - nenhum dos quais informa muito sobre o estado interno real da IA.</p>
<p><strong>O memsearch elimina toda essa classe de problemas.</strong> Toda a memória vive na pasta memory/ como Markdown simples:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Se a IA se enganar em alguma coisa, corrigi-la é tão simples como editar o ficheiro. Actualize a entrada, guarde, e o memsearch reindexa automaticamente a alteração. Cinco segundos. Sem chamadas à API. Sem ferramentas. Nenhum mistério. Depura-se a memória de IA da mesma forma que se depura a documentação - editando um ficheiro.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Memória suportada por Git significa que as equipas podem acompanhar, rever e reverter alterações</h3><p>A memória de IA que vive em um banco de dados é difícil de colaborar. Descobrir quem alterou o quê e quando significa vasculhar os registos de auditoria, e muitas soluções nem sequer os fornecem. As alterações acontecem silenciosamente e os desacordos sobre o que a IA deve lembrar não têm um caminho de resolução claro. As equipas acabam por se basear em mensagens do Slack e em suposições.</p>
<p>O Memsearch resolve este problema ao tornar a memória apenas ficheiros Markdown - o que significa que <strong>o Git trata automaticamente do controlo de versões</strong>. Um único comando mostra todo o histórico:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Agora a memória de IA participa do mesmo fluxo de trabalho que o código. Decisões de arquitetura, actualizações de configuração e alterações de preferências aparecem em diffs que qualquer pessoa pode comentar, aprovar ou reverter:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">A memória de texto simples torna a migração quase sem esforço</h3><p>A migração é um dos maiores custos ocultos dos frameworks de memória. Mudar de uma ferramenta para outra geralmente significa exportar dados, converter formatos, reimportar e esperar que os campos sejam compatíveis. Esse tipo de trabalho pode facilmente consumir metade de um dia, e o resultado nunca é garantido.</p>
<p>O memsearch evita totalmente o problema porque a memória é Markdown em texto simples. Não há nenhum formato proprietário, nenhum esquema para traduzir, nada para migrar:</p>
<ul>
<li><p><strong>Trocar de máquina:</strong> <code translate="no">rsync</code> a pasta de memória. Feito.</p></li>
<li><p><strong>Mudar os modelos de incorporação:</strong> Executar novamente o comando index. Demora cinco minutos, e os ficheiros markdown permanecem intactos.</p></li>
<li><p><strong>Mudar a implantação do banco de dados vetorial:</strong> Altere um valor de configuração. Por exemplo, passar do Milvus Lite em desenvolvimento para o Zilliz Cloud em produção:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Os seus ficheiros de memória permanecem exatamente os mesmos. A infraestrutura em torno deles pode evoluir livremente. O resultado é a portabilidade a longo prazo - uma propriedade rara em sistemas de IA.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">Ficheiros Markdown partilhados permitem que humanos e agentes sejam co-autores da memória</h3><p>Na maioria das soluções de memória, editar o que a IA lembra requer escrever código em uma API. Isso significa que apenas os programadores podem manter a memória da IA e, mesmo para eles, é complicado.</p>
<p>O Memsearch permite uma divisão de responsabilidades mais natural:</p>
<ul>
<li><p><strong>A IA trata:</strong> Registos diários automáticos (<code translate="no">YYYY-MM-DD.md</code>) com detalhes de execução como "implementado v2.3.1, 12% de melhoria de desempenho".</p></li>
<li><p><strong>Os humanos tratam:</strong> Princípios de longo prazo em <code translate="no">MEMORY.md</code>, como "Team stack: Python + FastAPI + PostgreSQL."</p></li>
</ul>
<p>Ambos os lados editam os mesmos ficheiros Markdown com as ferramentas que já utilizam. Sem chamadas de API, sem ferramentas especiais, sem gatekeeper. Quando a memória está trancada dentro de um banco de dados, esse tipo de autoria compartilhada não é possível. memsearch torna isso o padrão.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Sob o capô: memsearch funciona em quatro fluxos de trabalho que mantêm a memória rápida, fresca e enxuta<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O memsearch tem quatro fluxos de trabalho principais: <strong>Observar</strong> (monitorar) → <strong>Indexar</strong> (dividir e incorporar) → <strong>Pesquisar</strong> (recuperar) → <strong>Compactar</strong> (resumir). Eis o que cada um deles faz.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Observar: Re-Indexar automaticamente em cada ficheiro guardado</h3><p>O fluxo de trabalho <strong>Watch</strong> monitoriza todos os ficheiros Markdown no diretório memory/ e desencadeia uma re-indexação sempre que um ficheiro é modificado e guardado. Um <strong>atraso de 1500ms</strong> garante que as actualizações são detectadas sem desperdiçar computação: se ocorrerem várias gravações numa sucessão rápida, o temporizador reinicia e dispara apenas quando as edições estabilizarem.</p>
<p>Esse atraso é ajustado empiricamente:</p>
<ul>
<li><p><strong>100ms</strong> → demasiado sensível; dispara em cada batida de tecla, queimando as chamadas de incorporação</p></li>
<li><p><strong>10s</strong> → demasiado lento; os programadores notam um atraso</p></li>
<li><p><strong>1500ms</strong> → equilíbrio ideal entre capacidade de resposta e eficiência de recursos</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Na prática, isto significa que um programador pode escrever código numa janela e editar <code translate="no">MEMORY.md</code> noutra, adicionando um URL de documentação da API ou corrigindo uma entrada desactualizada. Guarde o ficheiro e a próxima consulta de IA recolhe a nova memória. Sem reiniciar, sem re-indexação manual.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Indexação: Chunking inteligente, desduplicação e incorporação com reconhecimento de versão</h3><p>O Index é o fluxo de trabalho crítico para o desempenho. Ele lida com três coisas: <strong>chunking, deduplicação e IDs de chunk com versão.</strong></p>
<p><strong>A</strong> divisão em pedaços divide o texto ao longo de limites semânticos - títulos e seus corpos - para que o conteúdo relacionado permaneça junto. Isso evita casos em que uma frase como "configuração do Redis" é dividida em pedaços.</p>
<p>Por exemplo, este Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Torna-se dois pedaços:</p>
<ul>
<li><p>Fragmento 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Fragmento 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>A deduplicação</strong> usa um hash SHA-256 de cada pedaço para evitar a incorporação do mesmo texto duas vezes. Se múltiplos arquivos mencionam "PostgreSQL 16", a API de embedding é chamada uma vez, não uma vez por arquivo. Para ~500KB de texto, isso economiza cerca de <strong>$0,15/mês.</strong> Em escala, isso representa centenas de dólares.</p>
<p><strong>O design do ID do pedaço</strong> codifica tudo o que é necessário para saber se um pedaço é obsoleto. O formato é <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. O campo <code translate="no">model_version</code> é a parte importante: quando um modelo de incorporação é atualizado de <code translate="no">text-embedding-3-small</code> para <code translate="no">text-embedding-3-large</code>, as incorporações antigas tornam-se inválidas. Uma vez que a versão do modelo é incorporada no ID, o sistema identifica automaticamente quais os pedaços que necessitam de ser incorporados de novo. Não é necessária uma limpeza manual.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Pesquisa: Recuperação híbrida de vetor + BM25 para máxima precisão</h3><p>A recuperação utiliza uma abordagem de pesquisa híbrida: pesquisa vetorial ponderada a 70% e pesquisa de palavras-chave BM25 ponderada a 30%. Isto equilibra duas necessidades diferentes que surgem frequentemente na prática.</p>
<ul>
<li><p><strong>A pesquisa vetorial</strong> lida com a correspondência semântica. Uma consulta para "Redis cache config" retorna um pedaço contendo "Redis L1 cache with 5min TTL" mesmo que o texto seja diferente. Isto é útil quando o programador se lembra do conceito mas não da frase exacta.</p></li>
<li><p><strong>BM25</strong> lida com correspondência exata. Uma consulta para "PostgreSQL 16" não retorna resultados sobre "PostgreSQL 15". Isto é importante para códigos de erro, nomes de funções, e comportamentos específicos de versões, onde próximo não é suficiente.</p></li>
</ul>
<p>A divisão padrão 70/30 funciona bem para a maioria dos casos de uso. Para fluxos de trabalho que se inclinam fortemente para correspondências exatas, aumentar o peso do BM25 para 50% é uma mudança de configuração de uma linha.</p>
<p>Os resultados são devolvidos como blocos top-K (padrão 3), cada um truncado para 200 caracteres. Quando o conteúdo completo é necessário, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> carrega-o. Esta divulgação progressiva mantém a utilização da janela de contexto do LLM reduzida sem sacrificar o acesso aos detalhes.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Compacto: Resumir a memória histórica para manter o contexto limpo</h3><p>Memória acumulada eventualmente se torna um problema. Entradas antigas enchem a janela de contexto, aumentam os custos de token e adicionam ruído que degrada a qualidade da resposta. O Compact resolve este problema chamando um LLM para resumir a memória histórica numa forma condensada e, em seguida, eliminando ou arquivando os originais. Ele pode ser acionado manualmente ou programado para ser executado em um intervalo regular.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Como começar a usar o memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>O Memsearch fornece uma <strong>API Python</strong> e uma <strong>CLI</strong>, para que possa utilizá-lo dentro de estruturas de agentes ou como uma ferramenta de depuração autónoma. A configuração é mínima, e o sistema foi projetado para que o ambiente de desenvolvimento local e a implantação de produção sejam praticamente idênticos.</p>
<p>O Memsearch oferece suporte a três back-ends compatíveis com o Milvus, todos expostos por meio da <strong>mesma API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (padrão)</strong></a><strong>:</strong> Arquivo local <code translate="no">.db</code>, configuração zero, adequado para uso individual.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Auto-hospedado, suporta vários agentes que partilham dados, adequado para ambientes de equipa.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Totalmente gerido, com escalonamento automático, cópias de segurança, alta disponibilidade e isolamento. Ideal para cargas de trabalho de produção.</p></li>
</ul>
<p>Mudar do desenvolvimento local para a produção é tipicamente <strong>uma alteração de configuração de uma linha</strong>. O seu código permanece o mesmo.</p>
<h3 id="Install" class="common-anchor-header">Instalar</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>O memsearch também suporta vários fornecedores de incorporação, incluindo OpenAI, Google, Voyage, Ollama e modelos locais. Isso garante que sua arquitetura de memória permaneça portátil e independente de fornecedor.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Opção 1: API Python (integrada à sua estrutura de agente)</h3><p>Aqui está um exemplo mínimo de um loop de agente completo usando memsearch. Você pode copiar/colar e modificar conforme necessário:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Isto mostra o ciclo principal:</p>
<ul>
<li><p><strong>Lembre-se</strong>: o memsearch executa a recuperação híbrida de vetor + BM25</p></li>
<li><p><strong>Pense</strong>: o seu LLM processa a entrada do utilizador + memória recuperada</p></li>
<li><p><strong>Lembre-se</strong>: o agente escreve nova memória no Markdown e o memsearch actualiza o seu índice</p></li>
</ul>
<p>Este padrão encaixa naturalmente em qualquer sistema de agentes - LangChain, AutoGPT, routers semânticos, LangGraph ou loops de agentes personalizados. É agnóstico em relação à estrutura por design.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Opção 2: CLI (operações rápidas, bom para depuração)</h3><p>A CLI é ideal para fluxos de trabalho autónomos, verificações rápidas ou inspeção de memória durante o desenvolvimento:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>A CLI espelha as capacidades da API Python mas funciona sem escrever qualquer código - ótimo para depuração, inspecções, migrações ou validação da sua estrutura de pastas de memória.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Como o memsearch se compara a outras soluções de memória<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>A pergunta mais comum que os desenvolvedores fazem é por que eles usariam o memsearch quando já existem opções estabelecidas. A resposta curta: o memsearch troca recursos avançados, como gráficos de conhecimento temporal, por transparência, portabilidade e simplicidade. Para a maioria dos casos de uso de memória de agente, essa é a troca certa.</p>
<table>
<thead>
<tr><th>Solução</th><th>Pontos fortes</th><th>Limitações</th><th>Melhor para</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Memória de texto simples transparente, coautoria humano-IA, fricção de migração zero, depuração fácil, Git-nativo</td><td>Sem gráficos temporais incorporados ou estruturas complexas de memória multiagente</td><td>Equipas que valorizam o controlo, a simplicidade e a portabilidade na memória de longo prazo</td></tr>
<tr><td>Mem0</td><td>Totalmente gerida, sem infra-estruturas para executar ou manter</td><td>Opaco - não é possível inspecionar ou editar manualmente a memória; os embeddings são a única representação</td><td>Equipas que pretendem um serviço gerido sem intervenção e que não se importam com menos visibilidade</td></tr>
<tr><td>Zep</td><td>Conjunto rico de funcionalidades: memória temporal, modelação multi-persona, gráficos de conhecimento complexos</td><td>Arquitetura pesada; mais peças móveis; mais difícil de aprender e operar</td><td>Agentes que necessitam efetivamente de estruturas de memória avançadas ou de raciocínio com conhecimento do tempo</td></tr>
<tr><td>LangMem / Letta</td><td>Integração profunda e sem falhas nos seus próprios ecossistemas</td><td>Bloqueio da estrutura; difícil de transferir para outras pilhas de agentes</td><td>As equipas já estão comprometidas com essas estruturas específicas</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">Comece a usar o memsearch e junte-se ao projeto<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch é totalmente open source sob a licença MIT, e o repositório está pronto para experiências de produção hoje.</p>
<ul>
<li><p><strong>Repositório:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Documentos:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Se está a construir um agente que precisa de se lembrar de coisas através de sessões e quer ter controlo total sobre o que se lembra, vale a pena dar uma vista de olhos ao memsearch. A biblioteca é instalada com um único <code translate="no">pip install</code>, funciona com qualquer estrutura de agente e armazena tudo como Markdown que pode ser lido, editado e versionado com o Git.</p>
<p>Estamos desenvolvendo ativamente o memsearch e gostaríamos de receber contribuições da comunidade.</p>
<ul>
<li><p>Abra um problema se algo quebrar.</p></li>
<li><p>Envie um PR se quiser estender a biblioteca.</p></li>
<li><p>Dê uma estrela ao repositório se a filosofia Markdown-as-source-of-truth lhe agrada.</p></li>
</ul>
<p>O sistema de memória do OpenClaw não está mais trancado dentro do OpenClaw. Agora, qualquer um pode usá-lo.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continue lendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">O que é o OpenClaw? Guia completo para o agente de IA de código aberto</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial do OpenClaw: Conectar ao Slack para Assistente de IA Local</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Construir agentes de IA do tipo Clawdbot com LangGraph e Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG vs. agentes de longa duração: O RAG é obsoleto?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Crie uma habilidade antrópica personalizada para o Milvus para ativar rapidamente o RAG</a></p></li>
</ul>

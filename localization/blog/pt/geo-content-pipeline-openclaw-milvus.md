---
id: geo-content-pipeline-openclaw-milvus.md
title: >-
  Conteúdo GEO em grande escala: Como classificar na pesquisa de IA sem
  envenenar a sua marca
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: >-
  O seu tráfego orgânico está a diminuir à medida que as respostas de IA
  substituem os cliques. Saiba como gerar conteúdo GEO em escala sem as
  alucinações e os danos à marca.
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>O seu tráfego de pesquisa orgânica está a diminuir, e não é porque a sua SEO piorou. <a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">De acordo com a SparkToro</a>, cerca de 60% das pesquisas no Google terminam agora em zero cliques - os utilizadores obtêm as suas respostas a partir de resumos gerados por IA em vez de clicarem na sua página. Perplexity, ChatGPT Search, Google AI Overview - estas não são ameaças futuras. Já estão a consumir o seu tráfego.</p>
<p><strong>A otimização generativa de motores (GEO)</strong> é a forma de ripostar. Enquanto a SEO tradicional optimiza os algoritmos de classificação (palavras-chave, backlinks, velocidade da página), a GEO optimiza os modelos de IA que compõem as respostas a partir de várias fontes. O objetivo: estruturar o seu conteúdo de modo a que os motores de busca de IA citem <em>a sua marca</em> nas suas respostas.</p>
<p>O problema é que a GEO requer conteúdos a uma escala que a maioria das equipas de marketing não consegue produzir manualmente. Os modelos de IA não dependem de uma única fonte - eles sintetizam dezenas delas. Para aparecer de forma consistente, é necessária a cobertura de centenas de consultas de cauda longa, cada uma visando uma pergunta específica que um utilizador possa fazer a um assistente de IA.</p>
<p>O atalho óbvio - ter um LLM a gerar artigos em lote - cria um problema pior. Peça ao GPT-4 para produzir 50 artigos e obterá 50 artigos cheios de estatísticas fabricadas, frases recicladas e afirmações que a sua marca nunca fez. Isso não é GEO. Isso é <strong>spam de conteúdo de IA com o nome da sua marca</strong>.</p>
<p>A solução é basear cada chamada de geração em documentos de origem verificada - especificações de produtos reais, mensagens de marca aprovadas e dados reais nos quais o LLM se baseia em vez de inventar. Este tutorial apresenta um pipeline de produção que faz exatamente isso, baseado em três componentes:</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong> - uma estrutura de agente de IA de código aberto que orquestra o fluxo de trabalho e se conecta a plataformas de mensagens como Telegram, WhatsApp e Slack</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong> - uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> que trata do armazenamento de conhecimentos, da desduplicação semântica e da recuperação de RAG</li>
<li><strong>LLMs (GPT-4o, Claude, Gemini)</strong> - os motores de geração e avaliação</li>
</ul>
<p>No final, terá um sistema funcional que ingere documentos de marcas numa base de conhecimentos apoiada em Milvus, expande os tópicos de semente em consultas de cauda longa, desduplica-os semanticamente e gera artigos em lote com pontuação de qualidade incorporada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<blockquote>
<p><strong>Nota:</strong> Este é um sistema funcional criado para um fluxo de trabalho de marketing real, mas o código é um ponto de partida. É necessário adaptar os avisos, os limites de pontuação e a estrutura da base de conhecimento ao seu próprio caso de utilização.</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">Como o pipeline resolve o problema de volume × qualidade<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
<tr><th>Componente</th><th>Função</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Orquestração de agentes, integração de mensagens (Lark, Telegram, WhatsApp)</td></tr>
<tr><td>Milvus</td><td>Armazenamento de conhecimentos, deduplicação semântica, recuperação de RAG</td></tr>
<tr><td>LLMs (GPT-4o, Claude, Gemini)</td><td>Expansão de consultas, geração de artigos, pontuação da qualidade</td></tr>
<tr><td>Modelo de incorporação</td><td>Texto em vectores para Milvus (OpenAI, 1536 dimensões por defeito)</td></tr>
</tbody>
</table>
<p>O pipeline é executado em duas fases. <strong>A fase 0</strong> ingere o material de origem na base de conhecimentos. <strong>A Fase 1</strong> gera artigos a partir desse material.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Eis o que acontece na Fase 1:</p>
<ol>
<li>Um utilizador envia uma mensagem através do Lark, Telegram ou WhatsApp. O OpenClaw recebe-a e encaminha-a para a capacidade de geração GEO.</li>
<li>A competência expande o tópico do utilizador em consultas de pesquisa de cauda longa utilizando um LLM - as perguntas específicas que os utilizadores reais fazem aos motores de pesquisa de IA.</li>
<li>Cada consulta é incorporada e verificada no Milvus para detetar duplicados semânticos. As consultas demasiado semelhantes ao conteúdo existente (semelhança de cosseno &gt; 0,85) são eliminadas.</li>
<li>As consultas sobreviventes accionam a recuperação RAG de <strong>duas colecções Milvus ao mesmo tempo</strong>: a base de conhecimentos (documentos da marca) e o arquivo de artigos (conteúdo gerado anteriormente). Esta recuperação dupla mantém os resultados baseados em material de origem real.</li>
<li>O LLM gera cada artigo utilizando o contexto recuperado e, em seguida, classifica-o de acordo com uma rubrica de qualidade GEO.</li>
<li>O artigo acabado volta a ser escrito no Milvus, enriquecendo os conjuntos de deduções e RAG para o lote seguinte.</li>
</ol>
<p>A definição de competências GEO também inclui regras de otimização: começar com uma resposta direta, utilizar uma formatação estruturada, citar explicitamente as fontes e incluir uma análise original. Os motores de pesquisa de IA analisam o conteúdo por estrutura e despriorizam as afirmações sem fontes, pelo que cada regra corresponde a um comportamento de recuperação específico.</p>
<p>A geração é efectuada em lotes. Uma primeira ronda é enviada ao cliente para revisão. Assim que a direção é confirmada, o pipeline é escalado para produção total.</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">Porque é que uma camada de conhecimento é a diferença entre GEO e spam de IA<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>O que separa este pipeline de "apenas solicitar ChatGPT" é a camada de conhecimento. Sem ela, o resultado do LLM parece polido mas não diz nada verificável - e os motores de busca de IA são cada vez mais bons a detetar isso. <a href="https://zilliz.com/what-is-milvus">A Milvus</a>, a base de dados vetorial que alimenta este pipeline, tem várias capacidades que são importantes aqui:</p>
<p><strong>A deduplicação semântica apanha o que as palavras-chave perdem.</strong> A correspondência de palavras-chave trata "benchmarks de desempenho do Milvus" e "Como o Milvus se compara a outros bancos de dados vetoriais?" como consultas não relacionadas. <a href="https://zilliz.com/learn/vector-similarity-search">A similaridade de vet</a> ores reconhece que eles estão fazendo a mesma pergunta, então o pipeline pula a duplicata em vez de desperdiçar uma chamada de geração.</p>
<p><strong>O RAG de coleção dupla mantém as fontes e os resultados separados.</strong> <code translate="no">geo_knowledge</code> armazena documentos de marca ingeridos. <code translate="no">geo_articles</code> armazena o conteúdo gerado. Cada consulta de geração chega a ambos - a base de conhecimentos mantém os factos exactos e o arquivo de artigos mantém o tom consistente em todo o lote. As duas colecções são mantidas de forma independente, pelo que a atualização dos materiais de origem nunca perturba os artigos existentes.</p>
<p><strong>Um ciclo de feedback que melhora com a escala.</strong> Cada artigo gerado escreve imediatamente para o Milvus. O lote seguinte tem um conjunto de deduções maior e um contexto RAG mais rico. A qualidade aumenta com o tempo.</p>
<p><strong>Várias opções de implementação para diferentes necessidades.</strong></p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite</strong></a>: Uma versão leve do Milvus que roda no seu laptop com uma linha de código, sem necessidade de Docker. Ótimo para prototipagem, e é tudo o que este tutorial requer.</p></li>
<li><p><a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus</strong></a> Standalone e Milvus Distributed: a versão mais escalável para uso em produção.</p></li>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> é um Milvus gerido com zero problemas. Não precisa de se preocupar com a configuração técnica e a manutenção. Disponível em versão gratuita.</p></li>
</ul>
<p>Este tutorial utiliza o Milvus Lite - sem conta para criar, sem instalação para além de <code translate="no">pip install pymilvus</code>, e tudo corre localmente para que possa experimentar o pipeline completo antes de se comprometer com qualquer coisa.</p>
<p>A diferença na implementação está no URI:</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">Tutorial passo a passo<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>Todo o pipeline é empacotado como um OpenClaw Skill - um diretório que contém um ficheiro de instruções <code translate="no">SKILL.MD</code> e a implementação do código.</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">Passo 1: Definir a habilidade OpenClaw</h3><p><code translate="no">SKILL.md</code> diz ao OpenClaw o que esta competência pode fazer e como a invocar. Expõe duas ferramentas: <code translate="no">geo_ingest</code> para alimentar a base de conhecimentos e <code translate="no">geo_generate</code> para a geração de artigos em lote. Também contém as regras de otimização GEO que moldam o que o LLM produz.</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">Passo 2: Registar ferramentas e fazer a ponte para Python</h3><p>O OpenClaw corre em Node.js, mas o pipeline GEO está em Python. <code translate="no">index.js</code> faz a ponte entre os dois - regista cada ferramenta no OpenClaw e delega a execução no script Python correspondente.</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">Passo 3: Ingerir material de origem</h3><p>Antes de gerar qualquer coisa, é necessária uma base de conhecimentos. <code translate="no">ingest.py</code> vai buscar páginas Web ou lê documentos locais, divide o texto em pedaços, incorpora-o e escreve-o na coleção <code translate="no">geo_knowledge</code> em Milvus. É isto que mantém o conteúdo gerado baseado em informação real e não em alucinações do LLM.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">Passo 4: Expandir consultas de cauda longa</h3><p>Dado um tópico como "base de dados de vectores Milvus", o LLM gera um conjunto de consultas de pesquisa específicas e realistas - o tipo de perguntas que os utilizadores reais escrevem nos motores de pesquisa de IA. O pedido abrange diferentes tipos de intenção: informativa, comparação, como fazer, resolução de problemas e FAQ.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">Passo 5: Deduplicar através do Milvus</h3><p>É aqui que <a href="https://zilliz.com/learn/vector-similarity-search">a pesquisa vetorial</a> ganha o seu lugar. Cada consulta expandida é incorporada e comparada com as colecções <code translate="no">geo_knowledge</code> e <code translate="no">geo_articles</code>. Se a similaridade de cosseno exceder 0,85, a consulta é uma duplicata semântica de algo que já está no sistema e é descartada - evitando que o pipeline gere cinco artigos ligeiramente diferentes que respondem à mesma pergunta.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">Passo 6: Gerar artigos com RAG de fonte dupla</h3><p>Para cada consulta sobrevivente, o gerador recupera o contexto de ambas as colecções Milvus: material de fonte autorizada de <code translate="no">geo_knowledge</code> e artigos gerados anteriormente de <code translate="no">geo_articles</code>. Esta recuperação dupla mantém o conteúdo factualmente fundamentado (base de conhecimentos) e internamente consistente (histórico de artigos).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>As duas colecções utilizam a mesma dimensão de incorporação (1536), mas armazenam metadados diferentes porque desempenham funções diferentes: <code translate="no">geo_knowledge</code> regista a origem de cada fragmento (para atribuição da fonte), enquanto <code translate="no">geo_articles</code> armazena a consulta original e a pontuação GEO (para correspondência de deduções e filtragem da qualidade).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">O modelo de dados Milvus</h3><p>Aqui está o aspeto de cada coleção se as estiver a criar do zero:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">Executar o pipeline<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Coloque o diretório <code translate="no">skills/geo-generator/</code> na pasta de competências do OpenClaw ou envie o ficheiro zip para o Lark e deixe que o OpenClaw o instale. Terá de configurar o seu <code translate="no">OPENAI_API_KEY</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A partir daí, interaja com o pipeline através de mensagens de chat:</p>
<p><strong>Exemplo 1:</strong> Ingerir URLs de origem na base de conhecimento e, em seguida, gerar artigos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Exemplo 2:</strong> Carregue um livro (Wuthering Heights), depois gere 3 artigos GEO e exporte-os para um documento Lark.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Taking-This-Pipeline-to-Production" class="common-anchor-header">Levando este pipeline para a produção<button data-href="#Taking-This-Pipeline-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Tudo neste tutorial corre em Milvus Lite, o que significa que corre no seu portátil e pára quando o seu portátil pára. Para um pipeline GEO real, isso não é suficiente. Você quer que os artigos sejam gerados enquanto você está em reuniões. Quer que a base de conhecimento esteja disponível quando um colega executar um lote na próxima terça-feira.</p>
<p>Neste ponto, há duas soluções.</p>
<p><strong>Auto-hospedar o Milvus usando o modo Autónomo ou Distribuído.</strong> A sua equipa de engenharia instala a versão completa num servidor - um computador dedicado, físico ou alugado a um fornecedor de serviços na nuvem como a AWS. É altamente capaz e dá-lhe controlo total sobre a sua implementação, mas necessita de uma equipa de engenharia dedicada para configurar, manter e escalar.</p>
<p><strong>Utilizar</strong> <a href="https://cloud.zilliz.com/signup"><strong>o Zilliz Cloud</strong></a><strong>.</strong> O Zilliz Cloud é o Milvus totalmente gerido com funcionalidades de nível empresarial mais avançadas, criado pela mesma equipa.</p>
<ul>
<li><p><strong>Sem complicações na operação e manutenção.</strong></p></li>
<li><p><strong>Nível gratuito disponível.</strong> O <a href="https://cloud.zilliz.com/signup">nível gratuito</a> inclui 5 GB de armazenamento - o suficiente para ingerir todo o <em>Wuthering Heights</em> 360 vezes, ou 360 livros. Há também uma avaliação gratuita de 30 dias para cargas de trabalho maiores.</p></li>
<li><p><strong>Sempre o primeiro da fila para novos recursos.</strong> Quando o Milvus lança melhorias, o Zilliz Cloud recebe-as automaticamente - não é preciso esperar que a sua equipa agende uma atualização.</p></li>
</ul>
<pre><code translate="no">
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># That&#x27;s the only change.</span>

client = MilvusClient(uri=MILVUS_URI)

<button class="copy-code-btn"></button></code></pre>
<p>Registe-se<a href="https://cloud.zilliz.com/signup">no Zilliz Cloud</a> e experimente-o.</p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">Quando a geração de conteúdos GEO sai pela culatra<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>A geração de conteúdo GEO só funciona tão bem quanto a base de conhecimento por trás dela. Alguns casos em que esta abordagem faz mais mal do que bem:</p>
<p><strong>Ausência de material de origem autorizado.</strong> Sem uma base de conhecimentos sólida, o LLM recorre a dados de treino. O resultado acaba por ser genérico, na melhor das hipóteses, e alucinado, na pior. O objetivo do passo RAG é fundamentar a geração em informação verificada - se não o fizer, estará apenas a fazer engenharia rápida com passos extra.</p>
<p><strong>Promover algo que não existe.</strong> Se o produto não funciona como descrito, isso não é GEO - é desinformação. A etapa de autoavaliação detecta alguns problemas de qualidade, mas não pode verificar afirmações que a base de conhecimento não contradiz.</p>
<p><strong>O seu público é puramente humano.</strong> A otimização GEO (cabeçalhos estruturados, respostas diretas no primeiro parágrafo, densidade de citações) foi concebida para ser descoberta por IA. Pode parecer estereotipado se estiver a escrever apenas para leitores humanos. Saiba qual é o seu público-alvo.</p>
<p><strong>Uma nota sobre o limite de deduções.</strong> O pipeline elimina as consultas com similaridade de cosseno acima de 0,85. Se estiverem a passar demasiadas quase duplicatas, baixe-o. Se o pipeline descartar consultas que parecem genuinamente diferentes, aumente-o. 0,85 é um ponto de partida razoável, mas o valor certo depende do quão restrito é o seu tópico.</p>
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
    </button></h2><p>O GEO está onde o SEO estava há dez anos - suficientemente cedo para que a infraestrutura correta lhe dê uma vantagem real. Este tutorial constrói um pipeline que gera artigos que os motores de busca de IA citam efetivamente, com base no material de origem da sua marca em vez de alucinações de LLM. A pilha é <a href="https://github.com/nicepkg/openclaw">OpenClaw</a> para orquestração, <a href="https://milvus.io/intro">Milvus</a> para armazenamento de conhecimento e recuperação <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, e LLMs para geração e pontuação.</p>
<p>O código fonte completo está disponível em <a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a>.</p>
<p>Se está a construir uma estratégia GEO e precisa da infraestrutura para a suportar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para ver como outras equipas estão a utilizar a pesquisa vetorial de conteúdos, a deduplicação e o RAG.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para analisar o seu caso de utilização com a equipa.</li>
<li>Se preferir saltar a configuração da infraestrutura, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) tem um nível gratuito - uma mudança de URI e está em produção.</li>
</ul>
<hr>
<p>Algumas questões que surgem quando as equipas de marketing começam a explorar o GEO:</p>
<p><strong>O meu tráfego de SEO está a diminuir.</strong>O GEO<strong>é o substituto?</strong>O GEO não substitui o SEO, mas estende-o a um novo canal. A SEO tradicional continua a gerar tráfego a partir dos utilizadores que clicam nas páginas. O GEO visa a crescente percentagem de consultas em que os utilizadores obtêm respostas diretamente da IA (Perplexity, ChatGPT Search, Google AI Overview) sem nunca visitarem um Web site. Se está a ver as taxas de zero cliques a subir nas suas análises, esse é o tráfego que o GEO foi concebido para recuperar - não através de cliques, mas através de citações da marca em respostas geradas por IA.</p>
<p><strong>Em que é que o conteúdo GEO é diferente do conteúdo normal gerado por IA?</strong>A maior parte do conteúdo gerado por IA é genérico - o LLM baseia-se em dados de treino e produz algo que parece razoável, mas que não se baseia em factos, afirmações ou dados reais da sua marca. Os conteúdos GEO baseiam-se numa base de conhecimentos de material de origem verificada, utilizando RAG (retrieval-augmented generation). A diferença está no resultado: detalhes específicos do produto em vez de generalizações vagas, números reais em vez de estatísticas fabricadas e voz consistente da marca em dezenas de artigos.</p>
<p><strong>Quantos artigos são necessários para que o GEO funcione?</strong>Não existe um número mágico, mas a lógica é simples: Os modelos de IA sintetizam várias fontes por resposta. Quanto mais consultas de cauda longa cobrir com conteúdo de qualidade, mais frequentemente a sua marca aparecerá. Comece com 20-30 artigos sobre o seu tópico principal, meça quais são citados (verifique a sua taxa de menção de IA e o tráfego de referência) e aumente a partir daí.</p>
<p><strong>Os motores de busca com IA não penalizam o conteúdo gerado em massa?</strong>Penalizam, se for de baixa qualidade. Os motores de busca de IA estão a melhorar na deteção de afirmações sem fontes, frases recicladas e conteúdos que não acrescentam valor original. É exatamente por isso que este pipeline inclui uma base de conhecimentos para fundamentação e uma etapa de autoavaliação para controlo de qualidade. O objetivo não é gerar mais conteúdo - é gerar conteúdo que seja genuinamente útil o suficiente para que os modelos de IA o citem.</p>

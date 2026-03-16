---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Construí um agente de monitorização de acções com OpenClaw, Exa e Milvus por
  $20/mês
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Um guia passo-a-passo para construir um agente de monitorização de acções de
  IA utilizando o OpenClaw, Exa e Milvus. Resumos matinais, memória comercial e
  alertas por US $ 20 / mês.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Negoceio acções americanas por fora, o que é uma forma educada de dizer que perco dinheiro como passatempo. Os meus colegas de trabalho brincam que a minha estratégia é "comprar em alta com a excitação, vender em baixa com o medo, repetir semanalmente".</p>
<p>A parte da repetição é o que me mata. Sempre que olho para o mercado, acabo por fazer uma transação que não tinha planeado. O petróleo dispara, entro em pânico. Uma ação de tecnologia sobe 4% e eu vou atrás dela. Uma semana depois, olho para o meu histórico de transacções e penso: <em>não fiz exatamente isto no trimestre passado?</em></p>
<p>Por isso, criei um agente com o OpenClaw que observa o mercado em vez de mim e me impede de cometer os mesmos erros. Não negoceia nem toca no meu dinheiro, porque isso seria um risco demasiado grande para a segurança. Em vez disso, poupa-me o tempo gasto na observação do mercado e impede-me de cometer os mesmos erros.</p>
<p>Este agente é composto por três partes e custa cerca de 20 dólares por mês:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>para executar tudo em piloto automático.</strong> O OpenClaw faz com que o agente funcione com um ritmo cardíaco de 30 minutos e só me faz pings quando algo realmente importa, o que alivia o FOMO que costumava manter-me colado ao ecrã. Antes, quanto mais eu observava os preços, mais reagia por impulso.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>para pesquisas exactas e em tempo real.</strong> O Exa pesquisa e resume fontes de informação escolhidas a dedo, de acordo com um horário, para que eu tenha um briefing limpo todas as manhãs. Antes, passava uma hora por dia a peneirar spam de SEO e especulação para encontrar notícias fiáveis - e não podia ser automatizado porque os sites financeiros são actualizados diariamente para combater os scrapers.</li>
<li><strong><a href="https://milvus.io/">M****ilvus</a></strong> <strong>para o historial e preferências pessoais.</strong> O Milvus armazena o meu histórico de transacções e o agente pesquisa-o antes de eu tomar uma decisão - se estiver prestes a repetir algo de que me arrependi, ele avisa-me. Antes, rever as transacções anteriores era suficientemente aborrecido para que eu não o fizesse, pelo que os mesmos erros continuavam a acontecer com diferentes tickers. <a href="https://zilliz.com/cloud">O Zilliz Cloud</a> é a versão totalmente gerida do Milvus. Se quiser ter uma experiência sem complicações, o Zilliz Cloud é uma óptima opção<a href="https://cloud.zilliz.com/signup?utm_page=zilliz-cloud-free-tier&amp;utm_button=banner_left&amp;_gl=1*373c3v*_gcl_au*MjEwODY2Nzk5NS4xNzY5Njg1NzY4*_ga*MTU0OTAxMzY5Ni4xNzY5Njg1NzY4*_ga_Q1F8R2NWDP*czE3NzM0MDYzOTEkbzUwJGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..*_ga_KKMVYG8YF2*czE3NzM0MDYzOTEkbzc0JGcwJHQxNzczNDA2MzkxJGo2MCRsMCRoMA..">(nível gratuito disponível</a>).</li>
</ul>
<p>Aqui está como eu o configurei, passo a passo.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Passo 1: Obter informações de mercado em tempo real com o Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes, eu tinha tentado navegar em aplicações financeiras, escrever scrapers e procurar terminais de dados profissionais. A minha experiência?  As aplicações enterravam o sinal sob o ruído, os scrapers quebravam constantemente e as APIs profissionais eram proibitivamente caras.  Exa é uma API de pesquisa criada para agentes de IA que resolve os problemas acima.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">O Exa</a></strong> é uma API de pesquisa na Web que retorna dados estruturados e prontos para IA para agentes de IA. É alimentada pelo <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (o serviço totalmente gerido da Milvus). Se o Perplexity é um motor de pesquisa utilizado por humanos, o Exa é utilizado pela IA. O agente envia uma consulta e o Exa devolve o texto do artigo, as frases-chave e os resumos como JSON - resultados estruturados que o agente pode analisar e utilizar diretamente, sem necessidade de raspagem.</p>
<p>O Exa também usa a pesquisa semântica, para que o agente possa fazer consultas em linguagem natural. Uma consulta como "Por que as ações da NVIDIA caíram apesar dos fortes ganhos do quarto trimestre de 2026" retorna análises de analistas da Reuters e da Bloomberg, não uma página de clickbait de SEO.</p>
<p>O Exa tem um nível gratuito - 1.000 pesquisas por mês, o que é mais do que suficiente para começar. Para acompanhar, instale o SDK e introduza a sua própria chave de API:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Aqui está a chamada principal:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>O parâmetro de conteúdo faz a maior parte do trabalho pesado aqui - o texto extrai o artigo completo, os destaques extraem frases-chave e o resumo gera um resumo focado com base numa pergunta fornecida por si. Uma chamada à API substitui vinte minutos de saltos de separadores.</p>
<p>Esse padrão básico cobre muita coisa, mas acabei criando quatro variações para lidar com diferentes situações que encontro regularmente:</p>
<ul>
<li><strong>Filtragem por credibilidade da fonte.</strong> Para análise de ganhos, quero apenas Reuters, Bloomberg ou Wall Street Journal - não fazendas de conteúdo reescrevendo seus relatórios doze horas depois.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Encontrar análises semelhantes.</strong> Quando leio um bom artigo, quero mais perspectivas sobre o mesmo tópico sem ter de as procurar manualmente.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Pesquisa aprofundada para questões complexas.</strong> Algumas perguntas não podem ser respondidas por um único artigo - por exemplo, como as tensões no Médio Oriente afectam as cadeias de fornecimento de semicondutores. A pesquisa aprofundada sintetiza várias fontes e devolve resumos estruturados.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Monitorização de notícias em tempo real.</strong> Durante as horas de mercado, preciso de notícias de última hora filtradas apenas para o dia atual.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>Escrevi cerca de uma dúzia de modelos utilizando estes padrões, abrangendo a política da Fed, os ganhos tecnológicos, os preços do petróleo e os indicadores macro. São executados automaticamente todas as manhãs e enviam os resultados para o meu telemóvel. O que costumava levar uma hora de navegação agora leva cinco minutos de leitura de resumos durante o café.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Passo 2: Armazenar o histórico de transacções em Milvus para decisões mais inteligentes<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>O Exa resolveu o meu problema de informação. Mas eu continuava a repetir as mesmas transacções - vendendo em pânico durante as quedas que recuperavam em poucos dias, e perseguindo o momentum em acções que já estavam sobrevalorizadas. Agia com base na emoção, arrependia-me e esquecia a lição quando surgia uma situação semelhante.</p>
<p>Precisava de uma base de conhecimentos pessoais: algo que pudesse armazenar as minhas transacções passadas, o meu raciocínio e as minhas asneiras. Não algo que eu tivesse de rever manualmente (já tinha tentado fazer isso e nunca consegui), mas algo que o agente pudesse procurar por si próprio sempre que surgisse uma situação semelhante. Se estou prestes a repetir um erro, quero que o agente me diga antes de premir o botão. Fazer corresponder a "situação atual" à "experiência passada" é um problema de pesquisa de semelhanças que as bases de dados vectoriais resolvem, por isso escolhi uma para armazenar os meus dados.</p>
<p>Utilizei <a href="https://github.com/milvus-io/milvus-lite">o Milvus Lite</a>, uma versão leve do Milvus que funciona localmente. Não tem qualquer configuração de servidor e é perfeita para criar protótipos e fazer experiências. Dividi os meus dados em três colecções. A dimensão de incorporação é 1536 para corresponder ao modelo text-embedding-3-small do OpenAI, que pode ser utilizado diretamente:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>As três colecções correspondem a três tipos de dados pessoais, cada um com uma estratégia de recuperação diferente:</p>
<table>
<thead>
<tr><th><strong>Tipo</strong></th><th><strong>O que armazena</strong></th><th><strong>Como é que o agente os utiliza</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Preferências</strong></td><td>Preconceitos, tolerância ao risco, filosofia de investimento ("Tenho tendência para manter acções de tecnologia durante demasiado tempo")</td><td>Carregado no contexto do agente em cada execução</td></tr>
<tr><td><strong>Decisões e padrões</strong></td><td>Transacções passadas específicas, lições aprendidas, observações do mercado</td><td>Recuperados através de pesquisa de semelhanças apenas quando surge uma situação relevante</td></tr>
<tr><td><strong>Conhecimento externo</strong></td><td>Relatórios de investigação, registos SEC, dados públicos</td><td>Não armazenados no Milvus - pesquisáveis através do Exa</td></tr>
</tbody>
</table>
<p>Criei três colecções diferentes porque misturá-las numa única coleção significaria aumentar o volume de cada pedido com um historial de transacções irrelevante ou perder as principais tendências quando não correspondem suficientemente à consulta atual.</p>
<p>Uma vez criadas as colecções, precisava de uma forma de as preencher automaticamente. Não queria copiar e colar informações após cada conversa com o agente, por isso criei um extrator de memória que é executado no final de cada sessão de chat.</p>
<p>O extrator faz duas coisas: extrai e desduplica. O extrator pede ao LLM para extrair informações estruturadas da conversa - decisões, preferências, padrões, lições - e encaminha cada uma delas para a coleção correta. Antes de armazenar qualquer coisa, verifica a semelhança com o que já existe. Se uma nova ideia for mais de 92% semelhante a uma entrada existente, é ignorada.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Quando me deparo com uma nova situação de mercado e me apetece negociar, o agente executa uma função de chamada. Descrevo o que está a acontecer e o agente procura o histórico relevante nas três colecções:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Por exemplo, quando as acções do sector tecnológico caíram 3-4% devido às tensões no Médio Oriente no início de março, o agente consultou três coisas: uma lição de outubro de 2024 sobre como não entrar em pânico durante uma queda geopolítica, uma nota de preferência de que tenho tendência para sobreponderar o risco geopolítico e um padrão que registei (as vendas de acções do sector tecnológico motivadas pela geopolítica recuperam normalmente em uma a três semanas).</p>
<p>A opinião do meu colega de trabalho: se os dados de treino são um registo de perdas, o que é que a IA está exatamente a aprender? Mas esse é o ponto principal - o agente não está a copiar as minhas transacções, está a memorizá-las para me poder dissuadir da próxima.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Passo 3: Ensine o seu agente a analisar com o OpenClaw Skills<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Nesta altura, o agente tem informação fiável<a href="https://exa.ai/">(Exa</a>) e memória pessoal<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Mas se entregar ambas a um LLM e disser "analise isto", obtém uma resposta genérica, que cobre tudo. Menciona todos os ângulos possíveis e conclui com "os investidores devem pesar os riscos". Mais valia não ter dito nada.</p>
<p>A solução é escrever o seu próprio quadro analítico e dá-lo ao agente sob a forma de instruções explícitas. Tem de lhe dizer quais os indicadores que lhe interessam, quais as situações que considera perigosas e quando deve ser conservador ou agressivo. Estas regras são diferentes para cada investidor, pelo que tem de ser o próprio a defini-las.</p>
<p>O OpenClaw faz isso através de Skills - ficheiros markdown num diretório skills/. Quando o agente se depara com uma situação relevante, carrega a competência correspondente e segue a sua estrutura em vez de andar à solta.</p>
<p>Aqui está uma que escrevi para avaliar acções após um relatório de ganhos:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>A última linha é a mais importante: "Sempre revele meus erros passados. Tenho tendência para deixar o medo sobrepor-se aos dados. Se o meu historial Milvus mostrar que me arrependi de vender depois de uma queda, diga-o explicitamente." Isto é eu a dizer ao agente exatamente onde é que eu erro, para que ele saiba quando deve recuar. Se construir o seu próprio, esta é a parte que personalizaria com base nos seus preconceitos.</p>
<p>Escrevi Skills semelhantes para análise de sentimentos, indicadores macro e sinais de rotação de sectores. Também escrevi Skills que simulam como os investidores que admiro avaliariam a mesma situação - a estrutura de valor de Buffett, a abordagem macro de Bridgewater. Estas competências não são decisoras; são perspectivas adicionais.</p>
<p>Um aviso: não deixe que os LLMs calculem indicadores técnicos como o RSI ou o MACD. Eles alucinam números com confiança. Calcule-os você mesmo ou chame uma API dedicada, e alimente os resultados no Skill como entradas.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Passo 4: Inicie o seu agente com o OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Tudo o que foi dito acima ainda requer que seja ativado manualmente. Se tiver de abrir um terminal sempre que quiser uma atualização, está praticamente a voltar a fazer doomscrolling da sua aplicação de corretagem durante as reuniões.</p>
<p>O mecanismo Heartbeat do OpenClaw resolve isso. Um gateway faz um ping ao agente a cada 30 minutos (configurável), e o agente verifica um ficheiro HEARTBEAT.md para decidir o que fazer nesse momento. Trata-se de um ficheiro markdown com regras baseadas no tempo:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Resultados: Menos tempo de ecrã, menos transacções impulsivas<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui está o que o sistema realmente produz no dia a dia:</p>
<ul>
<li><strong>Resumo da manhã (7:00 AM).</strong> O agente executa o Exa durante a noite, extrai as minhas posições e o histórico relevante do Milvus e envia um resumo personalizado para o meu telemóvel - menos de 500 palavras. O que aconteceu durante a noite, como se relaciona com as minhas posições e um a três itens de ação. Leio-o enquanto lavo os dentes.</li>
<li><strong>Alertas intradiários (9:30 AM-4:00 PM ET).</strong> A cada 30 minutos, o agente verifica a minha lista de observação. Se alguma ação se mover mais de 3%, recebo uma notificação com o contexto: porque a comprei, onde está a minha paragem de perda e se já estive numa situação semelhante.</li>
<li><strong>Revisão semanal (fins-de-semana).</strong> O agente compila toda a semana - movimentos do mercado, como foram comparados com as minhas expectativas matinais e padrões que vale a pena recordar. Passo 30 minutos a lê-lo no sábado. No resto da semana, afasto-me deliberadamente do ecrã.</li>
</ul>
<p>Este último ponto é a maior mudança. O agente não só poupa tempo, como também me liberta da observação do mercado. Não se pode vender em pânico se não se estiver a olhar para os preços.</p>
<p>Antes deste sistema, gastava 10 a 15 horas por semana na recolha de informações, monitorização do mercado e análise das transacções, dispersas por reuniões, tempo de deslocação e navegação nocturna. Agora são cerca de duas horas: cinco minutos no resumo matinal todos os dias, mais 30 minutos na análise do fim de semana.</p>
<p>A qualidade da informação também é melhor. Estou a ler resumos da Reuters e da Bloomberg em vez do que se tornou viral no Twitter. E, com o agente a consultar os meus erros passados sempre que me sinto tentado a agir, reduzi significativamente as minhas transacções impulsivas. Ainda não posso provar que isto fez de mim um melhor investidor, mas fez de mim um investidor menos imprudente.</p>
<p>O custo total: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>10/mês</mi><mn>para o</mn></mrow><annotation encoding="application/x-tex">OpenClaw</annotation><mrow><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">10/mês para o OpenClaw,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">10/mês para o</span><span class="mord mathnormal" style="margin-right:0.02691em;">OpenClaw</span><span class="mpunct">,</span></span></span></span>10/mês para o Exa, e um pouco de eletricidade para manter o Milvus Lite a funcionar.</p>
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
    </button></h2><p>Continuava a fazer as mesmas transacções impulsivas porque as minhas informações eram más, raramente revia o meu próprio historial e ficar a olhar para o mercado todo o dia piorava as coisas. Então, criei um agente de IA que resolve esses problemas fazendo três coisas:</p>
<ul>
<li><strong>Recolhe notícias fiáveis sobre o mercado</strong> com o <strong><a href="https://exa.ai/">Exa</a></strong>, substituindo uma hora de pesquisa em spam de SEO e sites pagos.</li>
<li><strong>Lembra-se das minhas transacções anteriores</strong> com o <a href="http://milvus.io">Milvus</a> e avisa-me quando estou prestes a repetir um erro de que já me arrependi.</li>
<li><strong>Funciona em piloto automático</strong> com o <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> e só me avisa quando algo é realmente importante.</li>
</ul>
<p>Custo total: 20 dólares por mês. O agente não negoceia nem toca no meu dinheiro.</p>
<p>A maior mudança não foram os dados ou os alertas. Foi o facto de eu ter deixado de observar o mercado. Esqueci-me completamente dele na passada quarta-feira, o que nunca tinha acontecido nos meus anos de negociação. Continuo a perder dinheiro por vezes, mas com muito menos frequência, e voltei a desfrutar dos meus fins-de-semana. Os meus colegas de trabalho ainda não actualizaram a piada, mas dêem-lhe tempo.</p>
<p>O agente também demorou apenas dois fins-de-semana a construir. Um ano atrás, a mesma configuração teria significado escrever schedulers, pipelines de notificação e gerenciamento de memória do zero. Com o OpenClaw, a maior parte desse tempo foi dedicada a clarificar as minhas próprias regras de negociação, e não a escrever infra-estruturas.</p>
<p>E uma vez construída para um caso de uso, a arquitetura é portátil.  Troque os modelos de pesquisa do Exa e as competências do OpenClaw e terá um agente que monitoriza documentos de investigação, segue a concorrência, observa alterações regulamentares ou segue perturbações na cadeia de fornecimento.</p>
<p>Se quiser experimentar:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Início rápido do Milvus</a></strong> - obtenha uma base de dados de vectores a funcionar localmente em menos de cinco minutos</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong> - configure o seu primeiro agente com Skills e Heartbeat</li>
<li><strong>API</strong><strong><a href="https://exa.ai/">Exa</a></strong> - 1.000 pesquisas gratuitas por mês para começar</li>
</ul>
<p>Tem perguntas, quer ajuda para depurar ou apenas quer mostrar o que construiu? Junte-se ao canal <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a> - é a forma mais rápida de obter ajuda da comunidade e da equipa. E se preferir falar sobre a sua configuração individualmente, reserve uma <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">hora de escritório</a> de 20 minutos em <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus.</a></p>
<h2 id="Keep-Reading" class="common-anchor-header">Continuar a ler<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (Anteriormente Clawdbot &amp; Moltbot) Explicado: Um guia completo para o agente autónomo de IA</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guia passo-a-passo para configurar o OpenClaw (anteriormente Clawdbot/Moltbot) com o Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Por que agentes de IA como o OpenClaw queimam tokens e como cortar custos</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Extraímos o sistema de memória do OpenClaw e abrimos o seu código fonte (memsearch)</a></li>
</ul>

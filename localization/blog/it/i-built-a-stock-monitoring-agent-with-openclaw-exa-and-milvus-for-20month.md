---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Ho costruito un agente di monitoraggio delle azioni con OpenClaw, Exa e Milvus
  per $20/mese
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
  Una guida passo passo per costruire un agente di monitoraggio azionario AI
  utilizzando OpenClaw, Exa e Milvus. Briefing mattutini, memoria degli scambi e
  avvisi per 20 dollari al mese.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Faccio trading di azioni statunitensi per conto terzi, che è un modo gentile per dire che perdo soldi per hobby. I miei colleghi scherzano sul fatto che la mia strategia è "comprare al massimo sull'eccitazione, vendere al minimo sulla paura, ripetere settimanalmente".</p>
<p>La parte della ripetizione è quella che mi uccide. Ogni volta che osservo il mercato, finisco per fare un'operazione che non avevo previsto. Il petrolio sale e io vendo in preda al panico. Quel titolo tecnologico sale del 4% e lo inseguo. Una settimana dopo, guardando la mia cronologia degli scambi, mi chiedo: <em>non</em> ho <em>fatto esattamente questa cosa lo scorso trimestre?</em></p>
<p>Ho quindi creato un agente con OpenClaw che osserva il mercato al posto mio e mi impedisce di commettere gli stessi errori. Non fa trading e non tocca il mio denaro, perché sarebbe un rischio troppo grande per la sicurezza. Invece, mi fa risparmiare il tempo speso per osservare il mercato e mi impedisce di commettere gli stessi errori.</p>
<p>Questo agente è composto da tre parti e costa circa 20 dollari al mese:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>per gestire il tutto con il pilota automatico.</strong> OpenClaw gestisce l'agente con un battito cardiaco di 30 minuti e mi segnala solo quando qualcosa è veramente importante, alleviando la FOMO che mi teneva incollato allo schermo. Prima, più guardavo i prezzi, più reagivo d'impulso.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>per ricerche accurate e in tempo reale.</strong> Exa sfoglia e riassume fonti di informazione selezionate a mano in base a un programma, in modo da ottenere un briefing pulito ogni mattina. Prima passavo un'ora al giorno a setacciare lo spam SEO e le speculazioni per trovare notizie affidabili, e non poteva essere automatizzato perché i siti di finanza si aggiornano quotidianamente per combattere gli scrapers.</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>per la storia e le preferenze personali.</strong> Milvus memorizza la mia storia di trading e l'agente la ricerca prima che io prenda una decisione: se sto per ripetere qualcosa di cui mi sono pentito, me lo dice. Prima, rivedere le operazioni passate era abbastanza noioso e non lo facevo, così gli stessi errori continuavano a ripetersi con ticker diversi. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> è la versione completamente gestita di Milvus. Se desiderate un'esperienza senza problemi, Zilliz Cloud è un'ottima opzione<a href="https://cloud.zilliz.com/signup">(è disponibile il livello gratuito</a>).</li>
</ul>
<p>Ecco come l'ho configurato, passo dopo passo.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Passo 1: ottenere informazioni di mercato in tempo reale con Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>In precedenza, avevo provato a navigare tra le app finanziarie, a scrivere scrapers e a cercare terminali di dati professionali. La mia esperienza? Le app seppellivano il segnale sotto il rumore, gli scrapers si rompevano continuamente e le API professionali erano proibitive. Exa è un'API di ricerca costruita per agenti AI che risolve i problemi di cui sopra.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> è un'API di ricerca sul web che restituisce dati strutturati e pronti per l'AI per gli agenti AI. È alimentata da <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (il servizio completamente gestito di Milvus). Se Perplexity è un motore di ricerca usato dagli esseri umani, Exa è usato dall'IA. L'agente invia una query ed Exa restituisce il testo dell'articolo, le frasi chiave e i riassunti in formato JSON, un output strutturato che l'agente può analizzare e utilizzare direttamente, senza bisogno di scraping.</p>
<p>Exa utilizza anche la ricerca semantica, in modo che l'agente possa eseguire query in linguaggio naturale. Una query del tipo "Perché le azioni NVIDIA sono scese nonostante i forti guadagni del quarto trimestre 2026" restituisce le analisi di Reuters e Bloomberg, non una pagina di clickbait SEO.</p>
<p>Exa ha un livello gratuito - 1.000 ricerche al mese - che è più che sufficiente per iniziare. Per seguire la procedura, installate l'SDK e inserite la vostra chiave API:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Ecco la chiamata principale:</p>
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
<p>Il parametro contents fa la maggior parte del lavoro pesante: text estrae l'intero articolo, highlights estrae le frasi chiave e summary genera un riassunto mirato basato su una domanda fornita dall'utente. Una chiamata all'API sostituisce venti minuti di navigazione tra le schede.</p>
<p>Questo schema di base copre molte cose, ma ho finito per creare quattro varianti per gestire le diverse situazioni in cui mi imbatto regolarmente:</p>
<ul>
<li><strong>Filtro per credibilità della fonte.</strong> Per l'analisi degli utili, voglio solo Reuters, Bloomberg o il Wall Street Journal, non le content farm che riscrivono i loro report dodici ore dopo.</li>
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
<li><strong>Trovare analisi simili.</strong> Quando leggo un buon articolo, voglio altre prospettive sullo stesso argomento senza doverle cercare manualmente.</li>
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
<li><strong>Ricerca approfondita per domande complesse.</strong> Alcune domande non possono trovare risposta in un singolo articolo, come ad esempio l'impatto delle tensioni in Medio Oriente sulle catene di fornitura dei semiconduttori. La ricerca profonda sintetizza più fonti e restituisce sintesi strutturate.</li>
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
<li><strong>Monitoraggio delle notizie in tempo reale.</strong> Durante l'orario di mercato, ho bisogno di notizie dell'ultima ora filtrate solo per il giorno corrente.</li>
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
<p>Ho scritto una dozzina di modelli utilizzando questi schemi, che coprono la politica della Fed, gli utili del settore tecnologico, i prezzi del petrolio e gli indicatori macro. Vengono eseguiti automaticamente ogni mattina e inviano i risultati al mio telefono. Quello che prima richiedeva un'ora di navigazione ora richiede cinque minuti di lettura dei riassunti davanti a un caffè.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Fase 2: memorizzare la storia del trading in Milvus per prendere decisioni più intelligenti<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa ha risolto il mio problema di informazioni. Ma continuavo a ripetere le stesse operazioni: panic-selling durante i ribassi che si riprendevano nel giro di pochi giorni, e inseguimento del momentum in titoli che erano già sopravvalutati. Agivo in base alle emozioni, me ne pentivo e dimenticavo la lezione quando si ripresentava una situazione simile.</p>
<p>Avevo bisogno di una base di conoscenza personale: qualcosa che potesse memorizzare le mie operazioni passate, i miei ragionamenti e i miei errori. Non qualcosa che dovessi rivedere manualmente (ci avevo provato e non avevo mai continuato), ma qualcosa che l'agente potesse cercare da solo ogni volta che si presentava una situazione simile. Se sto per ripetere un errore, voglio che l'agente me lo dica prima che io prema il pulsante. La corrispondenza tra "situazione attuale" ed "esperienza passata" è un problema di ricerca di similarità che i database vettoriali risolvono, quindi ne ho scelto uno per memorizzare i miei dati.</p>
<p>Ho usato <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, una versione leggera di Milvus che funziona localmente. Non ha server ed è perfetta per la prototipazione e la sperimentazione. Ho suddiviso i miei dati in tre collezioni. La dimensione dell'embedding è 1536 per corrispondere al modello text-embedding-3-small di OpenAI, che può essere utilizzato direttamente:</p>
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
<p>Le tre raccolte corrispondono a tre tipi di dati personali, ciascuno con una diversa strategia di recupero:</p>
<table>
<thead>
<tr><th><strong>Tipo</strong></th><th><strong>Cosa memorizza</strong></th><th><strong>Come l'agente li usa</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Preferenze</strong></td><td>Pregiudizi, tolleranza al rischio, filosofia di investimento ("tendo a tenere i titoli tecnologici troppo a lungo")</td><td>Caricato nel contesto dell'agente a ogni esecuzione</td></tr>
<tr><td><strong>Decisioni e modelli</strong></td><td>Operazioni specifiche del passato, lezioni apprese, osservazioni di mercato.</td><td>Recuperati tramite ricerca per similarità solo quando si presenta una situazione rilevante</td></tr>
<tr><td><strong>Conoscenza esterna</strong></td><td>Rapporti di ricerca, documenti SEC, dati pubblici</td><td>Non memorizzate in Milvus - ricercabili tramite Exa</td></tr>
</tbody>
</table>
<p>Ho creato tre raccolte diverse, perché unirle in un'unica raccolta significherebbe appesantire ogni richiesta di informazioni con la cronologia degli scambi irrilevante, oppure perdere i pregiudizi fondamentali quando non corrispondono abbastanza alla query corrente.</p>
<p>Una volta create le raccolte, avevo bisogno di un modo per popolarle automaticamente. Non volevo copiare e incollare le informazioni dopo ogni conversazione con l'agente, quindi ho costruito un estrattore di memoria che viene eseguito alla fine di ogni sessione di chat.</p>
<p>L'estrattore fa due cose: estrae e deduplica. L'estrattore chiede all'LLM di estrarre dalla conversazione informazioni strutturate (decisioni, preferenze, schemi, lezioni) e le indirizza alla giusta raccolta. Prima di memorizzare qualcosa, controlla la somiglianza con ciò che è già presente. Se una nuova intuizione è simile per più del 92% a una voce esistente, viene saltata.</p>
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
<p>Quando mi trovo di fronte a una nuova situazione di mercato e mi viene voglia di fare trading, l'agente esegue una funzione di richiamo. Descrivo ciò che sta accadendo e l'agente cerca in tutte e tre le raccolte lo storico pertinente:</p>
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
<p>Ad esempio, quando i titoli tecnologici sono scesi del 3-4% a causa delle tensioni in Medio Oriente all'inizio di marzo, l'agente ha richiamato tre cose: una lezione dell'ottobre 2024 su come evitare il panic-selling durante un calo geopolitico, una nota di preferenza secondo cui tendo a sovrappesare il rischio geopolitico e uno schema che avevo registrato (i ribassi tecnologici guidati dalla geopolitica si riprendono in genere in una o tre settimane).</p>
<p>Il commento del mio collega: se i dati di allenamento sono un record perdente, cosa sta imparando esattamente l'IA? Ma è proprio questo il punto: l'agente non sta copiando le mie operazioni, ma le sta memorizzando in modo da potermi dissuadere dalla prossima.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Fase 3: insegnare all'agente ad analizzare con le competenze di OpenClaw<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>A questo punto, l'agente dispone di informazioni affidabili<a href="https://exa.ai/">(Exa</a>) e di una memoria personale<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Ma se si consegnano entrambe a un LLM e gli si dice "analizza questo", si ottiene una risposta generica, con una copertura di tutto. Cita ogni possibile angolazione e conclude con "gli investitori dovrebbero soppesare i rischi". Tanto valeva non dire nulla.</p>
<p>La soluzione è scrivere il proprio quadro analitico e fornirlo all'agente sotto forma di istruzioni esplicite. Dovete dirgli quali indicatori vi interessano, quali situazioni considerate pericolose e quando essere prudenti o aggressivi. Queste regole sono diverse per ogni investitore, quindi dovete definirle voi stessi.</p>
<p>OpenClaw lo fa attraverso le Skills, file markdown in una directory skills/. Quando l'agente incontra una situazione rilevante, carica la Skill corrispondente e segue il vostro schema invece di andare a ruota libera.</p>
<p>Eccone una che ho scritto per valutare i titoli azionari dopo una relazione sugli utili:</p>
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
<p>L'ultima riga è la più importante: "Riemergere sempre dai miei errori passati. Ho la tendenza a lasciare che la paura prevalga sui dati. Se la mia storia Milvus mostra che mi sono pentito di aver venduto dopo un calo, ditelo esplicitamente". In questo modo dico all'agente esattamente dove sbaglio, in modo che sappia quando reagire. Se si costruisce il proprio, questa è la parte da personalizzare in base ai propri pregiudizi.</p>
<p>Ho scritto Skill simili per l'analisi del sentiment, gli indicatori macro e i segnali di rotazione settoriale. Ho anche scritto delle Skill che simulano il modo in cui gli investitori che ammiro valuterebbero la stessa situazione: il quadro di valore di Buffett, l'approccio macro di Bridgewater. Non si tratta di decisioni, ma di prospettive aggiuntive.</p>
<p>Un avvertimento: non lasciate che i LLM calcolino indicatori tecnici come RSI o MACD. Hanno numeri allucinanti e sicuri. Calcolateli voi stessi o chiamate un'API dedicata, e inserite i risultati nello Skill come input.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Fase 4: Avviare l'agente con OpenClaw Heartbeat<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Tutto quanto detto sopra richiede ancora di essere attivato manualmente. Se si deve aprire un terminale ogni volta che si desidera un aggiornamento, si torna praticamente a scorrere l'applicazione di intermediazione durante le riunioni.</p>
<p>Il meccanismo Heartbeat di OpenClaw risolve questo problema. Un gateway invia un ping all'agente ogni 30 minuti (configurabile) e l'agente controlla un file HEARTBEAT.md per decidere cosa fare in quel momento. Si tratta di un file markdown con regole basate sul tempo:</p>
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
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Risultati: Meno tempo sullo schermo, meno compravendite impulsive<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco cosa produce il sistema giorno per giorno:</p>
<ul>
<li><strong>Brief mattutino (7:00 AM).</strong> L'agente esegue Exa durante la notte, estrae le mie posizioni e la cronologia rilevante da Milvus e invia un riepilogo personalizzato al mio telefono - meno di 500 parole. Cosa è successo durante la notte, come si riferisce alle mie partecipazioni e da uno a tre punti di azione. Lo leggo mentre mi lavo i denti.</li>
<li><strong>Avvisi infragiornalieri (9:30-16:00 ET).</strong> Ogni 30 minuti, l'agente controlla la mia watchlist. Se un titolo si muove più del 3%, ricevo una notifica con il contesto: perché l'ho comprato, dove si trova il mio stop-loss e se mi sono già trovato in una situazione simile.</li>
<li><strong>Revisione settimanale (fine settimana).</strong> L'agente raccoglie l'intera settimana: i movimenti del mercato, il loro confronto con le mie aspettative mattutine e i modelli da ricordare. Il sabato dedico 30 minuti alla lettura. Il resto della settimana sto deliberatamente lontano dallo schermo.</li>
</ul>
<p>Quest'ultimo punto è il cambiamento più importante. L'agente non solo fa risparmiare tempo, ma mi libera anche dall'osservazione del mercato. Non si può vendere nel panico se non si guardano i prezzi.</p>
<p>Prima di questo sistema, dedicavo 10-15 ore alla settimana alla raccolta di informazioni, al monitoraggio del mercato e alla revisione delle transazioni, sparpagliate tra riunioni, spostamenti e scorrimento notturno. Ora sono circa due ore: cinque minuti per il briefing mattutino ogni giorno, più 30 minuti per la revisione nel fine settimana.</p>
<p>Anche la qualità delle informazioni è migliore. Leggo i riassunti di Reuters e Bloomberg invece di quello che è diventato virale su Twitter. Inoltre, grazie all'agente che richiama i miei errori passati ogni volta che sono tentato di agire, ho ridotto in modo significativo le mie operazioni impulsive. Non posso ancora provare che questo mi abbia reso un investitore migliore, ma mi ha reso un investitore meno avventato.</p>
<p>Il costo totale: 10 dollari al mese per OpenClaw, 10 dollari al mese per Exa e un po' di elettricità per far funzionare Milvus Lite.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Continuavo a fare le stesse operazioni impulsive perché le mie informazioni erano sbagliate, rivedevo raramente la mia cronologia e stare tutto il giorno a guardare il mercato peggiorava la situazione. Ho quindi costruito un agente AI che risolve questi problemi facendo tre cose:</p>
<ul>
<li><strong>Raccoglie notizie di mercato affidabili</strong> con <strong><a href="https://exa.ai/">Exa</a></strong>, sostituendo un'ora di scrolling tra spam SEO e siti a pagamento.</li>
<li><strong>Ricorda le mie operazioni passate</strong> con <a href="http://milvus.io">Milvus</a> e mi avverte quando sto per ripetere un errore di cui mi sono già pentito.</li>
<li><strong>Funziona con il pilota automatico</strong> di <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> e mi avvisa solo quando qualcosa è veramente importante.</li>
</ul>
<p>Costo totale: 20 dollari al mese. L'agente non fa trading e non tocca il mio denaro.</p>
<p>Il cambiamento più importante non è stato quello dei dati o degli avvisi. È che ho smesso di guardare il mercato. Mercoledì scorso me ne sono completamente dimenticato, cosa che non è mai successa in anni di trading. A volte perdo ancora denaro, ma molto meno spesso, e mi godo di nuovo i miei fine settimana. I miei colleghi non hanno ancora aggiornato la battuta, ma dategli tempo.</p>
<p>Anche per costruire l'agente ci sono voluti solo due fine settimana. Un anno fa, la stessa configurazione avrebbe comportato la scrittura di scheduler, pipeline di notifica e gestione della memoria da zero. Con OpenClaw, la maggior parte del tempo è stata impiegata per chiarire le mie regole di trading, non per scrivere l'infrastruttura.</p>
<p>Inoltre, una volta costruita per un caso d'uso, l'architettura è portatile. Sostituendo i modelli di ricerca Exa e le competenze OpenClaw, si ottiene un agente che monitora i documenti di ricerca, segue i concorrenti, osserva i cambiamenti normativi o segue le interruzioni della catena di approvvigionamento.</p>
<p>Se volete provarlo:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> - per ottenere un database di vettori in esecuzione a livello locale in meno di cinque minuti.</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>docs</strong> - configurare il primo agente con Skills e Heartbeat</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 1.000 ricerche gratuite al mese per cominciare</li>
</ul>
<p>Avete domande, volete aiuto per il debug o volete semplicemente mostrare ciò che avete costruito? Iscrivetevi al canale <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack di Milvus</a>: è il modo più veloce per ricevere aiuto dalla comunità e dal team. E se preferite parlare della vostra configurazione da soli, prenotate un'<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">ora d'ufficio Milvus di</a> 20 minuti <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">.</a></p>
<h2 id="Keep-Reading" class="common-anchor-header">Continua a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw (ex Clawdbot e Moltbot) spiegato: Guida completa all'agente AI autonomo</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guida passo-passo alla configurazione di OpenClaw (precedentemente Clawdbot/Moltbot) con Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Perché gli agenti di intelligenza artificiale come OpenClaw bruciano i gettoni e come ridurre i costi</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso open source (memsearch)</a></li>
</ul>

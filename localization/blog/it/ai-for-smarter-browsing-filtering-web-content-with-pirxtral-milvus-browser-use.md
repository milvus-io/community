---
id: >-
  ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
title: >-
  AI per una navigazione più intelligente: Filtraggio dei contenuti web con
  Pixtral, Milvus e l'uso del browser
author: Stephen Batifol
date: 2025-02-25T00:00:00.000Z
desc: >-
  Imparate a costruire un assistente intelligente che filtra i contenuti
  combinando Pixtral per l'analisi delle immagini, il database vettoriale Milvus
  per l'archiviazione e Browser Use per la navigazione web.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: >-
  Vector Database Milvus, AI Content Filtering, Pixtral Image Analysis, Browser
  Use Web Navigation, Intelligent Agent Development
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
---
<iframe width="100%" height="480" src="https://www.youtube.com/embed/4Xf4_Wfjk_Y" title="How to Build a Smart Social Media Agent with Milvus, Pixtral &amp; Browser Use" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>In qualità di Developer Advocate di Milvus, trascorro molto tempo sui social, ascoltando ciò che le persone hanno da dire su di noi e se posso essere d'aiuto. Quando si cerca &quot;Milvus&quot; c'è un leggero scontro tra mondi. Si tratta sia di un DB vettoriale che di un genere di uccelli, il che significa che un momento sono immerso in un thread sugli algoritmi di similarità vettoriale e l'attimo dopo sto ammirando splendide fotografie di uccelli neri che volano nel cielo.</p>
<p>Sebbene entrambi gli argomenti siano interessanti, nel mio caso non è molto utile mischiarli; e se ci fosse un modo intelligente per risolvere questo problema senza che io debba controllare manualmente?</p>
<p>Costruiamo qualcosa di più intelligente: combinando la comprensione visiva con la consapevolezza del contesto, possiamo costruire un assistente che sappia distinguere tra i modelli di migrazione di un nibbio nero e un nostro nuovo articolo.</p>
<h2 id="The-tech-stack" class="common-anchor-header">Lo stack tecnologico<button data-href="#The-tech-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Combiniamo tre diverse tecnologie:</p>
<ul>
<li><strong>Browser-Use:</strong> questo strumento naviga su vari siti web (ad esempio, Twitter) per recuperare i contenuti.</li>
<li><strong>Pixtral</strong>: Un modello di linguaggio visivo che analizza le immagini e il contesto. In questo esempio, distingue tra un diagramma tecnico sul nostro DB Vettoriale e una splendida fotografia di uccelli.</li>
<li><strong>Milvus:</strong> un DB vettoriale ad alte prestazioni e open-source. È il luogo in cui memorizzeremo i post rilevanti per le successive interrogazioni.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/the_tech_stack_ad695ccf9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Seeing-it-in-action" class="common-anchor-header">Vedere in azione<button data-href="#Seeing-it-in-action" class="anchor-icon" translate="no">
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
    </button></h2><p>Diamo un'occhiata a questi due post:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langchian_tweet_1_with_Milvus_f2bd988503.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tweet_2_with_Bird_4b534efced.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per quello a sinistra, Pixtral riconosce che si tratta di un post su Milvus, il DB vettoriale. Vengono citati alcuni dettagli di implementazione, ma anche un'immagine che mostra un diagramma di sistema, indicando che si tratta effettivamente del DB Vector. Possiamo vedere di seguito che anche Pixtral la pensa allo stesso modo.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: <span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
<span class="hljs-number">1.</span> Navigated to the post URL. <span class="hljs-number">2.</span> Extracted relevant post content. <span class="hljs-number">3.</span> Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB.
INFO     [src.agent.custom_agent] 📋 Future Plans:
<span class="hljs-number">1.</span> Summarize the findings <span class="hljs-keyword">and</span> confirm the relevance to Milvus. <span class="hljs-number">2.</span> Complete the task by providing a clear <span class="hljs-keyword">and</span> concise report.
INFO     [src.agent.custom_agent] 🤔 Thought: The task required analyzing the post content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB, ignoring <span class="hljs-built_in">any</span> content about birds <span class="hljs-keyword">or</span> photography. The extracted content <span class="hljs-keyword">is</span> entirely relevant to Milvus <span class="hljs-keyword">and</span> its applications <span class="hljs-keyword">in</span> vector search <span class="hljs-keyword">and</span> RAG systems. I will now summarize the findings <span class="hljs-keyword">and</span> complete the task.
INFO     [src.agent.custom_agent] 🎯 Summary: The post <span class="hljs-keyword">and</span> its replies are relevant to Milvus, the Vector DB, focusing on its use <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search. No content about birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post by LangChainAI discusses the &#x27;GraphRAG Agent,&#x27; which uses Neo4j and Milvus vector search to enhance RAG systems. Replies highlight the innovative use of Milvus for intelligent retrieval and vector search, with no mention of birds or photography. The content is entirely relevant to Milvus, the Vector DB.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies focus on the innovative use of Milvus <span class="hljs-keyword">for</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search alongside other technologies.
<span class="hljs-number">3.</span> No posts <span class="hljs-keyword">or</span> replies are related to birds <span class="hljs-keyword">or</span> photography.
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
<button class="copy-code-btn"></button></code></pre>
<p>Quella a destra, invece, non lo è: possiamo vedere che questa immagine, per quanto bella, non riguarda un DB vettoriale. Si vede un uccello che vola nel cielo, quindi Pixtral la considera irrilevante.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
Navigated to the post. Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB. No relevant information found.
INFO     [src.agent.custom_agent] 🤔 Thought: The content of the post <span class="hljs-keyword">and</span> comments only discusses birds <span class="hljs-keyword">and</span> photography. Since the task specifies ignoring such topics, there <span class="hljs-keyword">is</span> no relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. The task can now be concluded.
INFO     [src.agent.custom_agent] 🎯 Summary: The post does <span class="hljs-keyword">not</span> contain relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. I will conclude the task.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post and comments focus on birds and photography. No relevant information related to Milvus, the Vector DB, was found.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
<button class="copy-code-btn"></button></code></pre>
<p>Ora che abbiamo filtrato i post che non vogliamo, possiamo salvare quelli rilevanti in Milvus. In questo modo sarà possibile interrogarli in un secondo momento utilizzando la ricerca vettoriale o la ricerca a testo pieno.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Browser_use_milvus_pixtral_39bf320a9f.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Storing-Data-in-Milvus" class="common-anchor-header">Memorizzazione dei dati in Milvus<button data-href="#Storing-Data-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>I<a href="https://milvus.io/docs/enable-dynamic-field.md#Dynamic-Field">campi dinamici</a> sono un must in questo caso, perché non sempre è possibile rispettare lo schema previsto da Milvus. Con Milvus, basta usare <code translate="no">enable_dynamic_field=True</code> quando si crea lo schema e il gioco è fatto. Ecco uno snippet di codice che illustra il processo:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Create a Schema that handles Dynamic Fields</span>
schema = <span class="hljs-variable language_">self</span>.client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<p>Poi si definiscono i dati a cui si vuole accedere:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Prepare data with dynamic fields</span>
data = {
    <span class="hljs-string">&#x27;text&#x27;</span>: content_str,
    <span class="hljs-string">&#x27;vector&#x27;</span>: embedding,
    <span class="hljs-string">&#x27;url&#x27;</span>: url,
    <span class="hljs-string">&#x27;type&#x27;</span>: content_type,
    <span class="hljs-string">&#x27;metadata&#x27;</span>: json.dumps(metadata <span class="hljs-keyword">or</span> {})
}

<span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-variable language_">self</span>.client.insert(
    collection_name=<span class="hljs-variable language_">self</span>.collection_name,
    data=[data]
)
<button class="copy-code-btn"></button></code></pre>
<p>Questa semplice impostazione consente di non doversi preoccupare che ogni campo sia perfettamente definito a priori. Basta impostare lo schema per consentire aggiunte dinamiche e lasciare che Milvus faccia il lavoro pesante.</p>
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
    </button></h2><p>Combinando la navigazione web di Browser Use, la comprensione visiva di Pixtral e l'archiviazione efficiente di Milvus, abbiamo costruito un assistente intelligente che capisce veramente il contesto. Ora lo sto usando per distinguere tra uccelli e DB vettoriali, ma lo stesso approccio potrebbe essere utile per un altro problema che potreste trovarvi ad affrontare.</p>
<p>Per quanto mi riguarda, voglio continuare a lavorare su agenti che possano aiutarmi nel mio lavoro quotidiano per ridurre il mio carico cognitivo 😌</p>
<h2 id="Wed-Love-to-Hear-What-You-Think" class="common-anchor-header">Ci piacerebbe sapere cosa ne pensate!<button data-href="#Wed-Love-to-Hear-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Se questo post vi è piaciuto, vi invitiamo a considerare:</p>
<ul>
<li>⭐ Darci una stella su <a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li>💬 Unisciti alla nostra <a href="https://discord.gg/FG6hMJStWu">comunità Milvus Discord</a> per condividere le tue esperienze o se hai bisogno di aiuto per costruire gli Agenti</li>
<li>🔍 Esplorare il nostro <a href="https://github.com/milvus-io/bootcamp">repository Bootcamp</a> per trovare esempi di applicazioni che utilizzano Milvus</li>
</ul>

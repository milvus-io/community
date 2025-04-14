---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'Vi presentiamo DeepSearcher: Una ricerca profonda locale open source'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  A differenza di Deep Research di OpenAI, questo esempio è stato eseguito
  localmente, utilizzando solo modelli e strumenti open-source come Milvus e
  LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>Ricercatore profondo</span> </span></p>
<p>Nel post precedente, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"I Built a Deep Research with Open Source-and So Can You!",</em></a> abbiamo spiegato alcuni dei principi alla base degli agenti di ricerca e costruito un semplice prototipo che genera rapporti dettagliati su un determinato argomento o domanda. L'articolo e il notebook corrispondente hanno dimostrato i concetti fondamentali dell'<em>uso degli strumenti</em>, della <em>scomposizione delle query</em>, del <em>ragionamento</em> e della <em>riflessione</em>. L'esempio del nostro post precedente, a differenza di Deep Research di OpenAI, funzionava a livello locale, utilizzando solo modelli e strumenti open-source come <a href="https://milvus.io/docs">Milvus</a> e LangChain. (Vi invito a leggere l'<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">articolo prima di</a> continuare).</p>
<p>Nelle settimane successive c'è stata un'esplosione di interesse per la comprensione e la riproduzione della Deep Research di OpenAI. Si vedano, ad esempio, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> e <a href="https://huggingface.co/blog/open-deep-research">Hugging Face's Open DeepResearch</a>. Questi strumenti differiscono per architettura e metodologia, pur condividendo un obiettivo: ricercare iterativamente un argomento o una domanda navigando sul web o su documenti interni e produrre un rapporto dettagliato, informato e ben strutturato. È importante notare che l'agente sottostante automatizza il ragionamento sulle azioni da intraprendere in ogni fase intermedia.</p>
<p>In questo post, ci basiamo sul nostro post precedente e presentiamo il progetto open-source <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> di Zilliz. Il nostro agente dimostra ulteriori concetti: il <em>routing delle query, il flusso di esecuzione condizionale</em> e il <em>web crawling come strumento</em>. È presentato come una libreria Python e uno strumento a riga di comando piuttosto che come un taccuino Jupyter ed è più completo rispetto al nostro post precedente. Ad esempio, è in grado di inserire più documenti sorgente e di impostare il modello di embedding e il database vettoriale utilizzato tramite un file di configurazione. Pur essendo ancora relativamente semplice, DeepSearcher è un ottimo esempio di RAG agenziale e rappresenta un ulteriore passo avanti verso applicazioni di IA all'avanguardia.</p>
<p>Inoltre, esploriamo la necessità di servizi di inferenza più veloci ed efficienti. I modelli di ragionamento fanno uso di "scaling dell'inferenza", cioè di calcoli extra, per migliorare i loro risultati, e questo, combinato con il fatto che una singola relazione può richiedere centinaia o migliaia di chiamate LLM, fa sì che la larghezza di banda dell'inferenza sia il principale collo di bottiglia. Utilizziamo il <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">modello di ragionamento DeepSeek-R1 sull'hardware personalizzato di SambaNova</a>, che è due volte più veloce in termini di token di output al secondo rispetto al concorrente più vicino (vedi figura sotto).</p>
<p>SambaNova Cloud fornisce anche un servizio di inferenza per altri modelli open-source, tra cui Llama 3.x, Qwen2.5 e QwQ. Il servizio di inferenza viene eseguito sul chip personalizzato di SambaNova chiamato RDU (reconfigurable dataflow unit), appositamente progettato per un'inferenza efficiente sui modelli di IA generativa, riducendo i costi e aumentando la velocità di inferenza. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Per saperne di più, visitate il loro sito web.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>Velocità di uscita - DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Architettura di DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>L'architettura di <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> segue il nostro precedente post suddividendo il problema in quattro fasi - <em>definire/raffinare la domanda</em>, <em>ricercare</em>, <em>analizzare</em>, <em>sintetizzare</em> - anche se questa volta con qualche sovrapposizione. Esaminiamo ogni fase, evidenziando i miglioramenti di <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di DeepSearcher</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Definire e affinare la domanda</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Nella progettazione di DeepSearcher, i confini tra la ricerca e l'affinamento della domanda sono sfumati. La domanda iniziale dell'utente viene scomposta in sotto-query, come nel post precedente. Si veda sopra per le subquery iniziali prodotte dalla domanda "Come sono cambiati i Simpson nel tempo?". Tuttavia, la fase di ricerca successiva continuerà a perfezionare la domanda come necessario.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Ricerca e analisi</h3><p>Dopo aver suddiviso la query in sottoquery, inizia la parte di ricerca dell'agente. Si tratta, grosso modo, di quattro fasi: <em>instradamento</em>, <em>ricerca</em>, <em>riflessione e ripetizione condizionale</em>.</p>
<h4 id="Routing" class="common-anchor-header">Instradamento</h4><p>Il nostro database contiene più tabelle o raccolte provenienti da fonti diverse. Sarebbe più efficiente se potessimo restringere la nostra ricerca semantica solo alle fonti rilevanti per l'interrogazione in questione. Un router di query richiede a un LLM di decidere da quali raccolte devono essere recuperate le informazioni.</p>
<p>Ecco il metodo per formare il prompt del query routing:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Facciamo in modo che l'LLM restituisca un output strutturato come JSON, in modo da convertire facilmente il suo output in una decisione su cosa fare successivamente.</p>
<h4 id="Search" class="common-anchor-header">Ricerca</h4><p>Dopo aver selezionato le varie raccolte di database nella fase precedente, la fase di ricerca esegue una ricerca di similarità con <a href="https://milvus.io/docs">Milvus</a>. Come nel caso del post precedente, i dati di partenza sono stati specificati in anticipo, suddivisi in chunk, incorporati e memorizzati nel database vettoriale. Per DeepSearcher, le fonti di dati, sia locali che online, devono essere specificate manualmente. Lasciamo la ricerca online per un lavoro futuro.</p>
<h4 id="Reflection" class="common-anchor-header">Riflessione</h4><p>A differenza del post precedente, DeepSearcher illustra una vera e propria forma di riflessione agenziale, inserendo i risultati precedenti come contesto in un prompt che "riflette" se le domande poste finora e i relativi chunk recuperati contengono lacune informative. Questa può essere vista come una fase di analisi.</p>
<p>Ecco il metodo per creare il prompt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>Ancora una volta, facciamo in modo che LLM restituisca un output strutturato, questa volta come dati interpretabili da Python.</p>
<p>Ecco un esempio di nuove sotto-query "scoperte" dalla riflessione dopo aver risposto alle sotto-query iniziali di cui sopra:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Ripetizione condizionale</h4><p>A differenza del nostro post precedente, DeepSearcher illustra un flusso di esecuzione condizionale. Dopo aver riflettuto se le domande e le risposte date finora sono complete, se ci sono altre domande da porre l'agente ripete i passaggi precedenti. È importante notare che il flusso di esecuzione (un ciclo while) è una funzione dell'output di LLM, anziché essere codificato. In questo caso c'è solo una scelta binaria: <em>ripetere la ricerca</em> o <em>generare un rapporto</em>. In agenti più complessi possono essercene diverse, come: <em>seguire un collegamento ipertestuale</em>, <em>recuperare pezzi, memorizzare, riflettere</em>, ecc. In questo modo, la domanda continua a essere perfezionata come l'agente ritiene opportuno, finché non decide di uscire dal ciclo e generare il rapporto. Nel nostro esempio dei Simpson, DeepSearcher esegue altri due cicli di riempimento dei vuoti con sotto-query aggiuntive.</p>
<h3 id="Synthesize" class="common-anchor-header">Sintetizzare</h3><p>Infine, la domanda completamente scomposta e i pezzi recuperati vengono sintetizzati in un report con un singolo prompt. Ecco il codice per creare il prompt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Questo approccio ha il vantaggio, rispetto al nostro prototipo che analizzava ogni domanda separatamente e concatenava semplicemente i risultati, di produrre un report in cui tutte le sezioni sono coerenti tra loro, cioè non contengono informazioni ripetute o contraddittorie. Un sistema più complesso potrebbe combinare aspetti di entrambi, utilizzando un flusso di esecuzione condizionale per strutturare il report, sintetizzare, riscrivere, riflettere e fare pivot, e così via.</p>
<h2 id="Results" class="common-anchor-header">Risultati<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco un esempio del report generato dalla query "Come sono cambiati i Simpson nel tempo?" con DeepSeek-R1 che passa la pagina di Wikipedia sui Simpson come materiale di partenza:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Trovate <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">il rapporto completo qui</a> e <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">un rapporto prodotto da DeepSearcher con GPT-4o mini</a> per confronto.</p>
<h2 id="Discussion" class="common-anchor-header">Discussione<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo presentato <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, un agente che esegue ricerche e redige relazioni. Il nostro sistema si basa sull'idea del nostro precedente articolo, aggiungendo caratteristiche come il flusso di esecuzione condizionale, il routing delle query e un'interfaccia migliorata. Siamo passati dall'inferenza locale con un piccolo modello di ragionamento quantizzato a 4 bit a un servizio di inferenza online per il modello massivo DeepSeek-R1, migliorando qualitativamente il nostro rapporto di output. DeepSearcher funziona con la maggior parte dei servizi di inferenza come OpenAI, Gemini, DeepSeek e Grok 3 (in arrivo!).</p>
<p>I modelli di ragionamento, in particolare quelli utilizzati negli agenti di ricerca, sono molto ricchi di inferenza e noi abbiamo avuto la fortuna di poter utilizzare l'offerta più veloce di DeepSeek-R1 di SambaNova, in esecuzione sul loro hardware personalizzato. Per la nostra query dimostrativa, abbiamo effettuato sessantacinque chiamate al servizio di inferenza DeepSeek-R1 di SambaNova, inserendo circa 25k token, producendo 22k token e spendendo 0,30 dollari. Siamo rimasti impressionati dalla velocità di inferenza, dato che il modello contiene 671 miliardi di parametri ed è grande 3/4 di terabyte. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Scoprite qui ulteriori dettagli!</a></p>
<p>Continueremo ad approfondire questo lavoro nei prossimi post, esaminando altri concetti agenziali e lo spazio di progettazione degli agenti di ricerca. Nel frattempo, invitiamo tutti a provare <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, a <a href="https://github.com/zilliztech/deep-searcher">stellarci su GitHub</a> e a condividere il vostro feedback!</p>
<h2 id="Resources" class="common-anchor-header">Risorse<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher di Zilliz</strong></a></p></li>
<li><p>Lettura di base: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"Ho costruito una ricerca profonda con l'open source e puoi farlo anche tu!</em></strong></a></p></li>
<li><p><em>"</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova lancia il DeepSeek-R1 671B più veloce con la massima efficienza</strong></a><em>".</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Rapporto DeepSeek-R1 sui Simpson</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">Mini rapporto GPT-4o sui Simpson</a></p></li>
<li><p><a href="https://milvus.io/docs">Database vettoriale open source Milvus</a></p></li>
</ul>

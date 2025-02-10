---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: >-
  Ho costruito una ricerca approfondita con l'Open Source e potete farlo anche
  voi!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Imparate a creare un agente in stile Deep Research utilizzando strumenti
  open-source come Milvus, DeepSeek R1 e LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In realtà, si tratta di un agente di dimensioni minime che può ragionare, pianificare, usare strumenti, ecc. per effettuare ricerche utilizzando Wikipedia. Comunque, non male per qualche ora di lavoro...</p>
<p>A meno che non risiediate sotto una roccia, in una grotta o in un remoto monastero di montagna, avrete sentito parlare del rilascio di <em>Deep Research</em> da parte di OpenAI il 2 febbraio 2025. Questo nuovo prodotto promette di rivoluzionare il modo in cui rispondiamo a domande che richiedono la sintesi di grandi quantità di informazioni diverse.</p>
<p>Si digita la domanda, si seleziona l'opzione Deep Research e la piattaforma cerca autonomamente nel web, fa un ragionamento su ciò che scopre e sintetizza più fonti in una relazione coerente e completamente citata. Ci vogliono diversi ordini di grandezza per produrre il risultato rispetto a un chatbot standard, ma il risultato è più dettagliato, più informato e più ricco di sfumature.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Come funziona?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Ma come funziona questa tecnologia e perché Deep Research rappresenta un notevole miglioramento rispetto ai tentativi precedenti (come <em>Deep Research</em> di Google - avviso di controversia sui marchi in arrivo)? Lasceremo quest'ultimo aspetto per un prossimo post. Per quanto riguarda il primo punto, senza dubbio c'è molta "salsa segreta" alla base di Deep Research. Possiamo ricavare alcuni dettagli dal post di rilascio di OpenAI, che riassumo.</p>
<p><strong>Deep Research sfrutta i recenti progressi nei modelli di fondazione specializzati per i compiti di ragionamento:</strong></p>
<ul>
<li><p>"... messo a punto sul modello di ragionamento OpenAI o3 di prossima uscita...".</p></li>
<li><p>"... sfrutta il ragionamento per cercare, interpretare e analizzare enormi quantità di testo...".</p></li>
</ul>
<p><strong>Deep Research si avvale di un sofisticato flusso di lavoro agenziale con pianificazione, riflessione e memoria:</strong></p>
<ul>
<li><p>"... ha imparato a pianificare ed eseguire una traiettoria in più fasi...".</p></li>
<li><p>"... facendo marcia indietro e reagendo alle informazioni in tempo reale...".</p></li>
<li><p>"... facendo perno, se necessario, sulle informazioni che incontra...".</p></li>
</ul>
<p><strong>Deep Research viene addestrato su dati proprietari, utilizzando diversi tipi di messa a punto, il che è probabilmente una componente chiave delle sue prestazioni:</strong></p>
<ul>
<li><p>"... addestrato utilizzando l'apprendimento per rinforzo end-to-end su compiti di navigazione e ragionamento difficili in una serie di domini...".</p></li>
<li><p>"... ottimizzato per la navigazione sul web e l'analisi dei dati...".</p></li>
</ul>
<p>L'esatta progettazione del flusso di lavoro agenziale è un segreto, tuttavia possiamo costruire qualcosa da soli basandoci su idee consolidate su come strutturare gli agenti.</p>
<p><strong>Una nota prima di iniziare</strong>: È facile essere travolti dalla febbre dell'IA generativa, soprattutto quando viene rilasciato un nuovo prodotto che sembra un passo avanti. Tuttavia, la Deep Research, come riconosce OpenAI, ha dei limiti comuni alla tecnologia dell'IA generativa. Dobbiamo ricordarci di pensare in modo critico ai risultati, che possono contenere fatti falsi ("allucinazioni"), formattazione e citazioni errate e variare significativamente in termini di qualità in base al seme casuale.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Posso costruirne una mia?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Certamente! Costruiamo la nostra "Ricerca profonda", in locale e con strumenti open-source. Avremo a disposizione solo una conoscenza di base dell'intelligenza artificiale generativa, buon senso, un paio di ore libere, una GPU e gli strumenti open-source <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> e <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Naturalmente non possiamo sperare di replicare le prestazioni di OpenAI, ma il nostro prototipo dimostrerà in minima parte alcune delle idee chiave che probabilmente stanno alla base della loro tecnologia, combinando i progressi dei modelli di ragionamento con quelli dei flussi di lavoro agici. A differenza di OpenAI, utilizzeremo solo strumenti open-source e saremo in grado di distribuire il nostro sistema a livello locale: l'open-source ci offre certamente una grande flessibilità!</p>
<p>Faremo alcune ipotesi semplificative per ridurre la portata del nostro progetto:</p>
<ul>
<li><p>Utilizzeremo una modalità di ragionamento open-source distillata e <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">quantizzata</a> per 4 bit che può essere eseguita localmente.</p></li>
<li><p>Non eseguiremo ulteriori messe a punto del nostro modello di ragionamento.</p></li>
<li><p>L'unico strumento di cui dispone il nostro agente è la capacità di scaricare e leggere una pagina di Wikipedia ed eseguire interrogazioni RAG separate (non avremo accesso all'intero web).</p></li>
<li><p>Il nostro agente elaborerà solo dati testuali, non immagini, PDF, ecc.</p></li>
<li><p>Il nostro agente non farà il backtracking né prenderà in considerazione i pivot.</p></li>
<li><p>Il nostro agente controllerà (non ancora) il suo flusso di esecuzione in base al suo output.</p></li>
<li><p>Wikipedia contiene la verità, tutta la verità e nient'altro che la verità.</p></li>
</ul>
<p>Utilizzeremo <a href="https://milvus.io/docs">Milvus</a> per il nostro database vettoriale, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> come modello di ragionamento e <a href="https://python.langchain.com/docs/introduction/">LangChain</a> per implementare RAG. Iniziamo!</p>
<custom-h1>Un agente minimo per la ricerca online</custom-h1><p>Utilizzeremo il nostro modello mentale di come gli esseri umani conducono le ricerche per progettare il flusso di lavoro dell'agente:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Definire/raffinare la domanda</h3><p>La ricerca inizia con la definizione di una domanda. Consideriamo la domanda come la richiesta dell'utente, ma usiamo il nostro modello di ragionamento per assicurarci che la domanda sia espressa in modo specifico, chiaro e mirato. In altre parole, il nostro primo passo è quello di riscrivere la domanda ed estrarre tutte le subquery o le subdomande. Utilizziamo efficacemente la specializzazione dei nostri modelli di base per il ragionamento e un metodo semplice per l'output strutturato JSON.</p>
<p>Ecco un esempio di traccia di ragionamento mentre DeepSeek affina la domanda "Come è cambiato il cast nel corso del tempo?</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Ricerca</h3><p>Successivamente, effettuiamo una "revisione della letteratura" degli articoli di Wikipedia. Per ora leggiamo un singolo articolo e rimandiamo la navigazione dei link a un'iterazione futura. Durante la prototipazione abbiamo scoperto che l'esplorazione dei link può diventare molto costosa se ogni link richiede una chiamata al modello di ragionamento. Analizziamo l'articolo e memorizziamo i suoi dati nel nostro database vettoriale, Milvus, come se prendessimo appunti.</p>
<p>Ecco uno snippet di codice che mostra come archiviare la nostra pagina di Wikipedia in Milvus, utilizzando la sua integrazione con LangChain:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Analizzare</h3><p>L'agente torna alle sue domande e risponde in base alle informazioni rilevanti contenute nel documento. Lasceremo al lavoro futuro un flusso di analisi/riflessione in più fasi, così come una riflessione critica sulla credibilità e sulla parzialità delle nostre fonti.</p>
<p>Ecco un frammento di codice che illustra la costruzione di una RAG con LangChain e la risposta alle nostre sottodomande separatamente.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Sintetizzare</h3><p>Dopo che l'agente ha svolto la sua ricerca, crea uno schema strutturato, o meglio, uno scheletro, dei suoi risultati da riassumere in un rapporto. Completa quindi ogni sezione, inserendo un titolo e il contenuto corrispondente. Lasciamo a una futura iterazione un flusso di lavoro più sofisticato, con riflessione, riordino e riscrittura. Questa parte dell'agente comporta la pianificazione, l'uso di strumenti e la memoria.</p>
<p>Si veda il <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">notebook allegato</a> per il codice completo e il <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">file di report salvato</a> per un esempio di output.</p>
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
    </button></h2><p>La nostra domanda per il test è <em>"Come sono cambiati i Simpson nel tempo?"</em> e la fonte dei dati è l'articolo di Wikipedia sui "Simpson". Ecco una sezione del <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">report generato</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Riepilogo: cosa abbiamo costruito e cosa succederà in futuro<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>In poche ore abbiamo progettato un flusso di lavoro agenziale di base in grado di ragionare, pianificare e recuperare informazioni da Wikipedia per generare un rapporto di ricerca strutturato. Sebbene questo prototipo sia ben lontano dalla Deep Research di OpenAI, dimostra la potenza di strumenti open-source come Milvus, DeepSeek e LangChain nella costruzione di agenti di ricerca autonomi.</p>
<p>Naturalmente, c'è molto spazio per i miglioramenti. Le future iterazioni potrebbero:</p>
<ul>
<li><p>Espandersi oltre Wikipedia per cercare più fonti in modo dinamico.</p></li>
<li><p>introdurre il backtracking e la riflessione per affinare le risposte</p></li>
<li><p>Ottimizzare il flusso di esecuzione in base al ragionamento dell'agente stesso.</p></li>
</ul>
<p>L'open-source ci offre una flessibilità e un controllo che il closed source non ha. Sia che si tratti di ricerca accademica, di sintesi di contenuti o di assistenza basata sull'intelligenza artificiale, la creazione di agenti di ricerca personalizzati apre possibilità entusiasmanti. Rimanete sintonizzati per il prossimo post, in cui esploreremo l'aggiunta del recupero del web in tempo reale, del ragionamento in più fasi e del flusso di esecuzione condizionale!</p>
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
<li><p>Appunti: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Linea di base per una ricerca profonda open source</em></a><em>".</em></p></li>
<li><p>Rapporto: <em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>L'evoluzione dei Simpson come show nel corso del tempo, con cambiamenti nei contenuti, nell'umorismo, nello sviluppo dei personaggi, nell'animazione e nel suo ruolo nella società</em></a><em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>.</em></a></p></li>
<li><p><a href="https://milvus.io/docs">Documentazione del database vettoriale Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Pagina del modello DeepSeek R1 distillato e quantizzato</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">FAQ sulla ricerca profonda | Centro di assistenza OpenAI</a></p></li>
</ul>

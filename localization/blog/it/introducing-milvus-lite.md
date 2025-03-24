---
id: introducing-milvus-lite.md
title: >-
  Presentazione di Milvus Lite: Iniziare a costruire un'applicazione GenAI in
  pochi secondi
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Siamo lieti di presentare <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, un database vettoriale leggero che viene eseguito localmente all'interno della vostra applicazione Python. Basato sul popolare database vettoriale open-source <a href="https://milvus.io/intro">Milvus</a>, Milvus Lite riutilizza i componenti fondamentali per l'indicizzazione vettoriale e l'analisi delle query, eliminando gli elementi progettati per un'elevata scalabilità nei sistemi distribuiti. Questo design rende la soluzione compatta ed efficiente, ideale per ambienti con risorse di calcolo limitate, come laptop, Jupyter Notebook e dispositivi mobili o edge.</p>
<p>Milvus Lite si integra con diversi stack di sviluppo dell'intelligenza artificiale come LangChain e LlamaIndex, consentendo di utilizzarlo come archivio vettoriale nelle pipeline di Retrieval Augmented Generation (RAG) senza la necessità di configurare un server. È sufficiente eseguire <code translate="no">pip install pymilvus</code> (versione 2.4.3 o superiore) per incorporarlo nelle applicazioni di intelligenza artificiale come libreria Python.</p>
<p>Milvus Lite condivide l'API di Milvus, assicurando che il codice lato client funzioni sia per distribuzioni locali su piccola scala che per server Milvus distribuiti su Docker o Kubernetes con miliardi di vettori.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Perché abbiamo costruito Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Molte applicazioni di intelligenza artificiale richiedono la ricerca per similarità vettoriale di dati non strutturati, compresi testi, immagini, voci e video, per applicazioni come chatbot e assistenti agli acquisti. I database vettoriali sono realizzati per la memorizzazione e la ricerca di incorporazioni vettoriali e sono una parte cruciale dello stack di sviluppo dell'IA, in particolare per i casi d'uso dell'IA generativa come la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Nonostante la disponibilità di numerose soluzioni di ricerca vettoriale, mancava un'opzione facile da avviare che funzionasse anche per le implementazioni di produzione su larga scala. In qualità di creatori di Milvus, abbiamo progettato Milvus Lite per aiutare gli sviluppatori di intelligenza artificiale a creare applicazioni più velocemente, garantendo al contempo un'esperienza coerente tra le varie opzioni di distribuzione, tra cui Milvus su Kubernetes, Docker e servizi cloud gestiti.</p>
<p>Milvus Lite è un'aggiunta fondamentale alla nostra suite di offerte all'interno dell'ecosistema Milvus. Offre agli sviluppatori uno strumento versatile che supporta ogni fase del loro percorso di sviluppo. Dalla prototipazione agli ambienti di produzione, dall'edge computing alle implementazioni su larga scala, Milvus è ora l'unico database vettoriale che copre casi d'uso di qualsiasi dimensione e tutte le fasi di sviluppo.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Come funziona Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite supporta tutte le operazioni di base disponibili in Milvus, come la creazione di collezioni e l'inserimento, la ricerca e la cancellazione di vettori. Presto supporterà funzioni avanzate come la ricerca ibrida. Milvus Lite carica i dati in memoria per effettuare ricerche efficienti e li conserva come file SQLite.</p>
<p>Milvus Lite è incluso nell'<a href="https://github.com/milvus-io/pymilvus">SDK Python di Milvus</a> e può essere distribuito con un semplice <code translate="no">pip install pymilvus</code>. Il seguente frammento di codice mostra come impostare un database vettoriale con Milvus Lite, specificando un nome di file locale e creando una nuova collezione. Per chi ha familiarità con l'API Milvus, l'unica differenza è che <code translate="no">uri</code> si riferisce a un nome di file locale invece che a un endpoint di rete, ad esempio <code translate="no">&quot;milvus_demo.db&quot;</code> invece di <code translate="no">&quot;http://localhost:19530&quot;</code> per un server Milvus. Tutto il resto rimane invariato. Milvus Lite supporta anche la memorizzazione di testo grezzo e altre etichette come metadati, utilizzando uno schema dinamico o esplicitamente definito, come mostrato di seguito.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Per quanto riguarda la scalabilità, un'applicazione di IA sviluppata con Milvus Lite può facilmente passare all'uso di Milvus distribuito su Docker o Kubernetes, semplicemente specificando <code translate="no">uri</code> con l'endpoint del server.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integrazione con lo stack di sviluppo AI<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a introdurre Milvus Lite per rendere la ricerca vettoriale semplice all'inizio, Milvus si integra anche con molti framework e fornitori dello stack di sviluppo AI, tra cui <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> e <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Grazie ai loro ampi strumenti e servizi, queste integrazioni semplificano lo sviluppo di applicazioni AI con capacità di ricerca vettoriale.</p>
<p>E questo è solo l'inizio: molte altre interessanti integrazioni sono in arrivo! Restate sintonizzati!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Altre risorse ed esempi<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Esplorate la <a href="https://milvus.io/docs/quickstart.md">documentazione rapida di Milvus</a> per trovare guide dettagliate ed esempi di codice sull'uso di Milvus Lite per costruire applicazioni di IA come Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) e <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">ricerca di immagini</a>.</p>
<p>Milvus Lite è un progetto open-source e siamo lieti di ricevere i vostri contributi. Per iniziare, consultate la nostra <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Guida alla contribuzione</a>. È inoltre possibile segnalare bug o richiedere funzionalità inviando un problema sul repository <a href="https://github.com/milvus-io/milvus-lite">GitHub</a> di <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>.</p>

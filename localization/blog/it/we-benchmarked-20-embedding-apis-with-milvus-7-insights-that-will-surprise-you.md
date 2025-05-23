---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >-
  Abbiamo effettuato un benchmark di oltre 20 API di embedding con Milvus: 7
  informazioni che vi sorprenderanno
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  Le API di incorporamento più popolari non sono le più veloci. La geografia
  conta più dell'architettura del modello. E a volte una CPU da 20 dollari al
  mese è meglio di una chiamata API da 200 dollari al mese.
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>Probabilmente ogni sviluppatore di intelligenza artificiale ha costruito un sistema RAG che funziona perfettamente... nel suo ambiente locale.</strong></p>
<p>Avete ottenuto la massima precisione di recupero, ottimizzato il database dei vettori e la vostra demo funziona alla perfezione. Poi si passa alla produzione e improvvisamente:</p>
<ul>
<li><p>Le vostre query locali da 200 ms impiegano 3 secondi per gli utenti reali.</p></li>
<li><p>Colleghi in regioni diverse riportano prestazioni completamente diverse</p></li>
<li><p>Il fornitore di embedding che avete scelto per la "migliore accuratezza" diventa il vostro principale collo di bottiglia.</p></li>
</ul>
<p>Che cosa è successo? Ecco il killer delle prestazioni che nessuno analizza: la <strong>latenza dell'API di embedding</strong>.</p>
<p>Mentre le classifiche MTEB sono ossessionate dai punteggi di richiamo e dalle dimensioni dei modelli, ignorano la metrica percepita dagli utenti: il tempo di attesa prima di vedere una risposta. Abbiamo testato tutti i principali fornitori di embedding in condizioni reali e abbiamo scoperto differenze di latenza estreme che vi faranno mettere in discussione l'intera strategia di selezione dei fornitori.</p>
<p><strong><em>Spoiler: Le API di incorporamento più popolari non sono le più veloci. La geografia conta più dell'architettura del modello. E a volte una <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>CPU</mn><mi>20/meseCPUbeatsa20/mese</mi><mn>batte</mn></mrow><annotation encoding="application/x-tex">una</annotation></semantics></math></span></span>chiamata API</em></strong><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><strong><em> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">20/meseCPUbeatsa200/mese</span></span></span></span>.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Perché la latenza dell'API incorporata è il collo di bottiglia nascosto nelle RAG<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si costruiscono sistemi RAG, ricerche di e-commerce o motori di raccomandazione, i modelli di embedding sono il componente centrale che trasforma il testo in vettori, consentendo alle macchine di comprendere la semantica e di eseguire ricerche di similarità efficienti. Anche se di solito precompiliamo gli embedding per le librerie di documenti, le query degli utenti richiedono comunque chiamate API di embedding in tempo reale per convertire le domande in vettori prima del recupero, e questa latenza in tempo reale diventa spesso il collo di bottiglia delle prestazioni nell'intera catena applicativa.</p>
<p>I benchmark di embedding più diffusi, come MTEB, si concentrano sull'accuratezza del richiamo o sulle dimensioni del modello, trascurando spesso la metrica cruciale delle prestazioni: la latenza dell'API. Utilizzando la funzione <code translate="no">TextEmbedding</code> di Milvus, abbiamo condotto test completi nel mondo reale sui principali fornitori di servizi di embedding in Nord America e in Asia.</p>
<p>La latenza di embedding si manifesta in due fasi critiche:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Impatto sul tempo di interrogazione</h3><p>In un tipico flusso di lavoro RAG, quando un utente pone una domanda, il sistema deve:</p>
<ul>
<li><p>Convertire la domanda in un vettore tramite una chiamata API di incorporamento.</p></li>
<li><p>Cercare vettori simili in Milvus</p></li>
<li><p>Trasmettere i risultati e la domanda originale a un LLM</p></li>
<li><p>Generare e restituire la risposta</p></li>
</ul>
<p>Molti sviluppatori ritengono che la generazione della risposta da parte dell'LLM sia la parte più lenta. Tuttavia, la capacità di output in streaming di molti LLM crea un'illusione di velocità: si vede rapidamente il primo token. In realtà, se la chiamata all'API di incorporamento richiede centinaia di millisecondi o addirittura secondi, diventa il primo e più evidente collo di bottiglia nella catena di risposta.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Impatto dell'ingestione dei dati</h3><p>Sia che si tratti di costruire un indice da zero o di eseguire aggiornamenti di routine, l'ingestione di grandi quantità di dati richiede la vettorializzazione di migliaia o milioni di pezzi di testo. Se ogni chiamata di embedding ha una latenza elevata, l'intera pipeline di dati rallenta drasticamente, ritardando i rilasci dei prodotti e gli aggiornamenti della knowledge base.</p>
<p>Entrambe le situazioni rendono la latenza dell'API di embedding una metrica di performance non negoziabile per i sistemi RAG di produzione.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Misurare la latenza delle API di incorporamento nel mondo reale con Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un database vettoriale open-source ad alte prestazioni che offre una nuova interfaccia <code translate="no">TextEmbedding</code> Function. Questa funzione integra direttamente i modelli di embedding più diffusi di OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI e molti altri fornitori nella pipeline di dati, ottimizzando la pipeline di ricerca vettoriale con una sola chiamata.</p>
<p>Utilizzando questa nuova interfaccia funzionale, abbiamo testato e sottoposto a benchmark le più diffuse API di embedding di fornitori noti come OpenAI e Cohere, nonché di altri come AliCloud e SiliconFlow, misurandone la latenza end-to-end in scenari di implementazione realistici.</p>
<p>La nostra suite di test completa ha coperto diverse configurazioni di modelli:</p>
<table>
<thead>
<tr><th><strong>Fornitore</strong></th><th><strong>Modello</strong></th><th><strong>Dimensioni</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>testo-embedding-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>testo-embedding-3-piccolo</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>testo-inclusione-3-grande</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>testo-embedding-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>testo-multilingue-embedding-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>ViaggioAI</td><td>viaggio-3</td><td>1024</td></tr>
<tr><td>ViaggioAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>ViaggioAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>incorporare-multilingue-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>incorporare-inglese-leggero-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>incorporare-multilingue-leggero-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>testo-embedding-v1</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>testo-inclusione-v2</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>testo-inclusione-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-grande-zh-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-grande-it-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Flusso di silicio</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Flusso di silicio</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-it-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Risultati chiave dei nostri benchmark<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo testato i principali modelli di embedding in base a diverse dimensioni di batch, lunghezza dei token e condizioni di rete, misurando la latenza mediana in tutti gli scenari. I risultati rivelano intuizioni chiave che potrebbero rimodellare il modo in cui scegliete e ottimizzate le API di embedding. Diamo un'occhiata.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Gli effetti della rete globale sono più significativi di quanto si pensi</h3><p>L'ambiente di rete è forse il fattore più critico che influisce sulle prestazioni delle API di embedding. Lo stesso fornitore di servizi API di embedding può avere prestazioni molto diverse a seconda dell'ambiente di rete.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando la vostra applicazione è distribuita in Asia e accede a servizi come OpenAI, Cohere o VoyageAI distribuiti in Nord America, la latenza di rete aumenta in modo significativo. I nostri test reali mostrano che la latenza delle chiamate API è universalmente aumentata <strong>da 3 a 4 volte</strong>!</p>
<p>Al contrario, quando l'applicazione è distribuita in Nord America e accede a servizi asiatici come AliCloud Dashscope o SiliconFlow, il degrado delle prestazioni è ancora più grave. SiliconFlow, in particolare, ha mostrato un aumento della latenza di <strong>quasi 100 volte</strong> negli scenari cross-region!</p>
<p>Ciò significa che è sempre necessario selezionare i fornitori di embedding in base alla posizione dell'installazione e alla geografia degli utenti: le affermazioni sulle prestazioni senza un contesto di rete sono prive di significato.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. Le classifiche delle prestazioni del modello rivelano risultati sorprendenti</h3><p>I nostri test completi sulla latenza hanno rivelato chiare gerarchie di prestazioni:</p>
<ul>
<li><p><strong>Modelli basati sul Nord America (latenza mediana)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Modelli basati in Asia (latenza mediana)</strong>: SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>Queste classifiche sfidano la saggezza convenzionale sulla selezione dei provider.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nota: a causa dell'impatto significativo dell'ambiente di rete e delle regioni geografiche dei server sulla latenza delle API di embedding in tempo reale, abbiamo confrontato separatamente le latenze dei modelli basati sul Nord America e sull'Asia.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. L'impatto delle dimensioni del modello varia drasticamente a seconda del provider</h3><p>Abbiamo osservato una tendenza generale per cui i modelli più grandi hanno una latenza maggiore rispetto ai modelli standard, che hanno una latenza maggiore rispetto ai modelli più piccoli/lite. Tuttavia, questo schema non è universale e ha rivelato importanti informazioni sull'architettura del backend. Ad esempio:</p>
<ul>
<li><p><strong>Cohere e OpenAI</strong> hanno mostrato un divario di prestazioni minimo tra le dimensioni dei modelli.</p></li>
<li><p><strong>VoyageAI</strong> ha mostrato chiare differenze di prestazioni in base alle dimensioni del modello.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ciò indica che il tempo di risposta delle API dipende da molteplici fattori oltre all'architettura del modello, tra cui le strategie di batching del backend, l'ottimizzazione della gestione delle richieste e l'infrastruttura specifica del provider. La lezione è chiara: <em>non fidatevi delle dimensioni del modello o della data di rilascio come indicatori affidabili delle prestazioni, ma testate sempre il vostro ambiente di distribuzione.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. La lunghezza dei token e la dimensione dei lotti creano compromessi complessi</h3><p>A seconda dell'implementazione del backend e in particolare della strategia di batching. La lunghezza dei token può avere un impatto minimo sulla latenza fino a quando le dimensioni dei batch non crescono. I nostri test hanno rivelato alcuni schemi chiari:</p>
<ul>
<li><p><strong>La latenza di OpenAI</strong> è rimasta abbastanza costante tra lotti piccoli e grandi, suggerendo generose capacità di batching del backend.</p></li>
<li><p><strong>VoyageAI</strong> ha mostrato chiari effetti sulla lunghezza dei token, il che implica un'ottimizzazione minima del backend batching.</p></li>
</ul>
<p>Lotti più grandi aumentano la latenza assoluta ma migliorano il throughput complessivo. Nei nostri test, passare da batch=1 a batch=10 ha aumentato la latenza di 2×-5×, pur incrementando sostanzialmente il throughput totale. Questo rappresenta un'opportunità di ottimizzazione critica per i flussi di lavoro di elaborazione in blocco, dove è possibile scambiare la latenza delle singole richieste con un netto miglioramento del throughput complessivo del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Passando da batch=1 a 10, la latenza è aumentata di 2×-5×.</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. L'affidabilità delle API introduce un rischio di produzione</h3><p>Abbiamo osservato una significativa variabilità della latenza, in particolare con OpenAI e VoyageAI, che introduce imprevedibilità nei sistemi di produzione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Varianza della latenza quando batch=1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Variazione della latenza con batch=10</p>
<p>Sebbene i nostri test si siano concentrati principalmente sulla latenza, affidarsi a qualsiasi API esterna introduce rischi intrinseci di guasto, tra cui le fluttuazioni della rete, la limitazione delle tariffe dei provider e le interruzioni del servizio. In assenza di SLA chiari da parte dei fornitori, gli sviluppatori dovrebbero implementare strategie robuste di gestione degli errori, tra cui tentativi, timeout e interruzioni per mantenere l'affidabilità del sistema negli ambienti di produzione.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. L'inferenza locale può essere sorprendentemente competitiva</h3><p>I nostri test hanno anche rivelato che l'implementazione di modelli di incorporazione di medie dimensioni a livello locale può offrire prestazioni paragonabili a quelle delle API del cloud, un dato cruciale per le applicazioni attente al budget o sensibili alla latenza.</p>
<p>Ad esempio, l'implementazione dell'open-source <code translate="no">bge-base-en-v1.5</code> tramite TEI (Text Embeddings Inference) su una modesta CPU da 4c8g ha eguagliato le prestazioni di SiliconFlow in termini di latenza, offrendo un'alternativa conveniente per l'inferenza locale. Questo risultato è particolarmente significativo per i singoli sviluppatori e i piccoli team che potrebbero non disporre di risorse GPU di livello aziendale, ma che necessitano comunque di capacità di embedding ad alte prestazioni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenza TEI</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. L'overhead di Milvus è trascurabile</h3><p>Poiché abbiamo usato Milvus per testare la latenza dell'API di incorporazione, abbiamo convalidato che l'overhead aggiuntivo introdotto dalla funzione TextEmbedding di Milvus è minimo e praticamente trascurabile. Le nostre misurazioni mostrano che le operazioni di Milvus aggiungono solo 20-40 ms in totale, mentre le chiamate all'API di incorporamento richiedono da centinaia di millisecondi a diversi secondi, il che significa che Milvus aggiunge meno del 5% di overhead al tempo totale dell'operazione. Il collo di bottiglia delle prestazioni risiede principalmente nella trasmissione di rete e nelle capacità di elaborazione dei fornitori di servizi API di embedding, non nel livello del server Milvus.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Suggerimenti: Come ottimizzare le prestazioni del RAG Embedding<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Sulla base dei nostri benchmark, raccomandiamo le seguenti strategie per ottimizzare le prestazioni di embedding del vostro sistema RAG:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. Localizzare sempre i test</h3><p>Non fidatevi dei rapporti di benchmark generici (compreso questo!). Dovete sempre testare i modelli all'interno del vostro ambiente di distribuzione reale, piuttosto che affidarvi esclusivamente ai benchmark pubblicati. Le condizioni di rete, la vicinanza geografica e le differenze infrastrutturali possono avere un impatto notevole sulle prestazioni reali.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Abbinare i fornitori in modo strategico</h3><ul>
<li><p><strong>Per le implementazioni in Nord America</strong>: Considerate Cohere, VoyageAI, OpenAI/Azure o GCP Vertex AI e conducete sempre la vostra convalida delle prestazioni.</p></li>
<li><p><strong>Per le implementazioni in Asia</strong>: Considerare seriamente i fornitori di modelli asiatici come AliCloud Dashscope o SiliconFlow, che offrono migliori prestazioni regionali.</p></li>
<li><p><strong>Per il pubblico globale</strong>: Implementare il routing multiregionale o selezionare fornitori con infrastrutture distribuite a livello globale per ridurre al minimo le penalizzazioni di latenza tra le regioni.</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Mettere in discussione le scelte dei provider predefiniti</h3><p>I modelli di incorporazione di OpenAI sono così popolari che molte aziende e sviluppatori li scelgono come opzioni predefinite. Tuttavia, i nostri test hanno rivelato che la latenza e la stabilità di OpenAI sono nella media, nonostante la sua popolarità sul mercato. Sfidate le ipotesi sui fornitori "migliori" con i vostri rigorosi benchmark: la popolarità non è sempre correlata a prestazioni ottimali per il vostro caso d'uso specifico.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Ottimizzare le configurazioni di batch e chunk</h3><p>Una configurazione non è adatta a tutti i modelli o casi d'uso. Le dimensioni ottimali dei batch e la lunghezza dei chunk variano significativamente da un fornitore all'altro, a causa delle diverse architetture di backend e delle strategie di batching. Sperimentate sistematicamente diverse configurazioni per trovare il punto di prestazione ottimale, considerando i compromessi tra throughput e latenza per i requisiti specifici dell'applicazione.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Implementare una cache strategica</h3><p>Per le query ad alta frequenza, memorizzare nella cache sia il testo della query che le sue incorporazioni generate (utilizzando soluzioni come Redis). Le interrogazioni successive identiche possono essere eseguite direttamente nella cache, riducendo la latenza a pochi millisecondi. Questa è una delle tecniche di ottimizzazione della latenza delle query più efficaci dal punto di vista dei costi e dell'impatto.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Considerare la distribuzione dell'inferenza locale</h3><p>Se i requisiti per la latenza di ingestione dei dati, la latenza delle query e la privacy dei dati sono estremamente elevati, o se i costi delle chiamate API sono proibitivi, si può prendere in considerazione la distribuzione dei modelli di incorporamento a livello locale per l'inferenza. I piani API standard sono spesso caratterizzati da limitazioni QPS, latenza instabile e mancanza di garanzie SLA, vincoli che possono essere problematici per gli ambienti di produzione.</p>
<p>Per molti singoli sviluppatori o piccoli team, la mancanza di GPU di livello enterprise rappresenta un ostacolo alla distribuzione locale di modelli di embedding ad alte prestazioni. Tuttavia, questo non significa abbandonare del tutto l'inferenza locale. Con motori di inferenza ad alte prestazioni come <a href="https://github.com/huggingface/text-embeddings-inference">il text-embeddings-inference di Hugging Face</a>, anche l'esecuzione di modelli di embedding di piccole o medie dimensioni su una CPU può raggiungere prestazioni decenti che possono superare le chiamate API ad alta latenza, soprattutto per la generazione di embedding offline su larga scala.</p>
<p>Questo approccio richiede un'attenta considerazione dei compromessi tra costi, prestazioni e complessità di manutenzione.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Come Milvus semplifica il vostro flusso di lavoro di incorporazione<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Come già detto, Milvus non è solo un database vettoriale ad alte prestazioni: offre anche una comoda interfaccia per le funzioni di embedding che si integra perfettamente con i modelli di embedding più diffusi di vari fornitori, come OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI e altri in tutto il mondo, nella vostra pipeline di ricerca vettoriale.</p>
<p>Milvus va oltre l'archiviazione e il recupero dei vettori con funzioni che semplificano l'integrazione dell'embedding:</p>
<ul>
<li><p><strong>Gestione efficiente dei vettori</strong>: Come database ad alte prestazioni costruito per collezioni vettoriali massive, Milvus offre un'archiviazione affidabile, opzioni di indicizzazione flessibili (HNSW, IVF, RaBitQ, DiskANN e altro) e capacità di recupero rapide e precise.</p></li>
<li><p><strong>Cambio di provider semplificato</strong>: Milvus offre un'interfaccia di funzione <code translate="no">TextEmbedding</code>, che consente di configurare la funzione con le chiavi API, di cambiare provider o modello istantaneamente e di misurare le prestazioni del mondo reale senza una complessa integrazione SDK.</p></li>
<li><p><strong>Pipeline di dati end-to-end</strong>: Chiamate <code translate="no">insert()</code> con testo grezzo e Milvus incorpora e memorizza automaticamente i vettori in un'unica operazione, semplificando notevolmente il codice della vostra pipeline di dati.</p></li>
<li><p><strong>Da testo a risultati in una sola chiamata</strong>: Chiamate <code translate="no">search()</code> con query di testo e Milvus si occuperà di incorporare, cercare e restituire i risultati, il tutto in un'unica chiamata API.</p></li>
<li><p><strong>Integrazione indipendente dai provider</strong>: Milvus astrae dai dettagli dell'implementazione dei provider; basta configurare una volta la funzione e la chiave API e si è pronti a partire.</p></li>
<li><p><strong>Compatibilità con l'ecosistema open source</strong>: Sia che si generino embeddings tramite la nostra funzione integrata <code translate="no">TextEmbedding</code>, l'inferenza locale o un altro metodo, Milvus fornisce funzionalità unificate di archiviazione e recupero.</p></li>
</ul>
<p>Questo crea un'esperienza semplificata di "Data-In, Insight-Out" in cui Milvus gestisce internamente la generazione dei vettori, rendendo il codice dell'applicazione più semplice e manutenibile.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Conclusioni: La verità sulle prestazioni di cui ha bisogno il vostro sistema RAG<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>L'assassino silenzioso delle prestazioni di RAG non si trova dove la maggior parte degli sviluppatori guarda. Mentre i team investono risorse nella progettazione immediata e nell'ottimizzazione dell'LLM, la latenza dell'API sabota silenziosamente l'esperienza dell'utente con ritardi che possono essere 100 volte peggiori del previsto. I nostri benchmark completi mettono in luce la dura realtà: popolare non significa performante, la geografia conta più della scelta dell'algoritmo in molti casi e l'inferenza locale a volte batte le costose API cloud.</p>
<p>Questi risultati evidenziano un punto cieco cruciale nell'ottimizzazione delle RAG. Le penalizzazioni della latenza tra le regioni, le classifiche inaspettate delle prestazioni dei provider e la sorprendente competitività dell'inferenza locale non sono casi limite, ma realtà produttive che riguardano applicazioni reali. Comprendere e misurare le prestazioni delle API di embedding è essenziale per offrire esperienze utente reattive.</p>
<p>La scelta del fornitore di embedding è un tassello fondamentale del puzzle delle prestazioni RAG. Effettuando i test nell'ambiente di distribuzione reale, selezionando i provider geograficamente appropriati e prendendo in considerazione alternative come l'inferenza locale, è possibile eliminare una delle principali fonti di ritardo per l'utente e creare applicazioni di intelligenza artificiale veramente reattive.</p>
<p>Per maggiori dettagli su come abbiamo effettuato il benchmarking, consultate <a href="https://github.com/zhuwenxing/text-embedding-bench">questo notebook</a>.</p>

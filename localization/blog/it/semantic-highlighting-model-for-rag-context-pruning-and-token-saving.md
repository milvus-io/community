---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >-
  Come abbiamo costruito un modello di evidenziazione semantica per la selezione
  del contesto RAG e il salvataggio dei token
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: 'https://assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png'
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Scoprite come Zilliz ha costruito un modello di evidenziazione semantica per
  il filtraggio del rumore RAG, la potatura del contesto e il salvataggio dei
  token, utilizzando architetture di solo encoder, ragionamento LLM e dati di
  formazione bilingue su larga scala.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">Il problema: Rumore RAG e spreco di token<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p>La<strong>ricerca vettoriale</strong> è una base solida per i sistemi RAG: assistenti aziendali, agenti AI, bot di assistenza clienti e altro ancora. Trova in modo affidabile i documenti che contano. Ma il reperimento da solo non risolve il problema del contesto. Anche gli indici ben tarati restituiscono pezzi ampiamente rilevanti, mentre solo una piccola parte delle frasi contenute in quei pezzi risponde effettivamente alla query.</p>
<p>Nei sistemi di produzione, questo divario si manifesta immediatamente. Una singola query può raccogliere decine di documenti, ciascuno lungo migliaia di token. Solo una manciata di frasi contiene il segnale vero e proprio; il resto è contesto che gonfia l'uso dei token, rallenta l'inferenza e spesso distrae il LLM. Il problema diventa ancora più evidente nei flussi di lavoro ad agenti, dove le query stesse sono il risultato di ragionamenti in più fasi e corrispondono solo a piccole parti del testo recuperato.</p>
<p>Questo crea una chiara necessità di un modello in grado di <em><strong>identificare ed evidenziare</strong></em> <em>le frasi utili e ignorare il resto: in sostanza,</em>un filtro di rilevanza a livello di frase, o quello che molti team chiamano <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>context pruning</strong></a>. L'obiettivo è semplice: mantenere le parti che contano ed eliminare il rumore prima che raggiunga l'LLM.</p>
<p>L'evidenziazione tradizionale basata sulle parole chiave non può risolvere questo problema. Per esempio, se un utente chiede "Come posso migliorare l'efficienza dell'esecuzione del codice Python?", un evidenziatore di parole chiave individuerà "Python" e "efficienza", ma non troverà la frase che risponde effettivamente alla domanda - "Usa le operazioni vettoriali NumPy invece dei loop" - perché non condivide alcuna parola chiave con la query. Ciò di cui abbiamo bisogno è una comprensione semantica, non una corrispondenza di stringhe.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">Un modello di evidenziazione semantica per il filtraggio del rumore e la selezione del contesto di RAG<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Per facilitare i costruttori di RAG, abbiamo addestrato e reso disponibile un <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>modello di Semantic Highlighting</strong></a> che identifica ed evidenzia le frasi nei documenti recuperati che sono semanticamente più allineate con la query. Il modello offre attualmente lo stato dell'arte delle prestazioni sia in inglese che in cinese ed è stato progettato per essere inserito direttamente nelle pipeline RAG esistenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dettagli del modello</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Licenza:</strong> MIT (commercial-friendly)</p></li>
<li><p><strong>Architettura:</strong> 0,6B modello solo encoder basato su BGE-M3 Reranker v2</p></li>
<li><p><strong>Finestra di contesto:</strong> 8192 token</p></li>
<li><p><strong>Lingue supportate:</strong> Inglese e cinese</p></li>
</ul>
<p>L'evidenziazione semantica fornisce i segnali di rilevanza necessari per selezionare solo le parti utili dei lunghi documenti recuperati. In pratica, questo modello consente di:</p>
<ul>
<li><p><strong>una migliore interpretabilità</strong>, mostrando quali parti di un documento sono effettivamente importanti</p></li>
<li><p><strong>riduzione del 70-80% del costo dei token</strong>, inviando al LLM solo le frasi evidenziate</p></li>
<li><p><strong>una migliore qualità delle risposte</strong>, poiché il modello vede meno contesto irrilevante</p></li>
<li><p><strong>Un debugging più semplice</strong>, perché gli ingegneri possono ispezionare direttamente le corrispondenze a livello di frase.</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Risultati della valutazione: Raggiungere le prestazioni SOTA</h3><p>Abbiamo valutato il nostro modello di evidenziazione semantica su diversi set di dati in inglese e cinese, sia in condizioni di dominio che di non dominio.</p>
<p>Le suite di benchmark comprendono:</p>
<ul>
<li><p><strong>QA inglese multi-span:</strong> multispanqa</p></li>
<li><p><strong>Wikipedia inglese fuori dal dominio:</strong> wikitext2</p></li>
<li><p><strong>AQ cinese multi-span:</strong> multispanqa_zh</p></li>
<li><p><strong>Wikipedia cinese fuori dominio:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I modelli valutati includono:</p>
<ul>
<li><p>Serie Open Provence</p></li>
<li><p>Serie Provence/XProvence di Naver</p></li>
<li><p>Evidenziatore semantico di OpenSearch</p></li>
<li><p>Il nostro modello bilingue addestrato: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>In tutti e quattro i dataset, il nostro modello raggiunge il primo posto in classifica. E soprattutto, è l'<em>unico</em> modello che ottiene risultati consistenti sia in inglese che in cinese. I modelli concorrenti si concentrano esclusivamente sull'inglese o mostrano evidenti cali di prestazioni sul testo cinese.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">Come abbiamo costruito questo modello di evidenziazione semantica<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>L'addestramento di un modello per questo compito non è la parte più difficile; l'addestramento di un <em>buon</em> modello che gestisca i problemi precedenti e fornisca prestazioni vicine al SOTA è il vero lavoro. Il nostro approccio si è concentrato su due aspetti:</p>
<ul>
<li><p><strong>Architettura del modello:</strong> utilizzare un progetto di solo encoder per un'inferenza veloce.</p></li>
<li><p><strong>Dati di addestramento:</strong> generare etichette di rilevanza di alta qualità utilizzando LLM in grado di ragionare e scalare la generazione di dati con framework di inferenza locale.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Architettura del modello</h3><p>Abbiamo costruito il modello come una rete leggera di <strong>sola codifica</strong> che tratta il potenziamento del contesto come un <strong>compito di punteggio di rilevanza a livello di token</strong>. Questo design si ispira a <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, un approccio di potatura del contesto presentato da Naver all'ICLR 2025, che riformula la potatura da "scegliere il pezzo giusto" a "segnare ogni token". Questa impostazione si allinea naturalmente con l'evidenziazione semantica, dove i segnali a grana fine sono essenziali.</p>
<p>I modelli di solo codificatore non sono l'architettura più recente, ma in questo caso sono estremamente pratici: sono veloci, facili da scalare e possono produrre punteggi di rilevanza per tutte le posizioni dei token in parallelo. Per un sistema RAG di produzione, questo vantaggio di velocità è molto più importante dell'uso di un modello di decodifica più grande.</p>
<p>Una volta calcolati i punteggi di rilevanza a livello di token, li aggreghiamo in punteggi <strong>a livello di frase</strong>. Questo passaggio trasforma i segnali rumorosi dei token in una metrica di rilevanza stabile e interpretabile. Le frasi che superano una soglia configurabile vengono evidenziate; tutto il resto viene filtrato. In questo modo si ottiene un meccanismo semplice e affidabile per selezionare le frasi che sono effettivamente importanti per la query.</p>
<h3 id="Inference-Process" class="common-anchor-header">Processo di inferenza</h3><p>In fase di esecuzione, il nostro modello di evidenziazione semantica segue una semplice pipeline:</p>
<ol>
<li><p><strong>Input -</strong> Il processo inizia con una query dell'utente. I documenti recuperati vengono trattati come contesto candidato per la valutazione della rilevanza.</p></li>
<li><p><strong>Elaborazione del modello:</strong> la query e il contesto vengono concatenati in un'unica sequenza: [BOS] + Query + Contesto</p></li>
<li><p><strong>Token Scoring -</strong> A ogni token del contesto viene assegnato un punteggio di rilevanza compreso tra 0 e 1, che riflette la sua forte correlazione con la query.</p></li>
<li><p><strong>Aggregazione delle frasi: i</strong> punteggi dei token vengono aggregati a livello di frase, in genere mediante una media, per produrre un punteggio di rilevanza per ogni frase.</p></li>
<li><p><strong>Filtro a soglia:</strong> le frasi con punteggi superiori a una soglia configurabile vengono evidenziate e mantenute, mentre le frasi con punteggi bassi vengono filtrate prima di essere passate all'LLM a valle.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Modello di base: BGE-M3 Reranker v2</h3><p>Abbiamo scelto BGE-M3 Reranker v2 come modello di base per diversi motivi:</p>
<ol>
<li><p>Utilizza un'architettura Encoder adatta allo scoring di token e frasi.</p></li>
<li><p>Supporta più lingue con ottimizzazione per l'inglese e il cinese</p></li>
<li><p>Fornisce una finestra contestuale di 8192 token adatta ai documenti RAG più lunghi.</p></li>
<li><p>Mantiene 0,6B parametri - abbastanza forti senza essere computazionalmente pesanti</p></li>
<li><p>Assicura una sufficiente conoscenza del mondo nel modello di base</p></li>
<li><p>Addestrato per il reranking, che si allinea strettamente con i compiti di giudizio di rilevanza.</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Dati di formazione: Annotazione LLM con ragionamento<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta messa a punto l'architettura del modello, la sfida successiva è stata la costruzione di un set di dati in grado di addestrare un modello affidabile. Abbiamo iniziato a guardare come Open Provence gestisce questo aspetto. Il loro approccio utilizza set di dati QA pubblici e un piccolo LLM per etichettare le frasi rilevanti. Si tratta di un metodo ben scalabile e facile da automatizzare, il che lo ha reso un buon punto di riferimento per noi.</p>
<p>Ma ci siamo subito imbattuti nello stesso problema descritto da loro: se si chiede a un LLM di produrre direttamente le etichette a livello di frase, i risultati non sono sempre stabili. Alcune etichette sono corrette, altre sono discutibili, ed è difficile ripulire le cose in seguito. Neanche l'annotazione completamente manuale era un'opzione possibile: avevamo bisogno di molti più dati di quelli che avremmo potuto etichettare a mano.</p>
<p>Per migliorare la stabilità senza sacrificare la scalabilità, abbiamo apportato una modifica: il LLM deve fornire un breve frammento di ragionamento per ogni etichetta che produce. Ogni esempio di addestramento include la query, il documento, le frasi e una breve spiegazione del perché una frase è rilevante o irrilevante. Questa piccola modifica ha reso le annotazioni molto più coerenti e ci ha dato qualcosa di concreto a cui fare riferimento durante la validazione o il debug del dataset.</p>
<p>L'inclusione del ragionamento si è rivelata sorprendentemente preziosa:</p>
<ul>
<li><p><strong>Una maggiore qualità delle annotazioni:</strong> La scrittura del ragionamento funziona come un autocontrollo, che riduce le etichette casuali o incoerenti.</p></li>
<li><p><strong>Migliore osservabilità:</strong> Possiamo vedere <em>perché</em> una frase è stata selezionata, invece di trattare l'etichetta come una scatola nera.</p></li>
<li><p><strong>Debug più facile:</strong> Quando qualcosa sembra sbagliato, il ragionamento rende facile individuare se il problema è il prompt, il dominio o la logica di annotazione.</p></li>
<li><p><strong>Dati riutilizzabili:</strong> Anche se in futuro passiamo a un modello di etichettatura diverso, le tracce del ragionamento rimangono utili per la rietichettatura o la verifica.</p></li>
</ul>
<p>Il flusso di lavoro di annotazione si presenta come segue:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B per l'annotazione</h3><p>Per l'annotazione, abbiamo scelto Qwen3 8B perché supporta in modo nativo una "modalità di pensiero" attraverso le uscite, rendendo molto più semplice l'estrazione di tracce di ragionamento coerenti. I modelli più piccoli non ci davano etichette stabili e quelli più grandi erano più lenti e inutilmente costosi per questo tipo di pipeline. Qwen3 8B ha raggiunto il giusto equilibrio tra qualità, velocità e costi.</p>
<p>Abbiamo eseguito tutte le annotazioni utilizzando un <strong>servizio vLLM locale</strong> anziché le API del cloud. Questo ci ha permesso di ottenere un throughput elevato, prestazioni prevedibili e costi molto più bassi: in sostanza, abbiamo scambiato il tempo della GPU con i costi dei token API, che è l'affare migliore quando si generano milioni di campioni.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Scala del set di dati</h3><p>In totale, abbiamo creato <strong>oltre 5 milioni di campioni di formazione bilingue</strong>, suddivisi in modo approssimativo tra inglese e cinese.</p>
<ul>
<li><p><strong>Fonti inglesi:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Fonti cinesi:</strong> DuReader, Wikipedia cinese, mmarco_chinese</p></li>
</ul>
<p>Una parte del set di dati proviene dalla rianimazioni di dati esistenti utilizzati da progetti come Open Provence. Il resto è stato generato da corpora grezzi creando prima coppie query-contesto e poi etichettandole con la nostra pipeline basata sul ragionamento.</p>
<p>Tutti i dati di addestramento annotati sono disponibili su HuggingFace per lo sviluppo della comunità e la formazione di riferimento: <a href="https://huggingface.co/zilliz/datasets">Dataset Zilliz</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Metodo di addestramento</h3><p>Una volta che l'architettura del modello e il dataset erano pronti, abbiamo addestrato il modello su <strong>8× GPU A100</strong> per tre epoche, il che ha richiesto circa <strong>9 ore di lavoro</strong>.</p>
<p><strong>Nota:</strong> l'addestramento ha riguardato solo la <strong>testa di potatura</strong>, responsabile dell'attività di evidenziazione semantica. Non abbiamo addestrato la <strong>testa Rerank</strong>, poiché concentrandoci solo sull'obiettivo di potatura abbiamo ottenuto risultati migliori per il punteggio di rilevanza a livello di frase.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Caso di studio nel mondo reale<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>I benchmark raccontano solo una parte della storia, quindi ecco un esempio reale che mostra come il modello si comporta in un caso limite comune: quando il testo recuperato contiene sia la risposta corretta sia un distrattore molto allettante.</p>
<p><strong>Query:</strong> <em>Chi ha scritto "L'uccisione del cervo sacro"?</em></p>
<p><strong>Contesto (5 frasi):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Risposta corretta: Frase 1 (afferma esplicitamente "sceneggiatura di Lanthimos e Efthymis Filippou")</p>
<p>Questo esempio presenta una trappola: la frase 3 menziona che "Euripide" ha scritto l'opera originale. Ma la domanda chiede "chi ha scritto il film L'uccisione del cervo sacro", e la risposta dovrebbe essere gli sceneggiatori del film, non il drammaturgo greco di migliaia di anni fa.</p>
<h3 id="Model-results" class="common-anchor-header">Risultati del modello</h3><table>
<thead>
<tr><th>Modello</th><th>Trova la risposta corretta?</th><th>Previsione</th></tr>
</thead>
<tbody>
<tr><td>Il nostro modello</td><td>✓</td><td>Frasi selezionate 1 (corretta) e 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Ha selezionato solo la frase 3, non ha trovato la risposta corretta</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Ha selezionato solo la frase 3, non ha risposto correttamente</td></tr>
</tbody>
</table>
<p><strong>Confronto del punteggio delle frasi chiave:</strong></p>
<table>
<thead>
<tr><th>Frase</th><th>Il nostro modello</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Frase 1 (sceneggiatura cinematografica, risposta corretta)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Frase 3 (opera teatrale originale, distrattore)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>Modelli XProvence:</p>
<ul>
<li><p>Fortemente attratti da "Euripide" e "opera", assegnano alla frase 3 punteggi quasi perfetti (0,947 e 0,802).</p></li>
<li><p>Ignora completamente la risposta effettiva (frase 1), assegnando punteggi estremamente bassi (0,133 e 0,081).</p></li>
<li><p>Anche abbassando la soglia da 0,5 a 0,2, non riesce a trovare la risposta corretta.</p></li>
</ul>
<p>Il nostro modello:</p>
<ul>
<li><p>Attribuisce correttamente alla frase 1 il punteggio più alto (0,915).</p></li>
<li><p>Assegna ancora una certa rilevanza alla frase 3 (0,719), perché è legata allo sfondo.</p></li>
<li><p>Separa chiaramente le due frasi con un margine di ~0,2</p></li>
</ul>
<p>Questo esempio mostra il punto di forza del modello: la comprensione dell'<strong>intento della query</strong> piuttosto che la semplice corrispondenza con le parole chiave di superficie. In questo contesto, "Chi ha scritto <em>L'uccisione del cervo sacro</em>" si riferisce al film, non all'antica opera teatrale greca. Il nostro modello lo coglie, mentre altri si lasciano distrarre da forti indicazioni lessicali.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Provatelo e diteci cosa ne pensate<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Il nostro modello <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> è ora completamente open-sourced sotto licenza MIT e pronto per l'uso in produzione. Potete inserirlo nella vostra pipeline RAG, perfezionarlo per il vostro dominio o costruire nuovi strumenti su di esso. Accogliamo con piacere anche i contributi e i feedback della comunità.</p>
<ul>
<li><p><strong>Scarica da HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>Tutti i dati di addestramento annotati:</strong> <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Evidenziazione semantica disponibile in Milvus e Zilliz Cloud</h3><p>L'evidenziazione semantica è integrata direttamente in <a href="https://milvus.io/">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (il Milvus completamente gestito), offrendo agli utenti una visione chiara del <em>motivo per cui</em> ogni documento è stato recuperato. Invece di scansionare interi pezzi, si vedono immediatamente le frasi specifiche che si riferiscono alla query, anche quando il testo non corrisponde esattamente. Questo rende il recupero più facile da capire e molto più veloce da debuggare. Per le pipeline RAG, chiarisce anche su cosa ci si aspetta che si concentri l'LLM a valle, aiutando così la progettazione immediata e i controlli di qualità.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Provate gratuitamente l'Evidenziazione Semantica in uno Zilliz Cloud completamente gestito</strong></a></p>
<p>Ci piacerebbe sapere come funziona per voi: segnalazioni di bug, idee di miglioramento o qualsiasi altra cosa scopriate durante l'integrazione nel vostro flusso di lavoro.</p>
<p>Se volete parlare di qualcosa di più dettagliato, non esitate a unirvi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> o a prenotare una sessione di 20 minuti di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>. Siamo sempre felici di chiacchierare con altri costruttori e di scambiarci appunti.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Riconoscimenti<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo lavoro si basa su molte grandi idee e contributi open-source, e vogliamo sottolineare i progetti che hanno reso possibile questo modello.</p>
<ul>
<li><p><strong>Provence</strong> ha introdotto un'inquadratura pulita e pratica per la potatura del contesto utilizzando modelli di codificatori leggeri.</p></li>
<li><p><strong>Open Provence</strong> ha fornito una base di codice solida e ben progettata - pipeline di addestramento, elaborazione dei dati e teste del modello - sotto una licenza permissiva. Ci ha fornito un solido punto di partenza per la sperimentazione.</p></li>
</ul>
<p>Su queste basi, abbiamo aggiunto diversi contributi personali:</p>
<ul>
<li><p>Utilizzo del <strong>ragionamento LLM</strong> per generare etichette di rilevanza di qualità superiore.</p></li>
<li><p>Creazione di <strong>quasi 5 milioni di</strong> campioni di addestramento bilingue allineati ai carichi di lavoro reali di RAG.</p></li>
<li><p>Scelta di un modello di base più adatto alla valutazione della rilevanza in contesti lunghi<strong>(BGE-M3 Reranker v2</strong>).</p></li>
<li><p>Addestramento del solo <strong>Pruning Head</strong> per specializzare il modello per l'evidenziazione semantica.</p></li>
</ul>
<p>Siamo grati ai team Provence e Open Provence per aver pubblicato apertamente il loro lavoro. I loro contributi hanno accelerato in modo significativo il nostro sviluppo e reso possibile questo progetto.</p>

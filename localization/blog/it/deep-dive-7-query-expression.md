---
id: deep-dive-7-query-expression.md
title: In che modo il database comprende ed esegue la query?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Una query vettoriale è il processo di recupero di vettori tramite un filtro
  scalare.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Una <a href="https://milvus.io/docs/v2.0.x/query.md">query vettoriale</a> in Milvus è il processo di recupero di vettori tramite un filtro scalare basato su un'espressione booleana. Con il filtraggio scalare, gli utenti possono limitare i risultati delle loro interrogazioni con determinate condizioni applicate agli attributi dei dati. Ad esempio, se un utente interroga i film usciti nel periodo 1990-2010 e con un punteggio superiore a 8,5, solo i film i cui attributi (anno di uscita e punteggio) soddisfano la condizione.</p>
<p>Questo post si propone di esaminare come viene completata una query in Milvus, dall'inserimento di un'espressione di query alla generazione del piano di query e all'esecuzione della stessa.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#Query-expression">Espressione di query</a></li>
<li><a href="#Plan-AST-generation">Generazione del piano AST</a></li>
<li><a href="#Query-execution">Esecuzione della query</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Espressione della query<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>L'espressione di una query con filtraggio degli attributi in Milvus adotta la sintassi EBNF (Extended Backus-Naur form). L'immagine seguente mostra le regole di espressione in Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Sintassi dell'espressione</span> </span></p>
<p>Le espressioni logiche possono essere create utilizzando la combinazione di operatori logici binari, operatori logici unari, espressioni logiche e singole espressioni. Poiché la sintassi EBNF è di per sé ricorsiva, un'espressione logica può essere il risultato della combinazione o parte di un'espressione logica più grande. Un'espressione logica può contenere molte sottoespressioni logiche. La stessa regola si applica a Milvus. Se un utente ha bisogno di filtrare gli attributi dei risultati con molte condizioni, può creare il proprio insieme di condizioni di filtraggio combinando diversi operatori logici ed espressioni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Espressione booleana</span> </span></p>
<p>L'immagine qui sopra mostra una parte delle <a href="https://milvus.io/docs/v2.0.x/boolean.md">regole delle espressioni booleane</a> in Milvus. Gli operatori logici unari possono essere aggiunti a un'espressione. Attualmente Milvus supporta solo l'operatore logico unario &quot;not&quot;, che indica che il sistema deve prendere i vettori i cui valori del campo scalare non soddisfano i risultati del calcolo. Gli operatori logici binari includono &quot;and&quot; e &quot;or&quot;. Le espressioni singole includono le espressioni di termine e le espressioni di confronto.</p>
<p>In Milvus sono supportati anche i calcoli aritmetici di base, come addizione, sottrazione, moltiplicazione e divisione, durante un'interrogazione. L'immagine seguente mostra la precedenza delle operazioni. Gli operatori sono elencati dall'alto verso il basso in ordine decrescente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Precedenza</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Come viene elaborata in Milvus un'espressione di interrogazione su determinati film?</h3><p>Supponiamo che in Milvus ci sia un'abbondanza di dati di film e che l'utente voglia interrogare alcuni film. Ad esempio, ogni film memorizzato in Milvus ha i seguenti cinque campi: ID film, anno di uscita, tipo di film, colonna sonora e poster. In questo esempio, il tipo di dati dell'ID del film e dell'anno di uscita è int64, mentre i punteggi dei film sono dati in virgola mobile. Inoltre, le locandine dei film sono memorizzate nel formato di vettori a virgola mobile e il tipo di film nel formato di dati stringa. In particolare, il supporto per i dati di tipo stringa è una novità di Milvus 2.1.</p>
<p>Per esempio, se un utente vuole interrogare i film con un punteggio superiore a 8,5. I film devono essere usciti da un decennio prima del 2000 a un decennio dopo il 2000 o devono essere di tipo commedia o film d'azione, l'utente deve inserire la seguente espressione di predicato: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Una volta ricevuta l'espressione della query, il sistema la eseguirà con la seguente precedenza:</p>
<ol>
<li>Ricerca di film con punteggio superiore a 8,5. I risultati della query sono chiamati &quot;risultato1&quot;.</li>
<li>Calcolare 2000 - 10 per ottenere "risultato2" (1990).</li>
<li>Calcolare 2000 + 10 per ottenere "risultato3" (2010).</li>
<li>Cercare i film con il valore di <code translate="no">release_year</code> maggiore di &quot;risultato2&quot; e minore di &quot;risultato3&quot;. In altre parole, il sistema deve cercare i film usciti tra il 1990 e il 2010. I risultati dell'interrogazione sono chiamati &quot;risultato4&quot;.</li>
<li>Interrogare i film che sono commedie o film d'azione. I risultati della query sono chiamati &quot;risultato5&quot;.</li>
<li>Combinare "risultato4" e "risultato5" per ottenere film che sono usciti tra il 1990 e il 2010 o che appartengono alla categoria delle commedie o dei film d'azione. I risultati sono chiamati &quot;risultato6&quot;.</li>
<li>Prendete la parte comune di "risultato1" e "risultato6" per ottenere i risultati finali che soddisfano tutte le condizioni.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Esempio di film</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Generazione di piani AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus utilizza lo strumento open-source <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) per la generazione di piani AST (abstract syntax tree). ANTLR è un potente generatore di parser per la lettura, l'elaborazione, l'esecuzione o la traduzione di file di testo o binari. Più specificamente, ANTLR può generare un parser per costruire e percorrere alberi di parsing basati su regole o sintassi predefinite. L'immagine seguente è un esempio in cui l'espressione di input è &quot;SP=100;&quot;. LEXER, la funzionalità di riconoscimento linguistico integrata in ANTLR, genera quattro token per l'espressione di input: &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; e &quot;;&quot;. Quindi lo strumento analizza ulteriormente i quattro token per generare l'albero di parsè corrispondente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>albero di parsè</span> </span></p>
<p>Il meccanismo del walker è una parte fondamentale dello strumento ANTLR. È progettato per percorrere tutti gli alberi di parsing per esaminare se ogni nodo rispetta le regole sintattiche o per rilevare alcune parole sensibili. Alcune delle API rilevanti sono elencate nell'immagine seguente. Poiché ANTLR parte dal nodo radice e scende attraverso ogni sotto-nodo fino in fondo, non è necessario differenziare l'ordine di percorrenza dell'albero di parses.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>camminatore dell'albero di parsè</span> </span></p>
<p>Milvus genera il PlanAST per le query in modo simile ad ANTLR. Tuttavia, l'uso di ANTLR richiede la ridefinizione di regole sintattiche piuttosto complicate. Pertanto, Milvus adotta una delle regole più diffuse, quella delle espressioni booleane, e dipende dal pacchetto <a href="https://github.com/antonmedv/expr">Expr</a>, disponibile su GitHub, per interrogare e analizzare la sintassi delle espressioni di query.</p>
<p>Durante una query con filtraggio degli attributi, Milvus genera un albero del piano primitivo irrisolto usando ant-parser, il metodo di parsing fornito da Expr, quando riceve l'espressione della query. Il piano primitivo ottenuto è un semplice albero binario. L'albero del piano viene poi perfezionato da Expr e dall'ottimizzatore integrato in Milvus. L'ottimizzatore di Milvus è molto simile al meccanismo del walker già citato. Poiché la funzionalità di ottimizzazione dell'albero del piano fornita da Expr è piuttosto sofisticata, l'onere dell'ottimizzatore integrato in Milvus viene alleggerito in larga misura. Infine, l'analizzatore analizza l'albero del piano ottimizzato in modo ricorsivo per generare un AST del piano nella struttura dei <a href="https://developers.google.com/protocol-buffers">buffer di protocollo</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Flusso di lavoro del piano AST</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Esecuzione della query<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>L'esecuzione di una query è in fondo l'esecuzione del piano AST generato nelle fasi precedenti.</p>
<p>In Milvus, un piano AST è definito in una struttura proto. L'immagine sottostante rappresenta un messaggio con la struttura protobuf. Esistono sei tipi di espressioni, tra cui l'espressione binaria e l'espressione unaria, che possono avere anche l'espressione logica binaria e l'espressione logica unaria.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>L'immagine seguente è un'immagine UML dell'espressione di query. Mostra la classe base e la classe derivata di ogni espressione. Ogni classe è dotata di un metodo per accettare i parametri del visitatore. Questo è un tipico modello di progettazione del visitatore. Milvus utilizza questo pattern per eseguire il piano AST, in quanto il suo principale vantaggio è che gli utenti non devono fare nulla alle espressioni primitive, ma possono accedere direttamente a uno dei metodi del pattern per modificare la classe dell'espressione di query e i relativi elementi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>Quando si esegue un piano AST, Milvus riceve prima un nodo di piano di tipo proto. Poi ottiene un nodo di piano di tipo segcore tramite il parser interno C++ proto. Una volta ottenuti i due tipi di nodi di piano, Milvus accetta una serie di accessi alle classi e poi modifica ed esegue la struttura interna dei nodi di piano. Infine, Milvus cerca tra tutti i nodi del piano di esecuzione per ottenere i risultati filtrati. I risultati finali sono presentati nel formato di una bitmask. Una bitmask è un array di numeri di bit ("0" e "1"). I dati che soddisfano le condizioni del filtro sono contrassegnati da "1" nella bitmask, mentre quelli che non soddisfano i requisiti sono contrassegnati da "0" nella bitmask.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>eseguire il flusso di lavoro</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Informazioni sulla serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annuncio ufficiale della disponibilità generale</a> di Milvus 2.0, abbiamo organizzato questa serie di blog Milvus Deep Dive per fornire un'interpretazione approfondita dell'architettura e del codice sorgente di Milvus. Gli argomenti trattati in questa serie di blog includono:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Panoramica dell'architettura Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API e SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Elaborazione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Interrogazione in tempo reale</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motore di esecuzione scalare</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motore di esecuzione vettoriale</a></li>
</ul>

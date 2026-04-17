---
id: vector-graph-rag-without-graph-database.md
title: Abbiamo costruito Graph RAG senza il database grafico
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Vector Graph RAG open-source aggiunge il ragionamento multi-hop a RAG
  utilizzando solo Milvus. 87,8% Recall@5, 2 chiamate LLM per interrogazione,
  non è necessario un database di grafi.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>È effettivamente necessario un database di grafi per Graph RAG? No. Mettete entità, relazioni e passaggi in Milvus. Usate l'espansione del sottografo invece della traversata del grafo e un LLM rerank invece di loop di agenti a più giri. Questo è il</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a> <em>, ed è quello che abbiamo costruito. Questo approccio raggiunge l'87,8% di Recall@5 medio su tre benchmark di QA multi-hop e batte HippoRAG 2 su una singola istanza di Milvus.</em></p>
</blockquote>
<p>Le domande multi-hop sono il muro che la maggior parte delle pipeline RAG incontra alla fine. La risposta è presente nel corpus, ma si estende su più passaggi collegati da entità che la domanda non nomina mai. La soluzione comune è quella di aggiungere un database a grafo, il che significa gestire due sistemi invece di uno.</p>
<p>Noi stessi continuavamo a scontrarci con questo problema e non volevamo gestire due database solo per questo. Così abbiamo costruito e reso open-source <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>, una libreria Python che porta il ragionamento multi-hop in <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> usando solo <a href="https://milvus.io/docs">Milvus</a>, il database vettoriale open-source più diffuso. Fornisce la stessa capacità multi-hop con un solo database invece di due.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Perché le domande multi-hop rompono il RAG standard<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Le domande multi-hop rompono il RAG standard perché la risposta dipende da relazioni tra entità che la ricerca vettoriale non può vedere. L'entità ponte che collega la domanda alla risposta spesso non è presente nella domanda stessa.</p>
<p>Le domande semplici funzionano bene. Si possono spezzettare i documenti, incorporarli, recuperare le corrispondenze più strette e inviarle a un LLM. La domanda "Quali indici supporta Milvus?" si trova in un passaggio e la ricerca vettoriale la trova.</p>
<p>Le domande multi-hop non rientrano in questo schema. Prendiamo una domanda come <em>"A quali effetti collaterali devo prestare attenzione con i farmaci di prima linea per il diabete?"</em> in una base di conoscenza medica.</p>
<p>Rispondere a questa domanda richiede due fasi di ragionamento. Innanzitutto, il sistema deve sapere che la metformina è il farmaco di prima linea per il diabete. Solo allora può cercare gli effetti collaterali della metformina: monitoraggio della funzione renale, disturbi gastrointestinali, carenza di vitamina B12.</p>
<p>"Metformina" è l'entità ponte. Collega la domanda alla risposta, ma la domanda non la menziona mai.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>È qui che si ferma la <a href="https://zilliz.com/learn/vector-similarity-search">ricerca per somiglianza di Vector</a>. Recupera i passaggi che assomigliano alla domanda, le guide al trattamento del diabete e gli elenchi degli effetti collaterali dei farmaci, ma non riesce a seguire le relazioni tra le entità che collegano questi passaggi. Fatti come "la metformina è il farmaco di prima linea per il diabete" risiedono in queste relazioni, non nel testo di ogni singolo passaggio.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Perché i database a grafo e le RAG agenziali non sono la soluzione giusta<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>I metodi standard per risolvere la RAG multi-hop sono i database a grafo e i cicli iterativi di agenti. Entrambi funzionano. Entrambi costano più di quanto la maggior parte dei team voglia pagare per una singola funzione.</p>
<p>Per prima cosa, si prende la strada dei database a grafo. Si estraggono le triple dai documenti, le si memorizza in un database a grafo e si attraversano i bordi per trovare le connessioni multi-hop. Ciò significa gestire un secondo sistema accanto al <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a>, imparare Cypher o Gremlin e mantenere sincronizzati gli archivi a grafo e vettoriali.</p>
<p>I cicli iterativi di agenti sono l'altro approccio. L'LLM recupera un lotto, lo analizza, decide se ha un contesto sufficiente e, in caso contrario, lo recupera di nuovo. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) effettua 3-5 chiamate al LLM per ogni interrogazione. Il RAG agenziale può superare i 10 perché l'agente decide quando fermarsi. Il costo per interrogazione diventa imprevedibile e la latenza di P99 aumenta ogni volta che l'agente esegue giri extra.</p>
<p>Nessuna delle due soluzioni è adatta ai team che desiderano ragionare in multi-hop senza dover ricostruire il proprio stack. Abbiamo quindi provato qualcosa di diverso.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Che cos'è Vector Graph RAG, una struttura a grafo all'interno di un database vettoriale<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> è una libreria Python open-source che porta il ragionamento multi-hop in <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> usando solo <a href="https://milvus.io/docs">Milvus</a>. Memorizza la struttura del grafo come riferimenti ID in tre collezioni Milvus. L'attraversamento diventa una catena di ricerche di chiavi primarie in Milvus, invece di query Cypher contro un database di grafi. Un Milvus fa entrambi i lavori.</p>
<p>Funziona perché le relazioni in un grafo della conoscenza sono solo testo. La tripla <em>(metformina, il farmaco di prima linea per il diabete di tipo 2)</em> è un bordo diretto in un database a grafo. È anche una frase: "La metformina è il farmaco di prima linea per il diabete di tipo 2". È possibile incorporare questa frase come un vettore e memorizzarla in <a href="https://milvus.io/docs">Milvus</a>, come qualsiasi altro testo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Rispondere a una query multi-hop significa seguire le connessioni da ciò che la query menziona (come "diabete") a ciò che non menziona (come "metformina"). Questo funziona solo se l'archiviazione conserva tali connessioni: quale entità si collega a quale attraverso quale relazione. Il testo semplice è ricercabile, ma non seguibile.</p>
<p>Per mantenere le connessioni seguibili in Milvus, diamo a ogni entità e a ogni relazione un ID univoco, quindi le archiviamo in raccolte separate che si riferiscono l'una all'altra in base all'ID. Tre collezioni in totale: <strong>entità</strong> (i nodi), <strong>relazioni</strong> (gli spigoli) e <strong>passaggi</strong> (il testo di partenza, di cui il LLM ha bisogno per generare le risposte). Ogni riga ha un incorporamento vettoriale, in modo da poter effettuare ricerche semantiche in ognuna delle tre raccolte.</p>
<p><strong>Le entità</strong> memorizzano entità deduplicate. Ognuna di esse ha un ID univoco, un <a href="https://zilliz.com/glossary/vector-embeddings">incorporamento vettoriale</a> per la <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a> e un elenco di ID di relazioni a cui partecipa.</p>
<table>
<thead>
<tr><th>id</th><th>nome</th><th>incorporamento</th><th>ID_relazione</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformina</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>diabete di tipo 2</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>funzione renale</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p>Le<strong>relazioni</strong> memorizzano triple di conoscenza. Ciascuna registra gli ID delle entità soggetto e oggetto, gli ID dei passaggi da cui proviene e un embedding del testo completo della relazione.</p>
<table>
<thead>
<tr><th>id</th><th>soggetto_id</th><th>oggetto_id</th><th>testo</th><th>incorporazione</th><th>pass_ids</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>La metformina è il farmaco di prima linea per il diabete di tipo 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>I pazienti che assumono metformina dovrebbero essere sottoposti a monitoraggio della funzione renale</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>I passaggi</strong> memorizzano i pezzi di documento originali, con i riferimenti alle entità e alle relazioni estratte da essi.</p>
<p>Le tre collezioni puntano l'una all'altra attraverso campi ID: le entità portano gli ID delle loro relazioni, le relazioni portano gli ID delle loro entità soggetto e oggetto e dei passaggi di origine, e i passaggi portano gli ID di tutto ciò che è stato estratto da essi. Questa rete di riferimenti ID è il grafo.</p>
<p>L'attraversamento è solo una catena di ricerche di ID. Si recupera l'entità e01 per ottenere il suo <code translate="no">relation_ids</code>, si recuperano le relazioni r01 e r02 in base a quegli ID, si legge il <code translate="no">object_id</code> di r01 per scoprire l'entità e02 e si continua. Ogni salto è una <a href="https://milvus.io/docs/get-and-scalar-query.md">query a chiave primaria</a> standard di Milvus. Non è necessario Cypher.</p>
<p>Ci si potrebbe chiedere se i viaggi di andata e ritorno verso Milvus siano un'aggiunta. Non è così. L'espansione del sottografo costa 2-3 interrogazioni basate sull'ID per un totale di 20-30ms. La chiamata a LLM richiede 1-3 secondi, il che rende invisibili le ricerche di ID.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Come il RAG a grafo vettoriale risponde a un'interrogazione multi-hop<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Il flusso di recupero porta una query multi-hop a una risposta fondata in quattro fasi: <strong>recupero del seme → espansione del sottografo → rerank LLM → generazione della risposta.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esamineremo la domanda sul diabete: <em>"A quali effetti collaterali devo prestare attenzione con i farmaci di prima linea per il diabete?".</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Passo 1: Recupero dei semi</h3><p>Un LLM estrae le entità chiave dalla domanda: "diabete", "effetti collaterali", "farmaci di prima linea". La ricerca vettoriale in Milvus trova direttamente le entità e le relazioni più rilevanti.</p>
<p>Ma la metformina non è tra queste. La domanda non la menziona, quindi la ricerca vettoriale non la trova.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Fase 2: Espansione del sottografo</h3><p>È qui che Vector Graph RAG si discosta dalla RAG standard.</p>
<p>Il sistema segue i riferimenti ID delle entità seme a un salto di distanza. Ottiene gli ID delle entità seme, trova tutte le relazioni che contengono tali ID e inserisce i nuovi ID delle entità nel sottografo. Predefinito: un salto.</p>
<p><strong>Metformina, l'entità ponte, entra nel sottografo.</strong></p>
<p>"Diabete" ha una relazione: <em>"La metformina è il farmaco di prima linea per il diabete di tipo 2".</em> Seguendo questo bordo, la metformina entra nel sottografo. Una volta che la metformina è nel sottografo, le sue relazioni arrivano con essa: <em>"I pazienti che assumono metformina devono monitorare la funzionalità renale", "La metformina può causare disturbi gastrointestinali", "L'uso a lungo termine di metformina può portare a una carenza di vitamina B12".</em></p>
<p>Due fatti che vivevano in passaggi separati sono ora collegati attraverso un salto di espansione del grafico. L'entità ponte che la domanda non ha mai menzionato è ora scopribile.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Passo 3: LLM Rerank</h3><p>L'espansione lascia decine di relazioni candidate. La maggior parte è rumore.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>Il sistema invia questi candidati e la domanda originale a un LLM: "Quali sono gli effetti collaterali dei farmaci di prima linea per il diabete?". Si tratta di un'unica chiamata senza iterazione.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Le relazioni selezionate coprono l'intera catena: diabete → metformina → monitoraggio dei reni / disturbi gastrointestinali / carenza di B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Fase 4: Generazione delle risposte</h3><p>Il sistema recupera i passaggi originali per le relazioni selezionate e li invia al LLM.</p>
<p>Il LLM genera il testo completo del passaggio, non le triple tagliate. Le triple sono riassunti compressi. Mancano il contesto, le avvertenze e le specifiche di cui il LLM ha bisogno per produrre una risposta fondata.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Vedere il grafico vettoriale RAG in azione</h3><p>Abbiamo anche creato un frontend interattivo che visualizza ogni fase. Cliccando sul pannello dei passi a sinistra, il grafico si aggiorna in tempo reale: arancione per i nodi seme, blu per i nodi espansi, verde per le relazioni selezionate. In questo modo il flusso di reperimento diventa concreto anziché astratto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Perché un solo rerank è meglio di più iterazioni<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>La nostra pipeline effettua due chiamate LLM per ogni query: una per il rerank e una per la generazione. I sistemi iterativi come IRCoT e Agentic RAG eseguono da 3 a 10 chiamate perché eseguono un ciclo: recuperare, ragionare, recuperare di nuovo. Noi saltiamo il ciclo perché la ricerca vettoriale e l'espansione del sottografo coprono sia la somiglianza semantica sia le connessioni strutturali in un solo passaggio, dando all'LLM un numero sufficiente di candidati da terminare in una sola rielaborazione.</p>
<table>
<thead>
<tr><th>Approccio</th><th>Chiamate all'LLM per interrogazione</th><th>Profilo di latenza</th><th>Costo relativo dell'API</th></tr>
</thead>
<tbody>
<tr><td>Grafico vettoriale RAG</td><td>2 (rerank + generate)</td><td>Fisso, prevedibile</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variabile</td><td>~2-3x</td></tr>
<tr><td>RAG agenziale</td><td>5-10+</td><td>Imprevedibile</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>In produzione, ciò significa un costo API inferiore del 60% circa, risposte 2-3 volte più veloci e latenza prevedibile. Non ci sono picchi a sorpresa quando un agente decide di eseguire giri extra.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Risultati dei benchmark<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG ha una media dell'87,8% di Recall@5 su tre benchmark standard di QA multi-hop, eguagliando o superando ogni metodo che abbiamo testato, incluso HippoRAG 2, con solo Milvus e 2 chiamate LLM.</p>
<p>Abbiamo valutato MuSiQue (2-4 hop, il più difficile), HotpotQA (2 hop, il più usato) e 2WikiMultiHopQA (2 hop, ragionamento cross-document). La metrica è Recall@5: se i passaggi di supporto corretti appaiono nei primi 5 risultati recuperati.</p>
<p>Per un confronto equo, abbiamo utilizzato le stesse triple pre-estratte dal <a href="https://github.com/OSU-NLP-Group/HippoRAG">repository HippoRAG</a>. Nessuna ri-estrazione, nessuna pre-elaborazione personalizzata. Il confronto isola l'algoritmo di reperimento stesso.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Grafico vettoriale RAG</a> vs RAG standard (ingenuo)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG aumenta il Recall@5 medio dal 73,4% all'87,8%, con un miglioramento di 19,6 punti percentuali.</p>
<ul>
<li>MuSiQue: guadagno maggiore (+31,4 punti percentuali). 3-4 hop benchmark, le domande multi-hop più difficili e dove l'espansione del sottografo ha il maggiore impatto.</li>
<li>2WikiMultiHopQA: netto miglioramento (+27,7 punti percentuali). Ragionamento trasversale ai documenti, un altro punto di forza dell'espansione del sottografo.</li>
<li>HotpotQA: guadagno minore (+6,1 pp), ma il RAG standard ottiene già il 90,8% su questo set di dati. Il limite massimo è basso.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> vs. metodi allo stato dell'arte (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG ottiene il punteggio medio più alto con l'87,8% rispetto a HippoRAG 2, IRCoT e NV-Embed-v2.</p>
<p>Benchmark per benchmark:</p>
<ul>
<li>HotpotQA: pareggia con HippoRAG 2 (entrambi al 96,3%).</li>
<li>2WikiMultiHopQA: in vantaggio di 3,7 punti (94,1% vs 90,4%).</li>
<li>MuSiQue (il più difficile): è in svantaggio di 1,7 punti (73,0% vs 74,7%).</li>
</ul>
<p>Vector Graph RAG raggiunge questi risultati con solo 2 chiamate LLM per query, senza database di grafi e senza ColBERTv2. Viene eseguito sull'infrastruttura più semplice del confronto e ottiene comunque la media più alta.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Il confronto tra <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> e altri approcci Graph RAG<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>I diversi approcci Graph RAG sono ottimizzati per problemi diversi. Vector Graph RAG è costruito per la produzione di QA multi-hop con costi prevedibili e infrastrutture semplici.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infrastruttura</strong></td><td>DB grafico + DB vettoriale</td><td>ColBERTv2 + grafo in-memory</td><td>DB vettoriale + agenti multi-round</td><td><strong>Solo Milvus</strong></td></tr>
<tr><td><strong>Chiamate LLM per interrogazione</strong></td><td>Variabile</td><td>Moderato</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Migliore per</strong></td><td>Riassunto globale di un corpus</td><td>Reperimento accademico a grana fine</td><td>Esplorazione complessa e aperta</td><td><strong>QA multi-hop di produzione</strong></td></tr>
<tr><td><strong>Problemi di scalabilità</strong></td><td>Indicizzazione LLM costosa</td><td>Grafo completo in memoria</td><td>Latenza e costi imprevedibili</td><td><strong>Scala con Milvus</strong></td></tr>
<tr><td><strong>Complessità di configurazione</strong></td><td>Alta</td><td>Medio-alto</td><td>medio-alto</td><td><strong>Bassa (installazione con pip)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> utilizza il clustering gerarchico delle comunità per rispondere a domande di riassunto globale come "quali sono i temi principali di questo corpus? Si tratta di un problema diverso rispetto al QA multi-hop&quot;.</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) utilizza un recupero di ispirazione cognitiva con una corrispondenza a livello di token ColBERTv2. Il caricamento dell'intero grafo in memoria limita la scalabilità.</p>
<p>Gli approcci iterativi come <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> scambiano la semplicità dell'infrastruttura con il costo dell'LLM e la latenza imprevedibile.</p>
<p>Vector Graph RAG si rivolge a QA multi-hop di produzione: team che vogliono costi e latenze prevedibili senza aggiungere un database di grafi.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Quando usare Vector Graph RAG e casi d'uso chiave<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG è costruito per quattro tipi di carichi di lavoro:</p>
<table>
<thead>
<tr><th>Scenario</th><th>Perché è adatto</th></tr>
</thead>
<tbody>
<tr><td><strong>Documenti ricchi di conoscenza</strong></td><td>Codici legali con riferimenti incrociati, letteratura biomedica con catene farmaco-gene-malattia, documenti finanziari con collegamenti azienda-persona-evento, documenti tecnici con grafici di dipendenza API</td></tr>
<tr><td><strong>Domande a 2-4 salti</strong></td><td>Le domande a un solo hop funzionano bene con la RAG standard. Cinque o più hop possono richiedere metodi iterativi. L'intervallo di 2-4 hop è il punto di forza dell'espansione dei sottografi.</td></tr>
<tr><td><strong>Distribuzione semplice</strong></td><td>Un solo database, un solo <code translate="no">pip install</code>, nessuna infrastruttura di grafi da apprendere.</td></tr>
<tr><td><strong>Sensibilità ai costi e alla latenza</strong></td><td>Due chiamate LLM per ogni interrogazione, fisse e prevedibili. Con migliaia di interrogazioni giornaliere, la differenza si fa sentire.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Iniziare con il grafico vettoriale RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> senza argomenti, si imposta su <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Crea un file locale <code translate="no">.db</code>, come SQLite. Nessun server da avviare, niente da configurare.</p>
<p><code translate="no">add_texts()</code> chiama un LLM per estrarre le triple dal testo, le vettorializza e memorizza tutto in Milvus. <code translate="no">query()</code> esegue l'intero flusso di recupero in quattro fasi: seed, expand, rerank, generate.</p>
<p>Per la produzione, cambiare un parametro URI. Il resto del codice rimane invariato:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Importare PDF, pagine web o file Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG non ha bisogno di un database di grafi. Vector Graph RAG memorizza la struttura del grafo come riferimenti ID in tre collezioni Milvus, il che trasforma l'attraversamento del grafo in ricerche di chiavi primarie e mantiene ogni query multi-hop a due chiamate LLM fisse.</p>
<p>In sintesi:</p>
<ul>
<li>Libreria Python open-source. Ragionamento multi-hop solo su Milvus.</li>
<li>Tre collezioni collegate da ID. Entità (nodi), relazioni (spigoli), passaggi (testo sorgente). L'espansione del sottografo segue gli ID per scoprire entità ponte che la query non menziona.</li>
<li>Due chiamate LLM per ogni query. Un rerank, una generazione. Nessuna iterazione.</li>
<li>87,8% di richiamo medio@5 tra MuSiQue, HotpotQA e 2WikiMultiHopQA, eguagliando o battendo HippoRAG 2 in due casi su tre.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Provatelo:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> per il codice</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Documenti</a> per l'API completa e gli esempi</li>
<li>Unisciti alla <a href="https://discord.com/invite/8uyFbECzPX">comunità</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">su Discord</a> per porre domande e condividere feedback</li>
<li><a href="https://milvus.io/office-hours">Prenota una sessione di Milvus Office Hours</a> per illustrare il tuo caso d'uso.</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> offre un livello gratuito con Milvus gestito, se si preferisce evitare la configurazione dell'infrastruttura.</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">DOMANDE FREQUENTI<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Posso utilizzare Graph RAG solo con un database vettoriale?</h3><p>Sì. Vector Graph RAG memorizza la struttura del grafo della conoscenza (entità, relazioni e loro connessioni) all'interno di tre collezioni Milvus collegate da riferimenti incrociati di ID. Invece di attraversare i bordi in un database a grafo, concatena le ricerche di chiavi primarie in Milvus per espandere un sottografo intorno alle entità seme. In questo modo si ottiene una media dell'87,8% di Recall@5 su tre benchmark standard multi-hop senza alcuna infrastruttura di database a grafo.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Come si colloca Vector Graph RAG rispetto a Microsoft GraphRAG?</h3><p>Risolvono problemi diversi. Microsoft GraphRAG utilizza il clustering gerarchico delle comunità per la sintesi globale del corpus ("Quali sono i temi principali di questi documenti?"). Vector Graph RAG si concentra sulla risposta a domande multi-hop, dove l'obiettivo è concatenare fatti specifici attraverso i passaggi. Vector Graph RAG necessita solo di Milvus e di due chiamate LLM per ogni interrogazione. Microsoft GraphRAG richiede un database di grafi e comporta costi di indicizzazione più elevati.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Quali tipi di domande beneficiano del RAG multi-hop?</h3><p>Multi-hop RAG è utile per le domande in cui la risposta dipende dal collegamento di informazioni sparse in più passaggi, soprattutto quando un'entità chiave non compare mai nella domanda. Ad esempio, "Quali effetti collaterali ha il farmaco di prima linea per il diabete?". (richiede la scoperta della metformina come ponte), ricerche di riferimenti incrociati in testi legali o normativi e tracciamento della catena di dipendenze nella documentazione tecnica. Il RAG standard gestisce bene le ricerche di singoli fatti. Il RAG multi-hop aggiunge valore quando il percorso di ragionamento è lungo da due a quattro passi.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">È necessario estrarre manualmente le triple del grafo della conoscenza?</h3><p>No. <code translate="no">add_texts()</code> e <code translate="no">add_documents()</code> chiamano automaticamente un LLM per estrarre entità e relazioni, vettorializzarle e memorizzarle in Milvus. È possibile importare documenti da URL, PDF e file DOCX utilizzando il programma integrato <code translate="no">DocumentImporter</code>. Per il benchmarking o la migrazione, la libreria supporta l'importazione di triple pre-estratte da altri framework come HippoRAG.</p>

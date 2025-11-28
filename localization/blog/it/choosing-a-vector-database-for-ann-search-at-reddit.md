---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Scelta di un database vettoriale per la ricerca di RNA su Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  Questo post descrive il processo utilizzato dal team di Reddit per selezionare
  il database vettoriale più adatto e il motivo per cui ha scelto Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Questo post è stato scritto da Chris Fournie, Staff Software Engineer di Reddit, ed è stato pubblicato originariamente su</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>; viene ripubblicato qui con l'autorizzazione.</p>
<p>Nel 2024, i team di Reddit hanno utilizzato una serie di soluzioni per eseguire la ricerca vettoriale approssimata del vicino (ANN). Da <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI Vector Search</a> di Google e sperimentando l'uso <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">della ricerca vettoriale ANN di Apache Solr</a> per alcuni insiemi di dati più grandi, alla <a href="https://github.com/facebookresearch/faiss">libreria FAISS</a> di Facebook per insiemi di dati più piccoli (ospitati in side-car in scala verticale). Un numero sempre maggiore di team di Reddit desiderava una soluzione di ricerca vettoriale ANN ampiamente supportata, che fosse economicamente vantaggiosa, dotata delle funzionalità di ricerca desiderate e in grado di scalare i dati alle dimensioni di Reddit. Per rispondere a questa esigenza, nel 2025 abbiamo cercato il database vettoriale ideale per i team di Reddit.</p>
<p>Questo post descrive il processo utilizzato per selezionare il miglior database vettoriale per le esigenze di Reddit oggi. Non descrive il miglior database vettoriale in assoluto, né l'insieme più essenziale di requisiti funzionali e non funzionali per tutte le situazioni. Descrive ciò che Reddit e la sua cultura ingegneristica hanno valutato e dato priorità nella scelta di un database vettoriale. Questo post può servire da ispirazione per la vostra raccolta e valutazione dei requisiti, ma ogni organizzazione ha la propria cultura, i propri valori e le proprie esigenze.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Processo di valutazione<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>In generale, le fasi di selezione sono state:</p>
<p>1. Raccogliere il contesto dai team</p>
<p>2. Valutazione qualitativa delle soluzioni</p>
<p>3. Valutare quantitativamente i migliori contendenti</p>
<p>4. Selezione finale</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Raccolta del contesto dai team</h3><p>Sono stati raccolti tre elementi di contesto dai team interessati a eseguire la ricerca vettoriale di RNA:</p>
<ul>
<li><p>Requisiti funzionali (ad esempio, ricerca vettoriale e lessicale ibrida? Query di ricerca a range? Filtraggio per attributi non vettoriali?)</p></li>
<li><p>Requisiti non funzionali (ad esempio, può supportare 1B vettori? Può raggiungere una latenza &lt;100ms P99?)</p></li>
<li><p>I database vettoriali erano già interessati ai gruppi di lavoro.</p></li>
</ul>
<p>Intervistare i team per conoscere i requisiti non è banale. Molti descriveranno le loro esigenze in termini di come stanno attualmente risolvendo un problema, e la vostra sfida consiste nel capire e rimuovere questo pregiudizio.</p>
<p>Ad esempio, un team utilizzava già FAISS per la ricerca vettoriale di RNA e ha dichiarato che la nuova soluzione doveva restituire in modo efficiente 10.000 risultati per ogni chiamata di ricerca. Dopo un'ulteriore discussione, il motivo dei 10.000 risultati era che avevano bisogno di eseguire un filtraggio post-hoc, e FAISS non offre il filtraggio dei risultati ANN al momento della query. Il loro problema reale era che avevano bisogno di filtrare, quindi qualsiasi soluzione che offrisse un filtraggio efficiente sarebbe stata sufficiente, e la restituzione di 10.000 risultati era semplicemente un workaround necessario per migliorare il richiamo. Idealmente, vorrebbero pre-filtrare l'intera collezione prima di trovare i vicini.</p>
<p>Anche la richiesta dei database vettoriali che i team stavano già utilizzando o a cui erano interessati è stata preziosa. Se almeno un team ha espresso un parere positivo sulla propria soluzione attuale, è segno che il database vettoriale potrebbe essere una soluzione utile da condividere in tutta l'azienda. Se i team avevano solo opinioni negative su una soluzione, allora non dovevamo includerla come opzione. Accettare le soluzioni a cui i team erano interessati è stato anche un modo per assicurarsi che i team si sentissero inclusi nel processo e ci ha aiutato a formare un elenco iniziale di contendenti principali da valutare; ci sono troppe soluzioni di ricerca vettoriale RNA nei database nuovi ed esistenti per testarle tutte in modo esaustivo.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Valutazione qualitativa delle soluzioni</h3><p>Partendo dall'elenco di soluzioni a cui i team erano interessati, per valutare qualitativamente quale soluzione di ricerca vettoriale ANN si adattava meglio alle nostre esigenze, abbiamo</p>
<ul>
<li><p>Abbiamo ricercato ogni soluzione e valutato il grado di soddisfazione di ogni requisito rispetto all'importanza ponderata del requisito stesso.</p></li>
<li><p>Abbiamo eliminato le soluzioni in base ai criteri qualitativi e alla discussione.</p></li>
<li><p>Abbiamo scelto le N soluzioni migliori da testare quantitativamente.</p></li>
</ul>
<p>Il nostro elenco iniziale di soluzioni per la ricerca vettoriale di RNA comprendeva:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Ricerca aperta</p></li>
<li><p>Pgvector (utilizza già Postgres come RDBMS)</p></li>
<li><p>Redis (già utilizzato come archivio e cache KV)</p></li>
<li><p>Cassandra (già utilizzato per la ricerca non-ANN)</p></li>
<li><p>Solr (già utilizzato per la ricerca lessicale e sperimentato con la ricerca vettoriale)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (già utilizzato per la ricerca vettoriale ANN)</p></li>
</ul>
<p>Abbiamo quindi preso tutti i requisiti funzionali e non funzionali menzionati dai team, più altri vincoli che rappresentano i nostri valori e obiettivi ingegneristici, li abbiamo inseriti in un foglio di calcolo e ne abbiamo valutato l'importanza (da 1 a 3, come mostra la tabella riassuntiva qui sotto).</p>
<p>Per ogni soluzione che stavamo confrontando, abbiamo valutato (su una scala da 0 a 3) quanto ciascun sistema soddisfacesse quel requisito (come mostrato nella tabella seguente). L'attribuzione dei punteggi in questo modo era in qualche modo soggettiva, per cui abbiamo scelto un sistema e abbiamo fornito esempi di punteggi con motivazioni scritte, chiedendo ai revisori di fare riferimento a tali esempi. Abbiamo inoltre fornito le seguenti indicazioni per l'assegnazione di ciascun punteggio: assegnare questo valore se:</p>
<ul>
<li><p>0: Nessun supporto/prova di supporto ai requisiti</p></li>
<li><p>1: Supporto di base o inadeguato del requisito</p></li>
<li><p>2: Requisito ragionevolmente supportato</p></li>
<li><p>3: Robusto supporto al requisito che va oltre le soluzioni comparabili.</p></li>
</ul>
<p>Abbiamo quindi creato un punteggio complessivo per ogni soluzione sommando il prodotto del punteggio del requisito di una soluzione e l'importanza di quel requisito (ad esempio, Qdrant ha ottenuto un punteggio di 3 per la combinazione di ri-ranking/score, che ha un'importanza di 2, quindi 3 x 2 = 6, ripetere l'operazione per tutte le righe e sommare il tutto). Alla fine si ottiene un punteggio complessivo che può essere usato come base per classificare e discutere le soluzioni e i requisiti più importanti (si noti che il punteggio non viene usato per prendere una decisione finale, ma come strumento di discussione).</p>
<p><strong><em>Nota dell'editore:</em></strong> <em>questa recensione era basata su Milvus 2.4. Da allora abbiamo lanciato Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em> e Milvus 3.0 è alle porte, quindi alcuni numeri potrebbero essere obsoleti. Tuttavia, il confronto offre sempre spunti importanti e rimane molto utile.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Categoria</strong></td><td><strong>Importanza</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Tipo di ricerca</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Ricerca ibrida</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ricerca per parola chiave</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Ricerca approssimativa NN</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ricerca di gamma</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Riarrangiamento/combinazione dei punteggi</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Metodo di indicizzazione</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Supporta più metodi di indicizzazione</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Quantizzazione</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Hashing sensibile ai luoghi (LSH)</td><td>1</td><td>0</td><td>0Nota: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 lo supporta. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Dati</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tipi di vettore diversi da float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Attributi di metadati su vettori (supporta attributi multipli, grandi dimensioni del record, ecc.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Opzioni di filtraggio dei metadati (può filtrare sui metadati, ha un filtro pre/post)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Tipi di dati degli attributi dei metadati (schema robusto, ad esempio bool, int, string, json, array)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Limiti degli attributi dei metadati (query di intervallo, ad esempio 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversità dei risultati per attributo (ad esempio, ottenere non più di N risultati da ogni subreddit in una risposta)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Scala</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Centinaia di milioni di indici vettoriali</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Indice del vettore miliardi</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Vettori di supporto almeno 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Vettori di supporto maggiori di 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latenza 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latenza &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99,9% di disponibilità recupero</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99,99% di disponibilità indicizzazione/stoccaggio</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operazioni di archiviazione</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Ospitabile in AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-Regione</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Aggiornamenti a tempo zero</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Multi-Cloud</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>API/Librerie</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>API RESTful</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Vai alla biblioteca</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Biblioteca Java</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Pitone</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Altri linguaggi (C++, Ruby, ecc.)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Operazioni di runtime</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Metriche di Prometheus</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Operazioni di base del DB</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upserts</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Operatore Kubernetes</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Paginazione dei risultati</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Incorporazione della ricerca per ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Restituzione delle incorporazioni con l'ID del candidato e i punteggi del candidato</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>ID fornito dall'utente</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Capacità di effettuare ricerche in un contesto batch su larga scala</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Backup / Istantanee: supporta la possibilità di creare backup dell'intero database.</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Supporto efficiente di indici di grandi dimensioni (distinzione tra archiviazione fredda e calda)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Supporto/Comunità</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Neutralità del fornitore</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Robusto supporto per le API</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Supporto del fornitore</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Velocità della comunità</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Base utenti di produzione</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Sensazione di comunità</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Stelle Github</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Configurazione</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Gestione dei segreti</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Fonte</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Fonte aperta</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Lingua</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Comunicati</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Test a monte</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Disponibilità di documentazione</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Costo</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Costo Efficace</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Prestazioni</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Supporto per la regolazione dell'utilizzo delle risorse per CPU, memoria e disco</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Sharding multi-nodo (pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Avere la capacità di sintonizzare il sistema per bilanciare la latenza e il throughput</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Partizione definita dall'utente (scritture)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-tenant</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Suddivisione</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replica</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Ridondanza</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Failover automatico</td><td>3</td><td>2</td><td>0 Nota: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 lo supporta. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Bilanciamento del carico</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Supporto GPU</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Punteggi complessivi della soluzione</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Abbiamo discusso i punteggi complessivi e dei requisiti dei vari sistemi e abbiamo cercato di capire se avevamo ponderato in modo appropriato l'importanza dei requisiti e se alcuni requisiti erano così importanti da dover essere considerati vincoli fondamentali. Uno di questi requisiti che abbiamo identificato è se la soluzione fosse open-source o meno, perché volevamo una soluzione in cui potessimo essere coinvolti, contribuire e risolvere rapidamente i piccoli problemi che si presentavano alla nostra scala. Contribuire e utilizzare software open-source è una parte importante della cultura ingegneristica di Reddit. Questo ha eliminato le soluzioni solo in hosting (Vertex AI, Pinecone) dalla nostra considerazione.</p>
<p>Durante le discussioni, ci siamo resi conto che alcuni altri requisiti chiave erano di importanza fondamentale per noi:</p>
<ul>
<li><p>Scala e affidabilità: volevamo vedere prove di altre aziende che utilizzavano la soluzione con oltre 100 milioni di vettori o addirittura 1B.</p></li>
<li><p>Comunità: Volevamo una soluzione con una comunità sana e molto dinamica in questo settore in rapida maturazione.</p></li>
<li><p>Tipi di metadati e filtri espressivi per consentire un maggior numero di casi d'uso (filtraggio per data, booleano, ecc.)</p></li>
<li><p>Supporto di più tipi di indici (non solo HNSW o DiskANN) per migliorare le prestazioni dei nostri numerosi casi d'uso.</p></li>
</ul>
<p>Il risultato delle nostre discussioni e l'affinamento dei requisiti chiave ci ha portato a scegliere di testare (in ordine) quantitativamente:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa e</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Purtroppo, decisioni come questa richiedono tempo e risorse, e nessuna organizzazione dispone di quantità illimitate di entrambi. Dato il nostro budget, abbiamo deciso di testare Qdrant e Milvus e di lasciare i test di Vespa e Weviate come stretch goal.</p>
<p>Qdrant vs Milvus è stato anche un interessante test di due architetture diverse:</p>
<ul>
<li><p><strong>Qdrant:</strong> Tipi di nodi omogenei che eseguono tutte le operazioni del database vettoriale di RNA.</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">tipi di nodi eterogenei</a> (Milvus; uno per le query, un altro per l'indicizzazione, un altro ancora per l'inserimento dei dati, un proxy, ecc.)</p></li>
</ul>
<p>Quale dei due è stato facile da configurare (un test della documentazione)? Quale dei due è stato facile da eseguire (un test delle caratteristiche di resilienza e della pulizia)? E quale funzionava meglio per i casi d'uso e la scala che ci interessavano? A queste domande abbiamo cercato di rispondere confrontando quantitativamente le soluzioni.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Valutazione quantitativa dei principali contendenti</h3><p>Volevamo capire meglio il grado di scalabilità di ciascuna soluzione e, nel processo, sperimentare come sarebbe stato impostare, configurare, mantenere ed eseguire ciascuna soluzione su scala. A tal fine, abbiamo raccolto tre set di dati di documenti e vettori di query per tre diversi casi d'uso, abbiamo configurato ciascuna soluzione con risorse simili all'interno di Kubernetes, abbiamo caricato i documenti in ciascuna soluzione e abbiamo inviato carichi di query identici utilizzando <a href="https://k6.io/">K6 di Grafana</a> con un esecutore a rampa di velocità di arrivo per riscaldare i sistemi prima di raggiungere un throughput target (ad esempio, 100 QPS).</p>
<p>Abbiamo testato il throughput, il punto di rottura di ogni soluzione, la relazione tra throughput e latenza e la reazione alla perdita di nodi sotto carico (tasso di errore, impatto sulla latenza, ecc.). Di fondamentale interesse è stato l'<strong>effetto del filtraggio sulla latenza</strong>. Abbiamo anche effettuato semplici test sì/no per verificare che una funzionalità presente nella documentazione funzionasse come descritto (ad esempio, upserts, delete, get by ID, amministrazione utente, ecc.) e per sperimentare l'ergonomia di tali API.</p>
<p><strong>I test sono stati effettuati su Milvus v2.4 e Qdrant v1.12.</strong> A causa dei vincoli di tempo, non abbiamo messo a punto o testato in modo esaustivo tutti i tipi di impostazioni dell'indice; sono state utilizzate impostazioni simili per ogni soluzione, con una preferenza per un elevato richiamo di RNA, e i test si sono concentrati sulle prestazioni degli indici HNSW. Anche le risorse di CPU e memoria sono state assegnate a ciascuna soluzione.</p>
<p>Nella nostra sperimentazione, abbiamo riscontrato alcune differenze interessanti tra le due soluzioni. Nei seguenti esperimenti, ogni soluzione aveva circa 340M vettori post Reddit di 384 dimensioni ciascuno, per HNSW, M=16 e efConstruction=100.</p>
<p>In un esperimento, abbiamo riscontrato che, a parità di throughput della query (100 QPS senza ingestione allo stesso tempo), l'aggiunta del filtraggio influiva maggiormente sulla latenza di Milvus rispetto a Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenza delle query con il filtraggio</p>
<p>In un altro caso, abbiamo riscontrato un'interazione molto maggiore tra ingestione e carico delle query su Qdrant rispetto a Milvus (mostrato sotto a throughput costante). Ciò è probabilmente dovuto alla loro architettura; Milvus divide gran parte della sua ingestione su tipi di nodi separati da quelli che servono il traffico di query, mentre Qdrant serve sia il traffico di ingestione che quello di query dagli stessi nodi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenza delle interrogazioni a 100 QPS durante l'ingest</p>
<p>Quando abbiamo testato la diversità dei risultati per attributo (ad esempio, ottenendo non più di N risultati da ogni subreddit in una risposta), abbiamo scoperto che a parità di throughput, Milvus aveva una latenza peggiore di Qdrant (a 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latenza post query con diversità dei risultati</p>
<p>Abbiamo anche voluto verificare l'efficacia di ciascuna soluzione quando sono state aggiunte più repliche di dati (cioè il fattore di replica, RF, è stato aumentato da 1 a 2). Inizialmente, considerando RF=1, Qdrant è stato in grado di fornire una latenza soddisfacente a fronte di un throughput maggiore rispetto a Milvus (i QPS più elevati non sono mostrati perché i test non si sono conclusi senza errori).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant ha una latenza RF=1 per un throughput variabile</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus ha una latenza RF=1 per un throughput variabile.</p>
<p>Tuttavia, aumentando il fattore di replica, la latenza p99 di Qdrant è migliorata, ma Milvus è stato in grado di sostenere un throughput superiore a quello di Qdrant, con una latenza accettabile (Qdrant 400 QPS non mostrato perché il test non è stato completato a causa dell'elevata latenza e degli errori).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus registra una latenza RF=2 per un throughput variabile</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant presenta una latenza RF=2 per un throughput variabile</p>
<p>A causa dei vincoli di tempo, non abbiamo avuto tempo sufficiente per confrontare il richiamo della RNA tra le soluzioni sui nostri set di dati, ma abbiamo preso in considerazione le misurazioni del richiamo della RNA per le soluzioni fornite da <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> su set di dati pubblicamente disponibili.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Selezione finale</h3><p><strong>Dal punto di vista delle prestazioni</strong>, senza una grande messa a punto e utilizzando solo HNSW, Qdrant sembra avere una latenza grezza migliore in molti test rispetto a Milvus. Milvus, tuttavia, sembrava in grado di scalare meglio con l'aumento delle repliche e aveva un migliore isolamento tra ingestione e carico delle query grazie alla sua architettura a più nodi.</p>
<p><strong>Dal punto di vista operativo,</strong> nonostante la complessità dell'architettura di Milvus (più tipi di nodi, affidamento a un log esterno write-ahead come Kafka e a un archivio di metadati come etcd), è stato più facile eseguire il debug e la correzione di Milvus rispetto a Qdrant quando una delle due soluzioni si è trovata in uno stato negativo. Milvus ha anche un ribilanciamento automatico quando si aumenta il fattore di replica di una collezione, mentre in Qdrant open-source è necessario creare o eliminare manualmente gli shard per aumentare il fattore di replica (una funzione che avremmo dovuto costruire noi stessi o utilizzare la versione non open-source).</p>
<p>Milvus è una tecnologia più "a forma di Reddit" rispetto a Qdrant; condivide maggiori somiglianze con il resto del nostro stack tecnologico. Milvus è scritto in Golang, il nostro linguaggio di programmazione backend preferito, e quindi è più facile per noi contribuire rispetto a Qdrant, che è scritto in Rust. Milvus ha un'eccellente velocità di progetto per la sua offerta open-source rispetto a Qdrant, e soddisfa un maggior numero di requisiti chiave.</p>
<p>Alla fine, entrambe le soluzioni hanno soddisfatto la maggior parte dei nostri requisiti e in alcuni casi Qdrant ha avuto un vantaggio in termini di prestazioni, ma abbiamo ritenuto di poter scalare ulteriormente Milvus, di sentirci più a nostro agio nell'utilizzarlo e che fosse più adatto alla nostra organizzazione rispetto a Qdrant. Avremmo voluto avere più tempo per testare Vespa e Weaviate, ma anche loro potrebbero essere stati selezionati per motivi organizzativi (Vespa è basata su Java) e di architettura (Weaviate è di tipo single-node come Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Aspetti salienti<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Mettete in discussione i requisiti che vi vengono forniti e cercate di eliminare i pregiudizi sulle soluzioni esistenti.</p></li>
<li><p>Assegnare un punteggio alle soluzioni candidate e usarlo per informare la discussione sui requisiti essenziali, non come un punto di arrivo assoluto.</p></li>
<li><p>Valutate quantitativamente le soluzioni, ma lungo il percorso prendete nota di ciò che significa lavorare con la soluzione.</p></li>
<li><p>Scegliete la soluzione che si adatta meglio alla vostra organizzazione dal punto di vista della manutenzione, dei costi, dell'usabilità e delle prestazioni, non solo perché la soluzione è la più performante.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Ringraziamenti<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo lavoro di valutazione è stato svolto da Ben Kochie, Charles Njoroge, Amit Kumar e da me. Grazie anche ad altri che hanno contribuito a questo lavoro, tra cui Annie Yang, Konrad Reiche, Sabrina Kong e Andrew Johnson, per la ricerca qualitativa delle soluzioni.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Note dell'editore<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Vogliamo ringraziare sinceramente il team di ingegneri di Reddit, non solo per aver scelto Milvus per i loro carichi di lavoro di ricerca vettoriale, ma anche per aver trovato il tempo di pubblicare una valutazione così dettagliata e corretta. È raro vedere questo livello di trasparenza nel modo in cui i team di ingegneri reali confrontano i database, e il loro articolo sarà utile a chiunque nella comunità Milvus (e non solo) stia cercando di dare un senso al crescente panorama dei database vettoriali.</p>
<p>Come ha detto Chris nel post, non esiste un unico database vettoriale "migliore". Ciò che conta è se un sistema si adatta al vostro carico di lavoro, ai vostri vincoli e alla vostra filosofia operativa. Il confronto di Reddit riflette bene questa realtà. Milvus non è al top in tutte le categorie, e questo è del tutto prevedibile visti i compromessi tra i diversi modelli di dati e gli obiettivi di prestazione.</p>
<p>Una cosa che vale la pena di chiarire: La valutazione di Reddit ha utilizzato <strong>Milvus 2.4</strong>, che all'epoca era la versione stabile. Alcune funzionalità, come LSH e diverse ottimizzazioni degli indici, non esistevano ancora o non erano mature nella versione 2.4, quindi alcuni punteggi riflettono naturalmente quella vecchia base. Da allora, abbiamo rilasciato Milvus 2.5 e poi <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>, ed è un sistema molto diverso in termini di prestazioni, efficienza e flessibilità. La risposta della comunità è stata forte e molti team hanno già effettuato l'aggiornamento.</p>
<p><strong>Ecco una rapida panoramica delle novità di Milvus 2.6:</strong></p>
<ul>
<li><p><strong>Utilizzo della memoria ridotto</strong> fino al <strong>72%</strong> e <strong>query 4 volte più veloci</strong> con la quantizzazione a 1 bit RaBitQ</p></li>
<li><p><strong>Riduzione del 50% dei costi</strong> con l'archiviazione intelligente a livelli</p></li>
<li><p><strong>Ricerca full-text BM25 4 volte più veloce</strong> rispetto a Elasticsearch</p></li>
<li><p><strong>Filtraggio JSON 100 volte più veloce</strong> con il nuovo Path Index</p></li>
<li><p>Una nuova architettura a zero dischi per una ricerca più fresca a costi inferiori</p></li>
<li><p>Un flusso di lavoro più semplice "data-in, data-out" per incorporare le pipeline</p></li>
<li><p>Supporto per <strong>oltre 100K collezioni</strong> per gestire ambienti multi-tenant di grandi dimensioni</p></li>
</ul>
<p>Se desiderate un resoconto completo, ecco alcuni buoni follow-up:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: Ricerca vettoriale accessibile su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Note di rilascio di Milvus 2.6: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Benchmarking del mondo reale per i database vettoriali - Blog Milvus</a></p></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi funzionalità? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>

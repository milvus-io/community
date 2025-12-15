---
id: unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
title: >-
  Lo spazio incontra la semantica: Sbloccare la ricerca geo-vettoriale con i
  campi geometrici e l'indice RTREE in Milvus
author: Cai Zhang
date: 2025-12-08T00:00:00.000Z
cover: assets.zilliz.com/rtree_cover_53c424f967.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Geometry field, RTREE index, Geo-Vector Search'
meta_title: |
  Milvus Geometry Field and RTREE Index for Geo-Vector Search
desc: >-
  Scoprite come Milvus 2.6 unifica la ricerca vettoriale con l'indicizzazione
  geospaziale grazie ai campi geometrici e all'indice RTREE, consentendo un
  reperimento dell'intelligenza artificiale accurato e consapevole della
  posizione.
origin: >-
  https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md
---
<p>Con l'aumentare dell'intelligenza dei sistemi moderni, i dati di geolocalizzazione sono diventati essenziali per applicazioni come le raccomandazioni guidate dall'intelligenza artificiale, il dispacciamento intelligente e la guida autonoma.</p>
<p>Ad esempio, quando si ordina del cibo su piattaforme come DoorDash o Uber Eats, il sistema considera molto di più della distanza tra l'utente e il ristorante. Tiene conto anche delle valutazioni dei ristoranti, della posizione dei corrieri, delle condizioni del traffico e persino delle tue preferenze personali. Nella guida autonoma, i veicoli devono eseguire la pianificazione del percorso, il rilevamento degli ostacoli e la comprensione semantica della scena, spesso in pochi millisecondi.</p>
<p>Tutto questo dipende dalla capacità di indicizzare e recuperare in modo efficiente i dati geospaziali.</p>
<p>Tradizionalmente, i dati geografici e i dati vettoriali vivevano in due sistemi separati:</p>
<ul>
<li><p>I sistemi geospaziali memorizzano le coordinate e le relazioni spaziali (latitudine, longitudine, regioni poligonali, ecc.).</p></li>
<li><p>I database vettoriali gestiscono le incorporazioni semantiche e la ricerca di somiglianze generate dai modelli di intelligenza artificiale.</p></li>
</ul>
<p>Questa separazione complica l'architettura, rallenta le interrogazioni e rende difficile per le applicazioni eseguire ragionamenti spaziali e semantici allo stesso tempo.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6</a> risolve questo problema introducendo il <a href="https://milvus.io/docs/geometry-field.md">campo geometrico</a>, che consente di combinare la ricerca di similarità vettoriale direttamente con i vincoli spaziali. Ciò consente di risolvere casi d'uso quali:</p>
<ul>
<li><p>Servizi di localizzazione (LBS): "trovare POI simili all'interno di questo isolato".</p></li>
<li><p>Ricerca multimodale: "trovare foto simili nel raggio di 1 km da questo punto".</p></li>
<li><p>Mappe e logistica: "beni all'interno di una regione" o "percorsi che intersecano un percorso".</p></li>
</ul>
<p>Insieme al nuovo <a href="https://milvus.io/docs/rtree.md">indice RTREE, una</a>struttura ad albero ottimizzata per il filtraggio spaziale, Milvus supporta ora operatori geospaziali efficienti come <code translate="no">st_contains</code>, <code translate="no">st_within</code> e <code translate="no">st_dwithin</code> oltre alla ricerca vettoriale ad alta dimensione. Insieme, questi strumenti rendono il reperimento intelligente e consapevole dello spazio non solo possibile, ma anche pratico.</p>
<p>In questo post spiegheremo come funzionano il campo geometrico e l'indice RTREE e come si combinano con la ricerca per similarità vettoriale per consentire applicazioni spaziali-semantiche del mondo reale.</p>
<h2 id="What-Is-a-Geometry-Field" class="common-anchor-header">Che cos'è un campo geometrico?<button data-href="#What-Is-a-Geometry-Field" class="anchor-icon" translate="no">
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
    </button></h2><p>Un <strong>campo geometrico</strong> è un tipo di dati definito dallo schema (<code translate="no">DataType.GEOMETRY</code>) in Milvus utilizzato per memorizzare dati geometrici. A differenza dei sistemi che gestiscono solo le coordinate grezze, Milvus supporta una serie di strutture spaziali, tra cui <strong>Point</strong>, <strong>LineString</strong> e <strong>Polygon</strong>.</p>
<p>In questo modo è possibile rappresentare concetti del mondo reale come la posizione di un ristorante (Point), le zone di consegna (Polygon) o le traiettorie di un veicolo autonomo (LineString), il tutto all'interno dello stesso database che memorizza i vettori semantici. In altre parole, Milvus diventa un sistema unificato per sapere sia <em>dove</em> si trova qualcosa che <em>cosa significa</em>.</p>
<p>I valori geometrici sono memorizzati utilizzando il formato <a href="https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry">Well-Known Text (WKT)</a>, uno standard leggibile dall'uomo per l'inserimento e l'interrogazione dei dati geometrici. Questo semplifica l'inserimento e l'interrogazione dei dati perché le stringhe WKT possono essere inserite direttamente in un record Milvus. Per esempio:</p>
<pre><code translate="no">data = [
    { 
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;geo&quot;</span>: <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,
        <span class="hljs-string">&quot;vector&quot;</span>: vector,
    }
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="What-Is-the-RTREE-Index-and-How-Does-It-Work" class="common-anchor-header">Cos'è l'indice RTREE e come funziona?<button data-href="#What-Is-the-RTREE-Index-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta introdotto il tipo di dati Geometria, Milvus ha bisogno di un modo efficiente per filtrare gli oggetti spaziali. Milvus gestisce questo aspetto utilizzando una pipeline di filtraggio spaziale a due stadi:</p>
<ul>
<li><p><strong>Filtraggio grossolano:</strong> Restringe rapidamente i candidati utilizzando indici spaziali come RTREE.</p></li>
<li><p><strong>Filtraggio fine:</strong> Applica controlli geometrici esatti ai candidati rimasti, garantendo la correttezza ai confini.</p></li>
</ul>
<p>Il cuore di questo processo è <strong>RTREE (Rectangle Tree)</strong>, una struttura di indicizzazione spaziale progettata per i dati geometrici multidimensionali. RTREE accelera le interrogazioni spaziali organizzando gli oggetti geometrici in modo gerarchico.</p>
<p><strong>Fase 1: costruzione dell'indice</strong></p>
<p><strong>1. Creare i nodi foglia:</strong> Per ogni oggetto geometrico, calcolare il suo <strong>Minimum Bounding Rectangle (MBR)</strong>- il rettangolo più piccolo che contiene completamente l'oggetto - e memorizzarlo come nodo foglia.</p>
<p><strong>2. Raggruppare in riquadri più grandi:</strong> Raggruppare i nodi foglia vicini e avvolgere ogni gruppo in un nuovo MBR, producendo nodi interni.</p>
<p><strong>3. Aggiungere il nodo radice:</strong> Creare un nodo radice il cui MBR copre tutti i gruppi interni, formando una struttura ad albero bilanciata in altezza.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RTREE_Index_11b5d09e07.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fase 2: accelerazione delle query</strong></p>
<p><strong>1. Formare l'MBR della query:</strong> calcolare l'MBR per la geometria utilizzata nella query.</p>
<p><strong>2. Potare i rami:</strong> Partendo dalla radice, confrontare l'MBR della query con ogni nodo interno. Saltare i rami il cui MBR non si interseca con l'MBR della query.</p>
<p><strong>3. Raccogliere i candidati:</strong> Scendere nei rami che si intersecano e raccogliere i nodi foglia candidati.</p>
<p><strong>4. Eseguire la corrispondenza esatta:</strong> per ogni candidato, eseguire il predicato spaziale per ottenere risultati precisi.</p>
<h3 id="Why-RTREE-Is-Fast" class="common-anchor-header">Perché RTREE è veloce</h3><p>RTREE offre prestazioni elevate nel filtraggio spaziale grazie a diverse caratteristiche progettuali fondamentali:</p>
<ul>
<li><p><strong>Ogni nodo memorizza un MBR:</strong> ogni nodo approssima l'area di tutte le geometrie nel suo sottoalbero. In questo modo è facile decidere se un ramo deve essere esplorato durante un'interrogazione.</p></li>
<li><p><strong>Potatura veloce:</strong> Vengono esplorati solo i sottoalberi il cui MBR interseca la regione dell'interrogazione. Le aree irrilevanti vengono completamente ignorate.</p></li>
<li><p><strong>Scala con la dimensione dei dati:</strong> RTREE supporta ricerche spaziali in tempo <strong>O(log N)</strong>, consentendo interrogazioni veloci anche quando il set di dati si espande.</p></li>
<li><p><strong>Implementazione di Boost.Geometry:</strong> Milvus costruisce il suo indice RTREE utilizzando <a href="https://www.boost.org/library/latest/geometry/">Boost.Geometry</a>, una libreria C++ ampiamente utilizzata che fornisce algoritmi geometrici ottimizzati e un'implementazione RTREE thread-safe adatta a carichi di lavoro concomitanti.</p></li>
</ul>
<h3 id="Supported-geometry-operators" class="common-anchor-header">Operatori geometrici supportati</h3><p>Milvus offre una serie di operatori spaziali che consentono di filtrare e recuperare entità in base a relazioni geometriche. Questi operatori sono essenziali per i carichi di lavoro che devono capire come gli oggetti si relazionano tra loro nello spazio.</p>
<p>La tabella seguente elenca gli <a href="https://milvus.io/docs/geometry-operators.md">operatori geometrici</a> attualmente disponibili in Milvus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Operatore</strong></th><th style="text-align:center"><strong>Descrizione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>st_intersects(A, B)</strong></td><td style="text-align:center">Restituisce VERO se le geometrie A e B hanno almeno un punto in comune.</td></tr>
<tr><td style="text-align:center"><strong>st_contiene(A, B)</strong></td><td style="text-align:center">Restituisce VERO se la geometria A contiene completamente la geometria B (escluso il confine).</td></tr>
<tr><td style="text-align:center"><strong>st_within(A, B)</strong></td><td style="text-align:center">Restituisce VERO se la geometria A è completamente contenuta nella geometria B. È l'inverso di st_contains(A, B).</td></tr>
<tr><td style="text-align:center"><strong>st_covers(A, B)</strong></td><td style="text-align:center">Restituisce VERO se la geometria A copre la geometria B (compresi i confini).</td></tr>
<tr><td style="text-align:center"><strong>st_tocca(A, B)</strong></td><td style="text-align:center">Restituisce VERO se le geometrie A e B si toccano ai loro confini ma non si intersecano internamente.</td></tr>
<tr><td style="text-align:center"><strong>st_equals(A, B)</strong></td><td style="text-align:center">Restituisce VERO se le geometrie A e B sono spazialmente identiche.</td></tr>
<tr><td style="text-align:center"><strong>st_overlaps(A, B)</strong></td><td style="text-align:center">Restituisce VERO se le geometrie A e B si sovrappongono parzialmente e nessuna contiene completamente l'altra.</td></tr>
<tr><td style="text-align:center"><strong>st_dwithin(A, B, d)</strong></td><td style="text-align:center">Restituisce VERO se la distanza tra A e B è inferiore a <em>d</em>.</td></tr>
</tbody>
</table>
<h3 id="How-to-Combine-Geolocation-Index-and-Vector-Index" class="common-anchor-header">Come combinare l'indice di geolocalizzazione e l'indice vettoriale</h3><p>Grazie al supporto della geometria e all'indice RTREE, Milvus può combinare il filtraggio geospaziale con la ricerca di similarità vettoriale in un unico flusso di lavoro. Il processo funziona in due fasi:</p>
<p><strong>1. Filtrare in base alla posizione utilizzando RTREE:</strong> Milvus utilizza innanzitutto l'indice RTREE per restringere la ricerca alle entità all'interno dell'intervallo geografico specificato (ad esempio, "entro 2 km").</p>
<p><strong>2. Classifica per semantica utilizzando la ricerca vettoriale:</strong> Tra i candidati rimanenti, l'indice vettoriale seleziona la Top-N dei risultati più simili in base alla similarità di incorporazione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Geometry_R_Tree_f1d88fc252.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Applications-of-Geo-Vector-Retrieval" class="common-anchor-header">Applicazioni reali del recupero geo-vettoriale<button data-href="#Real-World-Applications-of-Geo-Vector-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Delivery-Services-Smarter-Location-Aware-Recommendations" class="common-anchor-header">1. Servizi di consegna: Raccomandazioni più intelligenti e consapevoli della posizione</h3><p>Piattaforme come DoorDash o Uber Eats gestiscono centinaia di milioni di richieste ogni giorno. Nel momento in cui un utente apre l'applicazione, il sistema deve determinare, in base alla posizione dell'utente, all'ora del giorno, alle preferenze di gusto, ai tempi di consegna stimati, al traffico in tempo reale e alla disponibilità del corriere, quali sono i ristoranti o i corrieri più adatti in <em>questo momento</em>.</p>
<p>Tradizionalmente, questo richiede l'interrogazione di un database geospaziale e di un motore di raccomandazione separato, seguito da molteplici cicli di filtraggio e ri-classificazione. Con il Geolocation Index, Milvus semplifica notevolmente questo flusso di lavoro:</p>
<ul>
<li><p><strong>Archiviazione unificata</strong> - Le coordinate dei ristoranti, le posizioni dei corrieri e le incorporazioni delle preferenze degli utenti si trovano tutte in un unico sistema.</p></li>
<li><p><strong>Recupero congiunto</strong> - Applicare prima un filtro spaziale (ad esempio, <em>ristoranti entro 3 km</em>), quindi utilizzare la ricerca vettoriale per classificare in base alla somiglianza, alle preferenze di gusto o alla qualità.</p></li>
<li><p><strong>Processo decisionale dinamico</strong> - Combinare la distribuzione dei corrieri in tempo reale e i segnali stradali per assegnare rapidamente il corriere più vicino e più adatto.</p></li>
</ul>
<p>Questo approccio unificato consente alla piattaforma di eseguire ragionamenti spaziali e semantici in un'unica interrogazione. Ad esempio, quando un utente cerca "riso al curry", Milvus recupera i ristoranti semanticamente rilevanti <em>e dà</em> la priorità a quelli che si trovano nelle vicinanze, che consegnano rapidamente e che corrispondono al profilo storico dei gusti dell'utente.</p>
<h3 id="2-Autonomous-Driving-More-Intelligent-Decisions" class="common-anchor-header">2. Guida autonoma: Decisioni più intelligenti</h3><p>Nella guida autonoma, l'indicizzazione geospaziale è fondamentale per la percezione, la localizzazione e il processo decisionale. I veicoli devono allinearsi continuamente a mappe ad alta definizione, rilevare gli ostacoli e pianificare traiettorie sicure, il tutto in pochi millisecondi.</p>
<p>Con Milvus, il tipo Geometry e l'indice RTREE possono memorizzare e interrogare strutture spaziali ricche come:</p>
<ul>
<li><p><strong>Confini stradali</strong> (LineString)</p></li>
<li><p><strong>Zone di regolazione del traffico</strong> (poligono)</p></li>
<li><p><strong>Ostacoli rilevati</strong> (Point)</p></li>
</ul>
<p>Queste strutture possono essere indicizzate in modo efficiente, consentendo ai dati geospaziali di partecipare direttamente al ciclo decisionale dell'intelligenza artificiale. Ad esempio, un veicolo autonomo può determinare rapidamente se le sue coordinate attuali rientrano in una corsia specifica o se intersecano un'area limitata, semplicemente attraverso un predicato spaziale RTREE.</p>
<p>Se combinato con le incorporazioni vettoriali generate dal sistema di percezione, come le incorporazioni della scena che catturano l'ambiente di guida corrente, Milvus può supportare query più avanzate, come il recupero di scenari di guida storici simili a quello attuale in un raggio di 50 metri. Questo aiuta i modelli a interpretare l'ambiente più velocemente e a prendere decisioni migliori.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusioni<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La geolocalizzazione è molto più che latitudine e longitudine: è una preziosa fonte di informazioni semantiche che ci dice dove avvengono le cose, come si relazionano con l'ambiente circostante e a quale contesto appartengono.</p>
<p>Nel database di nuova generazione di Zilliz, i dati vettoriali e le informazioni geospaziali si uniscono gradualmente in una base unificata. Questo permette di:</p>
<ul>
<li><p>Recupero congiunto di vettori, dati geospaziali e tempo.</p></li>
<li><p>Sistemi di raccomandazione consapevoli dello spazio</p></li>
<li><p>Ricerca multimodale basata sulla posizione (LBS).</p></li>
</ul>
<p>In futuro, l'intelligenza artificiale non solo capirà <em>il significato</em> dei contenuti, ma anche dove si applicano e quando sono più importanti.</p>
<p>Per ulteriori informazioni sul campo geometrico e sull'indice RTREE, consultare la documentazione qui sotto:</p>
<ul>
<li><p><a href="https://milvus.io/docs/geometry-field.md">Campo geometrico | Documentazione Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/rtree.md">RTREE | Documentazione Milvus</a></p></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Per saperne di più sulle caratteristiche di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale accessibile su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove funzionalità Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un picchio per Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza uccidere il richiamo</a></p></li>
</ul>

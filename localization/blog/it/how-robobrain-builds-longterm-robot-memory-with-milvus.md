---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Come RoboBrain costruisce la memoria a lungo termine dei robot con Milvus
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  I moduli robotici possono funzionare da soli, ma falliscono se concatenati. Il
  CEO di Senqi AI spiega come RoboBrain utilizza lo stato dei compiti, il
  feedback e la memoria Milvus.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Questo post è stato scritto da Song Zhi, CEO di Senqi AI, un'azienda di embodied-AI che costruisce infrastrutture per l'esecuzione di compiti per i robot. RoboBrain è uno dei prodotti principali di Senqi AI.</em></p>
<p>La maggior parte delle capacità dei robot funziona bene da sola. Un modello di navigazione può pianificare un percorso. Un modello di percezione può identificare gli oggetti. Un modulo vocale può accettare istruzioni. L'insuccesso produttivo si verifica quando queste funzionalità devono essere eseguite come un unico compito continuo.</p>
<p>Per un robot, una semplice istruzione come "vai a controllare quell'area, fotografa qualsiasi cosa insolita e avvisami" richiede una pianificazione prima dell'inizio del compito, un adattamento durante l'esecuzione e la produzione di un risultato utile al termine. Ogni passaggio di consegne può interrompersi: la navigazione si blocca dietro un ostacolo, una foto sfocata viene accettata come definitiva o il sistema dimentica l'eccezione gestita cinque minuti prima.</p>
<p>Questa è la sfida principale per gli <a href="https://zilliz.com/glossary/ai-agents">agenti AI</a> che operano nel mondo fisico. A differenza degli agenti digitali, i robot operano con <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati</a> continui <a href="https://zilliz.com/learn/introduction-to-unstructured-data">e non strutturati</a>: percorsi bloccati, luce che cambia, limiti della batteria, rumore dei sensori e regole dell'operatore.</p>
<p>RoboBrain è il sistema operativo di intelligenza incarnata di Senqi AI per l'esecuzione dei compiti dei robot. Si colloca al livello delle attività, collegando percezione, pianificazione, controllo dell'esecuzione e feedback dei dati, in modo che le istruzioni in linguaggio naturale possano diventare flussi di lavoro robotici strutturati e recuperabili.</p>
<table>
<thead>
<tr><th>Punto di rottura</th><th>Cosa non funziona in produzione</th><th>Come RoboBrain lo risolve</th></tr>
</thead>
<tbody>
<tr><td>Pianificazione del compito</td><td>Le istruzioni vaghe lasciano i moduli a valle senza campi di esecuzione concreti.</td><td>L'oggettivazione del compito trasforma l'intento in uno stato condiviso.</td></tr>
<tr><td>Instradamento del contesto</td><td>Le informazioni giuste esistono, ma raggiungono la fase decisionale sbagliata.</td><td>La memoria a livelli instrada separatamente il contesto in tempo reale, a breve termine e a lungo termine.</td></tr>
<tr><td>Feedback sui dati</td><td>Un singolo passaggio viene completato o fallito senza migliorare l'esecuzione successiva.</td><td>I feedback di scrittura aggiornano lo stato dell'attività e la memoria a lungo termine.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Tre punti di interruzione nell'esecuzione di attività robotiche<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>I task software possono spesso essere delimitati come input, processo e risultato. I task dei robot si scontrano con uno stato fisico in movimento: percorsi bloccati, luce che cambia, limiti della batteria, rumore dei sensori e regole dell'operatore.</p>
<p>Per questo motivo, il task loop ha bisogno di qualcosa di più di modelli isolati. Ha bisogno di un modo per preservare il contesto attraverso la pianificazione, l'esecuzione e il feedback.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. Pianificazione del compito: Istruzioni vaghe producono un'esecuzione vaga</h3><p>Una frase come "vai a dare un'occhiata" nasconde molte decisioni. Quale area? Cosa deve fotografare il robot? Cosa conta come insolito? Cosa deve fare se lo scatto fallisce? Quale risultato deve restituire all'operatore?</p>
<p>Se il livello dell'attività non è in grado di risolvere questi dettagli in campi concreti - area di destinazione, oggetto di ispezione, condizione di completamento, politica di fallimento e formato di restituzione - l'attività si svolge senza direzione fin dall'inizio e non recupera mai il contesto a valle.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Instradamento del contesto: I dati giusti arrivano allo stadio sbagliato</h3><p>Lo stack del robot può già contenere le informazioni giuste, ma l'esecuzione dell'attività dipende dal recupero delle stesse nella fase giusta.</p>
<p>La fase di avvio ha bisogno di mappe, definizioni di aree e regole operative. A metà esecuzione serve lo stato dei sensori in tempo reale. La gestione delle eccezioni necessita di casi simili provenienti da distribuzioni precedenti. Quando queste fonti sono confuse, il sistema prende il tipo di decisione giusta con il contesto sbagliato.</p>
<p>Quando l'instradamento fallisce, l'avvio si basa su un'esperienza obsoleta invece che sulle regole dell'area, la gestione delle eccezioni non riesce a raggiungere i casi di cui ha bisogno e l'esecuzione intermedia riceve la mappa di ieri invece che le letture in tempo reale. Dare a qualcuno un dizionario non lo aiuta a scrivere un saggio. I dati devono arrivare al punto di decisione giusto, nella fase giusta e nella forma giusta.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Feedback sui dati: L'esecuzione a singolo passaggio non migliora</h3><p>Senza writeback, un robot può terminare un'esecuzione senza migliorare quella successiva. Un'azione completata ha ancora bisogno di un controllo di qualità: l'immagine è abbastanza nitida o il robot deve riprendere? Il percorso è ancora libero o deve deviare? La batteria è al di sopra della soglia o l'attività deve essere interrotta?</p>
<p>Un sistema a passaggio singolo non ha un meccanismo per queste chiamate. Esegue, si ferma e ripete lo stesso errore la volta successiva.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Come RoboBrain chiude il ciclo di attività del robot<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain collega la comprensione dell'ambiente, la pianificazione delle attività, il controllo dell'esecuzione e il feedback dei dati in un unico ciclo operativo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>L'architettura del middleware di base di RoboBrain mostra come l'intento dell'utente passi attraverso gli oggetti dei compiti, la memoria stage-aware alimentata da Milvus e un motore di policy prima di raggiungere le capacità incarnate</span> </span>.</p>
<p>Nell'architettura descritta in questo post, questo ciclo è implementato attraverso tre meccanismi:</p>
<ol>
<li>L<strong>'oggettivazione dei compiti</strong> struttura il punto di ingresso.</li>
<li>La<strong>memoria a livelli</strong> indirizza le informazioni giuste alla fase giusta.</li>
<li><strong>Un ciclo di feedback</strong> scrive i risultati e decide la mossa successiva.</li>
</ol>
<p>Funzionano solo come un insieme. Se se ne risolve uno senza gli altri, la catena si interrompe comunque al punto successivo.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. Oggettivazione del compito: Trasformazione dell'intento in stato condiviso</h3><p>Prima di iniziare l'esecuzione, RoboBrain trasforma ogni istruzione in un oggetto compito: tipo di compito, area di destinazione, oggetto di ispezione, vincoli, output previsto, fase corrente e politica di fallimento.</p>
<p>Il punto non è solo il parsing del linguaggio. Il punto è dare a ogni modulo a valle la stessa visione statica del compito. Senza questa conversione, il compito non ha direzione.</p>
<p>Nell'esempio della pattuglia, l'oggetto task inserisce il tipo di ispezione, la zona designata, gli elementi anomali come oggetto di controllo, la batteria &gt;= 20% come vincolo, la foto di un'anomalia chiara e l'avviso dell'operatore come risultato atteso e il ritorno alla base come politica di fallimento.</p>
<p>Il campo dello stage si aggiorna al variare della corsa. Un ostacolo sposta l'attività dalla navigazione alla deviazione o alla richiesta di aiuto. Un'immagine sfocata sposta l'attività dall'ispezione alla ripresa. Una batteria scarica lo sposta dalla terminazione al ritorno alla base.</p>
<p>I moduli a valle non ricevono più comandi isolati. Ricevono la fase corrente dell'attività, i suoi vincoli e il motivo per cui la fase è cambiata.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Memoria a livelli: Indirizzare il contesto alla fase giusta</h3><p>RoboBrain divide le informazioni rilevanti per l'attività in tre livelli, in modo che i dati giusti arrivino allo stadio giusto.</p>
<p><strong>Lo stato in tempo reale</strong> contiene la posa, la batteria, le letture dei sensori e le osservazioni ambientali. Supporta le decisioni in ogni fase di controllo.</p>
<p>Il<strong>contesto a breve termine</strong> registra gli eventi relativi al compito corrente: l'ostacolo che il robot ha evitato due minuti fa, la foto che ha scattato di nuovo o la porta che non è riuscita ad aprire al primo tentativo. In questo modo il sistema non perde traccia di ciò che è appena accaduto.</p>
<p>La<strong>memoria semantica a lungo termine</strong> memorizza la conoscenza della scena, l'esperienza storica, i casi di eccezione e le annotazioni successive all'attività. Una particolare area di parcheggio può richiedere la regolazione dell'angolo della telecamera di notte a causa delle superfici riflettenti. Un certo tipo di anomalia può avere una storia di falsi positivi e dovrebbe far scattare una revisione umana invece di un avviso automatico.</p>
<p>Questo livello a lungo termine si basa sulla <a href="https://zilliz.com/learn/vector-similarity-search">ricerca di similarità vettoriale</a> attraverso il <a href="https://milvus.io/">database vettoriale di Milvus</a>, perché recuperare la memoria giusta significa abbinare il significato, non l'ID o la parola chiave. Le descrizioni della scena e le registrazioni di movimentazione sono memorizzate come <a href="https://zilliz.com/glossary/vector-embeddings">incorporazioni vettoriali</a> e recuperate con una <a href="https://zilliz.com/glossary/anns">ricerca approssimativa dei vicini</a> per trovare le corrispondenze semantiche più vicine.</p>
<p>All'avvio vengono estratte dalla memoria a lungo termine le regole dell'area e i riepiloghi delle pattuglie passate. L'esecuzione intermedia si basa sullo stato in tempo reale e sul contesto a breve termine. La gestione delle eccezioni utilizza la <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a> per trovare casi simili nella memoria a lungo termine.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. Ciclo di feedback: Scrittura dei risultati nel sistema</h3><p>RoboBrain scrive i risultati della navigazione, della percezione e dell'azione nell'oggetto task dopo ogni passo, aggiornando il campo dello stage. Il sistema legge queste osservazioni e decide la mossa successiva: deviare se il percorso non è raggiungibile, riprendere se l'immagine è sfocata, riprovare se la porta non si apre o terminare se la batteria è scarica.</p>
<p>L'esecuzione diventa un ciclo: eseguire, osservare, regolare, eseguire di nuovo. La catena continua ad adattarsi ai cambiamenti ambientali invece di interrompersi al primo imprevisto.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Come Milvus alimenta la memoria a lungo termine del robot RoboBrain<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria di alcuni robot può essere interrogata in base all'ID dell'attività, al timestamp o ai metadati della sessione. L'esperienza operativa a lungo termine di solito non è possibile.</p>
<p>Il record utile è spesso il caso semanticamente simile alla scena corrente, anche se l'ID dell'attività, il nome della posizione o la formulazione sono diversi. Si tratta quindi di un problema di <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> e Milvus è adatto al livello di memoria a lungo termine.</p>
<p>Questo livello memorizza informazioni quali:</p>
<ul>
<li>Descrizioni delle regole dell'area e semantica dei punti di localizzazione</li>
<li>Definizioni dei tipi di anomalia e riepiloghi di esempi</li>
<li>Registrazioni storiche della manipolazione e conclusioni della revisione post-task</li>
<li>Riassunti della pattuglia scritti al completamento dell'attività</li>
<li>Scritture dell'esperienza dopo l'acquisizione da parte dell'uomo</li>
<li>Cause di guasto e strategie di correzione di scenari simili.</li>
</ul>
<p>Nulla di tutto ciò è naturalmente riconducibile a un campo strutturato. Tutto ciò deve essere richiamato in base al significato.</p>
<p>Un esempio concreto: il robot pattuglia l'ingresso di un parcheggio di notte. L'abbagliamento delle luci sopraelevate rende instabile il rilevamento delle anomalie. I riflessi continuano a essere segnalati come anomalie.</p>
<p>Il sistema deve ricordare le strategie di ripresa che hanno funzionato in condizioni di forte abbagliamento notturno, le correzioni dell'angolo di ripresa in aree simili e le conclusioni della revisione umana che hanno contrassegnato i rilevamenti precedenti come falsi positivi. Una query a corrispondenza esatta può trovare un ID attività o una finestra temporale noti. Non è in grado di individuare in modo affidabile "il caso di abbagliamento precedente che si è comportato come questo", a meno che tale relazione non sia già stata etichettata.</p>
<p>La similarità semantica è il modello di recupero che funziona. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Le metriche di somiglianza</a> classificano le memorie memorizzate in base alla rilevanza, mentre il <a href="https://milvus.io/docs/filtered-search.md">filtraggio dei metadati</a> può restringere lo spazio di ricerca in base all'area, al tipo di attività o alla finestra temporale. In pratica, si tratta spesso di una <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">ricerca ibrida</a>: corrispondenza semantica per il significato, filtri strutturati per i vincoli operativi.</p>
<p>Per l'implementazione, il livello di filtro è spesso il punto in cui la memoria semantica diventa operativa. <a href="https://milvus.io/docs/boolean.md">Le espressioni dei filtri Milvus</a> definiscono vincoli scalari, mentre le <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">query scalari Milvus</a> supportano ricerche esatte quando il sistema ha bisogno di record in base ai metadati piuttosto che alla somiglianza.</p>
<p>Questo modello di reperimento assomiglia alla <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">generazione aumentata del reperimento</a>, adattata al processo decisionale del mondo fisico piuttosto che alla generazione del testo. Il robot non sta recuperando documenti per rispondere a una domanda, ma sta recuperando esperienze precedenti per scegliere la prossima azione sicura.</p>
<p>Non tutto entra in Milvus. Gli ID delle attività, i timestamp e i metadati delle sessioni si trovano in un database relazionale. I log grezzi del runtime vivono in un sistema di registrazione. Ogni sistema di archiviazione gestisce il modello di query per cui è stato costruito.</p>
<table>
<thead>
<tr><th>Tipo di dati</th><th>Dove risiede</th><th>Come vengono interrogati</th></tr>
</thead>
<tbody>
<tr><td>ID attività, timestamp, metadati di sessione</td><td>Database relazionale</td><td>Ricerche esatte, join</td></tr>
<tr><td>Log di runtime grezzi e flussi di eventi</td><td>Sistema di registrazione</td><td>Ricerca full-text, filtri per intervalli di tempo</td></tr>
<tr><td>Regole di scena, gestione dei casi, scrittura dell'esperienza</td><td>Milvus</td><td>Ricerca di similarità vettoriale per significato</td></tr>
</tbody>
</table>
<p>Man mano che le attività vengono eseguite e le scene si accumulano, il livello di memoria a lungo termine alimenta i processi a valle: la cura dei campioni per la messa a punto del modello, l'analisi dei dati più ampi e il trasferimento delle conoscenze tra le varie distribuzioni. La memoria si compone in un patrimonio di dati che fornisce a ogni futura implementazione un punto di partenza più elevato.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">Cosa cambia questa architettura nell'implementazione<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>L'oggettivazione dei compiti, la memoria a livelli e il ciclo di feedback trasformano il ciclo dei compiti di RoboBrain in un modello di distribuzione: ogni compito conserva lo stato, ogni eccezione può recuperare l'esperienza precedente e ogni esecuzione può migliorare quella successiva.</p>
<p>Un robot che pattuglia un nuovo edificio non deve partire da zero se ha già gestito altrove luci, ostacoli, tipi di anomalie o regole dell'operatore simili. È questo che rende l'esecuzione dei compiti dei robot più ripetibile in tutte le scene e che rende i costi di implementazione a lungo termine più facili da controllare.</p>
<p>Per i team di robotica, la lezione più profonda è che la memoria non è solo un livello di memorizzazione. Fa parte del controllo dell'esecuzione. Il sistema deve sapere cosa sta facendo, cosa è appena cambiato, quali casi simili si sono verificati in precedenza e cosa deve essere scritto per l'esecuzione successiva.</p>
<h2 id="Further-Reading" class="common-anchor-header">Ulteriori letture<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Se state lavorando a problemi simili con la memoria dei robot, l'esecuzione dei compiti o il recupero semantico per l'intelligenza artificiale incarnata, queste risorse sono utili per i prossimi passi:</p>
<ul>
<li>Leggete la <a href="https://milvus.io/docs">documentazione di Milvus</a> o provate il <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a> per vedere come funziona in pratica la ricerca vettoriale.</li>
<li>Esaminate la <a href="https://milvus.io/docs/architecture_overview.md">panoramica dell'architettura di Milvus</a> se state progettando un livello di memoria di produzione.</li>
<li>Sfogliate i <a href="https://zilliz.com/vector-database-use-cases">casi d'uso dei database vettoriali</a> per trovare altri esempi di ricerca semantica nei sistemi di produzione.</li>
<li>Unitevi alla <a href="https://milvus.io/community">comunità Milvus</a> per porre domande e condividere ciò che state costruendo.</li>
<li>Se volete un Milvus gestito invece di gestire la vostra infrastruttura, scoprite di più su <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>

---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  La revisione del codice AI migliora quando i modelli discutono: Claude vs
  Gemini vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Abbiamo testato Claude, Gemini, Codex, Qwen e MiniMax sul rilevamento di bug
  reali. Il modello migliore ha raggiunto il 53%. Dopo un dibattito in
  contraddittorio, il rilevamento è salito all'80%.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>Di recente ho utilizzato i modelli di intelligenza artificiale per esaminare una richiesta di pull e i risultati sono stati contraddittori: Claude ha segnalato una corsa ai dati, mentre Gemini ha detto che il codice era pulito. Questo mi ha fatto venire la curiosità di sapere come si sarebbero comportati altri modelli di intelligenza artificiale, così ho sottoposto gli ultimi modelli di punta di Claude, Gemini, Codex, Qwen e MiniMax a un benchmark strutturato per la revisione del codice. I risultati? Il modello più performante ha individuato solo il 53% dei bug noti.</p>
<p>Ma la mia curiosità non è finita qui: cosa succederebbe se questi modelli di intelligenza artificiale lavorassero insieme? Ho provato a farli discutere tra loro e, dopo cinque round di dibattito, il rilevamento dei bug è salito all'80%. I bug più difficili, quelli che richiedono una comprensione a livello di sistema, hanno raggiunto il 100% di rilevamento in modalità dibattito.</p>
<p>Questo post illustra il progetto dell'esperimento, i risultati per modello e ciò che il meccanismo del dibattito rivela su come utilizzare effettivamente l'intelligenza artificiale per la revisione del codice.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Analisi comparativa di Claude, Gemini, Codex, Qwen e MiniMax per la revisione del codice<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete utilizzato i modelli per la revisione del codice, probabilmente avrete notato che non differiscono solo per l'accuratezza, ma anche per il modo in cui leggono il codice. Per esempio:</p>
<p>Claude di solito percorre la catena di chiamate da cima a fondo e dedica tempo ai percorsi "noiosi" (gestione degli errori, tentativi, pulizia). Spesso è lì che si nascondono i veri bug, quindi non odio la meticolosità.</p>
<p>Gemini tende a iniziare con un verdetto forte ("questo non va bene" / "sembra a posto") e poi lavora a ritroso per giustificarlo da un punto di vista progettuale/strutturale. A volte è utile. A volte sembra che abbia fatto una scrematura e poi si sia impegnato in una presa di posizione.</p>
<p>Il Codex è più silenzioso. Ma quando segnala qualcosa, spesso è concreto e perseguibile: meno commenti, più "questa riga è sbagliata perché X".</p>
<p>Si tratta però di impressioni, non di misurazioni. Per ottenere numeri reali, ho impostato un benchmark.</p>
<h3 id="Setup" class="common-anchor-header">Impostazione</h3><p><strong>Sono stati testati cinque modelli di punta:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Strumenti (Magpie)</strong></p>
<p>Ho usato <a href="https://github.com/liliu-z/magpie">Magpie</a>, uno strumento di benchmarking open-source che ho costruito. Il suo compito è quello di fare la "preparazione alla revisione del codice" che normalmente si fa manualmente: raccogliere il contesto circostante (catene di chiamate, moduli correlati e codice adiacente pertinente) e darlo in pasto al modello <em>prima di</em> esaminare la PR.</p>
<p><strong>Casi di test (PR di Milvus con bug noti)</strong></p>
<p>Il set di dati consiste in 15 richieste di pull da <a href="https://github.com/milvus-io/milvus">Milvus</a> (un database vettoriale open-source creato e mantenuto da <a href="https://zilliz.com/">Zilliz</a>). Queste PR sono utili come benchmark perché ognuna di esse è stata unita, solo per richiedere in seguito un revert o una hotfix dopo che un bug è emerso in produzione. Quindi ogni caso ha un bug noto che possiamo valutare.</p>
<p><strong>Livelli di difficoltà dei bug</strong></p>
<p>Non tutti i bug sono ugualmente difficili da trovare, quindi li ho classificati in tre livelli di difficoltà:</p>
<ul>
<li><p><strong>L1:</strong> Visibile solo dalla diff (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 casi):</strong> Richiede la comprensione del codice circostante per individuare cose come i cambiamenti semantici dell'interfaccia o i concurrency race. Questi rappresentano i bug più comuni nella revisione quotidiana del codice.</p></li>
<li><p><strong>L3 (5 casi):</strong> Richiede una comprensione a livello di sistema per individuare problemi come incongruenze di stato tra moduli o problemi di compatibilità con gli aggiornamenti. Questi sono i test più difficili per verificare quanto profondamente un modello possa ragionare su una base di codice.</p></li>
</ul>
<p><em>Nota: ogni modello ha individuato tutti i bug L1, quindi li ho esclusi dal punteggio.</em></p>
<p><strong>Due modalità di valutazione</strong></p>
<p>Ogni modello è stato eseguito in due modalità:</p>
<ul>
<li><p><strong>Raw:</strong> il modello vede solo il PR (diff + qualsiasi cosa contenga il PR).</p></li>
<li><p><strong>R1:</strong> Magpie estrae il contesto circostante (file rilevanti / siti di chiamata / codice correlato) <em>prima della</em> revisione del modello. Questo simula un flusso di lavoro in cui si prepara il contesto in anticipo invece di chiedere al modello di indovinare ciò di cui ha bisogno.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Risultati (solo L2 + L3)</h3><table>
<thead>
<tr><th>Modalità</th><th>Claude</th><th>Gemelli</th><th>Codice</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Grezzo</td><td>53% (1°)</td><td>13% (ultimo)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (con contesto di Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Quattro indicazioni:</p>
<p><strong>1. Claude domina la recensione grezza.</strong> Ha ottenuto il 53% di rilevamento complessivo e un perfetto 5/5 sui bug L3, senza alcuna assistenza contestuale. Se si utilizza un solo modello e non si vuole perdere tempo a preparare il contesto, Claude è la scelta migliore.</p>
<p><strong>2. Gemini ha bisogno di essere assistito dal contesto.</strong> Il suo punteggio grezzo del 13% era il più basso del gruppo, ma con Magpie che forniva il codice circostante è salito al 33%. Gemini non riesce a raccogliere bene il proprio contesto, ma ha prestazioni rispettabili quando si fa questo lavoro in anticipo.</p>
<p><strong>3. Qwen è il più forte esecutore assistito dal contesto.</strong> Ha ottenuto il 40% in modalità R1, con 5/10 sui bug L2, il punteggio più alto a quel livello di difficoltà. Per le revisioni quotidiane di routine in cui si è disposti a preparare il contesto, Qwen è una scelta pratica.</p>
<p><strong>4. Un contesto più ampio non sempre aiuta.</strong> Ha migliorato Gemini (13% → 33%) e MiniMax (27% → 33%), ma ha danneggiato Claude (53% → 47%). Claude eccelle già da solo nell'organizzazione del contesto, quindi le informazioni aggiuntive hanno probabilmente introdotto rumore piuttosto che chiarezza. La lezione è: adeguare il flusso di lavoro al modello, piuttosto che presumere che un contesto più ampio sia universalmente migliore.</p>
<p>Questi risultati sono in linea con la mia esperienza quotidiana. Claude al primo posto non è sorprendente. Il fatto che Gemini abbia ottenuto un punteggio inferiore a quello che mi aspettavo ha senso a posteriori: di solito uso Gemini in conversazioni a più turni in cui sto iterando su un progetto o sto affrontando un problema insieme, e si comporta bene in questo contesto interattivo. Questo benchmark è una pipeline fissa a passaggio singolo, che è esattamente il formato in cui Gemini è più debole. La sezione dedicata al dibattito mostrerà che quando si offre a Gemini un formato multi-turno, in contraddittorio, le sue prestazioni migliorano sensibilmente.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Lasciare che i modelli di intelligenza artificiale discutano tra loro<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Ogni modello ha mostrato punti di forza e punti deboli diversi nei singoli benchmark. Volevo quindi verificare: cosa succede se i modelli esaminano l'uno il lavoro dell'altro, anziché solo il codice?</p>
<p>Ho quindi aggiunto un livello di dibattito sopra lo stesso benchmark. Tutti e cinque i modelli partecipano a cinque round:</p>
<ul>
<li><p>Nel primo round, ogni modello esamina la stessa PR in modo indipendente.</p></li>
<li><p>Dopodiché, trasmetto le cinque revisioni a tutti i partecipanti.</p></li>
<li><p>Nel secondo round, ogni modello aggiorna la propria posizione in base a quella degli altri quattro.</p></li>
<li><p>Ripetiamo fino al quinto round.</p></li>
</ul>
<p>Alla fine, ogni modello non reagisce solo al codice, ma anche ad argomenti che sono già stati criticati e rivisti più volte.</p>
<p>Per evitare che il tutto si trasformi in un "LLM che si accordano ad alta voce", ho imposto una regola ferrea: <strong>ogni affermazione deve indicare un codice specifico come prova</strong>, e un modello non può limitarsi a dire "buona osservazione", ma deve spiegare perché ha cambiato idea.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Risultati: Migliore modalità Solo vs. Dibattito</h3><table>
<thead>
<tr><th>Modalità</th><th>L2 (10 casi)</th><th>L3 (5 casi)</th><th>Rilevamento totale</th></tr>
</thead>
<tbody>
<tr><td>Miglior individuo (Raw Claude)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Dibattito (tutti e cinque i modelli)</td><td>7/10 (raddoppiato)</td><td>5/5 (tutti presi)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">Cosa si distingue</h3><p><strong>1. Il rilevamento di L2 è raddoppiato.</strong> I bug di routine, di media difficoltà, sono passati da 3/10 a 7/10. Questi sono i bug che appaiono più frequentemente nelle basi di codice reali e sono esattamente la categoria in cui i singoli modelli sbagliano in modo incoerente. Il contributo maggiore del meccanismo di discussione è quello di colmare queste lacune quotidiane.</p>
<p><strong>2. Bug L3: zero errori.</strong> Nell'esecuzione di un singolo modello, solo Claude ha individuato tutti e cinque i bug a livello di sistema L3. In modalità di discussione, il gruppo ha eguagliato questo risultato, il che significa che non è più necessario puntare sul modello giusto per ottenere una copertura completa di L3.</p>
<p><strong>3. Il dibattito colma i punti ciechi piuttosto che alzare il tetto.</strong> I bug a livello di sistema non erano la parte più difficile per l'individuo più forte. Claude li aveva già. Il contributo principale del meccanismo di dibattito è quello di correggere la debolezza di Claude nei bug di routine L2, dove il singolo Claude ne ha individuati solo 3 su 10, ma il gruppo di discussione ne ha individuati 7. È qui che si verifica il 53% → di copertura L3. Ecco da dove deriva il salto del 53% → 80%.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">Come si presenta il dibattito nella pratica</h3><p>I numeri di cui sopra dimostrano che il dibattito funziona, ma un esempio concreto mostra <em>perché</em> funziona. Ecco una sintesi di come i cinque modelli hanno gestito la <strong>PR #44474</strong>, che ha introdotto il caricamento pigro delle chiavi primarie durante la ricerca.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> Un'ottimizzazione del caricamento pigro che ha cambiato la ricerca per recuperare le chiavi primarie su richiesta invece di caricarle tutte in anticipo.</p>
<p><strong>Primo round</strong></p>
<p>Gemini ha aperto in modo aggressivo:</p>
<p>"Questa PR è un campo minato di cattive pratiche, potenziali comportamenti non definiti e regressioni delle prestazioni mascherate da "ottimizzazione"".</p>
<p>Claude e Qwen si sono concentrati sul comportamento indefinito e sulle prestazioni, convergendo sulla stessa preoccupazione:</p>
<p>"Il modello di memoria del C++ non garantisce la sicurezza delle scritture simultanee su indici diversi dello stesso vettore senza un'adeguata sincronizzazione".</p>
<p>Tutti e tre hanno trovato problemi reali, ma nessuno di loro ha colto il bug più profondo. Poi Codex, che aveva a malapena parlato, ha segnalato qualcosa che agli altri era sfuggito: il vettore <code translate="no">primary_keys_</code> viene ridimensionato, ma solo le posizioni che passano attraverso la fase di riduzione vengono effettivamente popolate. Tutte le altre posizioni rimangono a valore zero.</p>
<p><strong>Secondo round</strong></p>
<p>Claude raccolse la scoperta di Codex e ne tracciò la conseguenza a valle:</p>
<p>"L'ho trovato: <code translate="no">SortEqualScoresByPks</code> viene eseguito prima di <code translate="no">ReduceResultData</code>. Quindi, quando <code translate="no">SortEqualScoresByPks</code> viene eseguito, non sono ancora state recuperate le PK in modo pigro. L'intero vettore <code translate="no">primary_keys_</code> è pieno di valori PkType costruiti di default".</p>
<p>In parole povere, la funzione di ordinamento viene eseguita prima che le chiavi siano state caricate, quindi ordina degli zeri. Claude ha riconosciuto apertamente la mancanza:</p>
<p>"codex-cli ha identificato un vero e proprio bug critico di correttezza. Mi è sfuggito nel mio primo giro".</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Quale combinazione di modelli può trovare il maggior numero di bug?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Il salto dal 53% all'80% è avvenuto perché cinque modelli hanno coperto i rispettivi punti ciechi. Ma non tutti possono permettersi di configurare ed eseguire cinque modelli in cinque round di discussione per ogni revisione del codice.</p>
<p><strong>Ho quindi provato la versione più semplice: se si possono eseguire solo due modelli, quale coppia si avvicina di più al tetto massimo di più modelli?</strong></p>
<p>Ho usato le prove <strong>assistite dal contesto (R1)</strong> e ho contato quanti dei 15 bug noti ha trovato ciascun modello:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>Ciò che conta, quindi, non è solo il numero di bug individuati da ciascun modello, ma anche <em>quali</em> bug non vengono individuati. Degli 8 bug mancati da Claude, Gemini ne ha individuati 3: una concurrency race condition, un problema di compatibilità con le API di cloud storage e un controllo di autorizzazione mancante. Nell'altra direzione, Gemini non ha individuato la maggior parte dei bug relativi alle strutture dati e alla logica profonda, mentre Claude li ha individuati quasi tutti. I loro punti deboli si sovrappongono appena, il che li rende una coppia forte.</p>
<table>
<thead>
<tr><th>Accoppiamento di due modelli</th><th>Copertura combinata</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Tutti e cinque i modelli insieme hanno coperto 11 su 15, lasciando 4 bug che ogni modello ha mancato.</p>
<p><strong>Claude + Gemini,</strong> come coppia di due modelli, raggiunge già il 91% del tetto massimo di cinque modelli. Per questo benchmark, è la combinazione più efficiente.</p>
<p>Detto questo, Claude + Gemini non è la combinazione migliore per ogni tipo di bug. Quando ho scomposto i risultati per categoria di bug, è emerso un quadro più sfumato:</p>
<table>
<thead>
<tr><th>Tipo di bug</th><th>Totale</th><th>Claude</th><th>Gemelli</th><th>Codice</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Lacune di convalida</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Ciclo di vita della struttura dati</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Gare di concomitanza</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Compatibilità</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Logica profonda</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Totale</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>La suddivisione per tipo di bug rivela perché nessuna accoppiata è universalmente la migliore.</p>
<ul>
<li><p>Per i bug relativi al ciclo di vita delle strutture dati, Claude e MiniMax sono in parità a 3/4.</p></li>
<li><p>Per quanto riguarda le lacune nella validazione, Claude e Qwen sono a pari merito a 3/4.</p></li>
<li><p>Per quanto riguarda i problemi di concorrenza e compatibilità, Claude ha ottenuto un punteggio pari a zero in entrambi i casi e Gemini è quello che colma queste lacune.</p></li>
<li><p>Nessun modello copre tutto, ma Claude copre la gamma più ampia e si avvicina di più a un modello generalista.</p></li>
</ul>
<p>Tutti i modelli non hanno individuato quattro bug. Uno riguardava la priorità delle regole grammaticali ANTLR. Uno riguardava la mancata corrispondenza semantica dei blocchi di lettura/scrittura tra le funzioni. Uno richiedeva la comprensione delle differenze di logica aziendale tra i tipi di compattazione. E uno era un errore di confronto silenzioso in cui una variabile utilizzava i megabyte e un'altra i byte.</p>
<p>Ciò che accomuna questi quattro casi è la correttezza sintattica del codice. I bug risiedono nelle ipotesi che lo sviluppatore aveva in testa, non nel diff e nemmeno nel codice circostante. Questo è più o meno il punto in cui la revisione del codice da parte dell'intelligenza artificiale raggiunge il suo limite oggi.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Dopo aver trovato i bug, qual è il modello migliore per risolverli?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella revisione del codice, trovare i bug è metà del lavoro. L'altra metà è correggerli. Per questo motivo, dopo i round di discussione, ho aggiunto una valutazione tra pari per misurare l'effettiva utilità dei suggerimenti di correzione di ciascun modello.</p>
<p>Per misurare questo aspetto, ho aggiunto un round di valutazione tra pari dopo il dibattito. Ogni modello ha aperto una nuova sessione e ha agito come giudice anonimo, assegnando un punteggio alle recensioni degli altri modelli. I cinque modelli sono stati mappati in modo casuale sul recensore A/B/C/D/E, in modo che nessun giudice sapesse quale modello aveva prodotto quale recensione. Ogni giudice ha assegnato un punteggio su quattro dimensioni, valutate da 1 a 10: accuratezza, agibilità, profondità e chiarezza.</p>
<table>
<thead>
<tr><th>Modello</th><th>Accuratezza</th><th>Agibilità</th><th>Profondità</th><th>Chiarezza</th><th>Complessivamente</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (a pari merito con il 1°)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (a pari merito con il 1°)</td></tr>
<tr><td>Codice</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Gemelli</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen e Claude si sono aggiudicati il primo posto con un netto margine. Entrambi hanno ottenuto punteggi costantemente alti in tutte e quattro le dimensioni, mentre Codex, Gemini e MiniMax si sono posizionati un punto in più o in meno. In particolare, Gemini, che si è rivelato prezioso come partner per la ricerca di bug per Claude nell'analisi dell'accoppiamento, si posiziona in fondo alla classifica della qualità delle revisioni. Essere bravi a individuare i problemi ed essere bravi a spiegare come risolverli sono evidentemente abilità diverse.</p>
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
    </button></h2><p><strong>Claude</strong> è quello a cui affidare le revisioni più difficili. Lavora attraverso intere catene di chiamate, segue percorsi logici profondi e inserisce il proprio contesto senza bisogno di essere imitato. Per quanto riguarda i bug a livello di sistema L3, nessun altro si avvicina. A volte è troppo sicuro di sé con la matematica, ma quando un altro modello dimostra che si sbaglia, lo riconosce e spiega dove il suo ragionamento si è interrotto. Usatelo per il codice principale e per i bug che non potete permettervi di perdere.</p>
<p><strong>Il Gemelli</strong> si fa sentire. Ha opinioni forti sullo stile del codice e sugli standard ingegneristici, ed è veloce nell'inquadrare i problemi dal punto di vista strutturale. L'aspetto negativo è che spesso rimane in superficie e non scava abbastanza in profondità, motivo per cui ha ottenuto un punteggio basso nella valutazione dei colleghi. Dove Gemini si guadagna davvero il posto è come sfidante: il suo pushback costringe gli altri modelli a ricontrollare il loro lavoro. È da abbinare a Claude per la prospettiva strutturale che Claude a volte tralascia.</p>
<p><strong>Codex</strong> dice a malapena una parola. Ma quando lo fa, conta. Il suo tasso di successo sui bug reali è alto e ha la capacità di cogliere l'aspetto che tutti gli altri hanno ignorato. Nell'esempio del PR #44474, Codex è stato il modello che ha individuato il problema delle chiavi primarie a valore zero che ha dato il via all'intera catena. Consideratelo come un revisore supplementare che cattura ciò che il vostro modello principale non ha notato.</p>
<p><strong>Qwen</strong> è il più completo dei cinque. La qualità delle sue recensioni è pari a quella di Claude, ed è particolarmente bravo a mettere insieme prospettive diverse in suggerimenti di correzione su cui si può agire. Inoltre, ha registrato il più alto tasso di rilevamento di L2 in modalità assistita dal contesto, il che lo rende una solida opzione predefinita per le recensioni PR di tutti i giorni. L'unico punto debole: nei dibattiti lunghi e a più riprese, a volte perde di vista il contesto precedente e inizia a dare risposte incoerenti nei turni successivi.</p>
<p><strong>MiniMax</strong> è stato il più debole nel trovare i bug da solo. È meglio utilizzarlo per completare un gruppo multi-modello piuttosto che come esaminatore indipendente.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Limitazioni di questo esperimento<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Alcuni avvertimenti per mantenere questo esperimento in prospettiva:</p>
<p><strong>La dimensione del campione è piccola.</strong> Ci sono solo 15 PR, tutti provenienti dallo stesso progetto Go/C++ (Milvus). Questi risultati non sono generalizzabili a tutti i linguaggi o codebase. Considerateli come indicativi, non definitivi.</p>
<p><strong>I modelli sono intrinsecamente casuali.</strong> Eseguire due volte lo stesso prompt può produrre risultati diversi. I numeri riportati in questo post rappresentano una singola istantanea, non un valore atteso stabile. Le classifiche dei singoli modelli devono essere prese alla leggera, anche se le tendenze più ampie (il dibattito supera i singoli, diversi modelli eccellono in diversi tipi di bug) sono coerenti.</p>
<p><strong>L'ordine di parola è stato corretto.</strong> Il dibattito ha utilizzato lo stesso ordine in tutti i round, il che potrebbe aver influenzato la risposta dei modelli che parlano più tardi. Un esperimento futuro potrebbe randomizzare l'ordine per ogni round per controllare questo aspetto.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Prova tu stesso<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Tutti gli strumenti e i dati di questo esperimento sono open source:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Uno strumento open-source che raccoglie il contesto del codice (catene di chiamate, PR correlate, moduli interessati) e orchestra il dibattito multi-modello per la revisione del codice.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: L'intera pipeline di valutazione, le configurazioni e gli script.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Casi di test</strong></a>: Tutte le 15 PR con bug noti annotati.</p></li>
</ul>
<p>I bug di questo esperimento provengono tutti da richieste di pull reali in <a href="https://github.com/milvus-io/milvus">Milvus</a>, un database vettoriale open-source costruito per applicazioni di intelligenza artificiale. Abbiamo una comunità piuttosto attiva su <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> e <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, e ci piacerebbe che più persone si dedicassero al codice. E se finite per eseguire questo benchmark sulla vostra base di codice, condividete i risultati! Sono davvero curioso di sapere se le tendenze si confermano in diversi linguaggi e progetti.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continua a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: quale modello si adatta al vostro stack di agenti AI?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Aggiungere memoria persistente al codice Claude con il plugin leggero memsearch</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso disponibile (memsearch)</a></p></li>
</ul>

---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Riflessioni su ChatGPT e sui sistemi di memoria di Claude: Cosa serve per
  abilitare il recupero conversazionale on-demand
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Scoprite come ChatGPT e Claude progettano la memoria in modo diverso, perché
  il recupero conversazionale su richiesta è difficile e come Milvus 2.6 lo
  consente su scala produttiva.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>Nei sistemi di agenti di intelligenza artificiale di alta qualità, la progettazione della memoria è molto più complessa di quanto sembri a prima vista. In sostanza, deve rispondere a tre domande fondamentali: Come deve essere memorizzata la cronologia delle conversazioni? Quando deve essere recuperato il contesto passato? E che cosa, esattamente, deve essere recuperato?</p>
<p>Queste scelte determinano direttamente la latenza di risposta di un agente, l'utilizzo delle risorse e, in ultima analisi, il suo limite di capacità.</p>
<p>Modelli come ChatGPT e Claude si sentono sempre più "consapevoli della memoria" quanto più li usiamo. Ricordano le preferenze, si adattano agli obiettivi a lungo termine e mantengono la continuità tra le sessioni. In questo senso, funzionano già come mini-agenti di intelligenza artificiale. Tuttavia, sotto la superficie, i loro sistemi di memoria si basano su presupposti architettonici molto diversi.</p>
<p>Recenti analisi di reverse-engineering dei <a href="https://manthanguptaa.in/posts/claude_memory/">meccanismi di memoria</a> di <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>e <a href="https://manthanguptaa.in/posts/claude_memory/">Claude</a> rivelano un chiaro contrasto. <strong>ChatGPT</strong> si basa sull'iniezione di contesto precalcolato e sulla cache a strati per offrire una continuità leggera e prevedibile. <strong>Claude,</strong> invece, adotta il recupero on-demand in stile RAG con aggiornamenti dinamici della memoria per bilanciare la profondità della memoria e l'efficienza.</p>
<p>Questi due approcci non sono solo preferenze progettuali, ma anche capacità infrastrutturali. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a> introduce la combinazione di recupero ibrido denso-sparso, filtraggio scalare efficiente e archiviazione a livelli che la memoria conversazionale on-demand richiede, rendendo il recupero selettivo abbastanza veloce ed economico da essere implementato nei sistemi del mondo reale.</p>
<p>In questo post spiegheremo come funzionano i sistemi di memoria di ChatGPT e di Claude, perché si sono discostati dal punto di vista architetturale e come i recenti progressi di sistemi come Milvus rendono il recupero conversazionale on-demand pratico su scala.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">Il sistema di memoria di ChatGPT<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Invece di interrogare un database vettoriale o di recuperare dinamicamente le conversazioni passate al momento dell'inferenza, ChatGPT costruisce la sua "memoria" assemblando un insieme fisso di componenti del contesto e iniettandoli direttamente in ogni messaggio. Ogni componente è preparato in anticipo e occupa una posizione nota nel messaggio.</p>
<p>Questo design mantiene intatte la personalizzazione e la continuità della conversazione, rendendo al contempo più prevedibili la latenza, l'uso dei token e il comportamento del sistema. In altre parole, la memoria non è qualcosa che il modello cerca al volo, ma è qualcosa che il sistema confeziona e consegna al modello ogni volta che genera una risposta.</p>
<p>Ad alto livello, un prompt ChatGPT completo è costituito dai seguenti livelli, ordinati dal più globale al più immediato:</p>
<p>[0] Istruzioni del sistema</p>
<p>[1] Istruzioni per lo sviluppatore</p>
<p>[2] Metadati della sessione (effimeri)</p>
<p>[3] Memoria dell'utente (fatti a lungo termine)</p>
<p>[4] Riepilogo delle conversazioni recenti (chat passate, titoli + frammenti)</p>
<p>[5] Messaggi della sessione corrente (questa chat)</p>
<p>[6] Il vostro ultimo messaggio</p>
<p>Tra questi, i componenti da [2] a [5] formano la memoria effettiva del sistema, ciascuno con un ruolo distinto.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Metadati di sessione</h3><p>I metadati di sessione rappresentano informazioni di breve durata, non persistenti, che vengono iniettate una volta all'inizio di una conversazione e scartate al termine della sessione. Il suo ruolo è quello di aiutare il modello ad adattarsi al contesto d'uso corrente, piuttosto che personalizzare il comportamento a lungo termine.</p>
<p>Questo livello acquisisce segnali sull'ambiente immediato dell'utente e sui modelli di utilizzo recenti. I segnali tipici includono:</p>
<ul>
<li><p><strong>Informazioni sul dispositivo</strong>, ad esempio se l'utente si trova su un cellulare o su un desktop.</p></li>
<li><p><strong>Attributi dell'account</strong>, come il livello di abbonamento (ad esempio, ChatGPT Go), l'età dell'account e la frequenza di utilizzo complessiva.</p></li>
<li><p><strong>Metriche comportamentali</strong>, tra cui i giorni di attività negli ultimi 1, 7 e 30 giorni, la lunghezza media delle conversazioni e la distribuzione dell'utilizzo del modello (ad esempio, il 49% delle richieste gestite da GPT-5).</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Memoria utente</h3><p>La memoria utente è il livello di memoria persistente e modificabile che consente la personalizzazione delle conversazioni. Memorizza informazioni relativamente stabili, come il nome dell'utente, il ruolo o gli obiettivi di carriera, i progetti in corso, i risultati ottenuti in passato e le preferenze di apprendimento, e viene iniettata in ogni nuova conversazione per mantenere la continuità nel tempo.</p>
<p>Questa memoria può essere aggiornata in due modi:</p>
<ul>
<li><p><strong>Gli aggiornamenti espliciti</strong> avvengono quando gli utenti gestiscono direttamente la memoria con istruzioni come "ricorda questo" o "rimuovi questo dalla memoria".</p></li>
<li><p><strong>Gli aggiornamenti impliciti</strong> avvengono quando il sistema identifica le informazioni che soddisfano i criteri di memorizzazione di OpenAI, come un nome confermato o un titolo di lavoro, e le salva automaticamente, in base al consenso e alle impostazioni di memoria predefinite dell'utente.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Riepilogo delle conversazioni recenti</h3><p>Il riepilogo delle conversazioni recenti è un livello di contesto leggero e trasversale alle sessioni che preserva la continuità senza riprodurre o recuperare le cronologie complete delle chat. Invece di affidarsi al recupero dinamico, come negli approcci tradizionali basati su RAG, questo riepilogo viene precalcolato e iniettato direttamente in ogni nuova conversazione.</p>
<p>Questo livello riassume solo i messaggi degli utenti, escludendo le risposte degli assistenti. Le sue dimensioni sono intenzionalmente limitate (tipicamente circa 15 voci) e conserva solo segnali di alto livello sugli interessi recenti, piuttosto che contenuti dettagliati. Poiché non si basa su embeddings o sulla ricerca di similarità, mantiene bassi sia la latenza che il consumo di token.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Messaggi della sessione corrente</h3><p>I messaggi della sessione corrente contengono l'intera cronologia dei messaggi della conversazione in corso e forniscono il contesto a breve termine necessario per ottenere risposte coerenti, svolta per svolta. Questo livello include sia gli input dell'utente che le risposte dell'assistente, ma solo finché la sessione rimane attiva.</p>
<p>Poiché il modello opera entro un limite fisso di token, questa cronologia non può crescere all'infinito. Quando il limite viene raggiunto, il sistema elimina i messaggi più vecchi per fare spazio a quelli più recenti. Questo troncamento riguarda solo la sessione corrente: la memoria a lungo termine dell'utente e il riepilogo delle conversazioni recenti rimangono intatti.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">Il sistema di memoria di Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude adotta un approccio diverso alla gestione della memoria. Piuttosto che iniettare un grande pacchetto fisso di componenti di memoria in ogni prompt, come fa ChatGPT, Claude combina la memoria persistente dell'utente con strumenti su richiesta e un recupero selettivo. Il contesto storico viene recuperato solo quando il modello lo giudica rilevante, consentendo al sistema di bilanciare la profondità del contesto con il costo computazionale.</p>
<p>Il contesto del prompt di Claude è strutturato come segue:</p>
<p>[0] prompt del sistema (istruzioni statiche)</p>
<p>[1] Memorie dell'utente</p>
<p>[2] Storia della conversazione</p>
<p>[3] Messaggio corrente</p>
<p>Le differenze principali tra Claude e ChatGPT risiedono nel <strong>modo in cui viene recuperata la cronologia delle conversazioni</strong> e nel <strong>modo in cui la memoria utente viene aggiornata e mantenuta</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Memorie dell'utente</h3><p>In Claude, le memorie dell'utente costituiscono un livello di contesto a lungo termine simile alla memoria dell'utente di ChatGPT, ma con una maggiore enfasi sugli aggiornamenti automatici, guidati dal background. Queste memorie sono memorizzate in un formato strutturato (avvolto in tag di tipo XML) e sono progettate per evolvere gradualmente nel tempo con un intervento minimo da parte dell'utente.</p>
<p>Claude supporta due percorsi di aggiornamento:</p>
<ul>
<li><p><strong>Aggiornamenti impliciti</strong> - Il sistema analizza periodicamente il contenuto delle conversazioni e aggiorna la memoria in background. Questi aggiornamenti non vengono applicati in tempo reale e le memorie associate alle conversazioni cancellate vengono gradualmente eliminate come parte dell'ottimizzazione in corso.</p></li>
<li><p><strong>Aggiornamenti espliciti</strong> - Gli utenti possono gestire direttamente la memoria attraverso comandi quali "ricorda questo" o "cancella questo", che vengono eseguiti tramite uno strumento dedicato <code translate="no">memory_user_edits</code>.</p></li>
</ul>
<p>Rispetto a ChatGPT, Claude attribuisce al sistema stesso una maggiore responsabilità nel perfezionare, aggiornare e sfoltire la memoria a lungo termine. Questo riduce la necessità per gli utenti di curare attivamente ciò che viene memorizzato.</p>
<h3 id="Conversation-History" class="common-anchor-header">Cronologia delle conversazioni</h3><p>Per la cronologia delle conversazioni, Claude non si affida a un riassunto fisso che viene inserito in ogni messaggio. Al contrario, recupera il contesto passato solo quando il modello lo ritiene necessario, utilizzando tre meccanismi distinti. In questo modo si evita di portare avanti una cronologia irrilevante e si tiene sotto controllo l'uso dei token.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Componente</strong></th><th style="text-align:center"><strong>Scopo</strong></th><th style="text-align:center"><strong>Come viene utilizzato</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Finestra mobile (conversazione corrente)</strong></td><td style="text-align:center">Memorizza la cronologia completa dei messaggi della conversazione corrente (non un riassunto), simile al contesto di sessione di ChatGPT.</td><td style="text-align:center">Iniettato automaticamente. Il limite dei token è di ~190K; i messaggi più vecchi vengono eliminati una volta raggiunto il limite.</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>strumento</strong></td><td style="text-align:center">Cerca le conversazioni passate per argomento o parola chiave, restituendo link alle conversazioni, titoli ed estratti di messaggi dell'utente/assistente.</td><td style="text-align:center">Viene attivato quando il modello determina che sono necessari dettagli storici. I parametri includono <code translate="no">query</code> (termini di ricerca) e <code translate="no">max_results</code> (1-10).</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>strumento</strong></td><td style="text-align:center">Recupera le conversazioni recenti all'interno di un intervallo di tempo specificato (per esempio, "ultimi 3 giorni"), con risultati formattati come <code translate="no">conversation_search</code></td><td style="text-align:center">Viene attivato quando il contesto recente, in ordine temporale, è rilevante. I parametri includono <code translate="no">n</code> (numero di risultati), <code translate="no">sort_order</code> e l'intervallo di tempo.</td></tr>
</tbody>
</table>
<p>Tra questi componenti, <code translate="no">conversation_search</code> è particolarmente degno di nota. Riesce a far emergere risultati rilevanti anche per query non formulate o multilingue, indicando che opera a livello semantico piuttosto che basarsi sulla semplice corrispondenza delle parole chiave. Probabilmente si tratta di un recupero basato sull'embedding o di un approccio ibrido che prima traduce o normalizza la query in una forma canonica e poi applica un recupero per parole chiave o ibrido.</p>
<p>Nel complesso, l'approccio di Claude al recupero su richiesta ha diversi punti di forza degni di nota:</p>
<ul>
<li><p>Il<strong>recupero non è automatico</strong>: Le chiamate allo strumento sono attivate dal giudizio del modello stesso. Ad esempio, quando un utente fa riferimento a <em>"il progetto di cui abbiamo discusso l'ultima volta",</em> Claude può decidere di invocare <code translate="no">conversation_search</code> per recuperare il contesto pertinente.</p></li>
<li><p><strong>Contesto più ricco quando necessario</strong>: I risultati recuperati possono includere <strong>estratti delle risposte dell'assistente</strong>, mentre i riassunti di ChatGPT catturano solo i messaggi dell'utente. Questo rende Claude più adatto ai casi d'uso che richiedono un contesto di conversazione più profondo o più preciso.</p></li>
<li><p><strong>Migliore efficienza per impostazione predefinita</strong>: Poiché il contesto storico non viene iniettato se non necessario, il sistema evita di trasportare grandi quantità di storia irrilevante, riducendo il consumo di token non necessari.</p></li>
</ul>
<p>I compromessi sono altrettanto chiari. L'introduzione del recupero on-demand aumenta la complessità del sistema: gli indici devono essere costruiti e mantenuti, le query eseguite, i risultati classificati e talvolta ri-classificati. Anche la latenza end-to-end diventa meno prevedibile rispetto a un contesto precalcolato e sempre iniettato. Inoltre, il modello deve imparare a decidere quando è necessario il recupero. Se questo giudizio fallisce, il contesto rilevante potrebbe non essere mai recuperato.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">I vincoli del recupero su richiesta in stile Claude<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>L'adozione di un modello di recupero su richiesta rende il database vettoriale una parte critica dell'architettura. Il recupero delle conversazioni pone requisiti insolitamente elevati sia per l'archiviazione che per l'esecuzione delle query, e il sistema deve soddisfare quattro vincoli allo stesso tempo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Tolleranza alla bassa latenza</h3><p>Nei sistemi di conversazione, la latenza di P99 deve rimanere al di sotto di ~ 20 ms. Ritardi superiori a questa soglia sono immediatamente percepiti dagli utenti. Questo lascia poco spazio all'inefficienza: la ricerca vettoriale, il filtraggio dei metadati e la classificazione dei risultati devono essere ottimizzati con cura. Un collo di bottiglia in qualsiasi punto può degradare l'intera esperienza di conversazione.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Requisiti per la ricerca ibrida</h3><p>Le richieste degli utenti spesso si estendono su più dimensioni. Una richiesta come <em>"discussioni su RAG dell'ultima settimana"</em> combina la rilevanza semantica con il filtraggio basato sul tempo. Se un database supporta solo la ricerca vettoriale, potrebbe restituire 1.000 risultati simili dal punto di vista semantico, solo che il filtro del livello applicativo li ridurrebbe a una manciata, sprecando la maggior parte della computazione. Per essere pratico, il database deve supportare in modo nativo query combinate vettoriali e scalari.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Separazione tra archiviazione e calcolo</h3><p>La cronologia delle conversazioni presenta un chiaro modello di accesso caldo-freddo. Le conversazioni recenti vengono interrogate frequentemente, mentre quelle più vecchie vengono toccate raramente. Se tutti i vettori dovessero rimanere in memoria, la memorizzazione di decine di milioni di conversazioni consumerebbe centinaia di gigabyte di RAM, un costo impraticabile su scala. Per essere redditizio, il sistema deve supportare la separazione storage-compute, mantenendo i dati caldi in memoria e quelli freddi nell'object storage, con vettori caricati su richiesta.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Schemi di interrogazione diversi</h3><p>Il recupero delle conversazioni non segue un unico modello di accesso. Alcune query sono puramente semantiche (per esempio, <em>"l'ottimizzazione delle prestazioni di cui abbiamo discusso")</em>, altre sono puramente temporali (<em>"tutte le conversazioni dell'ultima settimana")</em> e molte combinano più vincoli (<em>"discussioni relative a Python che menzionano FastAPI negli ultimi tre mesi")</em>. Il pianificatore di query di database deve adattare le strategie di esecuzione ai diversi tipi di query, piuttosto che affidarsi a una ricerca bruta e uguale per tutti.</p>
<p>Insieme, queste quattro sfide definiscono i vincoli fondamentali del recupero conversazionale. Qualsiasi sistema che voglia implementare il reperimento on-demand in stile Claude deve affrontarle tutte in modo coordinato.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Perché Milvus 2.6 funziona bene per il recupero conversazionale<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Le scelte progettuali di <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a> si allineano strettamente ai requisiti fondamentali del recupero conversazionale on-demand. Qui di seguito sono descritte le principali funzionalità e il modo in cui si adattano alle reali esigenze di recupero conversazionale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Recupero ibrido con vettori densi e sparsi</h3><p>Milvus 2.6 supporta in modo nativo la memorizzazione di vettori densi e radi all'interno della stessa collezione e la fusione automatica dei loro risultati al momento dell'interrogazione. I vettori densi (ad esempio, gli embeddings a 768 dimensioni generati da modelli come BGE-M3) catturano la somiglianza semantica, mentre i vettori radi (tipicamente prodotti da BM25) conservano i segnali esatti delle parole chiave.</p>
<p>Per una query come <em>"discussioni su RAG della scorsa settimana",</em> Milvus esegue in parallelo il recupero semantico e il recupero delle parole chiave, quindi unisce i risultati attraverso il reranking. Rispetto all'utilizzo di uno dei due approcci da solo, questa strategia ibrida offre un richiamo significativamente più elevato in scenari di conversazione reali.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Separazione storage-computer e ottimizzazione delle query</h3><p>Milvus 2.6 supporta l'archiviazione a livelli in due modi:</p>
<ul>
<li><p>Dati caldi in memoria, dati freddi nell'archiviazione a oggetti.</p></li>
<li><p>Indici in memoria, dati vettoriali grezzi nell'archiviazione a oggetti.</p></li>
</ul>
<p>Con questo design, è possibile memorizzare un milione di voci di conversazione con circa 2 GB di memoria e 8 GB di memoria a oggetti. Con una corretta messa a punto, la latenza di P99 può rimanere al di sotto dei 20 ms, anche con la separazione storage-compute attivata.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">Triturazione JSON e filtraggio scalare veloce</h3><p>Milvus 2.6 abilita il JSON Shredding per impostazione predefinita, appiattendo i campi JSON annidati in una memoria colonnare. Questo migliora le prestazioni del filtraggio scalare di 3-5× secondo i benchmark ufficiali (i guadagni effettivi variano a seconda del modello di query).</p>
<p>Il recupero delle conversazioni richiede spesso il filtraggio di metadati come l'ID utente, l'ID sessione o l'intervallo di tempo. Con JSON Shredding, query come <em>"tutte le conversazioni dell'utente A nell'ultima settimana"</em> possono essere eseguite direttamente sugli indici colonnari, senza analizzare ripetutamente interi blob JSON.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Controllo open-source e flessibilità operativa</h3><p>In quanto sistema open-source, Milvus offre un livello di controllo architettonico e operativo che le soluzioni chiuse e black-box non hanno. I team possono mettere a punto i parametri degli indici, applicare strategie di tiering dei dati e personalizzare le distribuzioni distribuite in base ai carichi di lavoro.</p>
<p>Questa flessibilità abbassa la barriera all'ingresso: i team di piccole e medie dimensioni possono costruire sistemi di recupero conversazionale su scala milionaria o decimilionaria senza dover ricorrere a budget infrastrutturali eccessivi.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Perché ChatGPT e Claude hanno intrapreso strade diverse<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>Ad alto livello, la differenza tra i sistemi di memoria di ChatGPT e Claude si riduce al modo in cui ciascuno di essi gestisce l'oblio. ChatGPT privilegia l'oblio proattivo: una volta che la memoria supera limiti prestabiliti, il contesto più vecchio viene abbandonato. Questo baratta la completezza con la semplicità e la prevedibilità del comportamento del sistema. Claude favorisce l'oblio ritardato. In teoria, la cronologia delle conversazioni può crescere senza limiti, con il richiamo delegato a un sistema di recupero su richiesta.</p>
<p>Perché i due sistemi hanno scelto strade diverse? Con i vincoli tecnici esposti in precedenza, la risposta diventa chiara: <strong>ogni architettura è praticabile solo se l'infrastruttura sottostante è in grado di supportarla</strong>.</p>
<p>Se l'approccio di Claude fosse stato tentato nel 2020, sarebbe stato probabilmente impraticabile. All'epoca, i database vettoriali avevano spesso una latenza di centinaia di millisecondi, le interrogazioni ibride erano scarsamente supportate e l'utilizzo delle risorse scalava in modo proibitivo con la crescita dei dati. In queste condizioni, il recupero on-demand sarebbe stato liquidato come un'eccessiva ingegnerizzazione.</p>
<p>Nel 2025, il panorama è cambiato. I progressi dell'infrastruttura, guidati da sistemi come <strong>Milvus 2.6, hanno</strong>reso praticabile in produzione la separazione storage-compute, l'ottimizzazione delle query, il recupero ibrido denso-sparso e il JSON Shredding. Questi progressi riducono la latenza, controllano i costi e rendono pratico il reperimento selettivo su scala. Di conseguenza, gli strumenti on-demand e la memoria basata sul recupero sono diventati non solo fattibili, ma anche sempre più interessanti, soprattutto come base per i sistemi di tipo agent.</p>
<p>In definitiva, le scelte architettoniche seguono ciò che l'infrastruttura rende possibile.</p>
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
    </button></h2><p>Nei sistemi del mondo reale, la progettazione della memoria non è una scelta binaria tra contesto precalcolato e recupero su richiesta. Le architetture più efficaci sono tipicamente ibride e combinano entrambi gli approcci.</p>
<p>Un modello comune è quello di iniettare le conversazioni recenti attraverso una finestra di contesto scorrevole, memorizzare le preferenze stabili dell'utente come memoria fissa e recuperare la storia più vecchia su richiesta attraverso una ricerca vettoriale. Man mano che un prodotto matura, questo equilibrio può cambiare gradualmente, passando da un contesto prevalentemente precalcolato a un contesto sempre più guidato dal recupero, senza richiedere un reset architetturale dirompente.</p>
<p>Anche quando si inizia con un approccio precalcolato, è importante progettare tenendo conto della migrazione. La memoria deve essere archiviata con chiari identificatori, timestamp, categorie e riferimenti alla fonte. Quando il recupero diventa fattibile, gli embeddings possono essere generati per la memoria esistente e aggiunti a un database vettoriale insieme agli stessi metadati, consentendo di introdurre la logica di recupero in modo incrementale e con il minimo disturbo.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultima versione di Milvus? Unitevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> o inviate problemi su <a href="https://github.com/milvus-io/milvus">GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>

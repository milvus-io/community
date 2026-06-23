---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: >
  Quando sono gli agenti di intelligenza artificiale a svolgere il lavoro, cosa
  perdiamo?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/AI_Agents_Work_blog_cover_1536x1024_565f1739a0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  Gli agenti basati sull’intelligenza artificiale stanno migliorando in termini
  di esecuzione, memoria e standard. Tuttavia, se dovessero eliminare il ciclo
  di apprendimento alla base del lavoro, il giudizio umano potrebbe smettere di
  migliorare.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Gli agenti stanno diventando davvero molto bravi a svolgere il lavoro.</p>
<p>Claude Code è in grado di scrivere e rifattorizzare grandi blocchi di codice. Cursor aiuta gli sviluppatori a muoversi più rapidamente all’interno dei codebase. Devin e altri agenti orientati alle attività cercano di farsi carico di flussi di lavoro più lunghi. Al di fuori della programmazione, gli agenti redigono bozze di e-mail, elaborano documenti, sintetizzano dati, aggiornano i ticket e automatizzano attività ripetitive che in passato richiedevano un intervento umano diretto.</p>
<p>La maggior parte di questi prodotti fa la stessa promessa: fornite all’agente un contesto sufficiente e lui si occuperà di una parte maggiore dell’esecuzione al posto vostro. Questa promessa è utile, ma solleva anche una domanda a cui i prodotti basati su agenti non hanno ancora dato una risposta completa: <strong>quando l’agente svolge una parte maggiore del lavoro, cosa perdiamo?</strong></p>
<p>La risposta non è semplicemente «l’intervento manuale». L’attività potrà anche essere completata, ma l’essere umano potrebbe aver saltato quella parte del processo che un tempo serviva a sviluppare il proprio giudizio: leggere, tracciare, correggere errori, confrontare opzioni, commettere errori e imparare perché una soluzione è migliore di un’altra.</p>
<p>Ciò non significa che gli agenti siano dannosi per l’apprendimento. Significa che i prodotti basati su agenti devono essere progettati tenendo conto dell’apprendimento. Se si limitano a ottimizzare il risultato finale, potrebbero eliminare proprio quell’esperienza che aiuta gli esseri umani a migliorare gli standard da cui dipendono gli agenti.</p>
<p>Un modo utile per riflettere su questo problema è prendere in prestito la scala dell’autonomia dai sistemi di guida autonoma. L’analogia non è perfetta, ma aiuta a distinguere diversi tipi di progresso nei prodotti basati sugli agenti:</p>
<ul>
<li><strong>Gli agenti di livello L1 eseguono compiti.</strong> L’umano fornisce istruzioni e l’agente le mette in pratica.</li>
<li><strong>Gli agenti di livello L2 memorizzano.</strong> Imparano da una sessione all’altra memorizzando preferenze, correzioni e il contesto del progetto.</li>
<li><strong>Gli agenti di livello L3 applicano gli standard.</strong> L’umano definisce regole, vincoli e criteri decisionali invece di guidare ogni singolo passo.</li>
<li><strong>Gli agenti di livello L4 migliorano l’essere umano.</strong> L’agente non si limita a svolgere il lavoro, ma aiuta l’essere umano a preservare e approfondire il proprio giudizio.</li>
</ul>
<p>La maggior parte del settore è ancora concentrata sui primi tre livelli. È comprensibile: esecuzione, memoria e standard sono problemi immediati legati al prodotto. Ma è a livello L4 che emerge il rischio a lungo termine. Se gli esseri umani smettono di migliorare, anche gli standard che guidano gli agenti smettono di migliorare.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">Livello 1: Gli agenti eseguono<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo sviluppo delle applicazioni di IA ha attraversato diversi livelli di astrazione:</p>
<ul>
<li>All’inizio, gli sviluppatori richiamavano un modello tramite un’API: inviavano un testo e ne ricevevano uno in risposta.</li>
<li>Poi è arrivata <strong>l’ingegneria dei prompt</strong>, dove la competenza principale era imparare a porre domande migliori.</li>
<li>Successivamente è arrivata <strong>l’ingegneria del contesto</strong>, in cui il compito è diventato quello di fornire al modello esempi, vincoli e informazioni di base sufficienti per comportarsi in modo utile in una situazione specifica.</li>
<li>Successivamente è arrivata <strong>l’ingegneria dell’harness</strong>: il collegamento dei modelli a strumenti, flussi di lavoro, file, database, browser, terminali e sistemi di produzione.</li>
<li><strong>L'ingegneria degli agenti</strong> si basa su tutto ciò. Invece di chiedere al modello di rispondere a un singolo prompt, gli chiediamo di pianificare i passaggi, scegliere gli strumenti, ispezionare i risultati, riprendersi dagli errori e completare attività in più fasi con meno supervisione.</li>
</ul>
<p>La superficie tecnica continua a cambiare, ma la relazione di base al livello L1 rimane la stessa: <strong>l’umano definisce il compito e l’agente lo esegue.</strong> Ogni interazione è ancora per lo più autonoma. Il compito viene portato a termine, la sessione termina e il compito successivo ricomincia da zero.</p>
<p>Questo livello funziona già abbastanza bene da modificare il comportamento. Gli agenti possono gestire un maggior numero di operazioni con meno intervento manuale. Man mano che diventano più economici, veloci e affidabili, la produttività aumenta mentre i costi diminuiscono.</p>
<p>Ma una maggiore facilità di esecuzione crea un nuovo collo di bottiglia. Ogni sessione parallela richiede ancora un essere umano che spieghi il compito, fornisca il contesto, esamini il risultato, ne valuti la qualità e decida come procedere. L’agente può svolgere il lavoro, ma l’essere umano è ancora responsabile di stabilire se il lavoro sia di buona qualità.</p>
<p><strong>L’esecuzione diventa più economica. Il giudizio diventa più importante.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">L2: Gli agenti ricordano<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>L1 risolve il compito che gli viene presentato. L2 pone una domanda diversa: <strong>l’agente può imparare da questa interazione in modo che la prossima vada meglio?</strong></p>
<p>Un agente L1 puro è privo di stato. Una volta terminata la sessione, il contesto scompare. Il compito successivo riparte da zero. Gli agenti L2 rompono questo schema accumulando esperienza tra una sessione e l’altra. Ricordano le preferenze dell’utente, le convenzioni di progetto, i feedback ricorrenti, le decisioni precedenti e gli schemi di lavoro dell’utente. <strong>L’obiettivo è trasformare l’esperienza generata dall’interazione tra uomo e agente in una risorsa riutilizzabile.</strong></p>
<p>Questo è anche il motivo per cui la memoria dell’agente non dovrebbe essere trattata come un prompt più lungo o una cartella di trascrizioni salvate. Una memoria utile necessita di un’infrastruttura: archiviazione duratura, recupero semantico, deduplicazione, aggiornamenti e un modo per separare il contesto obsoleto dalla conoscenza ancora utile. È qui che il nostro lavoro in <a href="https://zilliz.com/">Zilliz</a> si collega al problema. <a href="https://milvus.io/">Milvus</a> e i servizi gestiti Zilliz Cloud costruiti attorno ad esso vengono spesso utilizzati come livello di recupero per la memoria dell’agente, poiché rendono il contesto passato ricercabile anziché semplicemente archiviato.</p>
<p><strong>Ma la memoria di livello 2 presenta un limite strutturale.</strong> La maggior parte di ciò che gli agenti apprendono in questa fase deriva dal comportamento osservabile: ciò che l’utente ha detto, modificato, accettato, rifiutato o corretto. Un agente può ricordare che avete riscritto un paragrafo, rifiutato un’implementazione o modificato la firma di una funzione. Ma potrebbe non comprenderne il motivo.</p>
<p>Il problema riguardava l’accuratezza, il tono, la manutenibilità, il rischio per la sicurezza, le prestazioni, il posizionamento del prodotto o qualcos’altro? Il comportamento è la superficie visibile del giudizio. Il ragionamento sottostante spesso rimane nascosto.</p>
<p>Questo rende il livello L2 più efficace nel cogliere la conoscenza esplicita rispetto a quella tacita. È in grado di ricordare le regole che avete enunciato direttamente e di memorizzare esempi di decisioni passate. Ma gli esempi non diventano automaticamente principi. L’agente può ricordare ciò che è accaduto senza comprenderne lo standard sottostante.</p>
<p>Questo divario porta al livello L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">Livello 3: Gli agenti applicano gli standard<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta che L1 e L2 iniziano a funzionare, il passo successivo ovvio è il parallelismo.</p>
<p>Se un agente può portare a termine un compito, perché non farne funzionare dieci? Se un agente può imparare da una sessione, perché non aprire molte sessioni e lasciare che producano tutti contemporaneamente? Questa è la logica del “10x engineer” o del “100x engineer”: utilizzare gli agenti per moltiplicare la produzione.</p>
<p>In pratica, il parallelismo comporta un costo proprio. Ogni sessione richiede comunque che l’operatore cambi contesto, comprenda il problema, esamini il lavoro, fornisca un feedback e decida se il risultato è sufficientemente buono. Superato un certo punto, un numero maggiore di agenti smette di essere un vantaggio e inizia a rappresentare un onere.</p>
<p>Non si tratta solo di un problema di flusso di lavoro. È un ostacolo cognitivo. Gli esseri umani non gestiscono le attività parallele come fanno le macchine. Il passaggio da un’attività all’altra consuma attenzione. La memoria di lavoro è limitata. Ogni passaggio aumenta la probabilità di tralasciare dettagli, applicare standard sbagliati o approvare il lavoro troppo in fretta.</p>
<p><strong>Un buon prodotto non dovrebbe scontrarsi con questo limite. Dovrebbe essere progettato tenendone conto.</strong></p>
<p>In L3, l’input passa da «risolvi questo problema specifico in questo modo specifico» a «ecco gli standard che dovresti applicare». L’essere umano smette di essere l’operatore che guida ogni passo e diventa la persona che definisce regole, vincoli, preferenze, standard di qualità e criteri decisionali.</p>
<p>Un utente può comunque guidare un agente attraverso un’attività specifica, ma il valore di tale guida non dovrebbe esaurirsi con la sessione. L’interazione dovrebbe lasciare in eredità uno standard riutilizzabile, non solo una trascrizione. La prossima volta che si presenterà un’attività simile, l’agente dovrebbe applicare lo standard senza chiedere all’essere umano di ricostruire l’intero contesto e formulare nuovamente lo stesso giudizio.</p>
<p>Il settore si sta già muovendo in questa direzione. Molti prodotti per agenti consentono agli utenti di definire regole, istruzioni, memorie, convenzioni di progetto e preferenze comportamentali. La direzione è quella giusta, ma la maggior parte delle implementazioni è ancora agli inizi. Le regole sono spesso testo statico: aggiornate manualmente, frammentate e collegate solo vagamente al ragionamento alla base delle decisioni di un utente.</p>
<p>Il modello più efficace è un modello cognitivo personale aggiornato continuamente: una rappresentazione leggibile da una macchina di come una persona valuta, decide ed effettua compromessi. Dovrebbe codificare preferenze, valori, vincoli, eccezioni, standard e stile decisionale come contesto che gli agenti possano recuperare e applicare.</p>
<p>Anziché limitarsi a memorizzare le conversazioni passate, dovrebbe rendere il pensiero dell’utente leggibile alle macchine.</p>
<p>Il ruolo dell’utente cambia di conseguenza. Anziché spiegare ogni attività partendo da zero, l’utente mantiene il modello perfezionando gli standard, aggiornando le preferenze, correggendo le ipotesi e rendendo esplicito il giudizio implicito. In un certo senso, l’utente sta continuamente «tokenizzando» se stesso: convertendo una parte sempre maggiore del proprio pensiero in una forma utilizzabile dagli agenti.</p>
<p>Quando l’esecuzione è poco onerosa, l’essere umano non ha bisogno di decidere ogni dettaglio di implementazione prima che un’attività abbia inizio. L’essere umano deve definire quale sia il risultato desiderato, cosa sia inaccettabile e come debbano essere gestiti i compromessi.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">L4: Gli agenti preservano l’apprendimento umano<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>I primi tre livelli si concentrano sul far sì che gli agenti servano meglio gli esseri umani. Il livello L4 inverte la domanda: in che modo gli agenti possono aiutare gli esseri umani a migliorare?</strong></p>
<p>Questa è la parte che la maggior parte dei prodotti basati sugli agenti non ha ancora affrontato appieno. Quando gli agenti svolgono una parte maggiore del lavoro al posto nostro, cosa scompare esattamente dal lato umano del ciclo?</p>
<p>A prima vista, perdiamo lo sforzo manuale. Questo è il vantaggio ovvio. Ma potremmo anche perdere tre aspetti meno visibili: la memoria contestualizzata del lavoro, la pratica nel trovare compromessi e il riconoscimento dei modelli che deriva dall’esposizione ripetuta a dettagli complessi.</p>
<p><strong>L’ho percepito direttamente nella programmazione.</strong> Quando scrivevo il codice da solo, ricordavo dove si trovava ogni riga e come funzionava il sistema perché avevo dedicato tempo a leggerlo, a eseguire il debug, a tracciarlo e a correggerlo manualmente. Quel processo non si limitava a produrre codice. Allenava il mio cervello a riconoscere la struttura.</p>
<p>Con Claude Code, il codice viene comunque prodotto, spesso più velocemente. Ma dopo un po’, la mia memoria del sistema non è più così approfondita. Posso sapere cosa fa il sistema, ma non ricordo sempre come ogni parte si sia integrata con le altre. L’esperienza della creazione viene compressa e, con essa, parte dell’apprendimento scompare.</p>
<p>Questo non è un argomento contro gli agenti di programmazione. È un argomento a favore del fatto che i prodotti degli agenti debbano preservare quelle parti del lavoro che sviluppano il giudizio umano.</p>
<p>Lo stesso schema si ripete al di fuori della programmazione. Se un agente redige ogni promemoria strategico, l’essere umano potrebbe perdere la pratica nel strutturare un’argomentazione. Se un agente riassume ogni documento, l’essere umano potrebbe perdere l’abitudine di notare ciò che il riassunto ha tralasciato. Se un agente gestisce ogni decisione operativa, l’essere umano potrebbe smettere di sviluppare l’intuizione che deriva dall’affrontare eccezioni complesse.</p>
<p>Il lavoro scompare. Il risultato rimane. Ma il ciclo di apprendimento potrebbe indebolirsi.</p>
<p>Questo è il problema del livello L4.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">Il giudizio umano è il limite massimo<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa perdita è rilevante perché gli agenti non operano nel vuoto. Un agente è un moltiplicatore, non un sostituto. Lo stesso strumento produce risultati molto diversi nelle mani di un esperto e di un principiante. Un ingegnere senior che utilizza un agente può diventare notevolmente più efficace. Un principiante potrebbe semplicemente produrre più risultati senza sviluppare un giudizio migliore.</p>
<p>Gli agenti amplificano il livello cognitivo esistente dell’utente.</p>
<p>Questo è importante perché il livello L3 dipende dagli esseri umani che definiscono gli standard che gli agenti devono seguire. Ma la qualità di tali standard dipende dalla qualità del giudizio umano. Se l’essere umano smette di migliorare, gli standard alla fine diventano obsoleti. Diventano incompleti, superficiali o disallineati rispetto alla realtà attuale del lavoro.</p>
<p>Il sistema funziona al meglio come un ciclo:</p>
<ul>
<li>Il giudizio umano definisce gli standard.</li>
<li>Gli agenti agiscono nel rispetto di tali standard.</li>
<li>I risultati dell’esecuzione alimentano l’apprendimento umano.</li>
<li>L’apprendimento umano migliora gli standard.</li>
</ul>
<p>Se il ciclo funziona, entrambe le parti migliorano. L’agente agisce in modo più efficace e l’essere umano diventa più abile nel definire cosa significhi “efficace”. Se il ciclo si interrompe, il sistema si degrada. Il giudizio umano ristagna. Gli standard diventano obsoleti. Gli agenti continuano a ottimizzare, ma lo fanno all’interno di un quadro di riferimento che sta lentamente rimanendo indietro.</p>
<p>Ecco perché il giudizio umano rappresenta il limite massimo. Agenti più potenti non eliminano la necessità di esseri umani più capaci. Rendono la qualità del giudizio umano ancora più importante, poiché quel giudizio diventa il quadro di riferimento all’interno del quale l’agente opera.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Perché gli agenti non possono risolvere da soli l’intero problema<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Una risposta è ovvia: gli agenti continueranno a diventare più potenti, quindi forse alla fine genereranno da soli conoscenze migliori, regole migliori e standard migliori.</p>
<p>C’è del vero in questo. Gli agenti sono già abili nel combinare idee, esplorare spazi di soluzione e far emergere percorsi che gli esseri umani potrebbero non aver preso in considerazione. Un modello può produrre frasi, progetti e soluzioni che non sono mai apparse nei suoi dati di addestramento. Può ricombinare schemi tra diversi ambiti e generare alternative utili.</p>
<p>Questo è il vero valore. Ma L4 si occupa di un diverso tipo di creazione. La domanda non è solo chi sia in grado di trovare una risposta migliore, ma chi sia in grado di porre una nuova domanda, riscrivere lo standard o ampliare lo spazio del problema.</p>
<p>Gli agenti sono abili nel generalizzare, combinare e cercare all’interno di una distribuzione esistente. Possono trovare percorsi migliori attraverso un terreno conosciuto, a volte percorsi che gli esseri umani non hanno ancora provato. Ma decidere se il terreno stesso debba essere ridisegnato è un’altra cosa.</p>
<p>Questo tipo di decisione deriva spesso dal contesto umano: i vincoli vissuti, gli interessi personali, la curiosità, l’insoddisfazione e il costo di sbagliare. Una persona può formulare un’ipotesi che viola il quadro di riferimento attuale e verificarla confrontandola con la realtà. Ancora più importante, una persona può avere un motivo per continuare a testarla anche quando l’idea sembra inizialmente sbagliata, rischiosa o inutile.</p>
<p>La geometria non euclidea è un esempio utile. Il passo importante non è stato semplicemente chiedersi: «E se le linee parallele si intersecassero?». Un agente potrebbe generare quella frase. Il passo importante è stato considerare quella strana ipotesi degna di essere indagata, per poi seguirne le conseguenze fino a quando non si è trasformata in un nuovo spazio teorico. Ciò ha richiesto perseveranza, interessi in gioco e un motivo per interessarsi al risultato.</p>
<p>Il modello di creatività di Margaret Boden è utile in questo contesto. Ella distingue tre tipi di creatività:</p>
<ul>
<li><strong>Creatività combinatoria:</strong> combinare idee familiari in modi nuovi.</li>
<li><strong>Creatività esplorativa:</strong> esplorare all’interno di uno spazio concettuale esistente.</li>
<li><strong>Creatività trasformativa:</strong> cambiare le regole dello spazio concettuale stesso.</li>
</ul>
<p>Gli agenti sono già forti nelle prime due modalità. Combinano idee esistenti ed esplorano all’interno di spazi concettuali esistenti. La terza modalità è più difficile. La creatività trasformazionale non dipende solo da una ricerca più veloce. Dipende dal motivo per cui qualcuno sceglie di rifiutare una vecchia regola, accettare il costo del fallimento e continuare a testare un’idea che non si adatta ancora.</p>
<p><strong>L’affermazione più precisa è questa: gli agenti sono più forti nel combinare ed esplorare all’interno di spazi esistenti. Le nuove conoscenze fondamentali, i nuovi spazi di problema e i nuovi quadri di riferimento per il valore dipendono ancora fortemente dagli esseri umani.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Progettare per il ciclo, non solo per il risultato<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Non tutti i prodotti basati su agenti devono risolvere il livello 4. Alcuni prodotti devono solo aiutare gli utenti a portare a termine le attività più rapidamente. Va bene così. Altri necessitano di memoria, standard e una migliore integrazione nel flusso di lavoro.</p>
<p>Ma a livello di ecosistema, alcuni prodotti devono preservare il ciclo di apprendimento. Se ogni prodotto basato su agenti aiuta le persone a svolgere meno lavoro e nessuno le aiuta a continuare ad apprendere dopo che hanno smesso di svolgere direttamente il lavoro, la capacità umana si indebolisce nel tempo. Lo spazio di ottimizzazione per gli agenti smette di espandersi. L’intero sistema rimane limitato dall’attuale livello di giudizio umano.</p>
<p>È qui che la progettazione del prodotto diventa fondamentale. Il livello 4 non consiste semplicemente nel chiedere all’agente di riassumere ciò che ha fatto. Un prodotto di livello 4 utile preserva quelle parti del lavoro che sviluppano il giudizio umano, anche quando l’agente si occupa della maggior parte dell’esecuzione.</p>
<p>In questo contesto, alcuni modelli di prodotto assumono particolare importanza:</p>
<ul>
<li><strong>Preservare i punti chiave di giudizio.</strong> Alcune decisioni dovrebbero rimanere visibili all’essere umano, non perché l’agente non sia in grado di prenderle, ma perché tali decisioni allenano il giudizio. Il prodotto dovrebbe identificare quali momenti sono rilevanti e mantenerli oggetto di deliberazione.</li>
<li><strong>Ricostruire il processo, non solo il risultato.</strong> Un prodotto finito non è sufficiente. Il sistema dovrebbe mettere in evidenza i rami decisionali chiave, i compromessi, i percorsi alternativi e i tentativi falliti. Un utente che vede solo l’output può approvarlo o rifiutarlo. Un utente che vede il percorso di ragionamento può aggiornare il proprio modello mentale.</li>
<li><strong>Supportare l’esplorazione collaborativa.</strong> Quando l’utente è incerto, l’agente non dovrebbe saltare direttamente a una risposta. Dovrebbe aiutare ad ampliare lo spazio del problema: quali dimensioni sono rilevanti, quali presupposti mancano, quali informazioni sono ancora necessarie e quali costi comporta ciascuna opzione.</li>
<li><strong>Metti in discussione le ipotesi umane.</strong> Questo non significa opporsi solo per il gusto di dissentire. Significa riconoscere le lacune o le tensioni nel ragionamento dell’utente e porre domande mirate che rendano visibili tali tensioni.</li>
</ul>
<p>L’obiettivo non è costringere gli esseri umani a riprendere in mano ogni fase manuale. Ciò vanificherebbe lo scopo degli agenti. L’obiettivo è preservare quelle parti del lavoro che trasformano l’esperienza in giudizio.</p>
<p>I prodotti basati sugli agenti non dovrebbero ottimizzare solo i risultati. Dovrebbero ottimizzare il ciclo di feedback: un miglior giudizio umano, standard migliori, una migliore esecuzione da parte degli agenti e un migliore apprendimento umano dai risultati.</p>
<p><strong>Quando gli agenti di IA svolgono il lavoro, non dovremmo perdere il ciclo che ha reso gli esseri umani più bravi in quel lavoro fin dall’inizio.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Ci piacerebbe conoscere la vostra opinione<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Se state sviluppando agenti, mi piacerebbe sapere cosa ne pensate: quali parti del lavoro dovrebbero essere completamente prese in carico dagli agenti e quali dovrebbero rimanere visibili perché aiutano gli esseri umani a migliorare continuamente?</p>

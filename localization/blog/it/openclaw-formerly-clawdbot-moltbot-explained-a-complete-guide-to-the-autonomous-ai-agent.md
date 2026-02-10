---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >-
  OpenClaw (precedentemente Clawdbot e Moltbot) spiegato: Guida completa
  all'agente AI autonomo
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  Guida completa a OpenClaw (Clawdbot/Moltbot): come funziona, istruzioni per la
  configurazione, casi d'uso, Moltbook e avvisi di sicurezza.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (precedentemente noto come Moltbot e Clawdbot) è un agente di intelligenza artificiale open-source che viene eseguito sul vostro computer, si connette attraverso le app di messaggistica che già utilizzate (WhatsApp, Telegram, Slack, Signal e altre) ed esegue azioni per conto vostro: comandi di shell, automazione del browser, e-mail, calendario e operazioni sui file. Uno scheduler heartbeat lo sveglia a un intervallo configurabile, in modo che possa essere eseguito senza essere sollecitato. Ha guadagnato oltre <a href="https://github.com/openclaw/openclaw">100.000</a> stelle GitHub in meno di una settimana dopo il suo lancio alla fine di gennaio 2026, diventando uno dei repository open-source con la crescita più rapida nella storia di GitHub.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ciò che distingue OpenClaw è la sua combinazione: licenza MIT, open-source, local-first (memoria e dati memorizzati come file Markdown sul disco) ed estensibile alla comunità attraverso un formato di abilità portatile. È anche il luogo in cui si stanno svolgendo alcuni degli esperimenti più interessanti nel campo dell'intelligenza artificiale agenziale: l'agente di uno sviluppatore ha negoziato 4.200 dollari di sconto sull'acquisto di un'auto via e-mail mentre dormiva; un altro ha presentato una confutazione legale a un rifiuto dell'assicurazione senza che gli venisse chiesto; e un altro utente ha costruito <a href="https://moltbook.com/">Moltbook</a>, un social network in cui più di un milione di agenti AI interagiscono autonomamente mentre gli esseri umani assistono.</p>
<p>Questa guida spiega tutto quello che c'è da sapere: cos'è OpenClaw, come funziona, cosa può fare nella vita reale, come si relaziona con Moltbook e i rischi di sicurezza ad esso associati.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">Che cos'è OpenClaw?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a> (precedentemente Clawdbot e Moltbot) è un assistente AI autonomo e open-source che gira sul vostro computer e vive nelle vostre app di chat. Gli si parla attraverso WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage o Signal - qualsiasi cosa si usi già - e lui risponde. Ma a differenza di ChatGPT o dell'interfaccia web di Claude, OpenClaw non si limita a rispondere alle domande. Può eseguire comandi di shell, controllare il browser, leggere e scrivere file, gestire il calendario e inviare e-mail, il tutto attivato da un messaggio di testo.</p>
<p>È stato creato per gli sviluppatori e i power user che desiderano un assistente AI personale a cui poter inviare messaggi da qualsiasi luogo, senza sacrificare il controllo sui propri dati o affidarsi a un servizio in hosting.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Funzionalità principali di OpenClaw</h3><ul>
<li><p><strong>Gateway multicanale</strong> - WhatsApp, Telegram, Discord e iMessage con un unico processo di gateway. Possibilità di aggiungere Mattermost e altro ancora con pacchetti di estensione.</p></li>
<li><p><strong>Routing multi-agente</strong> - sessioni isolate per agente, spazio di lavoro o mittente.</p></li>
<li><p><strong>Supporto multimediale</strong>: invio e ricezione di immagini, audio e documenti.</p></li>
<li><p><strong>UI di controllo web</strong> - dashboard del browser per chat, configurazione, sessioni e nodi.</p></li>
<li><p><strong>Nodi mobili</strong> - accoppiamento di nodi iOS e Android con supporto Canvas.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">Cosa rende OpenClaw diverso?</h3><p><strong>OpenClaw è autosufficiente.</strong></p>
<p>Il gateway, gli strumenti e la memoria di OpenClaw risiedono sul vostro computer, non in un SaaS ospitato da un fornitore. OpenClaw memorizza le conversazioni, la memoria a lungo termine e le competenze come semplici file Markdown e YAML sotto il proprio spazio di lavoro e <code translate="no">~/.openclaw</code>. È possibile ispezionarli con qualsiasi editor di testo, eseguirne il backup con Git, esaminarli o cancellarli. I modelli di intelligenza artificiale possono essere ospitati nel cloud (Anthropic, OpenAI, Google) o in locale (tramite Ollama, LM Studio o altri server compatibili con OpenAI), a seconda di come si configura il blocco dei modelli. Se si vuole che tutta l'inferenza rimanga sul proprio hardware, si punta OpenClaw solo su modelli locali.</p>
<p><strong>OpenClaw è completamente autonomo</strong></p>
<p>Il gateway viene eseguito come demone in background (<code translate="no">systemd</code> su Linux, <code translate="no">LaunchAgent</code> su macOS) con un battito cardiaco configurabile: ogni 30 minuti per impostazione predefinita, ogni ora con Anthropic OAuth. A ogni heartbeat, l'agente legge una checklist da <code translate="no">HEARTBEAT.md</code> nell'area di lavoro, decide se un elemento richiede un'azione e invia un messaggio o una risposta a <code translate="no">HEARTBEAT_OK</code> (che il gateway lascia cadere silenziosamente). Anche gli eventi esterni (webhook, cron job, messaggi dei compagni di squadra) attivano il ciclo dell'agente.</p>
<p>L'autonomia dell'agente è una scelta di configurazione. Le policy dello strumento e le approvazioni esecutive regolano le azioni ad alto rischio: si può consentire la lettura delle e-mail ma richiedere l'approvazione prima dell'invio, consentire la lettura dei file ma bloccare le eliminazioni. Se si disattivano queste protezioni, l'agente esegue senza chiedere.</p>
<p><strong>OpenClaw è open-source.</strong></p>
<p>Il nucleo del Gateway ha licenza MIT. È completamente leggibile, forkabile e verificabile. Questo è importante nel contesto: Anthropic ha presentato una denuncia DMCA contro uno sviluppatore che aveva de-obfuscato il client di Claude Code; Codex CLI di OpenAI è Apache 2.0 ma l'interfaccia web e i modelli sono chiusi; Manus è interamente chiuso.</p>
<p>L'ecosistema riflette l'apertura. <a href="https://github.com/openclaw/openclaw">Centinaia di collaboratori</a> hanno costruito competenze - file modulari <code translate="no">SKILL.md</code> con frontmatter YAML e istruzioni in linguaggio naturale - condivise attraverso ClawHub (un registro di competenze che l'agente può cercare automaticamente), repository della comunità o URL diretti. Il formato è portatile, compatibile con le convenzioni di Claude Code e Cursor. Se non esiste un'abilità, è possibile descrivere il compito all'agente e fargliene redigere una.</p>
<p>Questa combinazione di proprietà locale, evoluzione guidata dalla comunità e funzionamento autonomo è il motivo per cui gli sviluppatori sono entusiasti. Per gli sviluppatori che vogliono avere il pieno controllo sui loro strumenti di IA, questo è importante.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">Come funziona OpenClaw sotto il cofano<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Un processo, tutto all'interno</strong></p>
<p>Quando si esegue <code translate="no">openclaw gateway</code>, si avvia un singolo processo Node.js di lunga durata chiamato Gateway. Questo processo rappresenta l'intero sistema: le connessioni ai canali, lo stato delle sessioni, il ciclo dell'agente, le chiamate ai modelli, l'esecuzione degli strumenti, la persistenza della memoria. Non ci sono servizi separati da gestire.</p>
<p>Cinque sottosistemi all'interno di un processo:</p>
<ol>
<li><p><strong>Adattatori di canale</strong> - uno per piattaforma (Baileys per WhatsApp, grammY per Telegram, ecc.). Normalizzano i messaggi in entrata in un formato comune; serializzano le risposte in uscita.</p></li>
<li><p><strong>Gestore della sessione</strong> - risolve l'identità del mittente e il contesto della conversazione. I DM confluiscono in una sessione principale; le chat di gruppo hanno una propria sessione.</p></li>
<li><p><strong>Coda</strong> - serializza le corse per sessione. Se arriva un messaggio a metà sessione, lo trattiene, lo inietta o lo raccoglie per un turno successivo.</p></li>
<li><p><strong>Runtime dell'agente</strong> - assembla il contesto (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, log giornaliero, cronologia delle conversazioni), quindi esegue il ciclo dell'agente: chiama il modello → esegue le chiamate agli strumenti → restituisce i risultati → ripete fino al termine.</p></li>
<li><p><strong>Piano di controllo</strong> - API WebSocket su <code translate="no">:18789</code>. La CLI, l'applicazione macOS, l'interfaccia web e i nodi iOS/Android si collegano tutti qui.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il modello è una chiamata API esterna che può essere eseguita localmente o meno. Tutto il resto - instradamento, strumenti, memoria, stato - vive all'interno di quell'unico processo sulla propria macchina.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per una semplice richiesta, questo ciclo si completa in pochi secondi. Le catene di strumenti in più fasi richiedono più tempo. Il modello è una chiamata API esterna che può essere eseguita o meno localmente, ma tutto il resto - routing, strumenti, memoria, stato - vive all'interno di quell'unico processo sulla vostra macchina.</p>
<p><strong>Stesso ciclo del codice Claude, ma guscio diverso</strong></p>
<p>Il ciclo dell'agente - input → contesto → modello → strumenti → ripetizione → risposta - è lo stesso schema utilizzato da Claude Code. Ogni framework di agenti serio ne esegue una versione. Ciò che differisce è ciò che lo avvolge.</p>
<p>Claude Code lo racchiude in una <strong>CLI</strong>: si digita, si esegue, si esce. OpenClaw lo racchiude in un <strong>demone persistente</strong> collegato a più di 12 piattaforme di messaggistica, con uno scheduler heartbeat, una gestione delle sessioni attraverso i canali e una memoria che persiste tra le esecuzioni, anche quando non si è alla propria scrivania.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Instradamento e Failover dei modelli</strong></p>
<p>OpenClaw è indipendente dai modelli. Si configurano i provider in <code translate="no">openclaw.json</code> e il gateway li instrada di conseguenza, con la rotazione dei profili di autenticazione e una catena di fallback che utilizza un backoff esponenziale quando un provider si blocca. Ma la scelta del modello è importante, perché OpenClaw assembla richieste di grandi dimensioni: istruzioni di sistema, cronologia delle conversazioni, schemi di strumenti, competenze e memoria. Questo carico di contesto è il motivo per cui la maggior parte delle implementazioni utilizza un modello di frontiera come orchestratore principale, con modelli più economici che gestiscono i battiti cardiaci e i compiti dei subagenti.</p>
<p><strong>Trade-off tra cloud e locale</strong></p>
<p>Dal punto di vista del gateway, i modelli cloud e locali sembrano identici: sono entrambi endpoint compatibili con OpenAI. A differire sono i compromessi.</p>
<p>I modelli cloud (Anthropic, OpenAI, Google) offrono un forte ragionamento, ampie finestre di contesto e un uso affidabile degli strumenti. Sono la scelta predefinita per l'orchestratore principale. Il costo varia in base all'utilizzo: gli utenti leggeri spendono 5-20 dollari al mese, gli agenti attivi con frequenti battiti cardiaci e grandi richieste di informazioni hanno in genere un costo di 50-150 dollari al mese e gli utenti potenti non ottimizzati hanno riportato fatture di migliaia di euro.</p>
<p>I modelli locali tramite Ollama o altri server compatibili con OpenAI eliminano il costo per token, ma richiedono hardware - e OpenClaw ha bisogno di almeno 64K token di contesto, il che restringe le opzioni praticabili. Con 14B parametri, i modelli possono gestire semplici automazioni, ma sono marginali per compiti di agente in più fasi; l'esperienza della comunità indica una soglia affidabile di oltre 32B, che richiede almeno 24GB di VRAM. Non si può competere con un modello cloud di frontiera per quanto riguarda il ragionamento o il contesto esteso, ma si ottiene la piena localizzazione dei dati e costi prevedibili.</p>
<p><strong>Cosa offre questa architettura</strong></p>
<p>Poiché tutto passa attraverso un unico processo, il gateway è un'unica superficie di controllo. Quale modello richiamare, quali strumenti consentire, quanto contesto includere, quanta autonomia concedere: tutto configurato in un unico punto. I canali sono disaccoppiati dal modello: scambiate Telegram con Slack o Claude con Gemini e non cambierà nulla. Il cablaggio dei canali, gli strumenti e la memoria rimangono nella vostra infrastruttura; il modello è la dipendenza che puntate verso l'esterno.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">Di quale hardware avete bisogno per far funzionare OpenClaw?</h3><p>Alla fine di gennaio sono circolati dei post che mostravano gli sviluppatori mentre facevano l'unboxing di più Mac Minis - un utente ha postato 40 unità su una scrivania. Anche Logan Kilpatrick di Google DeepMind ha scritto di averne ordinato uno, anche se i requisiti hardware effettivi sono molto più modesti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La documentazione ufficiale indica come requisiti minimi 2 GB di RAM e 2 core della CPU per la chat di base, o 4 GB se si desidera l'automazione del browser. Un VPS da 5 dollari al mese gestisce bene la situazione. Si può anche distribuire su AWS o Hetzner con Pulumi, eseguirlo in Docker su un piccolo VPS o usare un vecchio portatile che prende polvere. Il trend del Mac Mini è stato guidato dalla riprova sociale, non da requisiti tecnici.</p>
<p><strong>Allora perché le persone hanno acquistato hardware dedicato? Per due motivi: isolamento e persistenza.</strong> Quando si concede a un agente autonomo l'accesso alla shell, si vuole una macchina che si possa fisicamente scollegare se qualcosa va storto. E poiché OpenClaw funziona in base a un battito cardiaco, svegliandosi secondo un programma configurabile per agire per conto dell'utente, un dispositivo dedicato significa che è sempre acceso, sempre pronto. Il vantaggio è l'isolamento fisico su un computer che si può scollegare e il tempo di attività senza dipendere dalla disponibilità di un servizio cloud.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">Come installare OpenClaw e iniziare rapidamente a utilizzarlo<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>È necessario <strong>Node 22+</strong>. Se non si è sicuri, consultare <code translate="no">node --version</code>.</p>
<p><strong>Installare la CLI:</strong></p>
<p>Su macOS/Linux:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>Su Windows (PowerShell):</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Eseguire la procedura guidata di onboarding:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>Questa procedura vi guida attraverso l'autenticazione, la configurazione del gateway e, facoltativamente, la connessione di un canale di messaggistica (WhatsApp, Telegram, ecc.). Il flag <code translate="no">--install-daemon</code> registra il gateway come servizio in background, in modo che si avvii automaticamente.</p>
<p><strong>Verificare che il gateway sia in esecuzione:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Aprire la dashboard:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>Si apre l'interfaccia utente di controllo su <code translate="no">http://127.0.0.1:18789/</code>. Da qui è possibile iniziare a chattare con il proprio agente, senza dover configurare alcun canale se si vuole solo fare una prova.</p>
<p><strong>Un paio di cose che vale la pena sapere fin da subito.</strong> Se si desidera eseguire il gateway in primo piano invece che come demone (utile per il debug), è possibile farlo:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>E se avete bisogno di personalizzare la posizione in cui OpenClaw memorizza la sua configurazione e il suo stato, ad esempio se lo state eseguendo come account di servizio o in un contenitore, ci sono tre variabili di env che contano:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - directory di base per la risoluzione del percorso interno</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - sovrascrive la posizione dei file di stato</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - punta a un file di configurazione specifico</p></li>
</ul>
<p>Una volta che il gateway è in funzione e la dashboard è stata caricata, il gioco è fatto. A questo punto, è probabile che vogliate collegare un canale di messaggistica e impostare le approvazioni delle competenze: tratteremo entrambi gli aspetti nelle prossime sezioni.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">Come si colloca OpenClaw rispetto ad altri agenti AI?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>La comunità tecnologica chiama OpenClaw "Claude, ma con le mani". È una rappresentazione vivida, ma non coglie le differenze architettoniche. Diversi prodotti di IA hanno già le "mani": Anthropic ha <a href="https://claude.com/blog/claude-code">Claude Code</a> e <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, OpenAI ha <a href="https://openai.com/codex/">Codex</a> e l'<a href="https://openai.com/index/introducing-chatgpt-agent/">agente ChatGPT</a>, e <a href="https://manus.im/">Manus</a> esiste. Le distinzioni che contano nella pratica sono:</p>
<ul>
<li><p><strong>Dove viene eseguito l'agente</strong> (la vostra macchina o il cloud del provider).</p></li>
<li><p><strong>Come si interagisce con esso</strong> (app di messaggistica, terminale, IDE, UI web)</p></li>
<li><p><strong>Chi possiede lo stato e la memoria a lungo termine</strong> (file locali o account del provider).</p></li>
</ul>
<p>Ad alto livello, OpenClaw è un gateway local-first che vive sul vostro hardware e parla attraverso le app di chat, mentre gli altri sono per lo più agenti ospitati che si guidano da un terminale, un IDE o un'app web/desktop.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Codice Claude</th><th>Codice OpenAI</th><th>Agente ChatGPT</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Open source</td><td>Sì. Gateway principale sotto licenza MIT;</td><td>No.</td><td>No.</td><td>No. No.</td><td>No. SaaS a sorgente chiusa</td></tr>
<tr><td>Interfaccia</td><td>App di messaggistica (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, ecc.)</td><td>Terminale, integrazioni IDE, app web e mobile</td><td>Terminal CLI, integrazioni IDE, Codex Web UI</td><td>Applicazioni web e desktop di ChatGPT (compresa la modalità agente per macOS)</td><td>Dashboard web, operatore browser, integrazioni Slack e app</td></tr>
<tr><td>Obiettivo principale</td><td>Automazione personale e degli sviluppatori attraverso strumenti e servizi</td><td>Sviluppo software e flussi di lavoro DevOps</td><td>Sviluppo software e modifica del codice</td><td>Attività web generiche, ricerca e flussi di lavoro di produttività</td><td>Ricerca, contenuti e automazione web per gli utenti aziendali</td></tr>
<tr><td>Memoria di sessione</td><td>Memoria basata su file (Markdown + log) su disco; plugin opzionali aggiungono memoria semantica / a lungo termine</td><td>Sessioni per progetto con cronologia, più memoria Claude opzionale sull'account</td><td>Stato della sessione in CLI / editor; nessuna memoria utente a lungo termine incorporata</td><td>Esecuzione di un "agente" per attività supportata dalle funzionalità di memoria a livello di account di ChatGPT (se abilitate)</td><td>Memoria a livello di account, lato cloud, per tutte le esecuzioni, ottimizzata per i flussi di lavoro ricorrenti.</td></tr>
<tr><td>Distribuzione</td><td>Gateway/daemon sempre in esecuzione sulla vostra macchina o VPS; chiamate ai fornitori LLM</td><td>Esecuzione sul computer dello sviluppatore come plugin CLI/IDE; tutte le chiamate ai modelli vengono inviate all'API di Anthropic.</td><td>La CLI viene eseguita localmente; i modelli vengono eseguiti tramite l'API di OpenAI o Codex Web.</td><td>Completamente ospitato da OpenAI; la modalità Agente avvia uno spazio di lavoro virtuale dal client ChatGPT</td><td>Completamente ospitato da Manus; gli agenti vengono eseguiti nell'ambiente cloud di Manus.</td></tr>
<tr><td>Pubblico di riferimento</td><td>Sviluppatori e power user che si sentono a proprio agio nel gestire la propria infrastruttura</td><td>Sviluppatori e ingegneri DevOps che lavorano in terminali e IDE</td><td>Sviluppatori che desiderano un agente di codifica nel terminale/IDE</td><td>Lavoratori della conoscenza e team che utilizzano ChatGPT per le attività degli utenti finali</td><td>Utenti e team aziendali che automatizzano flussi di lavoro incentrati sul web</td></tr>
<tr><td>Costo</td><td>Gratuito + chiamata API in base all'utilizzo</td><td>$20-200/mo</td><td>$20-200/mo</td><td>$20-200/mo</td><td>$39-199/mo (crediti)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Applicazioni reali di OpenClaw<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Il valore pratico di OpenClaw deriva dalla sua portata. Ecco alcune delle cose più interessanti che le persone hanno costruito con esso, a partire da un bot di supporto che abbiamo distribuito per la comunità Milvus.</p>
<p><strong>Il team di supporto di Zilliz ha costruito un bot di assistenza AI per la comunità Milvus su Slack</strong></p>
<p>Il team di Zilliz ha collegato OpenClaw al suo spazio di lavoro Slack come <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">assistente della comunità Milvus</a>. L'installazione ha richiesto 20 minuti. Ora risponde alle domande più comuni su Milvus, aiuta a risolvere gli errori e indirizza gli utenti alla documentazione pertinente. Se volete provare qualcosa di simile, abbiamo scritto un <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">tutorial</a> completo <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">, passo dopo passo,</a> su come collegare OpenClaw a Slack.</p>
<ul>
<li><strong>Tutorial su OpenClaw:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guida passo-passo alla configurazione di OpenClaw con Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg ha costruito un agente che lo ha aiutato a negoziare uno sconto di 4.200 dollari sull'acquisto di un'auto mentre dormiva</strong></p>
<p>L'ingegnere informatico AJ Stuyvenberg ha incaricato OpenClaw di acquistare una Hyundai Palisade del 2026. L'agente ha cercato negli inventari dei concessionari locali, ha compilato moduli di contatto utilizzando il suo numero di telefono e la sua e-mail, poi ha trascorso diversi giorni mettendo i concessionari l'uno contro l'altro, inviando preventivi in PDF e chiedendo a ciascuno di battere il prezzo dell'altro. Risultato finale: <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car"> 4.200 dollari</a> in meno rispetto al prezzo di listino, con Stuyvenberg che si è presentato solo per firmare le pratiche. "Esternalizzare gli aspetti dolorosi dell'acquisto di un'auto all'intelligenza artificiale è stato piacevole", ha scritto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>L'agente di Hormold gli ha fatto vincere una controversia assicurativa precedentemente chiusa senza preavviso</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un utente di nome Hormold si è visto respingere una richiesta di risarcimento dalla Lemonade Insurance. OpenClaw ha scoperto l'e-mail di rifiuto, ha redatto una confutazione citando il linguaggio della polizza e l'ha inviata, senza un'autorizzazione esplicita. Lemonade ha riaperto l'indagine. &quot;Il mio @openclaw ha accidentalmente iniziato una lotta con la Lemonade Insurance&quot;, ha scritto su Twitter. &quot;Grazie, AI.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook: Un social network costruito con OpenClaw per gli agenti AI<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Gli esempi precedenti mostrano OpenClaw che automatizza le attività per i singoli utenti. Ma cosa succede quando migliaia di questi agenti interagiscono tra loro?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il 28 gennaio 2026, ispirato e costruito con OpenClaw, l'imprenditore Matt Schlicht ha lanciato <a href="https://moltbook.com/">Moltbook</a>, una piattaforma in stile Reddit in cui solo gli agenti AI possono postare. La crescita è stata rapida. In 72 ore si sono registrati 32.000 agenti. Nel giro di una settimana, il numero ha superato 1,5 milioni. Più di un milione di umani hanno visitato il sito nella prima settimana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I problemi di sicurezza sono arrivati altrettanto rapidamente. Il 31 gennaio, quattro giorni dopo il lancio, <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media ha riferito</a> che una configurazione errata del database Supabase aveva lasciato l'intero backend della piattaforma aperto alla rete pubblica. Il ricercatore di sicurezza Jameson O'Reilly ha scoperto la falla; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz</a> l'ha <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">confermata in modo indipendente</a> e ne ha documentato la portata: accesso non autenticato in lettura e scrittura a tutte le tabelle, compresi 1,5 milioni di chiavi API degli agenti, oltre 35.000 indirizzi e-mail e migliaia di messaggi privati.</p>
<p>Se Moltbook rappresenti un comportamento emergente della macchina o agenti che riproducono tropi fantascientifici dai dati di addestramento è una questione aperta. Ciò che è meno ambiguo è la dimostrazione tecnica: agenti autonomi che mantengono un contesto persistente, si coordinano su una piattaforma condivisa e producono output strutturati senza istruzioni esplicite. Per gli ingegneri che costruiscono con OpenClaw o con framework simili, si tratta di un'anteprima in tempo reale delle capacità e delle sfide di sicurezza che si presentano con l'intelligenza artificiale agonica su scala.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Rischi tecnici e considerazioni sulla produzione di OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di distribuire OpenClaw in qualsiasi luogo importante, è necessario capire cosa si sta effettivamente eseguendo. Si tratta di un agente con accesso alla shell, controllo del browser e capacità di inviare e-mail per conto dell'utente, in loop, senza chiedere nulla. È potente, ma la superficie di attacco è enorme e il progetto è giovane.</p>
<p><strong>Il modello di autenticazione aveva una grave falla.</strong> Il 30 gennaio 2026, Mav Levin di depthfirst ha rivelato <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8), un bug di hijacking WebSocket cross-site in cui qualsiasi sito web poteva rubare il token di autenticazione e ottenere un RCE sul computer dell'utente attraverso un singolo link dannoso. Un clic e l'accesso completo. Il problema è stato risolto in <code translate="no">2026.1.29</code>, ma Censys ha trovato oltre 21.000 istanze di OpenClaw esposte alla rete pubblica, molte delle quali su HTTP. <strong>Se state utilizzando una versione precedente o non avete bloccato la configurazione di rete, verificatelo prima.</strong></p>
<p><strong>Le competenze sono solo codice di sconosciuti e non c'è sandbox.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Il team di sicurezza di Cisco</a> ha smontato un'abilità chiamata "What Would Elon Do?" che era stata inserita al primo posto nel repository. Si trattava di un vero e proprio malware, che utilizzava la prompt injection per aggirare i controlli di sicurezza ed esfiltrava i dati degli utenti su un server controllato dall'aggressore. Hanno trovato nove vulnerabilità in quell'abilità, due delle quali critiche. Quando hanno controllato 31.000 competenze degli agenti su diverse piattaforme (Claude, Copilot, repository AgentSkills generici), il 26% presentava almeno una vulnerabilità. Solo nella prima settimana di febbraio sono state caricate su ClawHub oltre 230 competenze dannose. <strong>Trattate ogni skill che non avete scritto voi stessi come una dipendenza non attendibile: forkatela, leggetela e poi installatela.</strong></p>
<p><strong>Il ciclo del battito cardiaco farà cose che non avete richiesto.</strong> La storia di Hormold dell'introduzione, in cui l'agente ha trovato un rifiuto dell'assicurazione, ha fatto ricerche sui precedenti e ha inviato una confutazione legale in modo autonomo, non è una dimostrazione di funzionalità, ma un rischio di responsabilità. L'agente si è impegnato nella corrispondenza legale senza l'approvazione umana. Quella volta ha funzionato. Non funzionerà sempre. <strong>Qualsiasi cosa che coinvolga pagamenti, cancellazioni o comunicazioni esterne ha bisogno di un gate umano all'interno del ciclo, punto e basta.</strong></p>
<p><strong>I costi delle API aumentano rapidamente se non si sta attenti.</strong> Cifre approssimative: una configurazione leggera con pochi battiti cardiaci al giorno costa 18-36 dollari al mese con Sonnet 4.5. Se si passa a più di 12 controlli giornalieri su Opus, si arriva a 270-540 dollari al mese. Una persona su HN ha scoperto che stava consumando 70 dollari al mese per le chiamate API ridondanti e per la registrazione verbosa: dopo aver ripulito la configurazione, l'ha ridotta quasi a zero. <strong>Impostare gli avvisi di spesa a livello di provider.</strong> Un intervallo di heartbeat mal configurato può prosciugare il budget dell'API da un giorno all'altro.</p>
<p>Prima di distribuire, si consiglia vivamente di esaminare questo aspetto:</p>
<ul>
<li><p>Eseguirlo in un ambiente isolato - una macchina virtuale o un container dedicato, non il vostro autista di tutti i giorni.</p></li>
<li><p>Forzare e verificare ogni abilità prima dell'installazione. Leggere il sorgente. Tutto.</p></li>
<li><p>Impostare limiti di spesa rigidi per le API a livello di provider, non solo nella configurazione dell'agente.</p></li>
<li><p>Gate tutte le azioni irreversibili dietro approvazione umana: pagamenti, cancellazioni, invio di e-mail, qualsiasi cosa esterna.</p></li>
<li><p>Aggiornare alla versione 2026.1.29 o successiva e tenere il passo con le patch di sicurezza.</p></li>
</ul>
<p>Non esporlo a Internet se non si sa esattamente cosa si sta facendo con la configurazione di rete.</p>
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
    </button></h2><p>OpenClaw ha superato le 175.000 stelle di GitHub in meno di due settimane, diventando uno dei repository open-source a più rapida crescita nella storia di GitHub. L'adozione è reale e l'architettura sottostante merita attenzione.</p>
<p>Da un punto di vista tecnico, OpenClaw è tre cose che la maggior parte degli agenti di intelligenza artificiale non sono: completamente open-source (MIT), local-first (memoria memorizzata come file Markdown sulla vostra macchina) e programmato autonomamente (un demone heartbeat che agisce senza richiedere istruzioni). Si integra con piattaforme di messaggistica come Slack, Telegram e WhatsApp e supporta le competenze costruite dalla comunità attraverso un semplice sistema SKILL.md. Questa combinazione lo rende particolarmente adatto alla creazione di assistenti sempre attivi: bot di Slack che rispondono alle domande 24 ore su 24, 7 giorni su 7, monitor della casella di posta elettronica che gestiscono le e-mail mentre si dorme o flussi di lavoro di automazione che funzionano sull'hardware dell'utente senza il vincolo del fornitore.</p>
<p>Detto questo, l'architettura che rende OpenClaw potente lo rende anche rischioso se viene distribuito in modo incauto. Alcune cose da tenere a mente:</p>
<ul>
<li><p><strong>Eseguirlo in isolamento.</strong> Utilizzate un dispositivo o una macchina virtuale dedicata, non il vostro computer principale. Se qualcosa va storto, è necessario un interruttore di sicurezza raggiungibile fisicamente.</p></li>
<li><p><strong>Verificare le competenze prima dell'installazione.</strong> Il 26% delle competenze comunitarie analizzate da Cisco conteneva almeno una vulnerabilità. Forzare e rivedere tutto ciò di cui non ci si fida.</p></li>
<li><p><strong>Impostate limiti di spesa per le API a livello di provider.</strong> Un heartbeat mal configurato può bruciare centinaia di dollari in una notte. Configurare gli avvisi prima della distribuzione.</p></li>
<li><p><strong>Cancellare le azioni irreversibili.</strong> Pagamenti, cancellazioni, comunicazioni esterne: dovrebbero richiedere l'approvazione umana, non l'esecuzione autonoma.</p></li>
</ul>
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Guida passo-passo alla configurazione di OpenClaw con Slack</a> - Costruite un bot di assistenza AI alimentato da Milvus nel vostro spazio di lavoro Slack usando OpenClaw</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 e Milvus: costruire agenti AI pronti per la produzione con memoria a lungo termine</a> - Come dare ai vostri agenti una memoria semantica persistente con Milvus</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Smettere di costruire Vanilla RAG: abbracciare Agentic RAG con DeepSearcher</a> - Perché Agentic RAG supera il reperimento tradizionale, con un'implementazione pratica open-source</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG con Milvus e LangGraph</a> - Tutorial: costruire un agente che decide quando recuperare, valuta la rilevanza dei documenti e riscrive le query</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Costruire un assistente AI pronto per la produzione con Spring Boot e Milvus</a> - Guida completa alla costruzione di un assistente AI aziendale con ricerca semantica e memoria di conversazione</p></li>
</ul>

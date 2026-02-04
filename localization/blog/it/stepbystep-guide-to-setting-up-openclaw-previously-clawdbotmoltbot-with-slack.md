---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >-
  Guida passo passo alla configurazione di OpenClaw (precedentemente
  Clawdbot/Moltbot) con Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  Guida passo passo alla configurazione di OpenClaw con Slack. Eseguite un
  assistente AI in hosting sul vostro Mac o Linux, senza bisogno di cloud.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>Se siete stati su Twitter, Hacker News o Discord questa settimana, l'avrete visto. Un'emoji aragosta 🦞, schermate di compiti completati e un'affermazione audace: un'intelligenza artificiale che non si limita a <em>parlare, ma</em> <em>lo fa</em> davvero.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nel fine settimana la situazione si è fatta ancora più strana. L'imprenditore Matt Schlicht ha lanciato <a href="https://moltbook.com">Moltbook, un</a>social network in stile Reddit in cui solo gli agenti dell'IA possono postare e gli umani possono solo guardare. In pochi giorni, oltre 1,5 milioni di agenti si sono iscritti. Hanno formato comunità, discusso di filosofia, si sono lamentati dei loro operatori umani e hanno persino fondato una propria religione chiamata "Crustafarianesimo". Sì, davvero.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Benvenuti nella mania di OpenClaw.</p>
<p>L'entusiasmo è tale che le azioni di Cloudflare sono balzate del 14% semplicemente perché gli sviluppatori utilizzano la sua infrastruttura per eseguire le applicazioni. Secondo quanto riferito, le vendite di Mac Mini hanno subito un'impennata a causa dell'acquisto di hardware dedicato per il loro nuovo dipendente AI. E il repo di GitHub? Oltre <a href="https://github.com/openclaw/openclaw">150.000 stelle</a> in poche settimane.</p>
<p>Quindi, naturalmente, abbiamo dovuto mostrarvi come configurare la vostra istanza di OpenClaw e come collegarla a Slack, in modo da poter comandare il vostro assistente AI dalla vostra app di messaggistica preferita.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">Cos'è OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (precedentemente noto come Clawdbot/Moltbot) è un agente AI autonomo e open-source che viene eseguito localmente sui computer degli utenti e svolge compiti reali tramite app di messaggistica come WhatsApp, Telegram e Discord. Automatizza i flussi di lavoro digitali, come la gestione delle e-mail, la navigazione sul web o la programmazione di riunioni, collegandosi a LLM come Claude o ChatGPT.</p>
<p>In breve, è come avere un assistente digitale 24 ore su 24, 7 giorni su 7, in grado di pensare, rispondere e portare a termine le cose.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Impostazione di OpenClaw come assistente AI basato su Slack<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Immaginate di avere un bot nel vostro spazio di lavoro Slack in grado di rispondere istantaneamente alle domande sul vostro prodotto, di aiutare a risolvere i problemi degli utenti o di indirizzare i compagni di squadra verso la documentazione giusta, senza che nessuno debba interrompere le proprie attività. Per noi, questo potrebbe significare un supporto più rapido per la comunità Milvus: un bot che risponde alle domande più comuni ("Come faccio a creare una raccolta?"), aiuta a risolvere gli errori o riassume le note di rilascio su richiesta. Per il vostro team, potrebbe trattarsi dell'inserimento di nuovi ingegneri, della gestione delle FAQ interne o dell'automazione di attività DevOps ripetitive. I casi d'uso sono molteplici.</p>
<p>In questo tutorial, vi illustreremo le basi: installare OpenClaw sul vostro computer e collegarlo a Slack. Una volta terminato, avrete un assistente AI funzionante e pronto per essere personalizzato per qualsiasi esigenza.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><ul>
<li><p>Un computer Mac o Linux</p></li>
<li><p>Una <a href="https://console.anthropic.com/">chiave API Anthropic</a> (o accesso CLI a Claude Code)</p></li>
<li><p>Uno spazio di lavoro Slack in cui installare le app.</p></li>
</ul>
<p>È tutto. Iniziamo.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Passo 1: installare OpenClaw</h3><p>Eseguire il programma di installazione:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando viene richiesto, selezionare <strong>Sì</strong> per continuare.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quindi, scegliere la modalità <strong>QuickStart</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Fase 2: Scegliere l'LLM</h3><p>Il programma di installazione chiederà di scegliere un fornitore di modelli. Noi utilizziamo Anthropic con la Claude Code CLI per l'autenticazione.</p>
<ol>
<li>Selezionare <strong>Anthropic</strong> come provider  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Completare la verifica nel browser quando viene richiesto.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Scegliere <strong>anthropic/claude-opus-4-5-20251101</strong> come modello predefinito.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Passo 3: configurare Slack</h3><p>Quando vi viene chiesto di selezionare un canale, scegliete <strong>Slack.</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Procedete a dare un nome al vostro bot. Noi abbiamo chiamato il nostro "Clawdbot_Milvus".  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ora dovrete creare un'app Slack e ottenere due token. Ecco come fare:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Creare un'app Slack</strong></p>
<p>Andate sul <a href="https://api.slack.com/apps?new_app=1">sito web</a> dell'<a href="https://api.slack.com/apps?new_app=1">API di Slack</a> e create una nuova app da zero.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Datele un nome e selezionate lo spazio di lavoro che volete utilizzare.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Impostare i permessi del bot</strong></p>
<p>Nella barra laterale, fare clic su <strong>OAuth e autorizzazioni</strong>. Scorrere fino a <strong>Bot Token Scopes</strong> e aggiungere i permessi necessari al bot.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Abilitare la modalità Socket</strong></p>
<p>Fare clic su <strong>Socket Mode</strong> nella barra laterale e attivarlo.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo genererà un <strong>token di livello app</strong> (che inizia con <code translate="no">xapp-</code>). Copiarlo in un posto sicuro.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Abilitare le sottoscrizioni agli eventi</strong></p>
<p>Andare su <strong>Sottoscrizioni agli eventi</strong> e attivarle.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Scegliere quindi a quali eventi il bot deve abbonarsi.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Installare l'app</strong></p>
<p>Fare clic su <strong>Installa l'app</strong> nella barra laterale, quindi su <strong>Richiedi l'installazione</strong> (o installare direttamente se si è amministratori dell'area di lavoro).  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta approvata, si vedrà il proprio <strong>Bot User OAuth Token</strong> (che inizia con <code translate="no">xoxb-</code>). Copiare anche questo.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_20_a4a6878dbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Passo 4: Configurare OpenClaw</h3><p>Tornare alla CLI di OpenClaw:</p>
<ol>
<li><p>Inserire il <strong>token OAuth dell'utente del bot</strong> (<code translate="no">xoxb-...</code>).</p></li>
<li><p>Inserire il <strong>token a livello di app</strong> (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Selezionare i canali Slack a cui il bot può accedere  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Saltate la configurazione delle competenze per ora: potrete sempre aggiungerle in seguito.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Selezionare <strong>Riavvia</strong> per applicare le modifiche</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Passo 5: provarlo</h3><p>Andate su Slack e inviate un messaggio al vostro bot. Se tutto è stato configurato correttamente, OpenClaw risponderà e sarà pronto a eseguire attività sulla vostra macchina.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Suggerimenti</h3><ol>
<li>Eseguire <code translate="no">clawdbot dashboard</code> per gestire le impostazioni attraverso un'interfaccia web.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Se qualcosa va storto, controllare i log per i dettagli dell'errore.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">Una parola di cautela<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw è potente ed è proprio per questo che bisogna fare attenzione. "Fa davvero qualcosa" significa che può eseguire comandi reali sul vostro computer. Questo è l'obiettivo, ma comporta dei rischi.</p>
<p><strong>La buona notizia è che:</strong></p>
<ul>
<li><p>È open source, quindi il codice è verificabile.</p></li>
<li><p>Viene eseguito localmente, quindi i vostri dati non sono sul server di qualcun altro.</p></li>
<li><p>Potete controllare quali permessi ha</p></li>
</ul>
<p><strong>Le notizie meno buone:</strong></p>
<ul>
<li><p>L'iniezione di prompt è un rischio reale: un messaggio dannoso potrebbe potenzialmente indurre il bot a eseguire comandi indesiderati.</p></li>
<li><p>I truffatori hanno già creato repository e token OpenClaw falsi, quindi fate attenzione a ciò che scaricate.</p></li>
</ul>
<p><strong>Il nostro consiglio:</strong></p>
<ul>
<li><p>Non eseguitelo sul vostro computer principale. Utilizzate una macchina virtuale, un portatile di riserva o un server dedicato.</p></li>
<li><p>Non concedere più permessi del necessario.</p></li>
<li><p>Non usarlo ancora in produzione. È nuovo. Trattatelo come un esperimento.</p></li>
<li><p>Attenersi alle fonti ufficiali: <a href="https://x.com/openclaw">@openclaw</a> su X e <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Una volta data a un LLM la capacità di eseguire comandi, non esiste una cosa sicura al 100%. Non è un problema di OpenClaw: è la natura dell'IA agenziale. Basta essere intelligenti.</p>
<h2 id="Whats-Next" class="common-anchor-header">Cosa c'è dopo?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Congratulazioni! Ora avete un assistente AI locale in esecuzione sulla vostra infrastruttura, accessibile tramite Slack. I vostri dati restano vostri e avete un aiutante instancabile pronto ad automatizzare le attività ripetitive.</p>
<p>Da qui è possibile:</p>
<ul>
<li><p>Installare altre <a href="https://docs.molt.bot/skills">competenze</a> per ampliare le capacità di OpenClaw.</p></li>
<li><p>Impostare attività pianificate in modo che lavori in modo proattivo</p></li>
<li><p>Collegare altre piattaforme di messaggistica come Telegram o Discord</p></li>
<li><p>Esplorare l'ecosistema <a href="https://milvus.io/">Milvus</a> per le capacità di ricerca dell'intelligenza artificiale.</p></li>
</ul>
<p><strong>Avete domande o volete condividere ciò che state costruendo?</strong></p>
<ul>
<li><p>Unitevi alla <a href="https://milvus.io/slack">comunità Milvus su Slack</a> per connettervi con altri sviluppatori.</p></li>
<li><p>Prenotate le nostre <a href="https://milvus.io/office-hours">ore di ufficio Milvus</a> per avere domande e risposte dal vivo con il team.</p></li>
</ul>
<p>Buon hacking! 🦞</p>

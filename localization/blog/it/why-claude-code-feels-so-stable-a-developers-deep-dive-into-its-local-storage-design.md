---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >-
  Perché il codice Claude è così stabile: Un'immersione profonda di uno
  sviluppatore nel suo progetto di archiviazione locale
author: Bill chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >-
  Un'immersione profonda nello storage di Claude Code: I log di sessione JSONL,
  l'isolamento dei progetti, la configurazione a strati e le istantanee dei file
  che rendono stabile e recuperabile la codifica assistita dall'intelligenza
  artificiale.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Ultimamente il codice Claude è ovunque. Gli sviluppatori lo usano per produrre più velocemente funzionalità, automatizzare flussi di lavoro e prototipare agenti che funzionano davvero in progetti reali. Ciò che è ancora più sorprendente è il numero di non-codificatori che si sono lanciati in questa impresa, costruendo strumenti, collegando attività e ottenendo risultati utili quasi senza alcuna configurazione. È raro vedere uno strumento di codifica dell'intelligenza artificiale diffondersi così rapidamente tra così tanti livelli di competenza.</p>
<p>Ciò che spicca, tuttavia, è la sua <em>stabilità</em>. Claude Code ricorda ciò che è successo nelle varie sessioni, sopravvive agli arresti anomali senza perdere i progressi e si comporta più come uno strumento di sviluppo locale che come un'interfaccia di chat. L'affidabilità deriva dal modo in cui gestisce l'archiviazione locale.</p>
<p>Invece di trattare la sessione di codifica come una chat temporanea, Claude Code legge e scrive file reali, memorizza lo stato del progetto su disco e registra ogni fase del lavoro dell'agente. Le sessioni possono essere riprese, ispezionate o annullate senza dover fare congetture, e ogni progetto rimane isolato in modo pulito, evitando i problemi di contaminazione incrociata in cui incorrono molti strumenti per agenti.</p>
<p>In questo post daremo un'occhiata più da vicino all'architettura di archiviazione che sta alla base di questa stabilità e perché gioca un ruolo così importante nel rendere Claude Code pratico per lo sviluppo quotidiano.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Le sfide che ogni assistente locale di codifica AI deve affrontare<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di spiegare come Claude Code affronta l'archiviazione, diamo un'occhiata ai problemi comuni in cui tendono a imbattersi gli strumenti di codifica AI locali. Questi si presentano naturalmente quando un assistente lavora direttamente sul filesystem e mantiene lo stato nel tempo.</p>
<p><strong>1. I dati del progetto vengono mescolati tra gli spazi di lavoro.</strong></p>
<p>La maggior parte degli sviluppatori passa da un repository all'altro nel corso della giornata. Se un assistente trasporta lo stato da un progetto all'altro, diventa più difficile capire il suo comportamento e più facile che faccia ipotesi sbagliate. Ogni progetto ha bisogno di un proprio spazio pulito e isolato per lo stato e la cronologia.</p>
<p><strong>2. Gli arresti anomali possono causare la perdita di dati.</strong></p>
<p>Durante una sessione di codifica, un assistente produce un flusso costante di dati utili: modifiche ai file, chiamate agli strumenti, passaggi intermedi. Se questi dati non vengono salvati subito, un crash o un riavvio forzato possono cancellarli. Un sistema affidabile scrive lo stato importante su disco non appena viene creato, in modo che il lavoro non vada perso inaspettatamente.</p>
<p><strong>3. Non è sempre chiaro cosa abbia fatto l'agente.</strong></p>
<p>Una sessione tipica comporta molte piccole azioni. Senza una registrazione chiara e ordinata di tali azioni, è difficile ricostruire come l'assistente sia arrivato a un determinato risultato o individuare il passaggio in cui qualcosa è andato storto. Una cronologia completa rende il debugging e la revisione molto più gestibili.</p>
<p><strong>4. Annullare gli errori richiede uno sforzo eccessivo.</strong></p>
<p>A volte l'assistente apporta modifiche che non funzionano. Se non si dispone di un modo integrato per annullare le modifiche, si finisce per cercare manualmente le modifiche nel repo. Il sistema dovrebbe tenere traccia automaticamente delle modifiche apportate, in modo da poterle annullare in modo pulito e senza ulteriore lavoro.</p>
<p><strong>5. Progetti diversi hanno bisogno di impostazioni diverse.</strong></p>
<p>Gli ambienti locali variano. Alcuni progetti richiedono autorizzazioni, strumenti o regole di directory specifiche; altri hanno script o flussi di lavoro personalizzati. Un assistente deve rispettare queste differenze e consentire le impostazioni per progetto, pur mantenendo coerente il suo comportamento di base.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">I principi di progettazione dello storage alla base di Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Il progetto di archiviazione di Claude Code si basa su quattro idee semplici. Possono sembrare semplici, ma insieme affrontano i problemi pratici che si presentano quando un assistente AI lavora direttamente sulla vostra macchina e su più progetti.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Ogni progetto ha il suo spazio di archiviazione.</h3><p>Claude Code lega tutti i dati della sessione alla directory del progetto a cui appartengono. Ciò significa che le conversazioni, le modifiche e i registri rimangono nel progetto da cui provengono e non si disperdono negli altri. Mantenere l'archiviazione separata rende il comportamento dell'assistente più facile da capire e semplifica l'ispezione o l'eliminazione dei dati per un repo specifico.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. I dati vengono salvati subito su disco.</h3><p>Invece di tenere in memoria i dati dell'interazione, Claude Code li scrive su disco non appena vengono creati. Ogni evento (messaggio, chiamata allo strumento o aggiornamento dello stato) viene aggiunto come una nuova voce. Se il programma si blocca o viene chiuso inaspettatamente, quasi tutto è ancora lì. Questo approccio mantiene le sessioni durevoli senza aggiungere molta complessità.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Ogni azione ha un posto chiaro nella storia.</h3><p>Claude Code collega ogni messaggio e azione dello strumento a quello precedente, formando una sequenza completa. Questa cronologia ordinata permette di rivedere come si è svolta una sessione e di tracciare i passaggi che hanno portato a un risultato specifico. Per gli sviluppatori, questo tipo di traccia rende molto più semplice il debug e la comprensione del comportamento dell'agente.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Le modifiche al codice possono essere facilmente annullate.</h3><p>Prima che l'assistente aggiorni un file, Claude Code salva un'istantanea del suo stato precedente. Se la modifica si rivela sbagliata, è possibile ripristinare la versione precedente senza dover scavare nel repo o indovinare cosa è cambiato. Questa semplice rete di sicurezza rende le modifiche guidate dall'intelligenza artificiale molto meno rischiose.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Layout di archiviazione locale di Claude Code<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code memorizza tutti i dati locali in un unico luogo: la vostra home directory. Questo rende il sistema prevedibile e più facile da ispezionare, debuggare o ripulire quando necessario. Il layout di archiviazione si basa su due componenti principali: un piccolo file di configurazione globale e una directory di dati più grande, dove risiede tutto lo stato del progetto.</p>
<p><strong>Due componenti principali:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Memorizza la configurazione globale e i collegamenti, compresi i mapping dei progetti, le impostazioni del server MCP e i prompt usati di recente.</p></li>
<li><p><code translate="no">~/.claude/</code>La directory principale dei dati, dove Claude Code memorizza le conversazioni, le sessioni del progetto, i permessi, i plugin, le competenze, la cronologia e i relativi dati di runtime.</p></li>
</ul>
<p>Diamo quindi un'occhiata più da vicino a questi due componenti principali.</p>
<p><strong>(1) Configurazione globale</strong>: <code translate="no">~/.claude.json</code></p>
<p>Questo file funge da indice piuttosto che da archivio di dati. Registra i progetti su cui si è lavorato, gli strumenti collegati a ciascun progetto e i prompt utilizzati di recente. I dati di conversazione non sono memorizzati qui.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Directory principale dei dati</strong>: <code translate="no">~/.claude/</code></p>
<p>La directory <code translate="no">~/.claude/</code> è il luogo in cui risiede la maggior parte dello stato locale di Claude Code. La sua struttura riflette alcune idee fondamentali del progetto: isolamento dei progetti, persistenza immediata e recupero sicuro dagli errori.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>Questo layout è intenzionalmente semplice: tutto ciò che Claude Code genera vive in un'unica directory, organizzata per progetto e sessione. Non ci sono stati nascosti sparsi per il sistema, ed è facile ispezionarli o ripulirli quando necessario.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Come Claude Code gestisce la configurazione<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Il sistema di configurazione di Claude Code è progettato intorno a un'idea semplice: mantenere il comportamento predefinito coerente tra le macchine, ma lasciare che i singoli ambienti e progetti personalizzino ciò di cui hanno bisogno. Per far sì che questo funzioni, Claude Code utilizza un modello di configurazione a tre livelli. Quando la stessa impostazione compare in più punti, vince sempre il livello più specifico.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">I tre livelli di configurazione</h3><p>Claude Code carica la configurazione nel seguente ordine, dalla priorità più bassa a quella più alta:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Si può pensare di iniziare con i valori predefiniti globali, poi applicare le regolazioni specifiche della macchina e infine applicare le regole specifiche del progetto.</p>
<p>Di seguito, analizzeremo in dettaglio ciascun livello di configurazione.</p>
<p><strong>(1) Configurazione globale</strong>: <code translate="no">~/.claude/settings.json</code></p>
<p>La configurazione globale definisce il comportamento predefinito per Claude Code in tutti i progetti. Qui si impostano i permessi di base, si abilitano i plugin e si configura il comportamento di pulizia.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Configurazione locale</strong>: <code translate="no">~/.claude/settings.local.json</code></p>
<p>La configurazione locale è specifica per una singola macchina. Non è destinata a essere condivisa o controllata nel controllo di versione. È quindi un buon posto per le chiavi API, gli strumenti locali o i permessi specifici dell'ambiente.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Configurazione a livello di progetto</strong>: <code translate="no">project/.claude/settings.json</code></p>
<p>La configurazione a livello di progetto si applica solo a un singolo progetto e ha la massima priorità. Qui si definiscono le regole che devono essere sempre applicate quando si lavora in quel repository.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Definiti i livelli di configurazione, la domanda successiva è <strong>come Claude Code risolva effettivamente la configurazione e i permessi in fase di esecuzione.</strong></p>
<p><strong>Claude Code</strong> applica la configurazione in tre livelli: inizia con i valori predefiniti globali, poi applica le sovrascritture specifiche della macchina e infine applica le regole specifiche del progetto. Quando la stessa impostazione compare in più punti, la configurazione più specifica ha la priorità.</p>
<p>I permessi seguono un ordine di valutazione fisso:</p>
<ol>
<li><p><strong>deny</strong> - blocca sempre</p></li>
<li><p><strong>ask</strong> - richiede una conferma</p></li>
<li><p><strong>consenti</strong> - viene eseguito automaticamente</p></li>
<li><p><strong>default</strong> - si applica solo quando nessuna regola corrisponde</p></li>
</ol>
<p>In questo modo il sistema rimane sicuro per impostazione predefinita, pur garantendo ai progetti e alle singole macchine la flessibilità necessaria.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Memorizzazione della sessione: Come Claude Code conserva i dati fondamentali dell'interazione<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>In <strong>Claude Code</strong>, le sessioni sono l'unità centrale dei dati. Una sessione cattura l'intera interazione tra l'utente e l'IA, compresa la conversazione stessa, le chiamate agli strumenti, le modifiche ai file e il relativo contesto. Il modo in cui vengono archiviate le sessioni ha un impatto diretto sull'affidabilità, la debuggabilità e la sicurezza generale del sistema.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Mantenere i dati delle sessioni separati per ogni progetto</h3><p>Una volta definite le sessioni, la domanda successiva è come <strong>Claude Code</strong> le memorizzi in modo da mantenere i dati organizzati e isolati.</p>
<p><strong>Claude Code</strong> isola i dati delle sessioni per progetto. Le sessioni di ogni progetto sono memorizzate in una directory derivata dal percorso dei file del progetto.</p>
<p>Il percorso di archiviazione segue questo schema:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>Per creare un nome di directory valido, i caratteri speciali come <code translate="no">/</code>, gli spazi e <code translate="no">~</code> vengono sostituiti con <code translate="no">-</code>.</p>
<p>Ad esempio:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>Questo approccio garantisce che i dati delle sessioni di progetti diversi non si mescolino mai e che possano essere gestiti o rimossi a seconda del progetto.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Perché le sessioni sono memorizzate in formato JSONL</h3><p><strong>Claude Code</strong> memorizza i dati di sessione utilizzando JSONL (JSON Lines) invece di JSON standard.</p>
<p>In un file JSON tradizionale, tutti i messaggi sono raggruppati in un'unica grande struttura, il che significa che l'intero file deve essere letto e riscritto ogni volta che viene modificato. Al contrario, JSONL memorizza ogni messaggio come una propria riga del file. Una riga equivale a un messaggio, senza alcun involucro esterno.</p>
<table>
<thead>
<tr><th>Aspetto</th><th>JSON standard</th><th>JSONL (Linee JSON)</th></tr>
</thead>
<tbody>
<tr><td>Come vengono memorizzati i dati</td><td>Una grande struttura</td><td>Un messaggio per riga</td></tr>
<tr><td>Quando vengono salvati i dati</td><td>Di solito alla fine</td><td>Immediatamente, per messaggio</td></tr>
<tr><td>Impatto del crash</td><td>L'intero file può rompersi</td><td>Solo l'ultima riga è interessata</td></tr>
<tr><td>Scrittura di nuovi dati</td><td>Riscrivere l'intero file</td><td>Aggiunta di una riga</td></tr>
<tr><td>Utilizzo della memoria</td><td>Carica tutto</td><td>Leggere riga per riga</td></tr>
</tbody>
</table>
<p>JSONL funziona meglio in diversi modi:</p>
<ul>
<li><p><strong>Salvataggio immediato:</strong> Ogni messaggio viene scritto su disco non appena viene generato, invece di attendere la fine della sessione.</p></li>
<li><p><strong>Resistente agli arresti anomali:</strong> se il programma si blocca, solo l'ultimo messaggio non terminato può andare perso. Tutto ciò che è stato scritto prima rimane intatto.</p></li>
<li><p><strong>Aggiunta rapida di messaggi:</strong> I nuovi messaggi vengono aggiunti alla fine del file senza leggere o riscrivere i dati esistenti.</p></li>
<li><p><strong>Basso utilizzo della memoria:</strong> I file di sessione possono essere letti una riga alla volta, quindi non è necessario caricare l'intero file in memoria.</p></li>
</ul>
<p>Un file di sessione JSONL semplificato ha il seguente aspetto:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Tipi di messaggi di sessione</h3><p>Un file di sessione registra tutto ciò che accade durante un'interazione con Claude Code. Per farlo in modo chiaro, utilizza diversi tipi di messaggi per diversi tipi di eventi.</p>
<ul>
<li><p><strong>I messaggi dell'utente</strong> rappresentano i nuovi input che arrivano al sistema. Questo include non solo ciò che l'utente digita, ma anche i risultati restituiti dagli strumenti, come l'output di un comando di shell. Dal punto di vista dell'intelligenza artificiale, entrambi sono input a cui deve rispondere.</p></li>
<li><p>I<strong>messaggi dell'assistente</strong> catturano ciò che Claude fa in risposta. Questi messaggi includono il ragionamento dell'intelligenza artificiale, il testo che genera e gli strumenti che decide di utilizzare. Registrano anche i dettagli di utilizzo, come il conteggio dei token, per fornire un quadro completo dell'interazione.</p></li>
<li><p>Le<strong>istantanee della storia dei file</strong> sono checkpoint di sicurezza creati prima che Claude modifichi qualsiasi file. Salvando prima lo stato originale dei file, Claude Code permette di annullare le modifiche se qualcosa va storto.</p></li>
<li><p><strong>I sommari</strong> forniscono una panoramica concisa della sessione e sono collegati al risultato finale. In questo modo è più facile capire il senso di una sessione senza dover ripetere ogni fase.</p></li>
</ul>
<p>Insieme, questi tipi di messaggi registrano non solo la conversazione, ma l'intera sequenza di azioni ed effetti che si verificano durante una sessione.</p>
<p>Per rendere più concreto questo concetto, esaminiamo esempi specifici di messaggi dell'utente e di messaggi dell'assistente.</p>
<p><strong>(1) Esempio di messaggi dell'utente:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Esempio di messaggi dell'assistente:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">Come sono collegati i messaggi di sessione</h3><p>Claude Code non memorizza i messaggi di sessione come voci isolate. Al contrario, li collega tra loro per formare una chiara catena di eventi. Ogni messaggio include un identificatore unico (<code translate="no">uuid</code>) e un riferimento al messaggio che lo ha preceduto (<code translate="no">parentUuid</code>). In questo modo è possibile vedere non solo cosa è successo, ma anche perché è successo.</p>
<p>Una sessione inizia con un messaggio dell'utente, che dà inizio alla catena. Ogni risposta di Claude rimanda al messaggio che l'ha causata. Le chiamate agli strumenti e i loro risultati vengono aggiunti allo stesso modo, con ogni passo collegato a quello precedente. Quando la sessione termina, al messaggio finale viene allegato un riepilogo.</p>
<p>Poiché ogni passo è collegato, Claude Code può riprodurre l'intera sequenza di azioni e capire come è stato prodotto un risultato, facilitando il debugging e l'analisi.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Facilità di annullamento delle modifiche al codice con le istantanee dei file<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>Le modifiche generate dall'intelligenza artificiale non sono sempre corrette e a volte vanno nella direzione completamente sbagliata. Per rendere queste modifiche sicure da sperimentare, Claude Code utilizza un semplice sistema di snapshot che consente di annullare le modifiche senza dover scavare nei diff o ripulire manualmente i file.</p>
<p>L'idea è semplice: <strong>prima di modificare un file, Claude Code salva una copia del contenuto originale.</strong> Se la modifica si rivela un errore, il sistema può ripristinare istantaneamente la versione precedente.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">Che cos'è un'<em>istantanea della storia del file</em>?</h3><p>Un'<em>istantanea della cronologia dei file</em> è un checkpoint creato prima che i file vengano modificati. Registra il contenuto originale di ogni file che <strong>Claude</strong> sta per modificare. Queste istantanee servono come fonte di dati per le operazioni di annullamento e rollback.</p>
<p>Quando un utente invia un messaggio che può modificare i file, <strong>Claude Code</strong> crea un'istantanea vuota per quel messaggio. Prima di modificare, il sistema esegue il backup del contenuto originale di ciascun file di destinazione nell'istantanea, quindi applica le modifiche direttamente sul disco. Se l'utente attiva l'<em>annullamento</em>, <strong>Claude Code</strong> ripristina il contenuto salvato e sovrascrive i file modificati.</p>
<p>In pratica, il ciclo di vita di una modifica annullabile è il seguente:</p>
<ol>
<li><p>L<strong>'utente invia un messaggioClaude</strong>Code crea un nuovo record <code translate="no">file-history-snapshot</code> vuoto.</p></li>
<li><p><strong>Claude si prepara a modificare i fileIl</strong>sistema identifica i file che verranno modificati ed esegue il backup del loro contenuto originale in <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude esegue la modificaLe</strong>operazioni di<strong>modifica</strong>e scrittura vengono eseguite e il contenuto modificato viene scritto su disco.</p></li>
<li><p>L<strong>'utente attiva l'annullamentoL'</strong>utente preme <strong>Esc + Esc</strong>, segnalando che le modifiche devono essere annullate.</p></li>
<li><p><strong>Il contenuto originale viene ripristinatoClaude</strong>Code legge il contenuto salvato da <code translate="no">trackedFileBackups</code> e sovrascrive i file correnti, completando l'annullamento.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Perché l'annullamento funziona: Le istantanee salvano la vecchia versione</h3><p>L'annullamento in Claude Code funziona perché il sistema salva il contenuto <em>originale</em> del file prima di qualsiasi modifica.</p>
<p>Invece di cercare di annullare le modifiche a posteriori, Claude Code adotta un approccio più semplice: copia il file così com'era <em>prima della</em> modifica e lo memorizza in <code translate="no">trackedFileBackups</code>. Quando l'utente attiva l'annullamento, il sistema ripristina questa versione salvata e sovrascrive il file modificato.</p>
<p>Il diagramma seguente mostra questo flusso passo per passo:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">L'aspetto interno di un'<em>istantanea della cronologia dei file</em> </h3><p>L'istantanea stessa è memorizzata come un record strutturato. Acquisisce i metadati relativi al messaggio dell'utente, l'ora dell'istantanea e, cosa più importante, una mappa dei file rispetto al loro contenuto originale.</p>
<p>L'esempio seguente mostra un singolo record di <code translate="no">file-history-snapshot</code> creato prima che Claude modifichi i file. Ogni voce di <code translate="no">trackedFileBackups</code> memorizza il contenuto <em>precedente alla modifica</em> di un file, che viene poi utilizzato per ripristinare il file durante un annullamento.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Dove vengono memorizzate le istantanee e per quanto tempo vengono conservate</h3><ul>
<li><p><strong>Dove vengono memorizzati i metadati delle istantanee</strong>: I record delle istantanee sono legati a una sessione specifica e salvati come file JSONL all'indirizzo<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Dove viene eseguito il backup dei contenuti originali dei file</strong>: Il contenuto pre-modifica di ogni file è memorizzato separatamente per hash di contenuto in<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>Per quanto tempo vengono conservate le istantanee per impostazione predefinita</strong>: I dati delle istantanee vengono conservati per 30 giorni, coerentemente con l'impostazione globale <code translate="no">cleanupPeriodDays</code>.</p></li>
<li><p><strong>Come modificare il periodo di conservazione</strong>: Il numero di giorni di conservazione può essere regolato tramite il campo <code translate="no">cleanupPeriodDays</code> in <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Comandi correlati</h3><table>
<thead>
<tr><th>Comando / Azione</th><th>Descrizione</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Annulla l'ultimo ciclo di modifiche del file (più comunemente usato)</td></tr>
<tr><td>/ritorno</td><td>Torna a un punto di controllo (snapshot) precedentemente specificato.</td></tr>
<tr><td>/diff</td><td>Visualizza le differenze tra il file corrente e l'istantanea di backup.</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Altre directory importanti<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - Gestione dei plugin</strong></p>
<p>La directory <code translate="no">plugins/</code> contiene i componenti aggiuntivi che conferiscono a Claude Code ulteriori capacità.</p>
<p>In questa directory sono memorizzati i <em>plugin</em> installati, la loro provenienza e le abilità extra che essi forniscono. Conserva anche le copie locali dei plugin scaricati, in modo che non debbano essere recuperati di nuovo.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - Dove vengono memorizzate e applicate le abilità</strong></p>
<p>In Claude Code, un'abilità è una piccola capacità riutilizzabile che aiuta Claude a svolgere un compito specifico, come lavorare con i PDF, modificare documenti o seguire un flusso di lavoro di codifica.</p>
<p>Non tutte le abilità sono disponibili ovunque. Alcune si applicano a livello globale, mentre altre sono limitate a un singolo progetto o fornite da un plugin. Claude Code memorizza le competenze in posizioni diverse per controllare dove ciascuna competenza può essere utilizzata.</p>
<p>La gerarchia che segue mostra come le competenze siano stratificate in base all'ambito, da quelle disponibili a livello globale a quelle specifiche di un progetto e a quelle fornite da un plugin.</p>
<table>
<thead>
<tr><th>Livello</th><th>Posizione di memorizzazione</th><th>Descrizione</th></tr>
</thead>
<tbody>
<tr><td>Utente</td><td>~/.claude/skills/</td><td>Disponibile a livello globale, accessibile da tutti i progetti</td></tr>
<tr><td>Progetto</td><td>progetto/.claude/skills/</td><td>Disponibile solo per il progetto corrente, personalizzazione specifica del progetto</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Installato con i plugin, dipende dallo stato di abilitazione dei plugin.</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - Archiviazione degli elenchi di attività</strong></p>
<p>La cartella <code translate="no">todos/</code> memorizza gli elenchi di attività che Claude crea per tenere traccia del lavoro durante una conversazione, come i passi da completare, gli elementi in corso e le attività completate.</p>
<p>Gli elenchi di attività sono salvati come file JSON sotto<code translate="no">~/.claude/todos/{session-id}-*.json</code>.Ogni nome di file include l'ID di sessione, che lega l'elenco di attività a una specifica conversazione.</p>
<p>I contenuti di questi file provengono dallo strumento <code translate="no">TodoWrite</code> e includono informazioni di base sulle attività, come la descrizione dell'attività, lo stato attuale, la priorità e i metadati correlati.</p>
<p><strong>(4) local/ - Runtime e strumenti locali</strong></p>
<p>La directory <code translate="no">local/</code> contiene i file fondamentali di cui Claude Code ha bisogno per funzionare sulla vostra macchina.</p>
<p>Comprende l'eseguibile da riga di comando <code translate="no">claude</code> e la directory <code translate="no">node_modules/</code> che contiene le sue dipendenze di runtime. Mantenendo questi componenti a livello locale, Claude Code può funzionare in modo indipendente, senza dipendere da servizi esterni o installazioni a livello di sistema.</p>
<p><strong>（5）Dirette di supporto aggiuntive</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Memorizza le istantanee dello stato della sessione di shell (come la directory corrente e le variabili d'ambiente), consentendo il rollback delle operazioni di shell.</p></li>
<li><p><strong>plans/:</strong> Memorizza i piani di esecuzione generati dalla modalità Piano (ad esempio, le suddivisioni passo-passo di attività di programmazione in più fasi).</p></li>
<li><p><strong>statsig/:</strong> Memorizza le configurazioni dei flag delle funzioni (come l'abilitazione di nuove funzioni) per ridurre le richieste ripetute.</p></li>
<li><p><strong>telemetria/:</strong> Memorizza dati di telemetria anonimi (come la frequenza di utilizzo delle funzioni) per l'ottimizzazione del prodotto.</p></li>
<li><p><strong>debug/:</strong> Memorizza i log di debug (compresi gli stack di errore e le tracce di esecuzione) per facilitare la risoluzione dei problemi.</p></li>
</ul>
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
    </button></h2><p>Dopo aver analizzato il modo in cui Claude Code memorizza e gestisce tutto a livello locale, il quadro diventa piuttosto chiaro: lo strumento è stabile perché le fondamenta sono solide. Non c'è nulla di sofisticato, ma solo un'ingegnerizzazione accurata. Ogni progetto ha il suo spazio, ogni azione viene annotata e le modifiche ai file vengono salvate prima di qualsiasi cambiamento. È il tipo di design che fa tranquillamente il suo lavoro e vi lascia concentrare sul vostro.</p>
<p>Ciò che mi piace di più è che non c'è nulla di mistico. Claude Code funziona bene perché le basi sono fatte bene. Se avete mai provato a costruire un agente che tocca file reali, sapete quanto sia facile che le cose vadano a rotoli: lo stato si mescola, i crash cancellano i progressi e l'annullamento diventa una congettura. Claude Code evita tutto questo grazie a un modello di archiviazione semplice, coerente e difficile da rompere.</p>
<p>Per i team che costruiscono agenti di intelligenza artificiale locali o on-premise, soprattutto in ambienti sicuri, questo approccio dimostra come una solida archiviazione e persistenza renda gli strumenti di intelligenza artificiale affidabili e pratici per lo sviluppo quotidiano.</p>
<p>Se state progettando agenti di intelligenza artificiale locali o on-premise e volete discutere più dettagliatamente dell'architettura di archiviazione, del design delle sessioni o del rollback sicuro, non esitate a unirvi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a>. Potete anche prenotare un incontro individuale di 20 minuti tramite <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> per una guida personalizzata.</p>

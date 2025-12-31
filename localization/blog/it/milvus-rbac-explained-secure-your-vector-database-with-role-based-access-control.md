---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Milvus RBAC spiegato: Proteggete il vostro database di vettori con il
  controllo degli accessi basato sui ruoli
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  Scoprite perché l'RBAC è importante, come funziona l'RBAC in Milvus, come
  configurare il controllo degli accessi e come consente l'accesso con il minor
  numero di privilegi, una chiara separazione dei ruoli e operazioni di
  produzione sicure.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Quando si costruisce un sistema di database, gli ingegneri dedicano la maggior parte del loro tempo alle prestazioni: tipi di indici, richiamo, latenza, throughput e scalabilità. Ma quando un sistema va oltre il laptop di un singolo sviluppatore, un'altra questione diventa altrettanto critica: <strong>chi può fare cosa all'interno del cluster Milvus</strong>? In altre parole, il controllo degli accessi.</p>
<p>In tutto il settore, molti incidenti operativi derivano da semplici errori di autorizzazione. Uno script viene eseguito nell'ambiente sbagliato. Un account di servizio ha un accesso più ampio di quello previsto. Una credenziale di amministrazione condivisa finisce in CI. Questi problemi di solito si presentano come domande molto pratiche:</p>
<ul>
<li><p>Gli sviluppatori possono cancellare le collezioni di produzione?</p></li>
<li><p>Perché un account di test può leggere i dati del vettore di produzione?</p></li>
<li><p>Perché più servizi accedono con lo stesso ruolo di amministratore?</p></li>
<li><p>I lavori di analisi possono avere accesso in sola lettura con zero privilegi di scrittura?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> affronta queste sfide con il <a href="https://milvus.io/docs/rbac.md">controllo degli accessi basato sui ruoli (RBAC)</a>. Invece di dare a ogni utente diritti di superamministratore o di cercare di imporre restrizioni nel codice dell'applicazione, RBAC consente di definire autorizzazioni precise a livello di database. Ogni utente o servizio ottiene esattamente le capacità di cui ha bisogno e niente di più.</p>
<p>Questo post spiega come funziona il RBAC in Milvus, come configurarlo e come applicarlo in modo sicuro negli ambienti di produzione.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Perché il controllo degli accessi è importante quando si usa Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando i team sono piccoli e le loro applicazioni AI servono solo un numero limitato di utenti, l'infrastruttura è solitamente semplice. Pochi ingegneri gestiscono il sistema; Milvus viene utilizzato solo per lo sviluppo o i test e i flussi di lavoro operativi sono semplici. In questa fase iniziale, il controllo degli accessi è raramente sentito come urgente, perché la superficie di rischio è ridotta e qualsiasi errore può essere facilmente annullato.</p>
<p>Quando Milvus entra in produzione e il numero di utenti, servizi e operatori cresce, il modello di utilizzo cambia rapidamente. Gli scenari più comuni includono:</p>
<ul>
<li><p>più sistemi aziendali che condividono la stessa istanza di Milvus</p></li>
<li><p>Più team che accedono alle stesse raccolte di vettori</p></li>
<li><p>Dati di test, staging e produzione che coesistono in un unico cluster</p></li>
<li><p>Ruoli diversi che necessitano di diversi livelli di accesso, dalle query di sola lettura alla scrittura e al controllo operativo.</p></li>
</ul>
<p>Senza confini di accesso ben definiti, queste configurazioni creano rischi prevedibili:</p>
<ul>
<li><p>I flussi di lavoro di test potrebbero cancellare accidentalmente le collezioni di produzione.</p></li>
<li><p>Gli sviluppatori potrebbero modificare involontariamente gli indici utilizzati dai servizi live.</p></li>
<li><p>L'uso diffuso dell'account <code translate="no">root</code> rende le azioni impossibili da rintracciare o verificare.</p></li>
<li><p>Un'applicazione compromessa potrebbe ottenere accesso illimitato a tutti i dati del vettore.</p></li>
</ul>
<p>Con l'aumento dell'utilizzo, affidarsi a convenzioni informali o ad account di amministrazione condivisi non è più sostenibile. Un modello di accesso coerente e applicabile diventa essenziale, ed è esattamente quello che Milvus RBAC fornisce.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Cos'è il RBAC in Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> è un modello di autorizzazione che controlla l'accesso in base ai <strong>ruoli</strong> piuttosto che ai singoli utenti. In Milvus, il RBAC consente di definire esattamente le operazioni che un utente o un servizio può eseguire e su quali risorse specifiche. Questo modello offre un modo strutturato e scalabile di gestire la sicurezza man mano che il sistema cresce, da un singolo sviluppatore a un ambiente di produzione completo.</p>
<p>Milvus RBAC si basa sui seguenti componenti principali:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Utenti Ruoli Privilegi</span> </span></p>
<ul>
<li><p><strong>Risorsa</strong>: L'entità a cui si accede. In Milvus, le risorse includono l'<strong>istanza</strong>, il <strong>database</strong> e la <strong>collezione</strong>.</p></li>
<li><p><strong>Privilegio</strong>: Un'operazione specifica consentita su una risorsa, ad esempio la creazione di una raccolta, l'inserimento di dati o la cancellazione di entità.</p></li>
<li><p><strong>Gruppo di privilegi</strong>: Un insieme predefinito di privilegi correlati, come "sola lettura" o "scrittura".</p></li>
<li><p><strong>Ruolo</strong>: Una combinazione di privilegi e risorse a cui si applicano. Un ruolo determina <em>quali</em> operazioni possono essere eseguite e <em>dove</em>.</p></li>
<li><p><strong>Utente</strong>: un'identità in Milvus. Ogni utente ha un ID unico e gli vengono assegnati uno o più ruoli.</p></li>
</ul>
<p>Questi componenti formano una chiara gerarchia:</p>
<ol>
<li><p><strong>Agli utenti vengono assegnati dei ruoli</strong></p></li>
<li><p><strong>I ruoli definiscono i privilegi</strong></p></li>
<li><p><strong>I privilegi si applicano a risorse specifiche</strong></p></li>
</ol>
<p>Un principio chiave della progettazione di Milvus è che i <strong>permessi non vengono mai assegnati direttamente agli utenti</strong>. Tutti gli accessi passano attraverso i ruoli. Questa indirezione semplifica l'amministrazione, riduce gli errori di configurazione e rende prevedibili le modifiche ai permessi.</p>
<p>Questo modello è perfettamente scalabile nelle implementazioni reali. Quando più utenti condividono un ruolo, l'aggiornamento dei privilegi del ruolo aggiorna istantaneamente le autorizzazioni per tutti gli utenti, senza modificare ogni singolo utente. Si tratta di un unico punto di controllo, in linea con le modalità di gestione degli accessi delle infrastrutture moderne.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Come funziona RBAC in Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un cliente invia una richiesta a Milvus, il sistema la valuta attraverso una serie di passaggi di autorizzazione. Ogni fase deve essere superata prima di poter procedere con l'operazione:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Come funziona RBAC in Milvus</span> </span></p>
<ol>
<li><p><strong>Autenticare la richiesta:</strong> Milvus verifica innanzitutto l'identità dell'utente. Se l'autenticazione fallisce, la richiesta viene rifiutata con un errore di autenticazione.</p></li>
<li><p><strong>Verifica dell'assegnazione dei ruoli:</strong> Dopo l'autenticazione, Milvus controlla se l'utente ha almeno un ruolo assegnato. Se non viene trovato alcun ruolo, la richiesta viene rifiutata con un errore di autorizzazione negata.</p></li>
<li><p><strong>Verifica dei privilegi richiesti:</strong> Milvus valuta quindi se il ruolo dell'utente concede i privilegi richiesti sulla risorsa di destinazione. Se la verifica dei privilegi fallisce, la richiesta viene rifiutata con un errore di autorizzazione negata.</p></li>
<li><p><strong>Esecuzione dell'operazione:</strong> Se tutti i controlli sono superati, Milvus esegue l'operazione richiesta e restituisce il risultato.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Come configurare il controllo degli accessi tramite RBAC in Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Prerequisiti</h3><p>Prima di poter valutare e applicare le regole RBAC, è necessario abilitare l'autenticazione degli utenti, in modo che ogni richiesta a Milvus possa essere associata a un'identità utente specifica.</p>
<p>Ecco due metodi di distribuzione standard.</p>
<ul>
<li><strong>Distribuzione con Docker Compose</strong></li>
</ul>
<p>Se Milvus viene distribuito con Docker Compose, modificare il file di configurazione <code translate="no">milvus.yaml</code> e abilitare l'autorizzazione impostando <code translate="no">common.security.authorizationEnabled</code> su <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Distribuzione con Helm Charts</strong></li>
</ul>
<p>Se Milvus viene distribuito utilizzando Helm Charts, modificare il file <code translate="no">values.yaml</code> e aggiungere la seguente configurazione sotto <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Inizializzazione</h3><p>Per impostazione predefinita, Milvus crea un utente integrato <code translate="no">root</code> all'avvio del sistema. La password predefinita per questo utente è <code translate="no">Milvus</code>.</p>
<p>Come misura di sicurezza iniziale, utilizzare l'utente <code translate="no">root</code> per connettersi a Milvus e cambiare immediatamente la password predefinita. Si raccomanda vivamente di utilizzare una password complessa per evitare accessi non autorizzati.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. Operazioni principali</h3><p><strong>Creare gli utenti</strong></p>
<p>Per l'uso quotidiano, si consiglia di creare utenti dedicati invece di usare l'account <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Creare ruoli</strong></p>
<p>Milvus fornisce un ruolo integrato <code translate="no">admin</code> con tutti i privilegi amministrativi. Per la maggior parte degli scenari di produzione, tuttavia, si consiglia di creare ruoli personalizzati per ottenere un controllo degli accessi a grana più fine.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Creare gruppi di privilegi</strong></p>
<p>Un gruppo di privilegi è un insieme di privilegi multipli. Per semplificare la gestione dei permessi, i privilegi correlati possono essere raggruppati e concessi insieme.</p>
<p>Milvus include i seguenti gruppi di privilegi incorporati:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>L'uso di questi gruppi di privilegi integrati può ridurre significativamente la complessità della progettazione dei permessi e migliorare la coerenza tra i ruoli.</p>
<p>È possibile utilizzare direttamente i gruppi di privilegi integrati o creare gruppi di privilegi personalizzati in base alle esigenze.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Assegnazione di privilegi o gruppi di privilegi ai ruoli</strong></p>
<p>Dopo la creazione di un ruolo, è possibile assegnargli privilegi o gruppi di privilegi. Le risorse di destinazione per questi privilegi possono essere specificate a diversi livelli, tra cui l'istanza, il database o le singole Collezioni.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Assegnare i ruoli agli utenti</strong></p>
<p>Una volta assegnati i ruoli a un utente, quest'ultimo può accedere alle risorse ed eseguire le operazioni definite da tali ruoli. A un singolo utente possono essere assegnati uno o più ruoli, a seconda dell'ambito di accesso richiesto.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Ispezione e revoca dell'accesso</h3><p><strong>Ispezione dei ruoli assegnati a un utente</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ispezione dei privilegi assegnati a un ruolo</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Revoca dei privilegi di un ruolo</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Revocare i ruoli a un utente</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Eliminare utenti e ruoli</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Esempio: Progettazione del controllo degli accessi per un sistema RAG alimentato da Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Consideriamo un sistema RAG (Retrieval-Augmented Generation) costruito su Milvus.</p>
<p>In questo sistema, i diversi componenti e utenti hanno responsabilità chiaramente separate e ciascuno richiede un diverso livello di accesso.</p>
<table>
<thead>
<tr><th>Attore</th><th>Responsabilità</th><th>Accesso richiesto</th></tr>
</thead>
<tbody>
<tr><td>Amministratore della piattaforma</td><td>Operazioni e configurazione del sistema</td><td>Amministrazione a livello di istanza</td></tr>
<tr><td>Servizio di ingestione vettoriale</td><td>Ingestione e aggiornamento dei dati vettoriali</td><td>Accesso in lettura e scrittura</td></tr>
<tr><td>Servizio di ricerca</td><td>Ricerca e recupero di vettori</td><td>Accesso in sola lettura</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Suggerimenti rapidi: Come gestire il controllo degli accessi in modo sicuro in produzione<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Per garantire che il controllo degli accessi rimanga efficace e gestibile nei sistemi di produzione a lungo termine, seguite queste linee guida pratiche.</p>
<p><strong>1. Modificare la</strong> <strong>password</strong><strong>predefinita</strong> di <code translate="no">root</code> <strong>e limitare l'uso dell'</strong> <strong>account</strong> <code translate="no">root</code>.</p>
<p>Aggiornate la password predefinita di <code translate="no">root</code> subito dopo l'inizializzazione e limitatene l'uso alle sole attività amministrative. Evitate di usare o condividere l'account root per le operazioni di routine. Create invece utenti e ruoli dedicati per l'accesso quotidiano per ridurre i rischi e migliorare la responsabilità.</p>
<p><strong>2. Isolare fisicamente le istanze Milvus da un ambiente all'altro</strong></p>
<p>Distribuite istanze Milvus separate per lo sviluppo, lo staging e la produzione. L'isolamento fisico fornisce un confine di sicurezza più forte del solo controllo logico degli accessi e riduce significativamente il rischio di errori tra ambienti.</p>
<p><strong>3. Seguire il principio del minimo privilegio</strong></p>
<p>Concedete solo i permessi necessari per ogni ruolo:</p>
<ul>
<li><p><strong>Ambienti di sviluppo: le</strong> autorizzazioni possono essere più permissive per supportare l'iterazione e i test<strong>.</strong> </p></li>
<li><p><strong>Ambienti di produzione: le</strong> autorizzazioni devono essere strettamente limitate allo stretto necessario.</p></li>
<li><p><strong>Verifiche regolari:</strong> riesaminare periodicamente i permessi esistenti per verificare che siano ancora necessari.</p></li>
</ul>
<p><strong>4. Revocare attivamente i permessi quando non sono più necessari.</strong></p>
<p>Il controllo degli accessi non è un'impostazione una tantum, ma richiede una manutenzione continua. Revocate tempestivamente ruoli e privilegi quando cambiano gli utenti, i servizi o le responsabilità. In questo modo si evita che i permessi inutilizzati si accumulino nel tempo e diventino rischi nascosti per la sicurezza.</p>
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
    </button></h2><p>La configurazione del controllo degli accessi in Milvus non è intrinsecamente complessa, ma è essenziale per far funzionare il sistema in modo sicuro e affidabile in produzione. Con un modello RBAC ben progettato, è possibile:</p>
<ul>
<li><p><strong>ridurre i rischi</strong> impedendo operazioni accidentali o distruttive</p></li>
<li><p><strong>Migliorare la sicurezza</strong> imponendo l'accesso con il minor numero di privilegi ai dati del vettore.</p></li>
<li><p><strong>standardizzare le operazioni</strong> attraverso una chiara separazione delle responsabilità</p></li>
<li><p><strong>Scalare con sicurezza</strong>, gettando le basi per implementazioni multi-tenant e su larga scala.</p></li>
</ul>
<p>Il controllo degli accessi non è una funzione opzionale o un'attività una tantum. È una parte fondamentale del funzionamento sicuro di Milvus a lungo termine.</p>
<p>Iniziate a costruire una solida base di sicurezza con <a href="https://milvus.io/docs/rbac.md">RBAC</a> per la vostra implementazione Milvus.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione dell'ultimo Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>

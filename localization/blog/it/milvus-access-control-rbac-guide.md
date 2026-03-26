---
id: milvus-access-control-rbac-guide.md
title: >-
  Guida al controllo degli accessi Milvus: Come configurare RBAC per la
  produzione
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Guida passo passo all'impostazione di Milvus RBAC in produzione: utenti,
  ruoli, gruppi di privilegi, accesso a livello di collezione e un esempio di
  sistema RAG completo.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Ecco una storia che è più comune di quanto dovrebbe essere: un ingegnere QA esegue uno script di pulizia contro quello che pensa sia l'ambiente di staging. Ma la stringa di connessione punta alla produzione. Pochi secondi dopo, le collezioni di vettori principali sono scomparse: i dati delle caratteristiche sono andati persi, la <a href="https://zilliz.com/glossary/similarity-search">ricerca per similarità</a> restituisce risultati vuoti, i servizi si degradano su tutta la linea. L'autopsia individua la stessa causa principale: tutti si connettevano come <code translate="no">root</code>, non c'erano limiti di accesso e nulla impediva a un account di test di eliminare i dati di produzione.</p>
<p>Non si tratta di un caso isolato. I team che costruiscono su <a href="https://milvus.io/">Milvus</a> - e sui <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriali</a> in generale - tendono a concentrarsi sulle <a href="https://zilliz.com/learn/vector-index">prestazioni degli indici</a>, sul throughput e sulla scalabilità dei dati, considerando il controllo degli accessi come un problema da affrontare in un secondo momento. Ma il "dopo" di solito arriva sotto forma di incidente. Quando Milvus passa dal prototipo alla spina dorsale delle <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipeline RAG di</a> produzione, dei motori di raccomandazione e della <a href="https://zilliz.com/learn/what-is-vector-search">ricerca vettoriale</a> in tempo reale, la domanda diventa inevitabile: chi può accedere al vostro cluster Milvus e che cosa può fare esattamente?</p>
<p>Milvus include un sistema RBAC integrato per rispondere a questa domanda. Questa guida spiega cos'è il RBAC, come Milvus lo implementa e come progettare un modello di controllo degli accessi che garantisca la sicurezza della produzione, con esempi di codice e un'analisi completa del sistema RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">Che cos'è il RBAC (Role-Based Access Control)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p>Il<strong>controllo degli accessi basato sui ruoli (RBAC)</strong> è un modello di sicurezza in cui i permessi non vengono assegnati direttamente ai singoli utenti. I permessi sono invece raggruppati in ruoli e agli utenti vengono assegnati uno o più ruoli. L'accesso effettivo di un utente è l'unione di tutti i permessi dei ruoli assegnati. RBAC è il modello di controllo degli accessi standard nei sistemi di database di produzione: PostgreSQL, MySQL, MongoDB e la maggior parte dei servizi cloud lo utilizzano.</p>
<p>RBAC risolve un problema fondamentale di scalabilità: quando si hanno decine di utenti e servizi, la gestione dei permessi per utente diventa impossibile da gestire. Con RBAC, si definisce un ruolo una volta sola (ad esempio, "sola lettura sulla collezione X"), lo si assegna a dieci servizi e lo si aggiorna in un unico posto quando i requisiti cambiano.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Come Milvus implementa il RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC si basa su quattro concetti:</p>
<table>
<thead>
<tr><th>Concetto</th><th>Che cos'è</th><th>Esempio</th></tr>
</thead>
<tbody>
<tr><td><strong>La risorsa</strong></td><td>L'oggetto a cui si accede</td><td>Un'<a href="https://milvus.io/docs/architecture_overview.md">istanza Milvus</a>, un <a href="https://milvus.io/docs/manage-databases.md">database</a> o una collezione specifica.</td></tr>
<tr><td><strong>Privilegio / Gruppo di privilegi</strong></td><td>L'azione che viene eseguita</td><td><code translate="no">Search</code> <code translate="no">Insert</code>, , o un gruppo come (collezione in sola lettura) <code translate="no">DropCollection</code> <code translate="no">COLL_RO</code> </td></tr>
<tr><td><strong>Ruolo</strong></td><td>Un insieme di privilegi nominati per le risorse</td><td><code translate="no">role_read_only</code>Può ricercare e interrogare tutte le collezioni nel database <code translate="no">default</code>.</td></tr>
<tr><td><strong>Utente</strong></td><td>Un account Milvus (umano o di servizio)</td><td><code translate="no">rag_writer</code>L'account di servizio utilizzato dalla pipeline di ingestione.</td></tr>
</tbody>
</table>
<p>L'accesso non viene mai assegnato direttamente agli utenti. Gli utenti ottengono ruoli, i ruoli contengono privilegi e i privilegi sono assegnati alle risorse. Si tratta dello stesso <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">modello RBAC</a> utilizzato nella maggior parte dei sistemi di database di produzione. Se dieci utenti condividono lo stesso ruolo, si aggiorna il ruolo una sola volta e la modifica si applica a tutti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Il modello RBAC di Milvus mostra come gli utenti sono assegnati ai ruoli e i ruoli contengono privilegi e gruppi di privilegi che si applicano alle risorse</span> </span>.</p>
<p>Quando una richiesta arriva a Milvus, passa attraverso tre controlli:</p>
<ol>
<li><strong>Autenticazione</strong> - si tratta di un utente valido con credenziali corrette?</li>
<li><strong>Controllo dei ruoli</strong> - questo utente ha almeno un ruolo assegnato?</li>
<li><strong>Controllo dei privilegi</strong> - uno dei ruoli dell'utente concede l'azione richiesta sulla risorsa richiesta?</li>
</ol>
<p>Se uno dei controlli fallisce, la richiesta viene rifiutata.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Flusso di autenticazione e autorizzazione Milvus: La richiesta del cliente passa attraverso l'autenticazione, il controllo dei ruoli e il controllo dei privilegi - rifiutata in qualsiasi fase non riuscita, viene eseguita solo se tutte le fasi sono superate.</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Come abilitare l'autenticazione in Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Per impostazione predefinita, Milvus funziona con l'autenticazione disabilitata: ogni connessione ha pieno accesso. Il primo passo è attivarla.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Modificare <code translate="no">milvus.yaml</code> e impostare <code translate="no">authorizationEnabled</code> su <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Grafici Helm</h3><p>Modificare <code translate="no">values.yaml</code> e aggiungere l'impostazione sotto <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Per le distribuzioni di <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> su <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, la stessa configurazione va inserita nella sezione <code translate="no">spec.config</code> di Milvus CR.</p>
<p>Una volta abilitata l'autenticazione e riavviato Milvus, ogni connessione deve fornire le credenziali. Milvus crea un utente predefinito <code translate="no">root</code> con la password <code translate="no">Milvus</code>, da cambiare immediatamente.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Configurazione di utenti, ruoli e privilegi<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Con l'autenticazione abilitata, ecco il tipico flusso di lavoro di configurazione.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Passo 1: Creare gli utenti</h3><p>Non lasciare che i servizi o i membri del team usino <code translate="no">root</code>. Creare account dedicati per ogni utente o servizio.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Passo 2: Creare i ruoli</h3><p>Milvus ha un ruolo incorporato in <code translate="no">admin</code>, ma in pratica è necessario creare ruoli personalizzati che corrispondano ai modelli di accesso effettivi.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Passo 3: creare gruppi di privilegi</h3><p>Un gruppo di privilegi raggruppa più privilegi sotto un unico nome, rendendo più facile la gestione degli accessi su scala. Milvus offre 9 gruppi di privilegi integrati:</p>
<table>
<thead>
<tr><th>Gruppo incorporato</th><th>Ambito di applicazione</th><th>Cosa consente</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Raccolta</td><td>Operazioni di sola lettura (interrogazione, ricerca, ecc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Raccolta</td><td>Operazioni di lettura e scrittura</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Raccolta</td><td>Gestione completa della raccolta</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Database</td><td>Operazioni di sola lettura sul database</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Database</td><td>Operazioni di lettura e scrittura del database</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Database</td><td>Gestione completa del database</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Operazioni sul cluster in sola lettura</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Operazioni di lettura e scrittura sul cluster</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Gestione completa del cluster</td></tr>
</tbody>
</table>
<p>È anche possibile creare gruppi di privilegi personalizzati quando quelli integrati non sono adatti:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Passo 4: Assegnare i privilegi a un ruolo</h3><p>Si concedono privilegi individuali o gruppi di privilegi a un ruolo, con un ambito di risorse specifiche. I parametri <code translate="no">collection_name</code> e <code translate="no">db_name</code> controllano l'ambito - usare <code translate="no">*</code> per tutti.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Passo 5: Assegnare i ruoli agli utenti</h3><p>Un utente può ricoprire più ruoli. Le autorizzazioni effettive sono l'unione di tutti i ruoli assegnati.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Come verificare e revocare l'accesso<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Sapere quali accessi esistono è importante quanto concederli. Le autorizzazioni obsolete, provenienti da ex membri del team, servizi in pensione o sessioni di debug una tantum, si accumulano silenziosamente e ampliano la superficie di attacco.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Controllare le autorizzazioni correnti</h3><p>Visualizzate i ruoli assegnati a un utente:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Visualizzare i privilegi concessi a un ruolo:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Revocare i privilegi a un ruolo</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Disassegnare un ruolo a un utente</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Eliminare utenti o ruoli</h3><p>Rimuovere tutte le assegnazioni di ruolo prima di eliminare un utente e revocare tutti i privilegi prima di eliminare un ruolo:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Esempio: Come progettare il RBAC per un sistema RAG di produzione<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>I concetti astratti diventano più comprensibili con un esempio concreto. Consideriamo un sistema <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> costruito su Milvus con tre servizi distinti:</p>
<table>
<thead>
<tr><th>Servizio</th><th>Responsabilità</th><th>Accesso richiesto</th></tr>
</thead>
<tbody>
<tr><td><strong>Amministratore della piattaforma</strong></td><td>Gestisce il cluster Milvus - crea collezioni, monitora lo stato di salute, gestisce gli aggiornamenti</td><td>Amministratore completo del cluster</td></tr>
<tr><td><strong>Servizio di ingestione</strong></td><td>Genera <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vettoriali</a> dai documenti e li scrive nelle raccolte</td><td>Lettura + scrittura sulle raccolte</td></tr>
<tr><td><strong>Servizio di ricerca</strong></td><td>Gestisce le query <a href="https://zilliz.com/learn/what-is-vector-search">di ricerca vettoriale</a> degli utenti finali</td><td>Solo lettura sulle collezioni</td></tr>
</tbody>
</table>
<p>Ecco una configurazione completa che utilizza <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ogni servizio ottiene esattamente l'accesso di cui ha bisogno. Il servizio di ricerca non può cancellare accidentalmente i dati. Il servizio di ingestione non può modificare le impostazioni del cluster. E se le credenziali del servizio di ricerca trapelano, l'attaccante può leggere i <a href="https://zilliz.com/glossary/vector-embeddings">vettori di incorporamento</a>, ma non può scrivere, cancellare o passare ad amministratore.</p>
<p>Per i team che gestiscono l'accesso a più implementazioni di Milvus, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestito) offre un RBAC integrato con una console web per la gestione di utenti, ruoli e autorizzazioni, senza bisogno di script. Utile quando si preferisce gestire l'accesso attraverso un'interfaccia utente piuttosto che mantenere script di configurazione in tutti gli ambienti.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Migliori pratiche di controllo degli accessi per la produzione<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Le fasi di configurazione sopra descritte sono la meccanica. Ecco i principi di progettazione che rendono il controllo degli accessi efficace nel tempo.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Bloccare l'account di root</h3><p>Cambiate la password predefinita di <code translate="no">root</code> prima di ogni altra cosa. In produzione, l'account di root deve essere usato solo per operazioni di emergenza e conservato in un gestore di segreti, non codificato nelle configurazioni delle applicazioni o condiviso su Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Separare completamente gli ambienti</h3><p>Utilizzate <a href="https://milvus.io/docs/architecture_overview.md">istanze Milvus</a> diverse per lo sviluppo, lo staging e la produzione. La separazione degli ambienti tramite il solo RBAC è fragile: basta una stringa di connessione mal configurata e un servizio di sviluppo scrive sui dati di produzione. La separazione fisica (cluster diversi, credenziali diverse) elimina completamente questa categoria di incidenti.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Applicare il minimo privilegio</h3><p>Date a ogni utente e servizio l'accesso minimo necessario per svolgere il proprio lavoro. Iniziate in modo ristretto e allargate solo quando c'è una necessità specifica e documentata. Negli ambienti di sviluppo si può essere più rilassati, ma l'accesso in produzione deve essere rigoroso e rivisto regolarmente.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Pulire gli accessi obsoleti</h3><p>Quando qualcuno lascia il team o un servizio viene dismesso, revocate i suoi ruoli e cancellate immediatamente i suoi account. Gli account non utilizzati con permessi attivi sono il vettore più comune di accesso non autorizzato: sono credenziali valide che nessuno controlla.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Estendere i privilegi a collezioni specifiche</h3><p>Evitate di concedere <code translate="no">collection_name='*'</code> a meno che il ruolo non abbia realmente bisogno di accedere a tutte le collezioni. Nelle configurazioni multi-tenant o nei sistemi con più pipeline di dati, ogni ruolo deve essere limitato alle sole <a href="https://milvus.io/docs/manage-collections.md">collezioni</a> su cui opera. Questo limita il raggio d'azione in caso di compromissione delle credenziali.</p>
<hr>
<p>Se state implementando <a href="https://milvus.io/">Milvus</a> in produzione e state lavorando sul controllo degli accessi, sulla sicurezza o sulla progettazione multi-tenant, saremo lieti di aiutarvi:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">community Milvus su Slack</a> per discutere di pratiche reali di implementazione con altri ingegneri che utilizzano Milvus su scala.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per esaminare il vostro progetto RBAC, che si tratti della struttura dei ruoli, dello scoping a livello di collezione o della sicurezza multi-ambiente.</li>
<li>Se preferite saltare la configurazione dell'infrastruttura e gestire il controllo degli accessi attraverso un'interfaccia utente, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) include un RBAC integrato con una console web, oltre alla <a href="https://zilliz.com/cloud-security">crittografia</a>, all'isolamento della rete e alla conformità SOC 2.</li>
</ul>
<hr>
<p>Alcune domande che sorgono quando i team iniziano a configurare il controllo degli accessi in Milvus:</p>
<p><strong>D: Posso limitare l'accesso di un utente solo a specifiche collezioni e non a tutte?</strong></p>
<p>Si. Quando si chiama <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>si imposta <code translate="no">collection_name</code> sulla collezione specifica piuttosto che <code translate="no">*</code>. Il ruolo dell'utente avrà accesso solo a quella collezione. È possibile concedere allo stesso ruolo privilegi su più raccolte, chiamando la funzione una volta per ogni raccolta.</p>
<p><strong>D: Qual è la differenza tra un privilegio e un gruppo di privilegi in Milvus?</strong></p>
<p>Un privilegio è una singola azione, come <code translate="no">Search</code>, <code translate="no">Insert</code> o <code translate="no">DropCollection</code>. Un <a href="https://milvus.io/docs/privilege_group.md">gruppo di privilegi</a> raggruppa più privilegi sotto un unico nome, ad esempio <code translate="no">COLL_RO</code> include tutte le operazioni di sola lettura della collezione. La concessione di un gruppo di privilegi è funzionalmente uguale alla concessione di ciascuno dei privilegi che lo compongono individualmente, ma è più facile da gestire.</p>
<p><strong>D: L'abilitazione dell'autenticazione influisce sulle prestazioni delle query di Milvus?</strong></p>
<p>L'overhead è trascurabile. Milvus convalida le credenziali e controlla i permessi dei ruoli a ogni richiesta, ma si tratta di una ricerca in memoria che aggiunge microsecondi, non millisecondi. Non c'è alcun impatto misurabile sulla latenza di <a href="https://milvus.io/docs/single-vector-search.md">ricerca</a> o di <a href="https://milvus.io/docs/insert-update-delete.md">inserimento</a>.</p>
<p><strong>D: Posso usare Milvus RBAC in una configurazione multi-tenant?</strong></p>
<p>Sì, è possibile. Creare ruoli separati per ogni tenant, estendere i privilegi di ogni ruolo alle collezioni di quel tenant e assegnare il ruolo corrispondente all'account di servizio di ogni tenant. In questo modo si ottiene un isolamento a livello di collezione senza bisogno di istanze Milvus separate. Per una multi-tenancy su larga scala, consultare la <a href="https://milvus.io/docs/multi_tenancy.md">guida</a> alla <a href="https://milvus.io/docs/multi_tenancy.md">multi-tenancy di Milvus</a>.</p>

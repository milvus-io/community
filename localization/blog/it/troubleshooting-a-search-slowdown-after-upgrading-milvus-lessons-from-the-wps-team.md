---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Risoluzione di un rallentamento della ricerca dopo l'aggiornamento di Milvus:
  le lezioni del team WPS
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus
meta_keywords: 'Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting'
meta_title: |
  Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >-
  Dopo l'aggiornamento di Milvus dalla versione 2.2 alla 2.5, il team WPS ha
  riscontrato una regressione della latenza di ricerca di 3-5 volte. La causa:
  un singolo flag di ripristino di milvus-backup che frammentava i segmenti.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Questo post è stato realizzato dal team di ingegneri WPS di Kingsoft Office Software, che utilizza Milvus in un sistema di raccomandazione. Durante l'aggiornamento da Milvus 2.2.16 a 2.5.16, la latenza di ricerca è aumentata da 3 a 5 volte. Questo articolo spiega come hanno analizzato e risolto il problema e può essere utile ad altri utenti della comunità che stanno pianificando un aggiornamento simile.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Perché abbiamo aggiornato Milvus<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Facciamo parte del team di ingegneri di WPS che costruisce software per la produttività e utilizziamo Milvus come motore di ricerca vettoriale per la ricerca di similarità in tempo reale nel nostro sistema di raccomandazione online. Il nostro cluster di produzione memorizzava decine di milioni di vettori, con una dimensione media di 768. I dati erano serviti da 16 QueryNodes e ogni pod era configurato con un limite di 16 core CPU e 48 GB di memoria.</p>
<p>Durante l'esecuzione di Milvus 2.2.16, abbiamo riscontrato un grave problema di stabilità che stava già influenzando l'attività. In caso di elevata concomitanza di query, <code translate="no">planparserv2.HandleCompare</code> poteva causare un'eccezione di puntatore nullo, mandando in panico il componente Proxy e riavviandolo frequentemente. Questo bug era molto facile da innescare in scenari di alta concorrenza e influiva direttamente sulla disponibilità del nostro servizio di raccomandazione online.</p>
<p>Di seguito sono riportati il registro degli errori di Proxy e lo stack trace dell'incidente:</p>
<pre><code translate="no">[<span class="hljs-meta">2025/12/23 10:43:13.581 +00:00</span>] [ERROR] [concurrency/pool_option.go:<span class="hljs-number">53</span>] [<span class="hljs-string">&quot;Conc pool panicked&quot;</span>]
[<span class="hljs-meta">panic=<span class="hljs-string">&quot;runtime error: invalid memory address or nil pointer dereference&quot;</span></span>]
[<span class="hljs-meta">stack=<span class="hljs-string">&quot;...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
...&quot;</span></span>]

panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference [recovered]
panic: runtime error: invalid memory address <span class="hljs-keyword">or</span> nil pointer dereference
[<span class="hljs-meta">signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a</span>]
  
goroutine <span class="hljs-number">989</span> [running]:
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/utils.go:<span class="hljs-number">331</span> +<span class="hljs-number">0x2a</span>
github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/<span class="hljs-keyword">internal</span>/parser/planparserv2/parser_visitor.go:<span class="hljs-number">345</span> +<span class="hljs-number">0x7e5</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Cosa mostra lo stack trace</strong>: Il panico si è verificato durante la preelaborazione della query in Proxy, all'interno di <code translate="no">queryTask.PreExecute</code>. Il percorso della chiamata era:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>L'arresto si è verificato quando <code translate="no">HandleCompare</code> ha tentato di accedere a una memoria non valida all'indirizzo <code translate="no">0x8</code>, innescando un SIGSEGV e causando l'arresto del processo Proxy.</p>
<p><strong>Per eliminare completamente questo rischio di stabilità, abbiamo deciso di aggiornare il cluster da Milvus 2.2.16 a 2.5.16.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Backup dei dati con milvus-backup prima dell'aggiornamento<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di toccare il cluster di produzione, abbiamo eseguito il backup di tutto utilizzando lo strumento ufficiale <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>. Questo strumento supporta il backup e il ripristino all'interno dello stesso cluster, tra cluster diversi e tra versioni diverse di Milvus.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Verifica della compatibilità delle versioni</h3><p>milvus-backup ha due regole di versione per i <a href="https://milvus.io/docs/milvus_backup_overview.md">ripristini tra versioni</a>:</p>
<ol>
<li><p><strong>Il cluster di destinazione deve eseguire la stessa versione di Milvus o una più recente.</strong> Un backup dalla versione 2.2 può essere caricato nella 2.5, ma non viceversa.</p></li>
<li><p><strong>La destinazione deve essere almeno Milvus 2.4.</strong> Le destinazioni di ripristino più vecchie non sono supportate.</p></li>
</ol>
<p>Il nostro percorso (backup da 2.2.16, caricamento in 2.5.16) soddisfa entrambe le regole.</p>
<table>
<thead>
<tr><th>Backup da ↓ \ Ripristino in →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Come funziona Milvus-Backup</h3><p>Milvus Backup facilita il backup e il ripristino di metadati, segmenti e dati tra le istanze Milvus. Fornisce interfacce northbound, come una CLI, un'API e un modulo Go basato su gRPC, per una manipolazione flessibile dei processi di backup e ripristino.</p>
<p>Milvus Backup legge i metadati e i segmenti della collezione dall'istanza Milvus di origine per creare un backup. Quindi copia i dati della collezione dal percorso principale dell'istanza Milvus di origine e li salva nel percorso principale del backup.</p>
<p>Per ripristinare da un backup, Milvus Backup crea una nuova raccolta nell'istanza Milvus di destinazione in base ai metadati della raccolta e alle informazioni sui segmenti del backup. Quindi copia i dati del backup dal percorso principale del backup al percorso principale dell'istanza di destinazione.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Esecuzione del backup</h3><p>Abbiamo preparato un file di configurazione dedicato, <code translate="no">configs/backup.yaml</code>. I campi principali sono mostrati di seguito, con i valori sensibili rimossi:</p>
<pre><code translate="no">milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Source Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Source Milvus port</span>
  user: root  <span class="hljs-comment"># Source Milvus username (must have backup permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Source Milvus user password</span>

  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Source Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Source <span class="hljs-built_in">object</span> storage AK&gt;  
  secretAccessKey: &lt;Source <span class="hljs-built_in">object</span> storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Source object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>Abbiamo quindi eseguito questo comando:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> supporta il <strong>backup a caldo</strong>, quindi di solito ha un impatto minimo sul traffico online. L'esecuzione durante le ore non di punta è comunque più sicura per evitare la contesa delle risorse.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Verifica del backup</h3><p>Al termine del backup, abbiamo verificato che fosse completo e utilizzabile. Abbiamo controllato soprattutto se il numero di raccolte e di segmenti del backup corrispondeva a quello del cluster di origine.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>La corrispondenza c'è stata, quindi siamo passati all'aggiornamento.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Aggiornamento con Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Il salto di tre versioni principali (2.2 → 2.5) con decine di milioni di vettori rendeva troppo rischioso un aggiornamento in-place. Abbiamo invece costruito un nuovo cluster e vi abbiamo migrato i dati. Il vecchio cluster è rimasto online per il rollback.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Distribuzione del nuovo cluster</h3><p>Abbiamo distribuito il nuovo cluster Milvus 2.5.16 con Helm:</p>
<pre><code translate="no"><span class="hljs-comment"># Add the Milvus Helm repository</span>
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
<span class="hljs-comment"># Check the Helm chart version corresponding to the target Milvus version</span>
: helm search repo milvus/milvus -l | grep <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>
milvus/milvus        <span class="hljs-number">4.2</span><span class="hljs-number">.58</span>               <span class="hljs-number">2.5</span><span class="hljs-number">.16</span>                    Milvus <span class="hljs-keyword">is</span> an <span class="hljs-built_in">open</span>-source vector database built ...
  
<span class="hljs-comment"># Deploy the new version cluster (with mmap disabled)</span>
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version <span class="hljs-number">4.2</span><span class="hljs-number">.58</span> \
  --wait
<button class="copy-code-btn"></button></code></pre>
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Cambiamenti chiave di configurazione (<code translate="no">values-v25.yaml</code>)</h3><p>Per rendere equo il confronto delle prestazioni, abbiamo mantenuto il nuovo cluster il più possibile simile al vecchio. Abbiamo modificato solo alcune impostazioni importanti per questo carico di lavoro:</p>
<ul>
<li><p><strong>Disabilitare Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Il carico di lavoro della nostra raccomandazione è sensibile alla latenza. Se Mmap è abilitato, alcuni dati possono essere letti dal disco quando necessario, il che può aggiungere un ritardo nell'I/O del disco e causare picchi di latenza. L'abbiamo disattivata in modo che i dati restino completamente in memoria e la latenza delle query sia più stabile.</p></li>
<li><p><strong>Numero di QueryNode:</strong> mantenuto a <strong>16</strong>, come nel vecchio cluster.</p></li>
<li><p><strong>Limiti di risorse:</strong> ogni Pod aveva ancora <strong>16 core di CPU</strong>, come il vecchio cluster.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Suggerimenti per gli aggiornamenti delle versioni principali:</h3><ul>
<li><p><strong>Costruire un nuovo cluster invece di eseguire l'aggiornamento in loco.</strong> Si evitano i rischi di compatibilità dei metadati e si mantiene un percorso di rollback pulito.</p></li>
<li><p><strong>Verificare il backup prima della migrazione.</strong> Una volta che i dati sono nel formato della nuova versione, non è facile tornare indietro.</p></li>
<li><p><strong>Mantenete entrambi i cluster in funzione durante il cutover.</strong> Spostate il traffico gradualmente e smantellate il vecchio cluster solo dopo una verifica completa.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Migrazione dei dati dopo l'aggiornamento con Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo usato <code translate="no">milvus-backup restore</code> per caricare il backup nel nuovo cluster. Nella terminologia di milvus-backup, "restore" significa "caricare i dati di backup in un cluster di destinazione". La destinazione deve eseguire la stessa versione di Milvus o una più recente, quindi, nonostante il nome, i ripristini spostano sempre i dati in avanti.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Esecuzione del ripristino</h3><p>Il file di configurazione del ripristino, <code translate="no">configs/restore.yaml</code>, doveva puntare al <strong>nuovo cluster</strong> e alle sue impostazioni di archiviazione. I campi principali avevano questo aspetto:</p>
<pre><code translate="no"><span class="hljs-comment"># Restore target Milvus connection information</span>
milvus:
  address: <span class="hljs-number">1.1</span><span class="hljs-number">.1</span><span class="hljs-number">.1</span>  <span class="hljs-comment"># Milvus address</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Milvus port</span>
  user: root  <span class="hljs-comment"># Milvus username (must have restore permissions)</span>
  password: &lt;PASS&gt; <span class="hljs-comment"># Milvus user password  </span>
  etcd:
    endpoints: <span class="hljs-string">&quot;2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379&quot;</span> <span class="hljs-comment"># Endpoints of the etcd cluster connected to the target Milvus</span>
    rootPath: <span class="hljs-string">&quot;by-dev&quot;</span>  <span class="hljs-comment"># Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.</span>

minio:
  <span class="hljs-comment"># Target Milvus object storage bucket configuration</span>
  storageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative</span>
  address: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  port: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  accessKeyID: &lt;Object storage AK&gt;  
  secretAccessKey: &lt;Object storage SK&gt; 
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;Object storage bucket name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;file&quot;</span> <span class="hljs-comment"># Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.</span>

  <span class="hljs-comment"># Object storage bucket configuration for storing backup data</span>
  backupStorageType: <span class="hljs-string">&quot;aliyun&quot;</span> <span class="hljs-comment"># support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)</span>
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com <span class="hljs-comment"># Address of MinIO/S3</span>
  backupPort: <span class="hljs-number">443</span>   <span class="hljs-comment"># Port of MinIO/S3</span>
  backupAccessKeyID: &lt;Backup bucket AK&gt; 
  backupSecretAccessKey: &lt;Backup bucket SK&gt; 
  backupBucketName: &lt;Backup bucket name&gt;
  backupRootPath: <span class="hljs-string">&quot;backup&quot;</span> <span class="hljs-comment"># Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath</span>
  backupUseSSL: true <span class="hljs-comment"># Access MinIO/S3 with SSL</span>
  crossStorage: <span class="hljs-string">&quot;true&quot;</span>  <span class="hljs-comment"># Must be set to true when performing cross-storage backup</span>
<button class="copy-code-btn"></button></code></pre>
<p>Abbiamo quindi eseguito:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> ha bisogno delle informazioni di connessione di Milvus e MinIO del nuovo cluster, in modo che i dati ripristinati vengano scritti sullo storage del nuovo cluster.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Controlli dopo il ripristino</h3><p>Al termine del ripristino, abbiamo controllato quattro cose per assicurarci che la migrazione fosse corretta:</p>
<ul>
<li><p><strong>Schema.</strong> Lo schema della raccolta nel nuovo cluster doveva corrispondere esattamente a quello vecchio, comprese le definizioni dei campi e le dimensioni dei vettori.</p></li>
<li><p><strong>Numero totale di righe.</strong> Abbiamo confrontato il numero totale di entità nel vecchio e nel nuovo cluster per assicurarci che non andassero persi dati.</p></li>
<li><p><strong>Stato degli indici.</strong> Abbiamo verificato che tutti gli indici avessero terminato la costruzione e che il loro stato fosse impostato su <code translate="no">Finished</code>.</p></li>
<li><p><strong>Risultati delle query.</strong> Abbiamo eseguito le stesse query su entrambi i cluster e abbiamo confrontato gli ID e i punteggi di distanza restituiti per verificare che i risultati corrispondessero.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Spostamento graduale del traffico e sorpresa della latenza<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo spostato il traffico di produzione sul nuovo cluster in più fasi:</p>
<table>
<thead>
<tr><th>Fase</th><th>Quota di traffico</th><th>Durata</th><th>Cosa abbiamo osservato</th></tr>
</thead>
<tbody>
<tr><td>Fase 1</td><td>5%</td><td>24 ore</td><td>Latenza delle query P99, tasso di errore e accuratezza dei risultati</td></tr>
<tr><td>Fase 2</td><td>25%</td><td>48 ore</td><td>Latenza delle interrogazioni P99/P95, QPS, uso della CPU</td></tr>
<tr><td>Fase 3</td><td>50%</td><td>48 ore</td><td>Metriche end-to-end, utilizzo delle risorse</td></tr>
<tr><td>Fase 4</td><td>100%</td><td>Monitoraggio continuo</td><td>Stabilità complessiva delle metriche</td></tr>
</tbody>
</table>
<p>Abbiamo mantenuto il vecchio cluster in funzione per tutto il tempo per un rollback istantaneo.</p>
<p><strong>Durante questo rollout, abbiamo individuato il problema: la latenza di ricerca sul nuovo cluster v2.5.16 era da 3 a 5 volte superiore a quella del vecchio cluster v2.2.16.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Trovare la causa del rallentamento della ricerca<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Passo 1: controllare l'utilizzo complessivo della CPU</h3><p>Abbiamo iniziato con l'utilizzo della CPU per ogni componente per vedere se il cluster era a corto di risorse.</p>
<table>
<thead>
<tr><th>Componente</th><th>Utilizzo della CPU (core)</th><th>Analisi</th></tr>
</thead>
<tbody>
<tr><td>QueryNode</td><td>10.1</td><td>Il limite era di 16 core, quindi l'utilizzo era di circa il 63%. Non completamente utilizzato</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Molto basso</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Molto basso</td></tr>
<tr><td>NodoDati</td><td>0.14</td><td>Molto basso</td></tr>
<tr><td>Nodo indice</td><td>0.02</td><td>Molto basso</td></tr>
</tbody>
</table>
<p>Questo dimostra che QueryNode aveva ancora abbastanza CPU disponibile. Quindi il rallentamento <strong>non è stato causato da una carenza generale di CPU</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Passo 2: controllare il bilanciamento di QueryNode</h3><p>La CPU totale sembrava a posto, ma i singoli pod QueryNode presentavano un <strong>chiaro squilibrio</strong>:</p>
<table>
<thead>
<tr><th>Pod QueryNode</th><th>Utilizzo della CPU (ultimo)</th><th>Utilizzo della CPU (massimo)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>querynode-pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>querynode-pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>querynode-pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>querynode-pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>querynode-pod-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>querynode-pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>querynode-pod-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 ha utilizzato quasi il doppio della CPU rispetto a Pod-8. Questo è un problema perché Milvus distribuisce una query a tutti i QueryNode e aspetta che il più lento finisca. Alcuni pod sovraccarichi stavano trascinando ogni singola ricerca.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Passo 3: confrontare la distribuzione dei segmenti</h3><p>Un carico irregolare di solito indica una distribuzione dei dati non uniforme, quindi abbiamo confrontato i layout dei segmenti tra il vecchio e il nuovo cluster.</p>
<p><strong>layout del segmento v2.2.16 (13 segmenti in totale)</strong></p>
<table>
<thead>
<tr><th>Intervallo di conteggio delle righe</th><th>Numero di segmenti</th><th>Stato</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Sigillato</td></tr>
<tr><td>533,630</td><td>1</td><td>Sigillato</td></tr>
</tbody>
</table>
<p>Il vecchio cluster era abbastanza uniforme. Aveva solo 13 segmenti e la maggior parte di essi conteneva circa <strong>740.000 righe</strong>.</p>
<p><strong>layout del segmento v2.5.16 (21 segmenti in totale)</strong></p>
<table>
<thead>
<tr><th>Intervallo di conteggio delle righe</th><th>Numero di segmenti</th><th>Stato</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Sigillato</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Sigillato</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Sigillato</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Sigillato</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Sigillato</td></tr>
</tbody>
</table>
<p>Il nuovo cluster aveva un aspetto molto diverso. Aveva 21 segmenti (il 60% in più), con dimensioni variabili: alcuni contenevano ~685k righe, altri appena 350k. Il ripristino aveva disperso i dati in modo non uniforme.</p>
<h3 id="Root-Cause" class="common-anchor-header">La causa principale</h3><p>Il problema è riconducibile al comando di ripristino originale:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Il flag <code translate="no">--use_v2_restore</code> abilita la modalità di ripristino con fusione dei segmenti, che raggruppa più segmenti in un unico lavoro di ripristino. Questa modalità è progettata per velocizzare i ripristini quando si hanno molti segmenti piccoli.</p>
<p>Ma nel nostro ripristino cross-version (2.2 → 2.5), la logica v2 ricostruiva i segmenti in modo diverso dal cluster originale: divideva i segmenti grandi in segmenti più piccoli e di dimensioni non uniformi. Una volta caricati, alcuni QueryNode si bloccavano con più dati di altri.</p>
<p>Questo ha compromesso le prestazioni in tre modi:</p>
<ul>
<li><p><strong>Nodi caldi:</strong> I QueryNode con segmenti più grandi o più numerosi dovevano svolgere più lavoro.</p></li>
<li><p><strong>Effetto del nodo più lento: la</strong> latenza della query distribuita dipende dal nodo più lento.</p></li>
<li><p><strong>Maggiore overhead di fusione:</strong> un maggior numero di segmenti comportava anche un maggior lavoro di fusione dei risultati.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">La correzione</h3><p>Abbiamo rimosso <code translate="no">--use_v2_restore</code> e ripristinato la logica predefinita:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Abbiamo prima ripulito i dati danneggiati dal nuovo cluster, quindi abbiamo eseguito il ripristino predefinito. La distribuzione dei segmenti è tornata in equilibrio, la latenza di ricerca è tornata normale e il problema è scomparso.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Cosa faremmo di diverso la prossima volta<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo caso, ci è voluto troppo tempo per trovare il vero problema: la <strong>distribuzione non uniforme dei segmenti</strong>. Ecco cosa avremmo fatto più velocemente.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Migliorare il monitoraggio dei segmenti</h3><p>Milvus non espone il conteggio dei segmenti, la distribuzione delle righe o la distribuzione delle dimensioni per collezione nelle dashboard standard di Grafana. Abbiamo dovuto scavare manualmente in <a href="https://github.com/zilliztech/attu">Attu</a> e etcd, il che è stato lento.</p>
<p>Sarebbe utile aggiungere</p>
<ul>
<li><p>una <strong>dashboard della distribuzione dei segmenti</strong> in Grafana, che mostri quanti segmenti ogni QueryNode ha caricato, oltre al conteggio delle righe e alle loro dimensioni</p></li>
<li><p>un <strong>avviso di sbilanciamento</strong>, che si attiva quando il conteggio delle righe dei segmenti tra i nodi supera una determinata soglia</p></li>
<li><p>una <strong>vista di confronto della migrazione</strong>, in modo che gli utenti possano confrontare la distribuzione dei segmenti tra il vecchio e il nuovo cluster dopo un aggiornamento.</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Utilizzare una lista di controllo standard per la migrazione</h3><p>Abbiamo controllato il conteggio delle righe e l'abbiamo considerato a posto. Ma non basta. Una convalida completa post-migrazione deve riguardare anche:</p>
<ul>
<li><p><strong>Coerenza dello schema.</strong> Le definizioni dei campi e le dimensioni dei vettori corrispondono?</p></li>
<li><p><strong>Conteggio dei segmenti.</strong> Il numero di segmenti è cambiato drasticamente?</p></li>
<li><p><strong>Equilibrio dei segmenti.</strong> Il conteggio delle righe tra i segmenti è ragionevolmente uniforme?</p></li>
<li><p><strong>Stato degli indici.</strong> Tutti gli indici sono <code translate="no">finished</code>?</p></li>
<li><p><strong>Parametro di latenza.</strong> Le latenze delle query P50, P95 e P99 sono simili a quelle del vecchio cluster?</p></li>
<li><p><strong>Bilanciamento del carico.</strong> L'utilizzo della CPU di QueryNode è distribuito uniformemente tra i pod?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Aggiungere controlli automatici</h3><p>È possibile eseguire lo script di questa validazione con PyMilvus per individuare gli squilibri prima che arrivino in produzione:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection  
<span class="hljs-keyword">def</span> <span class="hljs-title function_">check_segment_balance</span>(<span class="hljs-params">collection_name: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Check Segment distribution balance&quot;&quot;&quot;</span>
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    <span class="hljs-comment"># Group statistics by QueryNode</span>
    node_stats = {}
    <span class="hljs-keyword">for</span> seg <span class="hljs-keyword">in</span> segments:
        node_id = seg.nodeID
        <span class="hljs-keyword">if</span> node_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> node_stats:
            node_stats[node_id] = {<span class="hljs-string">&quot;count&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;rows&quot;</span>: <span class="hljs-number">0</span>}
        node_stats[node_id][<span class="hljs-string">&quot;count&quot;</span>] += <span class="hljs-number">1</span>
        node_stats[node_id][<span class="hljs-string">&quot;rows&quot;</span>] += seg.num_rows
    <span class="hljs-comment"># Calculate balance</span>
    row_counts = [v[<span class="hljs-string">&quot;rows&quot;</span>] <span class="hljs-keyword">for</span> v <span class="hljs-keyword">in</span> node_stats.values()]
    avg_rows = <span class="hljs-built_in">sum</span>(row_counts) / <span class="hljs-built_in">len</span>(row_counts)
    max_deviation = <span class="hljs-built_in">max</span>(<span class="hljs-built_in">abs</span>(r - avg_rows) / avg_rows <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> row_counts)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Number of nodes: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(node_stats)}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Average row count: <span class="hljs-subst">{avg_rows:<span class="hljs-number">.0</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Maximum deviation: <span class="hljs-subst">{max_deviation:<span class="hljs-number">.2</span>%}</span>&quot;</span>)
    <span class="hljs-keyword">if</span> max_deviation &gt; <span class="hljs-number">0.2</span>:  <span class="hljs-comment"># Raise a warning if deviation exceeds 20%</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;⚠️ Warning: Segment distribution is unbalanced and may affect query performance!&quot;</span>)
    <span class="hljs-keyword">for</span> node_id, stats <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(node_stats.items()):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Node <span class="hljs-subst">{node_id}</span>: <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;count&#x27;</span>]}</span> segments, <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;rows&#x27;</span>]}</span> rows&quot;</span>)
  
<span class="hljs-comment"># Usage example</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
check_segment_balance(<span class="hljs-string">&quot;your_collection_name&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Utilizzare meglio gli strumenti esistenti</h3><p>Alcuni strumenti supportano già la diagnostica a livello di segmento:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> può leggere direttamente i metadati Etcd e mostrare la disposizione dei segmenti e l'assegnazione dei canali.</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> permette di ispezionare visivamente le informazioni sui segmenti</p></li>
<li><p><strong>Grafana + Prometheus:</strong> può essere utilizzato per costruire dashboard personalizzate per il monitoraggio del cluster in tempo reale.</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Suggerimenti per la comunità Milvus<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Alcune modifiche a Milvus renderebbero più facile questo tipo di risoluzione dei problemi:</p>
<ol>
<li><p><strong>Spiegare più chiaramente la compatibilità dei parametriI</strong>documenti di <code translate="no">milvus-backup</code> dovrebbero spiegare chiaramente come si comportano le opzioni come <code translate="no">--use_v2_restore</code> durante i ripristini cross-version e i rischi che possono introdurre.</p></li>
<li><p><strong>Aggiungere controlli migliori dopo il ripristinoUna volta</strong>terminato <code translate="no">restore</code>, sarebbe utile se lo strumento stampasse automaticamente un riepilogo della distribuzione dei segmenti.</p></li>
<li><p><strong>Esporre le metriche relative al bilanciamentoLe</strong>metriche di<strong>Prometheus</strong>dovrebbero includere le informazioni sul bilanciamento dei segmenti, in modo che gli utenti possano monitorarle direttamente.</p></li>
<li><p><strong>Supportare l'analisi del piano di querySimilmente</strong>a MySQL <code translate="no">EXPLAIN</code>, Milvus trarrebbe vantaggio da uno strumento che mostri come viene eseguita una query e aiuti a individuare i problemi di prestazioni.</p></li>
</ol>
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
    </button></h2><p>Per riassumere:</p>
<table>
<thead>
<tr><th>Fase</th><th>Strumento / Metodo</th><th>Punto chiave</th></tr>
</thead>
<tbody>
<tr><td>Backup</td><td>milvus-backup creare</td><td>Il backup a caldo è supportato, ma il backup deve essere controllato attentamente.</td></tr>
<tr><td>Aggiornamento</td><td>Creare un nuovo cluster con Helm</td><td>Disabilitare Mmap per ridurre il jitter I/O e mantenere le impostazioni delle risorse uguali a quelle del vecchio cluster.</td></tr>
<tr><td>Migrazione</td><td>milvus-backup restore</td><td>Fare attenzione a --use_v2_restore. Nel ripristino cross-version, non usate la logica non predefinita a meno che non la comprendiate chiaramente.</td></tr>
<tr><td>Rollout grigio</td><td>Spostamento graduale del traffico</td><td>Spostare il traffico per gradi: 5% → 25% → 50% → 100%, e mantenere il vecchio cluster pronto per il rollback.</td></tr>
<tr><td>Risoluzione dei problemi</td><td>Grafana + analisi del segmento</td><td>Non limitatevi a considerare la CPU e la memoria. Controllare anche il bilanciamento dei segmenti e la distribuzione dei dati</td></tr>
<tr><td>Correggere</td><td>Rimuovere i dati errati e ripristinarli di nuovo</td><td>Rimuovere il flag sbagliato, ripristinare con la logica predefinita e le prestazioni tornano alla normalità.</td></tr>
</tbody>
</table>
<p>Quando si migrano i dati, è importante considerare non solo se i dati sono presenti e accurati. È necessario prestare attenzione anche alla <strong>distribuzione</strong> <strong>dei dati</strong>.</p>
<p>Il conteggio e le dimensioni dei segmenti determinano l'uniformità con cui Milvus distribuisce il lavoro di query tra i nodi. Quando i segmenti sono sbilanciati, alcuni nodi finiscono per fare la maggior parte del lavoro e ogni ricerca ne paga le conseguenze. Gli aggiornamenti tra versioni diverse comportano un rischio aggiuntivo, perché il processo di ripristino può ricostruire i segmenti in modo diverso rispetto al cluster originale. Flag come <code translate="no">--use_v2_restore</code> possono frammentare i dati in modi che il solo conteggio delle righe non può mostrare.</p>
<p>Pertanto, l'approccio più sicuro nella migrazione di più versioni è quello di attenersi alle impostazioni di ripristino predefinite, a meno che non si abbia una ragione specifica per fare diversamente. Inoltre, il monitoraggio dovrebbe andare oltre la CPU e la memoria; è necessario conoscere il layout dei dati sottostanti, in particolare la distribuzione e il bilanciamento dei segmenti, per individuare i problemi in anticipo.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Una nota del team Milvus<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Vorremmo ringraziare il team di ingegneri di WPS per aver condiviso questa esperienza con la comunità Milvus. Scritti come questo sono preziosi perché catturano lezioni di produzione reali e le rendono utili ad altri che si trovano ad affrontare problemi simili.</p>
<p>Se il vostro team ha una lezione tecnica, una storia di risoluzione dei problemi o un'esperienza pratica che vale la pena condividere, ci piacerebbe sentirla. Iscrivetevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> e contattateci lì.</p>
<p>E se anche voi state affrontando dei problemi, questi stessi canali della comunità sono un buon posto per entrare in contatto con gli ingegneri Milvus e altri utenti. È anche possibile prenotare una sessione individuale attraverso gli <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">orari di ufficio di Milvus</a> per ottenere assistenza su backup e ripristino, aggiornamenti di versioni diverse e prestazioni delle query.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>

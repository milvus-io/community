---
id: >-
  troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >-
  Fehlerbehebung bei der Verlangsamung der Suche nach einem Milvus-Upgrade:
  Lektionen vom WPS-Team
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
  Nach dem Upgrade von Milvus von 2.2 auf 2.5 stieß das WPS-Team auf eine
  3-5fache Verringerung der Suchlatenz. Die Ursache: ein einzelnes milvus-backup
  restore flag, das Segmente fragmentierte.
origin: >-
  https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---
<p><em>Dieser Beitrag wurde vom WPS-Entwicklungsteam bei Kingsoft Office Software verfasst, das Milvus in einem Empfehlungssystem einsetzt. Während des Upgrades von Milvus 2.2.16 auf 2.5.16 stieg die Suchlatenz um das 3- bis 5-fache. In diesem Artikel wird beschrieben, wie das Problem untersucht und behoben wurde. Vielleicht ist er auch für andere Mitglieder der Community hilfreich, die ein ähnliches Upgrade planen.</em></p>
<h2 id="Why-We-Upgraded-Milvus" class="common-anchor-header">Warum wir Milvus upgegradet haben<button data-href="#Why-We-Upgraded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir sind Teil des WPS-Ingenieurteams, das Produktivitätssoftware entwickelt, und wir verwenden Milvus als Vektorsuchmaschine für die Ähnlichkeitssuche in Echtzeit in unserem Online-Empfehlungssystem. Unser Produktionscluster speicherte Dutzende von Millionen von Vektoren mit einer durchschnittlichen Dimension von 768. Die Daten wurden von 16 QueryNodes verarbeitet, und jeder Pod wurde mit einer Höchstgrenze von 16 CPU-Kernen und 48 GB Speicher konfiguriert.</p>
<p>Bei der Ausführung von Milvus 2.2.16 stießen wir auf ein ernsthaftes Stabilitätsproblem, das sich bereits auf den Betrieb auswirkte. Bei hoher Abfragekonkurrenz konnte <code translate="no">planparserv2.HandleCompare</code> eine Null-Pointer-Ausnahme verursachen, was dazu führte, dass die Proxy-Komponente in Panik geriet und häufig neu gestartet wurde. Dieser Fehler konnte in Szenarien mit hoher Parallelität sehr leicht ausgelöst werden und hatte direkte Auswirkungen auf die Verfügbarkeit unseres Online-Empfehlungsdienstes.</p>
<p>Nachfolgend finden Sie das aktuelle Proxy-Fehlerprotokoll und die Stack-Trace des Vorfalls:</p>
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
<p><strong>Was der Stack-Trace zeigt</strong>: Die Panik trat während der Abfragevorverarbeitung in Proxy auf, innerhalb von <code translate="no">queryTask.PreExecute</code>. Der Aufrufpfad war:</p>
<p><code translate="no">taskScheduler.processTask</code> → <code translate="no">queryTask.PreExecute</code> → <code translate="no">planparserv2.CreateRetrievePlan</code> → <code translate="no">planparserv2.HandleCompare</code></p>
<p>Der Absturz trat auf, als <code translate="no">HandleCompare</code> versuchte, auf ungültigen Speicher an der Adresse <code translate="no">0x8</code> zuzugreifen, wodurch ein SIGSEGV ausgelöst und der Proxy-Prozess zum Absturz gebracht wurde.</p>
<p><strong>Um dieses Stabilitätsrisiko vollständig zu beseitigen, beschlossen wir, den Cluster von Milvus 2.2.16 auf 2.5.16 zu aktualisieren.</strong></p>
<h2 id="Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="common-anchor-header">Sichern der Daten mit milvus-backup vor dem Upgrade<button data-href="#Backing-Up-Data-With-milvus-backup-Before-the-Upgrade" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir den Produktionscluster anfassten, sicherten wir alles mit dem offiziellen <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a> Tool. Es unterstützt die Sicherung und Wiederherstellung innerhalb desselben Clusters, zwischen Clustern und zwischen verschiedenen Milvus-Versionen.</p>
<h3 id="Checking-Version-Compatibility" class="common-anchor-header">Überprüfung der Versionskompatibilität</h3><p>milvus-backup hat zwei Versionsregeln für <a href="https://milvus.io/docs/milvus_backup_overview.md">versionsübergreifende Wiederherstellungen</a>:</p>
<ol>
<li><p><strong>Der Zielcluster muss die gleiche oder eine neuere Milvus-Version verwenden.</strong> Eine Sicherung von 2.2 kann in 2.5 geladen werden, aber nicht umgekehrt.</p></li>
<li><p><strong>Das Ziel muss mindestens Milvus 2.4 sein.</strong> Ältere Wiederherstellungsziele werden nicht unterstützt.</p></li>
</ol>
<p>Unser Weg (Sicherung von 2.2.16, Laden in 2.5.16) erfüllte beide Regeln.</p>
<table>
<thead>
<tr><th>Sichern von ↓ \ Wiederherstellen nach →</th><th>2.4</th><th>2.5</th><th>2.6</th></tr>
</thead>
<tbody>
<tr><td>2.2</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.3</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.4</td><td>✅</td><td>✅</td><td>✅</td></tr>
<tr><td>2.5</td><td>❌</td><td>✅</td><td>✅</td></tr>
<tr><td>2.6</td><td>❌</td><td>❌</td><td>✅</td></tr>
</tbody>
</table>
<h3 id="How-Milvus-Backup-Works" class="common-anchor-header">Wie Milvus-Backup funktioniert</h3><p>Milvus-Backup erleichtert die Sicherung und Wiederherstellung von Metadaten, Segmenten und Daten über Milvus-Instanzen hinweg. Es bietet Northbound-Schnittstellen, wie z.B. eine CLI, eine API und ein gRPC-basiertes Go-Modul, zur flexiblen Manipulation von Sicherungs- und Wiederherstellungsprozessen.</p>
<p>Milvus Backup liest Sammlungsmetadaten und -segmente aus der Milvus-Quellinstanz, um ein Backup zu erstellen. Anschließend kopiert es die Sammlungsdaten aus dem Stammverzeichnis der Milvus-Quellinstanz und speichert sie im Stammverzeichnis der Sicherung.</p>
<p>Um von einem Backup wiederherzustellen, erstellt Milvus Backup eine neue Sammlung in der Ziel-Milvus-Instanz, basierend auf den Metadaten und Segmentinformationen der Sammlung im Backup. Dann kopiert es die Sicherungsdaten aus dem Stammverzeichnis der Sicherung in das Stammverzeichnis der Zielinstanz.</p>
<h3 id="Running-the-Backup" class="common-anchor-header">Ausführen des Backups</h3><p>Wir haben eine eigene Konfigurationsdatei <code translate="no">configs/backup.yaml</code> erstellt. Die wichtigsten Felder sind unten dargestellt, wobei sensible Werte entfernt wurden:</p>
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
<p>Wir haben dann diesen Befehl ausgeführt:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a backup using milvus-backup</span>
./milvus-backup create --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus-backup</code> unterstützt <strong>Hot-Backup</strong>, so dass es in der Regel kaum Auswirkungen auf den Online-Verkehr hat. Es ist immer noch sicherer, die Sicherung außerhalb der Hauptverkehrszeiten durchzuführen, um eine Überlastung der Ressourcen zu vermeiden.</p>
<h3 id="Verifying-the-Backup" class="common-anchor-header">Überprüfung des Backups</h3><p>Nachdem die Sicherung abgeschlossen war, überprüften wir, ob sie vollständig und brauchbar war. Wir überprüften vor allem, ob die Anzahl der Sammlungen und Segmente in der Sicherung mit denen im Quellcluster übereinstimmte.</p>
<pre><code translate="no" class="language-# List backups">./milvus-backup list --config configs/backup.yaml
<span class="hljs-comment"># View backup details and confirm the number of Collections and Segments</span>
./milvus-backup get --config configs/backup.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Sie stimmten überein, also fuhren wir mit dem Upgrade fort.</p>
<h2 id="Upgrading-With-Helm-Chart" class="common-anchor-header">Aufrüstung mit Helm Chart<button data-href="#Upgrading-With-Helm-Chart" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Sprung zwischen drei Hauptversionen (2.2 → 2.5) mit zig Millionen Vektoren machte ein In-Place-Upgrade zu riskant. Wir bauten stattdessen einen neuen Cluster und migrierten die Daten dorthin. Der alte Cluster blieb für das Rollback online.</p>
<h3 id="Deploying-the-New-Cluster" class="common-anchor-header">Einsatz des neuen Clusters</h3><p>Wir setzten den neuen Milvus 2.5.16-Cluster mit Helm ein:</p>
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
<h3 id="Key-Configuration-Changes-values-v25yaml" class="common-anchor-header">Wichtige Konfigurationsänderungen (<code translate="no">values-v25.yaml</code>)</h3><p>Um den Leistungsvergleich fair zu gestalten, haben wir den neuen Cluster dem alten so ähnlich wie möglich gehalten. Wir haben nur einige wenige Einstellungen geändert, die für diese Arbeitslast von Bedeutung waren:</p>
<ul>
<li><p><strong>Deaktivieren Sie Mmap</strong> (<code translate="no">mmap.enabled: false</code>): Unser Empfehlungs-Workload reagiert empfindlich auf Latenzzeiten. Wenn Mmap aktiviert ist, werden einige Daten bei Bedarf von der Festplatte gelesen, was zu Verzögerungen bei der Festplatten-E/A und zu Latenzspitzen führen kann. Wir haben sie deaktiviert, damit die Daten vollständig im Speicher bleiben und die Abfragelatenz stabiler ist.</p></li>
<li><p><strong>Anzahl der Abfrageknoten:</strong> Beibehaltung von <strong>16</strong>, wie im alten Cluster</p></li>
<li><p><strong>Ressourcenbeschränkungen:</strong> Jeder Pod hatte weiterhin <strong>16 CPU-Kerne</strong>, genau wie der alte Cluster.</p></li>
</ul>
<h3 id="Tips-for-major-version-upgrades" class="common-anchor-header">Tipps für Upgrades von Hauptversionen:</h3><ul>
<li><p><strong>Bauen Sie einen neuen Cluster auf, anstatt ein Upgrade vorzunehmen.</strong> So vermeiden Sie Metadaten-Kompatibilitätsrisiken und erhalten einen sauberen Rollback-Pfad.</p></li>
<li><p><strong>Überprüfen Sie Ihr Backup vor der Migration.</strong> Sobald die Daten im Format der neuen Version vorliegen, können Sie nicht mehr ohne weiteres zurückgehen.</p></li>
<li><p><strong>Lassen Sie beide Cluster während der Umstellung laufen.</strong> Verlagern Sie den Datenverkehr schrittweise und schalten Sie den alten Cluster erst nach vollständiger Überprüfung ab.</p></li>
</ul>
<h2 id="Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="common-anchor-header">Datenmigration nach dem Upgrade mit Milvus-Backup Restore<button data-href="#Migrating-Data-After-the-Upgrade-with-Milvus-Backup-Restore" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben <code translate="no">milvus-backup restore</code> verwendet, um das Backup in den neuen Cluster zu laden. In der Terminologie von Milvus-Backup bedeutet "wiederherstellen" "Sicherungsdaten in einen Zielcluster laden". Das Ziel muss mit der gleichen oder einer neueren Milvus-Version arbeiten, so dass Wiederherstellungen trotz des Namens die Daten immer vorwärts bewegen.</p>
<h3 id="Running-the-Restore" class="common-anchor-header">Ausführen der Wiederherstellung</h3><p>Die Konfigurationsdatei für die Wiederherstellung, <code translate="no">configs/restore.yaml</code>, musste auf den <strong>neuen Cluster</strong> und seine Speichereinstellungen verweisen. Die Hauptfelder sahen wie folgt aus:</p>
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
<p>Wir haben dann ausgeführt:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">restore.yaml</code> benötigt die Milvus- und MinIO-Verbindungsinformationen des neuen Clusters, damit die wiederhergestellten Daten in den Speicher des neuen Clusters geschrieben werden.</p>
<h3 id="Checks-After-Restore" class="common-anchor-header">Überprüfungen nach der Wiederherstellung</h3><p>Nachdem die Wiederherstellung abgeschlossen war, haben wir vier Dinge überprüft, um sicherzustellen, dass die Migration korrekt war:</p>
<ul>
<li><p><strong>Schema.</strong> Das Sammlungsschema im neuen Cluster musste exakt mit dem alten übereinstimmen, einschließlich der Felddefinitionen und Vektordimensionen.</p></li>
<li><p><strong>Gesamtzahl der Zeilen.</strong> Wir verglichen die Gesamtzahl der Entitäten in den alten und neuen Clustern, um sicherzustellen, dass keine Daten verloren gegangen sind.</p></li>
<li><p><strong>Index-Status.</strong> Wir bestätigten, dass alle Indizes fertig aufgebaut waren und dass ihr Status auf <code translate="no">Finished</code> gesetzt war.</p></li>
<li><p><strong>Abfrageergebnisse.</strong> Wir führten dieselben Abfragen in beiden Clustern durch und verglichen die zurückgegebenen IDs und Distanzwerte, um sicherzustellen, dass die Ergebnisse übereinstimmten.</p></li>
</ul>
<h2 id="Gradual-Traffic-Shift-and-the-Latency-Surprise" class="common-anchor-header">Allmähliche Verkehrsverlagerung und die Latenzüberraschung<button data-href="#Gradual-Traffic-Shift-and-the-Latency-Surprise" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir verlagerten den Produktionsverkehr schrittweise auf den neuen Cluster:</p>
<table>
<thead>
<tr><th>Phase</th><th>Anteil des Datenverkehrs</th><th>Dauer</th><th>Was wir beobachtet haben</th></tr>
</thead>
<tbody>
<tr><td>Phase 1</td><td>5%</td><td>24 Stunden</td><td>P99-Abfrage-Latenzzeit, Fehlerrate und Ergebnisgenauigkeit</td></tr>
<tr><td>Phase 2</td><td>25%</td><td>48 Stunden</td><td>P99/P95-Abfrage-Latenz, QPS, CPU-Nutzung</td></tr>
<tr><td>Phase 3</td><td>50%</td><td>48 Stunden</td><td>End-to-End-Metriken, Ressourcennutzung</td></tr>
<tr><td>Phase 4</td><td>100%</td><td>Fortgesetzte Überwachung</td><td>Stabilität der Gesamtmetrik</td></tr>
</tbody>
</table>
<p>Wir ließen den alten Cluster die ganze Zeit über für ein sofortiges Rollback laufen.</p>
<p><strong>Während dieses Rollbacks entdeckten wir das Problem: Die Suchlatenz war auf dem neuen v2.5.16-Cluster 3-5 Mal höher als auf dem alten v2.2.16-Cluster.</strong></p>
<h2 id="Finding-the-Cause-of-the-Search-Slowdown" class="common-anchor-header">Suche nach der Ursache für die Suchverlangsamung<button data-href="#Finding-the-Cause-of-the-Search-Slowdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Check-Overall-CPU-Usage" class="common-anchor-header">Schritt 1: Überprüfung der gesamten CPU-Auslastung</h3><p>Wir begannen mit der CPU-Auslastung pro Komponente, um festzustellen, ob der Cluster knapp an Ressourcen war.</p>
<table>
<thead>
<tr><th>Komponente</th><th>CPU-Auslastung (Kerne)</th><th>Analyse</th></tr>
</thead>
<tbody>
<tr><td>Abfrageknoten</td><td>10.1</td><td>Das Limit lag bei 16 Kernen, die Auslastung betrug also etwa 63 %. Nicht vollständig genutzt</td></tr>
<tr><td>Proxy</td><td>0.21</td><td>Sehr niedrig</td></tr>
<tr><td>MixCoord</td><td>0.11</td><td>Sehr niedrig</td></tr>
<tr><td>DataNode</td><td>0.14</td><td>Sehr niedrig</td></tr>
<tr><td>IndexKnoten</td><td>0.02</td><td>Sehr niedrig</td></tr>
</tbody>
</table>
<p>Dies zeigt, dass QueryNode noch genügend CPU zur Verfügung hatte. Die Verlangsamung wurde also <strong>nicht durch einen allgemeinen CPU-Mangel verursacht</strong>.</p>
<h3 id="Step-2-Check-QueryNode-Balance" class="common-anchor-header">Schritt 2: QueryNode-Balance prüfen</h3><p>Die Gesamt-CPU sah gut aus, aber einzelne QueryNode-Pods wiesen ein <strong>deutliches Ungleichgewicht</strong> auf:</p>
<table>
<thead>
<tr><th>QueryNode-Pod</th><th>CPU-Auslastung (Letzte)</th><th>CPU-Auslastung (Max)</th></tr>
</thead>
<tbody>
<tr><td>querynode-pod-1</td><td>8.38%</td><td>9.91%</td></tr>
<tr><td>querynode-pod-2</td><td>5.34%</td><td>6.85%</td></tr>
<tr><td>Quersynode-Pod-3</td><td>4.37%</td><td>6.73%</td></tr>
<tr><td>Quersynode-Pod-4</td><td>4.26%</td><td>5.89%</td></tr>
<tr><td>Quersynode-Pod-5</td><td>3.39%</td><td>4.82%</td></tr>
<tr><td>Quersynode-Pod-6</td><td>3.97%</td><td>4.56%</td></tr>
<tr><td>Querynode-Knoten-7</td><td>2.65%</td><td>4.46%</td></tr>
<tr><td>Quersynode-Pod-8</td><td>2.01%</td><td>3.84%</td></tr>
<tr><td>Querynode-Knoten-9</td><td>3.68%</td><td>3.69%</td></tr>
</tbody>
</table>
<p>Pod-1 verbrauchte fast 5x so viel CPU wie Pod-8. Das ist ein Problem, weil Milvus eine Abfrage auf alle QueryNodes verteilt und wartet, bis der langsamste fertig ist. Einige überlastete Pods zogen jede einzelne Suche in die Länge.</p>
<h3 id="Step-3-Compare-Segment-Distribution" class="common-anchor-header">Schritt 3: Vergleichen Sie die Segmentverteilung</h3><p>Eine ungleichmäßige Auslastung deutet in der Regel auf eine ungleichmäßige Datenverteilung hin, daher haben wir die Segment-Layouts zwischen dem alten und dem neuen Cluster verglichen.</p>
<p><strong>v2.2.16 Segment-Layout (13 Segmente insgesamt)</strong></p>
<table>
<thead>
<tr><th>Bereich der Zeilenzahl</th><th>Anzahl der Segmente</th><th>Zustand</th></tr>
</thead>
<tbody>
<tr><td>740,000 ~ 745,000</td><td>12</td><td>Versiegelt</td></tr>
<tr><td>533,630</td><td>1</td><td>Versiegelt</td></tr>
</tbody>
</table>
<p>Der alte Cluster war ziemlich gleichmäßig. Er hatte nur 13 Segmente, und die meisten davon hatten etwa <strong>740.000 Zeilen</strong>.</p>
<p><strong>v2.5.16 Segment-Layout (21 Segmente insgesamt)</strong></p>
<table>
<thead>
<tr><th>Bereich der Zeilenzahl</th><th>Anzahl der Segmente</th><th>Zustand</th></tr>
</thead>
<tbody>
<tr><td>680,000 ~ 685,000</td><td>4</td><td>Versiegelt</td></tr>
<tr><td>560,000 ~ 682,550</td><td>5</td><td>Versiegelt</td></tr>
<tr><td>421,575 ~ 481,800</td><td>4</td><td>Versiegelt</td></tr>
<tr><td>358,575 ~ 399,725</td><td>4</td><td>Versiegelt</td></tr>
<tr><td>379,650 ~ 461,725</td><td>4</td><td>Versiegelt</td></tr>
</tbody>
</table>
<p>Der neue Cluster sah ganz anders aus. Er hatte 21 Segmente (60 % mehr), mit unterschiedlicher Segmentgröße: einige enthielten ~685k Zeilen, andere kaum 350k. Die Wiederherstellung hatte die Daten ungleichmäßig verstreut.</p>
<h3 id="Root-Cause" class="common-anchor-header">Grundursache</h3><p>Wir haben das Problem auf unseren ursprünglichen Wiederherstellungsbefehl zurückgeführt:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
<button class="copy-code-btn"></button></code></pre>
<p>Das Flag <code translate="no">--use_v2_restore</code> aktiviert den Wiederherstellungsmodus "Segment Merging", der mehrere Segmente in einem einzigen Wiederherstellungsauftrag zusammenfasst. Dieser Modus wurde entwickelt, um die Wiederherstellung zu beschleunigen, wenn viele kleine Segmente vorhanden sind.</p>
<p>Bei unserer versionsübergreifenden Wiederherstellung (2.2 → 2.5) baute die v2-Logik die Segmente jedoch anders als der ursprüngliche Cluster wieder auf: Sie teilte große Segmente in kleinere, ungleichmäßig große Segmente auf. Nach dem Laden blieben einige QueryNodes mit mehr Daten hängen als andere.</p>
<p>Dies beeinträchtigte die Leistung in dreifacher Hinsicht:</p>
<ul>
<li><p><strong>Heiße Knoten:</strong> QueryNodes mit größeren oder mehr Segmenten mussten mehr Arbeit verrichten</p></li>
<li><p><strong>Effekt des langsamsten Knotens:</strong> Die Latenzzeit verteilter Abfragen hängt vom langsamsten Knoten ab</p></li>
<li><p><strong>Mehr Overhead beim Zusammenführen:</strong> Mehr Segmente bedeuteten auch mehr Arbeit beim Zusammenführen der Ergebnisse.</p></li>
</ul>
<h3 id="The-Fix" class="common-anchor-header">Die Korrektur</h3><p>Wir haben <code translate="no">--use_v2_restore</code> entfernt und mit der Standardlogik wiederhergestellt:</p>
<pre><code translate="no">./milvus-backup restore --config configs/restore.yaml -n backup_v2216
<button class="copy-code-btn"></button></code></pre>
<p>Wir bereinigten zunächst die fehlerhaften Daten aus dem neuen Cluster und führten dann die Standardwiederherstellung durch. Die Segmentverteilung war wieder ausgeglichen, die Suchlatenz normal und das Problem war beseitigt.</p>
<h2 id="What-Wed-Do-Differently-Next-Time" class="common-anchor-header">Was wir beim nächsten Mal anders machen würden<button data-href="#What-Wed-Do-Differently-Next-Time" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Fall haben wir zu lange gebraucht, um das eigentliche Problem zu finden: die <strong>ungleichmäßige Segmentverteilung</strong>. Mit den folgenden Maßnahmen wäre es schneller gegangen.</p>
<h3 id="Improve-Segment-Monitoring" class="common-anchor-header">Verbessern Sie die Segmentüberwachung</h3><p>Milvus zeigt die Anzahl der Segmente, die Zeilenverteilung oder die Größenverteilung pro Sammlung nicht in den Standard-Dashboards von Grafana an. Wir mussten uns manuell durch <a href="https://github.com/zilliztech/attu">Attu</a> und etcd wühlen, was langsam war.</p>
<p>Es würde helfen, etwas hinzuzufügen:</p>
<ul>
<li><p>ein <strong>Dashboard zur Segmentverteilung</strong> in Grafana, das anzeigt, wie viele Segmente jeder QueryNode geladen hat, sowie deren Zeilenzahl und Größe</p></li>
<li><p>einen <strong>Ungleichgewichtsalarm</strong>, der ausgelöst wird, wenn die Anzahl der Segmentzeilen auf den Knoten einen bestimmten Schwellenwert überschreitet</p></li>
<li><p>eine <strong>Migrationsvergleichsansicht</strong>, damit Benutzer die Segmentverteilung zwischen den alten und neuen Clustern nach einem Upgrade vergleichen können</p></li>
</ul>
<h3 id="Use-a-Standard-Migration-Checklist" class="common-anchor-header">Verwendung einer Standard-Migrations-Checkliste</h3><p>Wir überprüften die Zeilenzahl und befanden sie für in Ordnung. Das war aber nicht genug. Eine vollständige Validierung nach der Migration sollte auch Folgendes umfassen</p>
<ul>
<li><p><strong>Schema-Konsistenz.</strong> Stimmen Felddefinitionen und Vektordimensionen überein?</p></li>
<li><p><strong>Segmentanzahl.</strong> Hat sich die Anzahl der Segmente drastisch geändert?</p></li>
<li><p><strong>Ausgewogenheit der Segmente.</strong> Sind die Zeilenzahlen in den Segmenten einigermaßen gleichmäßig?</p></li>
<li><p><strong>Index-Status.</strong> Sind alle Indizes <code translate="no">finished</code>?</p></li>
<li><p><strong>Latenz-Benchmark.</strong> Sind die P50-, P95- und P99-Abfragelatenzen mit denen des alten Clusters vergleichbar?</p></li>
<li><p><strong>Lastausgleich.</strong> Ist die CPU-Auslastung von QueryNode gleichmäßig auf die Pods verteilt?</p></li>
</ul>
<h3 id="Add-Automated-Checks" class="common-anchor-header">Automatisierte Überprüfungen hinzufügen</h3><p>Sie können diese Validierung mit PyMilvus skripten, um Ungleichgewichte zu erkennen, bevor sie in der Produktion auftreten:</p>
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
<h3 id="Use-Existing-Tools-Better" class="common-anchor-header">Bestehende Tools besser nutzen</h3><p>Einige Tools unterstützen bereits Diagnosen auf Segmentebene:</p>
<ul>
<li><p><strong>Birdwatcher:</strong> kann Etcd-Metadaten direkt lesen und Segment-Layout und Kanalzuweisung anzeigen</p></li>
<li><p><strong>Milvus Web UI (v2.5+):</strong> ermöglicht die visuelle Überprüfung von Segmentinformationen</p></li>
<li><p><strong>Grafana + Prometheus:</strong> kann verwendet werden, um benutzerdefinierte Dashboards für die Echtzeitüberwachung von Clustern zu erstellen</p></li>
</ul>
<h2 id="Suggestions-for-the-Milvus-Community" class="common-anchor-header">Vorschläge für die Milvus Community<button data-href="#Suggestions-for-the-Milvus-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein paar Änderungen an Milvus würden diese Art der Fehlerbehebung erleichtern:</p>
<ol>
<li><p><strong>Parameter-Kompatibilität klarer erklärenDie</strong> <code translate="no">milvus-backup</code> -Dokumente sollten klar erklären, wie sich Optionen wie <code translate="no">--use_v2_restore</code> bei versionsübergreifenden Wiederherstellungen verhalten und welche Risiken sie mit sich bringen können.</p></li>
<li><p><strong>Bessere Prüfungen nach der Wiederherstellung hinzufügenNach</strong>Abschluss der <code translate="no">restore</code> wäre es hilfreich, wenn das Tool automatisch eine Zusammenfassung der Segmentverteilung ausgeben würde.</p></li>
<li><p><strong>Gleichgewichtsbezogene Metriken anzeigenDie Prometheus-Metriken</strong>sollten Informationen über das Segmentgleichgewicht enthalten, damit die Benutzer es direkt überwachen können.</p></li>
<li><p><strong>Unterstützung der AbfrageplananalyseAnalog</strong>zu MySQL <code translate="no">EXPLAIN</code> würde Milvus von einem Tool profitieren, das zeigt, wie eine Abfrage ausgeführt wird, und dabei hilft, Leistungsprobleme zu finden.</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusammengefasst:</p>
<table>
<thead>
<tr><th>Stufe</th><th>Werkzeug/Methode</th><th>Wichtigster Punkt</th></tr>
</thead>
<tbody>
<tr><td>Sicherung</td><td>milvus-backup erstellen</td><td>Hot-Backup wird unterstützt, aber das Backup muss sorgfältig überprüft werden</td></tr>
<tr><td>Upgrade</td><td>Erstellen Sie einen neuen Cluster mit Helm</td><td>Deaktivieren Sie Mmap, um I/O-Jitter zu reduzieren, und behalten Sie die Ressourceneinstellungen des alten Clusters bei.</td></tr>
<tr><td>Migration</td><td>milvus-backup wiederherstellen</td><td>Seien Sie vorsichtig mit --use_v2_restore. Verwenden Sie bei der versionsübergreifenden Wiederherstellung keine Logik, die nicht dem Standard entspricht, es sei denn, Sie verstehen sie genau.</td></tr>
<tr><td>Grauer Rollout</td><td>Schrittweise Verlagerung des Datenverkehrs</td><td>Verschieben Sie den Datenverkehr in Stufen: 5% → 25% → 50% → 100%, und halten Sie den alten Cluster für das Rollback bereit</td></tr>
<tr><td>Fehlersuche</td><td>Grafana + Segmentanalyse</td><td>Schauen Sie nicht nur auf CPU und Speicher. Prüfen Sie auch die Segmentbalance und die Datenverteilung</td></tr>
<tr><td>beheben</td><td>Schlechte Daten entfernen und wiederherstellen</td><td>Entfernen Sie das falsche Flag, stellen Sie es mit der Standardlogik wieder her, und die Leistung ist wieder normal</td></tr>
</tbody>
</table>
<p>Bei der Migration von Daten ist es wichtig, nicht nur darauf zu achten, ob die Daten vorhanden und korrekt sind. Sie müssen auch darauf achten, <strong>wie die Daten</strong> <strong>verteilt sind</strong>.</p>
<p>Segmentanzahl und Segmentgrößen bestimmen, wie gleichmäßig Milvus die Abfragearbeit auf die Knoten verteilt. Wenn die Segmente unausgewogen sind, wird die meiste Arbeit von einigen wenigen Knoten erledigt, und jede Suche zahlt dafür. Versionsübergreifende Upgrades bergen hier ein zusätzliches Risiko, da der Wiederherstellungsprozess Segmente anders als der ursprüngliche Cluster wiederherstellen kann. Flags wie <code translate="no">--use_v2_restore</code> können Ihre Daten auf eine Art und Weise fragmentieren, die die Zeilenzählung allein nicht erkennen lässt.</p>
<p>Daher ist es am sichersten, bei einer versionsübergreifenden Migration die Standardeinstellungen für die Wiederherstellung beizubehalten, es sei denn, Sie haben einen besonderen Grund, etwas anderes zu tun. Außerdem sollte die Überwachung über CPU und Speicher hinausgehen; Sie brauchen einen Einblick in das zugrunde liegende Datenlayout, insbesondere die Segmentverteilung und -balance, um Probleme früher zu erkennen.</p>
<h2 id="A-Note-from-the-Milvus-Team" class="common-anchor-header">Eine Anmerkung des Milvus-Teams<button data-href="#A-Note-from-the-Milvus-Team" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir möchten dem WPS-Entwicklungsteam dafür danken, dass es diese Erfahrung mit der Milvus-Gemeinschaft geteilt hat. Berichte wie dieser sind wertvoll, weil sie reale Produktionserfahrungen festhalten und sie für andere, die vor ähnlichen Problemen stehen, nützlich machen.</p>
<p>Wenn Ihr Team eine technische Lektion, eine Geschichte zur Fehlerbehebung oder eine praktische Erfahrung hat, die es wert ist, geteilt zu werden, würden wir uns freuen, von Ihnen zu hören. Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei und kontaktieren Sie uns dort.</p>
<p>Und wenn Sie mit eigenen Herausforderungen zu kämpfen haben, sind die gleichen Community-Kanäle ein guter Ort, um mit Milvus-Ingenieuren und anderen Benutzern in Kontakt zu treten. Sie können auch eine persönliche Sitzung über die <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> buchen, um Hilfe bei der Sicherung und Wiederherstellung, bei versionsübergreifenden Upgrades und der Abfrageleistung zu erhalten.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>

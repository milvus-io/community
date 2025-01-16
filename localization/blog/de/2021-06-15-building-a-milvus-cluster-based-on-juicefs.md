---
id: building-a-milvus-cluster-based-on-juicefs.md
title: Was ist JuiceFS?
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: >-
  Erfahren Sie, wie Sie einen Milvus-Cluster auf Basis von JuiceFS, einem
  gemeinsam genutzten Dateisystem für Cloud-native Umgebungen, aufbauen.
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>Aufbau eines Milvus-Clusters auf Basis von JuiceFS</custom-h1><p>Die Zusammenarbeit zwischen Open-Source-Gemeinschaften ist eine magische Sache. Leidenschaftliche, intelligente und kreative Freiwillige sorgen nicht nur dafür, dass Open-Source-Lösungen innovativ bleiben, sondern auch dafür, dass verschiedene Tools auf interessante und nützliche Weise zusammengeführt werden. <a href="https://milvus.io/">Milvus</a>, die weltweit beliebteste Vektordatenbank, und <a href="https://github.com/juicedata/juicefs">JuiceFS</a>, ein gemeinsam genutztes Dateisystem für Cloud-native Umgebungen, wurden von ihren jeweiligen Open-Source-Gemeinschaften in diesem Sinne zusammengeführt. In diesem Artikel wird erklärt, was JuiceFS ist, wie man einen Milvus-Cluster auf der Grundlage des gemeinsamen Dateispeichers JuiceFS aufbaut und welche Leistung die Benutzer von dieser Lösung erwarten können.</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>Was ist JuiceFS?</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFS ist ein leistungsstarkes, quelloffenes, verteiltes POSIX-Dateisystem, das auf Redis und S3 aufgebaut werden kann. Es wurde für Cloud-native Umgebungen entwickelt und unterstützt das Verwalten, Analysieren, Archivieren und Sichern von Daten jeglicher Art. JuiceFS wird häufig für die Lösung von Big-Data-Herausforderungen, den Aufbau von Anwendungen für künstliche Intelligenz (KI) und die Protokollerfassung verwendet. Das System unterstützt auch die gemeinsame Nutzung von Daten durch mehrere Clients und kann direkt als gemeinsamer Speicher in Milvus verwendet werden.</p>
<p>Nachdem die Daten und die zugehörigen Metadaten im Objektspeicher bzw. in <a href="https://redis.io/">Redis</a> persistiert wurden, dient JuiceFS als zustandslose Middleware. Die gemeinsame Nutzung von Daten wird dadurch realisiert, dass verschiedene Anwendungen über eine Standard-Dateisystemschnittstelle nahtlos aneinander andocken können. JuiceFS nutzt Redis, einen Open-Source-In-Memory-Datenspeicher, für die Speicherung von Metadaten. Redis wird verwendet, weil es Atomarität garantiert und hochleistungsfähige Metadatenoperationen bietet. Alle Daten werden über den JuiceFS-Client im Objektspeicher gespeichert. Das Architekturdiagramm sieht wie folgt aus:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>Aufbau eines Milvus-Clusters auf der Grundlage von JuiceFS</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein mit JuiceFS aufgebauter Milvus-Cluster (siehe nachstehendes Architekturdiagramm) funktioniert durch die Aufteilung von Upstream-Anforderungen mithilfe von Mishards, einer Cluster-Sharding-Middleware, um die Anforderungen kaskadenförmig an seine Untermodule weiterzuleiten. Beim Einfügen von Daten weist Mishards vorgelagerte Anforderungen dem Milvus-Schreibknoten zu, der neu eingefügte Daten in JuiceFS speichert. Beim Lesen von Daten lädt Mishards die Daten aus dem JuiceFS über einen Milvus-Leseknoten zur Verarbeitung in den Speicher und sammelt dann die Ergebnisse der vorgelagerten Teildienste und gibt sie zurück.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-mit-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>Schritt 1: Starten des MySQL-Dienstes</strong></h3><p>Starten Sie den MySQL-Dienst auf <strong>einem beliebigen</strong> Knoten des Clusters. Einzelheiten finden Sie unter <a href="https://milvus.io/docs/v1.1.0/data_manage.md">Verwalten von Metadaten mit MySQL</a>.</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>Schritt 2: Erstellen eines JuiceFS-Dateisystems</strong></h3><p>Zu Demonstrationszwecken wird das vorkompilierte Binärprogramm JuiceFS verwendet. Laden Sie das richtige <a href="https://github.com/juicedata/juicefs/releases">Installationspaket</a> für Ihr System herunter und befolgen Sie die <a href="https://github.com/juicedata/juicefs-quickstart">JuiceFS-Kurzanleitung</a> für detaillierte Installationsanweisungen. Um ein JuiceFS-Dateisystem zu erstellen, richten Sie zunächst eine Redis-Datenbank für die Speicherung von Metadaten ein. Es wird empfohlen, den Redis-Dienst bei Public Cloud-Bereitstellungen in derselben Cloud wie die Anwendung zu hosten. Richten Sie außerdem einen Objektspeicher für JuiceFS ein. In diesem Beispiel wird Azure Blob Storage verwendet; JuiceFS unterstützt jedoch fast alle Objektdienste. Wählen Sie den Objektspeicherdienst, der den Anforderungen Ihres Szenarios am besten entspricht.</p>
<p>Nachdem Sie den Redis-Dienst und den Objektspeicher konfiguriert haben, formatieren Sie ein neues Dateisystem und hängen JuiceFS in das lokale Verzeichnis ein:</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Wenn der Redis-Server nicht lokal ausgeführt wird, ersetzen Sie localhost durch die folgende Adresse: <code translate="no">redis://&lt;user:password&gt;@host:6379/1</code>.</p>
</blockquote>
<p>Wenn die Installation erfolgreich war, gibt JuiceFS die Seite des gemeinsamen Speichers <strong>/root/jfs</strong> zurück.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>installation-success.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>Schritt 3: Starten Sie Milvus</strong></h3><p>Auf allen Knoten des Clusters sollte Milvus installiert sein, und jeder Milvus-Knoten sollte mit Lese- oder Schreibberechtigung konfiguriert sein. Nur ein Milvus-Knoten kann als Schreibknoten konfiguriert werden, die anderen müssen Leseknoten sein. Setzen Sie zunächst die Parameter der Abschnitte <code translate="no">cluster</code> und <code translate="no">general</code> in der Milvus-Systemkonfigurationsdatei <strong>server_config.yaml</strong>:</p>
<p><strong>Abschnitt</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Parameter</strong></th><th style="text-align:left"><strong>Beschreibung</strong></th><th style="text-align:left"><strong>Konfiguration</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">Ob der Clustermodus aktiviert werden soll</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvus-Bereitstellungsrolle</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>Abschnitt</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>Während der Installation wird der gemeinsam genutzte JuiceFS-Speicherpfad auf <strong>/root/jfs/milvus/db</strong> festgelegt.</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>Starten Sie nach Abschluss der Installation Milvus und vergewissern Sie sich, dass es ordnungsgemäß gestartet wurde. Starten Sie anschließend den Mishards-Dienst auf <strong>einem der</strong> Knoten im Cluster. Das folgende Bild zeigt einen erfolgreichen Start von Mishards. Weitere Informationen finden Sie in der <a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">GitHub-Anleitung</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-erfolgreich.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>Leistungs-Benchmarks</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemeinsame Speicherlösungen werden in der Regel durch Network-Attached-Storage-Systeme (NAS) implementiert. Zu den häufig verwendeten NAS-Systemtypen gehören Network File System (NFS) und Server Message Block (SMB). Öffentliche Cloud-Plattformen bieten im Allgemeinen verwaltete Speicherdienste an, die mit diesen Protokollen kompatibel sind, wie z. B. Amazon Elastic File System (EFS).</p>
<p>Im Gegensatz zu herkömmlichen NAS-Systemen ist JuiceFS auf der Grundlage von FUSE (Filesystem in Userspace) implementiert, wobei alle Lese- und Schreibvorgänge direkt auf der Anwendungsseite stattfinden, was die Zugriffslatenz weiter verringert. JuiceFS verfügt außerdem über einzigartige Funktionen, die in anderen NAS-Systemen nicht zu finden sind, wie z. B. Datenkomprimierung und Caching.</p>
<p>Benchmark-Tests zeigen, dass JuiceFS erhebliche Vorteile gegenüber EFS bietet. Im Metadaten-Benchmark (Abbildung 1) verzeichnet JuiceFS bis zu zehnmal höhere E/A-Operationen pro Sekunde (IOPS) als EFS. Außerdem zeigt der E/A-Durchsatz-Benchmark (Abbildung 2), dass JuiceFS sowohl in Einzel- als auch in Multi-Job-Szenarien besser abschneidet als EFS.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>leistung-benchmark-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>leistung-benchmark-2.png</span> </span></p>
<p>Darüber hinaus zeigen die Benchmark-Tests, dass die Zeit für die erste Abfrage, d. h. die Zeit zum Laden neu eingefügter Daten von der Festplatte in den Speicher, für den JuiceFS-basierten Milvus-Cluster im Durchschnitt nur 0,032 Sekunden beträgt, was darauf hindeutet, dass die Daten fast sofort von der Festplatte in den Speicher geladen werden. Für diesen Test wurde die Abrufzeit für die erste Abfrage mit einer Million Zeilen 128-dimensionaler Vektordaten gemessen, die in Stapeln von 100k in Intervallen von 1 bis 8 Sekunden eingefügt wurden.</p>
<p>JuiceFS ist ein stabiles und zuverlässiges gemeinsames Dateispeichersystem, und der auf JuiceFS aufgebaute Milvus-Cluster bietet sowohl hohe Leistung als auch flexible Speicherkapazität.</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Erfahren Sie mehr über Milvus</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist ein leistungsstarkes Tool, das eine Vielzahl von Anwendungen für künstliche Intelligenz und Vektorähnlichkeitssuche unterstützt. Wenn Sie mehr über das Projekt erfahren möchten, lesen Sie die folgenden Ressourcen:</p>
<ul>
<li>Lesen Sie unseren <a href="https://zilliz.com/blog">Blog</a>.</li>
<li>Interagieren Sie mit unserer Open-Source-Community auf <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Nutzen Sie die beliebteste Vektordatenbank der Welt auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie zu ihr bei.</li>
<li>Testen und implementieren Sie KI-Anwendungen schnell mit unserem neuen <a href="https://github.com/milvus-io/bootcamp">Bootcamp</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>Autor bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>Autor bio-jingjing jia.png</span> </span></p>

---
id: >-
  evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
title: >-
  MinIO nimmt keine Änderungen der Gemeinschaft mehr an: Evaluierung von RustFS
  als praktikables S3-kompatibles Objektspeicher-Backend für Milvus
author: Min Yin
date: 2026-01-14T00:00:00.000Z
cover: assets.zilliz.com/minio_cover_new_bc94d37abe.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'object storage, S3 compatible storage, MinIO, RustFS, Milvus'
meta_title: |
  Evaluating RustFS for Milvus S3-Compatible Object Storage
desc: >-
  Erfahren Sie, wie Milvus auf S3-kompatiblen Objektspeicher zurückgreift und
  wie Sie RustFS als MinIO-Ersatz in Milvus einsetzen können, indem Sie eine
  praktische Übung durchführen.
origin: >-
  https://milvus.io/blog/evaluating-rustfs-as-a-viable-s3-compatible-object-storage-backend-for-milvus.md
---
<p><em>Dieser Beitrag stammt von Min Yin, einem der aktivsten Community-Mitarbeiter von Milvus, und wird hier mit Genehmigung veröffentlicht.</em></p>
<p><a href="https://github.com/minio/minio">MinIO</a> ist ein quelloffenes, hochleistungsfähiges und S3-kompatibles Objektspeichersystem, das in der KI/ML, Analytik und anderen datenintensiven Workloads weit verbreitet ist. Für viele <a href="https://milvus.io/">Milvus-Bereitstellungen</a> war es auch die Standardwahl für Objektspeicher. Kürzlich hat das MinIO-Team jedoch sein <a href="https://github.com/minio/minio?tab=readme-ov-file">GitHub README</a> aktualisiert, um darauf hinzuweisen, dass <strong><em>dieses Projekt keine neuen Änderungen mehr annimmt</em></strong><em>.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_7b7df16860.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tatsächlich hat sich MinIO in den letzten Jahren allmählich auf kommerzielle Angebote verlagert, sein Lizenz- und Vertriebsmodell gestrafft und die aktive Entwicklung im Community-Repository zurückgefahren. Die Überführung des Open-Source-Projekts in den Wartungsmodus ist das natürliche Ergebnis dieses umfassenden Übergangs.</p>
<p>Für Milvus-Benutzer, die sich standardmäßig auf MinIO verlassen, ist diese Änderung kaum zu übersehen. Der Objektspeicher ist das Herzstück der Persistenzschicht von Milvus, und seine Zuverlässigkeit hängt nicht nur davon ab, was heute funktioniert, sondern auch davon, ob sich das System mit den von ihm unterstützten Workloads weiterentwickelt.</p>
<p>Vor diesem Hintergrund untersucht dieser Artikel <a href="https://github.com/rustfs/rustfs">RustFS</a> als mögliche Alternative. RustFS ist ein auf Rust basierendes, S3-kompatibles Objektspeichersystem, das den Schwerpunkt auf Speichersicherheit und modernes Systemdesign legt. Es befindet sich noch im Versuchsstadium, und diese Diskussion stellt keine Empfehlung für die Produktion dar.</p>
<h2 id="The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="common-anchor-header">Die Milvus-Architektur und der Sitz der Objektspeicher-Komponente<button data-href="#The-Milvus-Architecture-and-Where-the-Object-Storage-Component-Sits" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 verwendet eine vollständig entkoppelte Speicher-Rechner-Architektur. In diesem Modell besteht die Speicherebene aus drei unabhängigen Komponenten, die jeweils eine bestimmte Aufgabe erfüllen.</p>
<p>Etcd speichert Metadaten, Pulsar oder Kafka verarbeitet Streaming-Protokolle, und Objektspeicher - typischerweise MinIO oder ein S3-kompatibler Dienst - bietet dauerhafte Persistenz für Vektordaten und Indexdateien. Da Speicherung und Berechnung getrennt sind, kann Milvus die Berechnungsknoten unabhängig skalieren und sich dabei auf ein gemeinsames, zuverlässiges Speicher-Backend verlassen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_fe897f1098.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Role-of-Object-Storage-in-Milvus" class="common-anchor-header">Die Rolle des Objektspeichers in Milvus</h3><p>Der Objektspeicher ist die dauerhafte Speicherebene in Milvus. Rohe Vektordaten werden als binlogs persistiert, und Indexstrukturen wie HNSW und IVF_FLAT werden ebenfalls dort gespeichert.</p>
<p>Dieses Design macht Rechenknoten zustandslos. Abfrageknoten speichern Daten nicht lokal, sondern laden Segmente und Indizes bei Bedarf aus dem Objektspeicher. Daher können die Knoten frei skaliert werden, sich schnell von Ausfällen erholen und einen dynamischen Lastausgleich im gesamten Cluster unterstützen, ohne dass die Daten auf der Speicherebene neu abgeglichen werden müssen.</p>
<pre><code translate="no">my-milvus-bucket/
├── files/                          <span class="hljs-comment"># rootPath (default)</span>
│   ├── insert_log/                 <span class="hljs-comment"># insert binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}     <span class="hljs-comment"># Per-field binlog files</span>
│   │
│   ├── delta_log/                  <span class="hljs-comment"># Delete binlogs</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Log_ID}        
│   │
│   ├── stats_log/                  <span class="hljs-comment"># Statistical data (e.g., Bloom filters)</span>
│   │   └── {Collection_ID}/
│   │       └── {Partition_ID}/
│   │           └── {Segment_ID}/
│   │               └── {Field_ID}/
│   │                   └── {Log_ID}
│   │
│   └── index_files/                <span class="hljs-comment"># Index files</span>
│       └── {Build_ID}_{Index_Version}_{Segment_ID}_{Field_ID}/
│           ├── index_file_0
│           ├── index_file_1
│           └── ...
<button class="copy-code-btn"></button></code></pre>
<h3 id="Why-Milvus-Uses-the-S3-API" class="common-anchor-header">Warum Milvus die S3-API verwendet</h3><p>Anstatt ein eigenes Speicherprotokoll zu definieren, verwendet Milvus die S3-API als Objektspeicherschnittstelle. S3 hat sich zum De-facto-Standard für Objektspeicher entwickelt: Große Cloud-Anbieter wie AWS S3, Alibaba Cloud OSS und Tencent Cloud COS unterstützen es von Haus aus, während Open-Source-Systeme wie MinIO, Ceph RGW, SeaweedFS und RustFS vollständig kompatibel sind.</p>
<p>Durch die Standardisierung auf die S3-API kann Milvus auf ausgereifte, gut getestete Go-SDKs zurückgreifen, anstatt separate Integrationen für jedes Speicher-Backend zu pflegen. Diese Abstraktion gibt den Benutzern auch Flexibilität bei der Bereitstellung: MinIO für die lokale Entwicklung, Cloud-Objektspeicher in der Produktion oder Ceph und RustFS für private Umgebungen. Solange ein S3-kompatibler Endpunkt verfügbar ist, muss Milvus nicht wissen - oder sich darum kümmern - welches Speichersystem darunter verwendet wird.</p>
<pre><code translate="no"><span class="hljs-comment"># Milvus configuration file milvus.yaml</span>
minio:
 address: localhost
 port: <span class="hljs-number">9000</span>
 accessKeyID: minioadmin
 secretAccessKey: minioadmin
 useSSL: false
 bucketName: milvus-bucket
<button class="copy-code-btn"></button></code></pre>
<h2 id="Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="common-anchor-header">Evaluierung von RustFS als S3-kompatibles Objektspeicher-Backend für Milvus<button data-href="#Evaluating-RustFS-as-an-S3-Compatible-Object-Storage-Backend-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Project-Overview" class="common-anchor-header">Überblick über das Projekt</h3><p>RustFS ist ein verteiltes Objektspeichersystem, das in Rust geschrieben wurde. Es befindet sich derzeit in der Alpha-Phase (Version 1.0.0-alpha.68) und zielt darauf ab, die betriebliche Einfachheit von MinIO mit den Stärken von Rust in Bezug auf Speichersicherheit und Leistung zu kombinieren. Weitere Details sind auf <a href="https://github.com/rustfs/rustfs">GitHub</a> verfügbar.</p>
<p>RustFS befindet sich noch in aktiver Entwicklung, und sein verteilter Modus wurde noch nicht offiziell veröffentlicht. Aus diesem Grund wird RustFS in diesem Stadium nicht für die Produktion oder geschäftskritische Arbeitslasten empfohlen.</p>
<h3 id="Architecture-Design" class="common-anchor-header">Architektur</h3><p>RustFS folgt einem Design, das konzeptionell ähnlich wie MinIO ist. Ein HTTP-Server stellt eine S3-kompatible API bereit, während ein Objektmanager die Objektmetadaten verwaltet und eine Speicher-Engine für die Verwaltung der Datenblöcke zuständig ist. Auf der Speicherebene stützt sich RustFS auf Standard-Dateisysteme wie XFS oder ext4.</p>
<p>Für den geplanten verteilten Modus beabsichtigt RustFS, etcd für die Metadatenkoordination zu verwenden, wobei mehrere RustFS-Knoten einen Cluster bilden. Dieses Design ist eng an gängige Objektspeicherarchitekturen angelehnt, wodurch RustFS Benutzern mit MinIO-Erfahrung vertraut ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/architecture_design_852f73b2c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Compatibility-with-Milvus" class="common-anchor-header">Kompatibilität mit Milvus</h3><p>Bevor RustFS als alternatives Objektspeicher-Backend in Betracht gezogen wird, muss geprüft werden, ob es die zentralen Speicheranforderungen von Milvus erfüllt.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Milvus-Anforderung</strong></th><th style="text-align:center"><strong>S3-API</strong></th><th style="text-align:center"><strong>RustFS-Unterstützung</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Persistenz von Vektordaten</td><td style="text-align:center"><code translate="no">PutObject</code>, <code translate="no">GetObject</code></td><td style="text-align:center">✅ Vollständig unterstützt</td></tr>
<tr><td style="text-align:center">Verwaltung von Indexdateien</td><td style="text-align:center"><code translate="no">ListObjects</code>, <code translate="no">DeleteObject</code></td><td style="text-align:center">✅ Vollständig unterstützt</td></tr>
<tr><td style="text-align:center">Segment-Zusammenführungsoperationen</td><td style="text-align:center">Mehrteiliger Upload</td><td style="text-align:center">✅ Vollständig unterstützt</td></tr>
<tr><td style="text-align:center">Garantierte Konsistenz</td><td style="text-align:center">Starkes Lesen-nach-Schreiben</td><td style="text-align:center">✅ Starke Konsistenz (Single-Node)</td></tr>
</tbody>
</table>
<p>Auf der Grundlage dieser Bewertung erfüllt die aktuelle S3-API-Implementierung von RustFS die grundlegenden Funktionsanforderungen von Milvus. Damit ist sie für praktische Tests in Nicht-Produktionsumgebungen geeignet.</p>
<h2 id="Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="common-anchor-header">Hands-On: Ersetzen von MinIO durch RustFS in Milvus<button data-href="#Hands-On-Replacing-MinIO-with-RustFS-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ziel dieser Übung ist es, den standardmäßigen MinIO-Objektspeicherdienst zu ersetzen und Milvus 2.6.7 mit RustFS als Objektspeicher-Backend bereitzustellen.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><ol>
<li><p>Docker und Docker Compose sind installiert (Version ≥ 20.10), und das System kann Images ziehen und Container normal ausführen.</p></li>
<li><p>Es ist ein lokales Verzeichnis für die Speicherung von Objektdaten verfügbar, z. B. <code translate="no">/volume/data/</code> (oder ein benutzerdefinierter Pfad).</p></li>
<li><p>Der Host-Port 9000 ist für den externen Zugriff offen, oder ein alternativer Port ist entsprechend konfiguriert.</p></li>
<li><p>Der RustFS-Container läuft unter einem Nicht-Root-Benutzer (<code translate="no">rustfs</code>). Stellen Sie sicher, dass das Host-Datenverzeichnis der UID 10001 gehört.</p></li>
</ol>
<h3 id="Step-1-Create-the-Data-Directory-and-Set-Permissions" class="common-anchor-header">Schritt 1: Erstellen des Datenverzeichnisses und Festlegen von Berechtigungen</h3><pre><code translate="no"><span class="hljs-comment"># Create the project directory</span>
<span class="hljs-built_in">mkdir</span> -p milvus-rustfs &amp;&amp; <span class="hljs-built_in">cd</span> milvus-rustfs
<span class="hljs-comment"># Create the data directory</span>
<span class="hljs-built_in">mkdir</span> -p volumes/{rustfs, etcd, milvus}
<span class="hljs-comment"># Update permissions for the RustFS directory</span>
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chown</span> -R 10001:10001 volumes/rustfs
<button class="copy-code-btn"></button></code></pre>
<p><strong>Laden Sie die offizielle Docker Compose-Datei herunter</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.6.7/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Modify-the-Object-Storage-Service" class="common-anchor-header">Schritt 2: Ändern Sie den Objektspeicherdienst</h3><p><strong>Definieren Sie den RustFS-Dienst</strong></p>
<p>Hinweis: Stellen Sie sicher, dass der Zugriffsschlüssel und der geheime Schlüssel mit den im Milvus-Dienst konfigurierten Anmeldeinformationen übereinstimmen.</p>
<pre><code translate="no">rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Konfiguration abschließen</strong></p>
<p>Hinweis: Die Speicherkonfiguration von Milvus geht derzeit von Standardwerten im Stil von MinIO aus und erlaubt noch keine benutzerdefinierten Werte für Zugriffsschlüssel oder geheime Schlüssel. Wenn Sie RustFS als Ersatz verwenden, müssen Sie dieselben Standardanmeldeinformationen verwenden, die von Milvus erwartet werden.</p>
<pre><code translate="no">version: ‘3.5’
services:
 etcd:
 container_name: milvus-etcd
 image: registry.cn-hangzhou.aliyuncs.com/etcd/etcd: v3.5.25
 environment:
 - ETCD_AUTO_COMPACTION_MODE=revision
 - ETCD_AUTO_COMPACTION_RETENTION=1000
 - ETCD_QUOTA_BACKEND_BYTES=4294967296
 - ETCD_SNAPSHOT_COUNT=50000
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
 <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “etcdctl”, “endpoint”, “health”]
 interval: 30s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 rustfs:
 container_name: milvus-rustfs
 image: registry.cn-hangzhou.aliyuncs.com/rustfs/rustfs: latest
 environment:
 RUSTFS_ACCESS_KEY: minioadmin
 RUSTFS_SECRET_KEY: minioadmin
 RUSTFS_CONSOLE_ENABLE: “<span class="hljs-literal">true</span>”
 RUSTFS_REGION: us-east-1
 <span class="hljs-comment"># RUSTFS_SERVER_DOMAINS: localhost# Optional; not required for local deployments</span>
 ports:
 - “9001:9001”
 - “9000:9000”
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/rustfs:/data
 <span class="hljs-built_in">command</span>: &gt;
 --address :9000
 --console-enable
 /data
 healthcheck:
 <span class="hljs-built_in">test</span>: [“CMD”, “curl”, “-f”, “http://localhost:9000/health<span class="hljs-string">&quot;]
 interval: 30s
 timeout: 20s
 retries: 3
 standalone:
 container_name: milvus-standalone
 image: registry.cn-hangzhou.aliyuncs.com/milvus/milvus: v2.6.7
 command: [”milvus“, ”run“, ”standalone“]
 security_opt:
 - seccomp: unconfined
 environment:
 MINIO_REGION: us-east-1
 ETCD_ENDPOINTS: etcd:2379
 MINIO_ADDRESS: rustfs:9000
 MINIO_ACCESS_KEY: minioadmin
 MINIO_SECRET_KEY: minioadmin
 MINIO_USE_SSL: ”false“
 MQ_TYPE: rocksmq
 volumes:
 - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
 healthcheck:
 test: [”CMD“, ”curl“, ”-f“, ”http://localhost:9091/healthz&quot;</span>]
 interval: 30s
 start_period: 90s
 <span class="hljs-built_in">timeout</span>: 20s
 retries: 3
 ports:
 - “19530:19530”
 - “9091:9091”
 depends_on:
 - “etcd”
 - “rustfs”
networks:
 default:
 name: milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>Starten Sie die Dienste</strong></p>
<pre><code translate="no">docker-compose -f docker-compose.yaml up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>Überprüfen des Dienststatus</strong></p>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d64dc88a96.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Zugriff auf die RustFS-Weboberfläche</strong></p>
<p>Öffnen Sie die RustFS-Webschnittstelle in Ihrem Browser: <a href="http://localhost:9001">http://localhost:9001</a></p>
<p>Melden Sie sich mit den Standard-Anmeldeinformationen an: Benutzername und Passwort sind beide minioadmin.</p>
<p><strong>Testen Sie den Milvus-Dienst</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-comment"># connect to Milvus</span>
connections.connect(
 alias=<span class="hljs-string">&quot;default&quot;</span>,
 host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
 port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Successfully connected to Milvus!&quot;</span>)
<span class="hljs-comment"># create test collection</span>
fields = [
 FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
 FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;test collection&quot;</span>)
collection = Collection(name=<span class="hljs-string">&quot;test_collection&quot;</span>, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ Test collection created!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✓ RustFS verified as the S3 storage backend!&quot;</span>)

<span class="hljs-comment">### Step 3: Storage Performance Testing (Experimental)</span>

**Test Design**

Two Milvus deployments were <span class="hljs-built_in">set</span> up on identical hardware (<span class="hljs-number">16</span> cores / <span class="hljs-number">32</span> GB memory / NVMe SSD), using RustFS <span class="hljs-keyword">and</span> MinIO respectively <span class="hljs-keyword">as</span> the <span class="hljs-built_in">object</span> storage backend. The test dataset consisted of <span class="hljs-number">1</span>,<span class="hljs-number">000</span>,<span class="hljs-number">000</span> vectors <span class="hljs-keyword">with</span> <span class="hljs-number">768</span> dimensions, using an HNSW index <span class="hljs-keyword">with</span> parameters _M = 16_ <span class="hljs-keyword">and</span> _efConstruction = 200_. Data was inserted <span class="hljs-keyword">in</span> batches of <span class="hljs-number">5</span>,<span class="hljs-number">000.</span>

The following metrics were evaluated: Insert throughput, Index build time, Cold <span class="hljs-keyword">and</span> warm load time, Search latency, Storage footprint.

**Test Code**

Note: Only the core parts of the test code are shown below.

<button class="copy-code-btn"></button></code></pre>
<p>def milvus_load_bench(dim=768, rows=1_000_000, batch=5000): collection = Collection(...) # Insert test t0 = time.perf_counter() for i in range(0, rows, batch): collection.insert([rng.random((batch, dim), dtype=np.float32).tolist()]) insert_time = time.perf_counter() - t0 # Index aufbauen collection.flush() collection.create_index(field_name=&quot;embedding&quot;, index_params={&quot;index_type&quot;: &quot;HNSW&quot;, ...}) # Lasttest (Kaltstart + zwei Warmstarts) collection.release() load_times = [] for i in range(3): if i &gt; 0: collection.release(); time.sleep(2) collection.load() load_times.append(...) # Abfragetest search_times = [] for _ in range(3): collection.search(queries, limit=10, ...)</p>
<pre><code translate="no">
**Test Command**

<button class="copy-code-btn"></button></code></pre>
<custom-h1>RustFS: --port 19530 --s3-endpoint http://localhost:9000 --s3-bucket bench</custom-h1><custom-h1>MinIO: --port 19531 --s3-endpoint http://localhost:9001 --s3-bucket a-bucket</custom-h1><p>python bench.py milvus-load-bench --dim 768 --rows 1000000 --batch 5000 <br>
-index-type HNSW --repeat-load 3 --release-before-load --do-search --drop-after</p>
<pre><code translate="no">
**Performance Results**

- **RustFS**

<span class="hljs-function">Faster <span class="hljs-title">writes</span> (<span class="hljs-params">+<span class="hljs-number">57</span>%</span>), lower storage <span class="hljs-title">usage</span> (<span class="hljs-params">–<span class="hljs-number">57</span>%</span>), <span class="hljs-keyword">and</span> faster warm <span class="hljs-title">loads</span> (<span class="hljs-params">+<span class="hljs-number">67</span>%</span>), making it suitable <span class="hljs-keyword">for</span> write-heavy, cost-sensitive workloads. 

Much slower <span class="hljs-title">queries</span> (<span class="hljs-params"><span class="hljs-number">7.96</span> ms vs. <span class="hljs-number">1.85</span> ms, ~+<span class="hljs-number">330</span>% latency</span>) <span class="hljs-keyword">with</span> noticeable <span class="hljs-title">variance</span> (<span class="hljs-params">up to <span class="hljs-number">17.14</span> ms</span>), <span class="hljs-keyword">and</span> 43% slower index builds. Not suitable <span class="hljs-keyword">for</span> query-intensive applications.

- **MinIO**

Excellent query <span class="hljs-title">performance</span> (<span class="hljs-params">**<span class="hljs-number">1.85</span> ms** average latency</span>), mature small-<span class="hljs-keyword">file</span> <span class="hljs-keyword">and</span> random I/O optimizations, <span class="hljs-keyword">and</span> a well-established ecosystem.


|     **Metric**    |  **RustFS**  |   **MinIO**  | **Difference** |
| :---------------: | :----------: | :----------: | :------------: |
| Insert Throughput | 4,472 rows/s | 2,845 rows/s |      0.57      |
|  Index Build Time |     803 s    |     562 s    |      -43%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Cold Start</span>) |    22.7 s    |    18.3 s    |      -24%      |
| <span class="hljs-title">Load</span> (<span class="hljs-params">Warm Start</span>) |    0.009 s   |    0.027 s   |      0.67      |
|   Search Latency  |    7.96 ms   |    1.85 ms   |    **-330%**   |
|   Storage Usage   |    7.8 GB    |    18.0 GB   |      0.57      |

RustFS significantly outperforms MinIO <span class="hljs-keyword">in</span> write performance <span class="hljs-keyword">and</span> storage efficiency, <span class="hljs-keyword">with</span> both showing roughly 57% improvement. This demonstrates the system-level advantages of the Rust ecosystem. However, the 330% gap <span class="hljs-keyword">in</span> query latency limits RustFS’s suitability <span class="hljs-keyword">for</span> query-intensive workloads.

For **production environments**, cloud-managed <span class="hljs-built_in">object</span> storage services like **AWS S3** are recommended first, <span class="hljs-keyword">as</span> they are mature, stable, <span class="hljs-keyword">and</span> require no operational effort. Self-hosted solutions are better suited to specific scenarios: RustFS <span class="hljs-keyword">for</span> cost-sensitive <span class="hljs-keyword">or</span> write-intensive workloads, MinIO <span class="hljs-keyword">for</span> query-intensive use cases, <span class="hljs-keyword">and</span> Ceph <span class="hljs-keyword">for</span> data sovereignty. With further optimization <span class="hljs-keyword">in</span> random read performance, RustFS has the potential to become a strong self-hosted option.


## Conclusion

MinIO’s decision to stop accepting <span class="hljs-keyword">new</span> community contributions <span class="hljs-keyword">is</span> disappointing <span class="hljs-keyword">for</span> many developers, but it won’t disrupt Milvus users. Milvus depends <span class="hljs-keyword">on</span> the S3 API—<span class="hljs-keyword">not</span> any specific vendor implementation—so swapping storage backends <span class="hljs-keyword">is</span> straightforward. This S3-compatibility layer <span class="hljs-keyword">is</span> intentional: it ensures Milvus stays flexible, portable, <span class="hljs-keyword">and</span> decoupled <span class="hljs-keyword">from</span> vendor <span class="hljs-keyword">lock</span>-<span class="hljs-keyword">in</span>.

For production deployments, cloud-managed services such <span class="hljs-keyword">as</span> AWS S3 <span class="hljs-keyword">and</span> Alibaba Cloud OSS remain the most reliable options. They’re mature, highly available, <span class="hljs-keyword">and</span> drastically reduce the operational load compared to running your own <span class="hljs-built_in">object</span> storage. Self-hosted systems like MinIO <span class="hljs-keyword">or</span> Ceph still make sense <span class="hljs-keyword">in</span> cost-sensitive environments <span class="hljs-keyword">or</span> <span class="hljs-keyword">where</span> data sovereignty <span class="hljs-keyword">is</span> non-negotiable, but they require significantly more engineering overhead to operate safely at scale.

RustFS <span class="hljs-keyword">is</span> interesting—Apache 2.0-licensed, Rust-based, <span class="hljs-keyword">and</span> community-driven—but it&#x27;s still early. The performance gap <span class="hljs-keyword">is</span> noticeable, <span class="hljs-keyword">and</span> the distributed mode hasn’t shipped yet. It’s <span class="hljs-keyword">not</span> production-ready today, but it’s a project worth watching <span class="hljs-keyword">as</span> it matures.

If you’re comparing <span class="hljs-built_in">object</span> storage options <span class="hljs-keyword">for</span> Milvus, evaluating MinIO replacements, <span class="hljs-keyword">or</span> weighing the operational trade-offs of different backends, we’d love to hear <span class="hljs-keyword">from</span> you.

Join our[ Discord channel](<span class="hljs-params">https://discord.com/invite/<span class="hljs-number">8u</span>yFbECzPX</span>) <span class="hljs-keyword">and</span> share your thoughts. You can also book a 20-minute one-<span class="hljs-keyword">on</span>-one session to <span class="hljs-keyword">get</span> insights, guidance, <span class="hljs-keyword">and</span> answers to your questions through[ Milvus Office Hours](<span class="hljs-params">https://milvus.io/blog/<span class="hljs-keyword">join</span>-milvus-office-hours-to-<span class="hljs-keyword">get</span>-support-<span class="hljs-keyword">from</span>-vectordb-experts.md</span>).
</span><button class="copy-code-btn"></button></code></pre>

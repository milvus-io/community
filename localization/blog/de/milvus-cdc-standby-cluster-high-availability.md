---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Vector Datenbank-Hochverfügbarkeit: Aufbau eines Milvus Standby-Clusters mit
  CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Erfahren Sie, wie Sie eine hochverfügbare Vektordatenbank mit Milvus CDC
  aufbauen. Schritt-für-Schritt-Anleitung für Primär-/Standby-Replikation,
  Failover und Produktions-DR.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Jede Produktionsdatenbank braucht einen Plan für den Fall, dass etwas schief geht. Relationale Datenbanken verfügen schon seit Jahrzehnten über WAL-Versand, Binlog-Replikation und automatisches Failover. Aber <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbanken</a> - obwohl sie zur Kerninfrastruktur für KI-Anwendungen geworden sind - holen in dieser Hinsicht noch auf. Die meisten bieten bestenfalls Redundanz auf Knotenebene. Wenn ein kompletter Cluster ausfällt, müssen Sie von Backups wiederherstellen und <a href="https://zilliz.com/learn/vector-index">Vektorindizes</a> von Grund auf neu erstellen - ein Prozess, der Stunden dauern und Tausende von Rechenkosten verursachen kann, da die Neugenerierung von <a href="https://zilliz.com/glossary/vector-embeddings">Einbettungen</a> durch Ihre ML-Pipeline nicht billig ist.</p>
<p><a href="https://milvus.io/">Milvus</a> verfolgt einen anderen Ansatz. Es bietet eine mehrschichtige Hochverfügbarkeit: Replikate auf Knotenebene für ein schnelles Failover innerhalb eines Clusters, CDC-basierte Replikation für den Schutz auf Clusterebene und über Regionen hinweg sowie ein Backup für die Wiederherstellung des Sicherheitsnetzes. Dieses mehrschichtige Modell ist bei herkömmlichen Datenbanken Standard - Milvus ist die erste große Vektordatenbank, die es auf Vektor-Workloads anwendet.</p>
<p>Dieser Leitfaden deckt zwei Dinge ab: die Hochverfügbarkeitsstrategien, die für Vektordatenbanken verfügbar sind (damit Sie beurteilen können, was "produktionsreif" tatsächlich bedeutet), und ein praktisches Tutorial für die Einrichtung der Milvus CDC Primär-Standby-Replikation von Grund auf.</p>
<blockquote>
<p>Dies ist <strong>Teil 1</strong> einer Serie:</p>
<ul>
<li><strong>Teil 1</strong> (dieser Artikel): Einrichten der Primär-/Standby-Replikation auf neuen Clustern</li>
<li><strong>Teil 2</strong>: Hinzufügen von CDC zu einem bestehenden Cluster, der bereits Daten hat, mit <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Teil 3</strong>: Verwalten von Failover - Promoten des Standby, wenn der Primary ausfällt</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Warum ist Hochverfügbarkeit für Vektordatenbanken wichtiger?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn eine herkömmliche SQL-Datenbank ausfällt, verlieren Sie den Zugriff auf strukturierte Datensätze - die Daten selbst können jedoch in der Regel aus vorgelagerten Quellen reimportiert werden. Wenn eine Vektordatenbank ausfällt, ist die Wiederherstellung wesentlich schwieriger.</p>
<p>Vektordatenbanken speichern <a href="https://zilliz.com/glossary/vector-embeddings">Einbettungen</a> - dichte numerische Darstellungen, die von ML-Modellen erzeugt werden. Um sie wiederherzustellen, muss der gesamte Datensatz die Einbettungspipeline erneut durchlaufen: Laden der Rohdokumente, Chunking, Aufrufen eines <a href="https://zilliz.com/ai-models">Einbettungsmodells</a> und Neuindizierung. Bei einem Datensatz mit Hunderten von Millionen von Vektoren kann dies Tage dauern und Tausende von Dollar an GPU-Rechenleistung kosten.</p>
<p>In der Zwischenzeit befinden sich die Systeme, die von der <a href="https://zilliz.com/learn/what-is-vector-search">Vektorsuche</a> abhängen, oft in der kritischen Phase:</p>
<ul>
<li><strong><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipelines</a></strong>, die kundenorientierte Chatbots und die Suche antreiben - wenn die Vektordatenbank ausfällt, wird die Abfrage gestoppt und die KI liefert generische oder halluzinierte Antworten.</li>
<li><strong>Empfehlungsmaschinen</strong>, die Produkt- oder Inhaltsvorschläge in Echtzeit liefern - Ausfallzeiten bedeuten entgangene Einnahmen.</li>
<li><strong>Betrugserkennungs- und Anomalieüberwachungssysteme</strong>, die sich auf die <a href="https://zilliz.com/glossary/similarity-search">Ähnlichkeitssuche</a> stützen, um verdächtige Aktivitäten zu erkennen - eine Lücke in der Abdeckung schafft ein Fenster der Anfälligkeit.</li>
<li><strong>Autonome Agentensysteme</strong>, die Vektorspeicher für den Speicher- und Toolabruf verwenden - Agenten versagen oder drehen sich in einer Schleife ohne ihre Wissensbasis.</li>
</ul>
<p>Wenn Sie Vektordatenbanken für einen dieser Anwendungsfälle evaluieren, ist Hochverfügbarkeit keine "Nice-to-have"-Funktion, die man später überprüfen kann. Sie sollte eines der ersten Dinge sein, auf die Sie achten.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">Wie sieht Hochverfügbarkeit in der Produktion für eine Vektordatenbank aus?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Nicht alle Hochverfügbarkeitsfunktionen sind gleich. Eine Vektordatenbank, die nur Knotenausfälle innerhalb eines einzelnen Clusters bewältigt, ist nicht so "hochverfügbar", wie es ein Produktionssystem erfordert. Echte HA muss drei Schichten abdecken:</p>
<table>
<thead>
<tr><th>Schicht</th><th>Wovor sie schützt</th><th>Wie es funktioniert</th><th>Wiederherstellungszeit</th><th>Datenverlust</th></tr>
</thead>
<tbody>
<tr><td><strong>Knotenebene</strong> (Mehrfachreplikate)</td><td>Absturz eines einzelnen Knotens, Hardwareausfall, OOM-Kill, AZ-Ausfall</td><td>Kopiert die gleichen <a href="https://milvus.io/docs/glossary.md">Datensegmente</a> auf mehrere Knoten; andere Knoten absorbieren die Last</td><td>Sofort</td><td>Null</td></tr>
<tr><td><strong>Cluster-Ebene</strong> (CDC-Replikation)</td><td>Ausfall des gesamten Clusters - fehlerhaftes K8s-Rollout, Namespace-Löschung, Speicherbeschädigung</td><td>Streaming aller Schreibvorgänge an einen Standby-Cluster über das <a href="https://milvus.io/docs/four_layers.md">Write-Ahead-Protokoll</a>; der Standby-Cluster ist immer um Sekunden im Rückstand</td><td>Minuten</td><td>Sekunden</td></tr>
<tr><td><strong>Sicherheitsnetz</strong> (regelmäßiges Backup)</td><td>Katastrophale Datenbeschädigung, Ransomware, menschliches Versagen, das sich über die Replikation ausbreitet</td><td>Erstellt regelmäßige Snapshots und speichert sie an einem separaten Ort</td><td>Stunden</td><td>Stunden (seit der letzten Sicherung)</td></tr>
</tbody>
</table>
<p>Diese Schichten sind komplementär, nicht alternativ. Bei einer Produktionsbereitstellung sollten sie aufeinander aufbauen:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-Replica</a> zuerst</strong> - behandelt die häufigsten Ausfälle (Knotenabstürze, AZ-Ausfälle) ohne Ausfallzeit und Datenverlust.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> als Nächstes</strong> - schützt vor Ausfällen, die Multireplica nicht bewältigen kann: clusterweite Ausfälle, katastrophale menschliche Fehler. Der Standby-Cluster befindet sich in einer anderen Fehlerdomäne.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">Regelmäßige Backups</a></strong> - Ihr Sicherheitsnetz der letzten Instanz. Selbst CDC kann Sie nicht retten, wenn beschädigte Daten auf den Standby-Cluster repliziert werden, bevor Sie es bemerken.</li>
</ol>
<p>Fragen Sie sich bei der Bewertung von Vektordatenbanken: Welche dieser drei Schichten unterstützt das Produkt tatsächlich? Die meisten Vektordatenbanken bieten heute nur die erste an. Milvus unterstützt alle drei, wobei CDC eine eingebaute Funktion ist - kein Add-on eines Drittanbieters.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Was ist Milvus CDC und wie funktioniert es?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong> ist eine integrierte Replikationsfunktion, die das <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a> des primären Clusters liest und jeden Eintrag an einen separaten Standby-Cluster weiterleitet. Der Standby-Cluster repliziert die Einträge und erhält am Ende dieselben Daten, in der Regel mit einigen Sekunden Verspätung.</p>
<p>Das Muster ist in der Datenbankwelt gut etabliert. MySQL hat Binlog-Replikation. PostgreSQL hat WAL-Versand. MongoDB hat eine oplog-basierte Replikation. Dies sind bewährte Techniken, mit denen relationale und Dokumentendatenbanken seit Jahrzehnten in der Produktion laufen. Milvus bietet den gleichen Ansatz für Vektor-Workloads - es ist die erste große <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a>, die WAL-basierte Replikation als integrierte Funktion anbietet.</p>
<p>Drei Eigenschaften machen CDC zu einer guten Lösung für die Notfallwiederherstellung:</p>
<ul>
<li><strong>Sync mit niedriger Latenz.</strong> CDC überträgt Vorgänge, wenn sie passieren, nicht in geplanten Stapeln. Der Standby bleibt unter normalen Bedingungen nur Sekunden hinter dem Primärserver zurück.</li>
<li><strong>Geordnete Wiederholung.</strong> Die Vorgänge kommen in der gleichen Reihenfolge beim Standby an, in der sie geschrieben wurden. Die Daten bleiben ohne Abgleich konsistent.</li>
<li><strong>Checkpoint-Wiederherstellung.</strong> Wenn der CDC-Prozess abstürzt oder das Netzwerk ausfällt, wird er dort fortgesetzt, wo er aufgehört hat. Es werden keine Daten übersprungen oder dupliziert.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Wie funktioniert die CDC-Architektur?</h3><p>Eine CDC-Bereitstellung besteht aus drei Komponenten:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>CDC-Architektur mit Quellcluster mit Streaming-Knoten und CDC-Knoten, die das WAL verbrauchen und Daten an die Proxy-Schicht des Zielclusters replizieren, die DDL/DCL/DML-Operationen an Streaming-Knoten weiterleitet und an das WAL anhängt</span> </span></p>
<table>
<thead>
<tr><th>Komponente</th><th>Rolle</th></tr>
</thead>
<tbody>
<tr><td><strong>Primärer Cluster</strong></td><td>Die <a href="https://milvus.io/docs/architecture_overview.md">Milvus-Produktionsinstanz</a>. Alle Lese- und Schreibvorgänge laufen hier ab. Jeder Schreibvorgang wird in der WAL aufgezeichnet.</td></tr>
<tr><td><strong>CDC-Knoten</strong></td><td>Ein Hintergrundprozess neben dem Primärcluster. Liest WAL-Einträge und leitet sie an den Standby weiter. Läuft unabhängig vom Lese-/Schreibpfad - keine Auswirkungen auf die Abfrage- oder Einfügeleistung.</td></tr>
<tr><td><strong>Standby-Cluster</strong></td><td>Eine separate Milvus-Instanz, die weitergeleitete WAL-Einträge wiedergibt. Hält dieselben Daten wie die primäre Instanz, mit einer Verzögerung von Sekunden. Kann Leseabfragen bedienen, akzeptiert aber keine Schreibzugriffe.</td></tr>
</tbody>
</table>
<p>Der Ablauf: Schreibzugriffe auf die Primärinstanz → der CDC-Knoten kopiert sie auf die Standby-Instanz → die Standby-Instanz gibt sie wieder. Nichts anderes spricht mit dem Schreibpfad des Standby. Wenn der primäre Knoten ausfällt, verfügt der Standby-Knoten bereits über fast alle Daten und kann befördert werden.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Tutorial: Einrichten eines Milvus CDC Standby-Clusters<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Rest dieses Artikels ist ein praktischer Durchgang. Am Ende werden Sie zwei Milvus-Cluster mit Echtzeit-Replikation zwischen den Clustern in Betrieb haben.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><p>Vor dem Start:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 oder höher.</strong> CDC erfordert diese Version. Der neueste 2.6.x-Patch wird empfohlen.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 oder höher.</strong> Diese Anleitung verwendet den Operator für das Cluster-Management auf Kubernetes.</li>
<li><strong>Ein laufender Kubernetes-Cluster</strong> mit <code translate="no">kubectl</code> und <code translate="no">helm</code> konfiguriert.</li>
<li><strong>Python mit <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> für den Konfigurationsschritt der Replikation.</li>
</ul>
<p>Zwei Einschränkungen in der aktuellen Version:</p>
<table>
<thead>
<tr><th>Einschränkung</th><th>Einzelheiten</th></tr>
</thead>
<tbody>
<tr><td>Einzelne CDC-Replik</td><td>Eine CDC-Replik pro Cluster. Verteilte CDC ist für eine zukünftige Version geplant.</td></tr>
<tr><td>Kein BulkInsert</td><td><a href="https://milvus.io/docs/import-data.md">BulkInsert</a> wird nicht unterstützt, wenn CDC aktiviert ist. Ebenfalls für ein zukünftiges Release geplant.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Schritt 1: Upgrade des Milvus Operators</h3><p>Aktualisieren Sie den Milvus Operator auf v1.3.4 oder höher:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vergewissern Sie sich, dass der Operator-Pod ausgeführt wird:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Schritt 2: Bereitstellen des primären Clusters</h3><p>Erstellen Sie eine YAML-Datei für den primären (Quell-)Cluster. Der Abschnitt <code translate="no">cdc</code> unter <code translate="no">components</code> weist den Operator an, einen CDC-Knoten neben dem Cluster bereitzustellen:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Die Einstellung <code translate="no">msgStreamType: woodpecker</code> verwendet die in Milvus integrierte <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a> anstelle einer externen Nachrichtenwarteschlange wie Kafka oder Pulsar. Woodpecker ist ein Cloud-natives Write-Ahead-Log, das in Milvus 2.6 eingeführt wurde und die Notwendigkeit einer externen Messaging-Infrastruktur beseitigt.</p>
<p>Wenden Sie die Konfiguration an:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Warten Sie, bis alle Pods den Status "Running" erreicht haben. Bestätigen Sie, dass der CDC-Pod in Betrieb ist:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Schritt 3: Bereitstellen des Standby-Clusters</h3><p>Der Standby-Cluster (Zielcluster) verwendet dieselbe Milvus-Version, enthält aber keine CDC-Komponente - er empfängt nur replizierte Daten:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Anwenden:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Überprüfen Sie, ob alle Pods laufen:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Schritt 4: Konfigurieren Sie die Replikationsbeziehung</h3><p>Wenn beide Cluster laufen, konfigurieren Sie die Replikationstopologie mit Python und <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Definieren Sie die Verbindungsdetails des Clusters und die Namen der physischen Kanäle (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Erstellen Sie die Replikationskonfiguration:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Anwenden auf beide Cluster:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Sobald dies gelungen ist, werden inkrementelle Änderungen auf dem primären Cluster automatisch auf den Standby-Cluster repliziert.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Schritt 5: Überprüfen Sie, ob die Replikation funktioniert</h3><ol>
<li>Stellen Sie eine Verbindung zum primären Cluster her, <a href="https://milvus.io/docs/manage-collections.md">erstellen Sie eine Sammlung</a>, <a href="https://milvus.io/docs/insert-update-delete.md">fügen Sie einige Vektoren ein</a> und <a href="https://milvus.io/docs/load-and-release.md">laden Sie sie</a>.</li>
<li>Führen Sie eine Suche auf dem Primärsystem durch, um zu überprüfen, ob die Daten vorhanden sind.</li>
<li>Stellen Sie eine Verbindung zum Standby-System her und führen Sie die gleiche Suche durch.</li>
<li>Wenn der Standby-Server die gleichen Ergebnisse liefert, funktioniert die Replikation.</li>
</ol>
<p>Der <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> deckt die Erstellung von Sammlungen, das Einfügen und die Suche ab, falls Sie eine Referenz benötigen.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Ausführen von CDC in der Produktion<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Einrichten von CDC ist der einfachste Teil. Um die Zuverlässigkeit im Laufe der Zeit aufrechtzuerhalten, müssen Sie auf einige operative Bereiche achten.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Replikationsverzögerung überwachen</h3><p>Der Standby-Server hinkt dem primären Server immer etwas hinterher - das liegt in der Natur der asynchronen Replikation. Bei normaler Auslastung beträgt die Verzögerung nur wenige Sekunden. Schreibspitzen, Netzwerküberlastung oder Ressourcenknappheit auf dem Standby-System können jedoch dazu führen, dass er größer wird.</p>
<p>Verfolgen Sie die Verzögerung als Metrik und schlagen Sie Alarm. Ein Lag, der wächst, ohne sich zu erholen, bedeutet normalerweise, dass der CDC-Knoten nicht mit dem Schreibdurchsatz mithalten kann. Überprüfen Sie zunächst die Netzwerkbandbreite zwischen den Clustern und überlegen Sie dann, ob der Standby-Knoten mehr Ressourcen benötigt.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Nutzen Sie den Standby für Read Scaling</h3><p>Der Standby-Knoten ist nicht nur ein kaltes Backup, das untätig bleibt, bis der Katastrophenfall eintritt. Er nimmt <a href="https://milvus.io/docs/single-vector-search.md">Such- und Abfrageanfragen</a> an, während die Replikation aktiv ist - nur Schreibvorgänge werden blockiert. Dies eröffnet praktische Einsatzmöglichkeiten:</p>
<ul>
<li>Umleitung von <a href="https://zilliz.com/glossary/similarity-search">Batch-ähnlichen Such-</a> oder Analyse-Workloads auf den Standby-Server</li>
<li>Aufteilung des Leseverkehrs während der Spitzenzeiten, um den Druck auf den Primärserver zu verringern</li>
<li>Ausführen teurer Abfragen (große Top-K, gefilterte Suchen in großen Sammlungen) ohne Beeinträchtigung der Schreiblatenz in der Produktion</li>
</ul>
<p>Dadurch wird Ihre DR-Infrastruktur zu einem Leistungsvorteil. Der Standby verdient seinen Unterhalt auch dann, wenn nichts kaputt ist.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Richtige Größe des Standbys</h3><p>Der Standby-Server wiederholt alle Schreibvorgänge des Primärspeichers, sodass er ähnliche Rechen- und Speicherressourcen benötigt. Wenn Sie auch Lesevorgänge an sie weiterleiten, sollten Sie diese zusätzliche Last berücksichtigen. Die Speicheranforderungen sind identisch, da sie dieselben Daten enthält.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Testen Sie Failover, bevor Sie es brauchen</h3><p>Warten Sie nicht auf einen echten Ausfall, um festzustellen, dass Ihr Failover-Prozess nicht funktioniert. Führen Sie regelmäßig Testläufe durch:</p>
<ol>
<li>Stoppen Sie die Schreibvorgänge auf dem Primärserver</li>
<li>Warten Sie, bis der Standby-Server aufgeholt hat (Lag → 0)</li>
<li>Hochstufung des Standbys</li>
<li>Überprüfen Sie, ob die Abfragen die erwarteten Ergebnisse liefern.</li>
<li>Umkehrung des Prozesses</li>
</ol>
<p>Messen Sie, wie lange jeder Schritt dauert, und dokumentieren Sie dies. Ziel ist es, die Ausfallsicherung zu einem Routineverfahren mit bekanntem Zeitplan zu machen - nicht zu einer stressigen Improvisation um 3 Uhr morgens. Teil 3 dieser Serie behandelt den Failover-Prozess im Detail.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Sie wollen CDC nicht selbst verwalten? Zilliz Cloud kümmert sich darum<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Einrichten und Betreiben der CDC-Replikation von Milvus ist zwar sehr leistungsfähig, bringt aber auch einen gewissen Aufwand mit sich: Sie müssen zwei Cluster verwalten, den Zustand der Replikation überwachen, Failover-Runbooks verwalten und die Infrastruktur über Regionen hinweg pflegen. Für Teams, die eine produktionsgerechte HA ohne den operativen Aufwand wünschen, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) dies sofort nach dem Auspacken.</p>
<p><strong>Global Cluster</strong> ist das Hauptmerkmal von Zilliz Cloud. Damit können Sie eine Milvus-Bereitstellung über mehrere Regionen hinweg - Nordamerika, Europa, Asien-Pazifik und mehr - als einen einzigen logischen Cluster betreiben. Unter der Haube kommt dieselbe CDC/WAL-Replikationstechnologie zum Einsatz, die in diesem Artikel beschrieben wurde, allerdings vollständig verwaltet:</p>
<table>
<thead>
<tr><th>Leistungsumfang</th><th>Selbstverwaltete CDC (dieser Artikel)</th><th>Zilliz Cloud Globaler Cluster</th></tr>
</thead>
<tbody>
<tr><td><strong>Replikation</strong></td><td>Sie konfigurieren und überwachen</td><td>Automatisierte, asynchrone CDC-Pipeline</td></tr>
<tr><td><strong>Ausfallsicherung</strong></td><td>Manuelles Runbook</td><td>Automatisiert - keine Code-Änderungen, keine Aktualisierung der Verbindungszeichenfolge</td></tr>
<tr><td><strong>Selbstheilung</strong></td><td>Sie stellen den ausgefallenen Cluster neu bereit</td><td>Automatisch: erkennt den veralteten Zustand, setzt ihn zurück und baut ihn als neuen sekundären Cluster neu auf</td></tr>
<tr><td><strong>Regionsübergreifend</strong></td><td>Sie stellen beide Cluster bereit und verwalten sie</td><td>Integrierte Multi-Region mit lokalem Lesezugriff</td></tr>
<tr><td><strong>RPO</strong></td><td>Sekunden (abhängig von Ihrer Überwachung)</td><td>Sekunden (ungeplant) / Null (geplante Umschaltung)</td></tr>
<tr><td><strong>RTO</strong></td><td>Minuten (hängt von Ihrem Runbook ab)</td><td>Minuten (automatisiert)</td></tr>
</tbody>
</table>
<p>Über Global Cluster hinaus umfasst der Business Critical-Plan zusätzliche DR-Funktionen:</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR)</strong> - Rollback einer Sammlung zu einem beliebigen Zeitpunkt innerhalb des Aufbewahrungsfensters, nützlich für die Wiederherstellung von versehentlich gelöschten oder beschädigten Daten, die auf den Standby-Server repliziert werden.</li>
<li><strong>Regionsübergreifende Sicherung</strong> - automatische, fortlaufende Sicherungsreplikation in eine Zielregion. Die Wiederherstellung auf neuen Clustern dauert nur Minuten.</li>
<li><strong>99,99 % SLA für die Betriebszeit</strong> - unterstützt durch eine Multi-AZ-Bereitstellung mit mehreren Replikaten.</li>
</ul>
<p>Wenn Sie Vektorsuche in der Produktion betreiben und DR eine Anforderung ist, lohnt es sich, Zilliz Cloud neben dem selbstverwalteten Milvus-Ansatz zu evaluieren. <a href="https://zilliz.com/contact-sales">Kontaktieren Sie das Zilliz-Team</a> für weitere Informationen.</p>
<h2 id="Whats-Next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Artikel wurde die HA-Landschaft für Vektordatenbanken behandelt und der Aufbau eines Primär-/Standby-Paares von Grund auf erläutert. Als nächstes folgt:</p>
<ul>
<li><strong>Teil 2</strong>: Hinzufügen von CDC zu einem bestehenden Milvus-Cluster, das bereits Daten enthält, unter Verwendung von <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> zum Seeden des Standby, bevor die Replikation aktiviert wird</li>
<li><strong>Teil 3</strong>: Verwalten des Failover - Promoten des Standby, Umleiten des Datenverkehrs und Wiederherstellen des ursprünglichen primären Systems</li>
</ul>
<p>Bleiben Sie dran.</p>
<hr>
<p>Wenn Sie <a href="https://milvus.io/">Milvus</a> in der Produktion einsetzen und über Disaster Recovery nachdenken, würden wir Ihnen gerne helfen:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um Fragen zu stellen, Ihre HA-Architektur mit anderen zu teilen und von anderen Teams zu lernen, die Milvus in großem Maßstab betreiben.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihr DR-Setup durchzugehen - egal ob es sich um die CDC-Konfiguration, die Failover-Planung oder die Bereitstellung mehrerer Regionen handelt.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen und direkt mit der produktionsbereiten Hochverfügbarkeit beginnen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltetes Milvus) eine regionsübergreifende Hochverfügbarkeit durch die Global Cluster-Funktion - ohne manuelle CDC-Einrichtung.</li>
</ul>
<hr>
<p>Ein paar Fragen, die auftauchen, wenn Teams mit der Einrichtung der Hochverfügbarkeit von Vector-Datenbanken beginnen:</p>
<p><strong>F: Verlangsamt CDC den Primärcluster?</strong></p>
<p>Nein. Der CDC-Knoten liest die WAL-Protokolle asynchron und unabhängig vom Lese-/Schreibpfad. Er konkurriert nicht mit Abfragen oder Einfügungen um Ressourcen auf dem primären Cluster. Sie werden keinen Leistungsunterschied feststellen, wenn CDC aktiviert ist.</p>
<p><strong>F: Kann CDC Daten replizieren, die bereits vor der Aktivierung vorhanden waren?</strong></p>
<p>Nein - CDC erfasst nur Änderungen ab dem Zeitpunkt, an dem es aktiviert wurde. Um vorhandene Daten in den Standby zu bringen, verwenden Sie <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>, um den Standby zuerst zu seeden und dann CDC für die laufende Replikation zu aktivieren. Teil 2 dieser Serie behandelt diesen Arbeitsablauf.</p>
<p><strong>F: Brauche ich CDC noch, wenn ich bereits Multi-Replica aktiviert habe?</strong></p>
<p>Sie schützen vor unterschiedlichen Ausfallmodi. <a href="https://milvus.io/docs/replica.md">Multi-Replica</a> behält Kopien der gleichen <a href="https://milvus.io/docs/glossary.md">Segmente</a> über Knoten innerhalb eines Clusters hinweg - großartig bei Knotenausfällen, nutzlos, wenn der gesamte Cluster weg ist (schlechte Bereitstellung, AZ-Ausfall, Namespace-Löschung). CDC hält einen separaten Cluster in einer anderen Fehlerdomäne mit nahezu Echtzeitdaten. Für alles, was über eine Entwicklungsumgebung hinausgeht, brauchen Sie beides.</p>
<p><strong>F: Wie lässt sich Milvus CDC mit der Replikation in anderen Vektordatenbanken vergleichen?</strong></p>
<p>Die meisten Vektordatenbanken bieten heute Redundanz auf Knotenebene (gleichbedeutend mit Multireplika), aber keine Replikation auf Clusterebene. Milvus ist derzeit die einzige große Vektordatenbank mit integrierter WAL-basierter CDC-Replikation - demselben bewährten Muster, das relationale Datenbanken wie PostgreSQL und MySQL seit Jahrzehnten verwenden. Wenn eine cluster- oder regionsübergreifende Ausfallsicherung erforderlich ist, ist dies ein wichtiges Unterscheidungsmerkmal, das es zu bewerten gilt.</p>

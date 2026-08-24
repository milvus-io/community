---
id: milvus-3-0-external-collection.md
title: >-
  Milvus Externe Kollektion: Lake-residente Daten indizieren und abrufen, ohne
  sie zu verschieben
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 hat External Collection eingeführt, das es Milvus ermöglicht,
  Indizes zu erstellen und Retrieval über Daten bereitzustellen, die im Lake
  verbleiben.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>In vielen KI-Pipelines werden Embeddings und Metadaten bereits erzeugt und in einem Data Lake gespeichert. Eine Produktpipeline könnte Produktattribute und multimodale Embeddings als Parquet-Dateien in S3 schreiben. Ein Retrieval- oder Trainingskorpus könnte in einer Iceberg- oder Lance-Tabelle leben. Der Lake ist bereits dort, wo diese Datensätze erzeugt, aktualisiert, versioniert und vom restlichen Daten-Stack verwendet werden.</p>
<p>Vektordatenbanken hingegen wurden traditionell um eine von der Datenbank verwaltete Serving-Kopie herum aufgebaut. Wenn Teams eine Vektorsuche mit geringer Latenz über Daten benötigten, die bereits in einem Lake lagen, hatten sie in der Regel zwei Optionen:</p>
<ul>
<li><strong>Die Daten in eine Vektordatenbank kopieren.</strong> Dies bietet ANN-Indizes und einen produktiven Serving-Pfad, erzeugt aber eine zweite Kopie des Datensatzes und eine ETL-Pipeline, die mit der Quelle synchronisiert bleiben muss.</li>
<li><strong>Den Lake direkt abfragen.</strong> Dies vermeidet Duplikate, aber ohne eine ANN-Indizierungs- und Serving-Schicht fällt die Vektorsuche auf Scans zurück, die nicht für Produktionslatenzen ausgelegt sind.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>führt einen dritten Weg ein.</strong> Die Quelldaten bleiben in Parquet, Iceberg, Lance, Vortex oder einem anderen unterstützten externen Format, während Milvus darauf Indizes aufbaut und diese bereitstellt. Sie mappen die externen Felder in ein Milvus-Schema, definieren die benötigten Indizes, aktualisieren die Collection und verwenden die normalen Milvus-Such- und Abfrage-APIs – ohne die Quelldatenzeilen zuvor in eine von Milvus verwaltete Collection zu kopieren.</p>
<p>Die architektonische Änderung ist klar: Die Daten können im Lake verbleiben, während Milvus die Indizierungs- und Retrieval-Schicht hinzufügt.</p>
<p>Das macht External Collection auch zu einem wichtigen Schritt in Richtung <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> einer einheitlichen, lake-nativen Datenarchitektur für KI, die Serving auf dem Niveau einer Vektordatenbank mit offenem Lake-Speicher, wiederverwendbaren Indizes auf Lake-Ebene und einer gemeinsamen semantischen Schicht verbindet. Online-Retrieval muss nicht länger mit einer separaten Serving-Kopie beginnen, während Spark, Trainingspipelines, Evaluierungsaufträge und Governance-Tools mit einer anderen Version der Daten arbeiten. Sie können von derselben lake-residenten Datenbasis aus arbeiten.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Was eine External Collection ist und was sie verändert<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Eine External Collection</strong> ist eine Art von Milvus-Collection, deren Quelldaten außerhalb des von Milvus verwalteten Speichers leben.</p>
<p>Ohne eine External Collection bedeutet es, diesen Katalog hinter einer produktiven Vektorsuche zu platzieren, normalerweise, eine weitere Kopie in Milvus zu erstellen:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jedes Mal, wenn sich der Katalog ändert, sich das Embedding-Modell ändert oder ein Feld nachträglich befüllt wird, muss eine weitere Pipeline die aktualisierten Daten über diese Grenze bewegen.</p>
<p>Mit External Collection wird die Architektur zu:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus macht <strong>keine</strong> eigene Quell-Datenkopie aus externen Dateien. Stattdessen enthält die External Collection die Informationen, die Milvus benötigt, um diese zu interpretieren und zu durchsuchen:</p>
<ol>
<li>Eine <code translate="no">external_source</code>, die die externen Dateien oder die Tabelle identifiziert.</li>
<li>Eine <code translate="no">external_spec</code>, die das Quellformat und den Speicherzugriff beschreibt.</li>
<li><code translate="no">external_field</code>-Zuordnungen, die Felder im Milvus-Schema mit Spalten im externen Datensatz verbinden.</li>
<li>Die Indizes, Manifeste und Serving-Zustände, die Milvus für das Retrieval erstellt.</li>
</ol>
<p><strong>Null-Kopie der Quelldaten bedeutet nicht null Zustand in Milvus.</strong> Milvus baut weiterhin Indizes auf. Es verwendet weiterhin Rechenressourcen. Es cached weiterhin Daten. Die Änderung besteht darin, dass die maßgeblichen Zeilen nicht mehr in Milvus kopiert werden müssen, nur weil Sie Milvus benötigen, um nach ihnen zu suchen.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Normale Milvus-Collection vs. External Collection</h3><table>
<thead>
<tr><th><strong>Aspekt</strong></th><th><strong>Von Milvus verwaltete Collection</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Quelldatensätze</td><td>Von Milvus gespeichert und verwaltet</td><td>Verbleiben in den externen Dateien oder der Tabelle</td></tr>
<tr><td>Wie Daten in Milvus gelangen</td><td>Insert, Upsert, Import oder Streaming-Write</td><td>Externe Quellzuordnung + Refresh</td></tr>
<tr><td>Online-Mutationen</td><td>Unterstützt</td><td>Von Milvus aus schreibgeschützt</td></tr>
<tr><td>Aktualität</td><td>Folgt dem Milvus-Schreibpfad und Konsistenzmodell</td><td>Folgt dem zuletzt erfolgreich veröffentlichten Refresh</td></tr>
<tr><td>Von Milvus verwalteter Zustand</td><td>Quelldaten, Metadaten, Indizes, Caches</td><td>Zuordnungen, Manifeste, Indizes, Caches</td></tr>
<tr><td>Abfragepfad</td><td>Milvus-Such- und Abfrage-APIs</td><td>Milvus-Such- und Abfrage-APIs</td></tr>
<tr><td>Bester Einsatzbereich</td><td>Kontinuierlich wechselnde Online-Daten</td><td>Große, in Batches erzeugte, leseintensive Lake-Daten</td></tr>
</tbody>
</table>
<p>External Collection ergänzt daher normale Milvus-Collections, anstatt sie zu ersetzen.</p>
<p>Ein System kann schnell wechselnde Online-Zustände in normalen Milvus-Collections halten, während es External Collections für große Korpora, Kataloge, historische Datensätze, Modell-Features oder andere Daten verwendet, die bereits im Lake erzeugt und verwaltet werden.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Warum das Entfernen der zweiten Kopie wichtig ist<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist verlockend, External Collections als Speicheroptimierung zu beschreiben: Kopieren Sie nicht mehrere Terabyte an Daten in eine andere Datenbank, und Sie sparen Speicher. Das ist nützlich, aber es ist nicht das Hauptproblem der Architektur.</p>
<p><strong>Die höheren Kosten entstehen dadurch, dass zwei Datensysteme abgeglichen werden müssen.</strong></p>
<p>Betrachten wir erneut den Produktkatalog. Die Datenplattform erzeugt den maßgeblichen Parquet-Datensatz. Die Suche importiert ihn in eine Vektordatenbank. Ein Empfehlungsteam könnte dieselben Lake-Daten über Spark für Offline-Analysen lesen. Ein neues Embedding-Modell erzeugt dann eine Ersatz-Vektorspalte. Inventar und Metadaten ändern sich gleichzeitig kontinuierlich.</p>
<p>Sobald die Online-Serving-Kopie unabhängig vom Lake wird, muss jede Änderung diese Grenze überqueren:</p>
<ul>
<li>die Daten müssen kopiert werden;</li>
<li>die Übertragung muss geplant und überwacht werden;</li>
<li>fehlgeschlagene Aufträge benötigen Wiederholungen;</li>
<li>Schemas und Berechtigungen müssen möglicherweise in mehreren Systemen abgebildet werden;</li>
<li>die Aktualität hängt davon ab, wie schnell die Synchronisierungspipeline aufholt;</li>
<li>Teams müssen wissen, welche Kopie die Version darstellt, die sie tatsächlich möchten.</li>
</ul>
<p>Speicher ist nur eine Kostenposition.</p>
<table>
<thead>
<tr><th><strong>Kosten</strong></th><th><strong>Separater Lake + Serving-Kopie</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Kopien der Quelldaten</strong></td><td>Lake-Kopie plus eine separate Serving-Kopie</td><td>Quellzeilen verbleiben im Lake</td></tr>
<tr><td><strong>Datenbewegung</strong></td><td>Permanente ETL-/Import-Pipeline</td><td>Refresh über die externe Quelle</td></tr>
<tr><td><strong>Aktualität</strong></td><td>Hängt vom Export-/Import-Rhythmus ab</td><td>Gesteuert durch die Veröffentlichung eines neuen Refresh</td></tr>
<tr><td><strong>Governance</strong></td><td>Quell- und Serving-Kopien müssen abgeglichen bleiben</td><td>Quelleneigentum, Herkunft und Versionierung verbleiben bei der Lake-Plattform</td></tr>
<tr><td><strong>Offline-Wiederverwendung</strong></td><td>Andere Konsumenten erstellen möglicherweise eigene Kopien</td><td>Bestehende Lake-Tools können weiterhin dieselbe Quelle lesen</td></tr>
<tr><td><strong>Serving-Ressourcen</strong></td><td>Dimensioniert um die Datenbankkopie und das Abfrageaufkommen</td><td>Indizierung, Abfrage-Rechenleistung und Caches können getrennt vom Eigentum an den Quellzeilen verwaltet werden</td></tr>
</tbody>
</table>
<p>Der Unterschied wird besonders wichtig, wenn sich KI-Daten häufiger ändern.</p>
<p>Teams deduplizieren Korpora. Sie clustern Daten für Analysen. Sie erzeugen neue Embeddings, wenn sich ein Modell ändert. Sie fügen Labels, Zusammenfassungen, extrahierte Entitäten, Qualitätswerte oder Feedback-Signale hinzu. Sie führen Evaluierungsaufträge und Datenbereinigungspipelines über denselben Korpus aus, aus dem Produktionsanwendungen abrufen.</p>
<p>Wenn jedes System seine eigene Kopie besitzt, wird jede Verbesserung zu einem weiteren Synchronisierungsauftrag.</p>
<p>External Collection verändert diese Grenze: <strong>Offline-Systeme können weiterhin am Lake-Datensatz arbeiten, während Milvus Retrieval auf derselben Grundlage bereitstellt.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Welche Datenquellen External Collection unterstützt<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection ist für offene, extern verwaltete Daten konzipiert und nicht für ein Milvus-spezifisches Quellformat. Es unterstützt mehrere externe Quellformate über <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Externes Format</strong></th><th><strong>format-Wert</strong></th><th><strong>Was Milvus liest</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Ein Verzeichnis oder Objektspeicher-Präfix, das Parquet-Dateien und Zeilengruppen enthält</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Vortex-Dateien und ihre Layout-Metadaten</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Einen Lance-Datensatz und seine Fragment-Metadaten</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Iceberg-Metadaten plus einen ausgewählten Snapshot</td></tr>
<tr><td>Milvus-Snapshot</td><td>milvus-table</td><td>Einen unterstützten Milvus-Snapshot, der als externe Quelle bereitgestellt wird</td></tr>
</tbody>
</table>
<p>Die Zuordnung zwischen Quelle und Milvus ist explizit.</p>
<p>Eine Quellspalte namens <code translate="no">product_id</code> kann zum Milvus-Feld <code translate="no">id</code> werden; <code translate="no">image_vec</code> kann zu <code translate="no">embedding</code> werden; und eine breite Quelltabelle muss nicht jede Spalte für die Collection bereitstellen. Das bedeutet, dass die Datenplattform ihre Quelle nicht umbenennen oder umschreiben muss, nur um die Serving-Datenbank zufriedenzustellen.</p>
<p>Versionierte Formate fügen eine weitere nützliche Eigenschaft hinzu. Mit einer Quelle wie Iceberg kann die Collection auf einen bestimmten Snapshot zeigen, anstatt auf das, was zum Zeitpunkt der Abfrage gerade aktuell ist. Eine feste Quellversion ist nützlich für reproduzierbare Evaluierung, Regressionstests, historische Analysen und Audit-Arbeitslasten.</p>
<p>Die zugrunde liegenden Dateien bleiben auch für den Rest des Daten-Stacks nutzbar. Spark, Trainings-Frameworks, Governance-Systeme und andere lake-kompatible Tools können weiterhin dieselben offenen Daten lesen.</p>
<p>External Collection fügt einen weiteren Konsumenten dieser Daten hinzu; es macht Milvus nicht zu deren alleinigem Eigentümer.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Sicherer Zugriff auf externen Speicher</h3><p>Milvus benötigt außerdem die Berechtigung, den externen Speicher zu lesen.</p>
<p>Abhängig vom Speicheranbieter können Bereitstellungen Mechanismen wie Workload- oder Instanzidentität, AWS-STS-Rollenannahme, Dienstkonten-Impersonation, SAS-basierten Zugriff oder anbieterspezifische Rollensysteme verwenden, anstatt langlebige Anmeldeinformationen in der Anwendungskonfiguration zu hinterlegen.</p>
<p>Diese Speicheridentität steuert, wie Milvus die Quelle erreicht. Die Autorisierung innerhalb von Milvus bleibt eine separate Sicherheitsgrenze.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">So erstellen, indizieren, aktualisieren und durchsuchen Sie eine External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Lebenszyklus einer External Collection hat vier Hauptschritte:</p>
<ol>
<li>Definieren Sie die externe Quelle und mappen Sie ihre Spalten in ein Milvus-Schema.</li>
<li>Definieren Sie die Indizes, die die Arbeitslast benötigt.</li>
<li>Führen Sie Refresh aus, damit Milvus die Quelldaten erkennt und eine abfragbare Version vorbereitet.</li>
<li>Laden Sie die Collection und verwenden Sie die normalen Milvus-Such- und Abfrage-APIs.</li>
</ol>
<p>Hier ist derselbe Produktkatalog als External Collection dargestellt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Indizes verwenden die normale Milvus-Schnittstelle:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Danach die externe Quelle aktualisieren:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Sobald die aktualisierte Version bereit ist, laden und durchsuchen Sie sie wie eine normale Milvus-Collection:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Der wichtige Unterschied liegt nicht im Suchaufruf. Er liegt darin, wo der Lebenszyklus beginnt. Eine von Milvus verwaltete Collection beginnt damit, dass Daten in Milvus geschrieben oder importiert werden. Eine External Collection beginnt mit einem Verweis auf Daten, die bereits anderswo existieren.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Wie Refresh Änderungen in externen Daten erkennt<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection ist von der Milvus-Seite aus schreibgeschützt, aber der zugrunde liegende Lake-Datensatz muss nicht für immer eingefroren bleiben.</p>
<p>Angenommen, die Produktpipeline fügt einen weiteren Batch hinzu, aktualisiert Metadaten oder schreibt Embeddings aus einem neuen Modell. Milvus verfolgt nicht kontinuierlich jedes Objekt, das im Quellpfad erscheint. Diese Änderungen werden über <strong>Refresh</strong> sichtbar.</p>
<p>Refresh liest die externen Metadaten, löst die Quellfragmente auf, aktualisiert die Manifeste, die sie mit der Milvus-Collection verbinden, und bereitet den entsprechenden Indexzustand vor.</p>
<p>Der Schlüssel ist, dass diese Arbeit inkrementell sein kann.</p>
<p>Milvus identifiziert Quellfragmente, die sich nicht geändert haben, und kann deren vorhandene Segment- und Indexarbeit wiederverwenden. Neue oder geänderte Fragmente sind die Teile, die neue Verarbeitung erfordern.</p>
<p>Eine kleine Änderung an einem Multi-Terabyte-Datensatz muss daher keinen weiteren vollständigen Import und vollständigen Index-Neuaufbau auslösen.</p>
<p>Refresh gibt dem Serving-System auch eine klare Versionsgrenze. Während eine neue Version vorbereitet wird, verwenden Abfragen weiterhin den zuvor veröffentlichten Zustand. Sobald Refresh abgeschlossen ist, wird der neue Zustand als vollständige Version verfügbar, anstatt eine Mischung aus alten und teilweise vorbereiteten Daten bereitzustellen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dieses Modell passt natürlich zu stündlichen Katalog-Builds, nächtlichen Wissensdatenbank-Updates, periodischen Embedding-Aktualisierungen, modellgenerierten Feature-Pipelines und ähnlichen batch-orientierten Arbeitslasten.</p>
<p>Es ersetzt <strong>keinen</strong> Streaming-Schreibpfad. Wenn jeder Insert oder Delete sofort über Milvus durchsuchbar sein muss, bleibt eine verwaltete Collection das bessere Modell.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Wie Lazy Loading den Speicherbedarf für breite Datensätze reduziert<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Quellzeilen im Objektspeicher zu belassen, hilft nur, wenn die Serving-Schicht nicht jedes Byte lokal laden muss, bevor sie Abfragen beantworten kann. Mit aktiviertem Milvus Tiered Storage ist das nicht der Fall.</p>
<p>Beim Laden der Collection können QueryNodes zunächst nur leichtgewichtige Metadaten wie Schema-Informationen, Indexdefinitionen, Chunk-Maps und Verweise auf entfernte Objekte behalten. Felddaten werden auf Chunk-Ebene abgerufen, wenn eine Abfrage sie benötigt; Indizes können bis zur ersten Verwendung entfernt bleiben und dann lokal gecacht werden. Häufig verwendete Daten bleiben heiß, während weniger häufig aufgerufene Daten aus dem Cache entfernt werden können.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dies ist besonders nützlich für breite KI-Datensätze.</p>
<p>Eine Produktzeile könnte mehrere Embeddings, eine lange Beschreibung, rohes JSON, Bildmetadaten, generierte Zusammenfassungen, Inventar, Preise, Bewertungen und viele andere Attribute enthalten. Eine typische Ähnlichkeitssuche berührt möglicherweise nur einen Vektor plus Inventar, Preis und Bewertung. Es gibt keinen Grund, warum jedes andere Feld dauerhaft Serving-Speicher belegen muss, nur weil es zum selben Datensatz gehört.</p>
<p>External Collection kann den Serving-Fußabdruck auf zwei Ebenen verkleinern:</p>
<ul>
<li><strong>Erstens, Schema-Projektion.</strong> Über <code translate="no">external_field</code> kann die External Collection nur die Quellspalten bereitstellen, die die Anwendung benötigt. Andere Spalten verbleiben im Lake-Datensatz und sind nicht in diesem Serving-Schema enthalten.</li>
<li><strong>Zweitens, Laufzeit-Projektion.</strong> Im tiered Serving-Modell rufen QueryNodes die Felder und Indizes ab und cachen sie, die die Arbeitslast tatsächlich benötigt, anstatt den gesamten gemappten Datensatz im Voraus zu laden.</li>
</ul>
<p>Mit anderen Worten: <strong>Der Datensatz kann im Lake breit bleiben, ohne dass der Serving-Fußabdruck ebenso breit sein muss.</strong></p>
<p>Es gibt einen offensichtlichen Kompromiss. Eine Abfrage, die auf ein kaltes Feld oder einen kalten Index trifft, kann beim ersten Zugriff mit einem Remote-Read verbunden sein. Aufwärmrichtlinien können latenzkritische Felder oder Indizes vorabladen, während Cache- und Eviction-Richtlinien verhindern, dass weniger häufig verwendete Zustände lokale Ressourcen dauerhaft belegen.</p>
<p>Der Punkt ist nicht, dass sich Objektspeicher wie RAM verhält. Es geht darum, dass Speicher und lokaler Speicher dem Arbeitsset der Retrieval-Arbeitslast folgen können, anstatt der Gesamtgröße und -breite des Quelldatensatzes.</p>
<p>Das Quellformat spielt hier ebenfalls eine Rolle. Formate, die für breite analytische Scans entwickelt wurden, und Formate, die für schmalere oder zufällige Lesezugriffe optimiert sind, können beim On-Demand-Zugriff unterschiedliches I/O-Verhalten erzeugen. External Collection löscht diese Speicher-Kompromisse nicht; es lässt Milvus eine Retrieval-Schicht darauf aufbauen.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Welche Such- und Indizierungsfunktionen External Collection unterstützt<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection zeigt Milvus nicht einfach auf ein Verzeichnis mit Embeddings und scannt die Dateien durch. Milvus baut Retrieval-Strukturen auf externen Daten auf und führt Abfragen über seine standardmäßige Retrieval-Engine aus.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Milvus-Indizes, die über externen Daten aufgebaut werden</h3><p>Je nach Feldern und Arbeitslast kann Milvus Folgendes aufbauen:</p>
<ul>
<li>Vektorindizes für die ANN-Suche;</li>
<li>Skalarindizes für Metadaten-Filterung;</li>
<li>JSON-Indizes für semistrukturierte Attribute;</li>
<li>BM25- und Volltextindizes für lexikalisches Retrieval.</li>
<li>Funktionsgenerierte Felder, die vom Milvus-Datenmodell unterstützt werden.</li>
</ul>
<p>Die ANN-Suche verwendet diese Indizes, um den Kandidatensatz einzugrenzen, anstatt jeden Quellvektor zu lesen.</p>
<p>Diese Unterscheidung ist wichtig, denn ein Embedding in einem Lake zu speichern ist nicht dasselbe wie eine Vektordatenbank darüber zu betreiben. Persistenz gibt Ihnen Bytes. Produktives Retrieval benötigt auch Indizes, Abfrageplanung, Filterung, Ranking, Caching und einen Serving-Pfad mit geringer Latenz.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Über Vektor-Top-K hinaus</h3><p>Ein weiterer häufiger Fehler ist, „External Collection" als „Vektorsuche über Parquet" zu lesen. Das verkauft das, was produktives Retrieval tatsächlich erfordert, unter Wert.</p>
<p>Ein Produktionssuchergebnis hängt selten allein von der Vektorähnlichkeit ab. Es kann auch von exakten Begriffen, Zugriffsrichtlinien, Inventar, Zeitstempel, Kategorie, Preis, Quellqualität oder geschäftlichen Ranking-Signalen abhängen.</p>
<p>Betrachten wir eine Abfrage wie:</p>
<table>
<thead>
<tr><th>rotes Blumenkleid für den Sommer, auf Lager, höchste Bewertung zuerst</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Ein produktiver Retrieval-Pfad benötigt möglicherweise mehrere Signale:</p>
<ul>
<li><strong>Vektorähnlichkeit</strong> für die semantische Bedeutung von „sommerliches Blumenkleid".</li>
<li><strong>Lexikalische oder Volltextsuche</strong> für einen exakten Begriff wie „rot".</li>
<li><strong>Skalarfilter</strong>, um Produkte zu entfernen, die nicht auf Lager sind oder unter einer Bewertungsschwelle liegen.</li>
<li><strong>Hybrides Retrieval und Ranking</strong>, um mehrere Retrieval-Signale zu kombinieren.</li>
</ul>
<p>Milvus 3.0 erweitert die Abfrage-Engine außerdem über die initiale Nachbarschaftssuche hinaus um Funktionen wie <strong>serverseitige Sortierung, Aggregation und Facettierung.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der übergreifende Punkt ist, dass External Collection lake-residenten Daten einen Datenbank-Retrieval-Pfad gibt – nicht nur eine Möglichkeit, Vektoren aus Dateien zu lesen.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Wie dieselben Lake-Daten Online-Serving und Offline-Verarbeitung unterstützen<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>Der stärkste architektonische Grund, die Quelle in einem offenen Lake-Format zu belassen, ist nicht einfach, dass eine zweite Kopie Geld kostet. Es ist, dass derselbe Datensatz für die Systeme verfügbar bleiben kann, die ihn kontinuierlich verbessern.</p>
<p>Gehen wir zurück zum Produktkatalog.</p>
<p>Tagsüber kann Milvus eine External Collection für Produktsuche, Empfehlungen oder Agenten-Retrieval bereitstellen.</p>
<p>Gleichzeitig können andere Systeme direkt am Lake-Datensatz arbeiten:</p>
<ul>
<li>Spark kann doppelte Produkte identifizieren.</li>
<li>Eine Trainingspipeline kann Embeddings aus einem neuen Modell erzeugen.</li>
<li>Ein Datenqualitätsauftrag kann fehlerhafte oder anomale Datensätze erkennen.</li>
<li>Eine Evaluierungspipeline kann die Retrieval-Qualität zwischen Modellversionen vergleichen.</li>
<li>Ein Batch-Prozess kann Zusammenfassungen, Labels oder zusätzliche Metadaten erzeugen.</li>
</ul>
<p>External Collection führt <strong>diese</strong> Aufträge nicht selbst aus. Spark bleibt Spark; Training bleibt Training. Seine Rolle besteht darin, die zusätzliche Serving-Datengrenze zwischen ihnen zu entfernen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Offline-Arbeit kann verbesserte Daten oder neue Felder zurück in den Lake schreiben. Ein anschließender Refresh macht die aktualisierte Quelle für den Milvus-Retrieval-Pfad verfügbar.</p>
<p>Es gibt keine separate Export-Import-Schleife, deren einziger Zweck darin besteht, eine weitere maßgebliche Kopie für das Serving zu rekonstruieren.</p>
<p>Auch die Governance bleibt klar getrennt. Quellversionen, Herkunft und Quelleneigentum verbleiben bei der Lake-Plattform. Milvus pflegt seine eigene Autorisierung auf Collection-Ebene und die Anmeldeinformationen, die zum Lesen der Quelle erforderlich sind. Eine gemeinsame Datenbasis zu teilen bedeutet nicht, jede Sicherheitsdomäne in ein einziges System zu kollabieren.</p>
<p>Dies ist die Verbindung zu <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: Der Lake bleibt die gemeinsame Datenbasis, während Milvus eine Retrieval-Schicht mit geringer Latenz darüber bereitstellt. External Collection ist ein Teil dieser Architektur, neben Storage V3, Snapshots, Spark-Integration, Schema-Evolution und Backfill.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Wo External Collection passt – und wo nicht<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection ist eine gute Wahl, wenn:</strong></p>
<ul>
<li>Ihre maßgeblichen Daten bereits in Parquet, Vortex, Lance, Iceberg oder einer anderen unterstützten externen Quelle vorliegen.</li>
<li>Der Datensatz hauptsächlich in Batches erzeugt wird und nicht durch hochfrequente transaktionale Schreibvorgänge.</li>
<li>Das Pflegen einer zweiten Serving-Kopie erheblichen ETL-, Aktualitäts- oder Governance-Aufwand erzeugt.</li>
<li>Mehrere Systeme mit demselben offenen Datensatz arbeiten müssen.</li>
<li>Eine explizite Refresh-Grenze für die Serving-Aktualität akzeptabel ist.</li>
<li>Sie produktives Milvus-Retrieval wünschen, ohne dass Milvus der Eigentümer der Quellzeilen wird.</li>
</ul>
<p><strong>Eine normale Milvus-Collection ist weiterhin die bessere Wahl, wenn:</strong></p>
<ul>
<li>die Anwendung kontinuierlich Datensätze einfügt oder aktualisiert;</li>
<li>Löschungen über den Online-Schreibpfad sichtbar werden müssen;</li>
<li>die Arbeitslast von Collection-Funktionen abhängt, die für externe Schemas nicht verfügbar sind;</li>
<li>das Serving-Design absichtlich alle erforderlichen Daten im Speicher hält, um Remote-Cache-Misses zu vermeiden.</li>
</ul>
<p><strong>Mehrere Grenzen sollten Sie im Hinterkopf behalten.</strong></p>
<ul>
<li><strong>External Collections sind schreibgeschützt.</strong> Quelländerungen finden außerhalb von Milvus statt.</li>
<li><strong>Null-Kopie gilt für Quellzeilen.</strong> Indizes, Manifeste, Caches und Rechenleistung kosten weiterhin Ressourcen.</li>
<li><strong>Refresh ist explizit.</strong> Es ist kein Streaming-Synchronisierungsmechanismus.</li>
<li><strong>Die Quelle muss erreichbar bleiben.</strong> Such-, Index- und Refresh-Verhalten hängen weiterhin von Speicherzugriff und Anmeldeinformationen ab.</li>
<li><strong>Storage V3 ist erforderlich.</strong> In Open-Source-Milvus 3.0 muss es vor der Verwendung von External Collection aktiviert sein.</li>
<li><strong>External Collection ersetzt keine vorgelagerte Verarbeitung.</strong> Embedding-Erzeugung, Clustering, Deduplizierung und Datenbereinigung finden weiterhin in den geeigneten vorgelagerten Systemen statt.</li>
</ul>
<p>Die Wahl ist daher komplementär und nicht binär. Ein System kann normale Milvus-Collections für sich schnell ändernde Online-Zustände verwenden und External Collections für große, in Batches erzeugte Datensätze, deren natürlicher Ort der Lake ist.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Testen Sie External Collection in Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection ist in Milvus 3.0 verfügbar. Beginnen Sie mit einem repräsentativen Lake-Datensatz und bewerten Sie die Aspekte, die für Ihre Arbeitslast wichtig sind: initialer und inkrementeller Refresh, Indexaufbaukosten, Verhalten bei warmen und kalten Abfragen sowie das Aktualitätsintervall, das Ihre Anwendung benötigt.</p>
<p>Implementierungsdetails finden Sie unter:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Eine External Collection erstellen</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Milvus-3.0-Versionshinweise</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus-3.0-Start-Blog</a></li>
</ul>
<p>Wenn Sie einen verwalteten Weg bevorzugen, ist External Collection auch als Teil von <strong>Zilliz Vector Lakebase</strong> in Zilliz Cloud verfügbar. Siehe:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection in Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Von der Vektordatenbank zu Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Warum wir Vector Lakebase gebaut haben: Unstrukturierte Datenarchitektur für KI neu denken</a></li>
</ul>
<p>Sie können Implementierungsfragen oder Feedback auch an das <a href="https://github.com/milvus-io/milvus">Milvus-GitHub-Repository</a> oder die <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> richten.</p>

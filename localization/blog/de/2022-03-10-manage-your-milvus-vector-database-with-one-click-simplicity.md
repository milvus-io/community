---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Verwalten Sie Ihre Milvus-Vektor-Datenbank ganz einfach mit einem Klick
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - ein GUI-Werkzeug für Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Binlog Titelbild</span> </span></p>
<p>Entwurf von <a href="https://github.com/czhen-zilliz">Zhen Chen</a> und Umgestaltung von <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Klicken Sie <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">hier</a>, um den Originalbeitrag zu lesen.</p> 
<p>Angesichts der schnell wachsenden Nachfrage nach der Verarbeitung unstrukturierter Daten sticht Milvus 2.0 hervor. Es ist ein KI-orientiertes Vektordatenbanksystem, das für massive Produktionsszenarien konzipiert wurde. Gibt es neben all diesen Milvus SDKs und Milvus CLI, einer Kommandozeilenschnittstelle für Milvus, ein Tool, mit dem Milvus noch intuitiver bedient werden kann? Die Antwort ist JA. Zilliz hat eine grafische Benutzeroberfläche - Attu - speziell für Milvus angekündigt. In diesem Artikel möchten wir Ihnen Schritt für Schritt zeigen, wie Sie eine Vektorähnlichkeitssuche mit Attu durchführen können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Attu Insel</span> </span></p>
<p>Im Vergleich zu Milvus CLI, das die einfachste Bedienung bietet, bietet Attu mehr:</p>
<ul>
<li>Installationsprogramme für Windows OS, macOS und Linux OS;</li>
<li>Intuitive GUI für eine einfachere Nutzung von Milvus;</li>
<li>Abdeckung der wichtigsten Funktionalitäten von Milvus;</li>
<li>Plugins zur Erweiterung der kundenspezifischen Funktionalitäten;</li>
<li>Vollständige Systemtopologie-Informationen zum leichteren Verständnis und zur Verwaltung der Milvus-Instanz.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Sie können die neueste Version von Attu auf <a href="https://github.com/zilliztech/attu/releases">GitHub</a> finden. Attu bietet ausführbare Installationsprogramme für verschiedene Betriebssysteme. Es ist ein Open-Source-Projekt und freut sich über Beiträge von jedermann.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Installation</span> </span></p>
<p>Sie können Attu auch über Docker installieren.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> ist die IP-Adresse der Umgebung, in der Attu läuft, und <code translate="no">milvus server IP</code> ist die IP-Adresse der Umgebung, in der Milvus läuft.</p>
<p>Nachdem Sie Attu erfolgreich installiert haben, können Sie die IP und den Port von Milvus in die Schnittstelle eingeben, um Attu zu starten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Milvus mit Attu verbinden</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Überblick über die Funktionen<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Übersichtsseite</span> </span></p>
<p>Die Attu-Benutzeroberfläche besteht aus einer <strong>Übersichtsseite</strong>, einer <strong>Sammlungsseite</strong>, einer <strong>Vektorsuchseite</strong> und einer <strong>Systemansichtsseite</strong>, die jeweils den vier Symbolen im linken Navigationsbereich entsprechen.</p>
<p>Die <strong>Übersichtsseite</strong> zeigt die geladenen Sammlungen an. Auf der Seite <strong>Sammlung</strong> werden alle Sammlungen aufgelistet und es wird angezeigt, ob sie geladen oder freigegeben sind.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Seite Sammlung</span> </span></p>
<p>Die Seiten <strong>Vektorsuche</strong> und <strong>Systemansicht</strong> sind Plugins von Attu. Die Konzepte und die Verwendung der Plugins werden im letzten Teil des Blogs vorgestellt.</p>
<p>Auf der Seite <strong>Vektorsuche</strong> können Sie eine Vektorgleichheitssuche durchführen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Seite Vektorsuche</span> </span></p>
<p>Auf der Seite <strong>Systemansicht</strong> können Sie die topologische Struktur von Milvus überprüfen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Seite Systemansicht</span> </span></p>
<p>Sie können auch die detaillierten Informationen zu jedem Knoten überprüfen, indem Sie auf den Knoten klicken.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Knoten-Ansicht</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Demonstration<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns Attu mit einem Testdatensatz erkunden.</p>
<p>In unserem <a href="https://github.com/zilliztech/attu/tree/main/examples">GitHub-Repositorium</a> finden Sie den Datensatz, der im folgenden Test verwendet wird.</p>
<p>Erstellen Sie zunächst eine Sammlung namens test mit den folgenden vier Feldern:</p>
<ul>
<li>Feldname: id, Primärschlüsselfeld</li>
<li>Feldname: vector, Vektorfeld, Float-Vektor, Dimension: 128</li>
<li>Feldname: brand, skalares Feld, Int64</li>
<li>Feldname: color, Skalarfeld, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Erstellen einer Sammlung</span> </span></p>
<p>Laden Sie die Sammlung für die Suche, nachdem sie erfolgreich erstellt wurde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Laden Sie die Sammlung</span> </span></p>
<p>Sie können nun die neu erstellte Sammlung auf der <strong>Übersichtsseite</strong> überprüfen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Überprüfen Sie die Sammlung</span> </span></p>
<p>Importieren Sie den Testdatensatz in Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Daten importieren</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Daten importieren</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Daten importieren</span> </span></p>
<p>Klicken Sie auf den Sammlungsnamen in der Übersicht oder auf der Sammlungsseite, um die Abfrageoberfläche zu öffnen und die importierten Daten zu überprüfen.</p>
<p>Fügen Sie einen Filter hinzu, geben Sie den Ausdruck <code translate="no">id != 0</code> an, klicken Sie auf <strong>Filter anwenden</strong> und dann auf <strong>Abfrage</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Daten abfragen</span> </span></p>
<p>Sie werden feststellen, dass alle fünfzig Einträge von Entitäten erfolgreich importiert wurden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Abfrageergebnis</span> </span></p>
<p>Versuchen wir die Vektorähnlichkeitssuche.</p>
<p>Kopieren Sie einen Vektor aus <code translate="no">search_vectors.csv</code> und fügen Sie ihn in das Feld <strong>Vektorwert</strong> ein. Wählen Sie die Sammlung und das Feld. Klicken Sie auf <strong>Suchen</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Daten suchen</span> </span></p>
<p>Sie können dann das Suchergebnis überprüfen. Ohne irgendwelche Skripte zu kompilieren, können Sie mit Milvus einfach suchen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Suchergebnis</span> </span></p>
<p>Lassen Sie uns zum Schluss noch die Seite <strong>System View</strong> überprüfen.</p>
<p>Mit der im Milvus Node.js SDK gekapselten Metrics API können Sie den Systemstatus, die Knotenbeziehungen und den Knotenstatus überprüfen.</p>
<p>Als exklusives Merkmal von Attu enthält die Systemübersichtsseite einen vollständigen topologischen Graphen des Systems. Wenn Sie auf einen Knoten klicken, können Sie seinen Status überprüfen (Aktualisierung alle 10 Sekunden).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Topologisches Diagramm der Milvus-Knoten</span> </span></p>
<p>Klicken Sie auf jeden Knoten, um die <strong>Knotenlistenansicht</strong> zu öffnen. Sie können alle Kindknoten eines Koordinatenknotens überprüfen. Durch Sortieren können Sie die Knoten mit hoher CPU- oder Speichernutzung schnell identifizieren und das Problem im System lokalisieren.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Milvus-Knotenliste</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">Was noch hinzukommt<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie bereits erwähnt, sind die Seiten <strong>Vektorsuche</strong> und <strong>Systemansicht</strong> Plugins von Attu. Wir ermutigen Benutzer, ihre eigenen Plugins in Attu zu entwickeln, um ihren Anwendungsszenarien gerecht zu werden. Im Quellcode gibt es einen Ordner, der speziell für Plugin-Codes angelegt wurde.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Plugins</span> </span></p>
<p>Sie können sich auf eines der Plugins beziehen, um zu lernen, wie man ein Plugin erstellt. Durch Setzen der folgenden Konfigurationsdatei können Sie das Plugin zu Attu hinzufügen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Plugins zu Attu hinzufügen</span> </span></p>
<p>Eine ausführliche Anleitung finden Sie im <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> und im <a href="https://milvus.io/docs/v2.0.x/attu.md">technischen Dokument von Milvus</a>.</p>
<p>Attu ist ein Open-Source-Projekt. Alle Beiträge sind willkommen. Sie können auch <a href="https://github.com/zilliztech/attu/issues">einen Fehler melden</a>, wenn Sie ein Problem mit Attu hatten.</p>
<p>Wir hoffen aufrichtig, dass Attu Ihnen eine bessere Benutzererfahrung mit Milvus bringen kann. Und wenn Ihnen Attu gefällt oder Sie Rückmeldungen zur Nutzung haben, können Sie diese <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">Attu-Benutzerumfrage</a> ausfüllen, um uns zu helfen, Attu zu optimieren und die Nutzererfahrung zu verbessern.</p>

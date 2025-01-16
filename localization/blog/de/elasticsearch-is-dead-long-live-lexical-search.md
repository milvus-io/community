---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch ist tot, es lebe die lexikalische Suche'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>Inzwischen weiß jeder, dass die hybride Suche die <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Suchqualität</a> (Retrieval-Augmented Generation) verbessert hat. Während die Suche <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">mit dichter Einbettung</a> beeindruckende Fähigkeiten bei der Erfassung tiefer semantischer Beziehungen zwischen Abfragen und Dokumenten gezeigt hat, weist sie immer noch bemerkenswerte Einschränkungen auf. Dazu gehören mangelnde Erklärbarkeit und suboptimale Leistung bei Long-Tail-Anfragen und seltenen Begriffen.</p>
<p>Viele RAG-Anwendungen haben damit zu kämpfen, dass den vortrainierten Modellen oft domänenspezifisches Wissen fehlt. In einigen Szenarien übertrifft das einfache BM25-Schlüsselwortmatching diese hochentwickelten Modelle. Hier schließt die hybride Suche die Lücke, indem sie das semantische Verständnis des Dense Vector Retrieval mit der Präzision des Keyword Matching kombiniert.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Warum die hybride Suche in der Produktion komplex ist<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Während Frameworks wie <a href="https://zilliz.com/learn/LangChain">LangChain</a> oder <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> den Aufbau eines Proof-of-Concept-Hybrid-Retrievers erleichtern, ist die Skalierung auf die Produktion mit massiven Datensätzen eine Herausforderung. Herkömmliche Architekturen erfordern separate Vektordatenbanken und Suchmaschinen, was zu mehreren zentralen Herausforderungen führt:</p>
<ul>
<li><p>Hohe Wartungskosten für die Infrastruktur und betriebliche Komplexität</p></li>
<li><p>Datenredundanz über mehrere Systeme hinweg</p></li>
<li><p>Schwierige Verwaltung der Datenkonsistenz</p></li>
<li><p>Komplexe Sicherheit und systemübergreifende Zugriffskontrolle</p></li>
</ul>
<p>Der Markt benötigt eine einheitliche Lösung, die lexikalische und semantische Suche unterstützt und gleichzeitig die Systemkomplexität und -kosten reduziert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Die Schmerzpunkte von Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch ist eines der einflussreichsten Open-Source-Suchprojekte des letzten Jahrzehnts. Es basiert auf Apache Lucene und wurde durch seine hohe Leistung, Skalierbarkeit und verteilte Architektur populär. Obwohl in Version 8.0 die Vector ANN-Suche hinzugefügt wurde, stehen Produktionsimplementierungen vor mehreren kritischen Herausforderungen:</p>
<p><strong>Hohe Aktualisierungs- und Indizierungskosten:</strong> Die Architektur von Elasticsearch entkoppelt Schreibvorgänge, Indexaufbau und Abfragen nicht vollständig. Dies führt zu erheblichem CPU- und I/O-Overhead bei Schreiboperationen, insbesondere bei Massenaktualisierungen. Die Ressourcenkonkurrenz zwischen Indizierung und Abfrage wirkt sich auf die Leistung aus und stellt einen erheblichen Engpass für hochfrequente Aktualisierungsszenarien dar.</p>
<p><strong>Schlechte Leistung in Echtzeit:</strong> Als "echtzeitnahe" Suchmaschine führt Elasticsearch zu einer spürbaren Latenz bei der Datensichtbarkeit. Diese Latenz wird besonders problematisch für KI-Anwendungen, wie z. B. Agentensysteme, bei denen hochfrequente Interaktionen und dynamische Entscheidungsfindung einen sofortigen Datenzugriff erfordern.</p>
<p><strong>Schwierige Shard-Verwaltung:</strong> Obwohl Elasticsearch Sharding für eine verteilte Architektur verwendet, stellt das Shard-Management eine große Herausforderung dar. Das Fehlen einer dynamischen Sharding-Unterstützung führt zu einem Dilemma: Zu viele Shards in kleinen Datensätzen führen zu schlechter Leistung, während zu wenige Shards in großen Datensätzen die Skalierbarkeit einschränken und eine ungleichmäßige Datenverteilung verursachen.</p>
<p><strong>Nicht-Cloud-native Architektur:</strong> Elasticsearch wurde entwickelt, bevor sich Cloud-native Architekturen durchsetzten. Das Design von Elasticsearch koppelt Storage und Compute eng aneinander, was die Integration mit modernen Infrastrukturen wie Public Clouds und Kubernetes einschränkt. Die Skalierung der Ressourcen erfordert eine gleichzeitige Erhöhung von Speicher und Rechenleistung, was die Flexibilität einschränkt. In Szenarien mit mehreren Replikaten muss jeder Shard seinen Index unabhängig aufbauen, was die Rechenkosten erhöht und die Ressourceneffizienz verringert.</p>
<p><strong>Schlechte Vektorsuchleistung:</strong> Obwohl Elasticsearch 8.0 die ANN-Vektorsuche eingeführt hat, bleibt seine Leistung deutlich hinter der von dedizierten Vektormaschinen wie Milvus zurück. Die auf dem Lucene-Kernel basierende Indexstruktur erweist sich als ineffizient für hochdimensionale Daten und hat mit den Anforderungen einer groß angelegten Vektorsuche zu kämpfen. Besonders instabil wird die Leistung in komplexen Szenarien mit skalarer Filterung und Mandantenfähigkeit, was es schwierig macht, eine hohe Last oder unterschiedliche Geschäftsanforderungen zu unterstützen.</p>
<p><strong>Übermäßiger Ressourcenverbrauch:</strong> Elasticsearch stellt extreme Anforderungen an Speicher und CPU, insbesondere bei der Verarbeitung großer Datenmengen. Seine JVM-Abhängigkeit erfordert häufige Anpassungen der Heap-Größe und eine Optimierung der Garbage Collection, was die Speichereffizienz stark beeinträchtigt. Vektorsuchoperationen erfordern intensive SIMD-optimierte Berechnungen, für die die JVM-Umgebung alles andere als ideal ist.</p>
<p>Diese grundlegenden Beschränkungen werden zunehmend problematisch, wenn Unternehmen ihre KI-Infrastruktur skalieren, was Elasticsearch zu einer besonderen Herausforderung für moderne KI-Anwendungen macht, die hohe Leistung und Zuverlässigkeit erfordern.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Einführung von Sparse-BM25: Lexikalische Suche neu gedacht<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> führt native lexikalische Suchunterstützung durch Sparse-BM25 ein, die auf den in Version 2.4 eingeführten hybriden Suchfunktionen aufbaut. Dieser innovative Ansatz umfasst die folgenden Schlüsselkomponenten:</p>
<ul>
<li><p>Erweiterte Tokenisierung und Vorverarbeitung durch Tantivy</p></li>
<li><p>Verteiltes Vokabular und Termfrequenzmanagement</p></li>
<li><p>Sparse-Vektor-Generierung mit Korpus-TF und Abfrage-TF-IDF</p></li>
<li><p>Unterstützung von invertierten Indizes mit dem WAND-Algorithmus (Block-Max WAND und Graph-Index-Unterstützung in Entwicklung)</p></li>
</ul>
<p>Im Vergleich zu Elasticsearch bietet Milvus erhebliche Vorteile bei der Flexibilität des Algorithmus. Seine auf Vektor-Distanz basierende Ähnlichkeitsberechnung ermöglicht ein ausgefeilteres Matching, einschließlich der Implementierung von TW-BERT (Term Weighting BERT) auf der Grundlage der "End-to-End Query Term Weighting"-Forschung. Dieser Ansatz hat sowohl bei In-Domain- als auch bei Out-Domain-Tests eine hervorragende Leistung gezeigt.</p>
<p>Ein weiterer entscheidender Vorteil ist die Kosteneffizienz. Durch die Nutzung des invertierten Index und der Dense Embedding-Komprimierung erreicht Milvus eine fünffache Leistungsverbesserung bei einer Verschlechterung des Recalls um weniger als 1 %. Durch Tail-Term Pruning und Vektorquantisierung wurde die Speichernutzung um über 50 % reduziert.</p>
<p>Die Optimierung langer Abfragen ist eine besondere Stärke. Wo herkömmliche WAND-Algorithmen mit längeren Abfragen zu kämpfen haben, zeichnet sich Milvus durch die Kombination von Sparse Embeddings mit Graph-Indizes aus, was zu einer zehnfachen Leistungsverbesserung in hochdimensionalen Sparse-Vector-Such-Szenarien führt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: Die ultimative Vektordatenbank für RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist durch seinen umfassenden Funktionsumfang die erste Wahl für RAG-Anwendungen. Zu den wichtigsten Vorteilen gehören:</p>
<ul>
<li><p>Umfangreiche Metadatenunterstützung mit dynamischen Schemafunktionen und leistungsstarken Filteroptionen</p></li>
<li><p>Mehrmandantenfähigkeit auf Unternehmensebene mit flexibler Isolierung durch Sammlungen, Partitionen und Partitionsschlüssel</p></li>
<li><p>Branchenweit erste Unterstützung für Festplattenvektorindizes mit mehrstufiger Speicherung vom Speicher bis zu S3</p></li>
<li><p>Cloud-native Skalierbarkeit mit nahtloser Skalierung von 10 Mio. bis 1 Mrd. Vektoren</p></li>
<li><p>Umfassende Suchfunktionen, einschließlich Gruppierung, Bereich und hybride Suche</p></li>
<li><p>Tiefgreifende Ökosystemintegration mit LangChain, LlamaIndex, Dify und anderen KI-Tools</p></li>
</ul>
<p>Die vielfältigen Suchfunktionen des Systems umfassen Gruppierungs-, Bereichs- und hybride Suchmethoden. Die tiefe Integration mit Tools wie LangChain, LlamaIndex und Dify sowie die Unterstützung zahlreicher KI-Produkte machen Milvus zum Zentrum des modernen KI-Infrastruktur-Ökosystems.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Blick in die Zukunft<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit dem Übergang von KI von POC zur Produktion entwickelt sich Milvus weiter. Wir konzentrieren uns darauf, die Vektorsuche zugänglicher und kostengünstiger zu machen und gleichzeitig die Suchqualität zu verbessern. Ob Sie ein Startup oder ein Unternehmen sind, Milvus reduziert die technischen Barrieren für die Entwicklung von KI-Anwendungen.</p>
<p>Dieses Engagement für Zugänglichkeit und Innovation hat uns zu einem weiteren großen Schritt nach vorn geführt. Während unsere Open-Source-Lösung weiterhin als Grundlage für Tausende von Anwendungen weltweit dient, haben wir erkannt, dass viele Unternehmen eine vollständig verwaltete Lösung benötigen, die den operativen Overhead eliminiert.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: Die verwaltete Lösung<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>In den letzten drei Jahren haben wir <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, einen vollständig verwalteten Vektordatenbankdienst auf der Grundlage von Milvus, entwickelt. Durch eine Cloud-native Neuimplementierung des Milvus-Protokolls bietet er verbesserte Benutzerfreundlichkeit, Kosteneffizienz und Sicherheit.</p>
<p>Mit unserer Erfahrung in der Wartung der weltweit größten Vektorsuchcluster und der Unterstützung von Tausenden von KI-Anwendungsentwicklern reduziert Zilliz Cloud den betrieblichen Aufwand und die Kosten im Vergleich zu selbst gehosteten Lösungen erheblich.</p>
<p>Sind Sie bereit, die Zukunft der Vektorsuche zu erleben? Starten Sie noch heute Ihre kostenlose Testversion mit einem Guthaben von bis zu 200 $, keine Kreditkarte erforderlich.</p>

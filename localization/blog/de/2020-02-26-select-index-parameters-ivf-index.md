---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Bewährte Praktiken für den IVF-Index
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Auswahl der Index-Parameter für den IVF-Index</custom-h1><p>In <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Best Practices for Milvus Configuration</a> wurden einige Best Practices für die Konfiguration von Milvus 0.6.0 vorgestellt. In diesem Artikel werden wir auch einige Best Practices für die Einstellung von Schlüsselparametern in Milvus-Clients für Operationen wie das Erstellen einer Tabelle, das Erstellen von Indizes und die Suche vorstellen. Diese Parameter können die Suchleistung beeinflussen.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Beim Erstellen einer Tabelle wird der Parameter index_file_size verwendet, um die Größe einer einzelnen Datei für die Datenspeicherung in MB anzugeben. Der Standardwert ist 1024. Wenn Vektordaten importiert werden, kombiniert Milvus die Daten schrittweise in Dateien. Wenn die Dateigröße index_file_size erreicht, nimmt diese Datei keine neuen Daten mehr auf und Milvus speichert neue Daten in einer anderen Datei. Dies sind alles Rohdaten-Dateien. Wenn ein Index erstellt wird, erzeugt Milvus eine Indexdatei für jede Rohdatendatei. Für den IVFLAT-Indextyp entspricht die Größe der Indexdatei ungefähr der Größe der entsprechenden Rohdatendatei. Für den SQ8-Index beträgt die Größe einer Indexdatei etwa 30 Prozent der entsprechenden Rohdatendatei.</p>
<p>Bei einer Suche durchsucht Milvus jede Indexdatei einzeln. Nach unseren Erfahrungen verbessert sich die Suchleistung um 30 bis 50 Prozent, wenn index_file_size von 1024 auf 2048 geändert wird. Wenn der Wert jedoch zu groß ist, können große Dateien möglicherweise nicht in den GPU-Speicher (oder sogar in den CPU-Speicher) geladen werden. Wenn beispielsweise der GPU-Speicher 2 GB und index_file_size 3 GB beträgt, kann die Indexdatei nicht in den GPU-Speicher geladen werden. Normalerweise wird index_file_size auf 1024 MB oder 2048 MB festgelegt.</p>
<p>Die folgende Tabelle zeigt einen Test mit sift50m für index_file_size. Der Indextyp ist SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-ergebnisse-milvus.png</span> </span></p>
<p>Es ist zu erkennen, dass sich die Suchleistung im CPU- und GPU-Modus deutlich verbessert, wenn index_file_size 2048 MB statt 1024 MB beträgt.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>und</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Parameter <code translate="no">nlist</code> wird für die Indexerstellung und der Parameter <code translate="no">nprobe</code> für die Suche verwendet. IVFLAT und SQ8 verwenden beide Clustering-Algorithmen, um eine große Anzahl von Vektoren in Cluster oder Buckets aufzuteilen. <code translate="no">nlist</code> ist die Anzahl der Buckets beim Clustering.</p>
<p>Bei der Suche mit Indizes wird in einem ersten Schritt eine bestimmte Anzahl von Buckets gefunden, die dem Zielvektor am nächsten liegen, und in einem zweiten Schritt werden die ähnlichsten k Vektoren aus den Buckets anhand der Vektordistanz ermittelt. <code translate="no">nprobe</code> ist die Anzahl der Buckets im ersten Schritt.</p>
<p>Im Allgemeinen führt eine Erhöhung von <code translate="no">nlist</code> zu mehr Buckets und weniger Vektoren in einem Bucket während des Clusterns. Infolgedessen sinkt die Rechenlast und die Suchleistung verbessert sich. Da jedoch weniger Vektoren für den Ähnlichkeitsvergleich zur Verfügung stehen, kann das richtige Ergebnis verfehlt werden.</p>
<p>Die Erhöhung von <code translate="no">nprobe</code> führt zu mehr zu durchsuchenden Buckets. Infolgedessen steigt die Rechenlast und die Suchleistung verschlechtert sich, aber die Suchgenauigkeit verbessert sich. Die Situation kann bei Datensätzen mit unterschiedlichen Verteilungen unterschiedlich sein. Bei der Einstellung von <code translate="no">nlist</code> und <code translate="no">nprobe</code> sollten Sie auch die Größe des Datensatzes berücksichtigen. Im Allgemeinen wird empfohlen, dass <code translate="no">nlist</code> <code translate="no">4 * sqrt(n)</code> sein kann, wobei n die Gesamtzahl der Vektoren ist. Wie bei <code translate="no">nprobe</code> müssen Sie einen Kompromiss zwischen Präzision und Effizienz eingehen, und am besten ermitteln Sie den Wert durch Ausprobieren.</p>
<p>Die folgende Tabelle zeigt einen Test mit sift50m für <code translate="no">nlist</code> und <code translate="no">nprobe</code>. Der Index-Typ ist SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>Die Tabelle vergleicht die Suchleistung und die Genauigkeit mit verschiedenen Werten von <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Es werden nur GPU-Ergebnisse angezeigt, da CPU- und GPU-Tests ähnliche Ergebnisse liefern. In diesem Test erhöht sich die Suchgenauigkeit, wenn die Werte von <code translate="no">nlist</code>/<code translate="no">nprobe</code> um denselben Prozentsatz steigen. Wenn <code translate="no">nlist</code> = 4096 und <code translate="no">nprobe</code> 128 ist, hat Milvus die beste Suchleistung. Zusammenfassend lässt sich sagen, dass Sie bei der Bestimmung der Werte für <code translate="no">nlist</code> und <code translate="no">nprobe</code> einen Kompromiss zwischen Leistung und Genauigkeit unter Berücksichtigung der verschiedenen Datensätze und Anforderungen eingehen müssen.</p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Wenn die Datengröße größer ist als <code translate="no">index_file_size</code>, ist die Suchleistung umso besser, je größer der Wert von <code translate="no">index_file_size</code> ist.<code translate="no">nlist</code> und <code translate="no">nprobe</code>：Sie müssen einen Kompromiss zwischen Leistung und Genauigkeit eingehen.</p>

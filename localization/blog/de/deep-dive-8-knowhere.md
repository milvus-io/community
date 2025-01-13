---
id: deep-dive-8-knowhere.md
title: Was leistet die Ähnlichkeitssuche in der Milvus-Vektordatenbank?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'Und nein, es ist nicht Faiss.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Titelbild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde von <a href="https://github.com/cydrain">Yudong Cai</a> geschrieben und von <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> übersetzt.</p>
</blockquote>
<p>Als zentrale Vektorausführungsmaschine ist Knowhere für Milvus das, was ein Motor für einen Sportwagen ist. Dieser Beitrag stellt vor, was Knowhere ist, wie es sich von Faiss unterscheidet und wie der Code von Knowhere strukturiert ist.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Das Konzept von Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere in der Milvus-Architektur</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere im Vergleich zu Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Verstehen des Knowhere-Codes</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Hinzufügen von Indizes zu Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Das Konzept von Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Im engeren Sinne ist Knowhere eine Betriebsschnittstelle für den Zugriff auf Dienste in den oberen Schichten des Systems und auf Vektorähnlichkeitssuchbibliotheken wie <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a> in den unteren Schichten des Systems. Darüber hinaus ist Knowhere auch für das heterogene Rechnen zuständig. Genauer gesagt steuert Knowhere, auf welcher Hardware (z.B. CPU oder GPU) die Indexerstellung und Suchanfragen ausgeführt werden sollen. Daher kommt auch der Name Knowhere - Knowhere weiß, wo die Operationen ausgeführt werden sollen. Weitere Hardwaretypen, einschließlich DPU und TPU, werden in zukünftigen Versionen unterstützt.</p>
<p>Im weiteren Sinne bezieht Knowhere auch andere Indexbibliotheken von Drittanbietern wie Faiss ein. Daher wird Knowhere als Ganzes als die zentrale Vektorberechnungsmaschine in der Milvus-Vektordatenbank anerkannt.</p>
<p>Aus dem Konzept von Knowhere geht hervor, dass es nur Datenverarbeitungsaufgaben verarbeitet, während Aufgaben wie Sharding, Lastausgleich und Disaster Recovery außerhalb des Arbeitsbereichs von Knowhere liegen.</p>
<p>Ab Milvus 2.0.1 wird <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (im weiteren Sinne) unabhängig vom Milvus-Projekt.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere in der Milvus-Architektur<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>Knowhere-Architektur</span> </span></p>
<p>Die Berechnungen in Milvus beinhalten hauptsächlich Vektor- und Skalaroperationen. Knowhere verarbeitet in Milvus nur die Operationen auf Vektoren. Die obige Abbildung veranschaulicht die Knowhere-Architektur in Milvus.</p>
<p>Die unterste Schicht ist die Systemhardware. Die Indexbibliotheken von Drittanbietern befinden sich oberhalb der Hardware. Dann interagiert Knowhere mit dem Indexknoten und dem Abfrageknoten auf der obersten Ebene über CGO.</p>
<p>In diesem Artikel geht es um Knowhere im weiteren Sinne, wie im blauen Rahmen in der Architekturabbildung markiert.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere vs. Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere erweitert nicht nur die Funktionen von Faiss, sondern optimiert auch die Leistung. Im Einzelnen hat Knowhere die folgenden Vorteile.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Unterstützung für BitsetView</h3><p>Ursprünglich wurde Bitset in Milvus für den Zweck der &quot;weichen Löschung&quot; eingeführt. Ein sanft gelöschter Vektor ist noch in der Datenbank vorhanden, wird aber bei einer Vektorähnlichkeitssuche oder -abfrage nicht berechnet. Jedes Bit im Bitset entspricht einem indizierten Vektor. Wenn ein Vektor im Bitset mit "1" markiert ist, bedeutet dies, dass dieser Vektor "soft-deleted" ist und bei einer Vektorsuche nicht berücksichtigt wird.</p>
<p>Die Bitset-Parameter werden zu allen exponierten Faiss-Indexabfrage-APIs in Knowhere hinzugefügt, einschließlich CPU- und GPU-Indizes.</p>
<p>Erfahren Sie mehr darüber, <a href="https://milvus.io/blog/2022-2-14-bitset.md">wie Bitset die Vielseitigkeit der Vektorsuche ermöglicht</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Unterstützung für weitere Ähnlichkeitsmetriken zur Indizierung binärer Vektoren</h3><p>Neben <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Hamming</a> unterstützt Knowhere auch <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a> und <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructure</a>. Jaccard und Tanimoto können verwendet werden, um die Ähnlichkeit zwischen zwei Mustersätzen zu messen, während Superstructure und Substructure verwendet werden können, um die Ähnlichkeit von chemischen Strukturen zu messen.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Unterstützung für AVX512-Befehlssatz</h3><p>Faiss selbst unterstützt mehrere Befehlssätze, darunter <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a> und <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere erweitert die unterstützten Befehlssätze um <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, was <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">die Leistung der Indexerstellung und -abfrage</a> im Vergleich zu AVX2 <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">um 20 bis 30 % verbessern</a> kann.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Automatische SIMD-Befehlsauswahl</h3><p>Knowhere ist so konzipiert, dass es auf einem breiten Spektrum von CPU-Prozessoren (sowohl vor Ort als auch auf Cloud-Plattformen) mit verschiedenen SIMD-Befehlen (z. B. SIMD SSE, AVX, AVX2 und AVX512) gut funktioniert. Die Herausforderung besteht also darin, dass ein einzelnes Software-Binary (d. h. Milvus) automatisch die geeigneten SIMD-Anweisungen auf jedem CPU-Prozessor aufrufen kann. Faiss unterstützt die automatische Auswahl von SIMD-Befehlen nicht, und die Benutzer müssen das SIMD-Flag (z. B. "-msse4") während der Kompilierung manuell angeben. Knowhere wird jedoch durch Refactoring der Codebasis von Faiss erstellt. Gängige Funktionen (z. B. Ähnlichkeitsberechnungen), die auf SIMD-Beschleunigung angewiesen sind, werden ausgeklammert. Dann werden für jede Funktion vier Versionen (d.h. SSE, AVX, AVX2, AVX512) implementiert und jeweils in eine separate Quelldatei geschrieben. Anschließend werden die Quelldateien einzeln mit dem entsprechenden SIMD-Flag weiter kompiliert. Daher kann Knowhere zur Laufzeit automatisch die am besten geeigneten SIMD-Anweisungen auf der Grundlage der aktuellen CPU-Flags auswählen und dann die richtigen Funktionszeiger mithilfe von Hooking verknüpfen.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Andere Leistungsoptimierungen</h3><p>Lesen Sie <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a> für weitere Informationen über die Leistungsoptimierung von Knowhere.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Verstehen des Knowhere-Codes<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie im ersten Abschnitt erwähnt, verarbeitet Knowhere nur Vektorsuchoperationen. Daher verarbeitet Knowhere nur das Vektorfeld einer Entität (derzeit wird nur ein Vektorfeld für Entitäten in einer Sammlung unterstützt). Die Indexerstellung und die Vektorähnlichkeitssuche sind ebenfalls auf das Vektorfeld eines Segments ausgerichtet. Für ein besseres Verständnis des Datenmodells lesen Sie bitte den Blog <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">hier</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>Entitätsfelder</span> </span></p>
<h3 id="Index" class="common-anchor-header">Index</h3><p>Der Index ist eine von den ursprünglichen Vektordaten unabhängige Datenstruktur. Die Indizierung erfordert vier Schritte: Erstellen eines Indexes, Trainieren von Daten, Einfügen von Daten und Aufbau eines Indexes.</p>
<p>Bei einigen KI-Anwendungen ist das Training des Datensatzes ein eigenständiger Prozess im Vergleich zur Vektorsuche. Bei dieser Art von Anwendung werden Daten aus Datensätzen zunächst trainiert und dann in eine Vektordatenbank wie Milvus für die Ähnlichkeitssuche eingefügt. Offene Datensätze wie sift1M und sift1B liefern Daten für Training und Test. In Knowhere werden jedoch die Daten für das Training und die Suche miteinander vermischt. Das heißt, Knowhere trainiert alle Daten in einem Segment und fügt dann alle trainierten Daten ein und baut einen Index für sie auf.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere-Code-Struktur</h3><p>DataObj ist die Basisklasse für alle Datenstrukturen in Knowhere. <code translate="no">Size()</code> ist die einzige virtuelle Methode in DataObj. Die Index-Klasse erbt von DataObj mit einem Feld namens &quot;size_&quot;. Die Index-Klasse hat auch zwei virtuelle Methoden - <code translate="no">Serialize()</code> und <code translate="no">Load()</code>. Die von Index abgeleitete Klasse VecIndex ist die virtuelle Basisklasse für alle Vektorindizes. VecIndex bietet Methoden wie <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code> und <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>Basisklasse</span> </span></p>
<p>Andere Indextypen sind in der obigen Abbildung rechts aufgeführt.</p>
<ul>
<li>Der Faiss-Index hat zwei Unterklassen: FaissBaseIndex für alle Indizes auf Fließkomma-Vektoren und FaissBaseBinaryIndex für alle Indizes auf binären Vektoren.</li>
<li>GPUIndex ist die Basisklasse für alle Faiss-GPU-Indizes.</li>
<li>OffsetBaseIndex ist die Basisklasse für alle selbstentwickelten Indizes. Nur die Vektor-ID wird in der Indexdatei gespeichert. Dadurch kann die Größe einer Indexdatei für 128-dimensionale Vektoren um 2 Größenordnungen reduziert werden. Wir empfehlen, bei der Verwendung dieser Art von Index für die Vektorähnlichkeitssuche auch die Originalvektoren zu berücksichtigen.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Technisch gesehen ist <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> kein Index, sondern wird eher für die Brute-Force-Suche verwendet. Wenn Vektoren in die Vektordatenbank eingefügt werden, ist kein Datentraining und keine Indexerstellung erforderlich. Die Suchvorgänge werden direkt auf den eingefügten Vektordaten durchgeführt.</p>
<p>Aus Gründen der Code-Konsistenz erbt IDMAP jedoch auch von der Klasse VecIndex mit all ihren virtuellen Schnittstellen. Die Verwendung von IDMAP ist die gleiche wie bei anderen Indizes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Die IVF-Indizes (inverted file) sind die am häufigsten verwendeten Indizes. Die IVF-Klasse ist von VecIndex und FaissBaseIndex abgeleitet und lässt sich zu IVFSQ und IVFPQ erweitern. GPUIVF ist von GPUIndex und IVF abgeleitet. Anschließend wird GPUIVF zu GPUIVFSQ und GPUIVFPQ erweitert.</p>
<p>IVFSQHybrid ist eine Klasse für einen selbstentwickelten hybriden Index, der durch Grobquantisierung auf der GPU ausgeführt wird. Und die Suche im Bucket wird auf der CPU ausgeführt. Diese Art von Index kann das Auftreten von Speicherkopien zwischen CPU und GPU reduzieren, indem die Rechenleistung der GPU genutzt wird. IVFSQHybrid hat die gleiche Wiederfindungsrate wie GPUIVFSQ, bietet aber eine bessere Leistung.</p>
<p>Die Basisklassenstruktur für binäre Indizes ist relativ einfach. BinaryIDMAP und BinaryIVF sind von FaissBaseBinaryIndex und VecIndex abgeleitet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>Drittanbieter-Index</span> </span></p>
<p>Derzeit werden neben Faiss nur zwei Arten von Drittanbieter-Indizes unterstützt: der baumbasierte Index Annoy und der graphbasierte Index HNSW. Diese beiden gebräuchlichen und häufig verwendeten Indizes von Drittanbietern sind beide von VecIndex abgeleitet.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Hinzufügen von Indizes zu Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie neue Indizes zu Knowhere hinzufügen wollen, können Sie zunächst auf bestehende Indizes verweisen:</p>
<ul>
<li>Um einen quantisierungsbasierten Index hinzuzufügen, verweisen Sie auf IVF_FLAT.</li>
<li>Um einen graph-basierten Index hinzuzufügen, siehe HNSW.</li>
<li>Um einen baumbasierten Index hinzuzufügen, verweisen Sie auf Annoy.</li>
</ul>
<p>Nachdem Sie sich auf den vorhandenen Index bezogen haben, können Sie die folgenden Schritte ausführen, um einen neuen Index zu Knowhere hinzuzufügen.</p>
<ol>
<li>Fügen Sie den Namen des neuen Indexes in <code translate="no">IndexEnum</code> ein. Der Datentyp ist string.</li>
<li>Fügen Sie eine Datenvalidierungsprüfung für den neuen Index in der Datei <code translate="no">ConfAdapter.cpp</code> hinzu. Die Validierungsprüfung dient hauptsächlich dazu, die Parameter für das Datentraining und die Abfrage zu validieren.</li>
<li>Erstellen Sie eine neue Datei für den neuen Index. Die Basisklasse des neuen Index sollte <code translate="no">VecIndex</code> und die notwendige virtuelle Schnittstelle von <code translate="no">VecIndex</code> enthalten.</li>
<li>Fügen Sie die Indexerstellungslogik für den neuen Index in <code translate="no">VecIndexFactory::CreateVecIndex()</code> hinzu.</li>
<li>Fügen Sie einen Unit-Test unter dem Verzeichnis <code translate="no">unittest</code> hinzu.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Über die Deep Dive-Serie<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">offiziellen Ankündigung der allgemeinen Verfügbarkeit</a> von Milvus 2.0 haben wir diese Milvus-Deep-Dive-Blogserie ins Leben gerufen, um eine eingehende Interpretation der Milvus-Architektur und des Quellcodes zu bieten. Die Themen dieser Blogserie umfassen:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Überblick über die Milvus-Architektur</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs und Python-SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Datenverarbeitung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Datenverwaltung</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Abfrage in Echtzeit</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Skalare Ausführungsmaschine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA-System</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vektorielles Ausführungssystem</a></li>
</ul>

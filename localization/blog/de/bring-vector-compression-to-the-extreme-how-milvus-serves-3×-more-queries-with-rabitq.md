---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr
  Abfragen bedient
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Entdecken Sie, wie Milvus RaBitQ nutzt, um die Effizienz der Vektorsuche zu
  verbessern und die Speicherkosten bei gleichbleibender Genauigkeit zu senken.
  Lernen Sie noch heute, Ihre KI-Lösungen zu optimieren!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">Milvus</a> ist eine hochgradig skalierbare Open-Source-Vektordatenbank, die eine semantische Suche im Milliarden-Vektor-Maßstab ermöglicht. Wenn Nutzer RAG-Chatbots, KI-Kundenservice und visuelle Suche in dieser Größenordnung einsetzen, taucht eine gemeinsame Herausforderung auf: die <strong>Infrastrukturkosten.</strong> Exponentielles Unternehmenswachstum ist spannend, explodierende Cloud-Rechnungen hingegen nicht. Eine schnelle Vektorsuche erfordert in der Regel die Speicherung von Vektoren im Speicher, was teuer ist. Natürlich könnte man fragen: <em>Können wir Vektoren komprimieren, um Platz zu sparen, ohne die Suchqualität zu beeinträchtigen?</em></p>
<p>Die Antwort lautet <strong>JA</strong>, und in diesem Blog zeigen wir Ihnen, wie Milvus durch die Implementierung einer neuartigen Technik namens <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> dreimal mehr Datenverkehr bei geringeren Speicherkosten und vergleichbarer Genauigkeit bewältigen kann. Wir teilen auch die praktischen Erfahrungen mit, die wir bei der Integration von RaBitQ in die Open-Source-Lösung Milvus und den vollständig verwalteten Milvus-Service in der <a href="https://zilliz.com/cloud">Zilliz Cloud</a> gemacht haben.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Verständnis von Vektorsuche und Komprimierung<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir in RaBitQ eintauchen, sollten wir die Herausforderung verstehen.</p>
<p><a href="https://zilliz.com/glossary/anns"><strong>Approximate Nearest Neighbor (ANN)</strong></a> -Suchalgorithmen sind das Herzstück einer Vektordatenbank und finden die Top-k-Vektoren, die einer bestimmten Abfrage am nächsten kommen. Ein Vektor ist eine Koordinate im hochdimensionalen Raum, die oft Hunderte von Gleitkommazahlen umfasst. Mit der Vergrößerung der Vektordaten steigen auch die Anforderungen an Speicherplatz und Rechenleistung. Die Ausführung von <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (einem ANN-Suchalgorithmus) mit einer Milliarde 768-dimensionaler Vektoren in FP32 erfordert beispielsweise über 3 TB Speicherplatz!</p>
<p>Ähnlich wie bei der MP3-Komprimierung von Audiodaten, bei der für das menschliche Ohr nicht wahrnehmbare Frequenzen weggelassen werden, können Vektordaten mit minimalen Auswirkungen auf die Suchgenauigkeit komprimiert werden. Die Forschung zeigt, dass FP32 mit voller Genauigkeit für ANN oft unnötig ist. Die<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> Skalarquantisierung</a> (SQ), ein beliebtes Komprimierungsverfahren, ordnet Fließkommawerte diskreten Bins zu und speichert nur die Bin-Indizes unter Verwendung von Low-Bit-Ganzzahlen. Quantisierungsmethoden reduzieren den Speicherbedarf erheblich, indem sie die gleichen Informationen mit weniger Bits darstellen. Die Forschung in diesem Bereich ist bestrebt, die größten Einsparungen mit den geringsten Genauigkeitsverlusten zu erzielen.</p>
<p>Die extremste Komprimierungstechnik - die 1-Bit-Skalar-Quantisierung, auch bekannt als <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">binäre Quantisierung - stellt</a>jede Fließkommazahl mit einem einzigen Bit <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">dar</a>. Im Vergleich zu FP32 (32-Bit-Kodierung) reduziert dies den Speicherbedarf um das 32-fache. Da der Speicher oft der größte Engpass bei der Vektorsuche ist, kann eine solche Komprimierung die Leistung erheblich steigern. <strong>Die Herausforderung besteht jedoch darin, die Suchgenauigkeit beizubehalten.</strong> Bei 1-Bit-SQ sinkt die Auffindbarkeit in der Regel auf unter 70 % und ist damit praktisch unbrauchbar.</p>
<p>Hier zeichnet sich <strong>RaBitQ</strong> aus - eine exzellente Komprimierungstechnik, die eine 1-Bit-Quantisierung unter Beibehaltung einer hohen Wiederauffindbarkeit erreicht. Milvus unterstützt RaBitQ jetzt ab Version 2.6, wodurch die Vektordatenbank bei vergleichbarer Genauigkeit die dreifache QPS leisten kann.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Eine kurze Einführung in RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">RaBitQ</a> ist ein intelligentes binäres Quantisierungsverfahren, das die geometrische Eigenschaft des hochdimensionalen Raums nutzt, um eine effiziente und genaue Vektorkompression zu erreichen.</p>
<p>Auf den ersten Blick mag es zu aggressiv erscheinen, jede Dimension eines Vektors auf ein einziges Bit zu reduzieren, aber im hochdimensionalen Raum lässt uns unsere Intuition oft im Stich. Wie Jianyang Gao, einer der Autoren von RaBitQ,<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> veranschaulichte</a>, weisen hochdimensionale Vektoren die Eigenschaft auf, dass einzelne Koordinaten dazu neigen, sich eng um den Nullpunkt herum zu konzentrieren, ein Ergebnis eines kontraintuitiven Phänomens, das in<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentration of Measure</a> erklärt wird. Dadurch ist es möglich, einen Großteil der ursprünglichen Präzision zu verwerfen und dennoch die relative Struktur zu erhalten, die für eine genaue Suche nach dem nächsten Nachbarn erforderlich ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Die kontraintuitive Werteverteilung in der hochdimensionalen Geometrie. <em>Betrachten Sie den Wert der ersten Dimension für einen zufälligen Einheitsvektor, der gleichmäßig aus der Einheitskugel entnommen wurde; die Werte sind gleichmäßig im 3D-Raum verteilt. Im hochdimensionalen Raum (z. B. 1000D) konzentrieren sich die Werte jedoch um den Wert Null, eine unintuitive Eigenschaft der hochdimensionalen Geometrie. (Bildquelle: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantisierung im kontraintuitiven hochdimensionalen Raum</a>)</em></p>
<p>Inspiriert von dieser Eigenschaft des hochdimensionalen Raums <strong>konzentriert sich RaBitQ auf die Kodierung von Winkelinformationen und nicht auf die exakten Raumkoordinaten</strong>. Zu diesem Zweck wird jeder Datenvektor relativ zu einem Referenzpunkt, z. B. dem Schwerpunkt des Datensatzes, normalisiert. Jeder Vektor wird dann auf den nächstgelegenen Scheitelpunkt des Hyperwürfels abgebildet, was eine Darstellung mit nur 1 Bit pro Dimension ermöglicht. Dieser Ansatz lässt sich natürlich auch auf <code translate="no">IVF_RABITQ</code> übertragen, wo die Normalisierung in Bezug auf den nächstgelegenen Clusterschwerpunkt erfolgt, was die Genauigkeit der lokalen Kodierung verbessert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Komprimierung eines Vektors durch Suche nach seiner engsten Annäherung auf dem Hyperwürfel, so dass jede Dimension mit nur einem Bit dargestellt werden kann. (Bildquelle:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantization in The Counterintuitive High-Dimensional Space</em></a><em>)</em></p>
<p>Um sicherzustellen, dass die Suche auch bei derart komprimierten Darstellungen zuverlässig bleibt, führt RaBitQ einen <strong>theoretisch begründeten, unverzerrten Schätzer</strong> für den Abstand zwischen einem Abfragevektor und binär quantisierten Dokumentvektoren ein. Dies trägt dazu bei, den Rekonstruktionsfehler zu minimieren und einen hohen Recall aufrechtzuerhalten.</p>
<p>RaBitQ ist auch mit anderen Optimierungstechniken wie<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> und<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> Random Rotation Preprocessing</a> sehr kompatibel. Außerdem ist RaBitQ <strong>leicht zu trainieren und schnell auszuführen</strong>. Beim Training wird einfach das Vorzeichen jeder Vektorkomponente bestimmt, und die Suche wird durch schnelle bitweise Operationen beschleunigt, die von modernen CPUs unterstützt werden. Zusammen ermöglichen diese Optimierungen RaBitQ eine Hochgeschwindigkeitssuche mit minimalen Genauigkeitseinbußen.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Entwicklung von RaBitQ in Milvus: Von der akademischen Forschung zur Produktion<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Während RaBitQ konzeptionell einfach ist und von einer<a href="https://github.com/gaoj0017/RaBitQ"> Referenzimplementierung</a> begleitet wird, stellte die Anpassung an eine verteilte, produktionsreife Vektordatenbank wie Milvus einige technische Herausforderungen dar. Wir haben RaBitQ in Knowhere, der zentralen Vektorsuchmaschine hinter Milvus, implementiert und außerdem eine optimierte Version in die Open-Source-ANN-Suchbibliothek<a href="https://github.com/facebookresearch/faiss"> FAISS</a> eingebracht.</p>
<p>Schauen wir uns an, wie wir diesen Algorithmus in Milvus zum Leben erweckt haben.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Kompromisse bei der Implementierung</h3><p>Eine wichtige Designentscheidung betraf den Umgang mit Hilfsdaten pro Vektor. RaBitQ benötigt zwei Gleitkommawerte pro Vektor, die während der Indizierung vorberechnet werden, und einen dritten Wert, der entweder on-the-fly oder vorberechnet werden kann. In Knowhere haben wir diesen Wert zur Indizierungszeit vorberechnet und gespeichert, um die Effizienz bei der Suche zu verbessern. Im Gegensatz dazu spart die FAISS-Implementierung Speicher, indem sie den Wert zur Abfragezeit berechnet und so einen anderen Kompromiss zwischen Speichernutzung und Abfragegeschwindigkeit eingeht.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Hardware-Beschleunigung</h3><p>Moderne CPUs bieten spezielle Befehle, die Binäroperationen erheblich beschleunigen können. Wir haben den Kernel für die Abstandsberechnung so angepasst, dass er die Vorteile moderner CPU-Befehle nutzen kann. Da RaBitQ auf Popcount-Operationen angewiesen ist, haben wir einen speziellen Pfad in Knowhere erstellt, der die Anweisungen <code translate="no">VPOPCNTDQ</code> für AVX512 verwendet, wenn diese verfügbar sind. Auf unterstützter Hardware (z. B. Intel IceLake oder AMD Zen 4) kann dies die binären Abstandsberechnungen im Vergleich zu den Standardimplementierungen um mehrere Faktoren beschleunigen.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Abfrage-Optimierung</h3><p>Sowohl Knowhere (die Suchmaschine von Milvus) als auch unsere optimierte FAISS-Version unterstützen die skalare Quantisierung (SQ1-SQ8) von Abfragevektoren. Dies bietet zusätzliche Flexibilität: Selbst bei einer 4-Bit-Quantisierung von Abfragen bleibt die Wiederauffindbarkeit hoch, während der Rechenaufwand deutlich sinkt, was besonders nützlich ist, wenn Abfragen mit hohem Durchsatz verarbeitet werden müssen.</p>
<p>Wir gehen noch einen Schritt weiter bei der Optimierung unserer proprietären Cardinal-Engine, die die vollständig verwaltete Milvus on Zilliz Cloud antreibt. Über die Fähigkeiten des Open-Source-Milvus hinaus führen wir fortschrittliche Verbesserungen ein, darunter die Integration eines graphbasierten Vektorindex, zusätzliche Optimierungsebenen und Unterstützung für Arm SVE-Befehle.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">Der Leistungsgewinn: 3× mehr QPS bei vergleichbarer Genauigkeit<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der Version 2.6 führt Milvus den neuen Index-Typ <code translate="no">IVF_RABITQ</code> ein. Dieser neue Index kombiniert RaBitQ mit IVF-Clustering, zufälliger Rotationstransformation und optionaler Verfeinerung, um ein optimales Gleichgewicht von Leistung, Speichereffizienz und Genauigkeit zu erreichen.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Verwendung von IVF_RABITQ in Ihrer Anwendung</h3><p>Hier erfahren Sie, wie Sie <code translate="no">IVF_RABITQ</code> in Ihrer Milvus-Anwendung implementieren:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Benchmarking: Die Zahlen erzählen die Geschichte</h3><p>Wir haben verschiedene Konfigurationen mit<a href="https://github.com/zilliztech/vectordbbench"> vdb-bench</a>, einem Open-Source-Benchmarking-Tool zur Bewertung von Vektordatenbanken, getestet. Sowohl die Test- als auch die Kontrollumgebung verwenden Milvus Standalone, das auf AWS EC2 <code translate="no">m6id.2xlarge</code> -Instanzen bereitgestellt wird. Diese Maschinen verfügen über 8 vCPUs, 32 GB RAM und eine Intel Xeon 8375C CPU basierend auf der Ice Lake-Architektur, die den VPOPCNTDQ AVX-512-Befehlssatz unterstützt.</p>
<p>Wir haben den Search Performance Test von vdb-bench verwendet, mit einem Datensatz von 1 Million Vektoren mit jeweils 768 Dimensionen. Da die Standard-Segmentgröße in Milvus 1 GB beträgt und der Rohdatensatz (768 Dimensionen × 1 Mio. Vektoren × 4 Byte pro Float) insgesamt etwa 3 GB groß ist, umfasste das Benchmarking mehrere Segmente pro Datenbank.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Beispiel einer Testkonfiguration in vdb-bench.</p>
<p>Hier sind einige Details zu den Konfigurationsknöpfen für IVF, RaBitQ und den Verfeinerungsprozess:</p>
<ul>
<li><p><code translate="no">nlist</code> und <code translate="no">nprobe</code> sind Standardparameter für alle <code translate="no">IVF</code>-basierten Methoden</p></li>
<li><p><code translate="no">nlist</code> ist eine nicht-negative ganze Zahl, die die Gesamtzahl der IVF-Eimer für den Datensatz angibt.</p></li>
<li><p><code translate="no">nprobe</code> ist eine nicht-negative ganze Zahl, die die Anzahl der IVF-Buckets angibt, die für einen einzelnen Datenvektor während des Suchprozesses besucht werden. Es ist ein suchbezogener Parameter.</p></li>
<li><p><code translate="no">rbq_bits_query</code> gibt den Grad der Quantisierung eines Abfragevektors an. Verwenden Sie die Werte 1...8 für die Quantisierungsstufen <code translate="no">SQ1</code>...<code translate="no">SQ8</code>. Verwenden Sie den Wert 0, um die Quantisierung zu deaktivieren. Dies ist ein suchbezogener Parameter.</p></li>
<li><p><code translate="no">refine</code>Die Parameter <code translate="no">refine_type</code> und <code translate="no">refine_k</code> sind Standardparameter für den Verfeinerungsprozess.</p></li>
<li><p><code translate="no">refine</code> ist ein Boolescher Wert, der die Verfeinerungsstrategie aktiviert.</p></li>
<li><p><code translate="no">refine_k</code> ist ein nicht-negativer fp-Wert. Der Verfeinerungsprozess verwendet eine qualitativ hochwertigere Quantisierungsmethode, um die benötigte Anzahl nächster Nachbarn aus einem <code translate="no">refine_k</code> mal größeren Pool von Kandidaten auszuwählen, die mit <code translate="no">IVFRaBitQ</code> ausgewählt werden. Dies ist ein suchbezogener Parameter.</p></li>
<li><p><code translate="no">refine_type</code> ist eine Zeichenfolge, die den Quantisierungstyp für einen Verfeinerungsindex angibt. Die verfügbaren Optionen sind <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> und <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Die Ergebnisse offenbaren wichtige Erkenntnisse:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung: Kosten- und Leistungsvergleich von Baseline (IVF_FLAT), IVF_SQ8 und IVF_RABITQ mit verschiedenen Verfeinerungsstrategien</p>
<p>Im Vergleich zum Basisindex <code translate="no">IVF_FLAT</code>, der 236 QPS mit 95,2 % Recall erzielt, erreicht <code translate="no">IVF_RABITQ</code> einen deutlich höheren Durchsatz - 648 QPS bei FP32-Abfragen und 898 QPS bei SQ8-quantisierten Abfragen. Diese Zahlen verdeutlichen den Leistungsvorteil von RaBitQ, insbesondere bei Anwendung der Verfeinerung.</p>
<p>Diese Leistung geht jedoch mit einem spürbaren Kompromiss bei der Wiederauffindung einher. Wenn <code translate="no">IVF_RABITQ</code> ohne Verfeinerung verwendet wird, pendelt sich der Recall bei etwa 76 % ein, was für Anwendungen, die eine hohe Genauigkeit erfordern, zu wenig ist. Dennoch ist es beeindruckend, diese Wiedererkennungsrate mit einer 1-Bit-Vektorkompression zu erreichen.</p>
<p>Die Verfeinerung ist für die Wiederherstellung der Genauigkeit unerlässlich. Bei einer Konfiguration mit SQ8-Abfrage und SQ8-Verfeinerung liefert <code translate="no">IVF_RABITQ</code> sowohl eine hohe Leistung als auch eine hohe Trefferquote. Mit einem hohen Recall von 94,7 % erreicht es fast den Wert von IVF_FLAT, während es mit 864 QPS mehr als dreimal so schnell ist wie IVF_FLAT. Selbst im Vergleich zu einem anderen beliebten Quantisierungsindex <code translate="no">IVF_SQ8</code> erreicht <code translate="no">IVF_RABITQ</code> mit der SQ8-Verfeinerung mehr als die Hälfte des Durchsatzes bei ähnlicher Wiederauffindbarkeit, nur mit geringfügig höheren Kosten. Dies macht ihn zu einer ausgezeichneten Option für Szenarien, die sowohl Geschwindigkeit als auch Genauigkeit erfordern.</p>
<p>Kurz gesagt, <code translate="no">IVF_RABITQ</code> allein ist großartig für die Maximierung des Durchsatzes bei akzeptablem Rückruf und wird noch leistungsfähiger, wenn es mit der Verfeinerung gepaart wird, um die Qualitätslücke zu schließen, wobei nur ein Bruchteil des Speicherplatzes im Vergleich zu <code translate="no">IVF_FLAT</code> benötigt wird.</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ stellt einen bedeutenden Fortschritt in der Vektorquantisierungstechnologie dar. Durch die Kombination von binärer Quantisierung mit intelligenten Kodierungsstrategien wird das scheinbar Unmögliche erreicht: eine extreme Komprimierung mit minimalem Genauigkeitsverlust.</p>
<p>Ab Version 2.6 wird Milvus IVF_RABITQ einführen, das diese leistungsstarke Kompressionstechnik mit IVF-Clustering- und Verfeinerungsstrategien kombiniert, um die binäre Quantisierung in die Produktion zu bringen. Diese Kombination schafft ein praktisches Gleichgewicht zwischen Genauigkeit, Geschwindigkeit und Speichereffizienz, das Ihre Vektorsuch-Workloads verändern kann.</p>
<p>Wir sind bestrebt, weitere Innovationen wie diese sowohl in die Open-Source-Version von Milvus als auch in den vollständig verwalteten Service in der Zilliz Cloud einzubringen, um die Vektorsuche effizienter und für jeden zugänglich zu machen.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Erste Schritte mit Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 ist jetzt verfügbar. Zusätzlich zu RabitQ werden Dutzende neuer Funktionen und Leistungsoptimierungen eingeführt, wie z. B. Tiered Storage, Meanhash LSH und verbesserte Volltextsuche und Mandantenfähigkeit, die sich direkt mit den dringendsten Herausforderungen der Vektorsuche von heute befassen: effiziente Skalierung bei gleichzeitiger Kostenkontrolle.</p>
<p>Sind Sie bereit, alles zu entdecken, was Milvus 2.6 bietet? Schauen Sie sich unsere<a href="https://milvus.io/docs/release_notes.md"> Release Notes</a> an, lesen Sie die<a href="https://milvus.io/docs"> vollständige Dokumentation</a> oder lesen Sie unsere<a href="https://milvus.io/blog"> Feature-Blogs</a>.</p>
<p>Wenn Sie Fragen haben oder einen ähnlichen Anwendungsfall, zögern Sie nicht, uns über unsere <a href="https://discord.com/invite/8uyFbECzPX">Discord-Community</a> zu kontaktieren oder ein Problem auf<a href="https://github.com/milvus-io/milvus"> GitHub</a> zu melden - wir sind hier, um Ihnen zu helfen, das Beste aus Milvus 2.6 zu machen.</p>

---
id: turboquant-rabitq-vector-database-cost.md
title: >-
  Jenseits der TurboQuant-RaBitQ-Debatte: Warum Vektorquantisierung für
  KI-Infrastrukturkosten wichtig ist
author: Li Liu
date: 2026-4-2
cover: assets.zilliz.com/vectorquantization_0bea9e6bec.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  TurboQuant, RaBitQ, vector quantization, TurboQuant vs RaBitQ, vector database
  memory optimization
meta_title: |
  Vector Quantization: Beyond the TurboQuant-RaBitQ Debate
desc: >-
  Die TurboQuant-RaBitQ-Debatte hat die Vektorquantisierung in die Schlagzeilen
  gebracht. Wie RaBitQ 1-Bit-Kompression funktioniert und wie Milvus IVF_RABITQ
  für 97% Speichereinsparung liefert.
origin: 'https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md'
---
<p>Googles TurboQuant-Papier (ICLR 2026) meldete eine 6-fache KV-Cache-Komprimierung mit einem Genauigkeitsverlust von nahezu Null - Ergebnisse, die auffällig genug waren, um <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> Speicherchip-Aktien</a> an einem einzigen Tag <a href="https://www.cnbc.com/2026/03/26/google-ai-turboquant-memory-chip-stocks-samsung-micron.html"> um 90 Milliarden Dollar</a> zu drücken. SK Hynix fiel um 12 %. Samsung fiel um 7 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_1_825845eccb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Arbeit wurde schnell unter die Lupe genommen. <a href="https://gaoj0017.github.io/">Jianyang Gao</a>, Erstautor von <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> (SIGMOD 2024), warf <a href="https://medium.com/@gaojianyang0017/turboquant-and-rabitq-what-the-public-story-gets-wrong-23df83209c22">Fragen</a> über die Beziehung zwischen der Methodik von TurboQuant und seiner früheren Arbeit über Vektorquantisierung auf. (Wir werden demnächst ein Gespräch mit Dr. Gao veröffentlichen - folgen Sie uns, wenn Sie daran interessiert sind).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Beyond_the_Turbo_Quant_Ra_Bit_Q_Debate_How_Vector_Quantization_Is_Reshaping_AI_Infrastructure_from_Paper_to_Production_2_0860406cae.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In diesem Artikel geht es nicht darum, in dieser Diskussion Partei zu ergreifen. Was uns auffällt, ist etwas Größeres: Die Tatsache, dass ein einziges Papier zur <a href="https://milvus.io/docs/index-explained.md">Vektorquantisierung</a> einen Marktwert von 90 Milliarden Dollar bewegen konnte, zeigt, wie wichtig diese Technologie für die KI-Infrastruktur geworden ist. Ob es sich um die Komprimierung von KV-Cache in Inferenzmaschinen oder um die Komprimierung von Indizes in <a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbanken</a> handelt, die Fähigkeit, hochdimensionale Daten unter Beibehaltung der Qualität zu schrumpfen, hat enorme Auswirkungen auf die Kosten - und es ist ein Problem, an dem wir gearbeitet haben, indem wir RaBitQ in die Vektordatenbank <a href="https://milvus.io/">Milvus</a> integriert und in eine Produktionsinfrastruktur überführt haben.</p>
<p>Im Folgenden erfahren Sie, warum die Vektorquantisierung derzeit so wichtig ist, wie TurboQuant und RaBitQ im Vergleich zueinander abschneiden, was RaBitQ ist und wie es funktioniert, welche technische Arbeit hinter der Integration in die Milvus-Datenbank steckt und wie die Speicheroptimierung für KI-Infrastrukturen im Allgemeinen aussieht.</p>
<h2 id="Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="common-anchor-header">Warum ist die Vektorquantisierung für die Infrastrukturkosten von Bedeutung?<button data-href="#Why-Does-Vector-Quantization-Matter-for-Infrastructure-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektorquantisierung ist nicht neu. Neu ist nur, wie dringend die Branche sie braucht. In den letzten zwei Jahren sind die LLM-Parameter in die Höhe geschossen, die Kontextfenster haben sich von 4K auf 128K+ Token ausgedehnt, und unstrukturierte Daten - Text, Bilder, Audio, Video - sind zu einem erstklassigen Input für KI-Systeme geworden. Jeder dieser Trends führt zu mehr hochdimensionalen Vektoren, die gespeichert, indiziert und durchsucht werden müssen. Mehr Vektoren, mehr Speicher, mehr Kosten.</p>
<p>Wenn Sie Vektorsuche in großem Maßstab betreiben - <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Pipelines</a>, Empfehlungsmaschinen, multimodales Retrieval - sind die Speicherkosten wahrscheinlich eines Ihrer größten Infrastrukturprobleme.</p>
<p>Während der Modellbereitstellung verlässt sich jeder größere LLM-Inferenzstapel auf den <a href="https://zilliz.com/glossary/kv-cache">KV-Cache</a>, der zuvor berechnete Schlüssel-Wert-Paare speichert, damit der Aufmerksamkeitsmechanismus sie nicht für jedes neue Token neu berechnen muss. Das macht O(n)-Inferenz statt O(n²) möglich. Jedes Framework von <a href="https://github.com/vllm-project/vllm">vLLM</a> bis <a href="https://github.com/NVIDIA/TensorRT-LLM">TensorRT-LLM</a> hängt davon ab. Aber der KV-Cache kann mehr GPU-Speicher verbrauchen als die Modellgewichte selbst. Längere Kontexte, mehr gleichzeitige Benutzer, und die Spirale dreht sich schnell.</p>
<p>Der gleiche Druck trifft Vektordatenbanken - Milliarden von hochdimensionalen Vektoren, die im Speicher liegen, jeder ein 32-Bit-Float pro Dimension. Die Vektorquantisierung komprimiert diese Vektoren von 32-Bit-Fließkommazahlen auf 4-Bit-, 2-Bit- oder sogar 1-Bit-Darstellungen, wodurch der Speicher um 90 % oder mehr schrumpft. Ob KV-Cache in Ihrer Inferenzmaschine oder Indizes in Ihrer Vektordatenbank, die zugrunde liegende Mathematik ist dieselbe, und die Kosteneinsparungen sind real. Aus diesem Grund hat ein einziger Bericht über einen Durchbruch in diesem Bereich einen Börsenwert von 90 Milliarden Dollar erreicht.</p>
<h2 id="TurboQuant-vs-RaBitQ-Whats-the-Difference" class="common-anchor-header">TurboQuant vs. RaBitQ: Was ist der Unterschied?<button data-href="#TurboQuant-vs-RaBitQ-Whats-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Sowohl TurboQuant als auch RaBitQ beruhen auf derselben grundlegenden Technik: der Anwendung einer Zufallsrotation<a href="https://arxiv.org/abs/2406.03482">(Johnson-Lindenstrauss-Transformation</a>) auf Eingangsvektoren vor der Quantisierung. Durch diese Rotation werden unregelmäßig verteilte Daten in eine vorhersagbare gleichmäßige Verteilung umgewandelt, was die Quantisierung mit geringen Fehlern erleichtert.</p>
<p>Abgesehen von dieser gemeinsamen Grundlage zielen die beiden Verfahren auf unterschiedliche Probleme ab und verfolgen unterschiedliche Ansätze:</p>
<table>
<thead>
<tr><th></th><th>TurboQuant</th><th>RaBitQ</th></tr>
</thead>
<tbody>
<tr><td><strong>Ziel</strong></td><td>KV-Cache in LLM-Inferenz (ephemere, anfragebezogene Daten)</td><td>Persistente Vektorindizes in Datenbanken (gespeicherte Daten)</td></tr>
<tr><td><strong>Ansatz</strong></td><td>Zweistufig: PolarQuant (Lloyd-Max skalarer Quantisierer pro Koordinate) + <a href="https://arxiv.org/abs/2406.03482">QJL</a> (1-Bit-Restkorrektur)</td><td>Einstufig: Hypercube-Projektion + unverzerrter Abstandsschätzer</td></tr>
<tr><td><strong>Bitbreite</strong></td><td>3-Bit-Schlüssel, 2-Bit-Werte (gemischte Präzision)</td><td>1-Bit pro Dimension (auch Mehr-Bit-Varianten möglich)</td></tr>
<tr><td><strong>Theoretischer Anspruch</strong></td><td>Nahezu optimaler MSE-Verzerrungsgrad</td><td>Asymptotisch optimaler Schätzfehler für das innere Produkt (entspricht den unteren Schranken von Alon-Klartag)</td></tr>
<tr><td><strong>Stand der Produktion</strong></td><td>Gemeinschaftsimplementierungen; keine offizielle Freigabe von Google</td><td>Ausgeliefert in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, übernommen von Faiss, VSAG, Elasticsearch</td></tr>
</tbody>
</table>
<p>Der Hauptunterschied für Praktiker: TurboQuant optimiert den transienten KV-Cache innerhalb einer Inferenzmaschine, während RaBitQ auf die persistenten Indizes abzielt, die eine Vektordatenbank aufbaut, verteilt und über Milliarden von Vektoren abfragt. Im weiteren Verlauf dieses Artikels werden wir uns auf RaBitQ konzentrieren - den Algorithmus, den wir in Milvus integriert haben und in der Produktion einsetzen.</p>
<h2 id="What-Is-RaBitQ-and-What-Does-It-Deliver" class="common-anchor-header">Was ist RaBitQ und was leistet es?<button data-href="#What-Is-RaBitQ-and-What-Does-It-Deliver" class="anchor-icon" translate="no">
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
    </button></h2><p>Zunächst das Fazit: Bei einem 10-Millionen-Vektor-Datensatz mit 768 Dimensionen komprimiert RaBitQ jeden Vektor auf 1/32 seiner ursprünglichen Größe, während die Wiedererkennungsrate bei über 94 % liegt. In Milvus bedeutet das einen 3,6-fach höheren Abfragedurchsatz als bei einem Index mit voller Genauigkeit. Dabei handelt es sich nicht um eine theoretische Hochrechnung, sondern um ein Benchmark-Ergebnis aus Milvus 2.6.</p>
<p>Und nun, wie es dazu kommt.</p>
<p>Die herkömmliche binäre Quantisierung komprimiert FP32-Vektoren auf 1 Bit pro Dimension - eine 32-fache Komprimierung. Der Nachteil: Die Wiedererkennungsrate sinkt, weil zu viele Informationen weggeworfen werden. <a href="https://arxiv.org/abs/2405.12497">RaBitQ</a> (Gao &amp; Long, SIGMOD 2024) behält die gleiche 32-fache Komprimierung bei, bewahrt aber die Informationen, die für die Suche wirklich wichtig sind. Eine <a href="https://arxiv.org/abs/2409.09913">erweiterte Version</a> (Gao &amp; Long, SIGMOD 2025) beweist, dass dies asymptotisch optimal ist und den theoretischen unteren Grenzen von Alon &amp; Klartag (FOCS 2017) entspricht.</p>
<h3 id="Why-Do-Angles-Matter-More-Than-Coordinates-in-High-Dimensions" class="common-anchor-header">Warum spielen Winkel in hohen Dimensionen eine größere Rolle als Koordinaten?</h3><p>Die wichtigste Erkenntnis: <strong>In hohen Dimensionen sind die Winkel zwischen Vektoren stabiler und informativer als einzelne Koordinatenwerte.</strong> Dies ist eine Folge der Messwertkonzentration - dasselbe Phänomen, das die Johnson-Lindenstrauss-Zufallsprojektionen funktionieren lässt.</p>
<p>In der Praxis bedeutet das: Sie können die genauen Koordinatenwerte eines hochdimensionalen Vektors verwerfen und nur seine Richtung relativ zum Datensatz behalten. Die Winkelbeziehungen - von denen die <a href="https://zilliz.com/glossary/anns">Suche nach den nächsten Nachbarn</a> eigentlich abhängt - bleiben bei der Komprimierung erhalten.</p>
<h3 id="How-Does-RaBitQ-Work" class="common-anchor-header">Wie funktioniert RaBitQ?</h3><p>RaBitQ setzt diese geometrische Erkenntnis in drei Schritten um:</p>
<p><strong>Schritt 1: Normalisieren.</strong> Jeder Vektor wird in Bezug auf den Schwerpunkt des Datensatzes zentriert und auf eine Einheitslänge skaliert. Dadurch wird das Problem in eine Schätzung des inneren Produkts zwischen Einheitsvektoren umgewandelt, die leichter zu analysieren und zu begrenzen ist.</p>
<p><strong>Schritt 2: Zufällige Rotation + Hyperkubusprojektion.</strong> Wenden Sie eine zufällige orthogonale Matrix (eine Rotation vom Typ Johnson-Lindenstrauss) an, um Verzerrungen in Richtung einer Achse zu entfernen. Projizieren Sie jeden gedrehten Vektor auf den nächstgelegenen Scheitelpunkt eines {±1/√D}^D-Hyperwürfels. Jede Dimension kollabiert auf ein einziges Bit. Das Ergebnis: ein D-Bit-Binärcode pro Vektor.</p>
<p><strong>Schritt 3: Unverzerrte Abstandsschätzung.</strong> Konstruieren Sie einen Schätzer für das innere Produkt zwischen einer Abfrage und dem ursprünglichen (unquantisierten) Vektor. Der Schätzer ist nachweislich unverzerrt mit einem durch O(1/√D) begrenzten Fehler. Für 768-dimensionale Vektoren liegt die Wiederfindungsrate bei über 94 %.</p>
<p>Die Abstandsberechnung zwischen binären Vektoren reduziert sich auf bitweise UND + popcount - Operationen, die moderne CPUs in einem einzigen Zyklus ausführen. Das macht RaBitQ schnell, nicht nur klein.</p>
<h3 id="Why-Is-RaBitQ-Practical-Not-Just-Theoretical" class="common-anchor-header">Warum ist RaBitQ praktisch, nicht nur theoretisch?</h3><ul>
<li><strong>Keine Ausbildung erforderlich.</strong> Drehung anwenden, Vorzeichen prüfen. Keine iterative Optimierung, kein Lernen des Codebuchs. Die Indizierungszeit ist vergleichbar mit der <a href="https://milvus.io/docs/ivf-pq.md">Produktquantisierung</a>.</li>
<li><strong>Hardware-freundlich.</strong> Abstandsberechnung ist bitweise AND + popcount. Moderne CPUs (Intel IceLake+, AMD Zen 4+) haben dedizierte AVX512VPOPCNTDQ-Anweisungen. Die Ein-Vektor-Schätzung läuft 3x schneller als PQ-Lookup-Tabellen.</li>
<li><strong>Mehrbit-Flexibilität.</strong> Die <a href="https://vectordb-ntu.github.io/RaBitQ-Library/">RaBitQ-Bibliothek</a> unterstützt Varianten über 1-Bit hinaus: 4-Bit erreicht ~90% Recall, 5-Bit ~95%, 7-Bit ~99% - alle ohne Reranking.</li>
<li><strong>Kompatibel.</strong> Lässt sich in bestehende Indexstrukturen wie <a href="https://milvus.io/docs/ivf-flat.md">IVF-Indizes</a> und <a href="https://milvus.io/docs/hnsw.md">HNSW-Graphen</a> einfügen und arbeitet mit FastScan für Batch-Abstandsberechnungen.</li>
</ul>
<h2 id="From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="common-anchor-header">Vom Papier zur Produktion: Was wir für die Auslieferung von RaBitQ in Milvus entwickelt haben<button data-href="#From-Paper-to-Production-What-We-Built-to-Ship-RaBitQ-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Der ursprüngliche RaBitQ-Code ist ein Forschungsprototyp für eine Maschine. Damit er in einem <a href="https://milvus.io/docs/architecture_overview.md">verteilten Cluster</a> mit Sharding, Failover und Echtzeit-Ingestion funktioniert, mussten vier technische Probleme gelöst werden. Bei <a href="https://zilliz.com/">Zilliz</a> ging es nicht nur um die Implementierung des Algorithmus, sondern auch um die Integration der Engine, die Hardware-Beschleunigung, die Optimierung des Index und die Abstimmung der Laufzeit, um RaBitQ zu einer industrietauglichen Funktion in Milvus zu machen. Weitere Details finden Sie auch in diesem Blog: <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze treiben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p>
<h3 id="Making-RaBitQ-Distributed-Ready" class="common-anchor-header">RaBitQ verteilungsfähig machen</h3><p>Wir haben RaBitQ direkt in <a href="https://github.com/milvus-io/knowhere">Knowhere</a>, die Kernsuchmaschine von Milvus, integriert - nicht als Plugin, sondern als nativer Indextyp mit einheitlichen Schnittstellen. Er arbeitet mit der gesamten verteilten Architektur von Milvus: Sharding, Partitionierung, dynamische Skalierung und <a href="https://milvus.io/docs/manage-collections.md">Sammlungsmanagement</a>.</p>
<p>Die größte Herausforderung besteht darin, das Quantisierungscodebuch (Rotationsmatrix, Schwerpunktvektoren, Skalierungsparameter) segmentorientiert zu gestalten, so dass jeder Shard seinen eigenen Quantisierungsstatus erstellt und speichert. Indexerstellung, Verdichtung und Lastausgleich verstehen den neuen Indextyp von Haus aus.</p>
<h3 id="Squeezing-Every-Cycle-Out-of-Popcount" class="common-anchor-header">Jeden Zyklus aus Popcount herausquetschen</h3><p>Die Geschwindigkeit von RaBitQ beruht auf Popcount - dem Zählen der gesetzten Bits in binären Vektoren. Der Algorithmus ist von Natur aus schnell, aber wie viel Durchsatz Sie erzielen, hängt davon ab, wie gut Sie die Hardware nutzen. Wir haben spezielle SIMD-Codepfade für die beiden vorherrschenden Serverarchitekturen entwickelt:</p>
<ul>
<li><strong>x86 (Intel IceLake+ / AMD Zen 4+):</strong> Der VPOPCNTDQ-Befehl von AVX-512 berechnet Popcount parallel über mehrere 512-Bit-Register. Die inneren Schleifen von Knowhere werden umstrukturiert, um binäre Abstandsberechnungen in SIMD-Breite-Chunks zu bündeln und so den Durchsatz zu maximieren.</li>
<li><strong>ARM (Graviton, Ampere):</strong> SVE-Anweisungen (Scalable Vector Extension) für das gleiche parallele Popcount-Muster - entscheidend, da ARM-Instanzen in kostenoptimierten Cloud-Bereitstellungen immer häufiger verwendet werden.</li>
</ul>
<h3 id="Eliminating-Runtime-Overhead" class="common-anchor-header">Eliminierung von Laufzeit-Overhead</h3><p>RaBitQ benötigt zur Abfragezeit zusätzliche Fließkommaparameter: den Datensatzschwerpunkt, Normen pro Vektor und das innere Produkt zwischen jedem quantisierten Vektor und seinem Original (das vom Distanzschätzer verwendet wird). Die Berechnung dieser Parameter pro Abfrage erhöht die Latenzzeit. Die Speicherung der vollständigen Originalvektoren macht den Zweck der Komprimierung zunichte.</p>
<p>Unsere Lösung: Vorberechnung und Speicherung dieser Parameter während des Indexaufbaus, wobei sie zusammen mit den Binärcodes zwischengespeichert werden. Der Speicher-Overhead ist gering (ein paar Floats pro Vektor), aber die Berechnung pro Abfrage entfällt und die Latenz bleibt auch bei hoher Parallelität stabil.</p>
<h3 id="IVFRABITQ-The-Index-You-Actually-Deploy" class="common-anchor-header">IVF_RABITQ: Der Index, den Sie tatsächlich einsetzen</h3><p>Ab <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> liefern wir <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> - <a href="https://milvus.io/docs/ivf-flat.md">Inverted File Index</a> + RaBitQ Quantisierung. Die Suche erfolgt in zwei Stufen:</p>
<ol>
<li><strong>Grobsuche (IVF).</strong> K-means partitioniert den Vektorraum in Cluster. Zur Abfragezeit werden nur die nprobe nächstgelegenen Cluster gescannt.</li>
<li><strong>Feines Scoring (RaBitQ).</strong> Innerhalb jedes Clusters werden die Entfernungen mithilfe von 1-Bit-Codes und dem unbiased estimator geschätzt. Popcount erledigt die schwere Arbeit.</li>
</ol>
<p>Die Ergebnisse auf einem 768-dimensionalen, 10 Millionen Vektoren umfassenden Datensatz:</p>
<table>
<thead>
<tr><th>Metrik</th><th>IVF_FLAT (Grundlinie)</th><th>IVF_RABITQ</th><th>IVF_RABITQ + SQ8 verfeinern</th></tr>
</thead>
<tbody>
<tr><td>Wiedererkennung</td><td>95.2%</td><td>94.7%</td><td>~95%</td></tr>
<tr><td>QPS</td><td>236</td><td>864</td><td>-</td></tr>
<tr><td>Speicherplatzbedarf</td><td>32 Bits/Abbildung</td><td>1 Bit/Dim (~3% des Originals)</td><td>~25% des Originals</td></tr>
</tbody>
</table>
<p>Für Workloads, die nicht einmal eine 0,5%ige Recall-Lücke tolerieren können, fügt der Parameter refine_type einen zweiten Scoring-Durchgang hinzu: SQ6, SQ8, FP16, BF16 oder FP32. SQ8 ist die übliche Wahl - sie stellt den Abruf auf IVF_FLAT-Niveau mit etwa 1/4 des ursprünglichen Speichers wieder her. Sie können <a href="https://milvus.io/docs/ivf-sq8.md">die Skalarquantisierung</a> auch unabhängig auf die Abfrageseite (SQ1-SQ8) anwenden, so dass Sie zwei Regler haben, um den Kompromiss zwischen Latenz und Abrufkosten pro Arbeitslast einzustellen.</p>
<h2 id="How-Milvus-Optimizes-Memory-Beyond-Quantization" class="common-anchor-header">Wie Milvus den Speicher über die Quantisierung hinaus optimiert<button data-href="#How-Milvus-Optimizes-Memory-Beyond-Quantization" class="anchor-icon" translate="no">
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
    </button></h2><p>RaBitQ ist der wirkungsvollste Komprimierungshebel, aber er ist nur eine Ebene in einem breiteren <a href="https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md">Speicheroptimierungsstapel</a>:</p>
<table>
<thead>
<tr><th>Strategie</th><th>Was es tut</th><th>Auswirkung</th></tr>
</thead>
<tbody>
<tr><td><strong>Vollständige Quantisierung</strong></td><td>SQ8, PQ, RaBitQ mit unterschiedlichen Kompromissen zwischen Präzision und Kosten</td><td>4x bis 32x Speicherreduzierung</td></tr>
<tr><td><strong>Optimierung der Indexstruktur</strong></td><td>HNSW-Graphverdichtung, DiskANN-SSD-Offloading, OOM-sichere Indexerstellung</td><td>Weniger DRAM pro Index, größere Datensätze pro Knoten</td></tr>
<tr><td><strong>Memory-mapped I/O (mmap)</strong></td><td>Abbildung von Vektordateien auf der Festplatte, Laden von Seiten bei Bedarf über den OS-Seiten-Cache</td><td>TB-große Datensätze, ohne alles in den RAM zu laden</td></tr>
<tr><td><strong>Tiered Storage</strong></td><td>Trennung von heißen/warmen/kalten Daten mit automatischer Planung</td><td>Bezahlen Sie den Speicherpreis nur für Daten, auf die häufig zugegriffen wird</td></tr>
<tr><td><strong>Cloud-native Skalierung</strong><a href="https://zilliz.com/cloud">(Zilliz Cloud</a>, verwaltete Milvus)</td><td>Elastische Speicherzuweisung, automatische Freigabe von ungenutzten Ressourcen</td><td>Zahlen Sie nur für das, was Sie nutzen</td></tr>
</tbody>
</table>
<h3 id="Full-Stack-Quantization" class="common-anchor-header">Full-Stack-Quantisierung</h3><p>Die extreme 1-Bit-Kompression von RaBitQ ist nicht für jede Arbeitslast geeignet. Milvus bietet eine vollständige Quantisierungsmatrix: <a href="https://milvus.io/docs/ivf-sq8.md">SQ8</a> und <a href="https://milvus.io/docs/ivf-pq.md">Produktquantisierung (PQ)</a> für Workloads, die einen ausgewogenen Kompromiss zwischen Präzision und Kosten erfordern, RaBitQ für maximale Komprimierung bei sehr großen Datensätzen und Hybridkonfigurationen, die mehrere Methoden für eine feinkörnige Steuerung kombinieren.</p>
<h3 id="Index-Structure-Optimization" class="common-anchor-header">Optimierung der Indexstruktur</h3><p>Neben der Quantisierung optimiert Milvus kontinuierlich den Speicher-Overhead in seinen Kern-Indexstrukturen. Für <a href="https://milvus.io/docs/hnsw.md">HNSW</a> haben wir die Redundanz der Adjazenzlisten reduziert, um die Speichernutzung pro Graph zu verringern. <a href="https://milvus.io/docs/diskann.md">DiskANN</a> verlagert sowohl die Vektordaten als auch die Indexstrukturen auf die SSD, wodurch die DRAM-Abhängigkeit bei großen Datensätzen drastisch reduziert wird. Außerdem haben wir die Zuweisung von Zwischenspeicher während der Indexerstellung optimiert, um OOM-Fehler zu vermeiden, wenn Indizes über Datensätze erstellt werden, die sich den Speichergrenzen der Knoten nähern.</p>
<h3 id="Smart-Memory-Loading" class="common-anchor-header">Intelligentes Laden von Speicher</h3><p>Die <a href="https://milvus.io/docs/mmap.md">mmap-Unterstützung</a> (memory-mapped I/O) von Milvus ordnet Vektordaten den Festplattendateien zu und verlässt sich dabei auf den Seitencache des Betriebssystems für das bedarfsgesteuerte Laden - es müssen nicht alle Daten beim Start in den Speicher geladen werden. In Kombination mit Lazy-Loading- und segmentierten Ladestrategien, die plötzliche Speicherspitzen verhindern, ermöglicht dies einen reibungslosen Betrieb mit TB-großen Vektordatensätzen zu einem Bruchteil der Speicherkosten.</p>
<h3 id="Tiered-Storage" class="common-anchor-header">Mehrschichtige Speicherung</h3><p>Die <a href="https://milvus.io/docs/tiered-storage-overview.md">dreistufige Speicherarchitektur</a> von Milvus umfasst Arbeitsspeicher, SSD und Objektspeicher: Warme Daten verbleiben im Arbeitsspeicher, um eine niedrige Latenzzeit zu erreichen, warme Daten werden auf SSD zwischengespeichert, um ein ausgewogenes Verhältnis zwischen Leistung und Kosten zu erreichen, und kalte Daten werden im Objektspeicher abgelegt, um den Overhead zu minimieren. Das System verwaltet die Datenplanung automatisch - Änderungen auf der Anwendungsebene sind nicht erforderlich.</p>
<h3 id="Cloud-Native-Scaling" class="common-anchor-header">Cloud-native Skalierung</h3><p>Im Rahmen der <a href="https://milvus.io/docs/architecture_overview.md">verteilten Architektur</a> von Milvus verhindern Data Sharding und Load Balancing eine Überlastung des Speichers auf einem einzelnen Knoten. Speicherpooling reduziert die Fragmentierung und verbessert die Auslastung. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (vollständig verwaltetes Milvus) geht noch einen Schritt weiter und bietet elastisches Scheduling für die bedarfsgerechte Skalierung des Speichers - im Serverless-Modus werden ungenutzte Ressourcen automatisch freigegeben, was die Gesamtbetriebskosten weiter reduziert.</p>
<h3 id="How-These-Layers-Compound" class="common-anchor-header">Wie sich diese Ebenen zusammensetzen</h3><p>Diese Optimierungen sind keine Alternativen - sie sind aufeinander aufbauend. RaBitQ verkleinert die Vektoren. DiskANN behält den Index auf der SSD. Mmap vermeidet das Laden kalter Daten in den Speicher. <a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md">Tiered Storage</a> verlagert archivierte Daten in den Objektspeicher. Das Ergebnis: Ein Einsatz, der Milliarden von Vektoren bedient, benötigt nicht Milliarden von Vektoren an RAM.</p>
<h2 id="Get-Started" class="common-anchor-header">Beginnen Sie<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Da die KI-Datenmengen weiter wachsen, werden die Effizienz und die Kosten von Vektordatenbanken direkt bestimmen, wie weit KI-Anwendungen skaliert werden können. Wir werden weiterhin in eine leistungsstarke und kostengünstige Vektorinfrastruktur investieren, damit mehr KI-Anwendungen vom Prototyp zur Produktion übergehen können.</p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> ist quelloffen. Um IVF_RABITQ auszuprobieren:</p>
<ul>
<li>In der <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ-Dokumentation</a> finden Sie Anleitungen zur Konfiguration und Einstellung.</li>
<li>Lesen Sie den vollständigen <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Blogbeitrag zur RaBitQ-Integration</a>, um mehr über Benchmarks und Implementierungsdetails zu erfahren.</li>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um Fragen zu stellen und von anderen Entwicklern zu lernen.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose Milvus-Sprechstunde</a>, um Ihren Anwendungsfall durchzugehen.</li>
</ul>
<p>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (vollständig verwaltetes Milvus) ein kostenloses Tier mit IVF_RABITQ-Support.</p>
<p>Wir führen demnächst ein Interview mit Professor <a href="https://personal.ntu.edu.sg/c.long/">Cheng Long</a> (NTU, VectorDB@NTU) und <a href="https://gaoj0017.github.io/">Dr. Jianyang Gao</a> (ETH Zürich), dem Erstautor von RaBitQ, in dem wir die Theorie der Vektorquantisierung und die nächsten Schritte näher erläutern werden. Stellen Sie Ihre Fragen in den Kommentaren.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Häufig gestellte Fragen<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-are-TurboQuant-and-RaBitQ" class="common-anchor-header">Was sind TurboQuant und RaBitQ?</h3><p>TurboQuant (Google, ICLR 2026) und RaBitQ (Gao &amp; Long, SIGMOD 2024) sind beides Vektorquantisierungsmethoden, die zufällige Rotation zur Kompression hochdimensionaler Vektoren verwenden. TurboQuant zielt auf KV-Cache-Kompression in LLM-Inferenz, während RaBitQ auf persistente Vektorindizes in Datenbanken abzielt. Beide haben zur aktuellen Welle des Interesses an Vektorquantisierung beigetragen, obwohl sie unterschiedliche Probleme für unterschiedliche Systeme lösen.</p>
<h3 id="How-does-RaBitQ-achieve-1-bit-quantization-without-destroying-recall" class="common-anchor-header">Wie erreicht RaBitQ eine 1-Bit-Quantisierung, ohne die Wiedererkennung zu zerstören?</h3><p>RaBitQ nutzt die Konzentration von Maßen in hochdimensionalen Räumen: Die Winkel zwischen Vektoren sind bei zunehmender Dimensionalität stabiler als einzelne Koordinatenwerte. Es normalisiert die Vektoren in Bezug auf den Schwerpunkt des Datensatzes und projiziert dann jeden Vektor auf den nächstgelegenen Scheitelpunkt eines Hyperwürfels (wobei jede Dimension auf ein einziges Bit reduziert wird). Ein unvoreingenommener Abstandsschätzer mit einer nachweisbaren Fehlergrenze sorgt dafür, dass die Suche trotz der Kompression genau bleibt.</p>
<h3 id="What-is-IVFRABITQ-and-when-should-I-use-it" class="common-anchor-header">Was ist IVF_RABITQ und wann sollte ich es verwenden?</h3><p>IVF_RABITQ ist ein Vektorindex-Typ in Milvus (verfügbar seit Version 2.6), der invertiertes Datei-Clustering mit RaBitQ 1-Bit-Quantisierung kombiniert. Er erreicht 94,7 % Recall bei 3,6-fachem Durchsatz im Vergleich zu IVF_FLAT, bei einem Speicherverbrauch von etwa 1/32 der ursprünglichen Vektoren. Verwenden Sie diese Methode, wenn Sie eine umfangreiche Vektorsuche durchführen müssen (Millionen bis Milliarden von Vektoren) und die Speicherkosten ein Hauptanliegen sind - häufig bei RAG-, Empfehlungs- und multimodalen Suchvorgängen.</p>
<h3 id="How-does-vector-quantization-relate-to-KV-cache-compression-in-LLMs" class="common-anchor-header">Wie hängt die Vektorquantisierung mit der KV-Cache-Kompression in LLMs zusammen?</h3><p>Bei beiden Problemen geht es um die Komprimierung hochdimensionaler Gleitkomma-Vektoren. Der KV-Cache speichert Schlüssel-Wert-Paare aus dem Transformer-Attention-Mechanismus; bei großen Kontextlängen kann er die Modellgewichte in der Speichernutzung übersteigen. Vektorquantisierungsverfahren wie RaBitQ reduzieren diese Vektoren auf Darstellungen mit niedrigeren Bits. Die gleichen mathematischen Prinzipien - Messkonzentration, zufällige Rotation, unverzerrte Abstandsschätzung - gelten sowohl für die Komprimierung von Vektoren in einem Datenbankindex als auch im KV-Cache einer Inferenzmaschine.</p>

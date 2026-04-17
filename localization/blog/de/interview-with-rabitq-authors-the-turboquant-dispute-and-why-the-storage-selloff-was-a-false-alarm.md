---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Interview mit RaBitQ-Autoren: Der TurboQuant-Streit und warum der
  Speicherausverkauf ein falscher Alarm war
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Die Autoren von RaBitQ antworten auf das TurboQuant-Papier von Google: das
  Ungleichgewicht bei den Benchmarks, die falsche Theorie und warum der
  Ausverkauf von Speicherkapazität ein falscher Alarm war.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Googles <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant-Papier</a> behauptete eine <strong>6-fache Komprimierung, eine 8-fache Beschleunigung und einen Genauigkeitsverlust von nahezu Null</strong> für Vektordarstellungen. Nach der Veröffentlichung fielen die Aktien von Arbeitsspeichern und Speichermedien drastisch, und die großen Technologiezeitschriften machten schnell Schlagzeilen daraus.</p>
<p>Die Marktreaktion war jedoch nur der Anfang. Schon bald begannen Forscher zu fragen, ob die Behauptungen in dem Papier übertrieben waren und ob frühere Arbeiten - insbesondere <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> - fair behandelt wurden. Der Streit rückte <strong>die Vektorquantisierung</strong> wieder ins Rampenlicht, auch weil dieselben zugrunde liegenden Ideen jetzt in zwei wichtigen Bereichen der KI eine Rolle spielen: <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuchsysteme</a> und KV-Cache-Kompression für große Modelle.</p>
<p>Um sowohl die technische Debatte als auch deren Bedeutung für Produktionssysteme zu verstehen, sprachen wir mit <strong>Cheng Long</strong>, außerordentlicher Professor an der NTU Singapur und Leiter von VectorDB@NTU, <strong>Jianyang Gao</strong>, Erstautor von RaBitQ, und <strong>Li Liu</strong>, technischer Leiter bei Zilliz. Das Gespräch drehte sich um die Vektorquantisierung selbst, um die Fragen, die im Zusammenhang mit TurboQuant aufgeworfen wurden, und um die Frage, warum dies für Systeme wie <a href="https://milvus.io/">Milvus</a>, die populärsten <a href="https://zilliz.com/learn/what-is-vector-database">Open-Source-Vektordatenbanken</a>, und für die Suche nach Vektoren in großem Maßstab wichtig ist.</p>
<p><strong><em>Weiterführende Lektüre:</em></strong> <em>Wenn Sie sich eher für die technische Seite als für das Interview interessieren, lesen Sie unseren Begleitartikel über die</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>Auswirkungen der Vektorquantisierung auf die KI-Infrastrukturkosten</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Warum ist die Vektorquantisierung plötzlich so ein großes Thema geworden?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Bevor wir auf die Kontroverse eingehen, könnten Sie zunächst erklären, was Vektorquantisierung ist und warum sie in der KI so wichtig geworden ist?</strong></p>
<p><strong>Cheng Long:</strong> Die Vektorquantisierung ist eine Technik zur <strong>Datenkompression</strong> und <strong>approximativen Darstellung</strong>. Sie stammt ursprünglich aus der Signalverarbeitung, wo sie zur Bild- und Audiokompression eingesetzt wurde. In modernen KI-Systemen hat sich ihre Rolle geändert, da Vektoren zu einer der Grundeinheiten der Berechnung geworden sind.</p>
<p>Seine Bedeutung ist heute an zwei Stellen am deutlichsten.</p>
<p>Zum einen bei der <strong>Echtzeitsuche in Sammlungen mit Milliarden oder gar Zehnmilliarden von Vektoren</strong>. In semantischen Retrievalsystemen ist die Kernaufgabe die Ähnlichkeitssuche über hochdimensionale Vektoren. Rohvektoren sind jedoch groß, und Gleitkommaberechnungen sind teuer. Im großen Maßstab ist es daher schwierig, Latenzzeiten im Millisekundenbereich zu erreichen. Die Vektorquantisierung hilft durch die Komprimierung von Vektoren in Niedrig-Bit-Darstellungen und die Beschleunigung der Abstandsberechnung. Aus diesem Grund ist sie für praktische Arbeitslasten wie die <a href="https://milvus.io/docs/single-vector-search.md">Ein-Vektor-Suche</a>, die <a href="https://milvus.io/docs/multi-vector-search.md">Multi-Vektor-Suche</a> und das Indexdesign in der <a href="https://milvus.io/docs/index-explained.md">Milvus-Sucharchitektur</a> wichtig.</p>
<p>Das andere ist die <strong>KV-Cache-Kompression</strong> für große Modelle. KV-Cache reduziert redundante Berechnungen während der Generierung, aber die Speicherkosten wachsen schnell, wenn der Kontext länger wird. Es stellt sich also die Frage, wie diese Vektoren komprimiert werden können, ohne die Qualität der Ausgabe zu sehr zu beeinträchtigen. Im Kern ist das auch ein Vektorquantisierungsproblem.</p>
<p><strong>Zilliz: Wenn sich die Vektorquantisierung durchsetzt - und wenn die Ergebnisse von TurboQuant Bestand haben - bedeutet das, dass der Speicherbedarf stark sinkt?</strong></p>
<p><strong>Jianyang Gao:</strong> Unter dem gleichen Modell und der gleichen Arbeitslast kann die Komprimierung den Speicherbedarf reduzieren. Aber das rechtfertigt nicht die allgemeine Schlussfolgerung, zu der die Leute vorschnell gekommen sind.</p>
<p>Wenn TurboQuant von einer <strong>6-fachen Komprimierung</strong> und einer <strong>8-fachen Beschleunigung</strong> spricht, bezieht sich das auf einen Vergleich mit einer <strong>16-Bit/32-Bit-Basisversion</strong>. Das ist nicht dasselbe wie der Vergleich mit anderen Methoden derselben Kategorie. Die tatsächliche Wirkung muss also noch genauer bewertet werden.</p>
<p><strong>Zilliz: Wenn es bei der Marktreaktion wirklich um die Technologie selbst ging, hätte sie dann nicht schon viel früher erfolgen müssen, als ähnliche Ideen bereits auftauchten?</strong></p>
<p><strong>Cheng Long:</strong> Aus technischer Sicht könnte man sagen, dass ein ähnliches theoretisches Terrain bereits zuvor erreicht worden war. Aber die Märkte bewegen sich nicht im Gleichschritt mit der Forschung. In der Regel gibt es eine Verzögerung zwischen den akademischen Ergebnissen, der technischen Umsetzung und der finanziellen Interpretation.</p>
<p>Und über einen längeren Zeitraum hinweg ist der Effekt möglicherweise nicht einmal linear. Die Komprimierung kann es ermöglichen, große Modelle auf kleineren Geräten laufen zu lassen, was eine neue Nachfrage schaffen kann, anstatt sie einfach zu verringern. Die Beziehung zwischen Technologie und Märkten ist komplizierter als eine lineare Extrapolation.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">Wie ist RaBitQ entstanden, und welchen Beitrag hat es geleistet?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Wie sind Sie auf die Idee für RaBitQ gekommen?</strong></p>
<p><strong>Jianyang Gao:</strong> Wir sind von einer Lücke ausgegangen, die wir in Vektordatenbanken gesehen haben. Traditionelle Methoden wie die <a href="https://milvus.io/docs/ivf-pq.md">Produktquantisierung</a> funktionierten empirisch gut, boten aber kaum theoretische Garantien.</p>
<p>Zu dieser Zeit studierte ich hochdimensionale Wahrscheinlichkeitsrechnung an der NTU Singapur, und das brachte mich zu der Frage, ob wir eine Methode entwickeln könnten, die nicht nur praktisch ist, sondern auch eine klare theoretische Garantie bietet. Das war der Startpunkt für RaBitQ.</p>
<p><strong>Zilliz: Worin besteht Ihrer Meinung nach die Hauptoriginalität von RaBitQ?</strong></p>
<p><strong>Jianyang Gao</strong>: Die Schlüsselidee war die Verwendung einer Zufallsrotation, auch bekannt als Johnson-Lindenstrauss-Transformation, um die Verteilung der Vektorkoordinaten gleichmäßiger und berechenbarer zu machen.</p>
<p>Wenn man das hat, kann man darauf aufbauend einen optimalen Quantisierungsschätzer ableiten. Wir haben dann einen strengen Beweis erbracht, dass er die theoretische untere Grenze erreicht.</p>
<p>In früheren Arbeiten wurde auch versucht, eine zufällige Rotation einzuführen. Aber aus unserer Sicht haben diese Methoden aufgrund praktischer Probleme bei der Entwicklung von Algorithmen nicht den gewünschten Effekt erzielt.</p>
<p><strong>Zilliz: Was ist Ihnen aus technischer Sicht an RaBitQ besonders aufgefallen?</strong></p>
<p><strong>Li Liu:</strong> Wir haben mit vielen Quantisierungsalgorithmen gearbeitet, von <a href="https://milvus.io/docs/ivf-sq8.md">skalaren Quantisierungsmethoden</a> bis zu PQ und anderen Varianten. Das Besondere an RaBitQ war, dass es die Herangehensweise an das Problem veränderte.</p>
<p>Davor war ein Großteil des Feldes noch ziemlich empirisch. Man konnte sagen, dass eine Methode zu funktionieren schien, aber es war schwieriger, klar zu erklären, warum. RaBitQ ging das Problem auf eine viel mathematischere Weise an. Die Methode wirkte elegant und in gewissem Sinne auch einfach. Diese Denkweise hat eine Menge späterer Arbeiten beeinflusst.</p>
<p><strong>Zilliz: Einfach ausgedrückt, wie viel Speicherplatz und Kosten können eingespart werden?</strong></p>
<p><strong>Li Liu:</strong> Wenn man von einer 4-Bit-Komprimierung auf eine 2-Bit-Komprimierung umsteigt, halbiert sich der Speicherbedarf auf derselben Abrufebene.</p>
<p>Und es geht nicht nur um die Komprimierung. Die Leistung ist mit früheren Ansätzen vergleichbar, und das ist in Produktionsumgebungen wichtig, in denen Teams sowohl auf Speichereffizienz als auch auf Abrufqualität achten. Deshalb ist es für Systeme von Bedeutung, die ein Gleichgewicht zwischen <a href="https://milvus.io/docs/dense-vector.md">dichter Vektorspeicherung</a>, Durchsatz und Abruf benötigen.</p>
<p><strong>Zilliz: Abgesehen von Milvus, wo sehen Sie RaBitQ heute im Einsatz?</strong></p>
<p><strong>Cheng Long:</strong> Zunächst möchte ich dem Milvus-Team danken, denn sie waren unter den ersten, die RaBitQ übernommen haben. Wir hatten auch viele Diskussionen und einige gemeinsame Forschungen auf dem Weg dorthin.</p>
<p>RaBitQ wurde auch in einige andere Systeme übernommen, darunter Meta's FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene und turbopuffer. Was auf der Milvus-Seite hervorsticht, ist, dass das Team <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> als echte Indexoption in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> ausgeliefert hat, neben einer breiteren Arbeit an der <a href="https://milvus.io/docs/manage-collections.md">Sammlungsverwaltung</a>, <a href="https://milvus.io/docs/ivf-flat.md">IVF-basierter Indexierung</a> und <a href="https://milvus.io/docs/hnsw.md">HNSW-basierter Indexierung</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">Wie sollten wir TurboQuant bewerten?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: In Ihrer öffentlichen Antwort sagten Sie, dass TurboQuant einige ernsthafte Probleme hat. Was waren Ihrer Meinung nach die wichtigsten?</strong></p>
<p><strong>Jianyang Gao:</strong> Wir sehen drei Hauptprobleme.</p>
<p>Eines ist die Art und Weise, wie das Papier frühere Arbeiten beschreibt und Überschneidungen erörtert. Das TurboQuant-Papier stellt die Methodik von RaBitQ falsch dar und ignoriert den ähnlichsten Teil, wie die Johnson-Lindenstrauss-Transformation. Ein weiteres Problem ist die Art und Weise, wie das Papier das theoretische Ergebnis charakterisiert. Es beschreibt RaBitQ als suboptimal, ohne irgendeine Erklärung oder einen Beweis zu liefern, aber RaBitQ ist in Wirklichkeit optimal. Der dritte Punkt ist die Fairness des experimentellen Vergleichs. Sie verwenden eine Single-Core-CPU, um RaBitQ zu bewerten, während sie eine A100-GPU verwenden, um TurboQuant zu bewerten.</p>
<p><strong>Zilliz: Lassen Sie uns zuerst die Benchmark-Problematik betrachten. Warum glauben Sie, dass der Vergleich nicht fair war?</strong></p>
<p><strong>Jianyang Gao:</strong> Benchmark-Behauptungen haben nur dann einen Sinn, wenn das Setup vergleichbar ist. Wenn ein System unter einer sehr unterschiedlichen Hardware- oder Softwareumgebung getestet wird, dann kann das Ergebnis eher die Einrichtung als den Algorithmus selbst widerspiegeln.</p>
<p>Unserer Meinung nach können Unterschiede bei der Wahl des Prozessors, der Implementierungssprache und der Optimierungsstufe einen großen Unterschied ausmachen. Aus diesem Grund muss die Benchmark-Methodik sehr sorgfältig interpretiert werden, insbesondere von Teams, die produktive Retrievalsysteme entwickeln.</p>
<p><strong>Cheng Long:</strong> In dem Papier werden auch einige andere Behauptungen aufgestellt, die nicht zutreffen.</p>
<p>Zum Beispiel heißt es in dem Papier, dass <strong>RaBitQ nicht vektorisiert werden kann</strong>. Aber RaBitQ hatte bereits Code mit SIMD-basierten vektorisierten Berechnungen veröffentlicht, als das 2024-Papier veröffentlicht wurde. Aus unserer Sicht war diese Aussage also sachlich falsch.</p>
<p>Es ist auch erwähnenswert, dass wir letztes Jahr mit NVIDIA zusammengearbeitet haben und eine GPU-Implementierung von RaBitQ fertiggestellt haben. Der zugehörige Code wird derzeit für die Aufnahme in NVIDIAs cuVS-Bibliothek geprüft.</p>
<p><strong>Zilliz: Milvus evaluierte TurboQuant in der zweiten Hälfte des Jahres 2025, hat es aber nicht übernommen. Was hat Ihr Team bei den Tests festgestellt?</strong></p>
<p><strong>Li Liu:</strong> Es enthält eine nützliche Idee. Unserer Ansicht nach wird die Zuweisung des Quantisierungsgitters ein wenig optimiert. Aber der wichtigste Schritt in der Methode - die Verwendung von Zufallsrotation für die Quantisierung - wurde zuerst von RaBitQ eingeführt.</p>
<p>Und wenn es um eine unvoreingenommene Schätzung geht, ist der Ansatz von RaBitQ sauberer und seine theoretische Herleitung ist stärker.</p>
<p>Da es sich um ein Ergebnis von Google handelt, haben wir es im Jahr 2025 getestet. In unserem Labor, unter einer standardisierten CPU-Umgebung, übertraf TurboQuant unsere interne RaBitQ-Version in den meisten Fällen, die wir bewerteten, nicht. Als der Markt also so stark reagierte, waren wir wirklich überrascht.</p>
<p><strong>Zilliz: Könnten Sie den Lesern, die sich mit den beiden Arbeiten nicht näher befasst haben, im Klartext erklären, wo sich RaBitQ und TurboQuant überschneiden?</strong></p>
<p><strong>Li Liu</strong>: Auf einer hohen Ebene beginnen beide Methoden mit einer <strong>zufälligen Rotation</strong>. Mathematisch gesehen bedeutet das, dass der Vektor mit einer zufälligen orthogonalen Matrix multipliziert wird. Man kann sich das so vorstellen, dass man seinen Blickwinkel in einem hochdimensionalen Raum ändert. Dabei werden die relativen Positionen der Datenpunkte nicht verändert, aber die Informationen werden gleichmäßiger über die Dimensionen verteilt.</p>
<p>Danach folgt die <strong>Quantisierung</strong>. Sie unterteilen den kontinuierlichen reellen Raum in <strong>2^k Gitterzellen</strong>, wobei <strong>k</strong> die Anzahl der Quantisierungsbits ist, und bilden dann jedes Vektorelement auf einen nahe gelegenen Gitterpunkt ab. TurboQuant nimmt hier eine kleine Anpassung vor, indem es das Gitter entsprechend der Datenverteilung zuweist, anstatt es gleichmäßig zu verteilen.</p>
<p>Der letzte Schritt ist die <strong>Fehlerabschätzung</strong>, und hier liegt der Hauptbeitrag von RaBitQ. Herkömmliche Methoden berechnen direkt aus den quantisierten Werten, was den Fehler schwerer kontrollierbar macht. RaBitQ schätzt den Quantisierungsfehler genauer, und darin liegt seine mathematische Optimalität begründet. Die Lösung von TurboQuant ist komplizierter, und in unserer Umgebung erschien der Kompromiss nicht so attraktiv.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Warum ist die Zuordnung in der Praxis so schwer zu lösen?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz</strong>: Wie haben Google und ICLR reagiert, nachdem Sie Ihre öffentliche Erklärung veröffentlicht hatten?</p>
<p><strong>Cheng Long:</strong> ICLR hat keine Maßnahmen ergriffen. Wir haben ihnen während des Überprüfungszeitraums im September letzten Jahres eine E-Mail geschickt, aber keine Antwort erhalten. Im März dieses Jahres schrieben wir erneut und wurden aufgefordert, Kommentare auf OpenReview zu veröffentlichen, aber darüber hinaus gab es keine weiteren Maßnahmen.</p>
<p>Was Google betrifft, so antwortete einer der Mitautoren vor ein paar Tagen. In der Antwort hieß es, sie würden die arXiv-Version überarbeiten, um die ungenaue Beschreibung der Optimalität von RaBitQ zu korrigieren.</p>
<p><strong>Zilliz:</strong> Zuvor ging es in der Diskussion um akademisches Fehlverhalten. Jetzt klingt es auch wie eine Frage des Ungleichgewichts und wer die Geschichte gestalten darf. Warum ist es so schwer, Ihre Arbeit zu verteidigen?</p>
<p><strong>Cheng Long:</strong> Ein Problem ist der Umfang. KI-Konferenzen sind inzwischen so groß, dass bei einem einzigen Zyklus Zehntausende von Beiträgen eingehen können. Die Organisatoren haben einfach nicht die Kapazität, jeden Streitfall dieser Art zu bearbeiten.</p>
<p>Das andere Problem ist das Ungleichgewicht. Große Unternehmen haben eine viel stärkere öffentliche Stimme. Unabhängige Forscher oder kleinere Teams haben nicht die gleiche Kommunikationskraft.</p>
<p><strong>Jianyang Gao:</strong> Für Einzelpersonen sind die Kosten extrem hoch. Professor Long und ich haben in den letzten Wochen kaum normal arbeiten können.</p>
<p>Auch das Verfahren selbst war frustrierend. Als wir uns mit den Autoren in Verbindung setzten, wurden wir strikt abgewiesen, und von den Konferenzorganisatoren erhielten wir keine Antwort. In der Praxis sehen viele Forscher solche Situationen und beschließen, sie loszulassen. Aber auf diese Weise verschwinden auch viele Originalbeiträge aus der öffentlichen Darstellung.</p>
<p><strong>Zilliz:</strong> Es klingt, als wäre dies nicht das erste Mal, dass Ihr Team mit dieser Art von Problem konfrontiert wird.</p>
<p><strong>Cheng Long:</strong> Nein, das ist es nicht.</p>
<p>Wir haben schon öfter Fälle erlebt, in denen Unternehmen RaBitQ nehmen, ein paar technische Änderungen vornehmen, ihm einen neuen Namen geben und es dann nur als etwas beschreiben, das von RaBitQ inspiriert wurde.</p>
<p>Deshalb schätze ich die Art und Weise, wie einige Branchenteams, darunter auch Milvus, damit umgehen. Wenn sie RaBitQ verwenden, beschreiben sie es objektiv. Und wenn sie Optimierungen hinzufügen, die über die ursprüngliche Version hinausgehen, erklären sie diese klar als ihren eigenen technischen Beitrag. Damit wird die ursprüngliche Arbeit angemessen gewürdigt und gleichzeitig die technische Stärke des Unternehmens gezeigt.</p>
<p><strong>Zilliz</strong>: Wenn große Unternehmen auf akademischen Arbeiten aufbauen, bieten sie dann in der Regel eine finanzielle Beteiligung oder eine Aufteilung des Nutzens an?</p>
<p><strong>Jianyang Gao:</strong> In den meisten Fällen nicht.</p>
<p>Dennoch haben große Unternehmen einen starken Anreiz, einen technischen Fortschritt als etwas darzustellen, das sie selbst entwickelt haben, und nicht als etwas, das sie von anderen übernommen haben. Jeder möchte, dass Kunden und Investoren die fortschrittlichste Arbeit als das Ergebnis der Innovation des eigenen Teams sehen.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">Was kommt als nächstes für die Vektorquantisierung?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> An welchen Forschungsrichtungen arbeiten Sie derzeit?</p>
<p><strong>Cheng Long:</strong> Ein großer Teil unserer Arbeit wird sich weiterhin auf das Abrufen von Vektoren konzentrieren.</p>
<p>Eine Richtung ist die Kombination von RaBitQ mit verschiedenen Vektor-Retrieval-Indizes, wie IVF und HNSW, so dass das System größere Datenmengen mit geringerer Latenz, höherer Gleichzeitigkeit und geringeren Kosten unterstützen kann. Ich achte auch auf die KV-Cache-Kompression.</p>
<p><strong>Jianyang Gao:</strong> KV-Cache in großen Modellen und Vektorabfrage haben viele der gleichen Eigenschaften, sowohl mathematisch als auch auf Systemebene, da beide mit hochdimensionalen Vektoren arbeiten.</p>
<p>In Zukunft möchte ich mehr darüber nachdenken, wie man mathematische Werkzeuge, einschließlich Ideen aus der hochdimensionalen Wahrscheinlichkeitsrechnung, anwenden kann, um Inferenz und Training zu beschleunigen.</p>
<p><strong>Zilliz:</strong> Wo liegt die Grenze für die Vektorquantisierung als Gebiet? Wie viel Raum bleibt für Verbesserungen?</p>
<p><strong>Cheng Long:</strong> Aus theoretischer Sicht ist die Obergrenze weitgehend in Sicht. RaBitQ ist bereits asymptotisch optimal.</p>
<p>Aber auf der technischen Seite gibt es noch sehr viel Spielraum. Man muss sich immer noch mit den Hardwareeigenschaften, der Datenverteilung, den Latenzbeschränkungen und vielen anderen praktischen Faktoren auseinandersetzen. Genau aus diesem Grund müssen Produktionssysteme in Bereichen wie der <a href="https://milvus.io/docs/architecture_overview.md">Architektur verteilter Vektordatenbanken</a>, der <a href="https://milvus.io/docs/sparse_vector.md">Unterstützung dünn besetzter Vektoren</a>, <a href="https://milvus.io/docs/reranking.md">Reranking-Pipelines</a> und der Auswahl von Metriken in <a href="https://milvus.io/docs/metric.md">Milvus-Distanzmetriken</a> noch sorgfältig bearbeitet werden.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lesen Sie weiter<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie sich eingehender mit der technischen Seite von RaBitQ und seiner Einbindung in Milvus befassen möchten, finden Sie hier die wichtigsten Ressourcen:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ-Dokumentation</a> - Details zur Konfiguration und Anleitung zum Tuning.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Vertiefung der RaBitQ-Integration</a> - wie Milvus RaBitQ in einen Produktionsindex verwandelt hat.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Wie sich die Vektorquantisierung auf die KI-Infrastrukturkosten auswirkt</a> - unsere umfassendere Analyse der TurboQuant-RaBitQ-Diskussion.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 Release Post</a> - wo IVF_RABITQ als echte Milvus-Indexoption ausgeliefert wurde.</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvus-Index erklärt</a> - wie IVF_RABITQ mit anderen Indexoptionen zusammenpasst.</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT-Indizierung</a> und <a href="https://milvus.io/docs/hnsw.md">HNSW-Indizierung</a> - nützliche Grundlinien, wenn Sie Index-Kompromisse vergleichen wollen.</li>
<li><a href="https://milvus.io/docs/schema.md">Schemadesign in Milvus</a> und <a href="https://milvus.io/docs/filtered-search.md">gefilterte Suche</a> - nützlich, wenn Sie RaBitQ nicht isoliert, sondern in einer realen Anwendung evaluieren wollen.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstart</a> und <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Systemdesign</a> - hilfreich, wenn Sie dies in einer Retrieval-Pipeline ausprobieren möchten.</li>
</ul>
<p>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei oder <a href="https://milvus.io/office-hours">buchen Sie eine Milvus-Sprechstunde</a>, wenn Sie Ihren Workload durchsprechen möchten.</p>
<p>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, können Sie <a href="https://cloud.zilliz.com/signup">sich für die Zilliz Cloud anmelden</a> (vollständig verwaltetes Milvus).</p>

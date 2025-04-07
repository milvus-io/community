---
id: what-is-vector-database-and-how-it-works.md
title: Was genau ist eine Vektordatenbank und wie funktioniert sie?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Eine Vektordatenbank speichert, indiziert und durchsucht Vektoreinbettungen,
  die von Modellen des maschinellen Lernens für den schnellen Informationsabruf
  und die Ähnlichkeitssuche erzeugt wurden.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Eine Vektordatenbank indiziert und speichert Vektoreinbettungen für den schnellen Abruf und die Ähnlichkeitssuche und bietet Funktionen wie CRUD-Operationen, Metadatenfilterung und horizontale Skalierung, die speziell für KI-Anwendungen entwickelt wurden.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Einführung: Der Aufstieg von Vektordatenbanken in der KI-Ära<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>In den Anfängen von ImageNet waren 25.000 menschliche Kuratoren erforderlich, um den Datensatz manuell zu beschriften. Diese erschreckende Zahl verdeutlicht eine grundlegende Herausforderung in der KI: Die manuelle Kategorisierung unstrukturierter Daten lässt sich einfach nicht skalieren. Angesichts der Milliarden von Bildern, Videos, Dokumenten und Audiodateien, die täglich erzeugt werden, war ein Paradigmenwechsel in der Art und Weise erforderlich, wie Computer Inhalte verstehen und mit ihnen interagieren.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">Herkömmliche relationale Datenbanksysteme</a> eignen sich hervorragend zur Verwaltung strukturierter Daten mit vordefinierten Formaten und zur Durchführung präziser Suchvorgänge. Im Gegensatz dazu sind Vektordatenbanken auf die Speicherung und den Abruf <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierter Datentypen </a>wie Bilder, Audio, Videos und Textinhalte durch hochdimensionale numerische Darstellungen spezialisiert, die als Vektoreinbettungen bekannt sind. Vektordatenbanken unterstützen <a href="https://zilliz.com/glossary/large-language-models-(llms)">große Sprachmodelle</a>, indem sie eine effiziente Datenabfrage und -verwaltung ermöglichen. Moderne Vektordatenbanken übertreffen herkömmliche Systeme um das 2- bis 10-fache durch hardwarebasierte Optimierung (AVX512, SIMD, GPUs, NVMe-SSDs), hochoptimierte Suchalgorithmen (HNSW, IVF, DiskANN) und spaltenorientiertes Speicherdesign. Ihre Cloud-native, entkoppelte Architektur ermöglicht eine unabhängige Skalierung von Such-, Dateneinfügungs- und Indizierungskomponenten, so dass Systeme effizient Milliarden von Vektoren verarbeiten können und gleichzeitig die Leistung für KI-Anwendungen in Unternehmen wie Salesforce, PayPal, eBay und NVIDIA aufrechterhalten wird.</p>
<p>Dies stellt das dar, was Experten als "semantische Lücke" bezeichnen: Herkömmliche Datenbanken arbeiten mit exakten Übereinstimmungen und vordefinierten Beziehungen, während das menschliche Verständnis von Inhalten nuanciert, kontextabhängig und multidimensional ist. Diese Lücke wird mit den Anforderungen von KI-Anwendungen zunehmend problematisch:</p>
<ul>
<li><p>Suche nach konzeptionellen Ähnlichkeiten statt nach exakten Übereinstimmungen</p></li>
<li><p>Verstehen von kontextuellen Beziehungen zwischen verschiedenen Inhalten</p></li>
<li><p>Erfassen des semantischen Kerns von Informationen über Schlüsselwörter hinaus</p></li>
<li><p>Verarbeitung multimodaler Daten in einem einheitlichen Rahmen</p></li>
</ul>
<p>Vektordatenbanken haben sich als die entscheidende Technologie zur Überbrückung dieser Lücke erwiesen und sind zu einer wesentlichen Komponente der modernen KI-Infrastruktur geworden. Sie verbessern die Leistung von Modellen des maschinellen Lernens, indem sie Aufgaben wie Clustering und Klassifizierung erleichtern.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Verständnis von Vektoreinbettungen: Die Grundlage<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> bilden die entscheidende Brücke über die semantische Kluft. Diese hochdimensionalen numerischen Darstellungen erfassen die semantische Essenz unstrukturierter Daten in einer Form, die Computer effizient verarbeiten können. Moderne Einbettungsmodelle wandeln rohe Inhalte - ob Texte, Bilder oder Audiodaten - in dichte Vektoren um, in denen sich ähnliche Konzepte unabhängig von den Unterschieden auf der Oberfläche im Vektorraum gruppieren.</p>
<p>Richtig konstruierte Einbettungen würden beispielsweise Begriffe wie "Automobil", "Auto" und "Fahrzeug" im Vektorraum nahe beieinander positionieren, obwohl sie unterschiedliche lexikalische Formen haben. Diese Eigenschaft ermöglicht es der <a href="https://zilliz.com/glossary/semantic-search">semantischen Suche</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">Empfehlungssystemen</a> und KI-Anwendungen, Inhalte über den einfachen Mustervergleich hinaus zu verstehen.</p>
<p>Die Leistungsfähigkeit von Einbettungen erstreckt sich auch auf andere Modalitäten. Fortschrittliche Vektordatenbanken unterstützen verschiedene unstrukturierte Datentypen - Text, Bilder, Audio - in einem einheitlichen System und ermöglichen so modalitätsübergreifende Suchen und Beziehungen, die bisher nicht effizient modelliert werden konnten. Diese Fähigkeiten von Vektordatenbanken sind für KI-gesteuerte Technologien wie Chatbots und Bilderkennungssysteme von entscheidender Bedeutung und unterstützen fortschrittliche Anwendungen wie semantische Such- und Empfehlungssysteme.</p>
<p>Das Speichern, Indizieren und Abrufen von Einbettungen in großem Umfang stellt jedoch einzigartige rechnerische Herausforderungen dar, für die herkömmliche Datenbanken nicht konzipiert wurden.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Vektordatenbanken: Zentrale Konzepte<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken stellen einen Paradigmenwechsel in der Art und Weise dar, wie wir unstrukturierte Daten speichern und abfragen. Im Gegensatz zu herkömmlichen relationalen Datenbanksystemen, die sich durch die Verwaltung strukturierter Daten mit vordefinierten Formaten auszeichnen, sind Vektordatenbanken auf die Verarbeitung unstrukturierter Daten durch numerische Vektordarstellungen spezialisiert.</p>
<p>Im Kern sind Vektordatenbanken darauf ausgelegt, ein grundlegendes Problem zu lösen: Sie ermöglichen eine effiziente Ähnlichkeitssuche in riesigen Datensätzen mit unstrukturierten Daten. Sie erreichen dies durch drei Schlüsselkomponenten:</p>
<p><strong>Vektor-Embedding</strong>: Hochdimensionale numerische Darstellungen, die die semantische Bedeutung von unstrukturierten Daten (Text, Bilder, Audio usw.) erfassen</p>
<p><strong>Spezialisierte Indizierung</strong>: Algorithmen, die für hochdimensionale Vektorräume optimiert sind und schnelle Näherungssuchen ermöglichen. Die Vektordatenbank indiziert Vektoren, um die Geschwindigkeit und Effizienz der Ähnlichkeitssuche zu erhöhen, wobei verschiedene ML-Algorithmen zur Erstellung von Indizes auf Vektoreinbettungen verwendet werden.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Abstandsmetriken</strong></a>: Mathematische Funktionen, die die Ähnlichkeit zwischen Vektoren quantifizieren.</p>
<p>Die wichtigste Operation in einer Vektordatenbank ist die <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN-Abfrage (k-nearest neighbors</a> ), die die k Vektoren findet, die einem bestimmten Abfragevektor am ähnlichsten sind. Für groß angelegte Anwendungen werden in diesen Datenbanken in der Regel ANN-Algorithmen ( <a href="https://zilliz.com/glossary/anns">Approximate Nearest Neighbor</a> ) eingesetzt, die einen kleinen Teil der Genauigkeit gegen einen erheblichen Gewinn an Suchgeschwindigkeit eintauschen.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Mathematische Grundlagen der Vektorähnlichkeit</h3><p>Um Vektordatenbanken zu verstehen, muss man die mathematischen Grundlagen der Vektorähnlichkeit begreifen. Hier sind die grundlegenden Konzepte:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Vektorräume und Einbettungen</h3><p>Eine <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">Vektoreinbettung</a> ist ein Array von Gleitkommazahlen fester Länge (mit 100-32.768 Dimensionen!), das unstrukturierte Daten in einem numerischen Format darstellt. Diese Einbettungen positionieren ähnliche Elemente näher beieinander in einem hochdimensionalen Vektorraum.</p>
<p>Zum Beispiel würden die Wörter "König" und "Königin" Vektorrepräsentationen haben, die näher beieinander liegen als eines der beiden zu "Auto" in einem gut trainierten Wort-Einbettungsraum.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Abstandsmetriken</h3><p>Die Wahl der Abstandsmetrik wirkt sich grundlegend darauf aus, wie die Ähnlichkeit berechnet wird. Zu den gängigen Abstandsmetriken gehören:</p>
<ol>
<li><p><strong>Euklidischer Abstand</strong>: Der geradlinige Abstand zwischen zwei Punkten im euklidischen Raum.</p></li>
<li><p><strong>Kosinus-Ähnlichkeit</strong>: Misst den Kosinus des Winkels zwischen zwei Vektoren, wobei der Schwerpunkt auf der Orientierung und nicht auf dem Betrag liegt.</p></li>
<li><p><strong>Punktprodukt</strong>: Gibt bei normierten Vektoren an, wie sehr zwei Vektoren aufeinander ausgerichtet sind.</p></li>
<li><p><strong>Manhattan-Abstand (L1-Norm)</strong>: Summe der absoluten Differenzen zwischen Koordinaten.</p></li>
</ol>
<p>Verschiedene Anwendungsfälle können unterschiedliche Abstandsmetriken erfordern. So eignet sich beispielsweise die Kosinusähnlichkeit häufig gut für Texteinbettungen, während der euklidische Abstand für bestimmte Arten von <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">Bildeinbettungen</a> besser geeignet ist.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Semantische Ähnlichkeit</a> zwischen Vektoren in einem Vektorraum</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>Semantische Ähnlichkeit zwischen Vektoren in einem Vektorraum</span> </span></p>
<p>Das Verständnis dieser mathematischen Grundlagen führt zu einer wichtigen Frage der Implementierung: Fügen Sie doch einfach einen Vektorindex zu einer beliebigen Datenbank hinzu, oder?</p>
<p>Das einfache Hinzufügen eines Vektorindexes zu einer relationalen Datenbank reicht nicht aus, ebenso wenig wie die Verwendung einer eigenständigen <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Vektorindexbibliothek</a>. Vektorindizes bieten zwar die entscheidende Fähigkeit, ähnliche Vektoren effizient zu finden, doch fehlt ihnen die für Produktionsanwendungen erforderliche Infrastruktur:</p>
<ul>
<li><p>Sie bieten keine CRUD-Operationen für die Verwaltung von Vektordaten</p></li>
<li><p>Sie verfügen nicht über Metadatenspeicher- und Filterfunktionen</p></li>
<li><p>Sie bieten keine integrierte Skalierung, Replikation oder Fehlertoleranz</p></li>
<li><p>Sie erfordern eine benutzerdefinierte Infrastruktur für die Datenpersistenz und -verwaltung.</p></li>
</ul>
<p>Vektordatenbanken wurden entwickelt, um diese Einschränkungen zu beseitigen und umfassende Datenverwaltungsfunktionen speziell für Vektoreinbettungen bereitzustellen. Sie kombinieren die semantische Leistung der Vektorsuche mit den operativen Fähigkeiten von Datenbanksystemen.</p>
<p>Im Gegensatz zu herkömmlichen Datenbanken, die mit exakten Übereinstimmungen arbeiten, konzentrieren sich Vektordatenbanken auf die semantische Suche, d. h. auf das Auffinden von Vektoren, die einem Abfragevektor anhand spezifischer Abstandsmetriken am ähnlichsten" sind. Dieser grundlegende Unterschied ist die Grundlage für die einzigartige Architektur und die Algorithmen, die diesen spezialisierten Systemen zugrunde liegen.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">Architektur von Vektordatenbanken: Ein technischer Rahmen<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>Moderne Vektordatenbanken implementieren eine ausgeklügelte, mehrschichtige Architektur, die eine Trennung der einzelnen Bereiche ermöglicht und für Skalierbarkeit und Wartungsfreundlichkeit sorgt. Dieser technische Rahmen geht weit über einfache Suchindizes hinaus, um Systeme zu schaffen, die in der Lage sind, produktive KI-Arbeitslasten zu bewältigen. Vektordatenbanken verarbeiten und rufen Informationen für KI- und ML-Anwendungen ab, nutzen Algorithmen für die ungefähre Suche nach dem nächsten Nachbarn, konvertieren verschiedene Arten von Rohdaten in Vektoren und verwalten verschiedene Datentypen effizient durch semantische Suchen.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">Vierstufige Architektur</h3><p>Eine Produktionsvektordatenbank besteht in der Regel aus vier primären Architekturschichten:</p>
<ol>
<li><p><strong>Speicherschicht</strong>: Verwaltet die dauerhafte Speicherung von Vektordaten und Metadaten, implementiert spezielle Kodierungs- und Komprimierungsstrategien und optimiert die E/A-Muster für den vektorspezifischen Zugriff.</p></li>
<li><p><strong>Index-Schicht</strong>: Verwaltet mehrere Indexierungsalgorithmen, verwaltet deren Erstellung und Aktualisierung und implementiert hardwarespezifische Optimierungen für die Leistung.</p></li>
<li><p><strong>Abfrageschicht</strong>: Verarbeitet eingehende Abfragen, legt Ausführungsstrategien fest, verarbeitet die Ergebnisse und implementiert Caching für wiederholte Abfragen.</p></li>
<li><p><strong>Diensteschicht</strong>: Verwaltet Client-Verbindungen, übernimmt die Weiterleitung von Anfragen, bietet Überwachung und Protokollierung und implementiert Sicherheit und Mandantenfähigkeit.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">Arbeitsablauf der Vektorsuche</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>Vollständiger Arbeitsablauf eines Vektorsuchvorgangs.png</span> </span></p>
<p>Eine typische Vektordatenbankimplementierung folgt diesem Arbeitsablauf:</p>
<ol>
<li><p>Ein maschinelles Lernmodell wandelt unstrukturierte Daten (Text, Bilder, Audio) in Vektoreinbettungen um.</p></li>
<li><p>Diese Vektoreinbettungen werden zusammen mit den relevanten Metadaten in der Datenbank gespeichert.</p></li>
<li><p>Wenn ein Benutzer eine Abfrage durchführt, wird diese mit <em>demselben</em> Modell in eine Vektoreinbettung umgewandelt.</p></li>
<li><p>Die Datenbank vergleicht den Abfragevektor mit den gespeicherten Vektoren unter Verwendung eines Algorithmus der nächsten Nachbarn</p></li>
<li><p>Das System gibt die K relevantesten Ergebnisse auf der Grundlage der Vektorähnlichkeit zurück.</p></li>
<li><p>Bei der optionalen Nachbearbeitung können zusätzliche Filter oder ein Reranking angewendet werden.</p></li>
</ol>
<p>Diese Pipeline ermöglicht eine effiziente semantische Suche in riesigen Sammlungen unstrukturierter Daten, die mit herkömmlichen Datenbankansätzen unmöglich wäre.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">Konsistenz in Vektordatenbanken</h4><p>Die Gewährleistung der Konsistenz in verteilten Vektordatenbanken ist eine Herausforderung, da ein Kompromiss zwischen Leistung und Korrektheit eingegangen werden muss. Während eine eventuelle Konsistenz in großen Systemen üblich ist, sind starke Konsistenzmodelle für geschäftskritische Anwendungen wie Betrugserkennung und Echtzeitempfehlungen erforderlich. Techniken wie quorum-basiertes Schreiben und verteilter Konsens (z. B. <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos) gewährleisten Datenintegrität ohne übermäßige Leistungseinbußen.</p>
<p>Produktionsimplementierungen verwenden eine Shared-Storage-Architektur mit einer Trennung von Speicher- und Rechenleistung. Diese Trennung folgt dem Prinzip der Disaggregation von Daten- und Steuerebene, wobei jede Schicht für eine optimale Ressourcennutzung unabhängig skalierbar ist.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">Verwaltung von Verbindungen, Sicherheit und Mehrbenutzerfähigkeit</h3><p>Da diese Datenbanken in Umgebungen mit mehreren Benutzern und mehreren Mandanten verwendet werden, sind die Sicherung der Daten und die Verwaltung der Zugriffskontrolle entscheidend für die Wahrung der Vertraulichkeit.</p>
<p>Sicherheitsmaßnahmen wie Verschlüsselung (sowohl im Ruhezustand als auch bei der Übertragung) schützen sensible Daten wie Einbettungen und Metadaten. Authentifizierung und Autorisierung stellen sicher, dass nur autorisierte Benutzer auf das System zugreifen können, wobei fein abgestufte Berechtigungen für die Verwaltung des Zugriffs auf bestimmte Daten erforderlich sind.</p>
<p>Die Zugriffskontrolle definiert Rollen und Berechtigungen, um den Datenzugriff einzuschränken. Dies ist besonders wichtig für Datenbanken, die sensible Informationen wie Kundendaten oder proprietäre KI-Modelle speichern.</p>
<p>Mandantenfähigkeit bedeutet, dass die Daten der einzelnen Mandanten isoliert werden, um unbefugten Zugriff zu verhindern und gleichzeitig die gemeinsame Nutzung von Ressourcen zu ermöglichen. Dies wird durch Sharding, Partitionierung oder Sicherheit auf Zeilenebene erreicht, um einen skalierbaren und sicheren Zugriff für verschiedene Teams oder Kunden zu gewährleisten.</p>
<p>Externe Identitäts- und Zugriffsmanagementsysteme (IAM) lassen sich in Vektordatenbanken integrieren, um Sicherheitsrichtlinien durchzusetzen und die Einhaltung von Branchenstandards zu gewährleisten.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">Vorteile von Vektordatenbanken<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken bieten gegenüber herkömmlichen Datenbanken mehrere Vorteile, die sie zur idealen Wahl für den Umgang mit Vektordaten machen. Hier sind einige der wichtigsten Vorteile:</p>
<ol>
<li><p><strong>Effiziente Ähnlichkeitssuche</strong>: Eine der herausragenden Eigenschaften von Vektordatenbanken ist ihre Fähigkeit, effiziente semantische Suchen durchzuführen. Im Gegensatz zu herkömmlichen Datenbanken, die auf exakte Übereinstimmungen angewiesen sind, zeichnen sich Vektordatenbanken durch die Fähigkeit aus, Datenpunkte zu finden, die einem bestimmten Abfragevektor ähnlich sind. Diese Fähigkeit ist entscheidend für Anwendungen wie Empfehlungssysteme, bei denen das Auffinden von Elementen, die den früheren Interaktionen eines Benutzers ähneln, die Benutzererfahrung erheblich verbessern kann.</p></li>
<li><p><strong>Handhabung hochdimensionaler Daten</strong>: Vektordatenbanken sind speziell für die effiziente Verwaltung hochdimensionaler Daten konzipiert. Dadurch eignen sie sich besonders für Anwendungen in den Bereichen natürliche Sprachverarbeitung, <a href="https://zilliz.com/learn/what-is-computer-vision">Computer Vision</a> und Genomik, wo Daten häufig in hochdimensionalen Räumen vorliegen. Durch den Einsatz fortschrittlicher Indizierungs- und Suchalgorithmen können Vektordatenbanken schnell relevante Datenpunkte abrufen, selbst in komplexen, vektoriell eingebetteten Datensätzen.</p></li>
<li><p><strong>Skalierbarkeit</strong>: Skalierbarkeit ist eine wichtige Voraussetzung für moderne KI-Anwendungen, und Vektordatenbanken sind für eine effiziente Skalierung ausgelegt. Ob mit Millionen oder Milliarden von Vektoren, Vektordatenbanken können die wachsenden Anforderungen von KI-Anwendungen durch horizontale Skalierung bewältigen. So wird sichergestellt, dass die Leistung auch bei wachsenden Datenmengen konstant bleibt.</p></li>
<li><p><strong>Flexibel</strong>: Vektordatenbanken bieten eine bemerkenswerte Flexibilität in Bezug auf die Datendarstellung. Sie können verschiedene Datentypen speichern und verwalten, darunter numerische Merkmale, Einbettungen aus Text oder Bildern und sogar komplexe Daten wie Molekularstrukturen. Diese Vielseitigkeit macht Vektordatenbanken zu einem leistungsstarken Werkzeug für ein breites Spektrum von Anwendungen, von der Textanalyse bis zur wissenschaftlichen Forschung.</p></li>
<li><p><strong>Anwendungen in Echtzeit</strong>: Viele Vektordatenbanken sind für Echtzeit- oder echtzeitnahe Abfragen optimiert. Dies ist besonders wichtig für Anwendungen, die schnelle Antworten erfordern, wie z. B. Betrugserkennung, Echtzeitempfehlungen und interaktive KI-Systeme. Die Fähigkeit, schnelle Ähnlichkeitssuchen durchzuführen, gewährleistet, dass diese Anwendungen zeitnahe und relevante Ergebnisse liefern können.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">Anwendungsfälle für Vektordatenbanken<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken werden in einer Vielzahl von Branchen eingesetzt, was ihre Vielseitigkeit und Leistungsfähigkeit unter Beweis stellt. Hier sind einige bemerkenswerte Anwendungsfälle:</p>
<ol>
<li><p><strong>Verarbeitung natürlicher Sprache</strong>: Im Bereich der Verarbeitung natürlicher Sprache (NLP) spielen Vektordatenbanken eine entscheidende Rolle. Sie werden für Aufgaben wie Textklassifizierung, Stimmungsanalyse und Sprachübersetzung verwendet. Durch die Umwandlung von Text in hochdimensionale Vektoreinbettungen ermöglichen Vektordatenbanken eine effiziente Ähnlichkeitssuche und ein semantisches Verständnis, wodurch die Leistung von <a href="https://zilliz.com/learn/7-nlp-models">NLP-Modellen</a> verbessert wird.</p></li>
<li><p><strong>Computer Vision</strong>: Vektordatenbanken werden auch häufig in Computer-Vision-Anwendungen eingesetzt. Aufgaben wie Bilderkennung, <a href="https://zilliz.com/learn/what-is-object-detection">Objekterkennung</a> und Bildsegmentierung profitieren von der Fähigkeit von Vektordatenbanken, hochdimensionale Bildeinbettungen zu verarbeiten. Dies ermöglicht ein schnelles und genaues Auffinden visuell ähnlicher Bilder und macht Vektordatenbanken in Bereichen wie dem autonomen Fahren, der medizinischen Bildgebung und der digitalen Bestandsverwaltung unverzichtbar.</p></li>
<li><p><strong>Genomik</strong>: In der Genomik werden Vektordatenbanken zum Speichern und Analysieren von Gensequenzen, Proteinstrukturen und anderen molekularen Daten verwendet. Die hochdimensionale Natur dieser Daten macht Vektordatenbanken zu einer idealen Wahl für die Verwaltung und Abfrage großer genomischer Datensätze. Forscher können Vektorsuchen durchführen, um genetische Sequenzen mit ähnlichen Mustern zu finden, was bei der Entdeckung genetischer Marker und dem Verständnis komplexer biologischer Prozesse hilfreich ist.</p></li>
<li><p><strong>Empfehlungssysteme</strong>: Vektordatenbanken sind ein Eckpfeiler moderner Empfehlungssysteme. Durch die Speicherung von Benutzerinteraktionen und Objektmerkmalen als Vektoreinbettungen können diese Datenbanken schnell Objekte identifizieren, die denen ähnlich sind, mit denen ein Benutzer zuvor interagiert hat. Diese Fähigkeit erhöht die Genauigkeit und Relevanz von Empfehlungen und verbessert die Zufriedenheit und das Engagement der Nutzer.</p></li>
<li><p><strong>Chatbots und virtuelle Assistenten</strong>: Vektordatenbanken werden in Chatbots und virtuellen Assistenten eingesetzt, um in Echtzeit kontextbezogene Antworten auf Benutzeranfragen zu geben. Durch die Umwandlung von Benutzereingaben in Vektoreinbettungen können diese Systeme Ähnlichkeitssuchen durchführen, um die relevantesten Antworten zu finden. Auf diese Weise können Chatbots und virtuelle Assistenten genauere und kontextbezogene Antworten geben, was das Nutzererlebnis insgesamt verbessert.</p></li>
</ol>
<p>Durch die Nutzung der einzigartigen Fähigkeiten von Vektordatenbanken können Unternehmen in verschiedenen Branchen intelligentere, reaktionsschnellere und skalierbare KI-Anwendungen entwickeln.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">Vektorsuchalgorithmen: Von der Theorie zur Praxis<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken erfordern spezielle <a href="https://zilliz.com/learn/vector-index">Indizierungsalgorithmen</a>, um eine effiziente Ähnlichkeitssuche in hochdimensionalen Räumen zu ermöglichen. Die Wahl des Algorithmus wirkt sich direkt auf die Genauigkeit, Geschwindigkeit, Speichernutzung und Skalierbarkeit aus.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">Graph-basierte Ansätze</h3><p><strong>HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong> erstellt navigierbare Strukturen durch die Verbindung ähnlicher Vektoren, was eine effiziente Durchquerung während der Suche ermöglicht. HNSW begrenzt die maximalen Verbindungen pro Knoten und den Suchumfang, um ein Gleichgewicht zwischen Leistung und Genauigkeit zu erreichen, und ist damit einer der am häufigsten verwendeten Algorithmen für die Vektorähnlichkeitssuche.</p>
<p><strong>Cagra</strong> ist ein graphbasierter Index, der speziell für die GPU-Beschleunigung optimiert wurde. Er konstruiert navigierbare Graphenstrukturen, die sich an GPU-Verarbeitungsmustern orientieren und massiv parallele Vektorvergleiche ermöglichen. Was Cagra besonders effektiv macht, ist seine Fähigkeit, Recall und Leistung durch konfigurierbare Parameter wie Graphengrad und Suchbreite auszugleichen. Die Verwendung von Inferenz-GPUs mit Cagra kann kosteneffizienter sein als teure Trainingshardware und dennoch einen hohen Durchsatz liefern, insbesondere bei großen Vektorsammlungen. Es ist jedoch anzumerken, dass GPU-Indizes wie Cagra die Latenz im Vergleich zu CPU-Indizes nicht unbedingt verringern, es sei denn, sie arbeiten unter hohem Abfragedruck.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">Quantisierungstechniken</h3><p>Bei<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>der Produktquantisierung (PQ)</strong></a> werden hochdimensionale Vektoren in kleinere Untervektoren zerlegt, die jeweils separat quantisiert werden. Dies reduziert den Speicherbedarf erheblich (oft um mehr als 90 %), führt jedoch zu einem gewissen Genauigkeitsverlust.</p>
<p><strong>Die Skalarquantisierung (SQ)</strong> konvertiert 32-Bit-Fließkommazahlen in 8-Bit-Ganzzahlen und reduziert den Speicherbedarf um 75 % bei minimalen Auswirkungen auf die Genauigkeit.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">Indizierung auf der Festplatte: Kosteneffiziente Skalierung</h3><p>Bei großen Vektorsammlungen (mehr als 100 Millionen Vektoren) werden speicherinterne Indizes unerschwinglich teuer. Zum Beispiel würden 100 Millionen 1024-dimensionale Vektoren etwa 400 GB RAM erfordern. Hier bieten Algorithmen zur Indexierung auf der Festplatte wie DiskANN erhebliche Kostenvorteile.</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> basiert auf dem Vamana-Graphenalgorithmus und ermöglicht eine effiziente Vektorsuche, wobei der Großteil des Indexes auf NVMe-SSDs und nicht im RAM gespeichert wird. Dieser Ansatz bietet mehrere Kostenvorteile:</p>
<ul>
<li><p><strong>Geringere Hardwarekosten</strong>: Unternehmen können die Vektorsuche in großem Umfang mit handelsüblicher Hardware und bescheidenen RAM-Konfigurationen einsetzen.</p></li>
<li><p><strong>Geringere Betriebskosten</strong>: Weniger RAM bedeutet geringeren Stromverbrauch und geringere Kühlungskosten in Rechenzentren</p></li>
<li><p><strong>Lineare Kostenskalierung</strong>: Die Speicherkosten skalieren linear mit dem Datenvolumen, während die Leistung relativ stabil bleibt.</p></li>
<li><p><strong>Optimierte I/O-Muster</strong>: Das spezialisierte Design von DiskANN minimiert die Festplattenlesevorgänge durch sorgfältige Graph-Traversal-Strategien</p></li>
</ul>
<p>Der Kompromiss besteht typischerweise in einer bescheidenen Erhöhung der Abfragelatenz (oft nur 2-3 ms) im Vergleich zu reinen In-Memory-Ansätzen, was für viele Anwendungsfälle in der Produktion akzeptabel ist.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">Spezialisierte Index-Typen</h3><p><strong>Binäre Einbettungsindizes</strong> sind spezialisiert auf Computer Vision, Image Fingerprinting und Empfehlungssysteme, bei denen Daten als binäre Merkmale dargestellt werden können. Diese Indizes dienen unterschiedlichen Anwendungsanforderungen. Für die Deduplizierung von Bildern, digitale Wasserzeichen und die Erkennung von Urheberrechten, bei denen ein exakter Abgleich entscheidend ist, bieten optimierte binäre Indizes eine präzise Ähnlichkeitserkennung. Für Empfehlungssysteme mit hohem Durchsatz, inhaltsbasierte Bildabfragen und groß angelegte Merkmalsabgleiche, bei denen die Geschwindigkeit Vorrang vor einer perfekten Wiedererkennung hat, bieten binäre Indizes außergewöhnliche Leistungsvorteile.</p>
<p><strong>Sparse Vector Indexes</strong> sind für Vektoren optimiert, bei denen die meisten Elemente Null sind und es nur wenige Werte gibt, die nicht Null sind. Im Gegensatz zu dichten Vektoren (bei denen die meisten oder alle Dimensionen aussagekräftige Werte enthalten) stellen spärliche Vektoren Daten mit vielen Dimensionen, aber wenigen aktiven Merkmalen effizient dar. Diese Darstellung ist besonders bei der Textverarbeitung üblich, wo ein Dokument möglicherweise nur eine kleine Teilmenge aller möglichen Wörter eines Vokabulars verwendet. Sparse-Vector-Indizes eignen sich hervorragend für Aufgaben der natürlichen Sprachverarbeitung wie semantische Dokumentensuche, Volltextabfragen und Themenmodellierung. Diese Indizes sind besonders wertvoll für die Unternehmenssuche in großen Dokumentensammlungen, für die juristische Dokumentensuche, bei der bestimmte Begriffe und Konzepte effizient gefunden werden müssen, und für akademische Forschungsplattformen, die Millionen von Dokumenten mit spezieller Terminologie indizieren.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">Erweiterte Abfragefunktionen<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Herzstück von Vektordatenbanken ist ihre Fähigkeit, effiziente semantische Suchen durchzuführen. Die Möglichkeiten der Vektorsuche reichen vom einfachen Ähnlichkeitsabgleich bis hin zu fortgeschrittenen Techniken zur Verbesserung von Relevanz und Vielfalt.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">Grundlegende ANN-Suche</h3><p>Die ANN-Suche (Approximate Nearest Neighbor) ist die grundlegende Suchmethode in Vektordatenbanken. Im Gegensatz zur exakten k-Nächste-Nachbarn-Suche (kNN), bei der ein Abfragevektor mit jedem Vektor in der Datenbank verglichen wird, verwendet die ANN-Suche Indizierungsstrukturen, um schnell eine Teilmenge von Vektoren zu identifizieren, die wahrscheinlich am ähnlichsten sind, was die Leistung erheblich verbessert.</p>
<p>Zu den wichtigsten Komponenten der ANN-Suche gehören:</p>
<ul>
<li><p><strong>Abfrage-Vektoren</strong>: Die Vektordarstellung dessen, wonach Sie suchen</p></li>
<li><p><strong>Index-Strukturen</strong>: Vorgefertigte Datenstrukturen, die Vektoren für einen effizienten Abruf organisieren</p></li>
<li><p><strong>Metrische Typen</strong>: Mathematische Funktionen wie Euklidisch (L2), Cosinus oder Inneres Produkt, die die Ähnlichkeit zwischen Vektoren messen</p></li>
<li><p><strong>Top-K-Ergebnisse</strong>: Die angegebene Anzahl der ähnlichsten Vektoren, die zurückgegeben werden</p></li>
</ul>
<p>Vektordatenbanken bieten Optimierungen zur Verbesserung der Sucheffizienz:</p>
<ul>
<li><p><strong>Bulk-Vektorsuche</strong>: Parallele Suche mit mehreren Abfragevektoren</p></li>
<li><p><strong>Partitionierte Suche</strong>: Begrenzung der Suche auf bestimmte Datenpartitionen</p></li>
<li><p><strong>Paginierung</strong>: Verwendung von Limit- und Offset-Parametern zum Abrufen großer Ergebnismengen</p></li>
<li><p><strong>Auswahl der Ausgabefelder</strong>: Steuerung, welche Entitätsfelder mit den Ergebnissen zurückgegeben werden</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">Erweiterte Suchtechniken</h3><h4 id="Range-Search" class="common-anchor-header">Bereichssuche</h4><p>Die Bereichssuche verbessert die Relevanz der Ergebnisse, indem sie die Ergebnisse auf Vektoren beschränkt, deren Ähnlichkeitswerte in einen bestimmten Bereich fallen. Im Gegensatz zur standardmäßigen ANN-Suche, die die ähnlichsten Top-K-Vektoren zurückgibt, definiert die Bereichssuche eine "Ringregion":</p>
<ul>
<li><p>eine äußere Begrenzung (radius), die den maximal zulässigen Abstand festlegt</p></li>
<li><p>eine innere Begrenzung (range_filter), die Vektoren ausschließt, die zu ähnlich sind</p></li>
</ul>
<p>Dieser Ansatz ist besonders nützlich, wenn Sie "ähnliche, aber nicht identische" Elemente finden wollen, wie z. B. Produktempfehlungen, die zwar verwandt sind, aber keine exakten Duplikate dessen sind, was ein Nutzer bereits angesehen hat.</p>
<h4 id="Filtered-Search" class="common-anchor-header">Gefilterte Suche</h4><p>Bei der gefilterten Suche wird die Vektorähnlichkeit mit Metadatenbeschränkungen kombiniert, um die Ergebnisse auf Vektoren einzugrenzen, die bestimmten Kriterien entsprechen. So können Sie zum Beispiel in einem Produktkatalog visuell ähnliche Artikel finden, die Ergebnisse aber auf eine bestimmte Marke oder Preisspanne beschränken.</p>
<p>Hochskalierbare Vektordatenbanken unterstützen zwei Filterungsansätze:</p>
<ul>
<li><p><strong>Standard-Filterung</strong>: Anwendung von Metadatenfiltern vor der Vektorsuche, wodurch der Kandidatenpool erheblich reduziert wird</p></li>
<li><p><strong>Iterative Filterung</strong>: Führt zunächst eine Vektorsuche durch und wendet dann Filter auf jedes Ergebnis an, bis die gewünschte Anzahl von Übereinstimmungen erreicht ist</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">Textabgleich</h4><p>Der Textabgleich ermöglicht eine präzise Dokumentensuche auf der Grundlage bestimmter Begriffe und ergänzt die vektorielle Ähnlichkeitssuche durch exakte Textabgleichsfunktionen. Im Gegensatz zur semantischen Suche, die konzeptionell ähnliche Inhalte findet, konzentriert sich der Textabgleich auf das exakte Vorkommen von Suchbegriffen.</p>
<p>Eine Produktsuche könnte beispielsweise Textabgleiche, um Produkte zu finden, die ausdrücklich "wasserdicht" erwähnen, mit Vektorähnlichkeit kombinieren, um visuell ähnliche Produkte zu finden, wodurch sichergestellt wird, dass sowohl die semantische Relevanz als auch die Anforderungen an bestimmte Merkmale erfüllt werden.</p>
<h4 id="Grouping-Search" class="common-anchor-header">Gruppierungssuche</h4><p>Bei der gruppierenden Suche werden die Ergebnisse nach einem bestimmten Feld zusammengefasst, um die Ergebnisvielfalt zu verbessern. In einer Dokumentensammlung, in der jeder Absatz ein separater Vektor ist, stellt die Gruppierung beispielsweise sicher, dass die Ergebnisse aus verschiedenen Dokumenten stammen und nicht aus mehreren Absätzen desselben Dokuments.</p>
<p>Diese Technik ist nützlich für:</p>
<ul>
<li><p>Systeme zur Dokumentensuche, bei denen die Ergebnisse aus verschiedenen Quellen stammen sollen</p></li>
<li><p>Empfehlungssysteme, die verschiedene Optionen präsentieren müssen</p></li>
<li><p>Suchsysteme, bei denen die Vielfalt der Ergebnisse ebenso wichtig ist wie ihre Ähnlichkeit</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">Hybride Suche</h4><p>Bei der hybriden Suche werden Ergebnisse aus mehreren Vektorfeldern kombiniert, die möglicherweise unterschiedliche Aspekte der Daten darstellen oder unterschiedliche Einbettungsmodelle verwenden. Dies ermöglicht:</p>
<ul>
<li><p><strong>Kombinationen aus dünnen und dichten Vektoren</strong>: Kombination von semantischem Verständnis (dichte Vektoren) und Schlüsselwortabgleich (spärliche Vektoren) für eine umfassendere Textsuche</p></li>
<li><p><strong>Multimodale Suche</strong>: Finden von Übereinstimmungen über verschiedene Datentypen hinweg, z. B. die Suche nach Produkten anhand von Bild- und Texteingaben</p></li>
</ul>
<p>Hybride Suchimplementierungen verwenden ausgeklügelte Reranking-Strategien, um Ergebnisse zu kombinieren:</p>
<ul>
<li><p><strong>Gewichtetes Ranking</strong>: Priorisierung von Ergebnissen aus bestimmten Vektorfeldern</p></li>
<li><p><strong>Reziproke Rangfusion</strong>: Ausgewogene Ergebnisse über alle Vektorfelder hinweg ohne spezifische Gewichtung</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">Volltextsuche</h4><p>Volltextsuchfunktionen in modernen Vektordatenbanken schließen die Lücke zwischen traditioneller Textsuche und Vektorähnlichkeit. Diese Systeme:</p>
<ul>
<li><p>konvertieren Rohtextabfragen automatisch in spärliche Einbettungen</p></li>
<li><p>suchen nach Dokumenten, die bestimmte Begriffe oder Phrasen enthalten</p></li>
<li><p>Rangfolge der Ergebnisse auf der Grundlage von Begriffsrelevanz und semantischer Ähnlichkeit</p></li>
<li><p>Ergänzen die Vektorsuche, indem sie exakte Übereinstimmungen finden, die bei der semantischen Suche möglicherweise übersehen werden</p></li>
</ul>
<p>Dieser hybride Ansatz ist besonders wertvoll für umfassende <a href="https://zilliz.com/learn/what-is-information-retrieval">Informationsabfragesysteme</a>, die sowohl eine präzise Begriffsabstimmung als auch ein semantisches Verständnis benötigen.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">Leistungstechnik: Entscheidende Metriken<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Leistungsoptimierung in Vektordatenbanken erfordert ein Verständnis der wichtigsten Metriken und ihrer Kompromisse.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">Der Kompromiss zwischen Rückruf und Durchsatz</h3><p>Recall misst den Anteil echter nächster Nachbarn unter den gefundenen Ergebnissen. Ein höherer Recall erfordert eine umfangreichere Suche, was den Durchsatz (Abfragen pro Sekunde) verringert. Produktionssysteme balancieren diese Metriken auf der Grundlage der Anwendungsanforderungen aus, wobei je nach Anwendungsfall in der Regel eine Wiederauffindbarkeit von 80-99 % angestrebt wird.</p>
<p>Bei der Bewertung der Leistung von Vektordatenbanken liefern standardisierte Benchmarking-Umgebungen wie ANN-Benchmarks wertvolle Vergleichsdaten. Diese Tools messen kritische Metriken, darunter:</p>
<ul>
<li><p>Suchaufruf: Der Anteil der Suchanfragen, für die echte nächste Nachbarn unter den zurückgegebenen Ergebnissen gefunden werden</p></li>
<li><p>Abfragen pro Sekunde (QPS): Die Geschwindigkeit, mit der die Datenbank Abfragen unter standardisierten Bedingungen verarbeitet</p></li>
<li><p>Leistung bei verschiedenen Datensatzgrößen und -dimensionen</p></li>
</ul>
<p>Eine Alternative ist ein Open-Source-Benchmark-System namens <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>. VectorDBBench ist ein <a href="https://github.com/zilliztech/VectorDBBench">Open-Source-Benchmarking-Tool</a>, das entwickelt wurde, um die Leistung gängiger Vektordatenbanken wie Milvus und Zilliz Cloud anhand ihrer eigenen Datensätze zu bewerten und zu vergleichen. Außerdem hilft es Entwicklern bei der Auswahl der am besten geeigneten Vektordatenbank für ihre Anwendungsfälle.</p>
<p>Diese Benchmarks ermöglichen es Unternehmen, die für ihre spezifischen Anforderungen am besten geeignete Vektordatenbank-Implementierung zu ermitteln, wobei das Gleichgewicht zwischen Genauigkeit, Geschwindigkeit und Skalierbarkeit berücksichtigt wird.</p>
<h3 id="Memory-Management" class="common-anchor-header">Speicherverwaltung</h3><p>Durch eine effiziente Speicherverwaltung können Vektordatenbanken auf Milliarden von Vektoren skaliert werden, wobei die Leistung erhalten bleibt:</p>
<ul>
<li><p><strong>Dynamische Zuweisung</strong> passt die Speichernutzung auf der Grundlage der Arbeitslastcharakteristik an.</p></li>
<li><p><strong>Caching-Richtlinien</strong> bewahren häufig aufgerufene Vektoren im Speicher</p></li>
<li><p><strong>Vektorkomprimierungstechniken</strong> reduzieren die Speicheranforderungen erheblich</p></li>
</ul>
<p>Für Datensätze, die die Speicherkapazität überschreiten, bieten festplattenbasierte Lösungen eine entscheidende Fähigkeit. Diese Algorithmen optimieren E/A-Muster für NVMe-SSDs durch Techniken wie Balkensuche und graphbasierte Navigation.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">Erweiterte Filterung und hybride Suche</h3><p>Vektordatenbanken kombinieren semantische Ähnlichkeit mit herkömmlicher Filterung, um leistungsstarke Abfragemöglichkeiten zu schaffen:</p>
<ul>
<li><p>Die<strong>Vorfilterung</strong> wendet Metadatenbeschränkungen vor der Vektorsuche an und reduziert die Kandidatenmenge für den Ähnlichkeitsvergleich.</p></li>
<li><p><strong>Post-Filtering</strong> führt zuerst die Vektorsuche aus und wendet dann Filter auf die Ergebnisse an</p></li>
<li><p><strong>Metadaten-Indizierung</strong> verbessert die Filterleistung durch spezialisierte Indizes für verschiedene Datentypen</p></li>
</ul>
<p>Leistungsstarke Vektordatenbanken unterstützen komplexe Abfragemuster, die mehrere Vektorfelder mit skalaren Beschränkungen kombinieren. Multi-Vektor-Abfragen finden Entitäten, die mehreren Referenzpunkten gleichzeitig ähnlich sind, während negative Vektor-Abfragen Vektoren ausschließen, die bestimmten Beispielen ähnlich sind.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">Skalierung von Vektordatenbanken in der Produktion<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken erfordern durchdachte Einsatzstrategien, um eine optimale Leistung in verschiedenen Größenordnungen zu gewährleisten:</p>
<ul>
<li><p><strong>Einsätze in kleinem Maßstab</strong> (Millionen von Vektoren) können auf einem einzigen Rechner mit ausreichendem Speicherplatz effektiv betrieben werden.</p></li>
<li><p><strong>Mittelgroße Bereitstellungen</strong> (zehn bis hunderte von Millionen) profitieren von vertikaler Skalierung mit Instanzen mit hohem Arbeitsspeicher und SSD-Speicher</p></li>
<li><p><strong>Bereitstellungen im Milliardenbereich</strong> erfordern eine horizontale Skalierung über mehrere Knoten mit spezialisierten Rollen</p></li>
</ul>
<p>Sharding und Replikation bilden die Grundlage einer skalierbaren Vektordatenbankarchitektur:</p>
<ul>
<li><p><strong>Horizontales Sharding</strong> teilt Sammlungen über mehrere Knoten auf</p></li>
<li><p><strong>Die Replikation</strong> erstellt redundante Kopien von Daten, die sowohl die Fehlertoleranz als auch den Abfragedurchsatz verbessern.</p></li>
</ul>
<p>Moderne Systeme passen die Replikationsfaktoren dynamisch auf der Grundlage von Abfragemustern und Zuverlässigkeitsanforderungen an.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">Auswirkungen in der realen Welt<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Flexibilität von hochleistungsfähigen Vektordatenbanken zeigt sich in ihren Einsatzmöglichkeiten. Die Systeme können in einem breiten Spektrum von Umgebungen eingesetzt werden, von leichtgewichtigen Installationen auf Laptops für Prototypen bis hin zu massiven verteilten Clustern, die Dutzende von Milliarden Vektoren verwalten. Diese Skalierbarkeit hat es Unternehmen ermöglicht, vom Konzept zur Produktion überzugehen, ohne die Datenbanktechnologie zu wechseln.</p>
<p>Unternehmen wie Salesforce, PayPal, eBay, NVIDIA, IBM und Airbnb verlassen sich jetzt auf Vektordatenbanken wie die Open-Source-Datenbank <a href="https://milvus.io/">Milvus</a>, um KI-Anwendungen in großem Maßstab zu betreiben. Diese Implementierungen umfassen verschiedene Anwendungsfälle - von ausgefeilten Produktempfehlungssystemen über Content-Moderation und Betrugserkennung bis hin zur Automatisierung des Kundensupports - die alle auf der Grundlage der Vektorsuche aufbauen.</p>
<p>In den letzten Jahren haben sich Vektordatenbanken als unverzichtbar erwiesen, wenn es darum geht, das Problem der Halluzinationen in LLMs zu lösen, indem sie domänenspezifische, aktuelle oder vertrauliche Daten bereitstellen. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> speichert zum Beispiel spezialisierte Daten als Vektoreinbettungen. Wenn ein Benutzer eine Frage stellt, wandelt sie die Anfrage in Vektoren um, führt eine ANN-Suche nach den relevantesten Ergebnissen durch und kombiniert diese mit der ursprünglichen Frage, um einen umfassenden Kontext für die großen Sprachmodelle zu schaffen. Dieser Rahmen dient als Grundlage für die Entwicklung zuverlässiger LLM-gestützter Anwendungen, die genauere und kontextrelevante Antworten liefern.</p>
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
    </button></h2><p>Das Aufkommen von Vektordatenbanken stellt mehr als nur eine neue Technologie dar - es bedeutet einen grundlegenden Wandel in der Art und Weise, wie wir das Datenmanagement für KI-Anwendungen angehen. Durch die Überbrückung der Kluft zwischen unstrukturierten Daten und Computersystemen sind Vektordatenbanken zu einer wesentlichen Komponente der modernen KI-Infrastruktur geworden und ermöglichen Anwendungen, die Informationen auf zunehmend menschenähnliche Weise verstehen und verarbeiten.</p>
<p>Zu den wichtigsten Vorteilen von Vektordatenbanken gegenüber herkömmlichen Datenbanksystemen gehören:</p>
<ul>
<li><p>Hochdimensionale Suche: Effiziente Ähnlichkeitssuche in hochdimensionalen Vektoren, die beim maschinellen Lernen und bei generativen KI-Anwendungen verwendet werden</p></li>
<li><p>Skalierbarkeit: Horizontale Skalierung für effiziente Speicherung und Abfrage großer Vektorsammlungen</p></li>
<li><p>Flexibilität mit hybrider Suche: Verarbeitung verschiedener Vektordatentypen, einschließlich spärlicher und dichter Vektoren</p></li>
<li><p>Leistung: Deutlich schnellere Vektorähnlichkeitssuche im Vergleich zu herkömmlichen Datenbanken</p></li>
<li><p>Anpassbare Indizierung: Unterstützung für benutzerdefinierte Indizierungsschemata, die für bestimmte Anwendungsfälle und Datentypen optimiert sind</p></li>
</ul>
<p>Da KI-Anwendungen immer ausgefeilter werden, entwickeln sich die Anforderungen an Vektordatenbanken ständig weiter. Moderne Systeme müssen ein Gleichgewicht zwischen Leistung, Genauigkeit, Skalierung und Kosteneffizienz herstellen und sich gleichzeitig nahtlos in das breitere KI-Ökosystem integrieren. Für Unternehmen, die KI in großem Umfang implementieren möchten, ist das Verständnis der Vektordatenbanktechnologie nicht nur eine technische Überlegung, sondern ein strategischer Imperativ.</p>

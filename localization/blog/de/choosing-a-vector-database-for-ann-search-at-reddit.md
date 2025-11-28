---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: Auswahl einer Vektordatenbank für die ANN-Suche bei Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  In diesem Beitrag wird beschrieben, wie das Reddit-Team die am besten
  geeignete Vektordatenbank ausgewählt hat und warum es sich für Milvus
  entschieden hat.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>Dieser Beitrag wurde von Chris Fournie, dem Staff Software Engineer bei Reddit, verfasst und ursprünglich auf</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a><em>veröffentlicht</em> und wird hier mit Genehmigung wiederveröffentlicht.</p>
<p>Im Jahr 2024 verwendeten die Reddit-Teams eine Vielzahl von Lösungen, um die ANN-Vektorsuche (Approximate Nearest Neighbour) durchzuführen. Von der <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI Vector Search</a> von Google und dem Experimentieren mit der <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">ANN-Vektorsuche von Apache Solr</a> für einige größere Datensätze bis hin zur <a href="https://github.com/facebookresearch/faiss">FAISS-Bibliothek</a> von Facebook für kleinere Datensätze (die in vertikal skalierten Seitenwagen gehostet werden). Immer mehr Teams bei Reddit wünschten sich eine breit unterstützte ANN-Vektorsuchlösung, die kostengünstig ist, die gewünschten Suchfunktionen bietet und auf Daten in der Größe von Reddit skaliert werden kann. Um diesen Bedarf zu decken, haben wir 2025 die ideale Vektordatenbank für Reddit-Teams gesucht.</p>
<p>In diesem Beitrag wird der Prozess beschrieben, den wir zur Auswahl der besten Vektordatenbank für die heutigen Anforderungen von Reddit verwendet haben. Er beschreibt weder die beste Vektordatenbank insgesamt noch die wichtigsten funktionalen und nicht-funktionalen Anforderungen für alle Situationen. Es wird beschrieben, worauf Reddit und seine technische Kultur bei der Auswahl einer Vektordatenbank Wert gelegt haben und welche Prioritäten sie gesetzt haben. Dieser Beitrag kann als Inspiration für Ihre eigene Anforderungserhebung und -bewertung dienen, aber jedes Unternehmen hat seine eigene Kultur, seine eigenen Werte und Bedürfnisse.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Evaluierungsprozess<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>Insgesamt waren die Auswahlschritte:</p>
<p>1. Sammeln des Kontexts von Teams</p>
<p>2. Qualitative Bewertung der Lösungen</p>
<p>3. Quantitative Bewertung der Top-Anwärter</p>
<p>4. Endgültige Auswahl</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Sammeln von Kontext von Teams</h3><p>Von Teams, die an einer ANN-Vektorsuche interessiert sind, wurden drei Kontextinformationen gesammelt:</p>
<ul>
<li><p>Funktionale Anforderungen (z. B. Hybride Vektor- und lexikalische Suche? Bereichs-Suchanfragen? Filtern nach Nicht-Vektor-Attributen?)</p></li>
<li><p>Nicht-funktionale Anforderungen (z. B. Unterstützung von 1B-Vektoren? Kann eine P99-Latenzzeit von &lt;100ms erreicht werden?)</p></li>
<li><p>Vektordatenbanken, an denen die Teams bereits interessiert waren</p></li>
</ul>
<p>Die Befragung von Teams nach Anforderungen ist nicht trivial. Viele werden ihre Bedürfnisse so beschreiben, wie sie derzeit ein Problem lösen, und Ihre Herausforderung besteht darin, diese Voreingenommenheit zu verstehen und zu beseitigen.</p>
<p>Ein Beispiel: Ein Team verwendete bereits FAISS für die ANN-Vektorsuche und gab an, dass die neue Lösung effizient 10.000 Ergebnisse pro Suchaufruf liefern muss. Nach weiterer Diskussion stellte sich heraus, dass der Grund für die 10K Ergebnisse darin lag, dass sie eine Post-hoc-Filterung durchführen mussten und FAISS keine Filterung von ANN-Ergebnissen zur Abfragezeit bietet. Ihr eigentliches Problem bestand darin, dass sie eine Filterung brauchten, so dass jede Lösung, die eine effiziente Filterung bot, ausreichte, und die Rückgabe von 10K Ergebnissen war lediglich ein Workaround, der erforderlich war, um ihre Trefferquote zu verbessern. Idealerweise würden sie gerne die gesamte Sammlung vorfiltern, bevor sie die nächsten Nachbarn finden.</p>
<p>Die Frage nach den Vektordatenbanken, die die Teams bereits nutzen oder an denen sie interessiert sind, war ebenfalls sehr hilfreich. Wenn mindestens ein Team seine aktuelle Lösung positiv bewertet, ist dies ein Zeichen dafür, dass die Vektordatenbank eine nützliche Lösung für das gesamte Unternehmen sein könnte. Wenn die Teams nur negative Ansichten über eine Lösung hatten, sollten wir sie nicht als Option in Betracht ziehen. Die Aufnahme von Lösungen, an denen die Teams interessiert waren, war auch eine Möglichkeit sicherzustellen, dass sich die Teams in den Prozess einbezogen fühlten, und half uns dabei, eine erste Liste führender Kandidaten für die Bewertung zu erstellen; es gibt zu viele ANN-Vektorsuchlösungen in neuen und bestehenden Datenbanken, um alle erschöpfend zu testen.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Qualitative Bewertung der Lösungen</h3><p>Ausgehend von der Liste der Lösungen, an denen die Teams interessiert waren, haben wir eine qualitative Bewertung der ANN-Vektorsuchlösung vorgenommen, die unseren Anforderungen am besten entspricht:</p>
<ul>
<li><p>Wir haben jede Lösung untersucht und bewertet, wie gut sie jede Anforderung im Vergleich zur gewichteten Wichtigkeit dieser Anforderung erfüllt.</p></li>
<li><p>Ausschluss von Lösungen auf der Grundlage qualitativer Kriterien und Diskussionen</p></li>
<li><p>Wir wählten die N besten Lösungen aus, um sie quantitativ zu testen.</p></li>
</ul>
<p>Unsere Ausgangsliste der ANN-Vektorsuchlösungen umfasste:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Offene Suche</p></li>
<li><p>Pgvector (verwendet bereits Postgres als RDBMS)</p></li>
<li><p>Redis (wird bereits als KV-Speicher und Cache verwendet)</p></li>
<li><p>Cassandra (wird bereits für die nicht-ANN-Suche verwendet)</p></li>
<li><p>Solr (bereits für lexikalische Suche verwendet und mit Vektorsuche experimentiert)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (bereits für die ANN-Vektorsuche verwendet)</p></li>
</ul>
<p>Wir haben dann alle funktionalen und nicht-funktionalen Anforderungen, die von den Teams genannt wurden, plus einige weitere Einschränkungen, die unsere technischen Werte und Ziele repräsentieren, in eine Tabelle eingetragen und gewichtet, wie wichtig sie waren (von 1 bis 3; siehe die verkürzte Tabelle unten).</p>
<p>Für jede Lösung, die wir verglichen, bewerteten wir (auf einer Skala von 0 bis 3), wie gut jedes System diese Anforderung erfüllte (wie in der Tabelle unten dargestellt). Da diese Bewertung etwas subjektiv war, wählten wir ein System aus und gaben Beispiele für die Bewertung mit schriftlicher Begründung an, auf die sich die Prüfer beziehen sollten. Außerdem gaben wir die folgenden Hinweise für die Vergabe der einzelnen Punktwerte: Vergeben Sie diesen Wert, wenn:</p>
<ul>
<li><p>0: Keine Unterstützung/Nachweis der Unterstützung von Anforderungen</p></li>
<li><p>1: Einfache oder unzureichende Unterstützung der Anforderung</p></li>
<li><p>2: Die Anforderung wird angemessen unterstützt</p></li>
<li><p>3: Robuste Anforderungsunterstützung, die über vergleichbare Lösungen hinausgeht</p></li>
</ul>
<p>Anschließend wurde eine Gesamtbewertung für jede Lösung erstellt, indem die Summe des Produkts aus der Anforderungsbewertung einer Lösung und der Wichtigkeit dieser Anforderung gebildet wurde (z. B. erhielt Qdrant die Punktzahl 3 für die Neueinstufung/Kombination von Anforderungen, die eine Wichtigkeit von 2 haben, also 3 x 2 = 6; wiederholen Sie dies für alle Zeilen und addieren Sie die Werte). Am Ende erhalten wir eine Gesamtpunktzahl, die als Grundlage für die Einstufung und Diskussion von Lösungen und der wichtigsten Anforderungen dienen kann (beachten Sie, dass die Punktzahl nicht für eine endgültige Entscheidung, sondern als Diskussionsgrundlage verwendet wird).</p>
<p><strong><em>Anmerkung des Herausgebers:</em></strong> <em>Diese Bewertung basierte auf Milvus 2.4. Inzwischen haben wir Milvus 2.5 und</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>2.6</em></a> <em>auf den Markt gebracht</em><em>, und Milvus 3.0 steht vor der Tür, so dass einige Zahlen möglicherweise nicht mehr aktuell sind. Dennoch bietet der Vergleich immer noch gute Einblicke und ist nach wie vor sehr hilfreich.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Kategorie</strong></td><td><strong>Wichtigkeit</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Kassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Art der Suche</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Hybride Suche</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Schlüsselwortsuche</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Näherungsweise NN-Suche</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Bereich Suche</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Umreihung/Punktekombination</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Indizierungsmethode</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Unterstützt mehrere Indizierungsmethoden</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Quantisierung</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Lokalitätssensitives Hashing (LSH)</td><td>1</td><td>0</td><td>0Hinweis: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 unterstützt dies. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Daten</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Andere Vektortypen als Float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Metadatenattribute auf Vektoren (unterstützt mehrere Attribute, eine große Datensatzgröße usw.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Filteroptionen für Metadaten (kann nach Metadaten filtern, hat Vor-/Nachfilterung)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Metadaten-Attribut-Datentypen (robustes Schema, z. B. bool, int, string, json, arrays)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Grenzwerte für Metadatenattribute (Bereichsabfragen, z. B. 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversität der Ergebnisse nach Attributen (z. B. nicht mehr als N Ergebnisse aus jedem Subreddit in einer Antwort)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Maßstab</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hunderte von Millionen Vektorindex</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Milliarden-Vektor-Index</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Stützvektoren mit mindestens 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Stützvektoren größer als 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latenzzeit 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latenz &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99,9% Verfügbarkeit Abruf</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99,99% Verfügbarkeit Indizierung/Speicherung</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Speicherbetrieb</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hostfähig in AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-Region</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Upgrades ohne Ausfallzeiten</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Multi-Cloud</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>APIs/Bibliotheken</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Go Bibliothek</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Java-Bibliothek</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Andere Sprachen (C++, Ruby, usw.)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Laufzeit-Operationen</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Prometheus-Metriken</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Grundlegende DB-Operationen</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upserts</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Kubernetes-Betreiber</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Seitennummerierung der Ergebnisse</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Einbettung der Suche nach der ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Rückgabe der Einbettungen mit Kandidaten-ID und Kandidaten-Bewertungen</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Vom Benutzer bereitgestellte ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>In der Lage, in einem großen Batch-Kontext zu suchen</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Backups / Snapshots: unterstützt die Möglichkeit, Backups der gesamten Datenbank zu erstellen</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Effiziente Unterstützung großer Indizes (Unterscheidung zwischen kalter und heißer Speicherung)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Unterstützung/Gemeinschaft</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Neutralität des Anbieters</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Robuste Api-Unterstützung</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Unterstützung durch den Anbieter</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Gemeinschaftliche Geschwindigkeit</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Produktion Benutzerbasis</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Gemeinschaftsgefühl</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Github-Sterne</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Konfiguration</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Geheimnisse Handhabung</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Quelle</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Offene Quelle</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Sprache</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Freigaben</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Vorgelagerte Prüfung</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Verfügbarkeit der Dokumentation</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Kosten</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Kosteneffektiv</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Leistung</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Unterstützung für die Optimierung der Ressourcenauslastung von CPU, Speicher und Festplatte</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Sharding mit mehreren Knoten (Pod)</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>die Möglichkeit haben, das System so einzustellen, dass ein Gleichgewicht zwischen Latenz und Durchsatz besteht</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Benutzerdefinierte Partitionierung (Schreiben)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-Tenant</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Unterteilung</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replikation</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redundanz</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Automatische Ausfallsicherung</td><td>3</td><td>2</td><td>0 Hinweis: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 unterstützt dies. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Lastausgleich</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>GPU-Unterstützung</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Kassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Gesamtbewertung der Lösung</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>Wir diskutierten die Gesamt- und Anforderungsbewertungen der verschiedenen Systeme und versuchten zu verstehen, ob wir die Wichtigkeit der Anforderungen angemessen gewichtet hatten und ob einige Anforderungen so wichtig waren, dass sie als Kernanforderungen betrachtet werden sollten. Eine dieser Anforderungen war die Frage, ob die Lösung quelloffen war oder nicht, denn wir wünschten uns eine Lösung, an der wir uns beteiligen, zu der wir beitragen und kleine Probleme schnell beheben konnten, wenn sie in unserem Umfang auftraten. Die Mitwirkung an und die Verwendung von Open-Source-Software ist ein wichtiger Bestandteil der Reddit-Entwicklungskultur. Damit schieden die nur gehosteten Lösungen (Vertex AI, Pinecone) aus unserer Überlegung aus.</p>
<p>Im Laufe der Gespräche stellten wir fest, dass einige andere Schlüsselanforderungen für uns von überragender Bedeutung waren:</p>
<ul>
<li><p>Skalierbarkeit und Zuverlässigkeit: Wir wollten Beweise sehen, dass andere Unternehmen die Lösung mit 100 Mio. oder sogar 1 Mrd. Vektoren betreiben.</p></li>
<li><p>Gemeinschaft: Wir wollten eine Lösung mit einer gesunden Community, die in diesem sich schnell entwickelnden Bereich eine große Dynamik aufweist</p></li>
<li><p>Ausdrucksstarke Metadatentypen und Filterung, um mehr unserer Anwendungsfälle zu ermöglichen (Filterung nach Datum, Booleschen Werten usw.)</p></li>
<li><p>Unterstützung für mehrere Indextypen (nicht nur HNSW oder DiskANN), um die Leistung für unsere vielen einzigartigen Anwendungsfälle zu verbessern</p></li>
</ul>
<p>Als Ergebnis unserer Diskussionen und der Festlegung der wichtigsten Anforderungen entschieden wir uns für einen quantitativen Test (in dieser Reihenfolge):</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, und</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Leider erfordern Entscheidungen wie diese Zeit und Ressourcen, und keine Organisation verfügt über unbegrenzte Mengen von beidem. In Anbetracht unseres Budgets beschlossen wir, Qdrant und Milvus zu testen und Vespa und Weviate als Stretch Goal zu betrachten.</p>
<p>Qdrant gegen Milvus war auch ein interessanter Test zweier unterschiedlicher Architekturen:</p>
<ul>
<li><p><strong>Qdrant:</strong> Homogene Knotentypen, die alle ANN-Vektor-Datenbankoperationen durchführen</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">Heterogene Knotentypen</a> (Milvus; einer für Abfragen, ein anderer für die Indizierung, ein weiterer für den Dateningest, ein Proxy usw.)</p></li>
</ul>
<p>Welches war einfach einzurichten (ein Test der Dokumentation)? Welche war einfach auszuführen (ein Test der Ausfallsicherheitsfunktionen und des Feinschliffs)? Und welche Lösung eignet sich am besten für die Anwendungsfälle und den Umfang, die uns wichtig waren? Diese Fragen versuchten wir zu beantworten, als wir die Lösungen quantitativ verglichen.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Quantitative Bewertung der Top-Anwärter</h3><p>Wir wollten besser verstehen, wie skalierbar die einzelnen Lösungen sind, und dabei erfahren, wie die Einrichtung, Konfiguration, Wartung und Ausführung der einzelnen Lösungen im großen Maßstab aussehen würde. Dazu sammelten wir drei Datensätze mit Dokumenten- und Abfragevektoren für drei verschiedene Anwendungsfälle, richteten jede Lösung mit ähnlichen Ressourcen innerhalb von Kubernetes ein, luden Dokumente in jede Lösung und schickten identische Abfragelasten unter Verwendung von <a href="https://k6.io/">Grafanas K6</a> mit einem Ramping Arrival Rate Executor, um die Systeme aufzuwärmen, bevor sie dann einen Zieldurchsatz (z. B. 100 QPS) erreichten.</p>
<p>Wir testeten den Durchsatz, die Belastungsgrenze jeder Lösung, das Verhältnis zwischen Durchsatz und Latenz und wie sie auf den Verlust von Knoten unter Last reagieren (Fehlerrate, Auswirkungen auf die Latenz usw.). Von besonderem Interesse war die <strong>Auswirkung der Filterung auf die Latenz</strong>. Wir führten auch einfache Ja/Nein-Tests durch, um zu überprüfen, ob eine in der Dokumentation beschriebene Funktion auch wirklich so funktioniert (z. B. Upserts, Löschen, Get by ID, Benutzerverwaltung usw.) und um die Ergonomie dieser APIs zu testen.</p>
<p><strong>Die Tests wurden mit Milvus v2.4 und Qdrant v1.12 durchgeführt.</strong> Aus Zeitgründen haben wir nicht alle Arten von Indexeinstellungen erschöpfend abgestimmt oder getestet; bei jeder Lösung wurden ähnliche Einstellungen verwendet, mit einer Tendenz zu hohem ANN-Recall, und die Tests konzentrierten sich auf die Leistung von HNSW-Indizes. Auch die CPU- und Speicherressourcen waren bei jeder Lösung ähnlich.</p>
<p>Bei unseren Experimenten stellten wir einige interessante Unterschiede zwischen den beiden Lösungen fest. In den folgenden Experimenten hatte jede Lösung etwa 340M Reddit-Post-Vektoren mit jeweils 384 Dimensionen, für HNSW, M=16 und efConstruction=100.</p>
<p>In einem Experiment stellten wir fest, dass bei gleichem Abfragedurchsatz (100 QPS ohne gleichzeitige Ingestion) das Hinzufügen von Filtern die Latenz von Milvus stärker beeinflusste als die von Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abfragelatenz mit Filterung</p>
<p>Außerdem stellten wir fest, dass die Interaktion zwischen Ingestion und Abfragelast bei Qdrant viel stärker war als bei Milvus (siehe unten bei konstantem Durchsatz). Dies ist wahrscheinlich auf die Architektur zurückzuführen: Milvus verteilt einen Großteil des Ingestion-Verkehrs auf verschiedene Knotentypen, während Qdrant sowohl Ingestion- als auch Query-Verkehr über dieselben Knoten abwickelt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abfragelatenz bei 100 QPS während des Ingests</p>
<p>Beim Testen der Ergebnisvielfalt nach Attributen (z. B. nicht mehr als N Ergebnisse aus jedem Subreddit in einer Antwort) haben wir festgestellt, dass Milvus bei gleichem Durchsatz eine schlechtere Latenz aufweist als Qdrant (bei 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Post-Query-Latenz mit Ergebnisvielfalt</p>
<p>Wir wollten auch sehen, wie effektiv jede Lösung skaliert, wenn mehr Datenreplikate hinzugefügt werden (d. h. der Replikationsfaktor RF wurde von 1 auf 2 erhöht). Zunächst konnte Qdrant bei RF=1 eine zufriedenstellende Latenz bei höherem Durchsatz als Milvus erzielen (höhere QPS werden nicht angezeigt, da die Tests nicht fehlerfrei abgeschlossen wurden).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant liefert RF=1 Latenzzeit bei unterschiedlichem Durchsatz</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus erreicht RF=1 Latenzzeit bei unterschiedlichem Durchsatz</p>
<p>Bei Erhöhung des Replikationsfaktors verbesserte sich die p99-Latenz von Qdrant, aber Milvus konnte einen höheren Durchsatz als Qdrant bei akzeptabler Latenz aufrechterhalten (Qdrant 400 QPS nicht gezeigt, da der Test aufgrund hoher Latenz und Fehler nicht abgeschlossen werden konnte).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus erreicht eine Latenz von RF=2 bei unterschiedlichen Durchsätzen</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant zeigt RF=2-Latenz bei unterschiedlichem Durchsatz</p>
<p>Aus Zeitgründen hatten wir nicht genug Zeit, um die ANN-Recall-Werte zwischen Lösungen auf unseren Datensätzen zu vergleichen, aber wir haben die ANN-Recall-Messungen für Lösungen berücksichtigt, die von <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> auf öffentlich verfügbaren Datensätzen bereitgestellt wurden.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Endgültige Auswahl</h3><p><strong>In Bezug auf die Leistung</strong> schien Qdrant ohne große Anpassungen und nur unter Verwendung von HNSW in vielen Tests eine bessere rohe Latenzzeit zu haben als Milvus. Milvus schien jedoch mit zunehmender Replikation besser skalieren zu können und wies aufgrund seiner Architektur mit mehreren Knoten eine bessere Isolierung zwischen Ingestion und Abfragelast auf.</p>
<p>Trotz<strong>der</strong> Komplexität der Milvus-Architektur (mehrere Knotentypen, ein externes Write-Ahead-Protokoll wie Kafka und ein Metadatenspeicher wie etcd) war es für uns einfacher, Milvus zu debuggen und zu reparieren als Qdrant, wenn eine der beiden Lösungen in einen schlechten Zustand geriet. Milvus verfügt außerdem über einen automatischen Ausgleich, wenn der Replikationsfaktor einer Sammlung erhöht wird, wohingegen bei der Open-Source-Lösung Qdrant der Replikationsfaktor nur durch manuelles Erstellen oder Löschen von Shards erhöht werden kann (eine Funktion, die wir selbst hätten entwickeln oder die Nicht-Open-Source-Version verwenden müssen).</p>
<p>Milvus ist eine eher "Reddit-förmige" Technologie als Qdrant; sie weist mehr Ähnlichkeiten mit dem Rest unseres Tech-Stacks auf. Milvus ist in Golang geschrieben, unserer bevorzugten Backend-Programmiersprache, und daher für uns einfacher zu unterstützen als Qdrant, das in Rust geschrieben ist. Milvus hat im Vergleich zu Qdrant eine hervorragende Projektgeschwindigkeit für sein Open-Source-Angebot und erfüllte mehr unserer Hauptanforderungen.</p>
<p>Letztendlich erfüllten beide Lösungen die meisten unserer Anforderungen, und in einigen Fällen hatte Qdrant einen Leistungsvorteil, aber wir hatten das Gefühl, dass wir Milvus weiter skalieren konnten, dass wir uns beim Betrieb wohler fühlten und dass es besser zu unserer Organisation passte als Qdrant. Wir wünschten, wir hätten mehr Zeit gehabt, um Vespa und Weaviate zu testen, aber auch sie wurden möglicherweise aufgrund ihrer organisatorischen Eignung (Vespa ist Java-basiert) und ihrer Architektur (Weaviate ist ein Single-Node-System wie Qdrant) ausgewählt.</p>
<h2 id="Key-takeaways" class="common-anchor-header">Die wichtigsten Erkenntnisse<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Hinterfragen Sie die Anforderungen, die Sie erhalten haben, und versuchen Sie, bestehende Lösungsvorurteile zu beseitigen.</p></li>
<li><p>Bewerten Sie die in Frage kommenden Lösungen und nutzen Sie diese Ergebnisse, um die Diskussion über die wesentlichen Anforderungen zu führen, nicht um sie als das A und O zu betrachten.</p></li>
<li><p>Bewerten Sie die Lösungen quantitativ, aber achten Sie dabei auch darauf, wie es ist, mit der Lösung zu arbeiten.</p></li>
<li><p>Entscheiden Sie sich für die Lösung, die unter den Gesichtspunkten Wartung, Kosten, Benutzerfreundlichkeit und Leistung am besten in Ihr Unternehmen passt, und nicht nur, weil eine Lösung am besten funktioniert.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Danksagung<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Evaluierungsarbeit wurde von Ben Kochie, Charles Njoroge, Amit Kumar und mir durchgeführt. Unser Dank gilt auch anderen, die zu dieser Arbeit beigetragen haben, darunter Annie Yang, Konrad Reiche, Sabrina Kong und Andrew Johnson, für die qualitative Lösungsforschung.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Anmerkungen der Redaktion<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir möchten dem Reddit-Engineering-Team ein aufrichtiges Dankeschön aussprechen - nicht nur dafür, dass sie Milvus für ihre Vektorsuch-Workloads ausgewählt haben, sondern auch dafür, dass sie sich die Zeit genommen haben, eine so detaillierte und faire Bewertung zu veröffentlichen. Es ist selten, dass man ein derartiges Maß an Transparenz beim Vergleich von Datenbanken durch echte Entwicklungsteams sieht, und ihr Bericht wird für jeden in der Milvus-Gemeinschaft (und darüber hinaus) hilfreich sein, der versucht, sich einen Überblick über die wachsende Landschaft der Vektordatenbanken zu verschaffen.</p>
<p>Wie Chris in seinem Beitrag erwähnt, gibt es nicht die eine "beste" Vektordatenbank. Entscheidend ist, ob ein System zu Ihrer Arbeitsbelastung, Ihren Einschränkungen und Ihrer Arbeitsphilosophie passt. Der Vergleich von Reddit spiegelt diese Realität gut wider. Milvus schneidet nicht in jeder Kategorie am besten ab, was angesichts der Kompromisse zwischen den verschiedenen Datenmodellen und Leistungszielen durchaus zu erwarten ist.</p>
<p>Eine Sache sollte klargestellt werden: Bei der Bewertung auf Reddit wurde <strong>Milvus 2.4</strong> verwendet, das zu diesem Zeitpunkt die stabile Version war. Einige Funktionen - wie LSH und verschiedene Indexoptimierungen - existierten entweder noch nicht oder waren in 2.4 noch nicht ausgereift, so dass einige Bewertungen natürlich diese ältere Basis widerspiegeln. Seitdem haben wir Milvus 2.5 und dann <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> veröffentlicht, und es ist ein ganz anderes System in Bezug auf Leistung, Effizienz und Flexibilität. Die Reaktion der Community war sehr positiv, und viele Teams haben bereits aufgerüstet.</p>
<p><strong>Hier ein kurzer Blick auf die Neuerungen in Milvus 2.6:</strong></p>
<ul>
<li><p>Bis zu <strong>72 % geringere Speichernutzung</strong> und <strong>4× schnellere Abfragen</strong> mit RaBitQ 1-Bit-Quantisierung</p></li>
<li><p><strong>50% Kostenreduzierung</strong> mit intelligentem Tiered Storage</p></li>
<li><p><strong>4× schnellere BM25-Volltextsuche</strong> im Vergleich zu Elasticsearch</p></li>
<li><p><strong>100× schnellere JSON-Filterung</strong> mit dem neuen Path Index</p></li>
<li><p>Eine neue Zero-Disk-Architektur für eine frischere Suche bei geringeren Kosten</p></li>
<li><p>Ein einfacherer "Data-in, Data-out"-Workflow für die Einbindung von Pipelines</p></li>
<li><p>Unterstützung für <strong>100K+ Sammlungen</strong> zur Handhabung großer mandantenfähiger Umgebungen</p></li>
</ul>
<p>Wenn Sie eine vollständige Aufschlüsselung wünschen, finden Sie hier ein paar gute Folgeartikel:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Einführung von Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 Versionshinweise: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Real-World Benchmarking für Vektordatenbanken - Milvus Blog</a></p></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>

---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Empfehlen von Inhalten mithilfe der semantischen Vektorsuche
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Erfahren Sie, wie Milvus zum Aufbau eines intelligenten
  Nachrichtenempfehlungssystems innerhalb einer App verwendet wurde.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Aufbau eines intelligenten Nachrichtenempfehlungssystems in der Sohu News App</custom-h1><p>Da <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71 % der Amerikaner</a> ihre Nachrichtenempfehlungen von sozialen Plattformen beziehen, sind personalisierte Inhalte schnell zu einer Art und Weise geworden, wie neue Medien entdeckt werden. Ganz gleich, ob die Nutzer nach bestimmten Themen suchen oder mit empfohlenen Inhalten interagieren, alles, was sie sehen, wird von Algorithmen optimiert, um die Klickraten (CTR), das Engagement und die Relevanz zu verbessern. Sohu ist eine an der NASDAQ notierte chinesische Online-Medien-, Video-, Such- und Spielegruppe. Es nutzte <a href="https://milvus.io/">Milvus</a>, eine von <a href="https://zilliz.com/">Zilliz</a> entwickelte Open-Source-Vektordatenbank, um eine semantische Vektorsuchmaschine in seiner Nachrichten-App zu entwickeln. In diesem Artikel wird erläutert, wie das Unternehmen mithilfe von Nutzerprofilen die personalisierten Inhaltsempfehlungen im Laufe der Zeit verfeinert und so die Nutzererfahrung und das Engagement verbessert hat.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Empfehlen von Inhalten mithilfe der semantischen Vektorsuche<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Benutzerprofile von Sohu News werden aus dem Browserverlauf erstellt und angepasst, wenn die Benutzer nach Nachrichteninhalten suchen und mit diesen interagieren. Das Empfehlungssystem von Sohu nutzt die semantische Vektorsuche, um relevante Nachrichtenartikel zu finden. Das System ermittelt eine Reihe von Schlagwörtern, von denen erwartet wird, dass sie für jeden Nutzer aufgrund seines Surfverhaltens von Interesse sind. Es sucht dann schnell nach relevanten Artikeln und sortiert die Ergebnisse nach Beliebtheit (gemessen an der durchschnittlichen CTR), bevor es sie den Nutzern anbietet.</p>
<p>Allein die New York Times veröffentlicht <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 Artikel</a> pro Tag, was einen Eindruck von der Menge neuer Inhalte vermittelt, die ein effektives Empfehlungssystem verarbeiten können muss. Die Aufnahme großer Mengen von Nachrichten erfordert eine Ähnlichkeitssuche im Millisekundenbereich und die stündliche Zuordnung von Tags zu neuen Inhalten. Sohu hat sich für Milvus entschieden, weil es riesige Datenmengen effizient und genau verarbeitet, den Speicherverbrauch während der Suche reduziert und Hochleistungsimplementierungen unterstützt.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Verstehen des Arbeitsablaufs eines Nachrichtenempfehlungssystems<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Die auf semantischer Vektorsuche basierende Inhaltsempfehlung von Sohu basiert auf dem Deep Structured Semantic Model (DSSM), das zwei neuronale Netze verwendet, um Benutzeranfragen und Nachrichtenartikel als Vektoren darzustellen. Das Modell berechnet die Kosinus-Ähnlichkeit der beiden semantischen Vektoren, dann wird die ähnlichste Gruppe von Nachrichten an den Empfehlungskandidaten-Pool gesendet. Anschließend werden die Nachrichtenartikel auf der Grundlage ihrer geschätzten CTR in eine Rangfolge gebracht, und die Artikel mit der höchsten vorhergesagten Klickrate werden den Nutzern angezeigt.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Kodierung von Nachrichtenartikeln in semantische Vektoren mit BERT-as-service</h3><p>Um Nachrichtenartikel in semantische Vektoren zu kodieren, verwendet das System das Tool <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Wenn die Wortzahl eines Inhalts bei Verwendung dieses Modells 512 überschreitet, kommt es während des Einbettungsprozesses zu Informationsverlusten. Um dies zu vermeiden, extrahiert das System zunächst eine Zusammenfassung und kodiert sie in einen 768-dimensionalen semantischen Vektor. Dann werden die beiden relevantesten Themen aus jedem Nachrichtenartikel extrahiert und die entsprechenden vortrainierten Themenvektoren (200 Dimensionen) anhand der Themen-ID identifiziert. Anschließend werden die Themenvektoren in den 768-dimensionalen semantischen Vektor, der aus der Artikelzusammenfassung extrahiert wurde, eingefügt, wodurch ein 968-dimensionaler semantischer Vektor entsteht.</p>
<p>Über Kafta kommen ständig neue Inhalte herein, die in semantische Vektoren umgewandelt werden, bevor sie in die Milvus-Datenbank eingefügt werden.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Extrahieren semantisch ähnlicher Tags aus Nutzerprofilen mit BERT-as-service</h3><p>Das andere neuronale Netz des Modells ist der semantische Vektor des Nutzers. Semantisch ähnliche Tags (z. B. Coronavirus, Covid, COVID-19, Pandemie, neuartiger Stamm, Lungenentzündung) werden aus Nutzerprofilen auf der Grundlage von Interessen, Suchanfragen und Browserverlauf extrahiert. Die Liste der erfassten Tags wird nach Gewicht sortiert, und die 200 wichtigsten werden in verschiedene semantische Gruppen unterteilt. Permutationen der Tags innerhalb jeder semantischen Gruppe werden verwendet, um neue Tag-Phrasen zu generieren, die dann durch BERT-as-service in semantische Vektoren kodiert werden</p>
<p>Für jedes Benutzerprofil gibt es zu den Tag-Phrasen eine <a href="https://github.com/baidu/Familia">Reihe von Themen</a>, die mit einer Gewichtung versehen sind, die das Interessenniveau des Benutzers angibt. Die beiden wichtigsten Themen aus allen relevanten Themen werden ausgewählt und vom Modell für maschinelles Lernen (ML) kodiert, um in den entsprechenden semantischen Tag-Vektor eingefügt zu werden, wodurch ein 968-dimensionaler semantischer Vektor für den Benutzer entsteht. Selbst wenn das System für verschiedene Nutzer dieselben Tags generiert, wird durch die unterschiedliche Gewichtung der Tags und der zugehörigen Themen sowie die explizite Varianz zwischen den Themenvektoren der einzelnen Nutzer sichergestellt, dass die Empfehlungen einzigartig sind.</p>
<p>Das System ist in der Lage, personalisierte Nachrichtenempfehlungen zu geben, indem es die Kosinusähnlichkeit der semantischen Vektoren berechnet, die sowohl aus den Benutzerprofilen als auch aus den Nachrichtenartikeln extrahiert wurden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Berechnen neuer semantischer Benutzerprofilvektoren und Einfügen in Milvus</h3><p>Die Vektoren der semantischen Nutzerprofile werden täglich berechnet, wobei die Daten des vorangegangenen 24-Stunden-Zeitraums am folgenden Abend verarbeitet werden. Die Vektoren werden einzeln in Milvus eingefügt und durchlaufen den Abfrageprozess, um den Benutzern relevante Nachrichtenergebnisse zu liefern. Nachrichteninhalte sind von Natur aus aktuell, so dass die Berechnungen stündlich durchgeführt werden müssen, um einen aktuellen Newsfeed zu generieren, der Inhalte enthält, die eine hohe prognostizierte Klickrate haben und für die Nutzer relevant sind. Die Nachrichteninhalte werden außerdem nach Datum sortiert, und alte Nachrichten werden täglich gelöscht.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Verringerung der Zeit für die semantische Vektorextraktion von Tagen auf Stunden</h3><p>Für das Abrufen von Inhalten mit Hilfe semantischer Vektoren müssen täglich zig Millionen von Tag-Phrasen in semantische Vektoren umgewandelt werden. Dies ist ein zeitaufwändiger Prozess, der selbst bei Verwendung von Grafikprozessoren (GPU), die diese Art der Berechnung beschleunigen, Tage in Anspruch nehmen würde. Um dieses technische Problem zu überwinden, müssen die semantischen Vektoren aus der vorherigen Einbettung so optimiert werden, dass beim Auftauchen ähnlicher Tag-Phrasen die entsprechenden semantischen Vektoren direkt abgerufen werden.</p>
<p>Der semantische Vektor des bestehenden Satzes von Tag-Phrasen wird gespeichert, und ein neuer Satz von Tag-Phrasen, der täglich erzeugt wird, wird in MinHash-Vektoren kodiert. Die <a href="https://milvus.io/docs/v1.1.1/metric.md">Jaccard-Distanz</a> wird verwendet, um die Ähnlichkeit zwischen dem MinHash-Vektor der neuen Tag-Phrase und dem gespeicherten Tag-Phrasen-Vektor zu berechnen. Wenn der Jaccard-Abstand einen vordefinierten Schwellenwert überschreitet, werden die beiden Sätze als ähnlich betrachtet. Wenn der Ähnlichkeitsschwellenwert erreicht ist, können neue Phrasen die semantischen Informationen aus früheren Einbettungen nutzen. Tests haben ergeben, dass ein Abstand von über 0,8 in den meisten Fällen eine ausreichende Genauigkeit gewährleistet.</p>
<p>Durch diesen Prozess wird die tägliche Konvertierung der oben erwähnten zig Millionen Vektoren von Tagen auf etwa zwei Stunden reduziert. Obwohl andere Methoden zur Speicherung semantischer Vektoren je nach den spezifischen Projektanforderungen geeigneter sein könnten, ist die Berechnung der Ähnlichkeit zwischen zwei Tag-Phrasen unter Verwendung der Jaccard-Distanz in einer Milvus-Datenbank nach wie vor eine effiziente und genaue Methode für eine Vielzahl von Szenarien.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Überwindung der "schlechten Fälle" bei der Klassifizierung von Kurztexten<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Klassifizierung von Nachrichtentexten stehen für kurze Nachrichtenartikel weniger Merkmale zur Verfügung als für längere. Aus diesem Grund versagen Klassifizierungsalgorithmen, wenn Inhalte unterschiedlicher Länge durch denselben Klassifikator laufen. Milvus hilft bei der Lösung dieses Problems, indem es nach mehreren Informationen zur Klassifizierung von Langtexten mit ähnlicher Semantik und zuverlässigen Werten sucht und dann einen Abstimmungsmechanismus verwendet, um die Klassifizierung von Kurztexten zu ändern.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Identifizierung und Beseitigung falsch klassifizierter Kurztexte</h3><p>Die genaue Klassifizierung jedes Nachrichtenartikels ist entscheidend für die Bereitstellung nützlicher Inhaltsempfehlungen. Da kurze Nachrichtenartikel weniger Merkmale aufweisen, führt die Anwendung desselben Klassifikators für Nachrichten unterschiedlicher Länge zu einer höheren Fehlerquote bei der Klassifizierung von Kurztexten. Daher werden BERT-as-service und Milvus eingesetzt, um schnell falsch klassifizierte Kurztexte in Stapeln zu identifizieren, sie korrekt neu zu klassifizieren und dann Stapel von Daten als Korpus für das Training gegen dieses Problem zu verwenden.</p>
<p>BERT-as-service wird verwendet, um eine Gesamtzahl von fünf Millionen langen Nachrichtenartikeln mit einer Klassifikatorbewertung von mehr als 0,9 in semantische Vektoren zu kodieren. Nach dem Einfügen der langen Textartikel in Milvus werden die Kurznachrichten in semantische Vektoren kodiert. Jeder semantische Kurznachrichtenvektor wird zur Abfrage der Milvus-Datenbank verwendet, um die 20 besten Langnachrichtenartikel mit der höchsten Kosinus-Ähnlichkeit zur Ziel-Kurznachricht zu erhalten. Wenn 18 der 20 semantisch ähnlichsten Langnachrichten in der gleichen Klassifizierung erscheinen und diese sich von der der abgefragten Kurznachrichten unterscheidet, wird die Klassifizierung der Kurznachrichten als falsch angesehen und muss an die 18 Langnachrichtenartikel angepasst werden.</p>
<p>Mit diesem Verfahren lassen sich fehlerhafte Klassifizierungen von Kurznachrichten schnell erkennen und korrigieren. Stichprobenstatistiken zeigen, dass die Gesamtgenauigkeit der Textklassifizierung nach der Korrektur der Kurztextklassifizierungen über 95 % liegt. Indem die Klassifizierung von Langtexten mit hoher Zuverlässigkeit zur Korrektur der Klassifizierung von Kurztexten genutzt wird, wird die Mehrheit der fehlerhaften Klassifizierungen in kurzer Zeit korrigiert. Dies bietet auch einen guten Korpus für das Training eines Kurztextklassifikators.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Flussdiagramm der Entdeckung von "schlechten Fällen" bei der Kurztextklassifizierung.")</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus kann Echtzeitempfehlungen für Nachrichteninhalte und mehr liefern<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus hat die Echtzeitleistung des Nachrichtenempfehlungssystems von Sohu erheblich verbessert und auch die Effizienz der Identifizierung von falsch klassifiziertem Kurztext erhöht. Wenn Sie mehr über Milvus und seine verschiedenen Anwendungen erfahren möchten:</p>
<ul>
<li>Lesen Sie unseren <a href="https://zilliz.com/blog">Blog</a>.</li>
<li>Interagieren Sie mit unserer Open-Source-Community auf <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Nutzen Sie die beliebteste Vektordatenbank der Welt auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie zu ihr bei.</li>
<li>Testen und implementieren Sie KI-Anwendungen schnell mit unserem neuen <a href="https://github.com/milvus-io/bootcamp">Bootcamp</a>.</li>
</ul>

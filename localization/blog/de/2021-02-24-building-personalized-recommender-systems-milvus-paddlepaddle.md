---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Hintergrund Einleitung
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: Wie man ein Empfehlungssystem mit Deep Learning entwickelt
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Aufbau personalisierter Empfehlungssysteme mit Milvus und PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Hintergrund Einleitung<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der kontinuierlichen Entwicklung der Netzwerktechnologie und dem immer größer werdenden Umfang des elektronischen Handels nehmen die Anzahl und die Vielfalt der Waren schnell zu, und die Benutzer müssen viel Zeit aufwenden, um die Waren zu finden, die sie kaufen möchten. Dies ist eine Informationsflut. Um dieses Problem zu lösen, wurden Empfehlungssysteme entwickelt.</p>
<p>Das Empfehlungssystem ist eine Teilmenge des Informationsfiltersystems, das in einer Reihe von Bereichen wie Filme, Musik, E-Commerce und Feed-Stream-Empfehlungen eingesetzt werden kann. Das Empfehlungssystem erkennt die persönlichen Bedürfnisse und Interessen des Benutzers durch Analyse und Auswertung des Benutzerverhaltens und empfiehlt Informationen oder Produkte, die für den Benutzer von Interesse sein könnten. Im Gegensatz zu Suchmaschinen verlangen Empfehlungssysteme nicht, dass die Benutzer ihre Bedürfnisse genau beschreiben, sondern modellieren ihr historisches Verhalten, um proaktiv Informationen anzubieten, die den Interessen und Bedürfnissen der Benutzer entsprechen.</p>
<p>In diesem Artikel verwenden wir PaddlePaddle, eine Deep-Learning-Plattform von Baidu, um ein Modell zu erstellen, und kombinieren Milvus, eine Vektorähnlichkeitssuchmaschine, um ein personalisiertes Empfehlungssystem zu erstellen, das Benutzern schnell und präzise interessante Informationen liefern kann.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Datenvorbereitung<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir nehmen den MovieLens Million Dataset (ml-1m) [1] als Beispiel. Der ml-1m-Datensatz enthält 1.000.000 Bewertungen von 4.000 Filmen durch 6.000 Nutzer, die vom GroupLens Research Lab gesammelt wurden. Die Originaldaten beinhalten Feature-Daten des Films, User-Feature und User-Bewertung des Films, siehe ml-1m-README [2] .</p>
<p>Der ml-1m-Datensatz enthält 3 .dat-Artikel: movies.dat、users.dat und ratings.dat.movies.dat enthält die Merkmale des Films, siehe Beispiel unten:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Dies bedeutet, dass die Film-ID 1 ist und der Titel 《Toy Story》 lautet, der in drei Kategorien unterteilt ist. Diese drei Kategorien sind Animation, Kinder und Komödie.</p>
<p>users.dat enthält die Merkmale des Benutzers, siehe Beispiel unten:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Das bedeutet, dass die Benutzer-ID 1 ist, weiblich und jünger als 18 Jahre alt. Die Berufs-ID ist 10.</p>
<p>ratings.dat enthält das Merkmal der Filmbewertung, siehe Beispiel unten:</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Das heißt, der Benutzer 1 bewertet den Film 1193 mit 5 Punkten.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Fusionsempfehlungsmodell<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Für das personalisierte Filmempfehlungssystem haben wir das von PaddlePaddle implementierte Fusion Recommendation Model [3] verwendet. Dieses Modell ist aus der industriellen Praxis entstanden.</p>
<p>Zunächst werden die Benutzermerkmale und die Filmmerkmale als Eingabe für das neuronale Netz verwendet:</p>
<ul>
<li>Die Benutzermerkmale enthalten vier Attributinformationen: Benutzer-ID, Geschlecht, Beruf und Alter.</li>
<li>Das Filmmerkmal enthält drei Attributinformationen: Film-ID, Filmtyp-ID und Filmname.</li>
</ul>
<p>Für das Benutzermerkmal wird die Benutzer-ID auf eine Vektordarstellung mit einer Größe von 256 Dimensionen abgebildet, in die vollständig verbundene Schicht eingegeben und eine ähnliche Verarbeitung für die anderen drei Attribute durchgeführt. Dann werden die Merkmalsrepräsentationen der vier Attribute vollständig verknüpft und separat hinzugefügt.</p>
<p>Bei Filmmerkmalen wird die Film-ID auf ähnliche Weise verarbeitet wie die Benutzer-ID. Die Filmtyp-ID wird direkt in Form eines Vektors in die vollverknüpfte Schicht eingegeben, und der Filmname wird durch einen Vektor fester Länge unter Verwendung eines neuronalen Textfaltungsnetzwerks dargestellt. Die Merkmalsrepräsentationen der drei Attribute werden dann vollständig verknüpft und separat hinzugefügt.</p>
<p>Nach Erhalt der Vektordarstellung des Benutzers und des Films wird die Kosinus-Ähnlichkeit der beiden als Punktzahl des personalisierten Empfehlungssystems berechnet. Schließlich wird das Quadrat der Differenz zwischen der Ähnlichkeitsbewertung und der tatsächlichen Bewertung des Nutzers als Verlustfunktion des Regressionsmodells verwendet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-Benutzer-Film-personalisierte-Empfehlung-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">System-Übersicht<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>In Kombination mit dem Fusionsempfehlungsmodell von PaddlePaddle wird der vom Modell erzeugte Filmmerkmalsvektor in der Milvus-Vektorähnlichkeitssuchmaschine gespeichert, und das Benutzermerkmal wird als zu durchsuchender Zielvektor verwendet. Die Ähnlichkeitssuche wird in Milvus durchgeführt, um das Abfrageergebnis als empfohlene Filme für den Benutzer zu erhalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-überblick.jpg</span> </span></p>
<blockquote>
<p>Die Methode des inneren Produkts (IP) wird in Milvus zur Berechnung des Vektorabstands verwendet. Nach der Normalisierung der Daten stimmt die Ähnlichkeit des inneren Produkts mit dem Ergebnis der Kosinus-Ähnlichkeit im Fusionsempfehlungsmodell überein.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Anwendung eines persönlichen Empfehlungssystems<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Aufbau eines personalisierten Empfehlungssystems mit Milvus erfolgt in drei Schritten. Details zur Funktionsweise entnehmen Sie bitte dem Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Schritt 1：Modell-Training</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>Die Ausführung dieses Befehls erzeugt ein Modell recommender_system.inference.model im Verzeichnis, das Filmdaten und Benutzerdaten in Merkmalsvektoren umwandeln kann und Anwendungsdaten für Milvus zum Speichern und Abrufen erzeugt.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Schritt 2：Datenvorverarbeitung</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>Die Ausführung dieses Befehls erzeugt Testdaten movies_data.txt im Verzeichnis, um eine Vorverarbeitung der Filmdaten zu erreichen.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Schritt 3：Implementierung eines persönlichen Empfehlungssystems mit Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>Die Ausführung dieses Befehls implementiert personalisierte Empfehlungen für bestimmte Benutzer.</p>
<p>Der Hauptprozess ist:</p>
<ul>
<li>Durch load_inference_model werden die Filmdaten durch das Modell verarbeitet, um einen Film-Merkmalsvektor zu erzeugen.</li>
<li>Laden des Film-Merkmalsvektors in Milvus über milvus.insert.</li>
<li>Je nach Alter/Geschlecht/Beruf des Benutzers, die in den Parametern angegeben sind, wird er in einen Benutzer-Merkmalsvektor umgewandelt, milvus.search_vectors wird für die Ähnlichkeitssuche verwendet, und das Ergebnis mit der höchsten Ähnlichkeit zwischen dem Benutzer und dem Film wird zurückgegeben.</li>
</ul>
<p>Vorhersage der fünf besten Filme, an denen der Benutzer interessiert ist:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>Durch die Eingabe von Benutzer- und Filminformationen in das Fusionsempfehlungsmodell können wir übereinstimmende Punktzahlen erhalten und dann die Punktzahlen aller Filme auf der Grundlage des Benutzers sortieren, um Filme zu empfehlen, die für den Benutzer von Interesse sein könnten. <strong>Dieser Artikel kombiniert Milvus und PaddlePaddle, um ein personalisiertes Empfehlungssystem aufzubauen. Milvus, eine Vektorsuchmaschine, wird verwendet, um alle Filmmerkmaldaten zu speichern, und dann wird eine Ähnlichkeitssuche für die Benutzermerkmale in Milvus durchgeführt.</strong> Das Suchergebnis ist das Filmranking, das das System dem Benutzer empfiehlt.</p>
<p>Die Vektorsuchmaschine Milvus [5] ist mit verschiedenen Deep-Learning-Plattformen kompatibel und durchsucht Milliarden von Vektoren mit einer Reaktionszeit von nur einer Millisekunde. Mit Milvus können Sie mühelos weitere Möglichkeiten von KI-Anwendungen erkunden!</p>
<h2 id="Reference" class="common-anchor-header">Referenz<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Fusion Recommendation Model von PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>

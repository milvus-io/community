---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Mit Milvus KI-gestützte Nachrichtenempfehlung in Xiaomis mobilem Browser
  erstellen
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Erfahren Sie, wie Xiaomi mit Hilfe von KI und Milvus ein intelligentes
  Empfehlungssystem für Nachrichten entwickelt hat, das in der Lage ist, die
  relevantesten Inhalte für die Nutzer seines mobilen Webbrowsers zu finden.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Making with Milvus: KI-gestützte Nachrichtenempfehlungen im mobilen Browser von Xiaomi</custom-h1><p>Von Social-Media-Feeds bis hin zu Playlist-Empfehlungen auf Spotify - <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">künstliche Intelligenz</a> spielt bereits eine wichtige Rolle bei den Inhalten, die wir jeden Tag sehen und mit denen wir interagieren. Um seinen mobilen Webbrowser zu differenzieren, hat der multinationale Elektronikhersteller Xiaomi eine KI-gestützte Nachrichtenempfehlungsmaschine entwickelt. <a href="https://milvus.io/">Milvus</a>, eine Open-Source-Vektordatenbank, die speziell für die Ähnlichkeitssuche und künstliche Intelligenz entwickelt wurde, diente als zentrale Datenmanagementplattform der Anwendung. Dieser Artikel erklärt, wie Xiaomi seine KI-gestützte Nachrichtenempfehlungsmaschine entwickelt hat und wie Milvus und andere KI-Algorithmen verwendet wurden.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Einsatz von KI zur Empfehlung personalisierter Inhalte und zum Durchbrechen des Nachrichtenrauschens</h3><p>Allein die New York Times veröffentlicht täglich mehr als <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 Artikel</a>. Die schiere Menge an Artikeln macht es für den Einzelnen unmöglich, sich einen umfassenden Überblick über alle Nachrichten zu verschaffen. Um die großen Mengen an Inhalten zu sichten und die relevantesten oder interessantesten Artikel zu empfehlen, wenden wir uns zunehmend an KI. Obwohl Empfehlungen noch lange nicht perfekt sind, wird maschinelles Lernen immer notwendiger, um den ständigen Strom neuer Informationen aus unserer immer komplexeren und vernetzten Welt zu durchdringen.</p>
<p>Xiaomi produziert und investiert in Smartphones, mobile Apps, Laptops, Haushaltsgeräte und viele weitere Produkte. Um einen mobilen Browser, der auf vielen der mehr als 40 Millionen Smartphones, die das Unternehmen jedes Quartal verkauft, vorinstalliert ist, von anderen abzuheben, hat Xiaomi ein Nachrichtenempfehlungssystem eingebaut. Wenn Benutzer den mobilen Browser von Xiaomi starten, wird künstliche Intelligenz eingesetzt, um ähnliche Inhalte auf der Grundlage des Suchverlaufs, der Interessen und mehr zu empfehlen. Milvus ist eine Open-Source-Datenbank für die vektorielle Ähnlichkeitssuche, die dazu dient, die Suche nach verwandten Artikeln zu beschleunigen.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Wie funktioniert die KI-gestützte Empfehlung von Inhalten?</h3><p>Im Kern geht es bei der Empfehlung von Nachrichten (oder jeder anderen Art von Inhaltsempfehlungssystemen) darum, Eingabedaten mit einer umfangreichen Datenbank zu vergleichen, um ähnliche Informationen zu finden. Erfolgreiche Inhaltsempfehlungen erfordern ein Gleichgewicht zwischen Relevanz und Aktualität sowie die effiziente Einbeziehung großer Mengen neuer Daten - oft in Echtzeit.</p>
<p>Um große Datenmengen zu verarbeiten, werden Empfehlungssysteme in der Regel in zwei Stufen unterteilt:</p>
<ol>
<li><strong>Abruf</strong>: Bei der Suche werden die Inhalte aus der umfangreichen Bibliothek auf der Grundlage der Interessen und des Verhaltens der Benutzer eingegrenzt. Im mobilen Browser von Xiaomi werden Tausende von Inhalten aus einem riesigen Datensatz ausgewählt, der Millionen von Nachrichtenartikeln enthält.</li>
<li><strong>Sortieren</strong>: Anschließend werden die beim Abruf ausgewählten Inhalte nach bestimmten Indikatoren sortiert, bevor sie dem Nutzer angezeigt werden. Während sich die Nutzer mit den empfohlenen Inhalten beschäftigen, passt sich das System in Echtzeit an, um relevantere Vorschläge zu machen.</li>
</ol>
<p>Die Empfehlungen für Nachrichteninhalte müssen in Echtzeit auf der Grundlage des Nutzerverhaltens und der kürzlich veröffentlichten Inhalte erfolgen. Außerdem müssen die vorgeschlagenen Inhalte so weit wie möglich den Interessen und der Suchabsicht der Nutzer entsprechen.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = intelligente Inhaltsvorschläge</h3><p>Milvus ist eine Open-Source-Datenbank für die Suche nach Vektorähnlichkeit, die mit Deep-Learning-Modellen integriert werden kann, um Anwendungen für die Verarbeitung natürlicher Sprache, die Identitätsprüfung und vieles mehr zu unterstützen. Milvus indiziert große Vektordatensätze, um die Suche effizienter zu gestalten, und unterstützt eine Vielzahl gängiger KI-Frameworks, um den Prozess der Entwicklung von Anwendungen für maschinelles Lernen zu vereinfachen. Diese Eigenschaften machen die Plattform zur idealen Lösung für die Speicherung und Abfrage von Vektordaten, einer entscheidenden Komponente vieler Anwendungen für maschinelles Lernen.</p>
<p>Xiaomi hat Milvus für die Verwaltung von Vektordaten für sein intelligentes Nachrichtenempfehlungssystem ausgewählt, weil es schnell und zuverlässig ist und nur minimale Konfiguration und Wartung erfordert. Milvus muss jedoch mit einem KI-Algorithmus gepaart werden, um einsatzfähige Anwendungen zu erstellen. Xiaomi wählte BERT, kurz für Bidirectional Encoder Representation Transformers, als Sprachrepräsentationsmodell in seiner Empfehlungsmaschine. BERT kann als allgemeines NLU-Modell (Natural Language Understanding) verwendet werden, das eine Reihe verschiedener NLP-Aufgaben (Natural Language Processing) ausführen kann. Seine wichtigsten Merkmale sind:</p>
<ul>
<li>Der BERT-Transformer wird als Hauptrahmen des Algorithmus verwendet und ist in der Lage, explizite und implizite Beziehungen innerhalb und zwischen Sätzen zu erfassen.</li>
<li>Multi-Task-Lernziele, maskierte Sprachmodellierung (MLM) und Vorhersage des nächsten Satzes (NSP).</li>
<li>BERT ist bei größeren Datenmengen leistungsfähiger und kann andere Techniken zur Verarbeitung natürlicher Sprache wie Word2Vec verbessern, indem es als Konvertierungsmatrix fungiert.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>Die Netzwerkarchitektur von BERT verwendet eine mehrschichtige Transformatorstruktur, die sich von den traditionellen neuronalen Netzwerken RNN und CNN unterscheidet. Es funktioniert, indem es den Abstand zwischen zwei Wörtern an einer beliebigen Position durch seinen Aufmerksamkeitsmechanismus in ein Wort umwandelt, und löst das Abhängigkeitsproblem, das im NLP seit einiger Zeit besteht.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT bietet ein einfaches und ein komplexes Modell. Die entsprechenden Hyperparameter lauten wie folgt: BERT BASE: L = 12, H = 768, A = 12, Gesamtparameter 110M; BERT LARGE: L = 24, H = 1024, A = 16, die Gesamtzahl der Parameter beträgt 340M.</p>
<p>Bei den oben genannten Hyperparametern steht L für die Anzahl der Schichten im Netz (d. h. die Anzahl der Transformer-Blöcke), A für die Anzahl der Selbstaufmerksamkeit bei Multi-Head Attention und die Filtergröße beträgt 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Xiaomis Inhaltsempfehlungssystem</h3><p>Das browserbasierte Xiaomi-Nachrichtenempfehlungssystem stützt sich auf drei Schlüsselkomponenten: Vektorisierung, ID-Zuordnung und ANN-Dienst (Approximate Nearest Neighbour).</p>
<p>Die Vektorisierung ist ein Prozess, bei dem Artikelüberschriften in allgemeine Satzvektoren umgewandelt werden. Das SimBert-Modell, das auf BERT basiert, wird im Empfehlungssystem von Xiaomi verwendet. SimBert ist ein 12-Schichten-Modell mit einer versteckten Größe von 768. Simbert verwendet das Trainingsmodell Chinese L-12_H-768_A-12 für kontinuierliches Training (Trainingsaufgabe "metrisches Lernen +UniLM") und hat 1,17 Millionen Schritte auf einem signle TITAN RTX mit dem Adam-Optimierer trainiert (Lernrate 2e-6, Stapelgröße 128). Einfach ausgedrückt, handelt es sich um ein optimiertes BERT-Modell.</p>
<p>ANN-Algorithmen vergleichen vektorisierte Artikeltitel mit der gesamten in Milvus gespeicherten Nachrichtenbibliothek und geben dann ähnliche Inhalte für die Nutzer zurück. Die ID-Zuordnung wird verwendet, um relevante Informationen wie Seitenaufrufe und Klicks für entsprechende Artikel zu erhalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Die in Milvus gespeicherten Daten, die die Nachrichtenempfehlungsmaschine von Xiaomi antreiben, werden ständig aktualisiert, einschließlich zusätzlicher Artikel und Aktivitätsinformationen. Wenn das System neue Daten einbezieht, müssen alte Daten bereinigt werden. In diesem System werden in den ersten T-1 Tagen vollständige Datenaktualisierungen und in den darauf folgenden T Tagen inkrementelle Aktualisierungen vorgenommen.</p>
<p>In festgelegten Abständen werden alte Daten gelöscht und die verarbeiteten Daten der T-1 Tage in die Sammlung eingefügt. Dabei werden neu generierte Daten in Echtzeit aufgenommen. Sobald neue Daten eingefügt sind, wird eine Ähnlichkeitssuche in Milvus durchgeführt. Die abgerufenen Artikel werden wiederum nach Klickrate und anderen Faktoren sortiert, und die besten Inhalte werden den Nutzern angezeigt. In einem Szenario wie diesem, in dem Daten häufig aktualisiert werden und Ergebnisse in Echtzeit geliefert werden müssen, ermöglicht die Fähigkeit von Milvus, neue Daten schnell zu integrieren und zu durchsuchen, eine drastische Beschleunigung der Empfehlung von Nachrichteninhalten im mobilen Browser von Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus macht die Vektorähnlichkeitssuche besser</h3><p>Die Vektorisierung von Daten und die anschließende Berechnung der Ähnlichkeit zwischen Vektoren ist die am häufigsten verwendete Suchtechnologie. Der Aufstieg von ANN-basierten Vektorähnlichkeitssuchmaschinen hat die Effizienz von Vektorähnlichkeitsberechnungen erheblich verbessert. Im Vergleich zu ähnlichen Lösungen bietet Milvus eine optimierte Datenspeicherung, eine Vielzahl von SDKs und eine verteilte Version, die den Arbeitsaufwand für den Aufbau einer Retrieval-Schicht erheblich reduziert. Darüber hinaus ist die aktive Open-Source-Community von Milvus eine leistungsstarke Ressource, die bei der Beantwortung von Fragen und der Behebung von Problemen helfen kann.</p>
<p>Wenn Sie mehr über die vektorielle Ähnlichkeitssuche und Milvus erfahren möchten, lesen Sie die folgenden Ressourcen:</p>
<ul>
<li>Sehen Sie sich <a href="https://github.com/milvus-io/milvus">Milvus</a> auf Github an.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">Vektorielle Ähnlichkeitssuche verbirgt sich im Verborgenen</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Beschleunigung der Ähnlichkeitssuche bei wirklich großen Daten mit Vektorindizierung</a></li>
</ul>
<p>Lesen Sie andere <a href="https://zilliz.com/user-stories">Anwenderberichte</a>, um mehr über die Arbeit mit Milvus zu erfahren.</p>

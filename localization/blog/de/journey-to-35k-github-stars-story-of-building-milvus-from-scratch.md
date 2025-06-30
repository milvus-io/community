---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Unsere Reise zu 35K+ GitHub-Sternen: Die wahre Geschichte des Aufbaus von
  Milvus von Grund auf
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Feiern Sie mit uns Milvus, die Vektordatenbank, die 35.5K Sterne auf GitHub
  erreicht hat. Entdecken Sie unsere Geschichte und wie wir KI-Lösungen für
  Entwickler einfacher machen.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>In den letzten Jahren haben wir uns auf eine Sache konzentriert: den Aufbau einer unternehmenstauglichen Vektordatenbank für die KI-Ära. Der schwierige Teil ist nicht der Aufbau <em>einer</em> Datenbank, sondern der Aufbau einer Datenbank, die skalierbar und einfach zu verwenden ist und tatsächlich echte Probleme in der Produktion löst.</p>
<p>Diesen Juni haben wir einen neuen Meilenstein erreicht: Milvus erreichte <a href="https://github.com/milvus-io/milvus">35.000 Sterne auf GitHub</a> (zum Zeitpunkt der Erstellung dieses Artikels hat es 35,5K+ Sterne). Wir werden nicht so tun, als sei dies nur eine weitere Zahl - es bedeutet uns sehr viel.</p>
<p>Jeder Stern steht für einen Entwickler, der sich die Zeit genommen hat, sich unsere Arbeit anzuschauen, sie für nützlich genug befunden hat, um ein Lesezeichen zu setzen, und in vielen Fällen beschlossen hat, sie zu nutzen. Einige von Ihnen sind noch weiter gegangen: Sie haben Probleme gemeldet, Code beigesteuert, Fragen in unseren Foren beantwortet und anderen Entwicklern geholfen, wenn sie nicht weiterkamen.</p>
<p>Wir wollten uns einen Moment Zeit nehmen, um unsere Geschichte zu erzählen - die wahre Geschichte, mit all den chaotischen Teilen.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Wir begannen mit der Entwicklung von Milvus, weil nichts anderes mehr funktionierte<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Jahr 2017 begannen wir mit einer einfachen Frage: Wie kann man die Vektoreinbettungen, die das semantische Verständnis ermöglichen, effizient speichern und durchsuchen, wenn KI-Anwendungen aufkommen und unstrukturierte Daten explodieren?</p>
<p>Herkömmliche Datenbanken sind dafür nicht ausgelegt. Sie sind für Zeilen und Spalten optimiert, nicht für hochdimensionale Vektoren. Die vorhandenen Technologien und Tools waren für unsere Anforderungen entweder unmöglich oder quälend langsam.</p>
<p>Wir haben alles ausprobiert, was verfügbar war. Wir haben Lösungen mit Elasticsearch zusammengehackt. Wir bauten benutzerdefinierte Indizes auf MySQL. Wir haben sogar mit FAISS experimentiert, aber das war als Forschungsbibliothek und nicht als Produktionsdatenbankinfrastruktur gedacht. Nichts bot die vollständige Lösung, die wir uns für KI-Workloads in Unternehmen vorgestellt hatten.</p>
<p><strong>Also begannen wir, unsere eigene zu entwickeln.</strong> Nicht, weil wir dachten, dass es einfach sein würde - Datenbanken sind bekanntermaßen schwer in den Griff zu bekommen -, sondern weil wir sahen, wohin sich KI entwickeln würde, und wussten, dass wir eine zweckmäßige Infrastruktur brauchten, um dorthin zu gelangen.</p>
<p>Im Jahr 2018 steckten wir mitten in der Entwicklung von <a href="https://milvus.io/">Milvus</a>. Der Begriff &quot;<strong>Vektordatenbank</strong>&quot; existierte damals noch gar nicht. Wir waren dabei, eine neue Kategorie von Infrastruktursoftware zu schaffen, was sowohl aufregend als auch beängstigend war.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing von Milvus: Bauen in der Öffentlichkeit<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>Im November 2019 beschlossen wir, die Version 0.10 von Milvus als Open-Source zu veröffentlichen.</p>
<p>Open-Sourcing bedeutet, dass man alle seine Fehler der Welt preisgibt. Jeder Hack, jeder TODO-Kommentar, jede Designentscheidung, bei der man sich nicht ganz sicher ist. Aber wir waren der Meinung, dass Vektordatenbanken, wenn sie zu einer kritischen Infrastruktur für KI werden sollen, offen und für jeden zugänglich sein müssen.</p>
<p>Die Resonanz war überwältigend. Die Entwickler nutzten Milvus nicht nur - sie verbesserten es. Sie fanden Fehler, die wir übersehen hatten, schlugen Funktionen vor, an die wir nicht gedacht hatten, und stellten Fragen, die uns veranlassten, unsere Designentscheidungen zu überdenken.</p>
<p>Im Jahr 2020 sind wir der <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> beigetreten. Dabei ging es nicht nur um Glaubwürdigkeit - wir lernten, wie man ein nachhaltiges Open-Source-Projekt pflegt. Wie man mit Governance, Abwärtskompatibilität und der Entwicklung von Software umgeht, die nicht nur Monate, sondern Jahre überdauert.</p>
<p>Im Jahr 2021 veröffentlichten wir Milvus 1.0 und <a href="https://lfaidata.foundation/projects/milvus/">wurden von der LF AI &amp; Data Foundation ausgezeichnet</a>. Im selben Jahr gewannen wir den <a href="https://big-ann-benchmarks.com/neurips21.html">globalen BigANN-Wettbewerb</a> für die Vektorsuche in Milliardenhöhe. Dieser Sieg fühlte sich gut an, aber noch wichtiger war, dass er uns bestätigte, dass wir echte Probleme auf die richtige Weise lösten.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">Die schwerste Entscheidung: Neu anfangen<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>An dieser Stelle werden die Dinge kompliziert. Bis 2021 funktionierte Milvus 1.0 für viele Anwendungsfälle gut, aber die Unternehmenskunden verlangten immer wieder dasselbe: eine bessere Cloud-native Architektur, eine einfachere horizontale Skalierung und eine einfachere Bedienung.</p>
<p>Wir hatten die Wahl: Flicken oder von Grund auf neu aufbauen. Wir entschieden uns für den Neuaufbau.</p>
<p>Milvus 2.0 war im Wesentlichen eine komplette Neufassung. Wir führten eine vollständig entkoppelte Storage-Compute-Architektur mit dynamischer Skalierbarkeit ein. Es dauerte zwei Jahre und war ehrlich gesagt eine der stressigsten Phasen in der Geschichte unseres Unternehmens. Wir haben ein funktionierendes System weggeworfen, das von Tausenden von Menschen genutzt wurde, um etwas Unerprobtes zu entwickeln.</p>
<p><strong>Aber als wir Milvus 2.0 im Jahr 2022 herausbrachten, verwandelte sich Milvus von einer leistungsstarken Vektordatenbank in eine produktionsreife Infrastruktur, die auf die Arbeitslasten von Unternehmen skaliert werden konnte.</strong> Im selben Jahr schlossen wir eine <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">Finanzierungsrunde der Serie B+ ab - nicht</a>um Geld zu verbrennen, sondern um die Produktqualität und den Support für globale Kunden zu verdoppeln. Wir wussten, dass dieser Weg Zeit in Anspruch nehmen würde, aber jeder Schritt musste auf einem soliden Fundament aufgebaut werden.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Als alles mit KI beschleunigt wurde<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 war das Jahr der <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-augmented Generation). Plötzlich wurde die semantische Suche von einer interessanten KI-Technik zu einer unverzichtbaren Infrastruktur für Chatbots, Dokument-Fragen und KI-Agenten.</p>
<p>Die GitHub-Sterne von Milvus schossen in die Höhe. Die Supportanfragen vervielfachten sich. Entwickler, die noch nie etwas von Vektordatenbanken gehört hatten, stellten plötzlich anspruchsvolle Fragen zu Indizierungsstrategien und Abfrageoptimierung.</p>
<p>Dieses Wachstum war aufregend, aber auch überwältigend. Wir erkannten, dass wir nicht nur unsere Technologie, sondern auch unseren gesamten Ansatz zur Unterstützung der Community erweitern mussten. Wir stellten mehr Entwicklervertreter ein, schrieben unsere Dokumentation komplett neu und begannen mit der Erstellung von Schulungsinhalten für Entwickler, die neu im Bereich Vektordatenbanken sind.</p>
<p>Außerdem haben wir <a href="https://zilliz.com/cloud">Zilliz Cloud eingeführt - unsere</a>vollständig verwaltete Version von Milvus. Einige Leute fragten uns, warum wir unser Open-Source-Projekt "kommerzialisieren" würden. Die ehrliche Antwort ist, dass die Aufrechterhaltung einer Infrastruktur auf Unternehmensniveau teuer und komplex ist. Zilliz Cloud ermöglicht es uns, die Entwicklung von Milvus aufrechtzuerhalten und zu beschleunigen, während das Kernprojekt vollständig quelloffen bleibt.</p>
<p>Dann kam das Jahr 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester ernannte uns zum Marktführer</strong></a> <strong>in der Kategorie der Vektordatenbanken.</strong> Milvus überschritt 30.000 GitHub-Sterne. <strong>Und uns wurde klar: Die Straße, die wir sieben Jahre lang geebnet hatten, war endlich zur Autobahn geworden.</strong> Als immer mehr Unternehmen Vektordatenbanken als kritische Infrastruktur einsetzten, beschleunigte sich unser Geschäftswachstum rapide und bestätigte, dass die von uns geschaffene Grundlage sowohl technisch als auch kommerziell skalierbar war.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Das Team hinter Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier ist etwas Interessantes: Viele Leute kennen Milvus, aber nicht Zilliz. Damit haben wir eigentlich kein Problem. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>ist das Team hinter Milvus - wir entwickeln es, pflegen es und unterstützen es.</strong></p>
<p>Was uns am meisten am Herzen liegt, sind die unglamourösen Dinge, die den Unterschied zwischen einer coolen Demo und einer produktionsreifen Infrastruktur ausmachen: Leistungsoptimierungen, Sicherheitspatches, eine Dokumentation, die Anfängern wirklich hilft, und eine durchdachte Reaktion auf GitHub-Probleme.</p>
<p>Wir haben ein globales 24/7-Supportteam in den USA, Europa und Asien aufgebaut, denn Entwickler brauchen Hilfe in ihrer Zeitzone, nicht in unserer. Wir haben Community-Mitarbeiter, die wir &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvus-Botschafter</a>&quot; nennen, die Veranstaltungen organisieren, Fragen im Forum beantworten und Konzepte oft besser erklären als wir selbst.</p>
<p>Wir haben auch Integrationen mit AWS, GCP und anderen Cloud-Anbietern begrüßt - selbst wenn diese ihre eigenen verwalteten Versionen von Milvus anbieten. Mehr Bereitstellungsoptionen sind gut für die Benutzer. Allerdings haben wir festgestellt, dass sich Teams bei komplexen technischen Herausforderungen oft direkt an uns wenden, weil wir das System auf der tiefsten Ebene verstehen.</p>
<p>Viele Leute denken, Open Source sei nur ein &quot;Werkzeugkasten&quot;, aber in Wirklichkeit ist es ein &quot;evolutionärer Prozess&quot; - eine kollektive Anstrengung von unzähligen Menschen, die es lieben und daran glauben. Nur diejenigen, die die Architektur wirklich verstehen, können das "Warum" hinter Fehlerbehebungen, Analysen von Leistungsengpässen, Integration von Datensystemen und architektonischen Anpassungen erklären.</p>
<p><strong>Wenn Sie also die Open-Source-Software Milvus verwenden oder Vektordatenbanken als Kernkomponente Ihres KI-Systems in Betracht ziehen, empfehlen wir Ihnen, sich direkt mit uns in Verbindung zu setzen, um den professionellsten und schnellsten Support zu erhalten.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Echte Wirkung in der Produktion: Das Vertrauen der Anwender<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Anwendungsfälle für Milvus sind größer geworden, als wir es uns ursprünglich vorgestellt haben. Wir betreiben KI-Infrastrukturen für einige der weltweit anspruchsvollsten Unternehmen in allen Branchen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz kunden.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, weltweiter Marktführer in der Automobiltechnologie und Pionier im Bereich des autonomen Fahrens, hat seine Datenanalyse mit Milvus revolutioniert und dabei die Kosten für die Datenerfassung um 80 % gesenkt und jährliche Einsparungen in Höhe von 1,4 Mio. USD erzielt, während Milliarden von Fahrszenarien in Millisekunden nach kritischen Grenzfällen durchsucht wurden.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, eines der am schnellsten wachsenden Unternehmen für Produktivitäts-KI mit Millionen von monatlich aktiven Nutzern, nutzt Milvus, um eine Abruflatenz von unter 20-50 ms bei Milliarden von Datensätzen und eine 5fache Beschleunigung der agentenbasierten Suche zu erreichen. Ihr CTO sagt: "Milvus dient als zentrales Repository und treibt unsere Informationsabfrage in Milliarden von Datensätzen voran."</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Ein weltweit führendes Fintech-Unternehmen</strong></a>, eine der größten digitalen Zahlungsplattformen der Welt, die zig Milliarden Transaktionen in mehr als 200 Ländern und mehr als 25 Währungen abwickelt, entschied sich für Milvus, weil es die Batch-Ingestion um das 5-10-fache beschleunigt hat und Aufgaben in weniger als einer Stunde erledigt, für die andere Unternehmen mehr als 8 Stunden benötigten.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, die führende Plattform für juristische Arbeit, auf die Tausende von Anwaltskanzleien in den USA vertrauen, verwaltet 3 Milliarden Vektoren in Millionen von juristischen Dokumenten, spart Anwälten 60-80 % der Zeit bei der Dokumentenanalyse und erreicht ein "echtes Datenbewusstsein" für das juristische Fallmanagement.</p>
<p>Wir unterstützen auch <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart</strong> und viele andere in fast allen Branchen. Über 10.000 Organisationen haben Milvus oder Zilliz Cloud zu ihrer bevorzugten Vektordatenbank gemacht.</p>
<p>Dies sind nicht nur technische Erfolgsgeschichten - sie sind Beispiele dafür, wie Vektordatenbanken still und leise zu einer kritischen Infrastruktur werden, die die KI-Anwendungen unterstützt, die Menschen täglich nutzen.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Warum wir Zilliz Cloud gebaut haben: Vektordatenbank der Enterprise-Klasse als Service<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist Open-Source und kostenlos zu verwenden. Der Betrieb von Milvus im Unternehmensmaßstab erfordert jedoch tiefgreifendes Fachwissen und erhebliche Ressourcen. Indexauswahl, Speicherverwaltung, Skalierungsstrategien, Sicherheitskonfigurationen - das sind keine trivialen Entscheidungen. Viele Teams wollen die Leistung von Milvus ohne die betriebliche Komplexität und mit Unternehmensunterstützung, SLA-Garantien usw.</p>
<p>Aus diesem Grund haben wir <a href="https://zilliz.com/cloud">Zilliz Cloud</a>entwickelt <a href="https://zilliz.com/cloud">- eine</a>vollständig verwaltete Version von Milvus, die in 25 globalen Regionen und 5 großen Clouds, darunter AWS, GCP und Azure, bereitgestellt wird und speziell für KI-Workloads im Unternehmensmaßstab entwickelt wurde, die Leistung, Sicherheit und Zuverlässigkeit erfordern.</p>
<p>Das macht Zilliz Cloud so anders:</p>
<ul>
<li><p><strong>Massive Skalierung mit hoher Leistung:</strong> Unsere firmeneigene KI-gestützte AutoIndex-Engine liefert 3 bis 5 Mal schnellere Abfragegeschwindigkeiten als die Open-Source-Engine Milvus, ohne dass ein Index-Tuning erforderlich ist. Die Cloud-native Architektur unterstützt Milliarden von Vektoren und Zehntausende von gleichzeitigen Abfragen, während die Antwortzeiten unter einer Sekunde liegen.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Integrierte Sicherheit und Compliance</strong></a><strong>:</strong> Verschlüsselung im Ruhezustand und bei der Übertragung, fein abgestufte RBAC, umfassende Audit-Protokollierung, SAML/OAuth2.0-Integration und <a href="https://zilliz.com/bring-your-own-cloud">BYOC-Bereitstellungen</a> (Bring Your Own Cloud). Wir sind konform mit GDPR, HIPAA und anderen globalen Standards, die Unternehmen tatsächlich benötigen.</p></li>
<li><p><strong>Optimiert für Kosteneffizienz:</strong> Abgestufter Hot/Cold-Datenspeicher, elastische Skalierung, die auf reale Arbeitslasten reagiert, und Pay-as-you-go-Preise können die Gesamtbetriebskosten im Vergleich zu selbst verwalteten Bereitstellungen um 50 % oder mehr senken.</p></li>
<li><p><strong>Echte Cloud-Agnostik ohne Anbieterbindung:</strong> Stellen Sie auf AWS, Azure, GCP, Alibaba Cloud oder Tencent Cloud bereit, ohne sich an einen bestimmten Anbieter zu binden. Wir gewährleisten globale Konsistenz und Skalierbarkeit, unabhängig davon, wo Sie arbeiten.</p></li>
</ul>
<p>Diese Funktionen klingen vielleicht nicht spektakulär, aber sie lösen echte, alltägliche Probleme, mit denen Unternehmensteams bei der Erstellung von KI-Anwendungen im großen Maßstab konfrontiert sind. Und das Wichtigste: Unter der Haube steckt immer noch Milvus, so dass es keine proprietäre Bindung oder Kompatibilitätsprobleme gibt.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">Was kommt als Nächstes? Vector Data Lake<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben den Begriff &quot;<a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbank</a>&quot; geprägt und waren die ersten, die eine solche Datenbank gebaut haben, aber das ist noch nicht alles. Jetzt bauen wir die nächste Evolutionsstufe: <strong>Vector Data Lake.</strong></p>
<p><strong>Das Problem, das wir lösen, ist folgendes: Nicht jede Vektorsuche benötigt eine Latenzzeit von einer Millisekunde.</strong> Viele Unternehmen verfügen über riesige Datensätze, die gelegentlich abgefragt werden, z. B. für die Analyse historischer Dokumente, Batch-Ähnlichkeitsberechnungen und langfristige Trendanalysen. Für diese Anwendungsfälle ist eine herkömmliche Echtzeit-Vektordatenbank sowohl überflüssig als auch teuer.</p>
<p>Vector Data Lake verwendet eine Architektur mit getrenntem Speicher und Rechenleistung, die speziell für große, selten abgefragte Vektordaten optimiert ist, wobei die Kosten deutlich unter denen von Echtzeitsystemen liegen.</p>
<p><strong>Zu den Kernfunktionen gehören:</strong></p>
<ul>
<li><p><strong>Einheitlicher Datenstapel:</strong> Verbindet nahtlos Online- und Offline-Datenebenen mit konsistenten Formaten und effizienter Speicherung, so dass Sie Daten zwischen Hot- und Cold-Tiers ohne Neuformatierung oder komplexe Migrationen verschieben können.</p></li>
<li><p><strong>Kompatibles Ökosystem:</strong> Arbeitet nativ mit Frameworks wie Spark und Ray und unterstützt alles von der Vektorsuche bis hin zu herkömmlichem ETL und Analysen. Das bedeutet, dass Ihre bestehenden Datenteams mit Vektordaten arbeiten können, indem sie Tools verwenden, die sie bereits kennen.</p></li>
<li><p><strong>Kostenoptimierte Architektur:</strong> Heiße Daten verbleiben auf SSD oder NVMe für schnellen Zugriff; kalte Daten werden automatisch auf Objektspeicher wie S3 verschoben. Intelligente Indizierungs- und Speicherstrategien sorgen für schnelle E/A, wenn Sie sie brauchen, und machen die Speicherkosten vorhersehbar und erschwinglich.</p></li>
</ul>
<p>Hier geht es nicht darum, Vektordatenbanken zu ersetzen, sondern darum, Unternehmen das richtige Tool für jede Arbeitslast zur Verfügung zu stellen. Echtzeitsuche für benutzerorientierte Anwendungen, kostengünstige Vektordatenseen für Analysen und historische Verarbeitung.</p>
<p>Wir glauben immer noch an die Logik des Mooreschen Gesetzes und des Jevons'schen Paradoxons: Wenn die Stückkosten der Datenverarbeitung sinken, steigt die Akzeptanz. Das Gleiche gilt für die Vektorinfrastruktur.</p>
<p>Durch die Verbesserung von Indizes, Speicherstrukturen, Caching und Bereitstellungsmodellen - Tag für Tag - hoffen wir, die KI-Infrastruktur für alle zugänglicher und erschwinglicher zu machen und dazu beizutragen, unstrukturierte Daten in die KI-native Zukunft zu führen.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Ein großes Dankeschön an Sie alle!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Die über 35.000 Sterne sind etwas, auf das wir wirklich stolz sind: eine Gemeinschaft von Entwicklern, die Milvus nützlich genug finden, um es weiterzuempfehlen und zu unterstützen.</p>
<p>Aber wir sind noch nicht fertig. Milvus hat noch Fehler zu beheben, die Leistung zu verbessern und Funktionen, nach denen unsere Community gefragt hat. Unsere Roadmap ist öffentlich, und wir sind sehr daran interessiert, von Ihnen zu erfahren, was wir priorisieren sollen.</p>
<p>Die Zahl selbst ist nicht das, was zählt - es ist das Vertrauen, das diese Sterne repräsentieren. Vertrauen Sie darauf, dass wir weiterhin offen bauen, auf Ihr Feedback hören und Milvus weiter verbessern werden.</p>
<ul>
<li><p><strong>An unsere Mitwirkenden:</strong> Ihre PRs, Fehlerberichte und Dokumentationsverbesserungen machen Milvus jeden Tag besser. Vielen Dank dafür.</p></li>
<li><p><strong>An unsere Benutzer:</strong> Danke, dass Sie uns Ihre Arbeitslasten anvertrauen und für Ihr Feedback, das uns ehrlich macht.</p></li>
<li><p><strong>An unsere Community:</strong> Vielen Dank für die Beantwortung von Fragen, die Organisation von Veranstaltungen und die Unterstützung von Neueinsteigern beim Einstieg.</p></li>
</ul>
<p>Wenn Sie neu im Bereich der Vektordatenbanken sind, helfen wir Ihnen gerne bei Ihren ersten Schritten. Wenn Sie bereits Milvus oder Zilliz Cloud verwenden, würden wir uns freuen, <a href="https://zilliz.com/share-your-story">von Ihren Erfahrungen zu hören</a>. Und wenn Sie einfach nur neugierig sind, was wir bauen, sind unsere Community-Kanäle immer offen.</p>
<p>Lassen Sie uns gemeinsam die Infrastruktur aufbauen, die KI-Anwendungen möglich macht.</p>
<hr>
<p>Finden Sie uns hier: <a href="https://github.com/milvus-io/milvus">Milvus auf GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>

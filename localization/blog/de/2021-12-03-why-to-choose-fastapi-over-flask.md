---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: Warum FastAPI statt Flask wählen?
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: das passende Framework für Ihr Anwendungsszenario auswählen
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>Um Ihnen den Einstieg in Milvus, die Open-Source-Vektordatenbank, zu erleichtern, haben wir ein weiteres Open-Source-Projekt, <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>, auf GitHub veröffentlicht. Das Milvus Bootcamp stellt nicht nur Skripte und Daten für Benchmark-Tests zur Verfügung, sondern enthält auch Projekte, die Milvus nutzen, um einige MVPs (Minimum Viable Products) zu bauen, wie z. B. ein System zur umgekehrten Bildsuche, ein Videoanalysesystem, einen QA-Chatbot oder ein Empfehlungssystem. Im Milvus Bootcamp können Sie lernen, wie man die Vektorähnlichkeitssuche in einer Welt voller unstrukturierter Daten anwendet und praktische Erfahrungen sammeln.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Wir bieten sowohl Front-End- als auch Back-End-Dienste für die Projekte in Milvus Bootcamp an. Allerdings haben wir vor kurzem die Entscheidung getroffen, das verwendete Web-Framework von Flask auf FastAPI umzustellen.</p>
<p>In diesem Artikel möchten wir unsere Beweggründe für den Wechsel des Web-Frameworks für Milvus Bootcamp erläutern und erklären, warum wir uns für FastAPI statt Flask entschieden haben.</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Web-Frameworks für Python<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein Web-Framework bezieht sich auf eine Sammlung von Paketen oder Modulen. Es handelt sich dabei um eine Reihe von Softwarearchitekturen für die Webentwicklung, die es Ihnen ermöglichen, Webanwendungen oder -dienste zu schreiben, und Ihnen die Mühe ersparen, sich mit Details auf niedriger Ebene wie Protokollen, Sockets oder Prozess-/Thread-Management zu beschäftigen. Die Verwendung von Web-Frameworks kann die Arbeitsbelastung bei der Entwicklung von Webanwendungen erheblich reduzieren, da Sie Ihren Code einfach in das Framework "einfügen" können, ohne sich um Daten-Caching, Datenbankzugriff und Datensicherheitsüberprüfung kümmern zu müssen. Weitere Informationen darüber, was ein Web-Framework für Python ist, finden Sie unter <a href="https://wiki.python.org/moin/WebFrameworks">Web-Frameworks</a>.</p>
<p>Es gibt verschiedene Arten von Python-Web-Frameworks. Zu den gängigsten gehören Django, Flask, Tornado und FastAPI.</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a> ist ein leichtgewichtiges Microframework für Python mit einem einfachen und leicht zu verwendenden Kern, mit dem Sie Ihre eigenen Webanwendungen entwickeln können. Darüber hinaus ist der Kern von Flask auch erweiterbar. Daher unterstützt Flask die On-Demand-Erweiterung verschiedener Funktionen, um Ihre persönlichen Bedürfnisse bei der Entwicklung von Webanwendungen zu erfüllen. Das heißt, dass Sie mit einer Bibliothek verschiedener Plug-ins in Flask leistungsstarke Websites entwickeln können.</p>
<p>Flask hat die folgenden Eigenschaften:</p>
<ol>
<li>Flask ist ein Microframework, das nicht auf andere spezifische Tools oder Komponenten von Drittanbieter-Bibliotheken angewiesen ist, um gemeinsame Funktionalitäten bereitzustellen. Flask verfügt nicht über eine Datenbankabstraktionsschicht und erfordert keine Formularvalidierung. Flask ist jedoch in hohem Maße erweiterbar und unterstützt das Hinzufügen von Anwendungsfunktionalität in einer Weise, die den Implementierungen in Flask selbst ähnelt. Zu den relevanten Erweiterungen gehören objektrelationale Mapper, Formularvalidierung, Upload-Verarbeitung, offene Authentifizierungstechnologien und einige gängige Tools, die für Web-Frameworks entwickelt wurden.</li>
<li>Flask ist ein Webanwendungs-Framework, das auf <a href="https://wsgi.readthedocs.io/">WSGI</a> (Web Server Gateway Interface) basiert. WSGI ist eine einfache Schnittstelle, die einen Webserver mit einer Webanwendung oder einem für die Sprache Python definierten Framework verbindet.</li>
<li>Flask enthält zwei zentrale Funktionsbibliotheken, <a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a> und <a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>. Werkzeug ist ein WSGI-Toolkit, das Request- und Response-Objekte sowie praktische Funktionen implementiert, mit denen Sie darauf aufbauend Web-Frameworks erstellen können. Jinja2 ist eine populäre Templating-Engine mit vollem Funktionsumfang für Python. Sie bietet volle Unterstützung für Unicode und eine optionale, aber weit verbreitete integrierte Sandbox-Ausführungsumgebung.</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a> ist ein modernes Python-Framework für Webanwendungen, das die gleiche hohe Leistung wie Go und NodeJS bietet. Der Kern von FastAPI basiert auf <a href="https://www.starlette.io/">Starlette</a> und <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>. Starlette ist ein leichtgewichtiges <a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface)-Framework-Toolkit zur Erstellung hochleistungsfähiger <a href="https://docs.python.org/3/library/asyncio.html">Asyncio-Dienste</a>. Pydantic ist eine Bibliothek, die Datenvalidierung, Serialisierung und Dokumentation auf der Grundlage von Python-Typ-Hinweisen definiert.</p>
<p>FastAPI hat die folgenden Eigenschaften:</p>
<ol>
<li>FastAPI ist ein Webanwendungs-Framework, das auf ASGI basiert, einer asynchronen Gateway-Protokollschnittstelle, die Netzwerkprotokolldienste und Python-Anwendungen verbindet. FastAPI kann eine Vielzahl gängiger Protokolltypen verarbeiten, darunter HTTP, HTTP2 und WebSocket.</li>
<li>FastAPI basiert auf Pydantic, das die Funktion der Überprüfung des Schnittstellendatentyps bietet. Sie brauchen Ihre Schnittstellenparameter nicht zusätzlich zu überprüfen oder zusätzlichen Code zu schreiben, um zu überprüfen, ob die Parameter leer sind oder ob der Datentyp korrekt ist. Durch die Verwendung von FastAPI können menschliche Fehler im Code vermieden und die Entwicklungseffizienz verbessert werden.</li>
<li>FastAPI unterstützt Dokumente in zwei Formaten - <a href="https://swagger.io/specification/">OpenAPI</a> (früher Swagger) und <a href="https://www.redoc.com/">Redoc</a>. Daher müssen Sie als Benutzer keine zusätzliche Zeit mit dem Schreiben zusätzlicher Schnittstellendokumente verbringen. Das von FastAPI bereitgestellte OpenAPI-Dokument ist im folgenden Screenshot dargestellt.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask vs. FastAPI</h3><p>Die folgende Tabelle zeigt die Unterschiede zwischen Flask und FastAPI in verschiedenen Aspekten.</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Interface-Gateway</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>Asynchroner Rahmen</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Leistung</strong></td><td>Schneller</td><td>Langsamer</td></tr>
<tr><td><strong>Interaktives Dokument</strong></td><td>OpenAPI, Redoc</td><td>Keine</td></tr>
<tr><td><strong>Überprüfung der Daten</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>Entwicklungskosten</strong></td><td>Niedriger</td><td>Höher</td></tr>
<tr><td><strong>Benutzerfreundlichkeit</strong></td><td>Niedriger</td><td>Höher</td></tr>
<tr><td><strong>Flexibilität</strong></td><td>Weniger flexibel</td><td>Flexibler</td></tr>
<tr><td><strong>Gemeinschaft</strong></td><td>Kleiner</td><td>Aktiver</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">Warum FastAPI?<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns für ein Python-Webanwendungs-Framework für die Projekte im Milvus Bootcamp entschieden haben, haben wir mehrere Mainstream-Frameworks wie Django, Flask, FastAPI, Tornado und andere untersucht. Da die Projekte im Milvus Bootcamp als Referenzen für Sie dienen, ist es unsere Priorität, ein externes Framework von größtmöglicher Leichtigkeit und Geschicklichkeit zu wählen. Nach dieser Regel haben wir unsere Wahl auf Flask und FastAPI eingegrenzt.</p>
<p>Den Vergleich zwischen den beiden Web-Frameworks können Sie im vorherigen Abschnitt sehen. Im Folgenden wird unsere Motivation, FastAPI gegenüber Flask für die Projekte im Milvus Bootcamp zu bevorzugen, ausführlich erläutert. Dafür gibt es mehrere Gründe:</p>
<h3 id="1-Performance" class="common-anchor-header">1. Leistung</h3><p>Die meisten der Projekte im Milvus Bootcamp sind um umgekehrte Bildsuchsysteme, QA-Chatbots und Textsuchmaschinen herum aufgebaut, die alle hohe Anforderungen an die Echtzeit-Datenverarbeitung stellen. Dementsprechend benötigen wir ein Framework mit hervorragender Leistung, was genau ein Highlight von FastAPI ist. Daher haben wir uns unter dem Gesichtspunkt der Systemleistung für FastAPI entschieden.</p>
<h3 id="2-Efficiency" class="common-anchor-header">2. Effizienz</h3><p>Bei der Verwendung von Flask müssen Sie Code für die Datentypüberprüfung in jeder der Schnittstellen schreiben, damit das System feststellen kann, ob die Eingabedaten leer sind oder nicht. Durch die Unterstützung der automatischen Datentypüberprüfung trägt FastAPI jedoch dazu bei, menschliche Fehler bei der Programmierung während der Systementwicklung zu vermeiden, und kann die Entwicklungseffizienz erheblich steigern. Das Bootcamp ist als eine Art Schulungsressource positioniert. Das bedeutet, dass der Code und die Komponenten, die wir verwenden, intuitiv und hocheffizient sein müssen. In dieser Hinsicht haben wir uns für FastAPI entschieden, um die Systemeffizienz zu steigern und die Benutzererfahrung zu verbessern.</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3. Asynchroner Rahmen</h3><p>FastAPI ist von Natur aus ein asynchrones Framework. Ursprünglich haben wir vier <a href="https://zilliz.com/milvus-demos?isZilliz=true">Demos</a> veröffentlicht: umgekehrte Bildsuche, Videoanalyse, QA Chatbot und molekulare Ähnlichkeitssuche. In diesen Demos können Sie Datensätze hochladen und erhalten sofort die Meldung &quot;Anfrage erhalten&quot;. Wenn die Daten in das Demosystem hochgeladen wurden, erhalten Sie eine weitere Meldung &quot;Datenupload erfolgreich&quot;. Dies ist ein asynchroner Prozess, der ein Framework erfordert, das diese Funktion unterstützt. FastAPI ist selbst ein asynchrones Framework. Um alle Milvus-Ressourcen aufeinander abzustimmen, haben wir beschlossen, einen einzigen Satz von Entwicklungswerkzeugen und Software sowohl für das Milvus Bootcamp als auch für die Milvus-Demos zu verwenden. Infolgedessen haben wir das Framework von Flask auf FastAPI umgestellt.</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4. Automatische interaktive Dokumente</h3><p>Wenn Sie auf herkömmliche Weise den Code für die Serverseite fertig geschrieben haben, müssen Sie ein zusätzliches Dokument schreiben, um eine Schnittstelle zu erstellen, und dann Tools wie <a href="https://www.postman.com/">Postman</a> für API-Tests und Debugging verwenden. Was also, wenn Sie nur schnell mit dem Webserver-seitigen Entwicklungsteil der Projekte in Milvus Bootcamp beginnen wollen, ohne zusätzlichen Code zur Erstellung einer Schnittstelle zu schreiben? FastAPI ist die Lösung. Durch die Bereitstellung eines OpenAPI-Dokuments erspart Ihnen FastAPI das Testen oder Debuggen von APIs und die Zusammenarbeit mit Front-End-Teams zur Entwicklung einer Benutzeroberfläche. Mit FastAPI können Sie die erstellte Anwendung mit einer automatischen, aber intuitiven Schnittstelle ohne zusätzlichen Programmieraufwand schnell testen.</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5. Benutzerfreundlichkeit</h3><p>FastAPI ist einfacher zu bedienen und zu entwickeln, so dass Sie sich mehr auf die konkrete Umsetzung des Projekts konzentrieren können. Ohne zu viel Zeit auf die Entwicklung von Web-Frameworks zu verwenden, können Sie sich mehr auf das Verständnis der Projekte in Milvus Bootcamp konzentrieren.</p>
<h2 id="Recap" class="common-anchor-header">Rekapitulation<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask und FlastAPI haben ihre eigenen Vor- und Nachteile. FlastAPI ist ein aufstrebendes Webanwendungs-Framework, das im Kern auf ausgereiften Toolkits und Bibliotheken wie Starlette und Pydantic aufbaut. FastAPI ist ein asynchrones Framework mit hoher Leistung. Seine Geschicklichkeit, Erweiterbarkeit und Unterstützung für die automatische Datentypüberprüfung sowie viele andere leistungsstarke Funktionen haben uns veranlasst, FastAPI als Framework für Milvus-Bootcamp-Projekte einzusetzen.</p>
<p>Bitte beachten Sie, dass Sie das passende Framework für Ihr Anwendungsszenario wählen sollten, wenn Sie ein Vektorähnlichkeitssuchsystem in der Produktion aufbauen wollen.</p>
<h2 id="About-the-author" class="common-anchor-header">Über den Autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, hat einen Abschluss in Informatik von der Huazhong University of Science and Technology. Seit sie bei Zilliz ist, arbeitet sie an der Erforschung von Lösungen für das Open-Source-Projekt Milvus und hilft Benutzern, Milvus in realen Szenarien anzuwenden. Ihr Hauptaugenmerk liegt auf NLP und Empfehlungssystemen, und sie möchte ihren Fokus auf diese beiden Bereiche weiter vertiefen. Sie verbringt gerne Zeit alleine und liest.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Suchen Sie nach weiteren Ressourcen?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Beginnen Sie mit der Erstellung von KI-Systemen mit Milvus und sammeln Sie mehr praktische Erfahrung, indem Sie unsere Tutorials lesen!</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">Was ist sie? Wer ist sie? Milvus hilft bei der intelligenten Analyse von Videos</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Kombinieren Sie AI-Modelle für die Bildsuche mit ONNX und Milvus</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">DNA-Sequenz-Klassifizierung auf Basis von Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Audio-Retrieval auf Basis von Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Schritte zum Aufbau eines Video-Suchsystems</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Aufbau eines intelligenten QA-Systems mit NLP und Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Beschleunigung der Entdeckung von neuen Medikamenten</a></li>
</ul></li>
<li><p>Beteiligen Sie sich an unserer Open-Source-Community:</p>
<ul>
<li>Finden Sie Milvus auf <a href="https://bit.ly/307b7jC">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über das <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>

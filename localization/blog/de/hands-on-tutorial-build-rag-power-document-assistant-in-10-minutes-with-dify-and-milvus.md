---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Praktisches Tutorial: Mit Dify und Milvus in 10 Minuten einen RAG-gestützten
  Dokumenten-Assistenten erstellen
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Lernen Sie in diesem kurzen, praxisnahen Entwicklertutorial, wie Sie mit Dify
  und Milvus einen KI-gestützten Dokumentenassistenten mit Retrieval Augmented
  Generation (RAG) erstellen.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Was wäre, wenn Sie Ihre gesamte Dokumentationsbibliothek - Tausende von Seiten technischer Spezifikationen, interner Wikis und Codedokumentation - in einen intelligenten KI-Assistenten verwandeln könnten, der spezifische Fragen sofort beantwortet?</p>
<p>Und noch besser: Was wäre, wenn Sie diesen Assistenten in weniger Zeit erstellen könnten, als es dauert, einen Merge-Konflikt zu beheben?</p>
<p>Das ist das Versprechen von <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation</a> (RAG), wenn es richtig umgesetzt wird.</p>
<p>ChatGPT und andere LLMs sind zwar beeindruckend, stoßen aber schnell an ihre Grenzen, wenn es um die spezifische Dokumentation, Codebasis oder Wissensbasis Ihres Unternehmens geht. RAG überbrückt diese Lücke, indem es Ihre firmeneigenen Daten in die Konversation einbezieht und Ihnen KI-Funktionen zur Verfügung stellt, die für Ihre Arbeit direkt relevant sind.</p>
<p>Das Problem dabei? Die traditionelle RAG-Implementierung sieht so aus:</p>
<ul>
<li><p>Schreiben von benutzerdefinierten Pipelines zur Erzeugung von Einbettungen</p></li>
<li><p>Konfigurieren und Bereitstellen einer Vektordatenbank</p></li>
<li><p>Entwicklung komplexer Prompt-Vorlagen</p></li>
<li><p>Erstellung von Abfragelogik und Ähnlichkeitsschwellenwerten</p></li>
<li><p>Erstellen einer benutzbaren Schnittstelle</p></li>
</ul>
<p>Aber was wäre, wenn Sie direkt zu den Ergebnissen springen könnten?</p>
<p>In diesem Tutorial werden wir eine einfache RAG-Anwendung mit zwei auf Entwickler fokussierten Tools erstellen:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Eine Open-Source-Plattform, die die RAG-Orchestrierung mit minimaler Konfiguration handhabt</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: Eine blitzschnelle Open-Source-Vektordatenbank, die speziell für die Ähnlichkeitssuche und KI-Suchen entwickelt wurde</p></li>
</ul>
<p>Am Ende dieses 10-minütigen Leitfadens werden Sie einen funktionierenden KI-Assistenten haben, der detaillierte Fragen zu jeder beliebigen Dokumentensammlung beantworten kann - ein Abschluss in Maschinellem Lernen ist nicht erforderlich.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Was Sie bauen werden<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>In nur wenigen Minuten aktiver Arbeit werden Sie Folgendes erstellen</p>
<ul>
<li><p>eine Dokumentenverarbeitungspipeline, die jedes PDF-Dokument in abfragbares Wissen umwandelt</p></li>
<li><p>Ein Vektorsuchsystem, das genau die richtigen Informationen findet</p></li>
<li><p>Eine Chatbot-Schnittstelle, die technische Fragen punktgenau beantwortet</p></li>
<li><p>Eine einsatzfähige Lösung, die Sie in Ihre vorhandenen Tools integrieren können</p></li>
</ul>
<p>Und das Beste daran? Das meiste davon wird über eine einfache Benutzeroberfläche (UI) konfiguriert und nicht über benutzerdefinierten Code.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Was Sie benötigen<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Grundlegende Docker-Kenntnisse (einfaches Niveau <code translate="no">docker-compose up -d</code> )</p></li>
<li><p>Einen OpenAI-API-Schlüssel</p></li>
<li><p>Ein PDF-Dokument, mit dem Sie experimentieren können (wir werden ein Forschungspapier verwenden)</p></li>
</ul>
<p>Sind Sie bereit, etwas wirklich Nützliches in Rekordzeit zu erstellen? Legen wir los!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Erstellen Ihrer RAG-Anwendung mit Milvus und Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>In diesem Abschnitt werden wir eine einfache RAG-Anwendung mit Dify erstellen, in der wir Fragen zu den in einem Forschungspapier enthaltenen Informationen stellen können. Für das Forschungspapier können Sie jedes beliebige Papier verwenden; in diesem Fall werden wir jedoch das berühmte Papier &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot; verwenden, das uns in die Transformer-Architektur eingeführt hat.</p>
<p>Wir werden Milvus als unseren Vektorspeicher verwenden, in dem wir alle notwendigen Kontexte speichern werden. Für das Einbettungsmodell und das LLM werden wir Modelle von OpenAI verwenden. Daher müssen wir zunächst einen OpenAI-API-Schlüssel einrichten.<a href="https://platform.openai.com/docs/quickstart"> Hier</a> erfahren Sie mehr über die Einrichtung des Schlüssels.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Schritt 1: Starten von Dify und Milvus Containern</h3><p>In diesem Beispiel werden wir Dify mit Docker Compose selbst hosten. Vergewissern Sie sich daher, bevor wir beginnen, dass Docker auf Ihrem lokalen Rechner installiert ist. Wenn dies nicht der Fall ist, installieren Sie Docker, indem Sie die<a href="https://docs.docker.com/desktop/"> Installationsseite</a> konsultieren.</p>
<p>Sobald wir Docker installiert haben, müssen wir den Dify-Quellcode mit dem folgenden Befehl auf unseren lokalen Rechner klonen:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Wechseln Sie anschließend in das Verzeichnis <code translate="no">docker</code> innerhalb des soeben geklonten Quellcodes. Kopieren Sie dort die Datei <code translate="no">.env</code> mit dem folgenden Befehl:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kurz gesagt enthält die Datei <code translate="no">.env</code> die Konfigurationen, die Sie benötigen, um Ihre Dify-App zum Laufen zu bringen, wie z. B. die Auswahl der Vektordatenbanken, die Anmeldedaten, die für den Zugriff auf Ihre Vektordatenbank erforderlich sind, die Adresse Ihrer Dify-App, usw.</p>
<p>Da wir Milvus als unsere Vektordatenbank verwenden werden, müssen wir den Wert der Variable <code translate="no">VECTOR_STORE</code> in der Datei <code translate="no">.env</code> in <code translate="no">milvus</code> ändern. Außerdem müssen wir die Variable <code translate="no">MILVUS_URI</code> in <code translate="no">http://host.docker.internal:19530</code> ändern, um sicherzustellen, dass es später nach der Bereitstellung keine Kommunikationsprobleme zwischen Docker-Containern gibt.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nun sind wir bereit, die Docker-Container zu starten. Dazu müssen wir nur noch den Befehl <code translate="no">docker compose up -d</code> ausführen. Nach Beendigung des Befehls sehen Sie in Ihrem Terminal eine ähnliche Ausgabe wie unten:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Mit dem Befehl <code translate="no">docker compose ps</code> können wir den Status aller Container überprüfen und sehen, ob sie in Ordnung sind. Wenn sie alle in Ordnung sind, sehen Sie eine Ausgabe wie unten:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Und schließlich, wenn wir<a href="http://localhost/install"> </a>http://localhost/install aufrufen, sehen wir eine Dify-Landingpage, auf der wir uns anmelden und in kürzester Zeit mit der Erstellung unserer RAG-Anwendung beginnen können.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sobald Sie sich angemeldet haben, können Sie sich einfach mit Ihren Anmeldedaten bei Dify einloggen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Schritt 2: Einrichten des OpenAI API-Schlüssels</h3><p>Das erste, was wir nach der Anmeldung bei Dify tun müssen, ist, unsere API-Schlüssel einzurichten, die wir zum Aufrufen des Einbettungsmodells und des LLMs verwenden werden. Da wir Modelle von OpenAI verwenden werden, müssen wir unseren OpenAI-API-Schlüssel in unser Profil einfügen. Gehen Sie dazu zu "Einstellungen", indem Sie mit dem Mauszeiger über Ihr Profil oben rechts auf der Benutzeroberfläche fahren, wie Sie auf dem Screenshot unten sehen können:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gehen Sie dann zu "Model Provider", bewegen Sie den Mauszeiger auf OpenAI und klicken Sie dann auf "Setup". Daraufhin wird ein Popup-Fenster angezeigt, in dem Sie aufgefordert werden, Ihren OpenAI-API-Schlüssel einzugeben. Danach sind wir bereit, Modelle von OpenAI als Einbettungsmodell und LLM zu verwenden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Schritt 3: Dokumente in die Wissensdatenbank einfügen</h3><p>Lassen Sie uns nun die Wissensbasis für unsere RAG-App speichern. Die Wissensbasis besteht aus einer Sammlung von internen Dokumenten oder Texten, die als relevanter Kontext verwendet werden können, um dem LLM zu helfen, genauere Antworten zu generieren.</p>
<p>In unserem Anwendungsfall ist unsere Wissensbasis im Wesentlichen das Papier "Attention is All You Need". Wir können das Papier jedoch aus mehreren Gründen nicht so speichern, wie es ist. Erstens ist das Papier zu lang, und dem LLM einen zu langen Kontext zu geben, würde nicht helfen, da der Kontext zu breit ist. Zweitens können wir keine Ähnlichkeitssuche durchführen, um den relevantesten Kontext zu finden, wenn unsere Eingabe aus Rohtext besteht.</p>
<p>Daher müssen wir mindestens zwei Schritte unternehmen, bevor wir unsere Arbeit in der Wissensdatenbank speichern. Zunächst müssen wir die Arbeit in Textabschnitte unterteilen und dann jeden Abschnitt mit Hilfe eines Einbettungsmodells in eine Einbettung umwandeln. Schließlich können wir diese Einbettungen in Milvus als unsere Vektordatenbank speichern.</p>
<p>Dify macht es uns leicht, die Texte in der Zeitung in Chunks aufzuteilen und sie in Einbettungen zu verwandeln. Alles, was wir tun müssen, ist, die PDF-Datei des Papiers hochzuladen, die Länge der Chunks festzulegen und das Einbettungsmodell über einen Schieberegler auszuwählen. Um all diese Schritte auszuführen, gehen Sie zu &quot;Wissen&quot; und klicken Sie auf &quot;Wissen erstellen&quot;. Anschließend werden Sie aufgefordert, die PDF-Datei von Ihrem lokalen Computer hochzuladen. Daher ist es besser, wenn Sie die Arbeit von ArXiv herunterladen und zunächst auf Ihrem Computer speichern.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nachdem wir die Datei hochgeladen haben, können wir die Chunk-Länge, die Indizierungsmethode, das gewünschte Einbettungsmodell und die Abrufeinstellungen festlegen.</p>
<p>Im Bereich "Chunk-Einstellung" können Sie eine beliebige Zahl als maximale Chunk-Länge wählen (in unserem Anwendungsfall werden wir sie auf 100 setzen). Als Nächstes müssen wir für "Indexmethode" die Option "Hohe Qualität" wählen, da wir damit eine Ähnlichkeitssuche durchführen können, um relevante Kontexte zu finden. Für "Einbettungsmodell" können Sie ein beliebiges Einbettungsmodell von OpenAI wählen, aber in diesem Beispiel werden wir das Modell "text-embedding-3-small" verwenden. Schließlich müssen wir für "Retrieval Setting" "Vector Search" wählen, da wir eine Ähnlichkeitssuche durchführen wollen, um die relevantesten Kontexte zu finden.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wenn Sie nun auf "Speichern &amp; Verarbeiten" klicken und alles gut läuft, sehen Sie ein grünes Häkchen, wie im folgenden Screenshot zu sehen ist:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Schritt 4: Erstellen der RAG-App</h3><p>Bis zu diesem Punkt haben wir erfolgreich eine Wissensbasis erstellt und sie in unserer Milvus-Datenbank gespeichert. Nun sind wir bereit, die RAG-App zu erstellen.</p>
<p>Die Erstellung der RAG-App mit Dify ist sehr einfach. Wir müssen zu "Studio" gehen, anstatt zu "Knowledge" wie zuvor, und dann auf "Create from Blank" klicken. Als Nächstes wählen Sie "Chatbot" als App-Typ und geben Ihrer App einen Namen in dem dafür vorgesehenen Feld. Wenn Sie fertig sind, klicken Sie auf "Erstellen". Nun wird die folgende Seite angezeigt:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In das Feld "Anweisung" können wir eine Systemaufforderung schreiben, z. B. "Beantworte die Frage des Benutzers kurz und bündig." Als Nächstes müssen wir unter "Kontext" auf das Symbol "Hinzufügen" klicken und dann die soeben erstellte Wissensbasis hinzufügen. Auf diese Weise wird unsere RAG-App mögliche Kontexte aus dieser Wissensdatenbank abrufen, um die Anfrage des Benutzers zu beantworten.</p>
<p>Nachdem wir nun die Wissensbasis zu unserer RAG-App hinzugefügt haben, müssen wir als Letztes die LLM von OpenAI auswählen. Dazu können Sie auf die Modellliste in der oberen rechten Ecke klicken, wie Sie auf dem Screenshot unten sehen können:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Und nun sind wir bereit, unsere RAG-Anwendung zu veröffentlichen! In der oberen rechten Ecke klicken Sie auf "Veröffentlichen". Dort finden Sie viele Möglichkeiten, unsere RAG-Anwendung zu veröffentlichen: Wir können sie einfach in einem Browser ausführen, sie auf unserer Website einbetten oder über eine API auf die Anwendung zugreifen. In diesem Beispiel werden wir unsere App einfach in einem Browser ausführen, also klicken wir auf &quot;Run App&quot;.</p>
<p>Und das war's! Jetzt können Sie den LLM alles fragen, was mit dem Papier "Attention is All You Need" oder anderen Dokumenten in unserer Wissensdatenbank zu tun hat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Sie haben nun eine funktionierende RAG-Anwendung mit Dify und Milvus erstellt, mit minimalem Code und minimaler Konfiguration. Dieser Ansatz macht die komplexe RAG-Architektur für Entwickler zugänglich, ohne dass tiefes Fachwissen über Vektordatenbanken oder LLM-Integration erforderlich ist. Die wichtigsten Erkenntnisse:</p>
<ol>
<li><strong>Geringer Aufwand für die Einrichtung</strong>: Die Verwendung von Docker Compose vereinfacht die Bereitstellung</li>
<li><strong>No-code/low-code Orchestrierung</strong>: Dify übernimmt den größten Teil der RAG-Pipeline</li>
<li><strong>Produktionsreife Vektordatenbank</strong>: Milvus bietet effiziente Speicherung und Abfrage von Einbettungen</li>
<li><strong>Erweiterbare Architektur</strong>: Einfaches Hinzufügen von Dokumenten oder Anpassen von Parametern Für den produktiven Einsatz sollten Sie Folgendes beachten:</li>
</ol>
<ul>
<li>Einrichtung der Authentifizierung für Ihre Anwendung</li>
<li>Konfiguration einer geeigneten Skalierung für Milvus (insbesondere für größere Dokumentensammlungen)</li>
<li>Implementierung einer Überwachung für Ihre Dify- und Milvus-Instanzen</li>
<li>Die Kombination von Dify und Milvus ermöglicht die schnelle Entwicklung von RAG-Anwendungen, die das interne Wissen Ihrer Organisation mit modernen großen Sprachmodellen (LLMs) effektiv nutzen können. Viel Spaß beim Bauen!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Zusätzliche Ressourcen<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dify Dokumentation</a></li>
<li><a href="https://milvus.io/docs">Milvus-Dokumentation</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Grundlagen der Vektordatenbank</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Implementierungsmuster</a></li>
</ul>

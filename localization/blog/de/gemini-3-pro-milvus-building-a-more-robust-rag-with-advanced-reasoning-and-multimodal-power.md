---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: Aufbau eines robusteren RAG mit fortgeschrittenem
  Reasoning und multimodaler Leistung
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Lernen Sie die wichtigsten Aktualisierungen in Gemini 3 Pro kennen, sehen Sie,
  wie es bei wichtigen Benchmarks abschneidet, und folgen Sie einer Anleitung
  zum Aufbau einer leistungsstarken RAG-Pipeline mit Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Googles Gemini 3 Pro wurde mit der seltenen Art von Version veröffentlicht, die die Erwartungen von Entwicklern wirklich verändert - nicht nur ein Hype, sondern Funktionen, die die Möglichkeiten von natürlichsprachlichen Schnittstellen wesentlich erweitern. Es verwandelt "Beschreiben Sie die gewünschte App" in einen ausführbaren Workflow: dynamisches Tool-Routing, mehrstufige Planung, API-Orchestrierung und interaktive UX-Generierung - alles nahtlos aneinandergereiht. Kein anderes Modell kommt der Produktionsreife von Vibe Coding so nahe wie dieses.</p>
<p>Und die Zahlen untermauern diese Aussage. Gemini 3 Pro zeigt herausragende Ergebnisse in fast allen wichtigen Benchmarks:</p>
<ul>
<li><p><strong>Humanity's Last Exam:</strong> 37,5 % ohne Tools, 45,8 % mit Tools - der nächste Konkurrent liegt bei 26,5 %.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4 %, während die meisten Modelle nicht einmal 2 % erreichen.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72,7% Genauigkeit, fast doppelt so hoch wie der nächstbeste Wert von 36,2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> Durchschnittlicher Nettowert von <strong>$5.478,16</strong>, etwa <strong>1,4×</strong> über dem zweiten Platz.</p></li>
</ul>
<p>Weitere Benchmark-Ergebnisse finden Sie in der Tabelle unten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Diese Kombination aus tiefgreifenden Schlussfolgerungen, starker Nutzung von Werkzeugen und multimodaler Gewandtheit macht Gemini 3 Pro zu einer natürlichen Lösung für die Retrieval-augmented Generation (RAG). In Kombination mit <a href="https://milvus.io/"><strong>Milvus</strong></a>, der hochleistungsfähigen Open-Source-Vektordatenbank, die für die semantische Suche in Milliardenhöhe entwickelt wurde, erhalten Sie eine Retrieval-Schicht, die Antworten begründet, sauber skaliert und auch bei hoher Arbeitslast produktionssicher bleibt.</p>
<p>In diesem Beitrag erläutern wir, was in Gemini 3 Pro neu ist, warum es die RAG-Workflows verbessert und wie Sie eine saubere, effiziente RAG-Pipeline mit Milvus als Retrieval-Backbone aufbauen können.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Wesentliche Neuerungen in Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro führt eine Reihe wesentlicher Verbesserungen ein, die die Art und Weise, wie das Modell Gründe liefert, Aufgaben erstellt und ausführt und wie es mit den Benutzern interagiert, neu gestalten. Diese Verbesserungen lassen sich in vier große Leistungsbereiche unterteilen:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Multimodales Verstehen und Reasoning</h3><p>Gemini 3 Pro stellt neue Rekorde bei wichtigen multimodalen Benchmarks auf, darunter ARC-AGI-2 für visuelles Reasoning, MMMU-Pro für cross-modales Verstehen und Video-MMMU für Videoverständnis und Wissenserwerb. Das Modell führt auch Deep Think ein, einen erweiterten Denkmodus, der eine strukturierte, mehrstufige logische Verarbeitung ermöglicht. Dies führt zu einer deutlich höheren Genauigkeit bei komplexen Problemen, bei denen herkömmliche Denkkettenmodelle versagen.</p>
<h3 id="Code-Generation" class="common-anchor-header">Code-Generierung</h3><p>Das Modell hebt die generative Kodierung auf eine neue Ebene. Gemini 3 Pro kann interaktive SVGs, vollständige Webanwendungen, 3D-Szenen und sogar funktionale Spiele - einschließlich Minecraft-ähnlicher Umgebungen und browserbasiertem Billard - mit einer einzigen natürlichsprachlichen Eingabeaufforderung erzeugen. Vor allem die Front-End-Entwicklung profitiert davon: Das Modell kann bestehende UI-Designs mit hoher Wiedergabetreue neu erstellen oder einen Screenshot direkt in produktionsreifen Code übersetzen, was die iterative UI-Arbeit erheblich beschleunigt.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">KI-Agenten und Tool-Nutzung</h3><p>Mit der Erlaubnis des Nutzers kann Gemini 3 Pro auf die Daten des Google-Geräts des Nutzers zugreifen, um langfristige, mehrstufige Aufgaben wie die Planung von Reisen oder die Buchung von Mietwagen durchzuführen. Diese Agenten-Fähigkeit spiegelt sich in seiner starken Leistung auf der <strong>Vending-Bench 2</strong> wider, einem Benchmark, der speziell für Stresstests der Tool-Nutzung mit langem Zeithorizont entwickelt wurde. Das Modell unterstützt auch professionelle Agenten-Workflows, einschließlich der Ausführung von Terminalbefehlen und der Interaktion mit externen Tools über klar definierte APIs.</p>
<h3 id="Generative-UI" class="common-anchor-header">Generative Benutzeroberfläche</h3><p>Gemini 3 Pro geht über das herkömmliche Modell mit einer Frage und einer Antwort hinaus und führt <strong>eine generative Benutzeroberfläche</strong> ein, bei der das Modell ganze interaktive Erlebnisse dynamisch aufbauen kann. Anstatt statischen Text zurückzugeben, kann es vollständig angepasste Schnittstellen generieren - zum Beispiel einen umfangreichen, anpassbaren Reiseplaner - direkt als Reaktion auf Benutzeranweisungen. Dadurch werden LLMs von passiven Ansprechpartnern zu aktiven Schnittstellengeneratoren.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Gemini 3 Pro auf dem Prüfstand<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben den Benchmark-Ergebnissen haben wir eine Reihe praktischer Tests durchgeführt, um zu verstehen, wie sich Gemini 3 Pro in realen Arbeitsabläufen verhält. Die Ergebnisse verdeutlichen, wie sein multimodales Verständnis, seine generativen Fähigkeiten und seine langfristige Planung einen praktischen Nutzen für Entwickler darstellen.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Multimodales Verständnis</h3><p>Gemini 3 Pro zeigt eine beeindruckende Vielseitigkeit in Bezug auf Text, Bilder, Video und Code. In unserem Test haben wir ein Zilliz-Video direkt von YouTube hochgeladen. Das Modell verarbeitete den gesamten Clip - einschließlich der Erzählung, der Übergänge und des Bildschirmtextes - in etwa <strong>40 Sekunden</strong>, was für lange multimodale Inhalte ungewöhnlich schnell ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die internen Auswertungen von Google zeigen ein ähnliches Verhalten: Gemini 3 Pro verarbeitete handgeschriebene Rezepte in mehreren Sprachen, transkribierte und übersetzte jedes einzelne und stellte sie in einem gemeinsam nutzbaren Familienrezeptbuch zusammen.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Null-Prozent-Aufgaben</h3><p>Gemini 3 Pro kann vollständig interaktive Web-UIs generieren, ohne dass zuvor Beispiele oder ein Gerüst erstellt wurden. Als wir aufgefordert wurden, ein ausgefeiltes, retro-futuristisches <strong>3D-Raumschiff-Webspiel</strong> zu erstellen, produzierte das Modell eine komplette interaktive Szene: ein neonlila Raster, Schiffe im Cyberpunk-Stil, leuchtende Partikeleffekte und flüssige Kamerasteuerung - alles in einer einzigen Zero-Shot-Antwort.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Komplexe Aufgabenplanung</h3><p>Das Modell zeigt auch eine bessere langfristige Aufgabenplanung als viele seiner Konkurrenten. In unserem Posteingangstest verhielt sich Gemini 3 Pro ähnlich wie ein KI-Verwaltungsassistent: Er kategorisierte unübersichtliche E-Mails in Projektkategorien, erstellte umsetzbare Vorschläge (Antwort, Wiedervorlage, Archiv) und präsentierte eine saubere, strukturierte Zusammenfassung. Wenn der Plan des Modells feststand, konnte der gesamte Posteingang mit einem einzigen Bestätigungsklick geleert werden.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Wie man ein RAG-System mit Gemini 3 Pro und Milvus aufbaut<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro ist mit seiner verbesserten Argumentation, seinem multimodalen Verständnis und seinen starken Fähigkeiten zur Werkzeugnutzung eine hervorragende Grundlage für leistungsstarke RAG-Systeme.</p>
<p>In Kombination mit <a href="https://milvus.io/"><strong>Milvus</strong></a>, der leistungsstarken Open-Source-Vektordatenbank für die semantische Suche in großem Maßstab, erhalten Sie eine klare Aufgabenteilung: Gemini 3 Pro kümmert sich um die <strong>Interpretation, die Schlussfolgerungen und die Generierung</strong>, während Milvus eine <strong>schnelle, skalierbare Abrufschicht</strong> bereitstellt, die die Antworten auf Ihre Unternehmensdaten abstimmt. Diese Kombination eignet sich hervorragend für produktionsreife Anwendungen wie interne Wissensdatenbanken, Dokumentenassistenten, Kunden-Support-Kopiloten und domänenspezifische Expertensysteme.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><p>Bevor Sie Ihre RAG-Pipeline erstellen, stellen Sie sicher, dass die folgenden Python-Bibliotheken installiert sind oder auf die neuesten Versionen aktualisiert wurden:</p>
<ul>
<li><p><strong>pymilvus</strong> - das offizielle Milvus Python SDK</p></li>
<li><p><strong>google-generativeai</strong> - die Gemini 3 Pro Client-Bibliothek</p></li>
<li><p><strong>requests</strong> - für die Verarbeitung von HTTP-Aufrufen, falls erforderlich</p></li>
<li><p><strong>tqdm</strong> - für Fortschrittsbalken während der Aufnahme von Datensätzen</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Melden Sie sich anschließend bei <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> an, um Ihren API-Schlüssel zu erhalten.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Vorbereiten des Datensatzes</h3><p>Für dieses Tutorial verwenden wir den FAQ-Abschnitt aus der Milvus 2.4.x Dokumentation als private Wissensbasis für unser RAG-System.</p>
<p>Laden Sie das Dokumentationsarchiv herunter und entpacken Sie es in einen Ordner namens <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Laden Sie alle Markdown-Dateien aus dem Pfad <code translate="no">milvus_docs/en/faq</code>. Für jedes Dokument wenden wir eine einfache Aufteilung an, die auf <code translate="no">#</code> Überschriften basiert, um die Hauptabschnitte innerhalb jeder Markdown-Datei grob zu trennen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLM und Einbettungsmodell einrichten</h3><p>Für dieses Lernprogramm verwenden wir <code translate="no">gemini-3-pro-preview</code> als LLM und <code translate="no">text-embedding-004</code> als Einbettungsmodell.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Antwort des Modells: Ich bin Gemini, ein großes Sprachmodell, das von Google entwickelt wurde.</p>
<p>Sie können eine schnelle Überprüfung durchführen, indem Sie eine Testeinbettung erzeugen und deren Dimensionalität zusammen mit den ersten Werten ausgeben:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Testvektor-Ausgabe:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Laden von Daten in Milvus</h3><p><strong>Erstellen einer Sammlung</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Bei der Erstellung einer <code translate="no">MilvusClient</code> können Sie je nach Umfang und Umgebung aus drei Konfigurationsoptionen wählen:</p>
<ul>
<li><p><strong>Lokaler Modus (Milvus Lite):</strong> Setzen Sie den URI auf einen lokalen Dateipfad (z. B. <code translate="no">./milvus.db</code>). Dies ist der einfachste Weg, um loszulegen - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> speichert automatisch alle Daten in dieser Datei.</p></li>
<li><p><strong>Selbstgehostetes Milvus (Docker oder Kubernetes):</strong> Für größere Datensätze oder Produktions-Workloads können Sie Milvus auf Docker oder Kubernetes ausführen. Setzen Sie die URI auf Ihren Milvus-Server-Endpunkt, z. B. <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (der vollständig verwaltete Milvus-Dienst):</strong> Wenn Sie eine verwaltete Lösung bevorzugen, verwenden Sie Zilliz Cloud. Setzen Sie den URI auf Ihren öffentlichen Endpunkt und geben Sie Ihren API-Schlüssel als Authentifizierungstoken an.</p></li>
</ul>
<p>Bevor Sie eine neue Sammlung erstellen, prüfen Sie zunächst, ob sie bereits existiert. Falls ja, löschen Sie sie und erstellen Sie sie neu, um eine saubere Einrichtung zu gewährleisten.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Erstellen Sie eine neue Sammlung mit den angegebenen Parametern.</p>
<p>Wenn kein Schema angegeben wird, generiert Milvus automatisch ein Standard-ID-Feld als Primärschlüssel und ein Vektorfeld zum Speichern von Einbettungen. Es bietet auch ein reserviertes dynamisches JSON-Feld, das alle zusätzlichen Felder erfasst, die nicht im Schema definiert sind.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Daten einfügen</strong></p>
<p>Iterieren Sie jeden Texteintrag, erzeugen Sie seinen Einbettungsvektor und fügen Sie die Daten in Milvus ein. In diesem Beispiel fügen wir ein zusätzliches Feld namens <code translate="no">text</code> ein. Da es im Schema nicht vordefiniert ist, speichert Milvus es automatisch unter Verwendung des dynamischen JSON-Feldes, ohne dass zusätzliche Einstellungen erforderlich sind.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Beispielhafte Ausgabe:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Aufbau des RAG-Workflows</h3><p><strong>Relevante Daten abrufen</strong></p>
<p>Um den Abruf zu testen, stellen wir eine häufig gestellte Frage über Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Durchsuchen Sie die Sammlung nach der Anfrage und geben Sie die 3 relevantesten Ergebnisse zurück.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Die Ergebnisse werden in der Reihenfolge der Ähnlichkeit zurückgegeben, von der größten bis zur geringsten Ähnlichkeit.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Erzeugen einer RAG-Antwort mit dem LLM</strong></p>
<p>Nach dem Abrufen der Dokumente konvertieren Sie diese in ein String-Format</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Versehen Sie den LLM mit einem Systemprompt und einem Benutzerprompt, die beide aus den von Milvus abgerufenen Dokumenten erstellt wurden.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verwenden Sie das Modell <code translate="no">gemini-3-pro-preview</code> zusammen mit diesen Prompts, um die endgültige Antwort zu generieren.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Anhand der Ausgabe können Sie sehen, dass Gemini 3 Pro eine klare, gut strukturierte Antwort auf der Grundlage der abgerufenen Informationen erzeugt.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweis</strong>: Gemini 3 Pro ist derzeit nicht für Free-Tier-Benutzer verfügbar. Klicken Sie <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">hier</a> für weitere Details.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sie können stattdessen über <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a> darauf zugreifen:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">One More Thing: Vibe Coding mit Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusammen mit Gemini 3 Pro stellte Google <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a> vor, eine Videocoding-Plattform, die autonom mit Ihrem Editor, Terminal und Browser interagiert. Im Gegensatz zu früheren KI-unterstützten Tools, die nur einzelne Anweisungen verarbeiten, arbeitet Antigravity auf einer aufgabenorientierten Ebene - Entwickler können angeben <em>, was</em> sie erstellen möchten, während das System das <em>"Wie"</em> verwaltet und den gesamten Workflow von Anfang bis Ende orchestriert.</p>
<p>Herkömmliche KI-Codierungs-Workflows generierten in der Regel isolierte Schnipsel, die von den Entwicklern noch manuell überprüft, integriert, debuggt und ausgeführt werden mussten. Antigravity ändert diese Dynamik. Sie können einfach eine Aufgabe beschreiben - z. B. <em>"Erstellen Sie ein einfaches Haustier-Interaktionsspiel</em> " - und das System zerlegt die Anfrage, generiert den Code, führt Terminalbefehle aus, öffnet einen Browser, um das Ergebnis zu testen, und iteriert, bis es funktioniert. Damit wird die KI von einer passiven Autovervollständigungsmaschine zu einem aktiven Entwicklungspartner, der Ihre Vorlieben lernt und sich mit der Zeit an Ihren persönlichen Entwicklungsstil anpasst.</p>
<p>Die Vorstellung, dass ein Agent direkt mit einer Datenbank zusammenarbeitet, ist nicht weit hergeholt. Mit einem Toolaufruf über MCP könnte eine KI schließlich aus einer Milvus-Datenbank lesen, eine Wissensdatenbank zusammenstellen und sogar ihre eigene Abrufpipeline autonom verwalten. In vielerlei Hinsicht ist diese Veränderung sogar noch bedeutsamer als das Modell-Upgrade selbst: Sobald eine KI in der Lage ist, eine Beschreibung auf Produktebene in eine Abfolge von ausführbaren Aufgaben umzuwandeln, verlagert sich der menschliche Aufwand ganz natürlich auf die Definition von Zielen, Einschränkungen und die Frage, wie "Korrektheit" aussieht - das Denken auf höherer Ebene, das die Produktentwicklung wirklich vorantreibt.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Bereit zur Entwicklung?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie bereit sind, es auszuprobieren, folgen Sie unserem Schritt-für-Schritt-Tutorial und erstellen Sie noch heute ein RAG-System mit <strong>Gemini 3 Pro + Milvus</strong>.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige persönliche Sitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen durch<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>

---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  vLLM Semantic Router + Milvus: Wie semantisches Routing und Caching
  skalierbare KI-Systeme auf intelligente Weise aufbauen
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Erfahren Sie, wie vLLM, Milvus und semantisches Routing die Inferenz großer
  Modelle optimieren, die Rechenkosten senken und die KI-Leistung in
  skalierbaren Implementierungen steigern.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>Die meisten KI-Anwendungen verlassen sich auf ein einziges Modell für jede Anfrage. Doch dieser Ansatz stößt schnell an seine Grenzen. Große Modelle sind leistungsstark, aber teuer, selbst wenn sie für einfache Abfragen verwendet werden. Kleinere Modelle sind billiger und schneller, können aber keine komplexen Schlussfolgerungen ziehen. Wenn der Datenverkehr in die Höhe schießt - z. B. wenn Ihre KI-Anwendung über Nacht plötzlich zehn Millionen Nutzer hat - wird die Ineffizienz dieses "Ein-Modell-für-alle"-Ansatzes schmerzlich deutlich. Die Latenzzeiten schnellen in die Höhe, die Rechnungen für die Grafikprozessoren explodieren und das Modell, das gestern noch einwandfrei lief, schnappt nach Luft.</p>
<p>Und <em>Sie</em>, mein Freund, der Ingenieur hinter dieser Anwendung, müssen das Problem lösen - und zwar schnell.</p>
<p>Stellen Sie sich vor, Sie könnten mehrere Modelle unterschiedlicher Größe bereitstellen und Ihr System würde automatisch das beste Modell für jede Anfrage auswählen. Einfache Aufforderungen werden an kleinere Modelle weitergeleitet, komplexe Anfragen an größere. Das ist die Idee hinter dem <a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router - einem</strong></a>Routing-Mechanismus, der Anfragen auf der Grundlage der Bedeutung und nicht der Endpunkte weiterleitet. Er analysiert den semantischen Inhalt, die Komplexität und die Absicht jeder Eingabe, um das am besten geeignete Sprachmodell auszuwählen und sicherzustellen, dass jede Anfrage von dem Modell bearbeitet wird, das am besten dafür geeignet ist.</p>
<p>Um dies noch effizienter zu gestalten, arbeitet der Semantic Router mit <a href="https://milvus.io/"><strong>Milvus</strong></a> zusammen, einer Open-Source-Vektordatenbank, die als <strong>semantische Cache-Schicht</strong> dient. Bevor eine Antwort neu berechnet wird, prüft er, ob eine semantisch ähnliche Anfrage bereits bearbeitet wurde, und ruft, falls dies der Fall ist, sofort das Ergebnis aus dem Cache ab. Das Ergebnis: schnellere Antworten, geringere Kosten und ein Abfragesystem, das intelligent und nicht verschwenderisch skaliert.</p>
<p>In diesem Beitrag gehen wir näher darauf ein, wie der <strong>vLLM Semantic Router</strong> funktioniert, wie <strong>Milvus</strong> seine Caching-Schicht betreibt und wie diese Architektur in realen KI-Anwendungen eingesetzt werden kann.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">Was ist ein semantischer Router?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Kern ist ein <strong>Semantischer Router</strong> ein System, das anhand der Bedeutung, Komplexität und Absicht einer Anfrage entscheidet <em>, welches Modell</em> diese bearbeiten soll. Anstatt alles an ein Modell weiterzuleiten, verteilt es Anfragen auf intelligente Weise auf mehrere Modelle, um Genauigkeit, Latenz und Kosten auszugleichen.</p>
<p>Die Architektur basiert auf drei Schlüsselebenen: <strong>Semantisches Routing</strong>, <strong>Mixture of Models (MoM)</strong> und eine <strong>Cache-Schicht</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Semantische Routing-Schicht</h3><p>Die <strong>semantische Routing-Schicht</strong> ist das Gehirn des Systems. Sie analysiert jede Eingabe - was sie verlangt, wie komplex sie ist und welche Art von Schlussfolgerungen sie erfordert - um das für die Aufgabe am besten geeignete Modell auszuwählen. So kann beispielsweise eine einfache Faktenabfrage an ein einfaches Modell gehen, während eine mehrstufige Schlussfolgerungsabfrage an ein größeres Modell weitergeleitet wird. Durch dieses dynamische Routing bleibt das System auch bei steigendem Datenverkehr und zunehmender Abfragevielfalt reaktionsfähig.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">Die Mixture of Models (MoM) Schicht</h3><p>Die zweite Schicht, die <strong>Mischung von Modellen (Mixture of Models, MoM)</strong>, integriert mehrere Modelle unterschiedlicher Größe und Fähigkeiten in ein einheitliches System. Sie lehnt sich an die <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)-Architektur</strong> an, aber anstatt "Experten" innerhalb eines einzigen großen Modells auszuwählen, arbeitet sie mit mehreren unabhängigen Modellen. Dieses Design reduziert die Latenzzeit, senkt die Kosten und vermeidet die Bindung an einen einzigen Modellanbieter.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">Die Cache-Schicht: Wo Milvus den Unterschied macht</h3><p>Schließlich <a href="https://milvus.io/">fungiert</a>die <strong>Cache-Schicht, die</strong>von der <a href="https://milvus.io/">Milvus Vector Database</a> <strong>betrieben wird</strong>, als Speicher des Systems. Bevor eine neue Abfrage ausgeführt wird, prüft sie, ob eine semantisch ähnliche Anfrage bereits verarbeitet wurde. Ist dies der Fall, wird das Ergebnis sofort aus dem Cache abgerufen, was Rechenzeit spart und den Durchsatz erhöht.</p>
<p>Herkömmliche Caching-Systeme basieren auf speicherinternen Key-Value-Speichern, die Anfragen anhand exakter Zeichenketten oder Vorlagen abgleichen. Das funktioniert gut, wenn sich die Abfragen wiederholen und vorhersehbar sind. Aber echte Benutzer geben selten zweimal dasselbe ein. Sobald sich die Formulierung - auch nur geringfügig - ändert, erkennt der Cache nicht mehr, dass es sich um dieselbe Absicht handelt. Mit der Zeit sinkt die Trefferquote im Cache, und die Leistungsgewinne verschwinden, da die Sprache natürlich abweicht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Um dies zu beheben, brauchen wir einen Cache, der die <em>Bedeutung</em> versteht und nicht nur die passenden Wörter. Hier kommt die <strong>semantische Abfrage</strong> ins Spiel. Anstatt Zeichenketten zu vergleichen, werden Einbettungen verglichen - hochdimensionale Vektordarstellungen, die semantische Ähnlichkeit erfassen. Die Herausforderung ist jedoch der Umfang. Die Durchführung einer Brute-Force-Suche über Millionen oder Milliarden von Vektoren auf einem einzigen Rechner (mit einer Zeitkomplexität von O(N-d)) ist rechnerisch unerschwinglich. Die Speicherkosten explodieren, die horizontale Skalierbarkeit bricht zusammen, und das System hat Schwierigkeiten, plötzliche Verkehrsspitzen oder lange Abfragen zu bewältigen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Als verteilte Vektordatenbank, die speziell für die groß angelegte semantische Suche entwickelt wurde, bietet <strong>Milvus</strong> die horizontale Skalierbarkeit und Fehlertoleranz, die diese Cache-Schicht benötigt. Milvus speichert Einbettungen effizient über alle Knoten hinweg und führt ANN-Suchen ( <a href="https://zilliz.com/blog/ANN-machine-learning">Approximate Nearest Neighbor</a>) mit minimaler Latenz durch, selbst in großem Maßstab. Mit den richtigen Ähnlichkeitsschwellenwerten und Fallback-Strategien sorgt Milvus für eine stabile, vorhersehbare Leistung und verwandelt die Cache-Schicht in einen belastbaren semantischen Speicher für Ihr gesamtes Routing-System.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Wie Entwickler Semantic Router + Milvus in der Produktion einsetzen<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Kombination aus <strong>vLLM Semantic Router</strong> und <strong>Milvus</strong> bewährt sich in realen Produktionsumgebungen, in denen Geschwindigkeit, Kosten und Wiederverwendbarkeit eine Rolle spielen.</p>
<p>Drei häufige Szenarien stechen hervor:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Kundenservice Q&amp;A</h3><p>Bots mit Kundenkontakt bearbeiten täglich große Mengen sich wiederholender Anfragen - Passwortrücksetzungen, Kontoaktualisierungen, Lieferstatus. Dieser Bereich ist sowohl kosten- als auch latenzempfindlich und damit ideal für semantisches Routing. Der Router sendet Routinefragen an kleinere, schnellere Modelle und leitet komplexe oder mehrdeutige Fragen an größere Modelle weiter, die dann tiefergehende Überlegungen anstellen. In der Zwischenzeit speichert Milvus frühere Frage-Antwort-Paare, so dass das System beim Auftreten ähnlicher Anfragen sofort frühere Antworten wiederverwenden kann, anstatt sie neu zu generieren.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Code-Unterstützung</h3><p>In Entwicklertools oder IDE-Assistenten überschneiden sich viele Abfragen - Syntaxhilfe, API-Suche, kleine Debugging-Hinweise. Durch Analyse der semantischen Struktur jeder Eingabeaufforderung wählt der Router dynamisch eine geeignete Modellgröße aus: leichtgewichtig für einfache Aufgaben, leistungsfähiger für mehrstufige Schlussfolgerungen. Milvus steigert die Reaktionsfähigkeit weiter, indem es ähnliche Codierungsprobleme und deren Lösungen speichert und frühere Benutzerinteraktionen in eine wiederverwendbare Wissensbasis verwandelt.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Wissensdatenbank für Unternehmen</h3><p>Unternehmensanfragen neigen dazu, sich im Laufe der Zeit zu wiederholen - Nachschlagen von Richtlinien, Verweise auf die Einhaltung von Vorschriften, Produkt-FAQs. Mit Milvus als semantischer Cache-Schicht können häufig gestellte Fragen und deren Antworten effizient gespeichert und abgerufen werden. Dadurch werden redundante Berechnungen minimiert und die Antworten bleiben über Abteilungen und Regionen hinweg konsistent.</p>
<p>Unter der Haube ist die <strong>Semantic Router + Milvus-Pipeline</strong> in <strong>Go</strong> und <strong>Rust</strong> implementiert, um hohe Leistung und niedrige Latenzzeiten zu gewährleisten. Sie ist in die Gateway-Schicht integriert und überwacht kontinuierlich wichtige Metriken wie Trefferquoten, Routing-Latenz und Modellleistung, um die Routing-Strategien in Echtzeit zu optimieren.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Schnelles Testen des semantischen Cachings im Semantic Router<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor Sie das semantische Caching in großem Umfang einsetzen, sollten Sie sein Verhalten in einer kontrollierten Umgebung testen. In diesem Abschnitt führen wir einen schnellen lokalen Test durch, der zeigt, wie der Semantic Router <strong>Milvus</strong> als semantischen Cache verwendet. Sie werden sehen, wie ähnliche Abfragen sofort in den Cache gelangen, während neue oder andere Abfragen die Modellerstellung auslösen - ein Beweis für die Caching-Logik in Aktion.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><ul>
<li>Container-Umgebung: Docker + Docker Compose</li>
<li>Vektor-Datenbank: Milvus-Dienst</li>
<li>LLM + Einbettung: Lokal heruntergeladenes Projekt</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1. die Milvus-Vektor-Datenbank bereitstellen</h3><p>Laden Sie die Bereitstellungsdateien herunter</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Starten Sie den Milvus-Dienst.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Klonen Sie das Projekt</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Lokale Modelle herunterladen</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Änderungen an der Konfiguration</h3><p>Hinweis: Ändern Sie den Typ semantic_cache auf milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ändern Sie die Mmilvus-Konfiguration Hinweis: Füllen Sie den soeben eingerichteten Milvusmilvus-Dienst aus</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Starten Sie das Projekt</h3><p>Hinweis: Es wird empfohlen, einige Dockerfile-Abhängigkeiten zu inländischen Quellen zu ändern.</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Testanfragen</h3><p>Hinweis: Insgesamt zwei Anfragen (kein Cache und Cache-Treffer) Erste Anfrage:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Zweite Anfrage:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Ausgabe:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Dieser Test demonstriert das semantische Caching des Semantic Router in Aktion. Durch die Nutzung von Milvus als Vektordatenbank werden semantisch ähnliche Anfragen effizient abgeglichen, wodurch sich die Antwortzeiten verbessern, wenn Benutzer die gleichen oder ähnliche Fragen stellen.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Da KI-Workloads wachsen und eine Kostenoptimierung unerlässlich wird, bietet die Kombination aus vLLM Semantic Router und <a href="https://milvus.io/">Milvus</a> eine praktische Möglichkeit zur intelligenten Skalierung. Durch die Weiterleitung jeder Anfrage an das richtige Modell und die Zwischenspeicherung semantisch ähnlicher Ergebnisse mit einer verteilten Vektordatenbank senkt dieses Setup den Rechen-Overhead und sorgt gleichzeitig für schnelle und konsistente Antworten in verschiedenen Anwendungsfällen.</p>
<p>Kurz gesagt, Sie erhalten eine intelligentere Skalierung - weniger rohe Gewalt, mehr Köpfchen.</p>
<p>Wenn Sie dies weiter erforschen möchten, nehmen Sie an der Konversation in unserem <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord</a> teil oder öffnen Sie ein Issue auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus-Sprechstunde</a> buchen, in der Sie persönliche Beratung, Einblicke und technische Details vom Milvus-Team erhalten.</p>

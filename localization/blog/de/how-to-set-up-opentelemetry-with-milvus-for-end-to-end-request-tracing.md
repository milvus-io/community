---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: Einrichten von OpenTelemetry mit Milvus für End-to-End Request Tracing
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  Überwachen Sie die Leistung der Milvus-Vektor-Datenbank mit
  OpenTelemetry-Tracing. Vollständiges Tutorial mit Docker-Setup, Python-Client,
  Jaeger-Visualisierung und Debugging-Tipps.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Entwicklung von KI-gestützten Anwendungen mit <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbanken</a> wird das Verständnis der Systemleistung mit zunehmender Skalierung der Anwendung immer wichtiger. Eine einzige Suchanfrage kann mehrere interne Vorgänge auslösen - Vektorindizierung, Ähnlichkeitsberechnungen und Datenabrufe - und das über verschiedene Komponenten hinweg. Ohne eine angemessene Beobachtungsmöglichkeit wird die Diagnose von Verlangsamungen oder Fehlern zur Suche nach der Nadel im Heuhaufen.</p>
<p><strong>Verteiltes Tracing</strong> löst dieses Problem, indem es Anfragen verfolgt, während sie durch Ihr System fließen, und Ihnen so ein vollständiges Bild davon vermittelt, was unter der Haube passiert.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a> ist ein quelloffenes Observability-Framework, das von der <a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a> unterstützt wird und Sie bei der Erfassung von Traces, Metriken und Protokollen Ihrer Anwendungen unterstützt. Es ist herstellerneutral, weit verbreitet und arbeitet nahtlos mit gängigen Überwachungstools zusammen.</p>
<p>In diesem Leitfaden zeigen wir Ihnen, wie Sie <a href="https://milvus.io/"><strong>Milvus</strong></a>, einer leistungsstarken Vektordatenbank, die für KI-Anwendungen entwickelt wurde, End-to-End-Tracing hinzufügen. Sie werden lernen, alles von Client-Anfragen bis hin zu internen Datenbankoperationen zu verfolgen, was die Leistungsoptimierung und Fehlersuche erheblich erleichtert.</p>
<p>Außerdem werden wir <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> einsetzen, um die Trace-Daten zu visualisieren und Ihnen einen umfassenden Einblick in Ihre Vektordatenbankoperationen zu geben.</p>
<h2 id="What-Well-Build" class="common-anchor-header">Was wir bauen werden<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Am Ende dieses Tutorials werden Sie eine komplette Tracing-Pipeline haben, bestehend aus:</p>
<ol>
<li><p><strong>Milvus-Vektordatenbank</strong> mit aktiviertem OpenTelemetry-Tracing</p></li>
<li><p><strong>Jaeger</strong> für die Visualisierung und Analyse von Traces</p></li>
<li><p><strong>Einem Python-Client</strong>, der automatisch alle Milvus-Operationen verfolgt</p></li>
<li><p><strong>End-to-End-Sichtbarkeit</strong> von Client-Anfragen bis zu Datenbankoperationen</p></li>
</ol>
<p>Geschätzte Einrichtungszeit: 15-20 Minuten</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">Schnellstart (5 Minuten)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Möchten Sie zuerst sehen, wie es funktioniert? Hier ist der schnellste Weg:</p>
<ol>
<li>Klonen Sie das Demo-Repository:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Starten Sie die Dienste:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Warten Sie 30 Sekunden, dann überprüfen Sie die Jaeger-Benutzeroberfläche unter: <code translate="no">http://localhost:16686</code></p></li>
<li><p>Führen Sie das Python-Beispiel aus:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Aktualisieren Sie Jaeger und suchen Sie nach Traces von den Diensten <code translate="no">standalone</code> (Milvus) und <code translate="no">milvus-client</code>.</li>
</ol>
<p>Wenn Sie Spuren sehen, funktioniert alles! Nun wollen wir verstehen, wie das alles zusammenpasst.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Einrichtung der Umgebung<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier ist, was Sie brauchen:</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (Vektor-Datenbank)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (Visualisierung von Spuren)</p></li>
<li><p><strong>Python 3.7+</strong> (Client-Entwicklung)</p></li>
<li><p><strong>Docker und Docker Compose</strong> (Container-Orchestrierung)</p></li>
</ul>
<p>Diese Versionen wurden zusammen getestet; neuere Versionen sollten jedoch ebenfalls problemlos funktionieren.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Einrichten von Milvus und Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir werden Docker Compose verwenden, um beide Dienste mit der richtigen Vernetzung und Konfiguration auszuführen.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Docker Compose-Konfiguration</h3><p>Erstellen Sie eine <code translate="no">docker-compose.yaml</code> Datei:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hinweis:</strong> Beispielkonfigurationsdateien <code translate="no">embedEtcd.yaml</code> und <code translate="no">milvus.yaml</code> finden Sie unter: <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Milvus-Verfolgungskonfiguration</h3><p>Erstellen Sie <code translate="no">configs/milvus.yaml</code> mit der Tracing-Konfiguration:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>Konfiguration erklärt:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> verfolgt jede Anfrage (nützlich für die Entwicklung, aber verwenden Sie 0.1 oder niedriger in der Produktion)</p></li>
<li><p><code translate="no">secure: false</code> Deaktiviert TLS (in der Produktion aktivieren)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> verwendet den Docker-Dienstnamen für die interne Kommunikation</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">Starten der Dienste</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Überprüfen der Trace-Übertragung von Milvus zu Jaeger</h3><p>Sobald die Dienste laufen, können Sie überprüfen, ob die Trace-Daten von Milvus Standalone gesendet und von Jaeger empfangen werden.</p>
<ul>
<li><p>Öffnen Sie Ihren Browser und besuchen Sie die Jaeger-Benutzeroberfläche unter: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>Wählen Sie in der <strong>Suchleiste</strong> (oben links) das Dropdown-Menü <strong>Service</strong> und wählen Sie <code translate="no">standalone</code>. Wenn Sie <code translate="no">standalone</code> in der Serviceliste sehen, bedeutet dies, dass die integrierte OpenTelemetry-Konfiguration von Milvus funktioniert und erfolgreich Trace-Daten an Jaeger übertragen hat.</p></li>
<li><p>Klicken Sie auf <strong>Find Traces</strong>, um Trace-Ketten zu untersuchen, die von internen Milvus-Komponenten generiert werden (z. B. gRPC-Interaktionen zwischen Modulen).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">Wenn keine Trace-Daten angezeigt werden:</h3><ul>
<li><p>Vergewissern Sie sich, dass der <code translate="no">trace</code> -Block in <code translate="no">milvus.yaml</code> richtig konfiguriert ist und dass Jaeger ohne Probleme läuft.</p></li>
<li><p>Überprüfen Sie die Protokolle des Milvus-Containers, um festzustellen, ob es Fehler im Zusammenhang mit der Trace-Initialisierung gibt.</p></li>
<li><p>Warten Sie ein paar Sekunden und aktualisieren Sie die Jaeger-Benutzeroberfläche; die Trace-Berichterstattung kann eine kurze Verzögerung aufweisen.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Python-Client-Einrichtung und Abhängigkeiten<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns nun den Python-Client einrichten, um alle Milvus-Vorgänge automatisch zu verfolgen.</p>
<p>Erstellen Sie zunächst eine <code translate="no">requirements.txt</code> Datei:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>Installieren Sie dann die Abhängigkeiten über:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>Dadurch wird sichergestellt, dass Ihre Python-Umgebung für die Verfolgung von gRPC-Aufrufen an das Milvus-Backend bereit ist.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Initialisierung von OpenTelemetry in Python<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Konfigurieren wir nun das Tracing innerhalb Ihrer Python-Anwendung. Dieses Snippet richtet OTEL mit gRPC-Instrumentierung ein und bereitet einen Tracer vor.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>Hier klinkt sich <code translate="no">GrpcInstrumentorClient()</code> in den zugrundeliegenden gRPC-Stack ein, so dass Sie den Client-Code für die Instrumentierung nicht manuell ändern müssen. Die <code translate="no">OTLPSpanExporter()</code> ist so konfiguriert, dass sie Trace-Daten an Ihre lokale Jaeger-Instanz sendet.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">Vollständiges Milvus-Python-Beispiel mit Tracing<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns nun ein umfassendes Beispiel erstellen, das das Tracing mit realistischen Milvus-Operationen demonstriert:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">Anzeigen der Trace-Ausgabe<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald Ihr Python-Client Trace-Daten sendet, kehren Sie zu Jaeger zurück: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>Wählen Sie den Dienst <code translate="no">milvus-client</code>, um die Trace-Spannen anzuzeigen, die den Milvus-Operationen Ihres Python-Clients entsprechen. Dies macht es viel einfacher, die Leistung zu analysieren und Interaktionen über Systemgrenzen hinweg zu verfolgen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">Beispiele in anderen Sprachen<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben Python können Sie Milvus-Tracing auch in anderen Sprachen implementieren:</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>: Verwenden Sie den OpenTelemetry-Java-Agenten für Zero-Code-Instrumentierung <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: Nutzen Sie das OpenTelemetry Go SDK für native Integration 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: Auto-Instrumentierung von gRPC-Aufrufen mit dem JavaScript-SDK</p>
<p>Jedes Beispiel folgt ähnlichen Mustern, verwendet aber sprachspezifische OpenTelemetry-Bibliotheken.</p>
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
    </button></h2><p>Sie haben erfolgreich End-to-End-Tracing für Milvus-Operationen implementiert! Hier ist, was Sie erreicht haben:</p>
<ul>
<li><p>✅ <strong>Infrastruktur</strong>: Einrichten von Milvus und Jaeger mit dem richtigen Netzwerk</p></li>
<li><p>✅ <strong>Serverseitige Verfolgung</strong>: Milvus für den automatischen Export von Traces konfiguriert</p></li>
<li><p>✅ <strong>Client-seitige Rückverfolgung</strong>: Instrumentierter Python-Client mit OpenTelemetry</p></li>
<li><p>✅ <strong>Visualisierung</strong>: Verwendung von Jaeger zur Analyse der Systemleistung</p></li>
<li><p>✅ <strong>Produktionsreife</strong>: Erlernen von Best Practices für die Konfiguration</p></li>
</ul>
<p>Das alles funktioniert ohne Änderungen am Quellcode des Milvus SDK. Nur ein paar Konfigurationseinstellungen und Ihre Tracing-Pipeline ist live - einfach, effektiv und produktionsreif.</p>
<p>Sie können noch weiter gehen, indem Sie Protokolle und Metriken integrieren, um eine vollständige Überwachungslösung für Ihre KI-native Vektordatenbank bereitzustellen.</p>
<h2 id="Learn-More" class="common-anchor-header">Erfahren Sie mehr<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Milvus-Dokumentation: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry für Python: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Jaeger-Dokumentation: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Milvus OpenTelemetry Integrations-Demo (Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>

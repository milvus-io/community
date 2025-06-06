---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: >-
  Come configurare OpenTelemetry con Milvus per il tracciamento delle richieste
  end-to-end
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  Monitorare le prestazioni del database vettoriale Milvus con il tracciamento
  di OpenTelemetry. Tutorial completo con impostazione di Docker, client Python,
  visualizzazione Jaeger e suggerimenti per il debug.
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
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si realizzano applicazioni AI con <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vettoriali</a>, la comprensione delle prestazioni del sistema diventa fondamentale man mano che l'applicazione scala. Una singola richiesta di ricerca può innescare più operazioni interne di indicizzazione vettoriale, calcolo della similarità e recupero dei dati, attraverso diversi componenti. Senza un'adeguata osservabilità, diagnosticare rallentamenti o guasti diventa come trovare un ago in un pagliaio.</p>
<p>Il<strong>tracciamento distribuito</strong> risolve questo problema tracciando le richieste mentre scorrono nel sistema, fornendo un quadro completo di ciò che accade sotto il cofano.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a> è un framework di osservabilità open-source sostenuto dalla <a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF)</a> che aiuta a raccogliere tracce, metriche e log dalle applicazioni. È neutrale rispetto ai fornitori, ampiamente adottato e funziona perfettamente con i più diffusi strumenti di monitoraggio.</p>
<p>In questa guida vi mostreremo come aggiungere il tracciamento end-to-end a <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale ad alte prestazioni costruito per le applicazioni AI. Imparerete a tracciare tutto, dalle richieste dei clienti alle operazioni interne del database, rendendo molto più semplice l'ottimizzazione delle prestazioni e il debugging.</p>
<p>Utilizzeremo anche <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> per visualizzare i dati di tracciamento, fornendovi potenti informazioni sulle operazioni del vostro database vettoriale.</p>
<h2 id="What-Well-Build" class="common-anchor-header">Cosa costruiremo<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Alla fine di questo tutorial, avrete una pipeline di tracciamento completa composta da:</p>
<ol>
<li><p><strong>database vettoriale Milvus</strong> con tracciatura OpenTelemetry abilitata</p></li>
<li><p><strong>Jaeger</strong> per la visualizzazione e l'analisi delle tracce</p></li>
<li><p><strong>un client Python</strong> che traccia automaticamente tutte le operazioni di Milvus</p></li>
<li><p><strong>Visibilità end-to-end</strong> dalle richieste del client alle operazioni del database</p></li>
</ol>
<p>Tempo di configurazione stimato: 15-20 minuti</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">Avvio rapido (5 minuti)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Volete vedere prima il funzionamento? Ecco il percorso più veloce:</p>
<ol>
<li>Clonare il repository demo:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Avviare i servizi:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Attendere 30 secondi, quindi controllare l'interfaccia utente di Jaeger a: <code translate="no">http://localhost:16686</code></p></li>
<li><p>Eseguire l'esempio Python:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Aggiornare Jaeger e cercare tracce da entrambi i servizi <code translate="no">standalone</code> (Milvus) e <code translate="no">milvus-client</code>.</li>
</ol>
<p>Se si vedono tracce, tutto funziona! Ora cerchiamo di capire come tutto questo si combina.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Configurazione dell'ambiente<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco cosa vi serve:</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (database vettoriale)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (visualizzazione delle tracce)</p></li>
<li><p><strong>Python 3.7+</strong> (sviluppo client)</p></li>
<li><p><strong>Docker e Docker Compose</strong> (orchestrazione di container)</p></li>
</ul>
<p>Queste versioni sono state testate insieme; tuttavia, anche le versioni più recenti dovrebbero funzionare bene.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Impostazione di Milvus e Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizzeremo Docker Compose per eseguire entrambi i servizi con una rete e una configurazione adeguate.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Configurazione di Docker Compose</h3><p>Creare un file <code translate="no">docker-compose.yaml</code>:</p>
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
<p><strong>Nota:</strong> i file di configurazione di esempio <code translate="no">embedEtcd.yaml</code> e <code translate="no">milvus.yaml</code> sono disponibili all'indirizzo: <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Configurazione di Milvus Tracing</h3><p>Creare <code translate="no">configs/milvus.yaml</code> con la configurazione di tracciamento:</p>
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
<p>Configurazione spiegata:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> traccia ogni richiesta (utile per lo sviluppo, ma usare 0.1 o inferiore in produzione)</p></li>
<li><p><code translate="no">secure: false</code> disabilita TLS (abilitato in produzione)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> utilizza il nome del servizio Docker per la comunicazione interna</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">Avviare i servizi</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Verifica della consegna delle tracce da Milvus a Jaeger</h3><p>Una volta che i servizi sono in esecuzione, è possibile verificare se i dati di traccia vengono emessi da Milvus standalone e ricevuti da Jaeger.</p>
<ul>
<li><p>Aprire il browser e visitare l'interfaccia utente di Jaeger all'indirizzo: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>Nel pannello di <strong>ricerca</strong> (in alto a sinistra), scegliere il menu a tendina <strong>Service</strong> e selezionare <code translate="no">standalone</code>. Se si vede <code translate="no">standalone</code> nell'elenco dei servizi, significa che la configurazione OpenTelemetry integrata di Milvus funziona e ha inviato con successo i dati di traccia a Jaeger.</p></li>
<li><p>Fare clic su <strong>Trova tracce</strong> per esplorare le catene di tracce generate dai componenti interni di Milvus (come le interazioni gRPC tra i moduli).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">Se i dati di traccia non vengono visualizzati:</h3><ul>
<li><p>Verificare che il blocco <code translate="no">trace</code> in <code translate="no">milvus.yaml</code> sia configurato correttamente e che Jaeger sia in esecuzione senza problemi.</p></li>
<li><p>Controllare i log del contenitore Milvus per vedere se ci sono errori relativi all'inizializzazione di Trace.</p></li>
<li><p>Attendere qualche secondo e aggiornare l'interfaccia utente di Jaeger; la segnalazione delle tracce potrebbe subire un breve ritardo.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Configurazione del client Python e dipendenze<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora configuriamo il client Python per tracciare automaticamente tutte le operazioni di Milvus.</p>
<p>Per prima cosa, creare un file <code translate="no">requirements.txt</code>:</p>
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
<p>Quindi installare le dipendenze tramite:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>Questo assicura che l'ambiente Python sia pronto per tracciare le chiamate gRPC fatte al backend Milvus.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Inizializzazione di OpenTelemetry in Python<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora configuriamo il tracciamento all'interno dell'applicazione Python. Questo frammento configura OTEL con la strumentazione gRPC e prepara un tracciatore.</p>
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
<p>In questo caso, <code translate="no">GrpcInstrumentorClient()</code> si aggancia allo stack gRPC sottostante, in modo da non dover modificare manualmente il codice client per la strumentazione. <code translate="no">OTLPSpanExporter()</code> è configurato per inviare i dati di tracciamento all'istanza locale di Jaeger.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">Esempio completo di Milvus Python con tracciamento<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora creiamo un esempio completo che dimostri il tracciamento con operazioni realistiche di Milvus:</p>
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
<h2 id="Viewing-Trace-Output" class="common-anchor-header">Visualizzazione dell'output di tracciamento<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta che il client Python ha inviato i dati di tracciamento, tornare a Jaeger: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>Selezionare il servizio <code translate="no">milvus-client</code> per visualizzare gli intervalli di tracciamento che corrispondono alle operazioni di Milvus del client Python. In questo modo è molto più facile analizzare le prestazioni e tracciare le interazioni tra i confini del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">Esempi in altri linguaggi<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Oltre a Python, è possibile implementare il tracciamento di Milvus in altri linguaggi:</p>
<p><a href="https://github.com/topikachu/milvus-java-otel"><strong>👉Java</strong></a>: Utilizzare l'agente OpenTelemetry Java per la strumentazione zero-code <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: Sfruttare l'SDK OpenTelemetry Go per l'integrazione nativa 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: Strumentazione automatica delle chiamate gRPC con l'SDK JavaScript</p>
<p>Ogni esempio segue schemi simili, ma utilizza librerie OpenTelemetry specifiche per il linguaggio.</p>
<h2 id="Summary" class="common-anchor-header">Riepilogo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Avete implementato con successo il tracciamento end-to-end delle operazioni di Milvus! Ecco cosa avete ottenuto:</p>
<ul>
<li><p>✅ <strong>Infrastruttura</strong>: Configurazione di Milvus e Jaeger con una rete adeguata.</p></li>
<li><p><strong>✅ Tracciamento lato server</strong>: Configurato Milvus per esportare automaticamente le tracce</p></li>
<li><p>✅ <strong>Tracciamento lato client</strong>: Strumentalizzazione del client Python con OpenTelemetry</p></li>
<li><p>✅ <strong>Visualizzazione</strong>: Utilizzato Jaeger per analizzare le prestazioni del sistema</p></li>
<li><p><strong>Preparazione alla produzione</strong>: Imparato le migliori pratiche di configurazione</p></li>
</ul>
<p>Il tutto funziona senza alcuna modifica al codice sorgente dell'SDK Milvus. Bastano poche impostazioni di configurazione e la pipeline di tracciamento è pronta: semplice, efficace e pronta per la produzione.</p>
<p>È possibile andare oltre integrando log e metriche per creare una soluzione di monitoraggio completa per la distribuzione di database vettoriali AI-nativi.</p>
<h2 id="Learn-More" class="common-anchor-header">Per saperne di più<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Documentazione Milvus: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry per Python: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Documentazione di Jaeger: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Demo dell'integrazione di Milvus OpenTelemetry (Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
